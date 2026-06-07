import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/useApp";
import { getSongById } from "../data/songs";
import { journalAssist, ChatMessage } from "../data/gemini";
import {
  Play, Sparkles, Music, BookOpen,
  ChevronDown, ChevronUp, Clock, Trash2, Save, LogOut, User, Send,
} from "lucide-react";

const sanitize = (s: string) => s.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "");

function moodColor(text: string): string {
  const t = text.toLowerCase();
  if (/happy|joy|excit|love|great|amazing|wonderful/.test(t)) return "#1DB954";
  if (/sad|cry|depress|miss|lonely|hurt|pain/.test(t))        return "#4A90D9";
  if (/angry|frustrat|annoyed|stress|anxious|worried/.test(t)) return "#E74C3C";
  if (/calm|peace|relax|grateful|thankful/.test(t))            return "#A29BFE";
  if (/nostalgic|memory|remember|past|miss|old/.test(t))       return "#F39C12";
  return "#1DB954";
}

export default function LibraryScreen() {
  const [tab, setTab] = useState<"playlists" | "journal">("playlists");
  const { userProfile, logout } = useApp();
  return (
    <div className="p-4 pb-32 lg:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        {userProfile && (
          <button
            onClick={() => void logout()}
            className="lg:hidden flex items-center gap-1.5 bg-[#282828] hover:bg-red-900/30 text-[#a7a7a7] hover:text-red-400 transition-all text-xs px-3 py-1.5 rounded-full border border-[#3e3e3e] hover:border-red-900/50"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        )}
      </div>
      {userProfile && (
        <div className="lg:hidden flex items-center gap-2 mb-5 px-3 py-2.5 bg-[#1e1e1e] rounded-xl border border-[#2e2e2e]">
          <div className="w-8 h-8 bg-[#1DB954]/20 border border-[#1DB954]/30 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-[#1DB954]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{userProfile.name}</p>
            <p className="text-[#a7a7a7] text-[10px]">Signed in</p>
          </div>
        </div>
      )}
      <div className="flex bg-[#1e1e1e] rounded-full p-1 mb-6 border border-[#2e2e2e]">
        <button
          onClick={() => setTab("playlists")}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 justify-center ${
            tab === "playlists" ? "bg-white text-black shadow" : "text-[#a7a7a7] hover:text-white"
          }`}
        >
          <Music size={13} /> Playlists
        </button>
        <button
          onClick={() => setTab("journal")}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 justify-center ${
            tab === "journal" ? "bg-white text-black shadow" : "text-[#a7a7a7] hover:text-white"
          }`}
        >
          <BookOpen size={13} /> Journal
        </button>
      </div>
      {tab === "playlists" ? <PlaylistsTab /> : <JournalTab />}
    </div>
  );
}

// ── Playlists tab ─────────────────────────────────────────────────────────────
function PlaylistsTab() {
  const { playlists, playSong, deletePlaylist } = useApp();

  if (!playlists.length) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-[#1e1e1e] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2e2e2e]">
          <Music size={28} className="text-[#555]" />
        </div>
        <p className="text-white font-semibold mb-1">No playlists yet</p>
        <p className="text-[#555] text-sm">
          Tap the <Sparkles size={11} className="inline text-[#1DB954] mx-0.5" /> Vibe Orb to create one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {playlists.map(p => {
        const first = p.songIds[0] ? getSongById(p.songIds[0]) : null;
        return (
          <div
            key={p.id}
            className="bg-[#181818] rounded-2xl p-4 hover:bg-[#1e1e1e] transition-colors border border-[#2e2e2e]"
            style={{ borderLeftColor: p.vibeColor, borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${p.vibeColor}cc, ${p.vibeColor}44)` }}
              >
                <Music size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{p.name}</p>
                <p className="text-[#a7a7a7] text-xs truncate mt-0.5">{p.description}</p>
                <p className="text-[#555] text-[10px] mt-1">{p.songIds.length} songs &bull; AI Generated</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {first && (
                  <button
                    onClick={() => playSong(first)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                    style={{ background: p.vibeColor }}
                  >
                    <Play size={15} className="text-black ml-0.5" fill="black" />
                  </button>
                )}
                <button
                  onClick={() => deletePlaylist(p.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2e2e2e] hover:bg-red-900/50 hover:text-red-400 text-[#555] transition-all"
                  title="Delete playlist"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Journal tab ───────────────────────────────────────────────────────────────
function JournalTab() {
  const { journalEntries, saveJournalEntry, deleteJournalEntry } = useApp();

  // Journal text
  const [text, setText] = useState("");

  // Conversation state — chat starts after first "Talk to AI" click
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [replyInput, setReplyInput]   = useState("");
  const [aiLoading, setAiLoading]     = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [justSaved, setJustSaved]   = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

  // Reset chat when user clears the journal text entirely
  const prevTextRef = useRef("");
  useEffect(() => {
    if (text === "" && prevTextRef.current !== "") {
      setChatHistory([]);
      setChatStarted(false);
      setReplyInput("");
    }
    prevTextRef.current = text;
  }, [text]);

  // ── Start conversation: first AI response from journal entry ──────────────
  const handleTalkToAI = useCallback(async () => {
    if (text.trim().length < 30 || aiLoading) return;
    setAiLoading(true);
    setChatStarted(true);
    try {
      const aiResponse = await journalAssist(text, []);
      setChatHistory([{ role: "ai", text: aiResponse }]);
    } catch {
      setChatHistory([{ role: "ai", text: "Something went quiet on my end — want to try again?" }]);
    }
    setAiLoading(false);
  }, [text, aiLoading]);

  // ── Continue conversation: user sends a reply ─────────────────────────────
  const handleSendReply = useCallback(async () => {
    const trimmed = replyInput.trim();
    if (!trimmed || aiLoading) return;

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setReplyInput("");
    setAiLoading(true);

    try {
      const aiResponse = await journalAssist(text, updatedHistory);
      setChatHistory(prev => [...prev, { role: "ai", text: aiResponse }]);
    } catch {
      setChatHistory(prev => [...prev, { role: "ai", text: "Lost connection for a sec — what were you saying?" }]);
    }
    setAiLoading(false);
  }, [replyInput, chatHistory, text, aiLoading]);

  // Handle Enter key in reply input
  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendReply();
    }
  };

  // ── Save entry — captures journal text + full conversation ────────────────
  const save = () => {
    if (!text.trim()) return;
    // Build conversation transcript for storage
    const conversationText = chatHistory.length > 0
      ? chatHistory.map(m => `${m.role === "ai" ? "Vibe" : "You"}: ${m.text}`).join("\n\n")
      : "";
    saveJournalEntry({
      id: Date.now().toString(),
      text: text.trim(),
      response: conversationText || "",
      playlistName: "",
      songIds: [],
      vibeColor: moodColor(text),
      createdAt: new Date().toISOString(),
    });
    setText("");
    setChatHistory([]);
    setChatStarted(false);
    setReplyInput("");
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const color = text.trim().length > 5 ? moodColor(text) : "#3e3e3e";

  return (
    <div>
      {/* ── Write area ── */}
      <div
        className="rounded-2xl p-4 mb-5 border transition-all"
        style={{ background: `linear-gradient(135deg, ${color}10, #181818)`, borderColor: text.trim() ? color + "44" : "#2e2e2e" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#a7a7a7] text-xs flex items-center gap-1.5">
            <BookOpen size={11} /> Write freely &mdash; Vibe is listening
          </p>
          <span className="text-[#555] text-[10px] tabular-nums">{text.length} chars</span>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="How was your day? What's on your mind? Just write..."
          className="w-full h-36 bg-transparent text-white rounded-xl outline-none placeholder-[#444] resize-none text-sm leading-relaxed"
          style={{ caretColor: color }}
        />

        {/* Talk to AI button — only shown before chat starts */}
        {!chatStarted && (
          <div className="flex justify-end mb-3">
            <button
              onClick={() => void handleTalkToAI()}
              disabled={text.trim().length < 30 || aiLoading}
              title={text.trim().length < 30 ? "Write at least 30 characters first" : "Start a conversation with Vibe about what you wrote"}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: text.trim().length >= 30 && !aiLoading ? `${color}22` : "#2e2e2e",
                color: text.trim().length >= 30 && !aiLoading ? color : "#555",
                border: `1px solid ${text.trim().length >= 30 && !aiLoading ? color + "55" : "#3e3e3e"}`,
              }}
            >
              {aiLoading ? (
                <>
                  <div className="flex gap-0.5">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1 h-1 rounded-full animate-bounce" style={{ background: color, animationDelay: `${i*120}ms` }} />
                    ))}
                  </div>
                  Reading...
                </>
              ) : (
                <>
                  <Sparkles size={11} />
                  Talk to AI
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Chat thread — shown after first AI response ── */}
        {chatStarted && (
          <div className="mt-3 mb-3">
            {/* Messages */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <Sparkles size={11} className="flex-shrink-0 mt-1.5 mr-1.5" style={{ color }} />
                  )}
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                    style={
                      msg.role === "ai"
                        ? { background: `${color}18`, borderLeft: `2px solid ${color}`, color: "rgba(255,255,255,0.85)" }
                        : { background: `${color}33`, color: "rgba(255,255,255,0.9)", borderRadius: "16px 16px 4px 16px" }
                    }
                  >
                    {sanitize(msg.text)}
                  </div>
                </div>
              ))}

              {/* AI typing indicator */}
              {aiLoading && (
                <div className="flex justify-start items-center gap-1.5">
                  <Sparkles size={11} style={{ color }} className="flex-shrink-0" />
                  <div className="px-3 py-2 rounded-2xl" style={{ background: `${color}18` }}>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: color, animationDelay: `${i*120}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Reply input */}
            <div
              className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl border"
              style={{ background: `${color}0d`, borderColor: `${color}33` }}
            >
              <input
                type="text"
                value={replyInput}
                onChange={e => setReplyInput(e.target.value)}
                onKeyDown={handleReplyKeyDown}
                placeholder="Reply to Vibe..."
                disabled={aiLoading}
                className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#555] disabled:opacity-40"
                style={{ caretColor: color }}
              />
              <button
                onClick={() => void handleSendReply()}
                disabled={!replyInput.trim() || aiLoading}
                className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: replyInput.trim() && !aiLoading ? color : "#3e3e3e" }}
              >
                <Send size={12} className="text-black" />
              </button>
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={save}
          disabled={!text.trim()}
          className="flex items-center gap-2 text-black font-bold py-2.5 px-6 rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm mt-2"
          style={{ background: text.trim() ? color : "#3e3e3e" }}
        >
          <Save size={14} />
          {justSaved ? "Saved! \u2713" : "Save Entry"}
        </button>
      </div>

      {/* ── Past entries ── */}
      {journalEntries.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-white mb-3">
            Past Entries <span className="text-[#555] font-normal text-sm">({journalEntries.length})</span>
          </h3>
          <div className="space-y-2">
            {journalEntries.map(entry => {
              const open = expandedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="bg-[#181818] rounded-2xl border border-[#2e2e2e] overflow-hidden"
                  style={{ borderLeftColor: entry.vibeColor, borderLeftWidth: 3 }}
                >
                  <div className="flex items-center gap-2 px-4 py-3">
                    <button
                      className="flex-1 flex items-center justify-between text-left"
                      onClick={() => setExpandedId(open ? null : entry.id)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm truncate pr-2">
                          {sanitize(entry.text).slice(0, 65)}{entry.text.length > 65 ? "…" : ""}
                        </p>
                        <p className="text-[#555] text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock size={9} />
                          {new Date(entry.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {open
                        ? <ChevronUp size={14} className="text-[#a7a7a7] flex-shrink-0" />
                        : <ChevronDown size={14} className="text-[#a7a7a7] flex-shrink-0" />
                      }
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteJournalEntry(entry.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2e2e2e] hover:bg-red-900/50 hover:text-red-400 text-[#555] transition-all flex-shrink-0 ml-1"
                      title="Delete entry"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {open && (
                    <div className="px-4 pb-4 border-t border-[#2e2e2e]">
                      <p className="text-white/80 text-sm my-3 leading-relaxed whitespace-pre-wrap">
                        {sanitize(entry.text)}
                      </p>
                      {entry.response && (
                        <p className="text-white/60 text-xs leading-relaxed whitespace-pre-wrap mb-2">
                          {sanitize(entry.response)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {journalEntries.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={32} className="text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">Your journal is empty. Start writing above.</p>
        </div>
      )}
    </div>
  );
}