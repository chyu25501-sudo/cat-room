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
 * なでた反応（鳴き声など）の連続発火を防ぐデフォルトのクールダウン時間（ミリ秒）
 * 長いストローク時や高速ドラッグ時でもうるさくならない落ち着いた頻度に制御
 */
export const DEFAULT_PET_COOLDOWN_MS = 1000;

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
 * 前回の発火からクールダウン時間が経過しているかを判定する純粋関数
 */
export function isCooldownElapsed(
  lastTriggerTime: number,
  now: number,
  cooldownMs: number = DEFAULT_PET_COOLDOWN_MS
): boolean {
  return now - lastTriggerTime >= cooldownMs;
}

/**
 * なでる判定が成立するかどうか（移動距離がしきい値以上、かつクールダウン経過済み）を判定する純粋関数
 */
export function canTriggerPet(
  distance: number,
  threshold: number,
  lastTriggerTime: number,
  now: number,
  cooldownMs: number = DEFAULT_PET_COOLDOWN_MS
): boolean {
  return (
    isStrokeThresholdReached(distance, threshold) &&
    isCooldownElapsed(lastTriggerTime, now, cooldownMs)
  );
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

export interface ElementRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * オフセット座標を指定の境界範囲内に収める（クランプする）純粋関数
 */
export function clampOffset(
  offset: Point,
  maxAbsX: number = 150,
  maxAbsY: number = 160
): Point {
  return {
    x: Math.max(-maxAbsX, Math.min(maxAbsX, offset.x)),
    y: Math.max(-maxAbsY, Math.min(maxAbsY, offset.y)),
  };
}

/**
 * マウスカーソル等の絶対座標から要素中心を原点(0, 0)とする相対オフセット座標を計算する純粋関数
 */
export function calculateRelativeCenterOffset(
  point: Point,
  rect: ElementRect,
  clamp: boolean = true
): Point {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rawOffset = {
    x: Math.round(point.x - centerX),
    y: Math.round(point.y - centerY),
  };
  if (!clamp || rect.width <= 0 || rect.height <= 0) {
    return rawOffset;
  }
  const maxAbsX = Math.round(rect.width / 2);
  const maxAbsY = Math.round(rect.height / 2);
  return clampOffset(rawOffset, maxAbsX, maxAbsY);
}


