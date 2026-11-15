import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAchievements } from './useAchievements.ts';
import { ACHIEVEMENTS_STORAGE_KEY } from '../utils/catAchievements.ts';

describe('useAchievements hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態では解除実績が0件で、トーストも空であること', () => {
    const { result } = renderHook(() => useAchievements());
    expect(result.current.unlockedCount).toBe(0);
    expect(result.current.totalCount).toBe(5);
    expect(result.current.toasts).toHaveLength(0);
  });

  it('checkAndUnlock で単一の実績が解除され、トーストが生成されて数秒後に自動消滅すること', () => {
    const { result } = renderHook(() => useAchievements({ toastDurationMs: 3000 }));

    act(() => {
      const unlocked = result.current.checkAndUnlock({ action: 'pet' });
      expect(unlocked).toHaveLength(1);
      expect(unlocked[0].id).toBe('first-pet');
    });

    expect(result.current.unlockedCount).toBe(1);
    expect(result.current.unlocked['first-pet']).toBeDefined();
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('はじめまして！');

    // 2999ms 経過時点ではトーストが表示中
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(result.current.toasts).toHaveLength(1);

    // 3000ms 経過でトーストが消去される
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it('複数条件が同時に満たされた場合、複数の実績が同時に解除されトーストに複数追加されること', () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      const unlocked = result.current.checkAndUnlock({
        action: 'feed',
        moodScore: 100,
        moodLevel: 'ecstatic',
      });
      expect(unlocked).toHaveLength(2);
      expect(unlocked.map((a) => a.id)).toEqual(['first-feed', 'mood-ecstatic']);
    });

    expect(result.current.unlockedCount).toBe(2);
    // トーストにも2件追加されていること（縦並び表示用）
    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].id).toBe('first-feed');
    expect(result.current.toasts[1].id).toBe('mood-ecstatic');
  });

  it('localStorage に保存された実績データを正しく復元できること', () => {
    localStorage.setItem(
      ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify({
        'first-pet': { id: 'first-pet', unlockedAt: 1000 },
        'first-feed': { id: 'first-feed', unlockedAt: 2000 },
      })
    );

    const { result } = renderHook(() => useAchievements());
    expect(result.current.unlockedCount).toBe(2);
    expect(result.current.unlocked['first-pet']).toBeDefined();
    expect(result.current.unlocked['first-feed']).toBeDefined();
  });
});
