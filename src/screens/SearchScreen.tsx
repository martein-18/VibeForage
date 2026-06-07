import { useState, useEffect } from "react";
import { songs, GENRES, GENRE_GRADIENTS, GENRE_EMOJIS, getSongsByGenre, Song } from "../data/songs";
import { useApp } from "../context/useApp";
import { Search, Play } from "lucide-react";
import { searchSpotify, isSpotifyConnected, trackCover, msToTime } from "../lib/spotify";
import type { SpotifyTrackMeta } from "../context/useApp";

export default function SearchScreen() {
  const { playSong, playUnified } = useApp();
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrackMeta[]>([]);
  const [searching, setSearching] = useState(false);

  const localResults: Song[] = query.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase())
      )
    : selectedGenre
    ? getSongsByGenre(selectedGenre)
    : [];

  // Silently fetch Spotify when no local results
  useEffect(() => {
    if (!query.trim() || localResults.length > 0 || !isSpotifyConnected()) {
      setSpotifyResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      searchSpotify(query)
        .then((res) =>
          setSpotifyResults(
            res.map((t) => ({
              source: "spotify" as const,
              id: t.id,
              uri: t.uri,
              title: t.name,
              artist: t.artists.map((a) => a.name).join(", "),
              album: t.album.name,
              cover: trackCover(t),
              duration: msToTime(t.duration_ms),
            }))
          )
        )
        .catch(() => setSpotifyResults([]))
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, localResults.length]);

  const displayResults: Array<{ key: string; cover: string; title: string; artist: string; album: string; duration: string; onPlay: () => void }> = [
    ...localResults.map((s) => ({
      key: `local-${s.id}`,
      cover: s.cover,
      title: s.title,
      artist: s.artist,
      album: s.album,
      duration: s.duration,
      onPlay: () => playSong(s),
    })),
    ...spotifyResults.map((t) => ({
      key: `spotify-${t.id}`,
      cover: t.cover,
      title: t.title,
      artist: t.artist,
      album: t.album,
      duration: t.duration,
      onPlay: () => playUnified(t),
    })),
  ];

  return (
    <div className="p-4 pb-32 lg:pb-24">
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6a6a]" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedGenre(null); }}
          placeholder="What do you want to listen to?"
          className="w-full bg-[#282828] text-white pl-12 pr-4 py-3 rounded-full outline-none placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#1DB954] transition-all text-sm"
        />
      </div>

      {!query.trim() && !selectedGenre && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Browse All</h2>
          <div className="grid grid-cols-2 gap-3">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`bg-gradient-to-br ${GENRE_GRADIENTS[genre]} rounded-lg p-4 h-24 flex flex-col justify-between text-left hover:scale-[1.02] transition-transform`}
              >
                <span className="text-2xl">{GENRE_EMOJIS[genre]}</span>
                <span className="text-white font-bold text-sm capitalize">{genre}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedGenre && !query.trim() && (
        <div className="mb-4">
          <button
            onClick={() => setSelectedGenre(null)}
            className="text-[#a7a7a7] text-sm hover:text-white mb-3 transition-colors"
          >
            &larr; Back to genres
          </button>
          <h2 className="text-xl font-bold text-white mb-4 capitalize">{selectedGenre}</h2>
        </div>
      )}

      {(query.trim() || selectedGenre) && (
        <div className="space-y-1">
          {searching && (
            <div className="flex items-center gap-2 py-4 text-[#a7a7a7] text-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}
              </div>
              Searching...
            </div>
          )}
          {!searching && displayResults.length === 0 && (
            <p className="text-[#a7a7a7] text-center py-8">No results found</p>
          )}
          {displayResults.map((r) => (
            <button
              key={r.key}
              onClick={r.onPlay}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#282828] transition-colors text-left group"
            >
              <img
                src={r.cover}
                alt={r.title}
                className="w-12 h-12 rounded object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${r.key}/80/80`; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{r.title}</p>
                <p className="text-[#a7a7a7] text-xs truncate">{r.artist} &middot; {r.album}</p>
              </div>
              <span className="text-[#a7a7a7] text-xs">{r.duration}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                  <Play size={14} className="text-black ml-0.5" fill="black" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
