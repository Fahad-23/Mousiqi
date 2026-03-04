import { usePlayerStore } from "../stores/playerStore.ts";

interface SeekBarProps {
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function SeekBar({ onSeek }: SeekBarProps) {
  const { currentTime, duration } = usePlayerStore();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onSeek((value / 100) * duration);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-white/50 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleChange}
        className="flex-1 h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <span className="text-xs text-white/50 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
