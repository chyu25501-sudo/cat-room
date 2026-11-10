import { useState, useCallback, useRef, useEffect } from 'react';
import { FoodItem } from '../types/care.ts';
import { calculateFeedingDurationMs } from '../utils/catCare.ts';

export const DEFAULT_FEEDING_DURATION_MS = 3200;

export interface UseCatFeedingOptions {
  /**
   * ごはんを食べている状態の継続時間ミリ秒（未指定時はごはんのまんぷく度回復量に応じた可変時間）
   */
  durationMs?: number;
}

export interface UseCatFeedingResult {
  /** 現在猫が食べているごはんアイテム（未給餌時はnull） */
  activeFood: FoodItem | null;
  /** 食事中アニメーションフラグ */
  isEating: boolean;
  /** ごはんを与えて食事演出を開始する関数（第2引数で時間を上書き可能） */
  startFeeding: (food: FoodItem, durationMs?: number) => void;
  /** 食事演出を即時終了する関数 */
  stopFeeding: () => void;
}

/**
 * 猫の食事（給餌）状態とタイマーアニメーションを管理するカスタムフック
 * まんぷく度の回復量が多いごはんほど食べる時間が少しだけ長くなります
 */
export function useCatFeeding(options?: UseCatFeedingOptions): UseCatFeedingResult {
  const fixedDurationMs = options?.durationMs;

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
    (food: FoodItem, customDurationMs?: number) => {
      clearFeedingTimer();
      setActiveFood(food);
      setIsEating(true);

      // 時間の決定: 個別指定 > オプション固定時間 > ごはんのまんぷく度回復量に応じた可変時間
      const duration =
        typeof customDurationMs === 'number'
          ? customDurationMs
          : typeof fixedDurationMs === 'number'
          ? fixedDurationMs
          : calculateFeedingDurationMs(food.fullnessBoost);

      if (typeof window !== 'undefined') {
        timerRef.current = window.setTimeout(() => {
          setIsEating(false);
          setActiveFood(null);
          timerRef.current = null;
        }, duration);
      }
    },
    [fixedDurationMs, clearFeedingTimer]
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
