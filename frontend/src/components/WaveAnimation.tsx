interface WaveAnimationProps {
  isPlaying: boolean;
}

export function WaveAnimation({ isPlaying }: WaveAnimationProps) {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {[0, 0.15, 0.3, 0.45, 0.3, 0.15, 0].map((delay, i) => (
        <span
          key={i}
          className="w-[3px] bg-purple-400 rounded-full transition-all"
          style={{
            height: isPlaying ? undefined : "4px",
            animation: isPlaying
              ? `wave 1.2s ease-in-out ${delay}s infinite`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
}
