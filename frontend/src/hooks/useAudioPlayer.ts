import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "../stores/playerStore.ts";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    hasEnded,
    volume,
    setIsPlaying,
    setHasEnded,
    setCurrentTime,
    setDuration,
  } = usePlayerStore();

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
    };
    const onError = () => {
      console.error("Audio playback error");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [setCurrentTime, setDuration, setIsPlaying, setHasEnded]);

  // Update source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.streamUrl) return;

    audio.src = currentTrack.streamUrl;
    audio.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
  }, [currentTrack?.streamUrl, setIsPlaying]);

  // Play/pause sync — also handles replay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      // If we're replaying after ended, seek to beginning
      if (hasEnded || audio.ended) {
        audio.currentTime = 0;
      }
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, hasEnded, setIsPlaying]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return { seek, audioRef };
}
