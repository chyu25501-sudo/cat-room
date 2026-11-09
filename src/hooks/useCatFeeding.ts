import { useState, useCallback, useRef, useEffect } from 'react';
import { FoodItem } from '../types/care.ts';

export const DEFAULT_FEEDING_DURATION_MS = 3200;

export interface UseCatFeedingOptions {
  /** ごはんを食べている状態の継続時間ミリ秒（デフォルト: 3200ms） */
  durationMs?: number;
}

export interface UseCatFeedingResult {
  /** 現在猫が食べているごはんアイテム（未給餌時はnull） */
  activeFood: FoodItem | null;
  /** 食事中アニメーションフラグ */
  isEating: boolean;
  /** ごはんを与えて食事演出を開始する関数 */
  startFeeding: (food: FoodItem) => void;
  /** 食事演出を即時終了する関数 */
  stopFeeding: () => void;
}

/**
 * 猫の食事（給餌）状態とタイマーアニメーションを管理するカスタムフック
 */
export function useCatFeeding(options?: UseCatFeedingOptions): UseCatFeedingResult {
  const durationMs = options?.durationMs ?? DEFAULT_FEEDING_DURATION_MS;

  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);
  const [isEating, setIsEating] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearFeedingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopFeeding = useCallback(() => {
    clearFeedingTimer();
    setIsEating(false);
    setActiveFood(null);
  }, [clearFeedingTimer]);

  const startFeeding = useCallback(
    (food: FoodItem) => {
      clearFeedingTimer();
      setActiveFood(food);
      setIsEating(true);

      if (typeof window !== 'undefined') {
        timerRef.current = window.setTimeout(() => {
          setIsEating(false);
          setActiveFood(null);
          timerRef.current = null;
        }, durationMs);
      }
    },
    [durationMs, clearFeedingTimer]
  );

  useEffect(() => {
    return () => {
      clearFeedingTimer();
    };
  }, [clearFeedingTimer]);

  return {
    activeFood,
    isEating,
    startFeeding,
    stopFeeding,
  };
}
