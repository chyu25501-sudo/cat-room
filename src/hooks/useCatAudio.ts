import { useState, useCallback, useRef, useEffect } from 'react';
import { playMeowSound, type MeowOptions } from '../utils/catSound.ts';

export interface UseCatAudioOptions {
  /** サウンド再生を有効にするかどうか（デフォルト: true） */
  soundEnabled?: boolean;
}

export function useCatAudio({ soundEnabled = true }: UseCatAudioOptions = {}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meow = useCallback(
    (options?: MeowOptions) => {
      setIsPlaying(true);
      if (soundEnabled) {
        playMeowSound(options);
      }

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      const durationMs = (options?.duration ?? 0.65) * 1000;
      timerRef.current = setTimeout(() => {
        setIsPlaying(false);
        timerRef.current = null;
      }, durationMs);
    },
    [soundEnabled]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    meow,
    isPlaying,
  };
}
