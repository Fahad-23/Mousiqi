import { usePlayerStore } from "../stores/playerStore.ts";
import { useAudioPlayer } from "../hooks/useAudioPlayer.ts";
import { SeekBar } from "./SeekBar.tsx";
import { VolumeControl } from "./VolumeControl.tsx";
import { WaveAnimation } from "./WaveAnimation.tsx";

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    hasEnded,
    togglePlayPause,
    playNext,
    playPrevious,
    queue,
    queueIndex,
    loadingTrack,
  } = usePlayerStore();
  const { seek } = useAudioPlayer();

  if (!currentTrack) return null;

  // Determine which icon to show
  const playButtonIcon = hasEnded ? (
    // Replay icon
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ) : isPlaying ? (
    // Pause icon
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ) : (
    // Play icon
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-white/10 px-4 py-3 z-50">
      <div className="max-w-5xl mx-auto">
        <SeekBar onSeek={seek} />
        <div className="flex items-center gap-4 mt-2">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentTrack.thumbnailUrl && (
              <img
                src={currentTrack.thumbnailUrl}
                alt=""
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="text-white text-sm truncate">
                {currentTrack.title}
              </p>
            </div>
            <WaveAnimation isPlaying={isPlaying} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={playPrevious}
              disabled={queueIndex <= 0 || loadingTrack}
              className="text-white/60 hover:text-white disabled:text-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={togglePlayPause}
              disabled={loadingTrack}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-900 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loadingTrack ? (
                <span className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                playButtonIcon
              )}
            </button>
            <button
              onClick={playNext}
              disabled={queueIndex >= queue.length - 1 || loadingTrack}
              className="text-white/60 hover:text-white disabled:text-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* Volume */}
          <div className="flex-1 flex justify-end">
            <VolumeControl />
          </div>
        </div>
      </div>
    </div>
  );
}
