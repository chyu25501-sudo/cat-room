import { useState, useCallback, useRef, useEffect } from 'react';
import { ToyItem } from '../types/care.ts';

export const DEFAULT_PLAYING_DURATION_MS = 3200;

export interface UseCatPlayOptions {
  /** おもちゃで遊んでいる状態の継続時間ミリ秒（デフォルト: 3200ms） */
  durationMs?: number;
}

export interface UseCatPlayResult {
  /** 現在遊んでいるおもちゃアイテム（遊んでいない時はnull） */
  activeToy: ToyItem | null;
  /** おもちゃ遊び中アニメーションフラグ */
  isPlayingToy: boolean;
  /** おもちゃを選んで遊び演出を開始する関数 */
  startPlaying: (toy: ToyItem) => void;
  /** 遊び演出を即時終了する関数 */
  stopPlaying: () => void;
}

/**
 * 猫のおもちゃ遊び状態とタイマーアニメーションを管理するカスタムフック
 */
export function useCatPlay(options?: UseCatPlayOptions): UseCatPlayResult {
  const durationMs = options?.durationMs ?? DEFAULT_PLAYING_DURATION_MS;

  const [activeToy, setActiveToy] = useState<ToyItem | null>(null);
  const [isPlayingToy, setIsPlayingToy] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearPlayTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopPlaying = useCallback(() => {
    clearPlayTimer();
    setIsPlayingToy(false);
    setActiveToy(null);
  }, [clearPlayTimer]);

  const startPlaying = useCallback(
    (toy: ToyItem) => {
      clearPlayTimer();
      setActiveToy(toy);
      setIsPlayingToy(true);

      if (typeof window !== 'undefined') {
        timerRef.current = window.setTimeout(() => {
          setIsPlayingToy(false);
          setActiveToy(null);
          timerRef.current = null;
        }, durationMs);
      }
    },
    [durationMs, clearPlayTimer]
  );

  useEffect(() => {
    return () => {
      clearPlayTimer();
    };
  }, [clearPlayTimer]);

  return {
    activeToy,
    isPlayingToy,
    startPlaying,
    stopPlaying,
  };
}
