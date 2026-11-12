import { useState, useRef, useEffect, useCallback } from 'react';
import { AffectionLevelUpTriggerPayload, AffectionLevelUpState } from '../types/affection.ts';

export interface UseAffectionLevelUpOptions {
  /** フェードアウト開始までの表示ミリ秒（デフォルト: 2400ms） */
  displayDurationMs?: number;
  /** フェードアウトにかけるアニメーションミリ秒（デフォルト: 600ms） */
  fadeDurationMs?: number;
}

/**
 * なつき度レベルアップ演出の表示・フェードアウト状態を管理するカスタムフック
 */
export function useAffectionLevelUp(options: UseAffectionLevelUpOptions = {}) {
  const { displayDurationMs = 2400, fadeDurationMs = 600 } = options;

  const [levelUpState, setLevelUpState] = useState<AffectionLevelUpState | null>(null);

  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (displayTimerRef.current !== null) {
      clearTimeout(displayTimerRef.current);
      displayTimerRef.current = null;
    }
    if (fadeTimerRef.current !== null) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const dismissLevelUp = useCallback(() => {
    clearTimers();
    setLevelUpState(null);
  }, [clearTimers]);

  const triggerLevelUp = useCallback(
    (payload: AffectionLevelUpTriggerPayload) => {
      clearTimers();

      // 表示開始（フェード中フラグ: false）
      setLevelUpState({
        ...payload,
        isFading: false,
      });

      // 一定時間後にフェードアウト開始
      displayTimerRef.current = setTimeout(() => {
        setLevelUpState((prev) => (prev ? { ...prev, isFading: true } : null));

        // フェードアウト完了後にステートをクリア
        fadeTimerRef.current = setTimeout(() => {
          setLevelUpState(null);
          fadeTimerRef.current = null;
        }, fadeDurationMs);
      }, displayDurationMs);
    },
    [clearTimers, displayDurationMs, fadeDurationMs]
  );

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    levelUpState,
    triggerLevelUp,
    dismissLevelUp,
  };
}
