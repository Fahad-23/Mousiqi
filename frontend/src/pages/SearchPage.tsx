import { SearchBar } from "../components/SearchBar.tsx";
import { SongList } from "../components/SongList.tsx";

export function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="text-center pt-4 pb-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent tracking-tight">
          Mousiqi
        </h1>
        <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">
          made by Fahad
        </p>
      </div>
      <SearchBar />
      <SongList />
    </div>
  );
}
