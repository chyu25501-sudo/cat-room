import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCatPlay } from './useCatPlay.ts';
import { TOY_ITEMS } from '../utils/catCare.ts';

describe('useCatPlay フック (第6週: おもちゃ遊びフック)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態では activeToy が null で isPlayingToy が false であること', () => {
    const { result } = renderHook(() => useCatPlay());
    expect(result.current.activeToy).toBeNull();
    expect(result.current.isPlayingToy).toBe(false);
  });

  it('startPlaying を呼ぶと指定したおもちゃがセットされ isPlayingToy が true になること', () => {
    const { result } = renderHook(() => useCatPlay({ durationMs: 2000 }));
    const teaser = TOY_ITEMS[0];

    act(() => {
      result.current.startPlaying(teaser);
    });

    expect(result.current.activeToy).toEqual(teaser);
    expect(result.current.isPlayingToy).toBe(true);

    // durationMs 経過後に自動クリアされること
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.activeToy).toBeNull();
    expect(result.current.isPlayingToy).toBe(false);
  });

  it('stopPlaying を呼ぶと即時リセットされること', () => {
    const { result } = renderHook(() => useCatPlay({ durationMs: 3000 }));
    const ball = TOY_ITEMS[1];

    act(() => {
      result.current.startPlaying(ball);
    });

    expect(result.current.isPlayingToy).toBe(true);

    act(() => {
      result.current.stopPlaying();
    });

    expect(result.current.activeToy).toBeNull();
    expect(result.current.isPlayingToy).toBe(false);
  });
});
