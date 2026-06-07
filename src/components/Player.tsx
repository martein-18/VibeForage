import { useApp } from "../context/useApp";
import type { SpotifyTrackMeta } from "../context/useApp";
import { Play, Pause, SkipBack, SkipForward, Volume2, BookOpen, Palette, X, Music2, Shuffle } from "lucide-react";
import { useState, useEffect } from "react";
import { songStory, visualMusic, liveRemix } from "../data/gemini";
import type { VisualMusicResponse } from "../data/gemini";
import { getSongById, Song } from "../data/songs";
import { getVariantsForSong, SongVariant, VARIANT_TYPE_COLORS, VARIANT_TYPE_LABELS, VariantType } from "../data/songVariants";
import { msToTime } from "../lib/spotify";
import TypewriterText from "./TypewriterText";

const safe = (s: string) => s.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "");

// ── Story Panel ───────────────────────────────────────────────────────────────
function StoryPanel({ onClose }: { onClose: () => void }) {
  const { currentSong } = useApp();
  const [loading, setLoading] = useState(false);
  const [story, setStory]     = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [color, setColor]     = useState("#1DB954");

  if (!currentSong) return null;

  const load = async () => {
    setLoading(true); setStory(null); setError(null);
    try {
      const r = await songStory(currentSong.title, currentSong.artist);
      setStory(r.message); setColor(r.vibe_color);
    } catch (e) { setError(e instanceof Error ? e.message : "AI unavailable. Try again."); }
    setLoading(false);
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-[#1e1e1e] rounded-2xl shadow-2xl border border-[#2e2e2e] animate-fadeIn overflow-hidden" style={{ maxHeight: "55vh", overflowY: "auto" }}>
      <div className="sticky top-0 bg-[#1e1e1e] px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#2e2e2e]">
        <p className="text-white text-sm font-semibold flex items-center gap-2">
          <BookOpen size={13} className="text-[#1DB954]" /> What's this song about? — {currentSong.title}
        </p>
        <button onClick={onClose} className="text-[#a7a7a7] hover:text-white"><X size={15} /></button>
      </div>
      <div className="p-4">
        {!story && !loading && (
          <button onClick={() => void load()} className="bg-[#1DB954] text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1ed760] transition-colors flex items-center gap-2">
            <BookOpen size={13} /> Tell me about this song
          </button>
        )}
        {loading && (
          <div className="flex items-center gap-3 text-[#1DB954] text-sm py-2">
            <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}</div>
            Feeling the soul of this song...
          </div>
        )}
        {error && <p className="text-red-400 text-xs leading-relaxed">{safe(error)}</p>}
        {story && (
          <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }}>
            <TypewriterText text={safe(story)} className="text-white/90 text-sm leading-relaxed" speed={18} />
            <button onClick={() => { setStory(null); }} className="mt-3 text-[#555] text-xs hover:text-white transition-colors">Ask again →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Visuals Panel ─────────────────────────────────────────────────────────────
function VisualsPanel({ onClose }: { onClose: () => void }) {
  const { currentSong } = useApp();
  const [loading, setLoading] = useState(false);
  const [visual, setVisual]   = useState<VisualMusicResponse | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!currentSong) return;
    const load = async () => {
      setLoading(true); setVisual(null); setError(null);
      try {
        const r = await visualMusic(currentSong.title, currentSong.artist, currentSong.genre);
        setVisual(r);
      } catch (e) { setError(e instanceof Error ? e.message : "AI unavailable."); }
      setLoading(false);
    };
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentSong) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-[#1e1e1e] rounded-2xl shadow-2xl border border-[#2e2e2e] animate-fadeIn overflow-hidden" style={{ maxHeight: "55vh", overflowY: "auto" }}>
      <div className="sticky top-0 bg-[#1e1e1e] px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#2e2e2e]">
        <p className="text-white text-sm font-semibold flex items-center gap-2">
          <Palette size={13} className="text-[#1DB954]" /> Visuals — {currentSong.title}
        </p>
        <button onClick={onClose} className="text-[#a7a7a7] hover:text-white"><X size={15} /></button>
      </div>
      <div className="p-3">
        {loading && (
          <div className="flex items-center gap-3 text-[#1DB954] text-sm py-4 justify-center">
            <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}</div>
            Painting your visual...
          </div>
        )}
        {error && <p className="text-red-400 text-xs leading-relaxed p-2">{safe(error)}</p>}
        {visual && (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={visual.imageUrl}
              alt={currentSong.title}
              className="w-full object-cover rounded-xl"
              style={{ maxHeight: "220px", minHeight: "160px" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${currentSong.id}/800/400`; }}
            />
            <div
              className="absolute inset-0 rounded-xl flex items-end p-3"
              style={{ background: `linear-gradient(to top, ${visual.vibe_color}cc 0%, transparent 60%)` }}
            >
              <p className="text-white text-xs font-medium leading-relaxed italic">{safe(visual.caption)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Live Remix Panel ──────────────────────────────────────────────────────────
function VariantCard({ v, active, onPlay }: { v: SongVariant; active: boolean; onPlay: (v: SongVariant) => void }) {
  const typeColor = VARIANT_TYPE_COLORS[v.type as VariantType];
  return (
    <button
      onClick={() => onPlay(v)}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-all hover:scale-[1.02] active:scale-95 border"
      style={{
        background: `${typeColor}12`,
        borderColor: active ? typeColor : `${typeColor}30`,
        outline: active ? `2px solid ${typeColor}` : "none",
        outlineOffset: active ? "2px" : "0",
      }}
    >
      <img
        src={v.cover}
        alt={v.title}
        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(v.audioUrl)}/80/80`; }}
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full" style={{ background: `${typeColor}30`, color: typeColor }}>
            {VARIANT_TYPE_LABELS[v.type as VariantType]}
          </span>
        </div>
        <p className="text-white text-xs font-medium truncate max-w-[110px]">{v.title}</p>
        <p className="text-[#a7a7a7] text-[10px] truncate max-w-[110px]">{v.artist}</p>
      </div>
    </button>
  );
}

function LiveRemixPanel({ onClose, catalogSongId }: { onClose: () => void; catalogSongId: number }) {
  const { currentSong, playSong, playVariant } = useApp();
  const [songs, setSongs]       = useState<Song[]>([]);
  const [msg, setMsg]           = useState("");
  const [name, setName]         = useState("");
  const [color, setColor]       = useState("#1DB954");
  const [done, setDone]         = useState(false);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  const variants = getVariantsForSong(catalogSongId);

  useEffect(() => {
    if (!currentSong) return;
    liveRemix(currentSong.title, currentSong.artist, currentSong.genre).then(res => {
      const matched = res.song_ids.map(id => getSongById(id)).filter(Boolean) as Song[];
      setSongs(matched); setMsg(res.message); setName(res.playlist_name); setColor(res.vibe_color);
      setDone(true);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentSong) return null;

  const handlePlayVariant = (v: SongVariant) => {
    setActiveAudioUrl(v.audioUrl);
    playVariant(v.audioUrl, {
      title: v.title,
      artist: v.artist,
      cover: v.cover,
      genre: currentSong.genre,
    });
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-[#1e1e1e] rounded-2xl shadow-2xl border border-[#2e2e2e] animate-fadeIn overflow-hidden" style={{ maxHeight: "60vh", overflowY: "auto" }}>
      <div className="sticky top-0 bg-[#1e1e1e] px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#2e2e2e]">
        <p className="text-white text-sm font-semibold flex items-center gap-2">
          <Shuffle size={13} className="text-[#1DB954]" /> Alternate Vibes — {currentSong.title}
        </p>
        <button onClick={onClose} className="text-[#a7a7a7] hover:text-white"><X size={15} /></button>
      </div>

      <div className="p-4 space-y-4">
        {/* ── Pre-fetched variants section ── */}
        {variants.length > 0 && (
          <div>
            <p className="text-[#a7a7a7] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Shuffle size={9} /> Alternate Versions
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <VariantCard
                  key={v.type}
                  v={v}
                  active={activeAudioUrl === v.audioUrl}
                  onPlay={handlePlayVariant}
                />
              ))}
            </div>
            <div className="my-3 border-t border-[#2e2e2e]" />
          </div>
        )}

        {/* ── AI-suggested similar songs ── */}
        {!done && (
          <div className="flex items-center gap-3 text-[#1DB954] text-sm py-1">
            <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}</div>
            Finding similar vibes...
          </div>
        )}
        {done && (
          <div>
            <p className="text-[#a7a7a7] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Shuffle size={9} /> Similar Songs
            </p>
            {msg && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs mb-3" style={{ background: `${color}18`, borderLeft: `2px solid ${color}` }}>
                <Shuffle size={10} className="flex-shrink-0 mt-0.5" style={{ color }} />
                <span className="text-white/80">{safe(msg)}</span>
              </div>
            )}
            {name && <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color }}>{name}</p>}
            <div className="flex flex-wrap gap-2">
              {songs.map(s => (
                <button key={s.id} onClick={() => playSong(s)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-white/10 transition-colors border border-white/10" style={{ background: `${color}15` }}>
                  <img src={s.cover} alt={s.title} className="w-8 h-8 rounded-lg object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src=`https://picsum.photos/seed/${s.id}/80/80`;}} />
                  <div>
                    <p className="text-white text-xs font-medium">{s.title}</p>
                    <p className="text-[#a7a7a7] text-[10px]">{s.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Player ───────────────────────────────────────────────────────────────
type Panel = "none" | "story" | "visuals" | "liveremix";

export default function Player() {
  const {
    currentSong, isPlaying, togglePlay, nextSong, prevSong,
    progress, currentTime, duration, volume, setVolume, seekTo,
    spotifyPlayer, spotifyState, spotifyVolume, setSpotifyVolume, currentTrack,
  } = useApp();
  const [panel, setPanel] = useState<Panel>("none");
  const toggle = (p: Panel) => setPanel(prev => prev === p ? "none" : p);

  const isSpotifyActive = currentTrack?.source === "spotify";

  // ── Spotify mini-player ──
  if (isSpotifyActive && spotifyState) {
    const track = spotifyState.track_window.current_track;
    const prog  = spotifyState.duration > 0 ? (spotifyState.position / spotifyState.duration) * 100 : 0;
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-[#181818] border-t border-[#1DB954]/30 flex items-center px-4 z-50 gap-3">
        <div className="flex items-center gap-3 w-[28%] min-w-[160px]">
          {track.album.images[0]?.url && <img src={track.album.images[0].url} alt={track.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />}
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{track.name}</p>
            <p className="text-[#a7a7a7] text-xs truncate">{track.artists.map(a => a.name).join(", ")}</p>
            <span className="text-[10px] text-[#1DB954] font-semibold flex items-center gap-1"><Music2 size={9} /> SPOTIFY</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1 max-w-[580px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => void spotifyPlayer?.previousTrack()} className="text-[#a7a7a7] hover:text-white transition-colors"><SkipBack size={18} fill="currentColor" /></button>
            <button onClick={() => void spotifyPlayer?.togglePlay()} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md">
              {spotifyState.paused ? <Play size={16} className="text-black ml-0.5" fill="black" /> : <Pause size={16} className="text-black" />}
            </button>
            <button onClick={() => void spotifyPlayer?.nextTrack()} className="text-[#a7a7a7] hover:text-white transition-colors"><SkipForward size={18} fill="currentColor" /></button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-[#a7a7a7] text-[10px] w-9 text-right tabular-nums">{msToTime(spotifyState.position)}</span>
            <div className="flex-1 h-1 bg-[#3e3e3e] rounded-full cursor-pointer group" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); void spotifyPlayer?.seek(Math.round(((e.clientX - r.left) / r.width) * spotifyState.duration)); }}>
              <div className="h-1 bg-[#1DB954] rounded-full group-hover:bg-[#1ed760] transition-colors" style={{ width: `${prog}%` }} />
            </div>
            <span className="text-[#a7a7a7] text-[10px] w-9 tabular-nums">{msToTime(spotifyState.duration)}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 w-[28%] justify-end">
          <Volume2 size={14} className="text-[#a7a7a7]" />
          <div className="w-20 h-1 bg-[#3e3e3e] rounded-full cursor-pointer group" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const v = Math.round(((e.clientX - r.left) / r.width) * 100) / 100; setSpotifyVolume(v); void spotifyPlayer?.setVolume(v); }}>
            <div className="h-1 bg-[#a7a7a7] rounded-full group-hover:bg-[#1DB954] transition-colors" style={{ width: `${spotifyVolume * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (isSpotifyActive && currentTrack) {
    const t = currentTrack as SpotifyTrackMeta;
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-[#181818] border-t border-[#1DB954]/30 flex items-center px-4 z-50 gap-3">
        {t.cover && <img src={t.cover} alt={t.title} className="w-11 h-11 rounded-lg object-cover" />}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{t.title}</p>
          <p className="text-[#a7a7a7] text-xs truncate">{t.artist}</p>
          <span className="text-[10px] text-[#1DB954] font-semibold flex items-center gap-1"><Music2 size={9} /> Connecting to Spotify...</span>
        </div>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-[#181818] border-t border-[#282828] flex items-center justify-center z-50">
        <p className="text-[#555] text-sm">Select a song to start playing</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] z-50">
      {panel === "story"     && <StoryPanel     onClose={() => setPanel("none")} />}
      {panel === "visuals"   && <VisualsPanel   onClose={() => setPanel("none")} />}
      {panel === "liveremix" && currentSong && <LiveRemixPanel onClose={() => setPanel("none")} catalogSongId={currentSong.id} />}

      <div className="flex items-center px-4 h-[70px] gap-2">
        {/* Song info */}
        <div className="flex items-center gap-3 w-[28%] min-w-[160px]">
          <img
            src={currentSong.cover} alt={currentSong.title}
            className={`w-11 h-11 rounded-lg object-cover flex-shrink-0 ${isPlaying ? "animate-spin-slow" : ""}`}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${currentSong.id}/80/80`; }}
          />
          <div className="overflow-hidden min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-[#a7a7a7] text-xs truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls + progress */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-[580px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => toggle("story")} className={`transition-colors ${panel === "story" ? "text-[#1DB954]" : "text-[#a7a7a7] hover:text-white"}`} title="What's this song about?">
              <BookOpen size={15} />
            </button>
            <button onClick={prevSong} className="text-[#a7a7a7] hover:text-white transition-colors">
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button onClick={togglePlay} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md">
              {isPlaying ? <Pause size={16} className="text-black" /> : <Play size={16} className="text-black ml-0.5" fill="black" />}
            </button>
            <button onClick={nextSong} className="text-[#a7a7a7] hover:text-white transition-colors">
              <SkipForward size={18} fill="currentColor" />
            </button>
            <button onClick={() => toggle("visuals")} className={`transition-colors ${panel === "visuals" ? "text-[#1DB954]" : "text-[#a7a7a7] hover:text-white"}`} title="Visual Music">
              <Palette size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-[#a7a7a7] text-[10px] w-9 text-right tabular-nums">{currentTime}</span>
            <div
              className="flex-1 h-1 bg-[#3e3e3e] rounded-full cursor-pointer group"
              onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); seekTo((e.clientX - rect.left) / rect.width); }}
            >
              <div className="h-1 bg-[#1DB954] rounded-full relative group-hover:bg-[#1ed760] transition-colors" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
              </div>
            </div>
            <span className="text-[#a7a7a7] text-[10px] w-9 tabular-nums">{duration}</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3 w-[28%] justify-end">
          <button onClick={() => toggle("liveremix")} className={`transition-colors ${panel === "liveremix" ? "text-[#1DB954]" : "text-[#a7a7a7] hover:text-white"}`} title="Alternate Vibes">
            <Shuffle size={15} />
          </button>
          <Volume2 size={14} className="text-[#a7a7a7] flex-shrink-0" />
          <div
            className="w-20 h-1 bg-[#3e3e3e] rounded-full cursor-pointer group flex-shrink-0"
            onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100)); }}
          >
            <div className="h-1 bg-[#a7a7a7] rounded-full group-hover:bg-[#1DB954] transition-colors" style={{ width: `${volume}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
