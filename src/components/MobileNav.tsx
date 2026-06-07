import { useApp } from "../context/useApp";
import { Home, Search, Library } from "lucide-react";

export default function MobileNav() {
  const { screen, setScreen } = useApp();

  const items = [
    { id: "home",    icon: Home,    label: "Home" },
    { id: "search",  icon: Search,  label: "Search" },
    { id: "library", icon: Library, label: "Library" },
  ];

  return (
    <div className="lg:hidden fixed bottom-[70px] left-0 right-0 bg-[#181818] border-t border-[#282828] flex justify-around items-center py-2 z-40">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            screen === item.id ? "text-white" : "text-[#a7a7a7]"
          }`}
        >
          <item.icon size={20} />
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
