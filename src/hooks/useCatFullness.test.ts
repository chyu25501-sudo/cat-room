import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCatFullness } from './useCatFullness.ts';

describe('useCatFullness フック', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('初期状態でデフォルトスコア（50%）と「ほどよい」レベルが設定されること', () => {
    const { result } = renderHook(() => useCatFullness());

    expect(result.current.getFullnessScore('black')).toBe(50);
    expect(result.current.getFullnessScore('white')).toBe(50);
    expect(result.current.getFullnessLevelForCat('black')).toBe('satisfied');
    expect(result.current.getFullnessInfoForCat('black').label).toBe('ほどよい');
  });

  it('feedCatFullness: ごはんを与えるとまんぷく度が上昇すること', () => {
    const { result } = renderHook(() => useCatFullness());

    act(() => {
      // カリカリ（+25）を与える: 50 + 25 = 75
      const res = result.current.feedCatFullness('black', 25);
      expect(res.nextScore).toBe(75);
      expect(res.nextLevel).toBe('satisfied');
    });

    expect(result.current.getFullnessScore('black')).toBe(75);
    // 白猫は影響を受けないこと（猫ごとに独立）
    expect(result.current.getFullnessScore('white')).toBe(50);

    act(() => {
      // ねこ缶（+35）を与える: 75 + 35 = 110 -> 100クランプ
      const res = result.current.feedCatFullness('black', 35);
      expect(res.nextScore).toBe(100);
      expect(res.nextLevel).toBe('full');
    });

    expect(result.current.getFullnessScore('black')).toBe(100);
    expect(result.current.getFullnessLevelForCat('black')).toBe('full');
  });

  it('時間経過によりごきげん度よりもゆるやかに減衰すること', () => {
    vi.useFakeTimers();
    try {
      const now = 1000000;
      vi.setSystemTime(now);

      const { result } = renderHook(() =>
        useCatFullness({
          initialScore: 60,
          decayCheckIntervalMs: 2000,
          decayPerMinute: 1, // 1分に1点減衰
        })
      );

      expect(result.current.getFullnessScore('black')).toBe(60);

      // 5分（300,000ms）経過: 5点減衰 -> 55%
      act(() => {
        vi.advanceTimersByTime(300000);
      });

      expect(result.current.getFullnessScore('black')).toBe(55);
    } finally {
      vi.useRealTimers();
    }
  });

  it('localStorage に保存され、復元されること', () => {
    const { result, unmount } = renderHook(() => useCatFullness({ enableDecay: false }));

    act(() => {
      result.current.feedCatFullness('black', 30);
    });

    expect(result.current.getFullnessScore('black')).toBe(80);
    unmount();

    // 再マウント時に復元されること
    const { result: newResult } = renderHook(() => useCatFullness({ enableDecay: false }));
    expect(newResult.current.getFullnessScore('black')).toBe(80);
  });

  it('resetFullness: スコアが初期値にリセットされること', () => {
    const { result } = renderHook(() => useCatFullness());

    act(() => {
      result.current.feedCatFullness('black', 40);
    });
    expect(result.current.getFullnessScore('black')).toBe(90);

    act(() => {
      result.current.resetFullness('black');
    });
    expect(result.current.getFullnessScore('black')).toBe(50);
  });
});
