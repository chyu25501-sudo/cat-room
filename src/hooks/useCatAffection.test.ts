import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCatAffection } from './useCatAffection.ts';

describe('useCatAffection フック (第7週: なつき度機能テスト)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態では全猫のなつき度レベルが1、ゲージが0pt（0%）であること', () => {
    const { result } = renderHook(() => useCatAffection());

    // 黒猫
    expect(result.current.getAffectionLevel('black')).toBe(1);
    expect(result.current.getAffectionProgress('black')).toBe(0);
    const blackState = result.current.getAffectionState('black');
    expect(blackState.level).toBe(1);
    expect(blackState.currentExp).toBe(0);
    expect(blackState.requiredExp).toBe(100);

    // 白猫
    expect(result.current.getAffectionLevel('white')).toBe(1);
    expect(result.current.getAffectionProgress('white')).toBe(0);
  });

  it('gainAffection: Expを獲得するとゲージが溜まること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      // 30pt獲得
      const res = result.current.gainAffection('black', 30);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(1);
      expect(res.isLevelUp).toBe(false);
      expect(res.currentExp).toBe(30);
      expect(res.progressPercentage).toBe(30);
    });

    expect(result.current.getAffectionProgress('black')).toBe(30);
    // 白猫は影響を受けないこと（猫ごとの独立管理）
    expect(result.current.getAffectionProgress('white')).toBe(0);
  });

  it('ゲージが満タンになるとレベルが2に上昇し、ゲージがリセットされること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      // 100pt獲得してLv.1が満タンになる
      const res = result.current.gainAffection('black', 100);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(0);
      expect(res.requiredExp).toBe(125); // Lv.2の必要Expは125ptに増える
      expect(res.progressPercentage).toBe(0);
    });

    expect(result.current.getAffectionLevel('black')).toBe(2);
    expect(result.current.getAffectionProgress('black')).toBe(0);
  });

  it('余剰Expがある場合、レベルアップ後に余剰分が次のゲージに持ち越されること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      // 120pt獲得（必要100pt + 余剰20pt）
      const res = result.current.gainAffection('black', 120);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(20);
      expect(res.requiredExp).toBe(125);
      // 20 / 125 = 16%
      expect(res.progressPercentage).toBe(16);
    });

    expect(result.current.getAffectionLevel('black')).toBe(2);
    expect(result.current.getAffectionProgress('black')).toBe(16);
  });

  it('localStorageに保存され、再読み込み後もなつき度とゲージが維持されること', () => {
    const { result: firstRender, unmount } = renderHook(() => useCatAffection());

    act(() => {
      firstRender.current.gainAffection('black', 110); // Lv.2, 10pt
      firstRender.current.gainAffection('white', 50);  // Lv.1, 50pt
    });

    expect(firstRender.current.getAffectionLevel('black')).toBe(2);
    expect(firstRender.current.getAffectionLevel('white')).toBe(1);
    unmount();

    // 再マウント
    const { result: secondRender } = renderHook(() => useCatAffection());
    expect(secondRender.current.getAffectionLevel('black')).toBe(2);
    expect(secondRender.current.getAffectionState('black').currentExp).toBe(10);
    expect(secondRender.current.getAffectionLevel('white')).toBe(1);
    expect(secondRender.current.getAffectionState('white').currentExp).toBe(50);
  });

  it('resetAffection: 指定した猫のなつき度を初期状態（Lv.1, 0pt）に戻せること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      result.current.gainAffection('black', 150);
    });
    expect(result.current.getAffectionLevel('black')).toBe(2);

    act(() => {
      result.current.resetAffection('black');
    });

    expect(result.current.getAffectionLevel('black')).toBe(1);
    expect(result.current.getAffectionProgress('black')).toBe(0);
    expect(result.current.getAffectionState('black').currentExp).toBe(0);
  });
});
