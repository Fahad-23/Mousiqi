import { Routes, Route } from "react-router-dom";
import { PlaylistSidebar } from "./components/PlaylistSidebar.tsx";
import { AudioPlayer } from "./components/AudioPlayer.tsx";
import { SearchPage } from "./pages/SearchPage.tsx";
import { PlaylistPage } from "./pages/PlaylistPage.tsx";

export default function App() {
  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white">
      <PlaylistSidebar />
      <main className="flex-1 overflow-y-auto p-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
          </Routes>
        </div>
      </main>
      <AudioPlayer />
    </div>
  );
}
