import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAffectionLevelUp } from './useAffectionLevelUp.ts';

describe('useAffectionLevelUp フック', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態では演出ステートが null であること', () => {
    const { result } = renderHook(() => useAffectionLevelUp());
    expect(result.current.levelUpState).toBeNull();
  });

  it('triggerLevelUp を呼び出すと表示状態になり、時間経過でフェードアウトして非表示になること', () => {
    const { result } = renderHook(() =>
      useAffectionLevelUp({ displayDurationMs: 2000, fadeDurationMs: 500 })
    );

    act(() => {
      result.current.triggerLevelUp({
        level: 2,
        catName: 'くろねこ',
        title: 'ちょっと気になる',
      });
    });

    // 表示開始
    expect(result.current.levelUpState).toEqual({
      level: 2,
      catName: 'くろねこ',
      title: 'ちょっと気になる',
      isFading: false,
    });

    // 2000ms 経過 -> フェードアウト開始
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.levelUpState?.isFading).toBe(true);

    // さらに 500ms 経過 -> 完全に非表示（null）
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.levelUpState).toBeNull();
  });

  it('表示途中で新しく triggerLevelUp が呼ばれた場合、タイマーが再設定されること', () => {
    const { result } = renderHook(() =>
      useAffectionLevelUp({ displayDurationMs: 2000, fadeDurationMs: 500 })
    );

    act(() => {
      result.current.triggerLevelUp({
        level: 2,
        catName: 'くろねこ',
        title: 'ちょっと気になる',
      });
    });

    // 1500ms 経過（まだ表示中）
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // 新たに Lv.3 がトリガー
    act(() => {
      result.current.triggerLevelUp({
        level: 3,
        catName: 'くろねこ',
        title: '顔なじみ',
      });
    });

    expect(result.current.levelUpState).toEqual({
      level: 3,
      catName: 'くろねこ',
      title: '顔なじみ',
      isFading: false,
    });

    // さらに 1000ms（計2500ms）経過しても、新しいタイマー基準なのでまだ表示中
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.levelUpState?.isFading).toBe(false);

    // さらに 1000ms 経過（2000ms達成）でフェードアウト
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.levelUpState?.isFading).toBe(true);
  });

  it('dismissLevelUp を呼ぶと即座にステートがクリアされること', () => {
    const { result } = renderHook(() => useAffectionLevelUp());

    act(() => {
      result.current.triggerLevelUp({
        level: 2,
        catName: 'しろねこ',
        title: 'ちょっと気になる',
      });
    });

    expect(result.current.levelUpState).not.toBeNull();

    act(() => {
      result.current.dismissLevelUp();
    });

    expect(result.current.levelUpState).toBeNull();
  });
});
