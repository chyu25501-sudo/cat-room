import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageVisibility } from './usePageVisibility.ts';

describe('usePageVisibility カスタムフック', () => {
  let originalVisibilityState: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');
  });

  afterEach(() => {
    if (originalVisibilityState) {
      Object.defineProperty(document, 'visibilityState', originalVisibilityState);
    }
  });

  function setVisibilityState(state: 'visible' | 'hidden') {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => state,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  }

  it('初期レンダリング時に document.visibilityState が visible であれば isVisible が true であること', () => {
    setVisibilityState('visible');
    const { result } = renderHook(() => usePageVisibility());
    expect(result.current.isVisible).toBe(true);
  });

  it('タブが非表示（hidden）になったとき isVisible が false になること', () => {
    setVisibilityState('visible');
    const { result } = renderHook(() => usePageVisibility());

    act(() => {
      setVisibilityState('hidden');
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('タブが非表示から表示（visible）に復帰したとき、onVisible に非表示期間（ミリ秒）が渡されて呼び出されること', () => {
    let mockNow = 1000000;
    const nowFn = () => mockNow;
    const onVisible = vi.fn();

    setVisibilityState('visible');
    const { result } = renderHook(() => usePageVisibility({ onVisible, nowFn }));

    // 非表示にする
    act(() => {
      setVisibilityState('hidden');
    });
    expect(result.current.isVisible).toBe(false);
    expect(onVisible).not.toHaveBeenCalled();

    // 15分（900,000ms）経過
    mockNow += 15 * 60 * 1000;

    // 表示に復帰する
    act(() => {
      setVisibilityState('visible');
    });
    expect(result.current.isVisible).toBe(true);
    expect(onVisible).toHaveBeenCalledTimes(1);
    expect(onVisible).toHaveBeenCalledWith(15 * 60 * 1000);
  });

  it('非表示状態を経ずに visible イベントが発生した場合は onVisible が呼ばれないこと', () => {
    const onVisible = vi.fn();
    setVisibilityState('visible');
    renderHook(() => usePageVisibility({ onVisible }));

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(onVisible).not.toHaveBeenCalled();
  });

  it('アンマウント時にイベントリスナーが解除されること', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => usePageVisibility());

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
