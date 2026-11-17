import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGiftToasts } from './useGiftToasts.ts';

describe('useGiftToasts フック', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態では toasts が空配列であること', () => {
    const { result } = renderHook(() => useGiftToasts());
    expect(result.current.toasts).toEqual([]);
  });

  it('addGiftToast でトーストが追加され、指定時間後に自動消去されること', () => {
    const { result } = renderHook(() => useGiftToasts({ durationMs: 3000 }));

    act(() => {
      result.current.addGiftToast({
        catId: 'black',
        catName: 'くろねこ',
        gift: {
          id: 'pebble',
          name: 'きれいな小石',
          description: '',
          icon: '🪨',
          iconType: 'pebble',
          themeClass: '',
          rarity: 'common',
        },
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].catName).toBe('くろねこ');

    // 3000ms経過後
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('dismissGiftToast で手動で消去できること', () => {
    const { result } = renderHook(() => useGiftToasts());

    act(() => {
      result.current.addGiftToast({
        catId: 'white',
        catName: 'しろねこ',
        gift: {
          id: 'pebble',
          name: 'きれいな小石',
          description: '',
          icon: '🪨',
          iconType: 'pebble',
          themeClass: '',
          rarity: 'common',
        },
      });
    });

    const toastId = result.current.toasts[0].id;
    act(() => {
      result.current.dismissGiftToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
