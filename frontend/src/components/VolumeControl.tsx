import { usePlayerStore } from "../stores/playerStore.ts";

export function VolumeControl() {
  const { volume, setVolume } = usePlayerStore();
  const volumePercent = Math.round(volume * 100);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
        className="text-white/60 hover:text-white transition-colors"
      >
        {volume === 0 ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volumePercent}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        className="w-20 h-1 appearance-none rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
        style={{
          background: `linear-gradient(to right, #a855f7 ${volumePercent}%, rgba(255,255,255,0.2) ${volumePercent}%)`,
        }}
      />
    </div>
  );
}
