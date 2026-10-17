import { useState, useRef, useCallback } from 'react';
import {
  Point,
  calculateDistance,
  DEFAULT_STROKE_THRESHOLD,
  DEFAULT_PET_COOLDOWN_MS,
  isStrokeThresholdReached,
  calculateStrokeProgress,
  isCooldownElapsed,
} from '../utils/stroke.ts';

export interface UseCatPettingOptions {
  /** なでた（ストローク成立）時に発火するコールバック */
  onPet: () => void;
  /** なでたと判定する移動距離のしきい値（ピクセル） */
  threshold?: number;
  /** なでた後のクールダウン時間（ミリ秒、長大なストロークや高速ドラッグ時の過剰な連続反応を防止） */
  cooldownMs?: number;
  /** 操作が無効化されているかどうか */
  disabled?: boolean;
}

export interface UseCatPettingResult {
  /** 現在ドラッグ操作中（ポインター押下中）かどうか */
  isDragging: boolean;
  /** なでるストロークの進行度（0.0 〜 1.0） */
  strokeProgress: number;
  /** 対象要素に付与するイベントハンドラー群 */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
}

/**
 * 猫をドラッグ動作で撫でるインタラクションを管理するカスタムフック
 * PointerEvent関連のAPI処理をコンポーネントから隔離します
 */
export function useCatPetting({
  onPet,
  threshold = DEFAULT_STROKE_THRESHOLD,
  cooldownMs = DEFAULT_PET_COOLDOWN_MS,
  disabled = false,
}: UseCatPettingOptions): UseCatPettingResult {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [strokeProgress, setStrokeProgress] = useState<number>(0);

  const lastPointRef = useRef<Point | null>(null);
  const accumulatedDistanceRef = useRef<number>(0);
  const lastTriggerTimeRef = useRef<number>(0);

  const extractPoint = (e: React.PointerEvent): Point => {
    const x = e.clientX ?? (e.nativeEvent as MouseEvent)?.clientX ?? 0;
    const y = e.clientY ?? (e.nativeEvent as MouseEvent)?.clientY ?? 0;
    return { x, y };
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      try {
        if (e.button !== undefined && e.button > 0) return;

        setIsDragging(true);
        accumulatedDistanceRef.current = 0;
        setStrokeProgress(0);
        lastPointRef.current = extractPoint(e);

        if (typeof e.currentTarget?.setPointerCapture === 'function') {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
        }
      } catch {
        // フォールバック
      }
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !lastPointRef.current) return;

      try {
        const currentPoint = extractPoint(e);
        const delta = calculateDistance(lastPointRef.current, currentPoint);
        lastPointRef.current = currentPoint;

        const now = Date.now();
        // クールダウン中は距離蓄積を行わず早期リターン（長大な単一ストロークでの連続過剰発火を抑制）
        if (!isCooldownElapsed(lastTriggerTimeRef.current, now, cooldownMs)) {
          return;
        }

        accumulatedDistanceRef.current += delta;
        const currentDistance = accumulatedDistanceRef.current;
        setStrokeProgress(calculateStrokeProgress(currentDistance, threshold));

        // しきい値到達で「なでた」と判定
        if (isStrokeThresholdReached(currentDistance, threshold)) {
          onPet();
          lastTriggerTimeRef.current = now;
          // 継続してなでられるよう、しきい値分を消費してリセット
          accumulatedDistanceRef.current = 0;
          setStrokeProgress(0);
        }
      } catch {
        // フォールバック
      }
    },
    [disabled, onPet, threshold, cooldownMs]
  );

  const handlePointerEnd = useCallback((e: React.PointerEvent) => {
    try {
      if (typeof e.currentTarget?.releasePointerCapture === 'function') {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // フォールバック
    }
    setIsDragging(false);
    setStrokeProgress(0);
    lastPointRef.current = null;
    accumulatedDistanceRef.current = 0;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      // キーボード操作（Space または Enter）でのアクセシビリティ対応
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const now = Date.now();
        if (isCooldownElapsed(lastTriggerTimeRef.current, now, cooldownMs)) {
          onPet();
          lastTriggerTimeRef.current = now;
        }
      }
    },
    [disabled, onPet, cooldownMs]
  );

  return {
    isDragging,
    strokeProgress,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
      onKeyDown: handleKeyDown,
    },
  };
}

