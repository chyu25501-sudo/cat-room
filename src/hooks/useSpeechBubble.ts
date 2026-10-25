import { useState, useRef, useCallback, useEffect } from 'react';

/** 吹き出しの標準表示時間（ミリ秒）: 2.2秒 */
export const DEFAULT_BUBBLE_DURATION_MS = 2200;

/** 同じ吹き出しメッセージを最低限維持する時間（ミリ秒）: 1.5秒 */
export const DEFAULT_BUBBLE_MIN_HOLD_MS = 1500;

export interface UseSpeechBubbleOptions {
  /** 吹き出しの標準表示時間（ミリ秒、デフォルト: 2200ms） */
  durationMs?: number;
  /** 同じ吹き出しを最低限維持する時間（ミリ秒、デフォルト: 1500ms） */
  minHoldMs?: number;
}

export interface ShowBubbleOptions {
  /** このメッセージの表示時間（ミリ秒） */
  durationMs?: number;
  /** 強制的にメッセージを切り替えるか（デフォルト: false） */
  force?: boolean;
}

export interface UseSpeechBubbleResult {
  /** 現在表示中の吹き出しテキスト（非表示時はnull） */
  bubbleText: string | null;
  /** 吹き出しを表示・更新する関数 */
  showBubble: (text: string, options?: ShowBubbleOptions) => void;
  /** 吹き出しを即座に非表示にする関数 */
  clearBubble: () => void;
}

/**
 * なでなでや猫切り替え時に表示される吹き出しメッセージを管理するカスタムフック
 * 連続でなでられた際のタイマー競合（一瞬で消える現象）を防ぎ、一定時間の安定した表示を提供します
 */
export function useSpeechBubble(
  options: UseSpeechBubbleOptions = {}
): UseSpeechBubbleResult {
  const {
    durationMs: defaultDuration = DEFAULT_BUBBLE_DURATION_MS,
    minHoldMs: defaultMinHold = DEFAULT_BUBBLE_MIN_HOLD_MS,
  } = options;

  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const shownAtRef = useRef<number>(0);
  const currentTextRef = useRef<string | null>(null);

  const clearBubble = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    currentTextRef.current = null;
    setBubbleText(null);
  }, []);

  const showBubble = useCallback(
    (text: string, showOptions: ShowBubbleOptions = {}) => {
      const { durationMs = defaultDuration, force = false } = showOptions;
      const now = Date.now();
      const elapsedSinceShown = now - shownAtRef.current;

      // 既存のタイマーを必ず破棄してタイマー競合による瞬時消失を防止
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // 未表示、強制切替、または最低維持時間を経過している場合にテキストを更新
      if (
        currentTextRef.current === null ||
        force ||
        elapsedSinceShown >= defaultMinHold
      ) {
        currentTextRef.current = text;
        shownAtRef.current = now;
        setBubbleText(text);
      }
      // 最低維持時間内の場合は現在のテキストを維持したままタイマーのみを延長

      // 最新のアクションから durationMs 後に吹き出しをフェードアウト
      timerRef.current = window.setTimeout(() => {
        currentTextRef.current = null;
        setBubbleText(null);
        timerRef.current = null;
      }, durationMs);
    },
    [defaultDuration, defaultMinHold]
  );

  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    bubbleText,
    showBubble,
    clearBubble,
  };
}

