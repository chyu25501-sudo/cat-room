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
    expect(blackState.requiredExp).toBe(120);

    // 白猫
    expect(result.current.getAffectionLevel('white')).toBe(1);
    expect(result.current.getAffectionProgress('white')).toBe(0);
  });

  it('gainAffection: Expを獲得するとゲージが溜まること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      // 30pt獲得（30 / 120 = 25%）
      const res = result.current.gainAffection('black', 30);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(1);
      expect(res.isLevelUp).toBe(false);
      expect(res.currentExp).toBe(30);
      expect(res.progressPercentage).toBe(25);
    });

    expect(result.current.getAffectionProgress('black')).toBe(25);
    // 白猫は影響を受けないこと（猫ごとの独立管理）
    expect(result.current.getAffectionProgress('white')).toBe(0);
  });

  it('ゲージが満タンになるとレベルが2に上昇し、ゲージがリセットされること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      // 120pt獲得してLv.1が満タンになる
      const res = result.current.gainAffection('black', 120);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(0);
      expect(res.requiredExp).toBe(180); // Lv.2の必要Expは180ptに増える
      expect(res.progressPercentage).toBe(0);
    });

    expect(result.current.getAffectionLevel('black')).toBe(2);
    expect(result.current.getAffectionProgress('black')).toBe(0);
  });

  it('余剰Expがある場合、レベルアップ後に余剰分が次のゲージに持ち越されること', () => {
    const { result } = renderHook(() => useCatAffection());

    act(() => {
      // 140pt獲得（必要120pt + 余剰20pt）
      const res = result.current.gainAffection('black', 140);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(20);
      expect(res.requiredExp).toBe(180);
      // 20 / 180 = 11%
      expect(res.progressPercentage).toBe(11);
    });

    expect(result.current.getAffectionLevel('black')).toBe(2);
    expect(result.current.getAffectionProgress('black')).toBe(11);
  });

  it('localStorageに保存され、再読み込み後もなつき度とゲージが維持されること', () => {
    const { result: firstRender, unmount } = renderHook(() => useCatAffection());

    act(() => {
      firstRender.current.gainAffection('black', 130); // Lv.2, 10pt (必要120pt+余剰10pt)
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

  it('なつき度最大（Lv.10）のときもゲージを溜められ、満タンでリセット＆演出トリガーが発生してループすること', () => {
    // 初期状態をLv.10, 0pt に設定
    const { result } = renderHook(() =>
      useCatAffection({ initialLevel: 10, initialExp: 0 })
    );

    expect(result.current.getAffectionLevel('calico')).toBe(10);
    expect(result.current.getAffectionProgress('calico')).toBe(0);

    // 100pt獲得（必要600pt中100pt = 17%）-> レベルは10のまま、演出はまだ出ない
    act(() => {
      const res = result.current.gainAffection('calico', 100);
      expect(res.nextLevel).toBe(10);
      expect(res.isLevelUp).toBe(false);
      expect(res.isMaxBonus).toBe(false);
      expect(res.currentExp).toBe(100);
      expect(res.progressPercentage).toBe(17);
    });

    expect(result.current.getAffectionProgress('calico')).toBe(17);

    // さらに530pt獲得（100 + 530 = 630pt >= 600pt）-> 満タン達成！
    // レベルは10のまま、演出トリガー (isLevelUp & isMaxBonus) が発火、余剰30ptでゲージが再スタート (30/600 = 5%)
    act(() => {
      const res = result.current.gainAffection('calico', 530);
      expect(res.nextLevel).toBe(10);
      expect(res.isLevelUp).toBe(true);
      expect(res.isMaxBonus).toBe(true);
      expect(res.currentExp).toBe(30);
      expect(res.progressPercentage).toBe(5);
    });

    expect(result.current.getAffectionLevel('calico')).toBe(10);
    expect(result.current.getAffectionProgress('calico')).toBe(5);
  });
});
