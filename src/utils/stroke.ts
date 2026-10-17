/**
 * 猫のなでる操作（ストローク距離・ドラッグ判定）に関する純粋な計算ロジック
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * 2点間のユークリッド距離を計算する純粋関数
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 一連の移動ポイント（軌跡）から累積ストローク距離を計算する純粋関数
 */
export function calculateStrokeDistance(points: readonly Point[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(points[i - 1], points[i]);
  }
  return total;
}

/**
 * なでたと認識するデフォルトのストローク距離しきい値（ピクセル）
 * 短すぎるクリック誤認識を防ぎつつ、快適になでられる距離
 */
export const DEFAULT_STROKE_THRESHOLD = 50;

/**
 * ストローク距離がしきい値に到達したかを判定する純粋関数
 */
export function isStrokeThresholdReached(
  distance: number,
  threshold: number = DEFAULT_STROKE_THRESHOLD
): boolean {
  return distance >= threshold;
}

/**
 * ストローク進行度（0.0 〜 1.0）を計算する純粋関数
 */
export function calculateStrokeProgress(
  distance: number,
  threshold: number = DEFAULT_STROKE_THRESHOLD
): number {
  if (threshold <= 0) return 1.0;
  return Math.min(1.0, Math.max(0.0, distance / threshold));
}

