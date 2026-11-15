import { useState, useEffect, useCallback } from 'react';
import { CareActionType, CareStats } from '../types/journal.ts';
import {
  CARE_JOURNAL_STORAGE_KEY,
  INITIAL_CARE_STATS,
  recordInteraction,
  sanitizeCareStats,
} from '../utils/careJournal.ts';

export interface UseCareJournalReturn {
  /** 統計データ */
  stats: CareStats;
  /** ふれあいアクションを記録する関数（更新後の CareStats を返す） */
  recordCareAction: (actionType: CareActionType, catId: string) => CareStats;
  /** 統計データをリセットする関数 */
  resetStats: () => void;
}

/**
 * ふり返り手帳（お世話統計情報）の状態管理と localStorage 永続化を担うカスタムフック
 */
export function useCareJournal(): UseCareJournalReturn {
  const [stats, setStats] = useState<CareStats>(() => {
    if (typeof window === 'undefined') {
      return { ...INITIAL_CARE_STATS };
    }

    try {
      const stored = localStorage.getItem(CARE_JOURNAL_STORAGE_KEY);
      if (!stored) {
        return { ...INITIAL_CARE_STATS };
      }
      return sanitizeCareStats(JSON.parse(stored));
    } catch (e) {
      console.warn('Failed to load care journal stats from localStorage:', e);
      return { ...INITIAL_CARE_STATS };
    }
  });

  // stats が変化したときに localStorage に保存
  useEffect(() => {
    try {
      localStorage.setItem(CARE_JOURNAL_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save care journal stats to localStorage:', e);
    }
  }, [stats]);

  /**
   * 猫とのふれあいを1回記録する
   */
  const recordCareAction = useCallback(
    (actionType: CareActionType, catId: string): CareStats => {
      let updatedStats = stats;
      setStats((prev) => {
        const next = recordInteraction(prev, actionType, catId);
        updatedStats = next;
        return next;
      });
      return updatedStats;
    },
    [stats]
  );

  /**
   * 統計データを初期状態にリセットする
   */
  const resetStats = useCallback(() => {
    setStats({ ...INITIAL_CARE_STATS });
  }, []);

  return {
    stats,
    recordCareAction,
    resetStats,
  };
}
