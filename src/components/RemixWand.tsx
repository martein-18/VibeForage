import { useState } from "react";
import { useApp } from "../context/useApp";
import { remixVibe } from "../data/gemini";
import { getSongById, Song } from "../data/songs";
import { Sparkles, X } from "lucide-react";
import TypewriterText from "./TypewriterText";

interface Props {
  onClose: () => void;
}

export default function RemixWand({ onClose }: Props) {
  const { currentSong, playSong } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    songs: Song[];
    playlistName: string;
    vibeColor: string;
  } | null>(null);

  if (!currentSong) return null;

  const handleRemix = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await remixVibe(currentSong.title, currentSong.artist, input);
      const remixedSongs = res.song_ids.map((id) => getSongById(id)).filter(Boolean) as Song[];
      setResult({ message: res.message, songs: remixedSongs, playlistName: res.playlist_name, vibeColor: res.vibe_color });
      if (remixedSongs.length > 0) playSong(remixedSongs[0]);
    } catch {
      setResult({ message: "Something went wrong with the remix. Try again!", songs: [], playlistName: "Remix Failed", vibeColor: "#1DB954" });
    }
    setLoading(false);
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-[#282828] rounded-lg p-4 shadow-2xl border border-[#3e3e3e] animate-fadeIn">
      <button onClick={onClose} className="absolute top-2 right-2 text-[#a7a7a7] hover:text-white">
        <X size={16} />
      </button>
      {!result && !loading && (
        <>
          <p className="text-white text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-[#1DB954]" /> Remix this vibe
          </p>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. make it more chill, add late night energy"
              className="flex-1 bg-[#3e3e3e] text-white text-sm px-3 py-2 rounded-full outline-none placeholder-[#a7a7a7] focus:ring-1 focus:ring-[#1DB954]"
              onKeyDown={(e) => e.key === "Enter" && handleRemix()}
            />
            <button onClick={handleRemix} className="bg-[#1DB954] text-black font-semibold text-sm px-4 py-2 rounded-full hover:bg-[#1ed760] transition-colors flex items-center gap-1">
              Remix <Sparkles size={12} />
            </button>
          </div>
        </>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-[#1DB954] text-sm">
          <span className="animate-pulse">...</span> Vibe is remixing...
        </div>
      )}
      {result && (
        <div>
          <TypewriterText text={result.message} className="text-white text-sm mb-3" />
          {result.songs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.songs.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => playSong(s)}
                  className="bg-[#3e3e3e] rounded-lg px-3 py-2 text-left hover:bg-[#4e4e4e] transition-colors"
                >
                  <p className="text-white text-xs font-medium">{s.title}</p>
                  <p className="text-[#a7a7a7] text-[10px]">{s.artist}</p>
                </button>
              ))}
            </div>
          )}
          <button onClick={onClose} className="text-[#a7a7a7] text-xs mt-2 hover:text-white">Close</button>
        </div>
      )}
    </div>
  );
}
