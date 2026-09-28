import { useState, useCallback } from 'react';
import { playMeowSound, type MeowOptions } from '../utils/catSound.ts';

export function useCatAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const meow = useCallback((options?: MeowOptions) => {
    setIsPlaying(true);
    playMeowSound(options);

    const durationMs = (options?.duration ?? 0.65) * 1000;
    setTimeout(() => {
      setIsPlaying(false);
    }, durationMs);
  }, []);

  return {
    meow,
    isPlaying,
  };
}
