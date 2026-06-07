import { useState, useEffect, useCallback } from "react";
import {
  redirectToSpotifyLogin, isSpotifyConnected, clearSpotifyTokens,
  searchSpotify, getFeaturedPlaylists, getNewReleases, getRecommendations,
  getPlaylistTracks,
  SpotifyTrack, SpotifyPlaylist, SpotifyAlbum,
  msToTime, trackCover,
} from "../lib/spotify";
import {
  Search, Play,
  LogOut, Music2, Sparkles, ExternalLink,
} from "lucide-react";
import { useApp } from "../context/useApp";

// ── Track row ─────────────────────────────────────────────────────────────────
function TrackRow({ track, index, onPlay }: { track: SpotifyTrack; index: number; onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
    >
      <span className="text-[#555] text-xs w-5 text-center group-hover:hidden">{index + 1}</span>
      <Play size={12} className="text-[#1DB954] w-5 hidden group-hover:block flex-shrink-0" fill="currentColor" />
      <img src={trackCover(track)} alt={track.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${track.id}/80/80`; }} />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{track.name}</p>
        <p className="text-[#a7a7a7] text-xs truncate">{track.artists.map(a => a.name).join(", ")} · {track.album.name}</p>
      </div>
      <span className="text-[#555] text-xs flex-shrink-0">{msToTime(track.duration_ms)}</span>
      {track.explicit && <span className="text-[#555] text-[9px] border border-[#555] rounded px-1">E</span>}
    </button>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SpotifyScreen() {
  const { spotifyDeviceId, playUnified } = useApp();
  const [connected]           = useState(isSpotifyConnected);
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [featured, setFeatured] = useState<SpotifyPlaylist[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
  const [recs, setRecs]       = useState<SpotifyTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<{ name: string; tracks: SpotifyTrack[] } | null>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState("");

  const sdkReady = !!spotifyDeviceId;

  // Load home data when connected
  useEffect(() => {
    if (!connected) return;
    getFeaturedPlaylists().then(setFeatured).catch(() => {});
    getNewReleases().then(setNewReleases).catch(() => {});
    getRecommendations("bollywood,pop,hip-hop").then(setRecs).catch(() => {});
  }, [connected]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true); setActivePlaylist(null);
    const r = await searchSpotify(query).catch(() => []);
    setResults(r);
    setSearching(false);
  }, [query]);

  const handlePlayTrack = useCallback((track: SpotifyTrack) => {
    playUnified({
      source: "spotify",
      id: track.id, uri: track.uri,
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      cover: trackCover(track),
      duration: msToTime(track.duration_ms),
    });
  }, [playUnified]);

  const handleOpenPlaylist = useCallback(async (p: SpotifyPlaylist) => {
    setLoadingPlaylist(p.id);
    const tracks = await getPlaylistTracks(p.id).catch(() => []);
    setActivePlaylist({ name: p.name, tracks });
    setLoadingPlaylist("");
    setResults([]);
    setQuery("");
  }, []);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #1DB954, #158a3e)" }}>
          <Music2 size={36} className="text-black" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Spotify</h2>
        <p className="text-[#a7a7a7] text-sm mb-8 max-w-sm">
          Stream 100M+ songs from Spotify Premium alongside your local VibeForge tracks
        </p>
        <button
          onClick={() => void redirectToSpotifyLogin()}
          className="flex items-center gap-3 bg-[#1DB954] text-black font-bold py-3.5 px-8 rounded-full hover:bg-[#1ed760] active:scale-95 transition-all text-sm"
        >
          <Music2 size={18} /> Connect with Spotify Premium
        </button>
        <p className="text-[#555] text-xs mt-4">Requires Spotify Premium • Your local songs stay unchanged</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32 lg:pb-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center">
            <Music2 size={14} className="text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">Spotify</h1>
          {sdkReady && <span className="text-[10px] text-[#1DB954] font-semibold bg-[#1DB954]/10 px-2 py-0.5 rounded-full">LIVE</span>}
        </div>
        <button
          onClick={() => { clearSpotifyTokens(); window.location.reload(); }}
          className="flex items-center gap-1.5 text-[#a7a7a7] hover:text-white text-xs transition-colors"
        >
          <LogOut size={13} /> Disconnect
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6a6a]" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && void handleSearch()}
          placeholder="Search any song, artist, album..."
          className="w-full bg-[#282828] text-white pl-11 pr-24 py-3 rounded-full outline-none placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#1DB954] transition-all text-sm border border-[#3e3e3e] focus:border-[#1DB954]"
        />
        <button
          onClick={() => void handleSearch()}
          disabled={!query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1DB954] text-black text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#1ed760] disabled:opacity-40 transition-all"
        >
          Search
        </button>
      </div>

      {/* Search results */}
      {searching && (
        <div className="flex items-center gap-3 py-4 text-[#a7a7a7] text-sm">
          <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}</div>
          Searching Spotify...
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Results for "{query}"</h2>
          <div className="space-y-1">
            {results.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} onPlay={() => handlePlayTrack(t)} />
            ))}
          </div>
        </div>
      )}

      {/* Active playlist */}
      {activePlaylist && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">{activePlaylist.name}</h2>
            <button onClick={() => setActivePlaylist(null)} className="text-[#a7a7a7] text-xs hover:text-white">← Back</button>
          </div>
          <div className="space-y-1">
            {activePlaylist.tracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} onPlay={() => handlePlayTrack(t)} />
            ))}
          </div>
        </div>
      )}

      {/* Home content — only when not searching */}
      {!results.length && !activePlaylist && (
        <>
          {/* Recommendations */}
          {recs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#1DB954]" /> Recommended for You
              </h2>
              <div className="space-y-1">
                {recs.slice(0, 10).map((t, i) => (
                  <TrackRow key={t.id} track={t} index={i} onPlay={() => handlePlayTrack(t)} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Playlists */}
          {featured.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3">Featured Playlists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {featured.map(p => (
                  <button
                    key={p.id}
                    onClick={() => void handleOpenPlaylist(p)}
                    className="bg-[#181818] hover:bg-[#282828] rounded-xl p-3 text-left transition-colors group border border-[#2e2e2e] hover:border-[#1DB954]/30"
                  >
                    <div className="relative mb-2">
                      <img
                        src={p.images[0]?.url}
                        alt={p.name}
                        className="w-full aspect-square rounded-lg object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${p.id}/200/200`; }}
                      />
                      <div className="absolute bottom-2 right-2 w-9 h-9 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                        {loadingPlaylist === p.id
                          ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          : <Play size={14} fill="black" className="text-black ml-0.5" />}
                      </div>
                    </div>
                    <p className="text-white text-xs font-semibold truncate">{p.name}</p>
                    <p className="text-[#555] text-[10px] mt-0.5">{p.tracks.total} tracks</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Releases */}
          {newReleases.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3">New Releases</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {newReleases.map(album => (
                  <a
                    key={album.id}
                    href={`https://open.spotify.com/album/${album.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[140px] max-w-[140px] bg-[#181818] p-3 rounded-xl hover:bg-[#282828] transition-colors group border border-[#2e2e2e]"
                  >
                    <div className="relative mb-2">
                      <img
                        src={album.images[0]?.url}
                        alt={album.name}
                        className="w-full aspect-square rounded-lg object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${album.id}/200/200`; }}
                      />
                      <ExternalLink size={12} className="absolute top-2 right-2 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-white text-xs font-semibold truncate">{album.name}</p>
                    <p className="text-[#a7a7a7] text-[10px] truncate">{album.artists.map(a => a.name).join(", ")}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* The SDK player bar is now rendered globally in Player.tsx when a Spotify track is active */}
    </div>
  );
}
