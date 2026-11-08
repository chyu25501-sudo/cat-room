import { useState, useCallback, useEffect, useRef } from 'react';
import { CatId, CAT_PRESETS } from '../types/cat.ts';
import { CatMoodLevel, CatMoodInfo, CatsMoodMap, CatMoodState } from '../types/mood.ts';
import {
  DEFAULT_INITIAL_MOOD_SCORE,
  ANNOYED_MOOD_SCORE,
  DEFAULT_PET_MOOD_INCREMENT,
  DEFAULT_DECAY_PER_MINUTE,
  DEFAULT_OVERSTIMULATION_WINDOW_MS,
  DEFAULT_OVERSTIMULATION_THRESHOLD_COUNT,
  DEFAULT_ANNOYED_DURATION_MS,
  getMoodLevel,
  getMoodInfo,
  calculateNextMood,
  calculateDecayedMood,
  checkOverstimulation,
  isCatAnnoyed,
} from '../utils/catMood.ts';

const STORAGE_KEY = 'nekoppoi_cats_mood';

/** リアルタイム機嫌減衰チェックの間隔（ミリ秒）: 2秒おき */
export const DEFAULT_DECAY_CHECK_INTERVAL_MS = 2000;

export interface UseCatMoodOptions {
  /** なでたときの機嫌スコア上昇量 */
  petIncrement?: number;
  /** 自然減衰の有効化（未指定時はtrue） */
  enableDecay?: boolean;
  /** 自然減衰の定期チェック間隔ミリ秒（未指定時は2000ms） */
  decayCheckIntervalMs?: number;
  /** 1分あたりの自然減衰量（未指定時は4点） */
  decayPerMinute?: number;
  /** 愛撫誘発性攻撃（過剰刺激）の監視ウィンドウミリ秒（未指定時は7000ms） */
  overstimulationWindowMs?: number;
  /** ウィンドウ内での過剰撫で回数しきい値（未指定時は6回） */
  overstimulationThresholdCount?: number;
  /** 不機嫌状態の継続時間ミリ秒（未指定時は5000ms） */
  annoyedDurationMs?: number;
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
  /** 猫をなでて機嫌を上昇させる（撫ですぎ時は愛撫誘発性攻撃により不機嫌になる）関数 */
  petCat: (catId: CatId) => { nextScore: number; nextLevel: CatMoodLevel };
  /** 猫の機嫌を初期状態にリセットする関数 */
  resetMood: (catId: CatId) => void;
}

function createDefaultMoods(): CatsMoodMap {
  const now = Date.now();
  return CAT_PRESETS.reduce<CatsMoodMap>((acc, preset) => {
    acc[preset.id] = {
      score: DEFAULT_INITIAL_MOOD_SCORE,
      baseScore: DEFAULT_INITIAL_MOOD_SCORE,
      lastPetAt: now,
      annoyedUntil: 0,
      recentPetTimes: [],
    };
    return acc;
  }, {} as CatsMoodMap);
}

/**
 * 猫ごとの機嫌（ご機嫌度・不機嫌判定）を管理するカスタムフック
 * 短時間の過剰な撫でによる愛撫誘発性攻撃行動、localStorageへの永続化、リアルタイム減衰を提供します
 */
export function useCatMood(options: UseCatMoodOptions = {}): UseCatMoodResult {
  const {
    petIncrement = DEFAULT_PET_MOOD_INCREMENT,
    enableDecay = true,
    decayCheckIntervalMs = DEFAULT_DECAY_CHECK_INTERVAL_MS,
    decayPerMinute = DEFAULT_DECAY_PER_MINUTE,
    overstimulationWindowMs = DEFAULT_OVERSTIMULATION_WINDOW_MS,
    overstimulationThresholdCount = DEFAULT_OVERSTIMULATION_THRESHOLD_COUNT,
    annoyedDurationMs = DEFAULT_ANNOYED_DURATION_MS,
  } = options;

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
              const baseScore = typeof item.baseScore === 'number' ? item.baseScore : item.score;
              const annoyedUntil = typeof item.annoyedUntil === 'number' ? item.annoyedUntil : 0;
              const recentPetTimes = Array.isArray(item.recentPetTimes) ? item.recentPetTimes : [];
              const elapsed = now - lastPetAt;

              const isAnnoyedNow = isCatAnnoyed(annoyedUntil, now);
              let initialScore = item.score;

              if (isAnnoyedNow) {
                initialScore = ANNOYED_MOOD_SCORE;
              } else if (enableDecay) {
                initialScore = calculateDecayedMood(baseScore, elapsed, decayPerMinute);
              }

              restored[preset.id] = {
                score: initialScore,
                baseScore: isAnnoyedNow ? ANNOYED_MOOD_SCORE : baseScore,
                lastPetAt,
                annoyedUntil,
                recentPetTimes,
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

  const moodsRef = useRef<CatsMoodMap>(moods);
  useEffect(() => {
    moodsRef.current = moods;
  }, [moods]);

  const saveToStorage = (updated: CatsMoodMap) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // フォールバック
    }
  };

  // 一定時間経過した際に、ページ再読み込みを行わなくてもリアルタイムに機嫌減衰・不機嫌回復を反映するループ
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      setMoods((prev) => {
        let hasChanged = false;
        const nextMap: CatsMoodMap = { ...prev };

        for (const preset of CAT_PRESETS) {
          const item = prev[preset.id];
          if (!item) continue;

          // 1. 不機嫌状態からの自動回復チェック
          if (item.annoyedUntil && item.annoyedUntil > 0) {
            if (now >= item.annoyedUntil) {
              // 不機嫌が解けて平常状態（20点・おだやか）に戻る
              hasChanged = true;
              nextMap[preset.id] = {
                ...item,
                score: DEFAULT_INITIAL_MOOD_SCORE,
                baseScore: DEFAULT_INITIAL_MOOD_SCORE,
                annoyedUntil: 0,
                recentPetTimes: [],
              };
              continue;
            }
          }

          // 2. 自然減衰チェック（通常時）
          if (enableDecay) {
            const isAnnoyedNow = isCatAnnoyed(item.annoyedUntil, now);
            if (!isAnnoyedNow) {
              const baseScore = item.baseScore ?? item.score;
              const elapsed = now - item.lastPetAt;
              const decayed = calculateDecayedMood(baseScore, elapsed, decayPerMinute);

              if (decayed !== item.score) {
                hasChanged = true;
                nextMap[preset.id] = {
                  ...item,
                  score: decayed,
                };
              }
            }
          }
        }

        if (!hasChanged) {
          return prev;
        }

        saveToStorage(nextMap);
        return nextMap;
      });
    }, decayCheckIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enableDecay, decayCheckIntervalMs, decayPerMinute]);

  const getMoodScore = useCallback(
    (catId: CatId): number => {
      return moods[catId]?.score ?? DEFAULT_INITIAL_MOOD_SCORE;
    },
    [moods]
  );

  const getMoodLevelForCat = useCallback(
    (catId: CatId): CatMoodLevel => {
      const item = moods[catId];
      const now = Date.now();
      const isAnnoyedNow = isCatAnnoyed(item?.annoyedUntil, now);
      const score = item?.score ?? DEFAULT_INITIAL_MOOD_SCORE;
      return getMoodLevel(score, isAnnoyedNow);
    },
    [moods]
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
      const now = Date.now();
      const current = moodsRef.current[catId] ?? {
        score: DEFAULT_INITIAL_MOOD_SCORE,
        baseScore: DEFAULT_INITIAL_MOOD_SCORE,
        lastPetAt: now,
        annoyedUntil: 0,
        recentPetTimes: [],
      };

      // 過去のタイムスタンプから監視ウィンドウ内のものを抽出し、今回のタイムスタンプを追加
      const filteredRecent = (current.recentPetTimes || []).filter(
        (t) => now - t >= 0 && now - t <= overstimulationWindowMs
      );
      const nextRecent = [...filteredRecent, now];

      const currentlyAnnoyed = isCatAnnoyed(current.annoyedUntil, now);
      const overstimulated = checkOverstimulation(
        nextRecent,
        now,
        overstimulationWindowMs,
        overstimulationThresholdCount
      );

      let nextScore: number;
      let nextLevel: CatMoodLevel;
      let nextAnnoyedUntil: number;

      // 愛撫誘発性攻撃行動：現在不機嫌中、または短時間の過剰撫で回数がしきい値に達した場合
      if (currentlyAnnoyed || overstimulated) {
        nextScore = ANNOYED_MOOD_SCORE;
        nextLevel = 'annoyed';
        nextAnnoyedUntil = now + annoyedDurationMs;
      } else {
        // 通常の機嫌上昇
        const effectiveBase = current.baseScore ?? current.score;
        const currentDecayed = enableDecay
          ? calculateDecayedMood(effectiveBase, now - current.lastPetAt, decayPerMinute)
          : current.score;

        nextScore = calculateNextMood(currentDecayed, petIncrement);
        nextLevel = getMoodLevel(nextScore, false);
        nextAnnoyedUntil = 0;
      }

      const nextItem: CatMoodState = {
        score: nextScore,
        baseScore: nextScore,
        lastPetAt: now,
        annoyedUntil: nextAnnoyedUntil,
        recentPetTimes: nextRecent,
      };

      const nextMap: CatsMoodMap = {
        ...moodsRef.current,
        [catId]: nextItem,
      };

      moodsRef.current = nextMap;
      saveToStorage(nextMap);
      setMoods(nextMap);

      return { nextScore, nextLevel };
    },
    [
      petIncrement,
      enableDecay,
      decayPerMinute,
      overstimulationWindowMs,
      overstimulationThresholdCount,
      annoyedDurationMs,
    ]
  );

  const resetMood = useCallback((catId: CatId) => {
    const now = Date.now();
    const nextItem: CatMoodState = {
      score: DEFAULT_INITIAL_MOOD_SCORE,
      baseScore: DEFAULT_INITIAL_MOOD_SCORE,
      lastPetAt: now,
      annoyedUntil: 0,
      recentPetTimes: [],
    };
    const nextMap: CatsMoodMap = {
      ...moodsRef.current,
      [catId]: nextItem,
    };
    moodsRef.current = nextMap;
    saveToStorage(nextMap);
    setMoods(nextMap);
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
