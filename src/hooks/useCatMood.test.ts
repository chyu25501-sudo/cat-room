import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCatMood } from './useCatMood.ts';

describe('useCatMood フック (第4週: 猫ごとの機嫌管理)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態では全猫プリセットがベースラインスコア（20・おだやか）であること', () => {
    const { result } = renderHook(() => useCatMood({ enableDecay: false }));

    expect(result.current.getMoodScore('black')).toBe(20);
    expect(result.current.getMoodLevelForCat('black')).toBe('normal');

    expect(result.current.getMoodScore('white')).toBe(20);
    expect(result.current.getMoodLevelForCat('white')).toBe('normal');
  });

  it('黒猫をなでると黒猫の機嫌のみが上昇し、白猫の機嫌には影響しないこと（猫ごとの独立管理）', () => {
    const { result } = renderHook(() =>
      useCatMood({ petIncrement: 15, enableDecay: false })
    );

    act(() => {
      result.current.petCat('black');
    });

    // 黒猫: 20 + 15 = 35
    expect(result.current.getMoodScore('black')).toBe(35);

    // 白猫: 依然として20のまま
    expect(result.current.getMoodScore('white')).toBe(20);
  });

  it('何度もなでることで機嫌レベルが段階的（normal -> happy -> ecstatic）に上昇すること', () => {
    const { result } = renderHook(() =>
      useCatMood({ petIncrement: 20, enableDecay: false })
    );

    // 初期: 20 (normal)
    expect(result.current.getMoodLevelForCat('black')).toBe('normal');

    // 1回なで: 40 (happy しきい値到達)
    act(() => {
      result.current.petCat('black');
    });
    expect(result.current.getMoodScore('black')).toBe(40);
    expect(result.current.getMoodLevelForCat('black')).toBe('happy');
    expect(result.current.getMoodInfoForCat('black').label).toBe('ごきげん♪');

    // 2回なで: 60 (happy)
    act(() => {
      result.current.petCat('black');
    });
    expect(result.current.getMoodScore('black')).toBe(60);
    expect(result.current.getMoodLevelForCat('black')).toBe('happy');

    // 3回なで: 80 (ecstatic しきい値到達)
    act(() => {
      result.current.petCat('black');
    });
    expect(result.current.getMoodScore('black')).toBe(80);
    expect(result.current.getMoodLevelForCat('black')).toBe('ecstatic');
    expect(result.current.getMoodInfoForCat('black').label).toBe('ごきげんMAX♡');
  });

  it('機嫌スコアは上限100で適切にクランプされること', () => {
    const { result } = renderHook(() =>
      useCatMood({ petIncrement: 50, enableDecay: false })
    );

    act(() => {
      result.current.petCat('black'); // 20 + 50 = 70
      result.current.petCat('black'); // 70 + 50 = 120 -> 100
    });

    expect(result.current.getMoodScore('black')).toBe(100);
    expect(result.current.getMoodLevelForCat('black')).toBe('ecstatic');
  });

  it('localStorageに保存され、再読み込み時にも機嫌が維持されること', () => {
    const { result: firstRender } = renderHook(() =>
      useCatMood({ petIncrement: 30, enableDecay: false })
    );

    act(() => {
      firstRender.current.petCat('white'); // 白猫をなでる (20 + 30 = 50)
    });

    expect(firstRender.current.getMoodScore('white')).toBe(50);

    // 新たなレンダリング（ページ再読込相当）
    const { result: secondRender } = renderHook(() =>
      useCatMood({ enableDecay: false })
    );

    expect(secondRender.current.getMoodScore('white')).toBe(50);
    expect(secondRender.current.getMoodScore('black')).toBe(20);
  });

  it('resetMood で指定した猫の機嫌を初期状態に戻せること', () => {
    const { result } = renderHook(() =>
      useCatMood({ petIncrement: 40, enableDecay: false })
    );

    act(() => {
      result.current.petCat('black');
    });
    expect(result.current.getMoodScore('black')).toBe(60);

    act(() => {
      result.current.resetMood('black');
    });
    expect(result.current.getMoodScore('black')).toBe(20);
    expect(result.current.getMoodLevelForCat('black')).toBe('normal');
  });

  describe('時間経過によるリアルタイム機嫌減衰 (再読み込み不要)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('ページを再読み込みしなくても、時間の経過に伴いスコアと機嫌レベルが自動的に減衰・更新されること', () => {
      const { result } = renderHook(() =>
        useCatMood({
          petIncrement: 60, // 20 + 60 = 80 (ecstatic)
          decayCheckIntervalMs: 1000,
          decayPerMinute: 4, // 1分で4点減衰（15秒で1点）
        })
      );

      act(() => {
        result.current.petCat('black');
      });

      expect(result.current.getMoodScore('black')).toBe(80);
      expect(result.current.getMoodLevelForCat('black')).toBe('ecstatic');

      // 1分間放置（再読み込みなしでタイマーを進める）
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      // 80 - 4 = 76 (まだecstatic: >=75)
      expect(result.current.getMoodScore('black')).toBe(76);
      expect(result.current.getMoodLevelForCat('black')).toBe('ecstatic');

      // さらに30秒放置（合計90秒 -> 6点減衰 -> 74点となり happy に自動遷移）
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });

      expect(result.current.getMoodScore('black')).toBe(74);
      expect(result.current.getMoodLevelForCat('black')).toBe('happy');
      expect(result.current.getMoodInfoForCat('black').label).toBe('ごきげん♪');
    });

    it('猫ごとに異なるタイミングでなでられた場合、それぞれの経過時間に応じて独立して減衰すること', () => {
      const { result } = renderHook(() =>
        useCatMood({
          petIncrement: 40,
          decayCheckIntervalMs: 1000,
          decayPerMinute: 4,
        })
      );

      // t=0 で黒猫をなでる (20 + 40 = 60)
      act(() => {
        result.current.petCat('black');
      });

      // 30秒後 (黒猫は30秒経過 -> 2点減衰で58)
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });
      expect(result.current.getMoodScore('black')).toBe(58);

      // t=30秒 で白猫をなでる (20 + 40 = 60)
      act(() => {
        result.current.petCat('white');
      });
      expect(result.current.getMoodScore('white')).toBe(60);

      // さらに30秒後 (合計60秒: 黒猫は60秒経過で56点、白猫は30秒経過で58点)
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });
      expect(result.current.getMoodScore('black')).toBe(56);
      expect(result.current.getMoodScore('white')).toBe(58);
    });

    it('放置され続けてもベースライン（20）より下には減衰しないこと', () => {
      const { result } = renderHook(() =>
        useCatMood({
          petIncrement: 20, // 40 (happy)
          decayCheckIntervalMs: 1000,
          decayPerMinute: 4,
        })
      );

      act(() => {
        result.current.petCat('black');
      });
      expect(result.current.getMoodScore('black')).toBe(40);

      // 1時間放置
      act(() => {
        vi.advanceTimersByTime(60 * 60 * 1000);
      });

      expect(result.current.getMoodScore('black')).toBe(20);
      expect(result.current.getMoodLevelForCat('black')).toBe('normal');
    });

    it('アンマウント時にインターバルタイマーが破棄されること', () => {
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
      const { unmount } = renderHook(() => useCatMood({ decayCheckIntervalMs: 1000 }));

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
