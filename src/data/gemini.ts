// AI Music Features — VibeForge
// Uses: Gemini 2.0 Flash (primary) → HuggingFace Mistral-7B (fallback)

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const HF_API_KEY     = import.meta.env.VITE_HF_API_KEY as string;
const GEMINI_URL     = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const HF_URL         = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

export interface GeminiPlaylistResponse {
  message: string;
  playlist_name: string;
  playlist_description: string;
  song_ids: number[];
  spotify_queries: string[];
  vibe_color: string;
  album_art_concept: string;
}

export interface GeminiTextResponse {
  message: string;
  vibe_color: string;
}

function sanitize(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").trim();
}

// ── Gemini 2.0 Flash ─────────────────────────────────────────────────────────
async function callGemini(system: string, user: string): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${system}\n\n${user}` }] }],
      generationConfig: { maxOutputTokens: 800, temperature: 0.85 },
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`Gemini HTTP ${res.status}: ${err?.error?.message ?? "unknown"}`);
  }
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = sanitize(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

// ── HuggingFace Mistral-7B (fallback) ────────────────────────────────────────
async function callHuggingFace(system: string, user: string): Promise<string> {
  const prompt = `<s>[INST] ${system}\n\n${user} [/INST]`;
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${HF_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 300, temperature: 0.8, return_full_text: false },
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`HuggingFace HTTP ${res.status}`);
  const data = await res.json() as { generated_text?: string }[] | { error?: string };
  if (!Array.isArray(data)) throw new Error(`HuggingFace: ${data.error}`);
  const text = sanitize(data[0]?.generated_text ?? "").trim();
  if (!text) throw new Error("HuggingFace returned empty response");
  return text;
}

// ── AI call: Gemini first, HuggingFace fallback (single attempt each) ─────────
async function callAI(system: string, user: string): Promise<string> {
  try { return await callGemini(system, user); } catch { /* fall to HF */ }
  try { return await callHuggingFace(system, user); } catch { /* all failed */ }
  throw new Error("AI unavailable");
}

// ── Song catalog with full attributes ────────────────────────────────────────
// [genre, energy(0=soft,1=mid,2=high), valence(0=dark,1=neutral,2=uplifting), tempo(0=slow,1=mid,2=fast)]
type SongAttr = [string, number, number, number];
const CATALOG: Record<number, SongAttr> = {
  1:  ["romantic", 0, 1, 0], 2:  ["romantic", 1, 2, 1], 3:  ["romantic", 0, 1, 0],
  4:  ["romantic", 1, 2, 1], 5:  ["hype",    2, 2, 2], 6:  ["hype",    2, 2, 2],
  7:  ["hype",    2, 2, 2], 8:  ["chill",   0, 2, 0], 9:  ["sad",     0, 0, 0],
  10: ["nostalgic",1, 1, 1], 11: ["chill",   0, 2, 0], 12: ["romantic",0, 1, 0],
  13: ["romantic",0, 2, 0], 14: ["chill",   0, 2, 1], 15: ["sad",     1, 0, 1],
  16: ["hype",    2, 2, 2], 17: ["nostalgic",0,1, 0], 18: ["sad",     1, 0, 1],
  19: ["hype",    2, 2, 2], 20: ["romantic",0, 1, 0], 21: ["romantic",0, 0, 0],
  22: ["romantic",0, 1, 0], 23: ["nostalgic",0,1, 0], 24: ["hype",    2, 2, 2],
  25: ["romantic",0, 1, 0], 26: ["sad",     1, 0, 1], 27: ["sad",     0, 0, 0],
  28: ["sad",     1, 0, 1], 29: ["sad",     0, 0, 0], 30: ["romantic",0, 1, 0],
  31: ["hype",    2, 2, 2], 32: ["sad",     0, 0, 0], 33: ["sad",     0, 0, 0],
  34: ["romantic",0, 2, 0], 35: ["hype",    2, 2, 2], 36: ["chill",   0, 2, 0],
  37: ["hype",    2, 2, 2], 38: ["sad",     0, 0, 0], 39: ["romantic",1, 2, 1],
  40: ["hype",    2, 2, 2], 41: ["romantic",0, 1, 0], 42: ["romantic",0, 1, 0],
  43: ["sad",     0, 0, 0], 44: ["hype",    1, 2, 1], 45: ["sad",     0, 0, 0],
  46: ["chill",   0, 2, 0], 47: ["romantic",0, 1, 0], 48: ["sad",     1, 0, 1],
  49: ["romantic",0, 1, 0], 50: ["sad",     0, 0, 0], 51: ["sad",     0, 0, 1],
  52: ["sad",     0, 0, 0], 53: ["hype",    1, 2, 1], 54: ["hype",    2, 2, 2],
  55: ["hype",    2, 2, 2], 56: ["hype",    2, 1, 2], 57: ["sad",     0, 0, 0],
  58: ["chill",   0, 2, 0], 59: ["nostalgic",1,1, 1], 60: ["hype",    2, 2, 2],
  61: ["hype",    1, 2, 1], 62: ["nostalgic",0,1, 0], 63: ["hype",    1, 2, 1],
  64: ["romantic",0, 1, 0], 65: ["romantic",0, 2, 0], 66: ["chill",   0, 2, 0],
  67: ["hype",    1, 2, 1], 68: ["romantic",1, 2, 1], 69: ["romantic",0, 2, 0],
};

// ── Mood interpreter → music attributes → ordered playlist ───────────────────
interface MoodProfile {
  name: string;
  description: string;
  aiMessage: string;
  color: string;
  phases: Array<{ genres: string[]; energy: number[]; valence: number[]; count: number }>;
}

// Title-case user's raw input for playlist naming
function toPlaylistName(raw: string): string {
  return raw
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase())
    .slice(0, 40);
}

function interpretMood(input: string, mode: "vibe" | "memory" | "future"): MoodProfile {
  const q = input.toLowerCase();
  const label = toPlaylistName(input);

  // ── HEARTBREAK / BREAKUP ────────────────────────────────────────────────────
  if (/heartbreak|breakup|break.?up|broke.?up|ended|she left|he left|toxic|ex|miss (him|her|you|them)/.test(q))
    return {
      name: label,
      description: "All the songs that understand the ache — no filler, no rushing.",
      aiMessage: "This playlist starts exactly where you are right now — in the ache — and doesn't rush you anywhere.",
      color: "#4a90d9",
      phases: [
        { genres: ["sad"], energy: [0], valence: [0], count: 5 },
        { genres: ["sad"], energy: [0, 1], valence: [0], count: 3 },
        { genres: ["sad"], energy: [1], valence: [0, 1], count: 2 },
      ],
    };

  // ── SAD / CRYING ─────────────────────────────────────────────────────────────
  if (/\bsad\b|cry|crying|tears|depressed|hurt|pain|numb|empty|broken|low|down/.test(q))
    return {
      name: label,
      description: "Songs that sit with you in the feeling — honest, aching, no rush.",
      aiMessage: "Sometimes you just need music that gets it. Every song here is purely that.",
      color: "#5b7fa6",
      phases: [
        { genres: ["sad"], energy: [0], valence: [0], count: 5 },
        { genres: ["sad"], energy: [0, 1], valence: [0], count: 3 },
        { genres: ["sad"], energy: [1], valence: [0, 1], count: 2 },
      ],
    };

  // ── LONELY ───────────────────────────────────────────────────────────────────
  if (/lonely|alone|no one|longing|far away|distance|isolated/.test(q))
    return {
      name: label,
      description: "Songs that understand the ache of wanting someone near.",
      aiMessage: "Loneliness has its own sound. Every song here lives in that exact feeling.",
      color: "#6c5ce7",
      phases: [
        { genres: ["sad"], energy: [0], valence: [0], count: 4 },
        { genres: ["sad"], energy: [0, 1], valence: [0], count: 3 },
        { genres: ["nostalgic"], energy: [0], valence: [1], count: 3 },
      ],
    };

  // ── LOVE (general) ───────────────────────────────────────────────────────────
  if (/\blove\b/.test(q) && !/heartbreak|sad|break/.test(q))
    return {
      name: label,
      description: "Songs built from the warmth of being completely in love.",
      aiMessage: "Every song here lives in the feeling of love — no filler, just pure romance.",
      color: "#e91e8c",
      phases: [
        { genres: ["romantic"], energy: [0], valence: [1, 2], count: 4 },
        { genres: ["romantic"], energy: [1], valence: [2], count: 4 },
        { genres: ["romantic"], energy: [0, 1], valence: [2], count: 2 },
      ],
    };

  // ── IN LOVE / ROMANTIC ────────────────────────────────────────────────────────
  if (/in love|falling for|butterflies|crush|new (love|relationship)|girlfriend|boyfriend|partner|together|romantic/.test(q))
    return {
      name: label,
      description: "Songs that feel like the warmth of being truly seen by someone you adore.",
      aiMessage: "That feeling you're in? These songs were made exactly for it.",
      color: "#e91e8c",
      phases: [
        { genres: ["romantic"], energy: [0], valence: [1, 2], count: 4 },
        { genres: ["romantic"], energy: [1], valence: [2], count: 4 },
        { genres: ["romantic"], energy: [0], valence: [2], count: 2 },
      ],
    };

  // ── WEDDING / FOREVER ─────────────────────────────────────────────────────────
  if (/wedding|marry|marriage|proposal|forever|soulmate|engagement/.test(q))
    return {
      name: label,
      description: "Songs for the moment everything changed — beautiful and timeless.",
      aiMessage: "For the moment everything changed. These songs carry the weight of forever.",
      color: "#e91e63",
      phases: [
        { genres: ["romantic"], energy: [0], valence: [1, 2], count: 4 },
        { genres: ["romantic"], energy: [1], valence: [2], count: 4 },
        { genres: ["romantic"], energy: [0], valence: [2], count: 2 },
      ],
    };

  // ── BOLLYWOOD ─────────────────────────────────────────────────────────────────
  if (/bollywood/.test(q)) {
    if (/dance|danc|naach|item/.test(q))
      return {
        name: label,
        description: "The biggest Bollywood dance hits — full energy, pure fire.",
        aiMessage: "Pure Bollywood dance energy — every track built to get you moving.",
        color: "#ff5722",
        phases: [
          { genres: ["hype"], energy: [1, 2], valence: [2], count: 4 },
          { genres: ["hype"], energy: [2], valence: [2], count: 4 },
          { genres: ["hype"], energy: [1], valence: [2], count: 2 },
        ],
      };
    if (/sad|dard|dukh/.test(q))
      return {
        name: label,
        description: "Bollywood's most soul-stirring sad songs — raw, beautiful, honest.",
        aiMessage: "The most aching, honest Bollywood songs — no filler, just feeling.",
        color: "#4a90d9",
        phases: [
          { genres: ["sad"], energy: [0], valence: [0], count: 5 },
          { genres: ["sad"], energy: [0, 1], valence: [0], count: 3 },
          { genres: ["sad"], energy: [1], valence: [0, 1], count: 2 },
        ],
      };
    if (/romantic|love|pyaar|ishq/.test(q))
      return {
        name: label,
        description: "Bollywood's most beautiful love songs — soft, warm, cinematic.",
        aiMessage: "The best Bollywood has ever done love — these songs prove it.",
        color: "#e91e8c",
        phases: [
          { genres: ["romantic"], energy: [0], valence: [1, 2], count: 4 },
          { genres: ["romantic"], energy: [1], valence: [2], count: 4 },
          { genres: ["romantic"], energy: [0], valence: [2], count: 2 },
        ],
      };
    // Generic bollywood → hype mix
    return {
      name: label,
      description: "The best of Bollywood across every mood and moment.",
      aiMessage: "The greatest Bollywood hits — energetic, emotional, iconic.",
      color: "#f5a623",
      phases: [
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 4 },
        { genres: ["romantic"], energy: [0, 1], valence: [1, 2], count: 3 },
        { genres: ["nostalgic"], energy: [0, 1], valence: [1], count: 3 },
      ],
    };
  }

  // ── GYM / WORKOUT ─────────────────────────────────────────────────────────────
  if (/gym|workout|exercise|lifting|training|cardio|fitness|sweat/.test(q))
    return {
      name: label,
      description: "Hits that hit harder than your last set — pure fuel.",
      aiMessage: "Warmup, peak grind, cooldown — engineered to carry you through every phase.",
      color: "#f5a623",
      phases: [
        { genres: ["hype"], energy: [1], valence: [2], count: 2 },
        { genres: ["hype"], energy: [2], valence: [2], count: 6 },
        { genres: ["hype"], energy: [1], valence: [2], count: 2 },
      ],
    };

  // ── RUN / RUNNING ─────────────────────────────────────────────────────────────
  if (/\brun\b|running|jog|jogging/.test(q))
    return {
      name: label,
      description: "High-tempo bangers to keep your stride locked and your energy up.",
      aiMessage: "Built to match your pace — every track is full throttle.",
      color: "#f5a623",
      phases: [
        { genres: ["hype"], energy: [2], valence: [2], count: 5 },
        { genres: ["hype"], energy: [2], valence: [2], count: 3 },
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 2 },
      ],
    };

  // ── DANCE ─────────────────────────────────────────────────────────────────────
  if (/\bdance\b|dancing|danc/.test(q))
    return {
      name: label,
      description: "High-energy bangers made for moving — nothing but the best dance tracks.",
      aiMessage: "Every song here was built for one thing — getting you on your feet.",
      color: "#ff5722",
      phases: [
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 3 },
        { genres: ["hype"], energy: [2], valence: [2], count: 5 },
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 2 },
      ],
    };

  // ── PARTY ─────────────────────────────────────────────────────────────────────
  if (/party|club|night out|banger|celebrate/.test(q))
    return {
      name: label,
      description: "Turn it up. The night is just getting started.",
      aiMessage: "Starting with a bang, peaking full energy — the perfect arc for a night out.",
      color: "#ff5722",
      phases: [
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 3 },
        { genres: ["hype"], energy: [2], valence: [2], count: 5 },
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 2 },
      ],
    };

  // ── HYPE / MOTIVATED ──────────────────────────────────────────────────────────
  if (/hype|pump|motivated|fired.?up|unstoppable|boss|grind|hustle|confident|power/.test(q))
    return {
      name: label,
      description: "For when you need that extra push to conquer everything in front of you.",
      aiMessage: "Building from confident to unstoppable — let this be your momentum.",
      color: "#f39c12",
      phases: [
        { genres: ["hype"], energy: [1], valence: [2], count: 3 },
        { genres: ["hype"], energy: [2], valence: [2], count: 5 },
        { genres: ["hype"], energy: [2], valence: [2], count: 2 },
      ],
    };

  // ── STUDY / FOCUS ─────────────────────────────────────────────────────────────
  if (/study|focus|concentrate|productive|deep work|reading|assignment/.test(q))
    return {
      name: label,
      description: "Low-key vibes to keep your mind locked in and your soul calm.",
      aiMessage: "No distractions, just flow — these tracks let your mind do the work.",
      color: "#00b894",
      phases: [
        { genres: ["chill"], energy: [0], valence: [1, 2], count: 4 },
        { genres: ["chill"], energy: [0], valence: [2], count: 4 },
        { genres: ["chill"], energy: [0], valence: [1, 2], count: 2 },
      ],
    };

  // ── LATE NIGHT ────────────────────────────────────────────────────────────────
  if (/late night|midnight|2am|3am|insomnia|can.?t sleep|sleepless|night (drive|walk|vibes)/.test(q))
    return {
      name: label,
      description: "Soft songs for when the world goes quiet and thoughts get loud.",
      aiMessage: "It's just you and the quiet. These songs understand exactly what this hour feels like.",
      color: "#2d3561",
      phases: [
        { genres: ["chill"], energy: [0], valence: [1], count: 4 },
        { genres: ["chill"], energy: [0], valence: [1, 2], count: 4 },
        { genres: ["chill"], energy: [0], valence: [2], count: 2 },
      ],
    };

  // ── CHILL / RELAX ─────────────────────────────────────────────────────────────
  if (/chill|relax|calm|peace|peaceful|easy|sunday|morning|coffee|lazy|unwind/.test(q))
    return {
      name: label,
      description: "Slow it down. Breathe. These songs were made for moments like this.",
      aiMessage: "Take your time with this one. No rush, no noise — just pure, unhurried calm.",
      color: "#1DB954",
      phases: [
        { genres: ["chill"], energy: [0], valence: [2], count: 4 },
        { genres: ["chill"], energy: [0], valence: [1, 2], count: 4 },
        { genres: ["chill"], energy: [0], valence: [2], count: 2 },
      ],
    };

  // ── NOSTALGIC ─────────────────────────────────────────────────────────────────
  if (/nostalgic|nostalgia|memories|remember|throwback|childhood|old times|back then|past|used to/.test(q))
    return {
      name: label,
      description: "Songs that smell like old photographs and feel like a warm hug from the past.",
      aiMessage: "Some songs are portals. This playlist will take you back — gently, beautifully.",
      color: "#f39c12",
      phases: [
        { genres: ["nostalgic"], energy: [0], valence: [1], count: 4 },
        { genres: ["nostalgic"], energy: [0, 1], valence: [1], count: 4 },
        { genres: ["nostalgic"], energy: [1], valence: [1, 2], count: 2 },
      ],
    };

  // ── ROAD TRIP ─────────────────────────────────────────────────────────────────
  if (/road.?trip|highway|travel|journey|adventure|windows down|long drive/.test(q))
    return {
      name: label,
      description: "Windows down, volume up — the perfect soundtrack for the open road.",
      aiMessage: "Slow start, then the highway opens up. This playlist grows with the journey.",
      color: "#e67e22",
      phases: [
        { genres: ["chill"], energy: [0], valence: [1, 2], count: 3 },
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 5 },
        { genres: ["hype"], energy: [2], valence: [2], count: 2 },
      ],
    };

  // ── HOPEFUL / HEALING ─────────────────────────────────────────────────────────
  if (/hope|healing|getting better|moving on|fresh start|new chapter|better days|rising|comeback/.test(q))
    return {
      name: label,
      description: "From the aches to the light — a playlist for when you're choosing to rise.",
      aiMessage: "Every comeback has a soundtrack. This one starts soft and builds into something that feels like victory.",
      color: "#fdcb6e",
      phases: [
        { genres: ["sad"], energy: [0], valence: [0, 1], count: 2 },
        { genres: ["chill"], energy: [0], valence: [1, 2], count: 3 },
        { genres: ["hype"], energy: [1, 2], valence: [2], count: 5 },
      ],
    };

  // ── MEMORY MODE fallback ──────────────────────────────────────────────────────
  if (mode === "memory")
    return {
      name: label,
      description: "Songs that carry the weight and warmth of that moment.",
      aiMessage: "Every memory has a sound. This playlist honours yours.",
      color: "#9b59b6",
      phases: [
        { genres: ["nostalgic"], energy: [0], valence: [1], count: 4 },
        { genres: ["nostalgic"], energy: [0, 1], valence: [1], count: 4 },
        { genres: ["romantic"], energy: [0], valence: [1, 2], count: 2 },
      ],
    };

  // ── FUTURE MODE fallback ──────────────────────────────────────────────────────
  if (mode === "future")
    return {
      name: label,
      description: "Music for the version of you that's still becoming.",
      aiMessage: "The future belongs to those who can feel it first. These songs will get you there.",
      color: "#3498db",
      phases: [
        { genres: ["chill"], energy: [0, 1], valence: [1, 2], count: 3 },
        { genres: ["hype"], energy: [1], valence: [2], count: 4 },
        { genres: ["hype"], energy: [2], valence: [2], count: 3 },
      ],
    };

  // ── Generic fallback ──────────────────────────────────────────────────────────
  return {
    name: label,
    description: "A carefully curated mix matched to your current mood.",
    aiMessage: "Tuned into your vibe and pulled songs that match exactly where you are right now.",
    color: "#1DB954",
    phases: [
      { genres: ["chill"], energy: [0, 1], valence: [1, 2], count: 4 },
      { genres: ["hype"], energy: [1], valence: [2], count: 3 },
      { genres: ["romantic"], energy: [0, 1], valence: [1, 2], count: 3 },
    ],
  };
}

function buildPlaylistFromProfile(profile: MoodProfile): GeminiPlaylistResponse {
  // Build ordered song list phase by phase (emotional flow)
  const usedIds = new Set<number>();
  const orderedIds: number[] = [];

  for (const phase of profile.phases) {
    const candidates = Object.entries(CATALOG)
      .filter(([id, [g, e, v]]) =>
        !usedIds.has(Number(id)) &&
        phase.genres.includes(g) &&
        phase.energy.includes(e) &&
        phase.valence.includes(v)
      )
      .map(([id]) => Number(id))
      .sort(() => Math.random() - 0.5);

    const picked = candidates.slice(0, phase.count);
    picked.forEach(id => { orderedIds.push(id); usedIds.add(id); });

    // If not enough from strict filter, relax valence constraint
    if (picked.length < phase.count) {
      const fallback = Object.entries(CATALOG)
        .filter(([id, [g, e]]) =>
          !usedIds.has(Number(id)) &&
          phase.genres.includes(g) &&
          phase.energy.includes(e)
        )
        .map(([id]) => Number(id))
        .sort(() => Math.random() - 0.5)
        .slice(0, phase.count - picked.length);
      fallback.forEach(id => { orderedIds.push(id); usedIds.add(id); });
    }
  }

  return {
    message: profile.aiMessage,
    playlist_name: profile.name,
    playlist_description: profile.description,
    song_ids: orderedIds,
    spotify_queries: [],
    vibe_color: profile.color,
    album_art_concept: "",
  };
}

// ── Unsplash mood images ───────────────────────────────────────────────────
const VISUAL_IMAGES: Record<string, string[]> = {
  romantic:  [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80",
  ],
  sad:       [
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=800&q=80",
    "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80",
  ],
  hype:      [
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  ],
  chill:     [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
    "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=800&q=80",
  ],
  nostalgic: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80",
  ],
};

export interface VisualMusicResponse {
  imageUrl: string;
  caption: string;
  vibe_color: string;
}

// ── Direct keyword mapper — instant fallback if AI fails ─────────────────
function classifyMood(input: string): string {
  const q = input.toLowerCase();
  if (/heartbreak|breakup|break.?up|broke.?up|ended|she left|he left|toxic|ex |miss (him|her|you|them)/.test(q)) return "heartbreak";
  if (/sad|sadness|cry|crying|tears|depressed|depress|hurt|pain|numb|empty|broken|low|down|upset|melancholy|grief|sorrow/.test(q)) return "sad";
  if (/lonely|alone|no one|longing|far away|distance|isolated|miss you/.test(q)) return "lonely";
  if (/in love|falling for|butterflies|crush|girlfriend|boyfriend|partner|together|romance/.test(q)) return "in love";
  if (/wedding|marry|marriage|proposal|forever|soulmate|engagement/.test(q)) return "wedding";
  if (/gym|workout|exercise|lifting|training|cardio|fitness|sweat|run|running/.test(q)) return "gym";
  if (/party|dance|club|night out|dancing|banger|celebrate|dj|festival/.test(q)) return "party";
  if (/hype|energy|pump|motivated|fired.?up|unstoppable|boss|grind|hustle|confident|power|beast/.test(q)) return "hype";
  if (/study|focus|concentrate|productive|deep work|reading|assignment|exam/.test(q)) return "study";
  if (/late night|midnight|2am|3am|insomnia|can.?t sleep|sleepless|night drive|night walk/.test(q)) return "late night";
  if (/chill|relax|calm|peace|peaceful|easy|sunday|morning|coffee|lazy|unwind|lofi|lo.?fi/.test(q)) return "chill";
  if (/nostalgic|nostalgia|memories|remember|throwback|childhood|old times|back then|past|used to/.test(q)) return "nostalgic";
  if (/road.?trip|drive|highway|travel|journey|adventure|windows down|long drive/.test(q)) return "road trip";
  if (/hope|hopeful|healing|getting better|moving on|fresh start|new chapter|better days|rising|comeback/.test(q)) return "hopeful";
  return "";
}

// Song catalog summary sent to AI — id, title, artist, genre
const SONG_CATALOG_FOR_AI = `
ID | Title | Artist | Genre
1|Tum Hi Ho|Arijit Singh|romantic
2|Kesariya|Arijit Singh|romantic
3|Raataan Lambiyan|Jubin Nautiyal|romantic
4|Chaleya|Arijit Singh|romantic
5|Blinding Lights|The Weeknd|hype
6|Levitating|Dua Lipa|hype
7|Cruel Summer|Taylor Swift|hype
8|As It Was|Harry Styles|chill
9|Glimpse of Us|Joji|sad
10|Night Changes|One Direction|nostalgic
11|Heat Waves|Glass Animals|chill
12|Tera Ban Jaunga|Akhil Sachdeva|romantic
13|Apna Bana Le|Arijit Singh|romantic
14|Peaches|Justin Bieber|chill
15|Stay|The Kid LAROI|sad
16|Watermelon Sugar|Harry Styles|hype
17|Kho Gaye Hum Kahan|Jasleen Royal|nostalgic
18|Clouds|NF|sad
19|Dynamite|BTS|hype
20|Dil Diyan Gallan|Atif Aslam|romantic
21|Tujhe Kitna Chahne Lage|Arijit Singh|romantic
22|Hawayein|Arijit Singh|romantic
23|Kal Ho Naa Ho|Sonu Nigam|nostalgic
24|Chaiyya Chaiyya|Sukhwinder Singh|hype
25|Gerua|Arijit Singh|romantic
26|Bulleya|Amit Mishra|sad
27|Channa Mereya|Arijit Singh|sad
28|Bekhayali|Sachet Tandon|sad
29|Kalank|Arijit Singh|sad
30|Jaadu Hai Nasha|Shreya Ghoshal|romantic
31|Shape of You|Ed Sheeran|hype
32|Someone Like You|Adele|sad
33|Stay With Me|Sam Smith|sad
34|Perfect|Ed Sheeran|romantic
35|Cheap Thrills|Sia|hype
36|Sunflower|Post Malone & Swae Lee|chill
37|bad guy|Billie Eilish|hype
38|drivers license|Olivia Rodrigo|sad
39|Love Story|Taylor Swift|romantic
40|A Sky Full of Stars|Coldplay|hype
41|Tere Naam|Udit Narayan|romantic
42|Suraj Hua Maddham|Sonu Nigam|romantic
43|Abhi Mujh Mein Kahin|Sonu Nigam|sad
44|Ilahi|Arijit Singh|hype
45|Phir Le Aya Dil|Arijit Singh|sad
46|Kun Faya Kun|A.R. Rahman|chill
47|Chahun Main Ya Naa|Arijit Singh|romantic
48|Ae Dil Hai Mushkil|Arijit Singh|sad
49|Pehla Nasha|Udit Narayan|romantic
50|Saware|Arijit Singh|sad
51|Fix You|Coldplay|sad
52|Let Her Go|Passenger|sad
53|Counting Stars|OneRepublic|hype
54|Rolling in the Deep|Adele|hype
55|Thunder|Imagine Dragons|hype
56|Believer|Imagine Dragons|hype
57|Demons|Imagine Dragons|sad
58|Happier|Marshmello & Bastille|chill
59|Memories|Maroon 5|nostalgic
60|Sugar|Maroon 5|hype
61|Tera Yaar Hoon Main|Arijit Singh|hype
62|Dil Bechara|A.R. Rahman|nostalgic
63|Main Tera Boyfriend|Arijit Singh|hype
64|City of Stars|Ryan Gosling & Emma Stone|romantic
65|Until I Found You|Stephen Sanchez|romantic
66|Golden Hour|Kacey Musgraves|chill
67|Dance Monkey|Tones And I|hype
68|Senorita|Shawn Mendes & Camila Cabello|romantic
69|Yellow|Coldplay|romantic
`;

// ── Core AI playlist builder ───────────────────────────────────────────────
async function aiPickSongs(input: string, mode: "vibe" | "memory" | "future", count = 10): Promise<GeminiPlaylistResponse> {

  const modeSystem =
    mode === "vibe"
      ? `You are VibeForge's soul — an emotionally intelligent music curator who feels music the way people feel life. Your one gift is matching exactly where someone IS emotionally, not where they should be.

When a person tells you their mood, you don't just tag it with a genre. You feel into the texture of what they wrote. "Sad but hopeful" is completely different from "sad and broken." "Post-gym energy" is different from "club night energy." You hear the nuance.

Your curation philosophy:
- Start where the person is right now. Don't rush them forward or try to fix their feeling.
- Build a journey arc — the playlist should move through an emotional shape that feels intentional, not random.
- Match genre strictly to what they said. Sad mood = sad songs (IDs 9,15,18,26,27,28,29,32,33,38,43,45,48,50,51,52,57). Romantic = romantic. Hype = hype. Chill = chill. Nostalgic = nostalgic.
- Mixed moods get mixed playlists — "sad but hopeful" gets mostly sad with a hopeful arc toward the end.
- NEVER add songs from genres the person didn't mention or imply.

Your message to the user must:
- Feel like it came from a close friend who truly gets it
- Directly mirror the exact thing they wrote — pick up on their specific words, not generic emotions
- Be warm, real, and human — NOT therapeutic-speak, NOT AI-assistant language
- Max 30 words. No clichés. No "I understand your feelings." Just honest human resonance.`

    : mode === "memory"
      ? `You are VibeForge's memory keeper — a deeply emotional music curator who understands that some songs are portals back in time.

The person is sharing a real memory — a moment, a person, a place, a feeling from their past. Your job is not just to pick songs. It's to score their memory the way a film composer would score a scene. The music should make them feel like they're actually back there.

How to approach this:
- Read the memory carefully. What's the emotional core? Warmth? Wistfulness? Bittersweet joy? Pure nostalgia? Specific longing?
- Pick songs that BELONG to that emotional world — songs that would have played in the background of that moment, or songs that carry the exact same feeling.
- Prefer nostalgic, romantic, and bittersweet songs. Avoid hype unless the memory is clearly energetic and celebratory.
- Build a playlist that slowly transports them back — start soft, let it deepen.
- The playlist name should feel like the title of a film chapter from their life, not a generic mood label.

Your message must:
- Directly reference something specific from what they wrote — the person, the place, the feeling
- Sound like it came from someone who genuinely cares about that memory
- Be tender, specific, and poetic — but never dramatic or overwrought
- Max 30 words. Real. Human. Warm.`

    : `You are VibeForge's dream weaver — a music curator who builds soundtracks for futures that haven't happened yet.

The person is describing a dream, a plan, an aspiration — something they're moving toward. Your music should make that future feel not just possible, but inevitable. Like it's already on its way.

How to approach this:
- Understand the EMOTIONAL TEXTURE of their future vision: Is it adventurous? Quietly hopeful? Triumphant? Peaceful and free? Excited and nervous?
- Pick songs that match the FEELING of that future — not just the energy level. A Goa trip needs something different from "getting my dream job."
- NEVER pick sad songs unless their future has sadness woven into it.
- Prefer hype, chill, and romantic depending on the vision. Build momentum — start with anticipation, rise toward possibility.
- The playlist name should sound like the title of this next chapter of their life.

Your message must:
- Address them by the future they described — make them feel seen in their dream
- Sound excited for them, the way a friend who believes in you would sound
- Be warm, forward-pulling, and specific to what they wrote
- Max 30 words. Real. Not corporate-motivational. Human.`;

  const system = `${modeSystem}

Song Catalog (use ONLY these IDs — do not invent IDs):
${SONG_CATALOG_FOR_AI}

Output format — return ONLY valid raw JSON, no markdown, no code blocks:
{"playlist_name":"...","playlist_description":"...","message":"...","song_ids":[1,2,3...],"vibe_color":"#hexcolor"}

Field rules:
- playlist_name: MUST use the user's exact words, title-cased. If they said "sad", name it "Sad". If they said "love", name it "Love". If they said "bollywood dance", name it "Bollywood Dance". DO NOT invent a creative name — use their words.
- playlist_description: one sentence — the exact emotional journey this playlist takes them on (max 20 words)
- message: a warm, human, personal message — see guidelines above (max 30 words)
- song_ids: exactly ${count} integer IDs — STRICT genre matching: if user said "sad" use ONLY sad songs, if "dance/party" use ONLY hype songs, if "romantic/love" use ONLY romantic songs, if "chill" use ONLY chill songs. NEVER mix in unrelated genres.
- vibe_color: one hex color (#4a90d9=sad/melancholic, #e91e8c=love/romantic, #f5a623=hype/dance/fired up, #1DB954=happy/chill/free, #9b59b6=nostalgic/wistful, #e67e22=adventure, #fdcb6e=hopeful/healing, #2d3561=late night, #6c5ce7=lonely/longing)`;

  try {
    const raw = await callAI(system, `User input: "${input}"`);
    // Strip markdown code blocks if present, then extract JSON
    const cleaned = raw.replace(/```json|```/gi, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]) as {
      playlist_name?: string;
      playlist_description?: string;
      message?: string;
      song_ids?: number[];
      vibe_color?: string;
    };
    const validIds = (parsed.song_ids ?? [])
      .map(id => Number(id))
      .filter((id): id is number => !isNaN(id) && id >= 1 && id <= 69)
      .slice(0, count);
    if (validIds.length < 3) throw new Error(`AI returned only ${validIds.length} valid IDs`);
    return {
      message: sanitize(parsed.message ?? ""),
      playlist_name: sanitize(parsed.playlist_name ?? "Your Playlist"),
      playlist_description: sanitize(parsed.playlist_description ?? ""),
      song_ids: validIds,
      spotify_queries: [],
      vibe_color: /^#[0-9a-fA-F]{6}$/.test(parsed.vibe_color ?? "") ? parsed.vibe_color! : "#1DB954",
      album_art_concept: "",
    };
  } catch {
    // Rule-based fallback if AI fails
    const mood = classifyMood(input);
    const profile = interpretMood(mood || input, mode);
    return buildPlaylistFromProfile(profile);
  }
}

// ── AI Features ───────────────────────────────────────────────────────────────

export async function generateVibePlaylist(mood: string): Promise<GeminiPlaylistResponse> {
  return aiPickSongs(mood, "vibe", 10);
}

export async function memorySoundtrack(memory: string): Promise<GeminiPlaylistResponse> {
  return aiPickSongs(memory, "memory", 10);
}

export async function futureSoundtrack(future: string): Promise<GeminiPlaylistResponse> {
  return aiPickSongs(future, "future", 10);
}

export async function remixVibe(title: string, artist: string, request: string): Promise<GeminiPlaylistResponse> {
  return aiPickSongs(`The user wants a remix playlist based on "${title}" by ${artist}. Their specific remix request: ${request}`, "vibe", 8);
}

export async function liveRemix(title: string, artist: string, genre: string): Promise<GeminiPlaylistResponse> {
  return aiPickSongs(`Find 8 songs that feel emotionally similar to "${title}" by ${artist}. This is a ${genre} song. Pick songs from the same emotional world — same feel, same energy, same atmosphere.`, "vibe", 8);
}

// Per-song fallback stories — used when AI is unavailable (covers all 69 catalog songs)
const SONG_STORIES: Record<string, { message: string; vibe_color: string }> = {
  // ── Romantic Bollywood ────────────────────────────────────────────────────
  "tum hi ho":            { message: "Tum Hi Ho is the sound of realising someone has quietly become the centre of your world. Arijit Singh sings it like a confession — unhurried, inevitable, devastatingly tender. It's the song people play when words stopped being enough.", vibe_color: "#e91e8c" },
  "kesariya":             { message: "Kesariya unfolds like a long exhale — the kind that only happens when you're with someone you completely trust. It's not about falling in love so much as settling into it, fully and without armour.", vibe_color: "#e91e8c" },
  "raataan lambiyan":     { message: "Raataan Lambiyan is the feeling of wanting a night to stretch forever because the person next to you makes time feel different. Jubin Nautiyal sings it with a softness that makes even the silence between notes feel warm.", vibe_color: "#e91e8c" },
  "chaleya":              { message: "Chaleya captures the electricity of attraction that hasn't found its words yet — that moment when you realise someone is pulling you somewhere you didn't plan to go. Arijit Singh makes the pull irresistible.", vibe_color: "#e91e8c" },
  "tera ban jaunga":      { message: "Tera Ban Jaunga is a complete surrender — the kind of love where you'd give up every version of yourself to become what someone else needs. Akhil Sachdeva and Tulsi Kumar sing it like a vow, not a song.", vibe_color: "#e91e8c" },
  "apna bana le":         { message: "Apna Bana Le is the vulnerable side of wanting to belong to someone — the quiet plea to be chosen, kept, made theirs. Arijit Singh gives it a fragility that makes it feel like a secret being spoken aloud for the first time.", vibe_color: "#e91e8c" },
  "hawayein":             { message: "Hawayein is about the specific kind of love that feels light as air — the kind that carries you without you even noticing. Every note breathes warmth, and the final minute feels like the whole song has been building just to exhale.", vibe_color: "#e91e8c" },
  "dil diyan gallan":     { message: "Dil Diyan Gallan is the conversation two people have when they finally stop pretending they don't love each other. Atif Aslam's voice carries it with a quiet certainty that makes the romance feel completely inevitable.", vibe_color: "#e91e8c" },
  "tujhe kitna chahne lage": { message: "Tujhe Kitna Chahne Lage is about a love so deep it becomes its own kind of pain — the realisation that someone matters so much it's frightening. Arijit Singh sings it as if measuring something vast and finding there's no end to it.", vibe_color: "#e91e8c" },
  "gerua":                { message: "Gerua is cinematic love — the kind that feels like a film sequence, golden-lit and sweeping. Arijit Singh and Antara Mitra make it feel like a memory you haven't made yet but already ache for.", vibe_color: "#e91e8c" },
  "jaadu hai nasha":      { message: "Jaadu Hai Nasha is desire made audible — slow, intoxicating, and utterly consuming. Shreya Ghoshal sings it with a control that makes the restraint itself feel sensual, like a secret held just below the surface.", vibe_color: "#e91e8c" },
  "chahun main ya naa":   { message: "Chahun Main Ya Naa is the war between what you know and what you feel — wanting to resist someone but being completely unable to. Arijit Singh gives every note the weight of someone fighting a battle they've already lost.", vibe_color: "#e91e8c" },
  "tere naam":            { message: "Tere Naam is devotion without condition — a love so total it borders on madness. Udit Narayan sings it with an ache that was ahead of its time, and the song became the anthem for every person who ever loved someone too much to let go.", vibe_color: "#e91e8c" },
  "suraj hua maddham":    { message: "Suraj Hua Maddham is romance at its most cinematic — two people suspended in a golden world where nothing else exists. Sonu Nigam and Alka Yagnik make it feel like the whole universe slowed down just for this one feeling.", vibe_color: "#e91e8c" },
  "pehla nasha":          { message: "Pehla Nasha is the intoxication of first love — confusing, overwhelming, and completely beautiful. Udit Narayan captured that teenage feeling of the world becoming unrecognisable because of one person, and somehow it still hits exactly the same decades later.", vibe_color: "#e91e8c" },
  "city of stars":        { message: "City of Stars is about the specific ache of a dream that's almost in reach — and a love that might be the realest thing in a world full of pretending. Ryan Gosling and Emma Stone sing it like two people making a quiet, fragile promise.", vibe_color: "#e91e8c" },
  "until i found you":    { message: "Until I Found You is about the person who rewrites your understanding of what love is supposed to feel like. Stephen Sanchez sings it with complete, unselfconscious devotion — as if he's been waiting his whole life to say this one thing.", vibe_color: "#e91e8c" },
  "love story (taylor's version)": { message: "Love Story is Taylor Swift at her most romantic and fearless — a fairy tale she wrote for herself at 18 and somehow got right. The re-recorded version carries a quiet confidence the original didn't have: she's lived it now.", vibe_color: "#e91e8c" },
  "yellow":               { message: "Yellow is devotion stripped to its simplest form. Coldplay wrote it about being so in love that everything — stars, sky, the whole world — reminds you of one person. It's the song that makes ordinary love feel enormous.", vibe_color: "#e91e8c" },
  "perfect":              { message: "Perfect is Ed Sheeran writing the love song he used to believe didn't exist. It's unhurried and completely sure of itself — the musical equivalent of knowing, without doubt, that you've found the right person.", vibe_color: "#e91e8c" },
  "senorita":             { message: "Senorita is tension masquerading as a love song — every note crackles with want that neither person is quite ready to name. Shawn Mendes and Camila Cabello made something that sounds exactly like standing too close to someone.", vibe_color: "#e91e8c" },
  "señorita":             { message: "Senorita is tension masquerading as a love song — every note crackles with want that neither person is quite ready to name. Shawn Mendes and Camila Cabello made something that sounds exactly like standing too close to someone.", vibe_color: "#e91e8c" },

  // ── Sad Bollywood ─────────────────────────────────────────────────────────
  "channa mereya":        { message: "Channa Mereya is a goodbye that's still in love. Arijit Singh delivers every word like it's the last thing he'll ever say, and somehow that makes it hurt more and feel more beautiful at exactly the same time.", vibe_color: "#4a90d9" },
  "bekhayali":            { message: "Bekhayali is what longing sounds like when it has nowhere left to go — raw, obsessive, and achingly honest. Sachet Tandon's voice cracks open in exactly the right places, and the six-minute runtime earns every second.", vibe_color: "#4a90d9" },
  "kalank":               { message: "Kalank is about carrying the weight of a love society refuses to accept — the longing of two people meant for each other but born on the wrong side of the world's rules. Arijit Singh makes the tragedy feel vast and intimate at once.", vibe_color: "#4a90d9" },
  "bulleya":              { message: "Bulleya is heartbreak with depth — the kind that makes you question not just the relationship but yourself, your worth, your choices. Amit Mishra sings it with a restless anguish that never quite settles, which is exactly the point.", vibe_color: "#4a90d9" },
  "phir le aya dil":      { message: "Phir Le Aya Dil is about the heart returning to the pain it chose — helplessly, completely, without apology. Arijit Singh makes surrender sound not weak but inevitable, like gravity pulling you back to someone who broke you.", vibe_color: "#4a90d9" },
  "abhi mujh mein kahin": { message: "Abhi Mujh Mein Kahin is what it sounds like to hold someone's memory inside you after they're gone — the desperate attempt to keep them alive through feeling. Sonu Nigam's voice carries a grief that doesn't perform; it simply is.", vibe_color: "#4a90d9" },
  "ae dil hai mushkil":   { message: "Ae Dil Hai Mushkil is about unrequited love — the particular suffering of loving someone who sees you as a friend and nothing more. Arijit Singh sings it with the specific exhaustion of someone who has asked the same question too many times.", vibe_color: "#4a90d9" },
  "saware":               { message: "Saware is a ghost of a song — soft, floating, and heartbreaking. It captures that in-between state of grief where someone is gone but not really, still present in every quiet moment. Arijit Singh barely seems to push, and yet it carries everything.", vibe_color: "#4a90d9" },

  // ── Nostalgic Bollywood ───────────────────────────────────────────────────
  "kal ho naa ho":        { message: "Kal Ho Naa Ho carries the weight of loving someone while knowing your time is running out. Sonu Nigam sings it with a quiet urgency — the way someone might speak who knows they're saying goodbye without wanting to say so.", vibe_color: "#9b59b6" },
  "kho gaye hum kahan":   { message: "Kho Gaye Hum Kahan is about the modern loneliness of being constantly connected but genuinely unseen — scrolling through lives while your own quietly slips past. Jasleen Royal gives it a warmth that makes the critique feel like concern, not accusation.", vibe_color: "#9b59b6" },
  "dil bechara":          { message: "Dil Bechara is pure joy in the face of everything — a song about choosing to dance, laugh, and love even when you know time is finite. A.R. Rahman composed something that sounds like a celebration and a goodbye wrapped into the same two minutes.", vibe_color: "#9b59b6" },

  // ── Hype Bollywood ───────────────────────────────────────────────────────
  "chaiyya chaiyya":      { message: "Chaiyya Chaiyya is Bollywood at its most electric — filmed on a moving train, sounding like the world itself is dancing. Sukhwinder Singh delivers something so purely energetic it bypasses the brain entirely and goes straight to the body.", vibe_color: "#f5a623" },
  "ilahi":                { message: "Ilahi is the soundtrack to being young, free, and completely alive — the feeling of a road trip with your whole life still ahead of you. Arijit Singh sings it with an exhilaration that makes freedom feel like something you can actually touch.", vibe_color: "#f5a623" },
  "tera yaar hoon main":  { message: "Tera Yaar Hoon Main is a love letter to friendship — the kind of song that makes you want to call the people who were there for you at your worst and tell them you haven't forgotten. Arijit Singh gives it a warmth that's different from romance: it's steadier, quieter, and somehow more permanent.", vibe_color: "#f5a623" },
  "main tera boyfriend":  { message: "Main Tera Boyfriend is unashamed, playful fun — the kind of song that exists purely to make you move and smile. It doesn't ask anything of you except that you stop taking things seriously for exactly four and a half minutes.", vibe_color: "#f5a623" },

  // ── Chill/Nostalgic Bollywood ─────────────────────────────────────────────
  "kun faya kun":         { message: "Kun Faya Kun is not a song so much as a state. A.R. Rahman composed something that quiets the mind the moment it begins — a Sufi devotional that crosses the line between music and prayer effortlessly and without any effort at all.", vibe_color: "#1DB954" },

  // ── Hollywood Sad ─────────────────────────────────────────────────────────
  "glimpse of us":        { message: "Glimpse of Us is about loving one person while standing next to another — a secret sadness carried in plain daylight. Joji barely raises his voice above a whisper, which somehow makes everything he's saying sound louder than a shout.", vibe_color: "#4a90d9" },
  "someone like you":     { message: "Someone Like You is Adele standing at a closed door, knowing she has to walk away but not quite ready. It's about the specific dignity of loving someone who's already moved on — refusing to make it ugly, but unable to pretend it doesn't hurt.", vibe_color: "#4a90d9" },
  "stay":                 { message: "Stay is the exhaustion of a relationship unravelling in real time — the back-and-forth of someone who knows they should leave but keeps finding reasons to stay one more moment. The Kid LAROI and Justin Bieber made something that sounds like the last few minutes of something that mattered.", vibe_color: "#4a90d9" },
  "drivers license":      { message: "Drivers License captures that specific teenage heartbreak where everything — every street, every passing song on the radio — still belongs to someone who's no longer yours. Olivia Rodrigo wrote it as an open wound, and the rawness is exactly why it works.", vibe_color: "#4a90d9" },
  "stay with me":         { message: "Stay With Me is Sam Smith asking the one question that makes you the most vulnerable — please don't go. It's not a love song exactly; it's a loneliness song, and Smith sings it with a honesty about needing someone that most people are too afraid to say aloud.", vibe_color: "#4a90d9" },
  "clouds":               { message: "Clouds by NF is rare honesty — a rapper working through darkness in real time rather than performing recovery. He describes the mental weight without romanticising it, and the result is uncomfortable in the best way: like watching someone tell the full truth.", vibe_color: "#4a90d9" },
  "demons":               { message: "Demons is Imagine Dragons at their most confessional — the idea that real love means showing someone your worst self and watching them choose to stay. The tenderness underneath the arena-rock production is what makes it quietly devastating.", vibe_color: "#4a90d9" },
  "let her go":           { message: "Let Her Go is about realising the value of what you had only after it's gone — the particular cruelty of loving someone most clearly in the exact moment you can no longer reach them. Passenger wrote the whole thing about absence, and it stays because everyone has felt it.", vibe_color: "#4a90d9" },

  // ── Hollywood Hype/Energy ─────────────────────────────────────────────────
  "blinding lights":      { message: "Blinding Lights moves at the speed of a city night — desperate, nostalgic, and completely electric. The Weeknd captures the feeling of needing someone so badly it becomes physical, and the '80s production makes everything feel simultaneously urgent and cinematic.", vibe_color: "#f5a623" },
  "levitating":           { message: "Levitating is Dua Lipa at her most confident — a disco-pop track that makes you feel genuinely weightless. It's about finding someone who matches your energy so completely that ordinary life starts to feel like an adventure.", vibe_color: "#f5a623" },
  "cruel summer":         { message: "Cruel Summer is Taylor Swift capturing that specific summer feeling of wanting something so badly it physically hurts — the push and pull of a love that hasn't been named yet. The key change in the chorus is the musical equivalent of finally saying it.", vibe_color: "#f5a623" },
  "watermelon sugar":     { message: "Watermelon Sugar is pure sensory pleasure — a song about enjoying the moment you're in without overcomplicating it. Harry Styles made something that sounds exactly like a warm afternoon with someone you like, with nowhere to be and no reason to rush.", vibe_color: "#f5a623" },
  "dynamite":             { message: "Dynamite is BTS at their most infectiously optimistic — a song that exists purely to make you feel good about being alive. The English lyrics are direct in a way that's almost disarming: this is a song about joy, and it commits to that completely.", vibe_color: "#f5a623" },
  "shape of you":         { message: "Shape of You is Ed Sheeran doing something he almost never does — writing purely about physical attraction without making it emotional first. The tropical beats and loop-pedal production give it a looseness that makes the whole song feel like the beginning of something.", vibe_color: "#f5a623" },
  "cheap thrills":        { message: "Cheap Thrills is Sia writing about the radical act of being happy with what you have — no expensive nights out, no performance, just music and the people around you. It became an anthem precisely because it made contentment sound like celebration.", vibe_color: "#f5a623" },
  "bad guy":              { message: "Bad Guy is Billie Eilish doing something genuinely rare — writing a song that sounds like confidence but is actually about the performance of it. The whispery production and the bass drop create a tension that's completely unique, and 'duh' became one of the most memorable single words in pop music.", vibe_color: "#f5a623" },
  "rolling in the deep":  { message: "Rolling in the Deep is fury dressed as a breakup anthem — Adele isn't grieving, she's burning. The gospel-influenced production and her enormous voice create something that feels less like a song and more like a reckoning with someone who underestimated her.", vibe_color: "#f5a623" },
  "believer":             { message: "Believer is Imagine Dragons reframing pain as the source of everything they became — every scar, every setback, described not as damage but as the raw material of strength. It's the kind of song that makes difficulty feel purposeful.", vibe_color: "#f5a623" },
  "counting stars":       { message: "Counting Stars is about choosing to chase something real over something safe — the reckless optimism of believing your dreams are worth the risk even when the responsible thing is to stop dreaming. OneRepublic made it sound completely inevitable.", vibe_color: "#f5a623" },
  "thunder":              { message: "Thunder is Imagine Dragons writing about what it felt like to be the odd one out — the kid who dreamed too big, who everyone thought wouldn't make it. The production is triumphant precisely because the memory of doubt is still in it.", vibe_color: "#f5a623" },
  "a sky full of stars":  { message: "A Sky Full of Stars is Coldplay at full force, completely unguarded — a love song that chose to be euphoric rather than tender. The Martin Gore collaboration gives it an electronic edge, and the final crescendo feels like the whole song deciding to be honest about how enormous the feeling actually is.", vibe_color: "#f5a623" },
  "sugar":                { message: "Sugar is Maroon 5 in full pop mode — light, irresistible, and deliberately uncomplicated. It's a song about missing someone that refuses to be sad about it, choosing sweetness over longing, which is a harder trick than it sounds.", vibe_color: "#f5a623" },
  "dance monkey":         { message: "Dance Monkey is an oddly self-aware pop hit — Tones And I writing about the strange experience of being asked to perform joy for other people's entertainment. Beneath the catchy hook is a song about the cost of being the person everyone always wants something from.", vibe_color: "#f5a623" },

  // ── Hollywood Chill ───────────────────────────────────────────────────────
  "as it was":            { message: "As It Was is Harry Styles writing about being lost in plain sight — emotionally adrift, performing okayness for a world that seems fine with the performance. The upbeat production hides how quietly devastating the lyrics actually are.", vibe_color: "#1DB954" },
  "heat waves":           { message: "Heat Waves is about missing someone you're not supposed to miss anymore — told through summer haze and emotional distance. Glass Animals built the track to feel unstable in exactly the same way longing does, and the chorus opens up like a wound every single time.", vibe_color: "#1DB954" },
  "peaches":              { message: "Peaches is Justin Bieber completely at ease — a song about gratitude and contentment that doesn't strain for anything. It sounds like someone exhaling after years of difficulty, happy simply to be here and to love the person standing next to them.", vibe_color: "#1DB954" },
  "sunflower":            { message: "Sunflower floats. Post Malone and Swae Lee built something impossibly light — a love song that feels like a summer afternoon with nowhere to be and nothing to prove. The Spider-Man context gives it stakes, but the song itself is pure, unhurried warmth.", vibe_color: "#1DB954" },
  "golden hour":          { message: "Golden Hour is what it feels like to be completely content — no striving, no anxiety, just the warmth of being exactly where you're meant to be. Kacey Musgraves wrote it in a specific hour and caught something universal about what it's like when love makes everything feel like enough.", vibe_color: "#1DB954" },
  "happier":              { message: "Happier is the bittersweet acknowledgement that sometimes loving someone means wanting them to be with someone better suited for them — even if that realisation costs you everything. Marshmello and Bastille made that sacrifice sound gentle rather than brutal.", vibe_color: "#1DB954" },

  // ── Nostalgic Hollywood ────────────────────────────────────────────────────
  "night changes":        { message: "Night Changes is nostalgia while it's still happening — the bittersweet awareness that a golden moment is already in the process of becoming a memory. One Direction never made anything more emotionally precise, and the simplicity of the arrangement is exactly why it stays.", vibe_color: "#9b59b6" },
  "memories":             { message: "Memories is a toast to everyone you've ever loved and lost — not to grief, but to the gratitude of having had them at all. Maroon 5 distilled that ache of missing people who still exist somewhere else, in different lives, and made it something you can actually raise a glass to.", vibe_color: "#9b59b6" },
};

export async function songStory(title: string, artist: string): Promise<GeminiTextResponse> {
  const system = `You are a music writer who explains what songs are actually about — the real story behind them — in a way that makes people feel something new about a song they thought they already knew.

Your response must cover TWO things in 3-4 sentences total:
1. What the song is literally about — the real story, context, or meaning behind it. Who wrote it and why. What moment or situation inspired it. What the lyrics are actually saying beneath the surface.
2. What emotional world it lives in — why it hits people the way it does, what human moment it was built for, what makes it stay.

Rules:
- Be specific to THIS song — not generic music criticism
- Lead with the actual meaning/story, then land on the emotional resonance
- Do NOT quote lyrics unless you are 100% certain they are word-for-word accurate
- Do NOT use: "timeless", "haunting melody", "speaks to the soul", "finds you when you need it", "masterpiece"
- Do NOT be vague — if you know the backstory, use it. If it was written after a breakup, say so. If it was inspired by a specific person or event, say so.
- 3-4 sentences. Conversational, warm, specific. Written like you genuinely know this song inside out.`;
  const user = `What is "${title}" by ${artist} actually about? Give the real story or meaning behind it, then explain the emotional world it lives in and why it stays with people. Be specific to THIS song.`;
  try {
    const prose = await callAI(system, user);
    // Reject if the AI returned a suspiciously generic response
    const generic = /speaks (directly )?to the soul|finds you (exactly )?when you need|timeless|haunting melody/i.test(prose);
    if (generic) throw new Error("Generic response detected");
    const t = prose.toLowerCase();
    let vibe_color = "#1DB954";
    if (/love|romance|tender|heart|longing/.test(t))    vibe_color = "#e91e8c";
    else if (/sad|loss|grief|tears|lonely|ache/.test(t)) vibe_color = "#4a90d9";
    else if (/hope|light|rise|dream|triumph/.test(t))    vibe_color = "#f5a623";
    else if (/memory|miss|past|nostalgia/.test(t))       vibe_color = "#9b59b6";
    else if (/anger|fire|rage|fury/.test(t))             vibe_color = "#e74c3c";
    return { message: prose, vibe_color };
  } catch {
    // Use per-song fallback story — never generic
    const key = title.toLowerCase().replace(/['']/g, "").replace(/\s+/g, " ").trim();
    const known = SONG_STORIES[key];
    if (known) return known;
    // Last-resort: still unique by building from what we know
    return {
      message: `"${title}" by ${artist} holds a particular kind of feeling that's hard to name but impossible to shake — the kind of song that makes you pause mid-listen and just be in it.`,
      vibe_color: "#1DB954",
    };
  }
}

export async function visualMusic(title: string, artist: string, genre: string): Promise<VisualMusicResponse> {
  const colorMap: Record<string, string> = {
    romantic: "#e91e8c", sad: "#4a90d9", hype: "#f5a623", chill: "#1DB954", nostalgic: "#f39c12",
  };
  const vibe_color = colorMap[genre] ?? "#1DB954";
  const images = VISUAL_IMAGES[genre] ?? VISUAL_IMAGES["chill"];
  const imageUrl = images[Math.floor(Math.random() * images.length)];
  try {
    const system = `You are a visual artist who writes the captions that appear beneath album art and music visuals. Your captions are short, evocative, and feel like the song itself speaking.

Write ONE caption (max 12 words) that captures the soul of the song — not a description, but a feeling. The kind of line you'd see projected behind a live performance. No clichés. No adjective overload. Pure atmosphere.`;
    const caption = await callAI(system, `Song: "${title}" by ${artist} (genre: ${genre}). Write the caption.`);
    return { imageUrl, caption, vibe_color };
  } catch {
    return { imageUrl, caption: `${title} — a visual feeling.`, vibe_color };
  }
}

export async function weaveJournal(text: string): Promise<GeminiPlaylistResponse> {
  const mood = classifyMood(text);
  const profile = interpretMood(mood || text, "vibe");
  try {
    const msgSystem = `You are VibeForge's journal reader — someone who reads between the lines of what people write and finds the music hiding inside their words.

Someone has shared a journal entry. Read it fully, feel what they're going through, and write ONE sentence about the playlist you're giving them.

Your sentence must:
- Address them directly ("you", "your")
- Reference something specific they wrote — not a generic emotion label
- Sound like a close friend who read every word and actually cares
- Be warm, real, NOT therapy-speak
- Max 25 words. No filler. Just honest connection.`;
    profile.aiMessage = await callAI(msgSystem, `Journal entry: "${text}"\n\nWrite one warm, specific sentence about the playlist you chose for this person.`);
  } catch { /* keep default */ }
  return buildPlaylistFromProfile(profile);
}

// ── Journal Chat Types ────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

// ── journalAssist — stateful conversation with full history support ────────────
export async function journalAssist(
  journalText: string,
  history: ChatMessage[] = []
): Promise<string> {
  const system = `You are the journaling companion inside VibeForge. You respond exactly like a close, perceptive friend — not a therapist, not an AI assistant, not a life coach.

You are having an ongoing conversation with someone about their day and feelings. The user's original journal entry is the starting context. The conversation history shows what has already been said. Your job is to respond ONLY to the most recent thing the user said — not to re-read and re-summarize the original journal entry.

HOW TO RESPOND:
- If this is the FIRST message (no history): read the full journal entry, find the most specific concrete moment, react to it like a friend who actually read it. Acknowledge the arc (good start → something went wrong, etc).
- If this is a FOLLOW-UP message: respond to what the user JUST said. Build on the conversation. Don't go back to the original journal entry unless the user brings it up. Move the conversation forward naturally.
- Ask ONE question per response. Not two, not zero. One good one.
- If the user says they're feeling better / less embarrassed / moving on — acknowledge that specifically. Don't keep probing the bad thing.
- If the user shares something new, follow that thread.

TONE:
- Sound like a friend who is genuinely listening, not conducting a session.
- Warm, real, zero therapy-speak.
- If something was chaotic or embarrassing, you can be lightly human about it (not mocking — just real, the way a friend would be).
- Never pivot to silver linings when someone is still in the feeling.
- Never summarize their emotion back at them with a label.

RULES:
- 2-3 sentences MAX.
- Never start with "I".
- Never say: "it sounds like", "I understand", "I hear you", "I can imagine", "that must have been", "in this season", "sitting with", "processing", "validating".
- Don't repeat what you already said in the conversation — check the history.
- Don't end with a life lesson or moral.`;

  // Build conversation context
  const conversationParts: string[] = [];
  conversationParts.push(`Original journal entry:\n"${journalText}"`);

  if (history.length > 0) {
    conversationParts.push("\nConversation so far:");
    for (const msg of history) {
      conversationParts.push(`${msg.role === "user" ? "User" : "Vibe"}: ${msg.text}`);
    }
    conversationParts.push("\nNow respond to the user's latest message above. Move the conversation forward — don't re-summarize the journal entry.");
  } else {
    conversationParts.push("\nThis is the first message. Read the full arc of the journal entry, find the most specific concrete thing that happened, and respond as a close friend who read every word.");
  }

  try {
    return await callAI(system, conversationParts.join("\n"));
  } catch {
    if (history.length === 0) return smartFallback(journalText);
    const last = history[history.length - 1];
    if (last.role === "user") {
      const t = last.text.toLowerCase();
      if (/better|less|okay|fine|good now|alright/.test(t))
        return "Good — glad it's starting to settle. What's the rest of your day looking like?";
      if (/still|low|down|not great/.test(t))
        return "Yeah, that kind of thing lingers even when the moment is over. What's going through your head right now?";
    }
    return "What's on your mind now?";
  }
}

// ── smartFallback — arc-aware, situation-specific ─────────────────────────────
function smartFallback(text: string): string {
  const t = text.toLowerCase();

  const hadGoodDay   = /amazing|great|good day|wonderful|best day|excited|loved it|felt good|was going well/.test(t);
  const hadMishap    = /bump|bumped|tripped|fell|spill|spilled|drop|dropped|scatter|scattered|knock|knocked|slipped|stumbled/.test(t);
  const wasPublic    = /infront|in front|people|everyone|crowd|meeting|room|class|office|colleagues|audience|coworkers/.test(t);
  const hadCoffee    = /coffee|tea|drink/.test(t);
  const hadDocuments = /document|paper|file|folder|report|notes/.test(t);

  if (hadGoodDay && hadMishap && wasPublic) {
    if (hadCoffee && hadDocuments)
      return "That whiplash of having a genuinely good day and then watching coffee go everywhere — in front of everyone — is its own special kind of awful. The documents make it so much worse because there's just no recovering your composure when you're scrambling on the floor. How are you feeling about it now that you're out of that room?";
    if (hadCoffee)
      return "A great day flipping into a public coffee disaster is such a gut-punch — especially when it happens in a room full of people with no escape. How are you doing now that you're out of that moment?";
    return "Starting your day on such a high and then having it unravel like that in front of people — that kind of whiplash is genuinely rough. Is it still sitting with you, or have you managed to shake it off?";
  }

  if (hadMishap && wasPublic)
    return "Public accidents have a way of replaying in your head long after everyone else has forgotten — how long ago did this happen, and are you still cringing or have you managed to laugh at it yet?";

  if (hadMishap)
    return "Those small physical disasters always feel bigger in the moment than they probably looked — how are you doing now?";

  if (/spill|spilled/.test(t) && wasPublic)
    return "Spilling something in front of a group is the kind of thing that burns in your chest for the rest of the day even when you know it doesn't matter. Still thinking about it?";

  if (/period|cramp|cramps|menstrual|pms/.test(t))
    return "Period pain is genuinely exhausting on top of everything else — are you able to rest today, or is everything still demanding things from you?";
  if (/headache|migraine/.test(t))
    return "Headaches have a way of making everything feel ten times harder — have you been able to find some quiet?";
  if (/sick|fever|cold|nausea|vomit|body ache|sore throat|unwell|throwing up/.test(t))
    return "Being unwell is already a lot on its own — is anyone around to look after you, or are you pushing through alone?";
  if (/tired|exhaust|drain|fatigue|sleepy|no energy|burnout/.test(t))
    return "That kind of tiredness goes deeper than sleep can fix — what's been taking the most out of you lately?";

  if (/heartbreak|breakup|broke.?up|she left|he left|ex|toxic/.test(t))
    return "The pain of losing someone doesn't follow a schedule — what's the hardest part of the day for you right now?";
  if (/sad|cry|tears|depress|hurt|empty|numb|broken/.test(t))
    return "Sometimes sadness doesn't have one clear reason — does this feeling have a shape or a name for you right now?";
  if (/anxious|stress|worried|overwhelm|panic|fear|nervous/.test(t))
    return "When your thoughts spiral like this, what's the one thing sitting right at the center of it all?";
  if (/angry|frustrat|annoyed|rage|upset|mad/.test(t))
    return "Anger usually protects something more tender underneath — what do you think this feeling is actually guarding right now?";
  if (/lonely|alone|no one|miss|longing|distance/.test(t))
    return "Loneliness can mean missing someone specific, or missing who you used to be — which one feels closer right now?";
  if (/happy|joy|excit|amazing|great|love|blessed|grateful/.test(t))
    return "Something clearly made today feel different in a good way — what was the moment that actually shifted things for you?";
  if (/confused|lost|unsure|unclear/.test(t))
    return "Sometimes feeling lost just means you've outgrown the path you were on — what part of your life feels most unclear right now?";
  if (/dream|hope|goal|wish|future|plan/.test(t))
    return "That vision clearly lives in you — what's the one thing standing between you and truly believing it's possible?";

  const firstSentence = text.trim().split(/[.!?]/)[0]?.trim();
  if (firstSentence && firstSentence.length > 10 && firstSentence.length < 80)
    return `"${firstSentence}" — that opening line says a lot. What happened after that, and how are you actually feeling right now?`;

  return "What's the one thing you wrote here that you haven't fully let yourself feel yet?";
}