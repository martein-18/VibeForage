import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "../context/useApp";
import { generateVibePlaylist, memorySoundtrack, futureSoundtrack, GeminiPlaylistResponse } from "../data/gemini";
import { getSongById, getSongsByGenre, Song, Playlist } from "../data/songs";
import { Sparkles, X, Save, Play, Mic, MicOff, Zap, Clock, Rocket, Music, Check } from "lucide-react";

type FeatureMode = "vibe" | "memory" | "future";

const FEATURES: { mode: FeatureMode; label: string; icon: typeof Zap; hint: string; placeholder: string; cta: string; loading: string }[] = [
  {
    mode: "vibe", label: "Instant Vibe", icon: Zap,
    hint: "Tell me your mood and I'll build your perfect playlist",
    placeholder: "e.g. feeling sad but hopeful, energetic after gym, Sunday morning chill...",
    cta: "Create My Playlist", loading: "Building your playlist...",
  },
  {
    mode: "memory", label: "Memory Soundtrack", icon: Clock,
    hint: "Describe a life moment and I'll score it with music",
    placeholder: "e.g. road trip with friends last summer, heartbreak in college, late-night study sessions...",
    cta: "Score This Memory", loading: "Scoring your memory...",
  },
  {
    mode: "future", label: "Future Soundtrack", icon: Rocket,
    hint: "Dream about your future and I'll make its soundtrack",
    placeholder: "e.g. playlist for my Goa trip next month, when I get my dream job, my wedding day...",
    cta: "Dream My Soundtrack", loading: "Dreaming your soundtrack...",
  },
];

interface VibeResult {
  message: string;
  songs: Song[];
  playlistName: string;
  playlistDesc: string;
  vibeColor: string;
  albumArtConcept: string;
}

// ── Voice input hook ──────────────────────────────────────────────────────────
interface SREvent { results: { 0: { 0: { transcript: string } } } }
interface SRInstance { continuous: boolean; interimResults: boolean; lang: string; onresult: (e: SREvent) => void; onerror: () => void; onend: () => void; start(): void; stop(): void; }
type SRCtor = new () => SRInstance;

function getSR(): SRCtor | null {
  return (
    (window as Window & { SpeechRecognition?: SRCtor }).SpeechRecognition ||
    (window as Window & { webkitSpeechRecognition?: SRCtor }).webkitSpeechRecognition ||
    null
  );
}

function useVoice(onResult: (t: string) => void) {
  const [on, setOn] = useState(false);
  const ref = useRef<SRInstance | null>(null);

  useEffect(() => {
    const SR = getSR();
    if (!SR) return;
    const r = new SR();
    r.continuous = false; r.interimResults = false; r.lang = "en-US";
    r.onresult = (e) => { onResult(e.results[0][0].transcript); setOn(false); };
    r.onerror = () => setOn(false);
    r.onend   = () => setOn(false);
    ref.current = r;
    return () => { try { r.stop(); } catch { /* ignore */ } };
  }, [onResult]);

  const toggle = () => {
    if (on) { ref.current?.stop(); setOn(false); }
    else if (ref.current) { ref.current.start(); setOn(true); }
  };
  return { on, toggle, supported: !!getSR() };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function VibeOrb() {
  const { playSong, savePlaylist, vibeOrbOpen, setVibeOrbOpen, vibeOrbPrefill, setVibeOrbPrefill, vibeOrbMode, setVibeOrbMode } = useApp();

  const [mode, setMode]       = useState<FeatureMode>("vibe");
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<VibeResult | null>(null);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  const playAndClose = (song: Song) => {
    setVibeOrbOpen(false);
    setTimeout(() => playSong(song), 50);
  };

  // Prefill from HomeScreen chips
  useEffect(() => {
    if (vibeOrbOpen) {
      setMode(vibeOrbMode);
      if (vibeOrbPrefill) { setInput(vibeOrbPrefill); setVibeOrbPrefill(""); }
    }
  }, [vibeOrbOpen, vibeOrbMode, vibeOrbPrefill, setVibeOrbPrefill]);

  const appendVoice = useCallback((t: string) => setInput(p => p ? p + " " + t : t), []);
  const { on: listening, toggle: toggleVoice, supported: voiceOk } = useVoice(appendVoice);

  const reset = () => { setResult(null); setInput(""); setSaved(false); setError(""); };
  const close = () => { setVibeOrbOpen(false); setVibeOrbMode("vibe"); reset(); };

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null); setSaved(false); setError("");
    try {
      let res: GeminiPlaylistResponse;
      if (mode === "memory")      res = await memorySoundtrack(input);
      else if (mode === "future") res = await futureSoundtrack(input);
      else                        res = await generateVibePlaylist(input);

      const matched = res.song_ids.map(id => getSongById(id)).filter(Boolean) as Song[];

      setResult({
        message: res.message || "",
        songs: matched,
        playlistName: res.playlist_name || "Your Vibe Playlist",
        playlistDesc: res.playlist_description || "",
        vibeColor: res.vibe_color || "#1DB954",
        albumArtConcept: res.album_art_concept || "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const save = () => {
    if (!result || saved) return;
    const p: Playlist = {
      id: Date.now().toString(),
      name: result.playlistName,
      description: result.playlistDesc,
      songIds: result.songs.map(s => s.id),
      vibeColor: result.vibeColor,
      createdAt: new Date().toISOString(),
    };
    savePlaylist(p);
    setSaved(true);
  };

  const feat = FEATURES.find(f => f.mode === mode)!;

  return (
    <>
      {/* Floating Orb */}
      <button
        onClick={() => setVibeOrbOpen(true)}
        className="fixed bottom-[88px] right-4 w-[60px] h-[60px] bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/40 z-50 animate-pulse-glow hover:scale-110 transition-transform"
        title="Open Vibe AI"
      >
        <Sparkles size={26} className="text-black" />
      </button>

      {/* Full-screen modal */}
      {vibeOrbOpen && (
        <div className="fixed inset-0 z-[60] bg-[#111] overflow-y-auto animate-fadeIn">
          <div className="max-w-xl mx-auto px-5 py-6 min-h-screen flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/30 animate-pulse-glow">
                  <Sparkles size={18} className="text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white leading-none">Vibe AI</h1>
                  <p className="text-[#1DB954] text-xs">Vibe AI</p>
                </div>
              </div>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#282828] text-[#a7a7a7] hover:text-white hover:bg-[#3e3e3e] transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Mode tabs */}
            {!loading && !result && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {FEATURES.map(f => (
                  <button
                    key={f.mode}
                    onClick={() => { setMode(f.mode); setError(""); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                      mode === f.mode
                        ? "bg-[#1DB954] text-black border-[#1DB954]"
                        : "bg-transparent text-[#a7a7a7] border-[#3e3e3e] hover:border-[#1DB954] hover:text-white"
                    }`}
                  >
                    <f.icon size={13} /> {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            {!loading && !result && (
              <div className="flex-1 flex flex-col">
                <p className="text-[#a7a7a7] text-sm mb-3">{feat.hint}</p>

                <div className="relative mb-4">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={feat.placeholder}
                    rows={4}
                    className="w-full bg-[#1e1e1e] border border-[#2e2e2e] focus:border-[#1DB954] text-white rounded-xl p-4 pr-14 outline-none placeholder-[#555] resize-none transition-all text-sm leading-relaxed"
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void generate(); } }}
                  />
                  {voiceOk && (
                    <button
                      onClick={toggleVoice}
                      className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        listening ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" : "bg-[#2e2e2e] text-[#a7a7a7] hover:bg-[#3e3e3e] hover:text-white"
                      }`}
                      title={listening ? "Stop" : "Voice input"}
                    >
                      {listening ? <MicOff size={15} /> : <Mic size={15} />}
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-700/40 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => void generate()}
                  disabled={!input.trim()}
                  className="w-full bg-[#1DB954] text-black font-bold py-3.5 rounded-full hover:bg-[#1ed760] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 justify-center text-sm"
                >
                  <Sparkles size={16} /> {feat.cta}
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-[#1DB954] rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-2 bg-[#1DB954] rounded-full animate-pulse flex items-center justify-center">
                    <Sparkles size={24} className="text-black" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg mb-1">{feat.loading}</p>
                  <div className="flex justify-center gap-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className="flex-1 animate-fadeIn">

                {/* AI message box */}
                {result.message && result.message !== "Here's your playlist ✨" && (
                  <div
                    className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3 border border-white/5"
                    style={{ background: `linear-gradient(135deg, ${result.vibeColor}18, ${result.vibeColor}08)` }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: result.vibeColor }}>
                      <Sparkles size={11} className="text-black" />
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">{result.message}</p>
                  </div>
                )}

                {/* Playlist card */}
                <div
                  className="rounded-2xl overflow-hidden mb-4 border border-white/5"
                  style={{ background: `linear-gradient(160deg, ${result.vibeColor}33 0%, #1a1a1a 60%)` }}
                >
                  <div className="p-5 pb-3">
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center shadow-xl flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${result.vibeColor}cc, ${result.vibeColor}55)` }}
                      >
                        <Music size={26} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-white font-bold text-lg leading-tight truncate">{result.playlistName}</h2>
                        {result.playlistDesc && (
                          <p className="text-white/60 text-xs mt-1 leading-relaxed line-clamp-2">{result.playlistDesc}</p>
                        )}
                        <p className="text-[#1DB954] text-xs mt-1">{result.songs.length} songs &bull; AI Generated</p>
                      </div>
                    </div>
                  </div>

                  {/* Song list */}
                  <div className="px-2 pb-3">
                    {result.songs.map((s, i) => (
                      <button
                        key={`${s.id}-${i}`}
                        onClick={() => playAndClose(s)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 active:bg-white/5 transition-colors text-left group"
                      >
                        <span className="text-[#555] text-xs w-5 text-center group-hover:hidden">{i + 1}</span>
                        <Play size={12} className="text-[#1DB954] w-5 hidden group-hover:block flex-shrink-0" fill="currentColor" />
                        <img src={s.cover} alt={s.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e)=>{(e.currentTarget as HTMLImageElement).src=`https://picsum.photos/seed/${s.id}/80/80`;}} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{s.title}</p>
                          <p className="text-[#a7a7a7] text-xs truncate">{s.artist}</p>
                        </div>
                        <span className="text-[#555] text-xs flex-shrink-0">{s.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={save}
                    disabled={saved}
                    className={`flex-1 py-3 rounded-full font-semibold text-sm flex items-center gap-2 justify-center transition-all border ${
                      saved
                        ? "border-[#1DB954]/40 text-[#1DB954]/60 bg-[#1DB954]/5 cursor-default"
                        : "border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black"
                    }`}
                  >
                    {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Playlist</>}
                  </button>
                  <button
                    onClick={() => result.songs[0] && playAndClose(result.songs[0])}
                    disabled={!result.songs.length}
                    className="flex-1 py-3 rounded-full font-semibold text-sm bg-[#1DB954] text-black hover:bg-[#1ed760] active:scale-95 transition-all flex items-center gap-2 justify-center disabled:opacity-40"
                  >
                    <Play size={15} fill="currentColor" /> Play All
                  </button>
                </div>

                <button
                  onClick={reset}
                  className="w-full py-2 text-[#a7a7a7] text-sm hover:text-white transition-colors"
                >
                  ✦ Create another vibe
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
