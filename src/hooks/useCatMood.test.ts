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

  describe('愛撫誘発性攻撃行動 (第5週: 短時間の撫ですぎによる不機嫌化とツンデレ回復)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('短時間に連続して過剰に撫ですぎると愛撫誘発性攻撃行動が発生し、猫が不機嫌（annoyed）になること', () => {
      const { result } = renderHook(() =>
        useCatMood({
          petIncrement: 10,
          overstimulationWindowMs: 7000,
          overstimulationThresholdCount: 6,
          annoyedDurationMs: 5000,
        })
      );

      // 5回撫でる（まだ過剰刺激しきい値未満）
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.petCat('black');
          vi.advanceTimersByTime(500); // 0.5秒おき
        });
      }

      // 5回撫でた時点では機嫌が良い (20 + 50 = 70: happy)
      expect(result.current.getMoodLevelForCat('black')).toBe('happy');
      expect(result.current.getMoodScore('black')).toBe(70);

      // 6回目のなでなで（7秒間に6回目のストローク -> 過剰刺激発生！）
      act(() => {
        result.current.petCat('black');
      });

      // 愛撫誘発性攻撃行動が発動して不機嫌（annoyed）になる
      expect(result.current.getMoodLevelForCat('black')).toBe('annoyed');
      expect(result.current.getMoodScore('black')).toBe(5);
      expect(result.current.getMoodInfoForCat('black').label).toBe('ごきげんななめ');
    });

    it('不機嫌（annoyed）状態中にさらに撫でても機嫌は上がらず不機嫌が継続すること（ツン状態）', () => {
      const { result } = renderHook(() =>
        useCatMood({
          overstimulationThresholdCount: 3,
          overstimulationWindowMs: 5000,
          annoyedDurationMs: 4000,
        })
      );

      // 3回連続撫でで不機嫌にする
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.petCat('black');
          vi.advanceTimersByTime(200);
        });
      }
      expect(result.current.getMoodLevelForCat('black')).toBe('annoyed');

      // 不機嫌中に追加で撫でる
      act(() => {
        const petRes = result.current.petCat('black');
        expect(petRes.nextLevel).toBe('annoyed');
        expect(petRes.nextScore).toBe(5);
      });

      expect(result.current.getMoodLevelForCat('black')).toBe('annoyed');
      expect(result.current.getMoodScore('black')).toBe(5);
    });

    it('不機嫌になった後、撫でずにそっとしておくと自動的に不機嫌が解けて平常状態（おだやか）に戻ること', () => {
      const { result } = renderHook(() =>
        useCatMood({
          overstimulationThresholdCount: 3,
          overstimulationWindowMs: 5000,
          annoyedDurationMs: 4000,
          decayCheckIntervalMs: 1000,
        })
      );

      // 3回連続撫でで不機嫌にする
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.petCat('black');
          vi.advanceTimersByTime(100);
        });
      }
      expect(result.current.getMoodLevelForCat('black')).toBe('annoyed');

      // 3秒経過時点（まだ継続時間4秒以内）
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(result.current.getMoodLevelForCat('black')).toBe('annoyed');

      // さらに2秒経過（合計5秒経過 -> 4秒の期限を過ぎてインターバルが検知）
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // 不機嫌が解けて平常（20点・おだやか）に自動回復
      expect(result.current.getMoodLevelForCat('black')).toBe('normal');
      expect(result.current.getMoodScore('black')).toBe(20);
      expect(result.current.getMoodInfoForCat('black').label).toBe('おだやか');
    });

    it('ゆったりと間隔を空けて撫でた場合は過剰刺激にならず、機嫌がMAXまで上昇すること', () => {
      const { result } = renderHook(() =>
        useCatMood({
          petIncrement: 20,
          overstimulationThresholdCount: 4,
          overstimulationWindowMs: 4000, // 4秒ウィンドウ
          enableDecay: false,
        })
      );

      // 3秒以上の十分な間隔を空けて撫でる
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.petCat('black');
          vi.advanceTimersByTime(3500); // 3.5秒間隔
        });
      }

      // ウィンドウ内に溜まらないため不機嫌にならず、ecstatic（100%）に達する
      expect(result.current.getMoodLevelForCat('black')).toBe('ecstatic');
      expect(result.current.getMoodScore('black')).toBe(100);
    });

    it('デフォルト設定では1回の撫でによる機嫌上昇量が基準値15から±1〜5%ランダムに変動すること', () => {
      const { result } = renderHook(() => useCatMood({ enableDecay: false }));

      let petRes: { nextScore: number; nextLevel: string; increment: number };
      act(() => {
        petRes = result.current.petCat('black');
      });

      // increment は 10 〜 20 の間
      expect(petRes!.increment).toBeGreaterThanOrEqual(10);
      expect(petRes!.increment).toBeLessThanOrEqual(20);
      // スコアは初期20 + increment (30 〜 40)
      expect(petRes!.nextScore).toBe(20 + petRes!.increment);
      expect(result.current.getMoodScore('black')).toBe(petRes!.nextScore);
    });
  });
});
