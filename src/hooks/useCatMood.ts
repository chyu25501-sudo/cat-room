import { useState, useCallback } from 'react';
import { CatId, CAT_PRESETS } from '../types/cat.ts';
import { CatMoodLevel, CatMoodInfo, CatsMoodMap, CatMoodState } from '../types/mood.ts';
import {
  DEFAULT_INITIAL_MOOD_SCORE,
  DEFAULT_PET_MOOD_INCREMENT,
  getMoodLevel,
  getMoodInfo,
  calculateNextMood,
  calculateDecayedMood,
} from '../utils/catMood.ts';

const STORAGE_KEY = 'nekoppoi_cats_mood';

export interface UseCatMoodOptions {
  /** なでたときの機嫌スコア上昇量 */
  petIncrement?: number;
  /** 自然減衰の有効化（未指定時はtrue） */
  enableDecay?: boolean;
}

export interface UseCatMoodResult {
  /** 猫ごとの機嫌状態マップ */
  moods: CatsMoodMap;
  /** 指定した猫の機嫌スコアを取得 */
  getMoodScore: (catId: CatId) => number;
  /** 指定した猫の機嫌レベルを取得 */
  getMoodLevelForCat: (catId: CatId) => CatMoodLevel;
  /** 指定した猫の機嫌表示情報を取得 */
  getMoodInfoForCat: (catId: CatId) => CatMoodInfo;
  /** 猫をなでて機嫌を上昇させる関数 */
  petCat: (catId: CatId) => { nextScore: number; nextLevel: CatMoodLevel };
  /** 猫の機嫌を初期状態にリセットする関数 */
  resetMood: (catId: CatId) => void;
}

function createDefaultMoods(): CatsMoodMap {
  const now = Date.now();
  return CAT_PRESETS.reduce<CatsMoodMap>((acc, preset) => {
    acc[preset.id] = {
      score: DEFAULT_INITIAL_MOOD_SCORE,
      lastPetAt: now,
    };
    return acc;
  }, {} as CatsMoodMap);
}

/**
 * 猫ごとの機嫌（ご機嫌度）を管理するカスタムフック
 * localStorageへの安全な永続化と、時間経過による自然減衰を提供します
 */
export function useCatMood(options: UseCatMoodOptions = {}): UseCatMoodResult {
  const { petIncrement = DEFAULT_PET_MOOD_INCREMENT, enableDecay = true } = options;

  const [moods, setMoods] = useState<CatsMoodMap>(() => {
    const defaults = createDefaultMoods();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Record<string, Partial<CatMoodState>>;
          const now = Date.now();
          const restored: CatsMoodMap = { ...defaults };

          for (const preset of CAT_PRESETS) {
            const item = parsed[preset.id];
            if (item && typeof item.score === 'number') {
              const lastPetAt = typeof item.lastPetAt === 'number' ? item.lastPetAt : now;
              const elapsed = now - lastPetAt;
              const decayedScore = enableDecay
                ? calculateDecayedMood(item.score, elapsed)
                : item.score;

              restored[preset.id] = {
                score: decayedScore,
                lastPetAt,
              };
            }
          }
          return restored;
        }
      }
    } catch {
      // localStorageが利用できない場合のフォールバック
    }
    return defaults;
  });

  const saveToStorage = (updated: CatsMoodMap) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // フォールバック
    }
  };

  const getMoodScore = useCallback(
    (catId: CatId): number => {
      return moods[catId]?.score ?? DEFAULT_INITIAL_MOOD_SCORE;
    },
    [moods]
  );

  const getMoodLevelForCat = useCallback(
    (catId: CatId): CatMoodLevel => {
      const score = getMoodScore(catId);
      return getMoodLevel(score);
    },
    [getMoodScore]
  );

  const getMoodInfoForCat = useCallback(
    (catId: CatId): CatMoodInfo => {
      const level = getMoodLevelForCat(catId);
      return getMoodInfo(level);
    },
    [getMoodLevelForCat]
  );

  const petCat = useCallback(
    (catId: CatId) => {
      let resultScore = DEFAULT_INITIAL_MOOD_SCORE;
      let resultLevel: CatMoodLevel = 'normal';
      const now = Date.now();

      setMoods((prev) => {
        const currentScore = prev[catId]?.score ?? DEFAULT_INITIAL_MOOD_SCORE;
        const nextScore = calculateNextMood(currentScore, petIncrement);
        const nextLevel = getMoodLevel(nextScore);
        resultScore = nextScore;
        resultLevel = nextLevel;

        const nextMap: CatsMoodMap = {
          ...prev,
          [catId]: {
            score: nextScore,
            lastPetAt: now,
          },
        };
        saveToStorage(nextMap);
        return nextMap;
      });

      return { nextScore: resultScore, nextLevel: resultLevel };
    },
    [petIncrement]
  );

  const resetMood = useCallback((catId: CatId) => {
    setMoods((prev) => {
      const nextMap: CatsMoodMap = {
        ...prev,
        [catId]: {
          score: DEFAULT_INITIAL_MOOD_SCORE,
          lastPetAt: Date.now(),
        },
      };
      saveToStorage(nextMap);
      return nextMap;
    });
  }, []);

  return {
    moods,
    getMoodScore,
    getMoodLevelForCat,
    getMoodInfoForCat,
    petCat,
    resetMood,
  };
}
