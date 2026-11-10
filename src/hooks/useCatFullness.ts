import { useState, useCallback, useEffect, useRef } from 'react';
import { CatId, CAT_PRESETS } from '../types/cat.ts';
import {
  CatFullnessLevel,
  CatFullnessInfo,
  CatsFullnessMap,
} from '../types/fullness.ts';
import {
  DEFAULT_INITIAL_FULLNESS_SCORE,
  DEFAULT_FULLNESS_DECAY_PER_MINUTE,
  getFullnessLevel,
  getFullnessInfo,
  calculateNextFullness,
  calculateDecayedFullness,
  calculatePlayFullnessReduction,
  calculatePlayedFullness,
} from '../utils/catFullness.ts';

const STORAGE_KEY = 'nekoppoi_cats_fullness';

/** 自然減衰チェックの間隔（ミリ秒）: 2秒おき */
export const DEFAULT_FULLNESS_CHECK_INTERVAL_MS = 2000;

export interface UseCatFullnessOptions {
  /** 初期まんぷく度スコア（未指定時は50） */
  initialScore?: number;
  /** 自然減衰の有効化（未指定時はtrue） */
  enableDecay?: boolean;
  /** 自然減衰の定期チェック間隔ミリ秒（未指定時は2000ms） */
  decayCheckIntervalMs?: number;
  /** 1分あたりの自然減衰量（未指定時は1点/分） */
  decayPerMinute?: number;
}

export interface UseCatFullnessResult {
  /** 猫ごとのまんぷく度マップ */
  fullnessMap: CatsFullnessMap;
  /** 指定した猫のまんぷく度スコアを取得 */
  getFullnessScore: (catId: CatId) => number;
  /** 指定した猫のまんぷく度レベルを取得 */
  getFullnessLevelForCat: (catId: CatId) => CatFullnessLevel;
  /** 指定した猫のまんぷく度表示情報を取得 */
  getFullnessInfoForCat: (catId: CatId) => CatFullnessInfo;
  /** ごはんを与えてまんぷく度を上昇させる関数 */
  feedCatFullness: (
    catId: CatId,
    boost: number
  ) => { nextScore: number; nextLevel: CatFullnessLevel };
  /** おもちゃで遊んで運動し、まんぷく度を微減（5〜10%）させる関数 */
  playCatFullness: (
    catId: CatId,
    reduction?: number
  ) => { nextScore: number; nextLevel: CatFullnessLevel; reduction: number };
  /** 猫のまんぷく度を初期状態にリセットする関数 */
  resetFullness: (catId: CatId) => void;
}

function createDefaultFullness(initialScore: number = DEFAULT_INITIAL_FULLNESS_SCORE): CatsFullnessMap {
  const now = Date.now();
  return CAT_PRESETS.reduce<CatsFullnessMap>((acc, preset) => {
    acc[preset.id] = {
      score: initialScore,
      lastFedAt: now,
    };
    return acc;
  }, {} as CatsFullnessMap);
}

/**
 * 猫ごとのまんぷく度（満腹感スコア・レベル判定）を管理するカスタムフック
 * ごはん給餌による満腹度上昇、ごきげん度よりもかなりゆっくりとした時間経過減衰、localStorage永続化を提供します
 */
export function useCatFullness(
  options: UseCatFullnessOptions = {}
): UseCatFullnessResult {
  const {
    initialScore = DEFAULT_INITIAL_FULLNESS_SCORE,
    enableDecay = true,
    decayCheckIntervalMs = DEFAULT_FULLNESS_CHECK_INTERVAL_MS,
    decayPerMinute = DEFAULT_FULLNESS_DECAY_PER_MINUTE,
  } = options;

  const [fullnessMap, setFullnessMap] = useState<CatsFullnessMap>(() => {
    const defaults = createDefaultFullness(initialScore);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<CatsFullnessMap>;
          const now = Date.now();
          const restored: CatsFullnessMap = { ...defaults };
          for (const key of Object.keys(defaults) as CatId[]) {
            if (parsed[key] && typeof parsed[key]?.score === 'number') {
              const item = parsed[key]!;
              const lastFed = typeof item.lastFedAt === 'number' ? item.lastFedAt : now;
              const elapsed = now - lastFed;
              const decayed = calculateDecayedFullness(
                item.score,
                elapsed,
                decayPerMinute
              );
              restored[key] = {
                score: decayed,
                lastFedAt: now,
              };
            }
          }
          return restored;
        }
      }
    } catch {
      // localStorageのパースエラー時はフォールバック
    }
    return defaults;
  });

  const fullnessRef = useRef(fullnessMap);
  useEffect(() => {
    fullnessRef.current = fullnessMap;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullnessMap));
      }
    } catch {
      // プライベートブラウジング等でのクォータ超過エラーを安全に無視
    }
  }, [fullnessMap]);

  // 時間経過によるゆるやかな自然減衰（インターバルタイマーで定期的にチェック）
  useEffect(() => {
    if (!enableDecay) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const current = fullnessRef.current;
      let hasChanges = false;
      const nextMap: CatsFullnessMap = { ...current };

      for (const catId of Object.keys(current) as CatId[]) {
        const state = current[catId];
        const elapsed = now - state.lastFedAt;
        if (elapsed <= 0) continue;

        const decayed = calculateDecayedFullness(
          state.score,
          elapsed,
          decayPerMinute
        );
        if (decayed !== state.score) {
          hasChanges = true;
          nextMap[catId] = {
            ...state,
            score: decayed,
            lastFedAt: now,
          };
        }
      }

      if (hasChanges) {
        setFullnessMap(nextMap);
      }
    }, decayCheckIntervalMs);

    return () => clearInterval(timer);
  }, [enableDecay, decayCheckIntervalMs, decayPerMinute]);

  const getFullnessScore = useCallback(
    (catId: CatId): number => {
      return fullnessMap[catId]?.score ?? initialScore;
    },
    [fullnessMap, initialScore]
  );

  const getFullnessLevelForCat = useCallback(
    (catId: CatId): CatFullnessLevel => {
      const score = getFullnessScore(catId);
      return getFullnessLevel(score);
    },
    [getFullnessScore]
  );

  const getFullnessInfoForCat = useCallback(
    (catId: CatId): CatFullnessInfo => {
      const level = getFullnessLevelForCat(catId);
      return getFullnessInfo(level);
    },
    [getFullnessLevelForCat]
  );

  const feedCatFullness = useCallback(
    (catId: CatId, boost: number): { nextScore: number; nextLevel: CatFullnessLevel } => {
      const now = Date.now();
      const current = fullnessRef.current[catId] ?? {
        score: initialScore,
        lastFedAt: now,
      };

      const nextScore = calculateNextFullness(current.score, boost);
      const nextLevel = getFullnessLevel(nextScore);

      setFullnessMap((prev) => ({
        ...prev,
        [catId]: {
          score: nextScore,
          lastFedAt: now,
        },
      }));

      return { nextScore, nextLevel };
    },
    [initialScore]
  );

  const playCatFullness = useCallback(
    (
      catId: CatId,
      reduction?: number
    ): { nextScore: number; nextLevel: CatFullnessLevel; reduction: number } => {
      const now = Date.now();
      const current = fullnessRef.current[catId] ?? {
        score: initialScore,
        lastFedAt: now,
      };

      const actualReduction =
        typeof reduction === 'number'
          ? reduction
          : calculatePlayFullnessReduction();
      const nextScore = calculatePlayedFullness(current.score, actualReduction);
      const nextLevel = getFullnessLevel(nextScore);

      setFullnessMap((prev) => ({
        ...prev,
        [catId]: {
          score: nextScore,
          lastFedAt: now,
        },
      }));

      return { nextScore, nextLevel, reduction: actualReduction };
    },
    [initialScore]
  );

  const resetFullness = useCallback(
    (catId: CatId) => {
      setFullnessMap((prev) => ({
        ...prev,
        [catId]: {
          score: initialScore,
          lastFedAt: Date.now(),
        },
      }));
    },
    [initialScore]
  );

  return {
    fullnessMap,
    getFullnessScore,
    getFullnessLevelForCat,
    getFullnessInfoForCat,
    feedCatFullness,
    playCatFullness,
    resetFullness,
  };
}
