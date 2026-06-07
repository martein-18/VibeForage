import { useApp } from "../context/useApp";
import { Home, Search, Library, User, LogOut, Sparkles } from "lucide-react";

export default function Sidebar() {
  const { screen, setScreen, userProfile, logout } = useApp();

  const navItems = [
    { id: "home",    icon: Home,    label: "Home" },
    { id: "search",  icon: Search,  label: "Search" },
    { id: "library", icon: Library, label: "Your Library" },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[25%] h-full p-2 gap-2 text-white">
      {/* Nav */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-1">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center shadow-md shadow-[#1DB954]/20">
            <Sparkles size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg">VibeForge</span>
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex items-center gap-3 px-2 py-2.5 rounded-md transition-colors ${
              screen === item.id ? "text-white bg-[#282828]" : "text-[#a7a7a7] hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* User profile */}
      {userProfile && (
        <div className="bg-[#121212] rounded-lg p-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1DB954]/20 border border-[#1DB954]/30 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-[#1DB954]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{userProfile.name}</p>
              <p className="text-[#a7a7a7] text-[10px]">Signed in</p>
            </div>
            <button
              onClick={() => void logout()}
              className="flex items-center gap-1.5 text-[#a7a7a7] hover:text-red-400 transition-colors text-xs px-2 py-1.5 rounded-md hover:bg-red-900/20"
              title="Log out"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
