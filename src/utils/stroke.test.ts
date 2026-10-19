import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateStrokeDistance,
  isStrokeThresholdReached,
  calculateStrokeProgress,
  isCooldownElapsed,
  canTriggerPet,
  DEFAULT_STROKE_THRESHOLD,
  calculateRelativeCenterOffset,
  clampOffset,
} from './stroke.ts';

describe('stroke ユーティリティ (純粋関数テスト)', () => {
  it('calculateDistance: 2点間のユークリッド距離を正確に計算できること', () => {
    // 3:4:5 の直角三角形
    const d1 = calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(d1).toBe(5);

    // 水平移動
    const d2 = calculateDistance({ x: 10, y: 20 }, { x: 30, y: 20 });
    expect(d2).toBe(20);

    // 同一地点
    const d3 = calculateDistance({ x: 5, y: 5 }, { x: 5, y: 5 });
    expect(d3).toBe(0);
  });

  it('calculateStrokeDistance: 空または単一要素の場合は0を返すこと', () => {
    expect(calculateStrokeDistance([])).toBe(0);
    expect(calculateStrokeDistance([{ x: 10, y: 10 }])).toBe(0);
  });

  it('calculateStrokeDistance: 複数ポイントの累積移動距離を合算できること', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 30, y: 0 }, // +30
      { x: 30, y: 40 }, // +40
      { x: 0, y: 40 }, // +30
    ];
    expect(calculateStrokeDistance(points)).toBe(100);
  });

  it('isStrokeThresholdReached: しきい値到達判定が正しく動作すること', () => {
    expect(isStrokeThresholdReached(49, 50)).toBe(false);
    expect(isStrokeThresholdReached(50, 50)).toBe(true);
    expect(isStrokeThresholdReached(70, 50)).toBe(true);

    // デフォルトしきい値(50px)
    expect(isStrokeThresholdReached(DEFAULT_STROKE_THRESHOLD - 1)).toBe(false);
    expect(isStrokeThresholdReached(DEFAULT_STROKE_THRESHOLD)).toBe(true);
  });

  it('calculateStrokeProgress: 0から1の範囲で正規化された進行度を返すこと', () => {
    expect(calculateStrokeProgress(0, 100)).toBe(0);
    expect(calculateStrokeProgress(50, 100)).toBe(0.5);
    expect(calculateStrokeProgress(100, 100)).toBe(1.0);
    expect(calculateStrokeProgress(150, 100)).toBe(1.0); // 最大1.0
  });

  it('isCooldownElapsed: クールダウン時間の経過判定が正しく行われること', () => {
    // 1000msクールダウンの判定
    expect(isCooldownElapsed(1000, 1500, 1000)).toBe(false); // 500ms経過（未到達）
    expect(isCooldownElapsed(1000, 2000, 1000)).toBe(true); // 1000ms経過（到達）
    expect(isCooldownElapsed(1000, 2500, 1000)).toBe(true); // 1500ms経過（超過）

    // デフォルトクールダウン（1000ms）
    expect(isCooldownElapsed(0, 999)).toBe(false);
    expect(isCooldownElapsed(0, 1000)).toBe(true);
  });

  it('canTriggerPet: 距離しきい値とクールダウン双方が満たされたときのみtrueを返すこと', () => {
    const threshold = 50;
    const cooldownMs = 1000;
    const lastTrigger = 0;

    // 距離不足、クールダウン未経過
    expect(canTriggerPet(30, threshold, lastTrigger, 500, cooldownMs)).toBe(false);

    // 距離十分だが、クールダウン未経過（長いストロークの途中など）
    expect(canTriggerPet(100, threshold, lastTrigger, 500, cooldownMs)).toBe(false);

    // 距離不足だが、クールダウン経過済み
    expect(canTriggerPet(30, threshold, lastTrigger, 1500, cooldownMs)).toBe(false);

    // 距離十分かつクールダウン経過済み
    expect(canTriggerPet(50, threshold, lastTrigger, 1000, cooldownMs)).toBe(true);
    expect(canTriggerPet(80, threshold, lastTrigger, 1500, cooldownMs)).toBe(true);
  });

  it('calculateRelativeCenterOffset: 要素中心を基準とした相対オフセットを算出できること', () => {
    // 要素: left=100, top=100, width=200, height=300 -> 中心は(200, 250)
    const rect = { left: 100, top: 100, width: 200, height: 300 };

    // 中心と同一位置
    const offsetCenter = calculateRelativeCenterOffset({ x: 200, y: 250 }, rect);
    expect(offsetCenter).toEqual({ x: 0, y: 0 });

    // 中心より右上に位置 (x: 250, y: 150) -> x: +50, y: -100
    const offsetTopRight = calculateRelativeCenterOffset({ x: 250, y: 150 }, rect);
    expect(offsetTopRight).toEqual({ x: 50, y: -100 });

    // 中心より左下に位置 (x: 140, y: 320) -> x: -60, y: +70
    const offsetBottomLeft = calculateRelativeCenterOffset({ x: 140, y: 320 }, rect);
    expect(offsetBottomLeft).toEqual({ x: -60, y: 70 });

    // 境界外（要素の範囲外までドラッグした場合）は境界でクランプされること
    const offsetOver = calculateRelativeCenterOffset({ x: 500, y: 600 }, rect);
    expect(offsetOver).toEqual({ x: 100, y: 150 });
  });

  it('clampOffset: オフセットが最大許容範囲内に収まること', () => {
    expect(clampOffset({ x: 200, y: -300 }, 150, 160)).toEqual({ x: 150, y: -160 });
    expect(clampOffset({ x: -50, y: 80 }, 150, 160)).toEqual({ x: -50, y: 80 });
  });
});


