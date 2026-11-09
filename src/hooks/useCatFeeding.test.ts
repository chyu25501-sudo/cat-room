import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCatFeeding } from './useCatFeeding.ts';
import { FOOD_ITEMS } from '../utils/catCare.ts';

describe('useCatFeeding フック', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態では activeFood が null で isEating が false であること', () => {
    const { result } = renderHook(() => useCatFeeding());
    expect(result.current.activeFood).toBeNull();
    expect(result.current.isEating).toBe(false);
  });

  it('startFeeding を呼ぶと指定したごはんが activeFood にセットされ isEating が true になること', () => {
    const { result } = renderHook(() => useCatFeeding({ durationMs: 2000 }));
    const kibble = FOOD_ITEMS[0];

    act(() => {
      result.current.startFeeding(kibble);
    });

    expect(result.current.activeFood).toEqual(kibble);
    expect(result.current.isEating).toBe(true);

    // durationMs 経過後、自動的にクリアされること
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.activeFood).toBeNull();
    expect(result.current.isEating).toBe(false);
  });

  it('stopFeeding を呼ぶとタイマーを待たずに即時リセットされること', () => {
    const { result } = renderHook(() => useCatFeeding({ durationMs: 3000 }));
    const canned = FOOD_ITEMS[1];

    act(() => {
      result.current.startFeeding(canned);
    });

    expect(result.current.isEating).toBe(true);

    act(() => {
      result.current.stopFeeding();
    });

    expect(result.current.activeFood).toBeNull();
    expect(result.current.isEating).toBe(false);
  });

  it('連続して startFeeding を呼んだ場合、前のタイマーがキャンセルされ新しいごはんに更新されること', () => {
    const { result } = renderHook(() => useCatFeeding({ durationMs: 2000 }));
    const kibble = FOOD_ITEMS[0];
    const treat = FOOD_ITEMS[2];

    act(() => {
      result.current.startFeeding(kibble);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
      result.current.startFeeding(treat);
    });

    expect(result.current.activeFood).toEqual(treat);
    expect(result.current.isEating).toBe(true);

    // 最初のタイマー満了時（1000ms後）でも、まだ新しい treat の食事中であること
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.activeFood).toEqual(treat);
    expect(result.current.isEating).toBe(true);

    // さらに1000ms後（合計2000ms後）にクリアされること
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.activeFood).toBeNull();
    expect(result.current.isEating).toBe(false);
  });
});
