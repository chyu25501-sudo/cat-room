import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCatMood } from './useCatMood.ts';

describe('useCatMood フック (第4週: 猫ごとの機嫌管理)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態では全猫プリセットがベースラインスコア（20・おだやか）であること', () => {
    const { result } = renderHook(() => useCatMood());

    expect(result.current.getMoodScore('black')).toBe(20);
    expect(result.current.getMoodLevelForCat('black')).toBe('normal');

    expect(result.current.getMoodScore('white')).toBe(20);
    expect(result.current.getMoodLevelForCat('white')).toBe('normal');
  });

  it('黒猫をなでると黒猫の機嫌のみが上昇し、白猫の機嫌には影響しないこと（猫ごとの独立管理）', () => {
    const { result } = renderHook(() => useCatMood({ petIncrement: 15 }));

    act(() => {
      result.current.petCat('black');
    });

    // 黒猫: 20 + 15 = 35
    expect(result.current.getMoodScore('black')).toBe(35);

    // 白猫: 依然として20のまま
    expect(result.current.getMoodScore('white')).toBe(20);
  });

  it('何度もなでることで機嫌レベルが段階的（normal -> happy -> ecstatic）に上昇すること', () => {
    const { result } = renderHook(() => useCatMood({ petIncrement: 20 }));

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
    const { result } = renderHook(() => useCatMood({ petIncrement: 50 }));

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
    const { result } = renderHook(() => useCatMood({ petIncrement: 40 }));

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
});

