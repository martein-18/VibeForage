import { createContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { Song, songs, Playlist, JournalEntry } from "../data/songs";
import { supabase } from "../lib/supabase";
import { loadYouTubeAPI, createYTPlayer, secsToTime } from "../lib/youtube";
import type { YTPlayer } from "../lib/youtube";
import {
  isSpotifyConnected, loadSpotifySDK, playSpotifyTrack,
  getValidTokenForSDK, SpotifyPlayer, SpotifyPlayerState,
} from "../lib/spotify";

// Unified track — local Song or a Spotify track
export interface SpotifyTrackMeta {
  source: "spotify";
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  uri: string;
  duration: string;
}
export type UnifiedTrack = (Song & { source?: "local" }) | SpotifyTrackMeta;

export type VibeMode = "vibe" | "memory" | "future";

interface AppContextType {
  session: Session | null;
  user: User | null;
  userProfile: { name: string } | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  authLoading: boolean;
  // Local playback
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  playVariant: (audioUrl: string, meta: { title: string; artist: string; cover: string; genre: string }) => void;
  playSongBySearch: (query: string, meta: { title: string; artist: string; cover: string; genre: string }) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  progress: number;
  currentTime: string;
  duration: string;
  seekTo: (pct: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  // Unified playback (local + Spotify)
  currentTrack: UnifiedTrack | null;
  playUnified: (track: UnifiedTrack) => void;
  // Spotify SDK (global)
  spotifyPlayer: SpotifyPlayer | null;
  spotifyDeviceId: string;
  spotifyState: SpotifyPlayerState | null;
  spotifyVolume: number;
  setSpotifyVolume: (v: number) => void;
  spotifyConnected: boolean;
  playlists: Playlist[];
  savePlaylist: (p: Playlist) => void;
  deletePlaylist: (id: string) => void;
  journalEntries: JournalEntry[];
  saveJournalEntry: (e: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  screen: string;
  setScreen: (s: string) => void;
  vibeOrbOpen: boolean;
  setVibeOrbOpen: (open: boolean) => void;
  vibeOrbPrefill: string;
  setVibeOrbPrefill: (prefill: string) => void;
  vibeOrbMode: VibeMode;
  setVibeOrbMode: (mode: VibeMode) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

function nameFromUser(user: User): string {
  return (
    (user.user_metadata as Record<string, string> | undefined)?.name ||
    user.email?.split("@")[0] ||
    "User"
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession]       = useState<Session | null>(null);
  const [user, setUser]             = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [progress, setProgress]       = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration]       = useState("0:00");
  const [volume, setVolume]           = useState(70);
  const ytPlayerRef   = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentSongRef = useRef<Song | null>(null);
  const variantAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef<boolean>(false);

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const stored = localStorage.getItem("vibeforge_playlists");
      return stored ? (JSON.parse(stored) as Playlist[]) : [];
    } catch { return []; }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem("vibeforge_journal");
      return stored ? (JSON.parse(stored) as JournalEntry[]) : [];
    } catch { return []; }
  });

  const [screen, setScreen]             = useState("home");
  const [vibeOrbOpen, setVibeOrbOpen]   = useState(false);
  const [vibeOrbPrefill, setVibeOrbPrefill] = useState("");
  const [vibeOrbMode, setVibeOrbMode]   = useState<VibeMode>("vibe");

  // Unified current track (local OR Spotify)
  const [currentTrack, setCurrentTrack] = useState<UnifiedTrack | null>(null);

  // Spotify SDK — initialized once globally
  const spotifyPlayerRef = useRef<SpotifyPlayer | null>(null);
  const [spotifyDeviceId, setSpotifyDeviceId] = useState("");
  const [spotifyState, setSpotifyState]       = useState<SpotifyPlayerState | null>(null);
  const [spotifyVolume, setSpotifyVolume]     = useState(0.7);
  const spotifyConnected = isSpotifyConnected();

  useEffect(() => {
    if (!spotifyConnected) return;
    loadSpotifySDK().then(() => {
      const player = new window.Spotify.Player({
        name: "VibeForge",
        volume: 0.7,
        getOAuthToken: (cb) => { void getValidTokenForSDK().then(cb); },
      });
      player.addListener("ready", (data) => {
        setSpotifyDeviceId((data as { device_id: string }).device_id);
      });
      player.addListener("player_state_changed", (state) => {
        if (state) setSpotifyState(state as SpotifyPlayerState);
      });
      player.addListener("not_ready", () => setSpotifyDeviceId(""));
      void player.connect();
      spotifyPlayerRef.current = player;
    });
    return () => { spotifyPlayerRef.current?.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyConnected]);

  // Supabase auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setUserProfile({ name: nameFromUser(s.user) });
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setUserProfile({ name: nameFromUser(s.user) });
      else setUserProfile(null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // YouTube player setup
  const volumeRef = useRef(volume);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => {
    // Create hidden container for YT iframe
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;bottom:-300px;left:-300px;width:200px;height:200px;pointer-events:none;";
    document.body.appendChild(div);
    ytContainerRef.current = div;

    loadYouTubeAPI().then(() => {
      createYTPlayer(
        div,
        (player) => {
          ytPlayerRef.current = player;
          player.setVolume(volumeRef.current);
        },
        (state) => {
          const YT = window.YT.PlayerState;
          if (state === YT.PLAYING) {
            pendingPlayRef.current = false;
            setIsPlaying(true);
            if (progressTimer.current) clearInterval(progressTimer.current);
            progressTimer.current = setInterval(() => {
              const p = ytPlayerRef.current;
              if (!p) return;
              const cur = p.getCurrentTime();
              const dur = p.getDuration();
              if (dur > 0) {
                setProgress((cur / dur) * 100);
                setCurrentTime(secsToTime(cur));
                setDuration(secsToTime(dur));
              }
            }, 500);
          } else if (state === YT.BUFFERING) {
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              try { ytPlayerRef.current?.playVideo(); } catch { /* ignore */ }
            }
          } else if (state === YT.PAUSED) {
            setIsPlaying(false);
            if (progressTimer.current) clearInterval(progressTimer.current);
          } else if (state === YT.ENDED) {
            setIsPlaying(false);
            if (progressTimer.current) clearInterval(progressTimer.current);
            setProgress(0);
            // Auto-advance
            setCurrentSong((prev) => {
              if (!prev) return prev;
              const idx  = songs.findIndex(s => s.id === prev.id);
              const next = songs[(idx + 1) % songs.length];
              currentSongRef.current = next;
              setTimeout(() => {
                const yt = ytPlayerRef.current;
                if (yt) { yt.loadVideoById({ videoId: next.ytId }); }
              }, 100);
              return next;
            });
          }
        },
      );
    });

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
      ytPlayerRef.current?.destroy();
      div.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume to variant audio too
  useEffect(() => {
    ytPlayerRef.current?.setVolume(volume);
    if (variantAudioRef.current) variantAudioRef.current.volume = volume / 100;
  }, [volume]);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ error: string | null }> => {
    if (!name.trim())               return { error: "Name is required" };
    if (!email.trim())              return { error: "Email is required" };
    if (!email.includes("@"))       return { error: "Enter a valid email address" };
    if (password.length < 8)        return { error: "Password must be at least 8 characters" };
    if (!/[A-Z]/.test(password))    return { error: "Password must contain at least one uppercase letter" };
    if (!/[a-z]/.test(password))    return { error: "Password must contain at least one lowercase letter" };
    if (!/[0-9]/.test(password))    return { error: "Password must contain at least one number" };
    if (!/[^A-Za-z0-9]/.test(password)) return { error: "Password must contain at least one special character (!@#$%...)" };

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) {
      if (error.message.includes("already registered")) return { error: "This email is already registered. Try logging in." };
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!email.trim()) return { error: "Email is required" };
    if (!password)     return { error: "Password is required" };

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      if (error.message.includes("Invalid login")) return { error: "Wrong email or password." };
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentSong(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
    ytPlayerRef.current?.stopVideo();
    if (spotifyPlayerRef.current) void spotifyPlayerRef.current.pause().catch(() => {});
    setSpotifyState(null);
  }, []);

  const playSong = useCallback((song: Song) => {
    if (spotifyPlayerRef.current) void spotifyPlayerRef.current.pause().catch(() => {});
    // Stop any variant audio
    if (variantAudioRef.current) { variantAudioRef.current.pause(); variantAudioRef.current.src = ""; variantAudioRef.current = null; }
    setSpotifyState(null);
    setCurrentSong(song);
    currentSongRef.current = song;
    setCurrentTrack({ ...song, source: "local" });
    setProgress(0);
    setCurrentTime("0:00");
    setDuration("0:00");
    const tryPlay = (attempts = 0) => {
      const yt = ytPlayerRef.current;
      if (yt) {
        pendingPlayRef.current = true;
        yt.loadVideoById({ videoId: song.ytId });
      } else if (attempts < 30) {
        setTimeout(() => tryPlay(attempts + 1), 100);
      }
    };
    tryPlay();
  }, []);

  const playVariant = useCallback((audioUrl: string, meta: { title: string; artist: string; cover: string; genre: string }) => {
    // Stop YouTube
    ytPlayerRef.current?.pauseVideo();
    pendingPlayRef.current = false;
    // Stop any previous variant audio
    if (variantAudioRef.current) {
      variantAudioRef.current.pause();
      variantAudioRef.current.src = "";
    }
    // Update display, keep catalog id intact
    setCurrentSong(prev => prev ? { ...prev, title: meta.title, artist: meta.artist, cover: meta.cover } : prev);
    setProgress(0); setCurrentTime("0:00"); setDuration("0:00");
    // Play via plain <audio> — audio only, no video
    const audio = new Audio(audioUrl);
    audio.volume = volumeRef.current / 100;
    variantAudioRef.current = audio;
    audio.addEventListener("timeupdate", () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(secsToTime(audio.currentTime));
        setDuration(secsToTime(audio.duration));
      }
    });
    audio.addEventListener("playing", () => setIsPlaying(true));
    audio.addEventListener("pause",   () => setIsPlaying(false));
    audio.addEventListener("ended",   () => { setIsPlaying(false); setProgress(0); variantAudioRef.current = null; });
    void audio.play();
  }, []);

  const playSongBySearch = useCallback((query: string, meta: { title: string; artist: string; cover: string; genre: string }) => {
    const yt = ytPlayerRef.current;
    if (!yt) return;
    if (spotifyPlayerRef.current) void spotifyPlayerRef.current.pause().catch(() => {});
    setSpotifyState(null);
    const variantSong = {
      id: -1,
      title: meta.title,
      artist: meta.artist,
      album: "Alternate Version",
      duration: "",
      cover: meta.cover,
      genre: meta.genre,
      file: "",
      ytId: "",
    } as unknown as Song;
    setCurrentSong(variantSong);
    currentSongRef.current = variantSong;
    setCurrentTrack({ ...variantSong, source: "local" } as unknown as UnifiedTrack);
    setProgress(0);
    setCurrentTime("0:00");
    setDuration("0:00");
    yt.loadPlaylist({ listType: "search", list: query, index: 0, startSeconds: 0 });
    setTimeout(() => { try { yt.playVideo(); } catch { /* ignore */ } }, 500);
  }, []);

  const playUnified = useCallback((track: UnifiedTrack) => {
    if (track.source === "spotify") {
      // Pause YouTube
      ytPlayerRef.current?.pauseVideo();
      setCurrentSong(null);
      setCurrentTrack(track);
      if (spotifyDeviceId) {
        void playSpotifyTrack(spotifyDeviceId, (track as SpotifyTrackMeta).uri);
      } else {
        window.open(`https://open.spotify.com/track/${(track as SpotifyTrackMeta).id}`, "_blank");
      }
    } else {
      playSong(track as Song);
    }
  }, [spotifyDeviceId, playSong]);

  const seekTo = useCallback((pct: number) => {
    const yt = ytPlayerRef.current;
    if (!yt) return;
    const dur = yt.getDuration();
    if (!dur || !isFinite(dur)) return;
    yt.seekTo(pct * dur, true);
  }, []);

  const togglePlay = useCallback(() => {
    // If a variant audio is active, toggle that
    if (variantAudioRef.current && variantAudioRef.current.src) {
      if (variantAudioRef.current.paused) {
        void variantAudioRef.current.play();
      } else {
        variantAudioRef.current.pause();
      }
      return;
    }
    // Otherwise toggle YouTube
    const yt = ytPlayerRef.current;
    if (!yt || !currentSong) return;
    const state = yt.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      yt.pauseVideo();
    } else {
      yt.playVideo();
    }
  }, [currentSong]);

  const nextSong = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    playSong(songs[(idx + 1) % songs.length]);
  }, [currentSong, playSong]);

  const prevSong = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    playSong(songs[(idx - 1 + songs.length) % songs.length]);
  }, [currentSong, playSong]);

  const savePlaylist = useCallback((p: Playlist) => {
    setPlaylists((prev) => {
      const next = [...prev, p];
      localStorage.setItem("vibeforge_playlists", JSON.stringify(next));
      return next;
    });
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem("vibeforge_playlists", JSON.stringify(next));
      return next;
    });
  }, []);

  const saveJournalEntry = useCallback((e: JournalEntry) => {
    setJournalEntries((prev) => {
      const next = [e, ...prev];
      localStorage.setItem("vibeforge_journal", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setJournalEntries((prev) => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem("vibeforge_journal", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        session, user, userProfile, login, signup, logout, authLoading,
        currentSong, isPlaying, playSong, playVariant, playSongBySearch, togglePlay, nextSong, prevSong,
        progress, currentTime, duration, seekTo, volume, setVolume,
        currentTrack, playUnified,
        spotifyPlayer: spotifyPlayerRef.current,
        spotifyDeviceId, spotifyState, spotifyVolume, setSpotifyVolume,
        spotifyConnected,
        playlists, savePlaylist, deletePlaylist,
        journalEntries, saveJournalEntry, deleteJournalEntry,
        screen, setScreen,
        vibeOrbOpen, setVibeOrbOpen,
        vibeOrbPrefill, setVibeOrbPrefill,
        vibeOrbMode, setVibeOrbMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
