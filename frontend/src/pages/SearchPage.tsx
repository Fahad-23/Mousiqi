import { SearchBar } from "../components/SearchBar.tsx";
import { SongList } from "../components/SongList.tsx";

export function SearchPage() {
  return (
    <div className="space-y-6">
      <SearchBar />
      <SongList />
    </div>
  );
}
