import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/useApp";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import LibraryScreen from "./screens/LibraryScreen";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import MobileNav from "./components/MobileNav";
import VibeOrb from "./components/VibeOrb";

function AppContent() {
  const { session, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-[#a7a7a7] text-sm">Loading VibeForge...</p>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;
  return <MainApp />;
}

function MainApp() {
  const { screen } = useApp();

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 bg-[#121212] rounded-lg m-1 lg:ml-0 overflow-y-auto">
          {screen === "home"    && <HomeScreen />}
          {screen === "search"  && <SearchScreen />}
          {screen === "library" && <LibraryScreen />}
        </div>
      </div>
      <Player />
      <MobileNav />
      <VibeOrb />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
