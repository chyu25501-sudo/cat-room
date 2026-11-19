import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AchievementItem,
  UnlockedAchievements,
  AchievementToast,
} from '../types/achievement.ts';
import {
  ACHIEVEMENTS,
  ACHIEVEMENTS_STORAGE_KEY,
  AchievementCheckContext,
  checkNewAchievements,
  sanitizeAchievements,
} from '../utils/catAchievements.ts';

export interface UseAchievementsOptions {
  /** 実績マスターカタログ（デフォルト: ACHIEVEMENTS） */
  catalog?: readonly AchievementItem[];
  /** トーストの表示ミリ秒（デフォルト: 3500ms） */
  toastDurationMs?: number;
}

export interface UseAchievementsReturn {
  /** 解除済み実績マップ */
  unlocked: UnlockedAchievements;
  /** 全実績カタログ */
  catalog: readonly AchievementItem[];
  /** 達成済み実績の総数 */
  unlockedCount: number;
  /** 全実績の総数 */
  totalCount: number;
  /** 現在画面上部に表示中の実績解除トースト一覧（複数ある場合は縦並び） */
  toasts: AchievementToast[];
  /**
   * コンテキストを与えて新規実績を判定・解除する関数
   * 複数同時に満たされた場合、該当するすべてを解除しトーストに同時追加します
   */
  checkAndUnlock: (context: AchievementCheckContext) => AchievementItem[];
  /** 特定のトーストを消去する関数 */
  dismissToast: (id: string) => void;
  /** 実績データをリセットする関数（初期化用） */
  resetAchievements: () => void;
  /** 実績データを一括復元・更新する関数（データ引き継ぎ・同期用） */
  restoreAchievements: (newAchievements: UnlockedAchievements) => void;
}

/**
 * 実績機能の判定・永続化・トースト通知表示を管理するカスタムフック
 */
export function useAchievements(options: UseAchievementsOptions = {}): UseAchievementsReturn {
  const { catalog = ACHIEVEMENTS, toastDurationMs = 3500 } = options;

  const [unlocked, setUnlocked] = useState<UnlockedAchievements>(() => {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (!stored) {
        return {};
      }
      return sanitizeAchievements(JSON.parse(stored));
    } catch {
      return {};
    }
  });

  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // localStorage への同期
  useEffect(() => {
    try {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(unlocked));
    } catch {
      // localStorage が制限された環境でも画面クラッシュを防止
    }
  }, [unlocked]);

  // クリーンアップ
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts.clear();
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const checkAndUnlock = useCallback(
    (context: AchievementCheckContext): AchievementItem[] => {
      const newItems = checkNewAchievements(context, unlocked, catalog);
      if (newItems.length === 0) {
        return [];
      }

      const now = Date.now();
      const updatedMap: UnlockedAchievements = { ...unlocked };
      const newToasts: AchievementToast[] = [];

      for (const item of newItems) {
        updatedMap[item.id] = {
          id: item.id,
          unlockedAt: now,
        };

        newToasts.push({
          id: item.id,
          title: item.title,
          description: item.description,
          timestamp: now,
        });
      }

      // 永続化ステートの更新
      setUnlocked(updatedMap);

      // トースト通知の追加（複数同時獲得時は配列にそのまま追加され縦に並ぶ）
      setToasts((prev) => [...prev, ...newToasts]);

      // 各トーストの自動消去タイマーを設定
      for (const toast of newToasts) {
        const timeout = setTimeout(() => {
          dismissToast(toast.id);
        }, toastDurationMs);
        timeoutsRef.current.set(toast.id, timeout);
      }

      return newItems;
    },
    [unlocked, catalog, toastDurationMs, dismissToast]
  );

  const resetAchievements = useCallback(() => {
    setUnlocked({});
    setToasts([]);
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current.clear();
    try {
      localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const restoreAchievements = useCallback((newAchievements: UnlockedAchievements) => {
    setUnlocked(newAchievements);
  }, []);

  const unlockedCount = Object.keys(unlocked).length;
  const totalCount = catalog.length;

  return {
    unlocked,
    catalog,
    unlockedCount,
    totalCount,
    toasts,
    checkAndUnlock,
    dismissToast,
    resetAchievements,
    restoreAchievements,
  };
}
