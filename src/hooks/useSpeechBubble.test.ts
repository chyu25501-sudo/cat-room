import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSpeechBubble } from './useSpeechBubble.ts';

describe('useSpeechBubble フック (吹き出し表示とタイマー管理)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態では吹き出しテキストが null であること', () => {
    const { result } = renderHook(() => useSpeechBubble());
    expect(result.current.bubbleText).toBeNull();
  });

  it('showBubble を1回呼ぶとメッセージが表示され、指定時間後に消えること', () => {
    const { result } = renderHook(() =>
      useSpeechBubble({ durationMs: 2000 })
    );

    act(() => {
      result.current.showBubble('ニャ〜ン♪');
    });

    expect(result.current.bubbleText).toBe('ニャ〜ン♪');

    // 1.9秒経過時点ではまだ表示されている
    act(() => {
      vi.advanceTimersByTime(1900);
    });
    expect(result.current.bubbleText).toBe('ニャ〜ン♪');

    // 2.0秒経過すると null になる
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.bubbleText).toBeNull();
  });

  it('連続してなでられた際に、過去のタイマーが破棄され一瞬で消える現象が防がれること', () => {
    const { result } = renderHook(() =>
      useSpeechBubble({ durationMs: 2000, minHoldMs: 1500 })
    );

    // 1回目のなで (t = 0)
    act(() => {
      result.current.showBubble('ニャ〜ン♪');
    });
    expect(result.current.bubbleText).toBe('ニャ〜ン♪');

    // 1.8秒経過（1回目のタイマー終了直前）
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    expect(result.current.bubbleText).toBe('ニャ〜ン♪');

    // 2回目のなで (t = 1.8s): 以前の実装だと、0.2秒後(t = 2.0s)に1回目のタイマーで消えていた
    act(() => {
      result.current.showBubble('ゴロゴロ…♪');
    });

    // 1回目から2.0秒（2回目のなでから0.2秒）経過しても消えないこと！
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.bubbleText).not.toBeNull();

    // 2回目のなでから合計1.9秒経過してもまだ表示されている
    act(() => {
      vi.advanceTimersByTime(1700);
    });
    expect(result.current.bubbleText).not.toBeNull();

    // 2回目のなでから2.0秒（合計3.8秒）経過して初めて消える
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.bubbleText).toBeNull();
  });

  it('最低維持時間（minHoldMs）内の連続呼び出しではメッセージのチラつきを防ぎつつ表示を延長すること', () => {
    const { result } = renderHook(() =>
      useSpeechBubble({ durationMs: 2000, minHoldMs: 1500 })
    );

    // 1回目
    act(() => {
      result.current.showBubble('1つ目のメッセージ');
    });
    expect(result.current.bubbleText).toBe('1つ目のメッセージ');

    // 500ms後（minHoldMs = 1500ms より短い）のなでなで
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.showBubble('2つ目のメッセージ');
    });

    // テキストは急激に切り替わらず維持される
    expect(result.current.bubbleText).toBe('1つ目のメッセージ');

    // さらに1100ms後（最初のメッセージ表示から1600ms経過）のなでなで
    act(() => {
      vi.advanceTimersByTime(1100);
      result.current.showBubble('3つ目のメッセージ');
    });

    // minHoldMs を超えているため新しいメッセージに更新される
    expect(result.current.bubbleText).toBe('3つ目のメッセージ');
  });

  it('force: true が指定された場合は即座に新しいメッセージに切り替わること（猫切替や機嫌上昇時）', () => {
    const { result } = renderHook(() =>
      useSpeechBubble({ durationMs: 2000, minHoldMs: 1500 })
    );

    act(() => {
      result.current.showBubble('通常メッセージ');
    });
    expect(result.current.bubbleText).toBe('通常メッセージ');

    // 300ms 後に force: true で切り替え
    act(() => {
      vi.advanceTimersByTime(300);
      result.current.showBubble('しろねこにきりかえたよ♪', { force: true });
    });

    expect(result.current.bubbleText).toBe('しろねこにきりかえたよ♪');
  });

  it('clearBubble を呼ぶと即座に非表示になりタイマーも解除されること', () => {
    const { result } = renderHook(() =>
      useSpeechBubble({ durationMs: 2000 })
    );

    act(() => {
      result.current.showBubble('メッセージ');
    });
    expect(result.current.bubbleText).toBe('メッセージ');

    act(() => {
      result.current.clearBubble();
    });
    expect(result.current.bubbleText).toBeNull();
  });

  it('アンマウント時にタイマーが破棄されること', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { result, unmount } = renderHook(() => useSpeechBubble());

    act(() => {
      result.current.showBubble('テスト');
    });

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

