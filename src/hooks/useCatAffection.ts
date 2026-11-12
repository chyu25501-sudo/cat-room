import { useState, useCallback, useEffect, useRef } from 'react';
import { CatId, CAT_PRESETS } from '../types/cat.ts';
import {
  CatAffectionState,
  CatsAffectionMap,
  AffectionGainResult,
} from '../types/affection.ts';
import {
  MIN_AFFECTION_LEVEL,
  calculateRequiredExp,
  calculateAffectionProgress,
  calculateAffectionGain,
} from '../utils/catAffection.ts';

const STORAGE_KEY = 'nekoppoi_cats_affection';

export interface UseCatAffectionOptions {
  /** 初期なつき度レベル（未指定時は1） */
  initialLevel?: number;
  /** 初期Exp（未指定時は0） */
  initialExp?: number;
}

export interface UseCatAffectionResult {
  /** 猫ごとのなつき度状態マップ */
  affectionMap: CatsAffectionMap;
  /** 指定した猫のなつき度ステータスを取得 */
  getAffectionState: (catId: CatId) => CatAffectionState;
  /** 指定した猫のなつき度レベルを取得（1〜10） */
  getAffectionLevel: (catId: CatId) => number;
  /** 指定した猫のなつき度ゲージ進行度（0〜100%）を取得 */
  getAffectionProgress: (catId: CatId) => number;
  /** ふれあい（なでる・ごはん・おもちゃ）によりなつき度Expを獲得・レベルアップ判定する関数 */
  gainAffection: (catId: CatId, exp: number) => AffectionGainResult;
  /** 指定した猫のなつき度を初期状態（Lv.1, 0pt）にリセットする関数 */
  resetAffection: (catId: CatId) => void;
}

function createDefaultAffectionMap(
  initialLevel: number = MIN_AFFECTION_LEVEL,
  initialExp: number = 0
): CatsAffectionMap {
  return CAT_PRESETS.reduce<CatsAffectionMap>((acc, preset) => {
    acc[preset.id] = {
      level: initialLevel,
      currentExp: initialExp,
      requiredExp: calculateRequiredExp(initialLevel),
    };
    return acc;
  }, {} as CatsAffectionMap);
}

/**
 * 猫ごとの「なつき度（レベル＆ゲージ進捗）」を管理するカスタムフック (第7週)
 * なでなで・ごはん・おもちゃ等のふれあいを通じてゲージが溜まり、満タンでレベルアップ＆ゲージリセットします。
 */
export function useCatAffection(
  options: UseCatAffectionOptions = {}
): UseCatAffectionResult {
  const {
    initialLevel = MIN_AFFECTION_LEVEL,
    initialExp = 0,
  } = options;

  const [affectionMap, setAffectionMap] = useState<CatsAffectionMap>(() => {
    const defaults = createDefaultAffectionMap(initialLevel, initialExp);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<CatsAffectionMap>;
          const restored: CatsAffectionMap = { ...defaults };
          for (const key of Object.keys(defaults) as CatId[]) {
            const item = parsed[key];
            if (item && typeof item.level === 'number' && typeof item.currentExp === 'number') {
              const level = Math.max(1, Math.min(10, item.level));
              const requiredExp = calculateRequiredExp(level);
              restored[key] = {
                level,
                currentExp: Math.max(0, item.currentExp),
                requiredExp,
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

  const affectionRef = useRef(affectionMap);
  useEffect(() => {
    affectionRef.current = affectionMap;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(affectionMap));
      }
    } catch {
      // クォータ超過エラー等を安全に無視
    }
  }, [affectionMap]);

  const getAffectionState = useCallback(
    (catId: CatId): CatAffectionState => {
      return (
        affectionMap[catId] ?? {
          level: initialLevel,
          currentExp: initialExp,
          requiredExp: calculateRequiredExp(initialLevel),
        }
      );
    },
    [affectionMap, initialLevel, initialExp]
  );

  const getAffectionLevel = useCallback(
    (catId: CatId): number => {
      return getAffectionState(catId).level;
    },
    [getAffectionState]
  );

  const getAffectionProgress = useCallback(
    (catId: CatId): number => {
      const state = getAffectionState(catId);
      return calculateAffectionProgress(state.currentExp, state.requiredExp, state.level);
    },
    [getAffectionState]
  );

  const gainAffection = useCallback(
    (catId: CatId, exp: number): AffectionGainResult => {
      const current = affectionRef.current[catId] ?? {
        level: initialLevel,
        currentExp: initialExp,
        requiredExp: calculateRequiredExp(initialLevel),
      };

      const result = calculateAffectionGain(current.level, current.currentExp, exp);

      const nextState: CatAffectionState = {
        level: result.nextLevel,
        currentExp: result.currentExp,
        requiredExp: result.requiredExp,
      };

      setAffectionMap((prev) => ({
        ...prev,
        [catId]: nextState,
      }));

      return result;
    },
    [initialLevel, initialExp]
  );

  const resetAffection = useCallback(
    (catId: CatId) => {
      const defaultState: CatAffectionState = {
        level: initialLevel,
        currentExp: initialExp,
        requiredExp: calculateRequiredExp(initialLevel),
      };
      setAffectionMap((prev) => ({
        ...prev,
        [catId]: defaultState,
      }));
    },
    [initialLevel, initialExp]
  );

  return {
    affectionMap,
    getAffectionState,
    getAffectionLevel,
    getAffectionProgress,
    gainAffection,
    resetAffection,
  };
}
