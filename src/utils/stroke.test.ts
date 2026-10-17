import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateStrokeDistance,
  isStrokeThresholdReached,
  calculateStrokeProgress,
  DEFAULT_STROKE_THRESHOLD,
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
});

