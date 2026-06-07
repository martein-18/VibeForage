import { useApp } from "../context/useApp";
import { songs, getSongsByGenre, Song } from "../data/songs";
import { ChevronRight, Play, Sparkles, LogOut } from "lucide-react";

function QuickPickTile({ song }: { song: Song }) {
  const { playSong, currentSong, isPlaying } = useApp();
  const isActive = currentSong?.id === song.id;
  return (
    <button
      onClick={() => playSong(song)}
      className={`flex items-center gap-3 rounded-md overflow-hidden transition-colors group ${
        isActive ? "bg-[#3e3e3e]" : "bg-[#282828] hover:bg-[#3e3e3e]"
      }`}
    >
      <img src={song.cover} alt={song.title} className="w-12 h-12 object-cover flex-shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${song.id}/80/80`; }} />
      <p className="text-white text-xs font-semibold truncate flex-1 pr-2 text-left">{song.title}</p>
      <div className={`w-8 h-8 mr-2 bg-[#1DB954] rounded-full flex items-center justify-center shadow-md flex-shrink-0 transition-all ${
        isActive && isPlaying
          ? "opacity-100 scale-100"
          : "opacity-0 group-hover:opacity-100 group-hover:scale-100"
      }`}>
        <Play size={14} fill="black" className="text-black ml-0.5" />
      </div>
    </button>
  );
}

function SongCard({ song }: { song: Song }) {
  const { playSong, currentSong, isPlaying } = useApp();
  const isActive = currentSong?.id === song.id;
  return (
    <button
      onClick={() => playSong(song)}
      className="min-w-[160px] max-w-[160px] bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition-all duration-300 group cursor-pointer text-left"
    >
      <div className="relative mb-3">
        <img
          src={song.cover}
          alt={song.title}
          className={`w-full aspect-square rounded-md object-cover ${isActive && isPlaying ? "animate-spin-slow" : ""}`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${song.id}/300/300`; }}
        />
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Play size={18} className="text-black ml-0.5" fill="black" />
        </div>
      </div>
      <p className="text-white text-sm font-medium truncate">{song.title}</p>
      <p className="text-[#a7a7a7] text-xs truncate">{song.artist}</p>
    </button>
  );
}

function SongRow({ title, songList }: { title: string; songList: Song[] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button className="text-[#a7a7a7] text-sm hover:text-white flex items-center gap-1 transition-colors">
          Show all <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
        {songList.map((s) => <SongCard key={s.id} song={s} />)}
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const { userProfile, logout } = useApp();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    if (h >= 17 && h < 21) return "Good evening";
    return "Good night";
  };

  const romantic = getSongsByGenre("romantic");
  const hype     = getSongsByGenre("hype");
  const sad      = getSongsByGenre("sad");

  return (
    <div className="p-4 pb-32 lg:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}{userProfile ? `, ${userProfile.name}` : ""}
          </h1>
          <p className="text-[#1DB954] text-sm mt-1 flex items-center gap-1">
            <Sparkles size={12} /> Your Personal Music Universe
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => void logout()}
            className="flex items-center gap-1.5 bg-[#282828] hover:bg-red-900/30 text-[#a7a7a7] hover:text-red-400 transition-all text-xs px-3 py-2 rounded-full border border-[#3e3e3e] hover:border-red-900/50"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Quick Pick Grid */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {songs.slice(0, 6).map((s: Song) => <QuickPickTile key={s.id} song={s} />)}
      </div>

      <SongRow title="Recently Played" songList={songs} />
      <SongRow title="Romantic Vibes 💕" songList={romantic} />
      <SongRow title="Hype & Energy 🔥" songList={hype} />
      <SongRow title="Sad & Reflective 🌙" songList={sad} />
    </div>
  );
}
