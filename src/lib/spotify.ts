// Spotify integration — PKCE OAuth + Web API + Web Playback SDK
// No client secret needed in frontend (PKCE is safe for SPAs)

const CLIENT_ID   = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function randomBase64(len: number): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function sha256Base64(plain: string): Promise<string> {
  const enc  = new TextEncoder().encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function redirectToSpotifyLogin(): Promise<void> {
  const verifier  = randomBase64(64);
  const challenge = await sha256Base64(verifier);
  sessionStorage.setItem("spotify_verifier", verifier);

  const params = new URLSearchParams({
    response_type:         "code",
    client_id:             CLIENT_ID,
    scope:                 SCOPES,
    redirect_uri:          REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge:        challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<void> {
  const verifier = sessionStorage.getItem("spotify_verifier") ?? "";

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "authorization_code",
      code,
      redirect_uri:  REDIRECT_URI,
      client_id:     CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) throw new Error("Spotify token exchange failed");

  const data = await res.json() as {
    access_token: string; refresh_token: string; expires_in: number;
  };

  const expiresAt = Date.now() + data.expires_in * 1000;
  localStorage.setItem("spotify_access_token",  data.access_token);
  localStorage.setItem("spotify_refresh_token", data.refresh_token);
  localStorage.setItem("spotify_expires_at",    String(expiresAt));
  sessionStorage.removeItem("spotify_verifier");
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("spotify_refresh_token") ?? "";

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: refreshToken,
      client_id:     CLIENT_ID,
    }),
  });

  if (!res.ok) { clearSpotifyTokens(); throw new Error("Refresh failed"); }

  const data = await res.json() as { access_token: string; expires_in: number; refresh_token?: string };
  const expiresAt = Date.now() + data.expires_in * 1000;
  localStorage.setItem("spotify_access_token", data.access_token);
  localStorage.setItem("spotify_expires_at",   String(expiresAt));
  if (data.refresh_token) localStorage.setItem("spotify_refresh_token", data.refresh_token);
  return data.access_token;
}

export function getSpotifyToken(): string | null {
  return localStorage.getItem("spotify_access_token");
}

export function isSpotifyConnected(): boolean {
  const token     = localStorage.getItem("spotify_access_token");
  const expiresAt = Number(localStorage.getItem("spotify_expires_at") ?? 0);
  return !!token && Date.now() < expiresAt;
}

export function clearSpotifyTokens(): void {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_expires_at");
}

async function getValidToken(): Promise<string> {
  const expiresAt = Number(localStorage.getItem("spotify_expires_at") ?? 0);
  if (Date.now() > expiresAt - 60_000) return refreshAccessToken();
  return localStorage.getItem("spotify_access_token") ?? "";
}

// Alias exported for Web Playback SDK getOAuthToken callback
export const getValidTokenForSDK = getValidToken;

// ── Web API ───────────────────────────────────────────────────────────────────

async function spotifyFetch<T>(path: string): Promise<T> {
  const token = await getValidToken();
  const res   = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify API ${res.status}`);
  return res.json() as Promise<T>;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  explicit: boolean;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number }[];
  };
  preview_url: string | null;
}

interface SearchResult {
  tracks: { items: SpotifyTrack[] };
}

export async function searchSpotify(query: string): Promise<SpotifyTrack[]> {
  const q   = encodeURIComponent(query);
  const res = await spotifyFetch<SearchResult>(`/search?q=${q}&type=track&limit=20`);
  return res.tracks.items;
}

interface FeaturedPlaylists {
  playlists: { items: SpotifyPlaylist[] };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
  uri: string;
}

export async function getFeaturedPlaylists(): Promise<SpotifyPlaylist[]> {
  const res = await spotifyFetch<FeaturedPlaylists>("/browse/featured-playlists?limit=12");
  return res.playlists.items;
}

interface PlaylistTracks {
  items: { track: SpotifyTrack }[];
}

export async function getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
  const res = await spotifyFetch<PlaylistTracks>(`/playlists/${playlistId}/tracks?limit=30`);
  return res.items.map(i => i.track).filter(Boolean);
}

interface NewReleases {
  albums: { items: SpotifyAlbum[] };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  images: { url: string }[];
  release_date: string;
}

export async function getNewReleases(): Promise<SpotifyAlbum[]> {
  const res = await spotifyFetch<NewReleases>("/browse/new-releases?limit=12&country=IN");
  return res.albums.items;
}

export async function getRecommendations(seedGenres: string): Promise<SpotifyTrack[]> {
  const res = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/recommendations?seed_genres=${seedGenres}&limit=20&market=IN`
  );
  return res.tracks;
}

// ── Format helpers ────────────────────────────────────────────────────────────

export function msToTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function trackCover(track: SpotifyTrack): string {
  return track.album.images[0]?.url ?? `https://picsum.photos/seed/${track.id}/300/300`;
}

// ── Web Playback SDK ──────────────────────────────────────────────────────────

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

export interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, cb: (data: unknown) => void): void;
  removeListener(event: string): void;
  getCurrentState(): Promise<SpotifyPlayerState | null>;
  setVolume(v: number): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  togglePlay(): Promise<void>;
  seek(ms: number): Promise<void>;
  previousTrack(): Promise<void>;
  nextTrack(): Promise<void>;
}

export interface SpotifyPlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      id: string; name: string; uri: string;
      artists: { name: string }[];
      album: { name: string; images: { url: string }[] };
      duration_ms: number;
    };
  };
}

let sdkLoaded = false;

export function loadSpotifySDK(): Promise<void> {
  if (sdkLoaded) return Promise.resolve();
  sdkLoaded = true;
  return new Promise((resolve) => {
    window.onSpotifyWebPlaybackSDKReady = resolve;
    const script = document.createElement("script");
    script.src   = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.head.appendChild(script);
  });
}

export async function playSpotifyTrack(deviceId: string, uri: string): Promise<void> {
  const token = await getValidToken();
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method:  "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ uris: [uri] }),
  });
}
