import { useState, useEffect, useRef } from 'react';

export interface UsePageVisibilityOptions {
  /** タブが再度表示状態（visible）になったときに呼ばれるコールバック（引数は非表示だった時間ミリ秒） */
  onVisible?: (hiddenDurationMs: number) => void;
  /** 時刻取得関数（テスト容易性のための注入可能オプション、デフォルト: Date.now） */
  nowFn?: () => number;
}

export interface UsePageVisibilityResult {
  /** 現在タブが表示状態（visible）かどうか */
  isVisible: boolean;
}

/**
 * Page Visibility API（document.visibilityState）を監視し、
 * タブのアクティブ状態およびタブ復帰時の非表示期間を検知するカスタムフック
 *
 * - タブが非表示（別タブ・最小化等）になった時刻を記録
 * - タブが復帰（visible）した際に、非表示だった期間（ミリ秒）を計算して onVisible を呼び出す
 */
export function usePageVisibility(
  options: UsePageVisibilityOptions = {}
): UsePageVisibilityResult {
  const { onVisible, nowFn = Date.now } = options;
  const onVisibleRef = useRef(onVisible);
  const nowFnRef = useRef(nowFn);

  useEffect(() => {
    onVisibleRef.current = onVisible;
    nowFnRef.current = nowFn;
  }, [onVisible, nowFn]);

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'visible';
    }
    return true;
  });

  const hiddenStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);

      if (!visible) {
        // 非表示になった時刻を記録（連続でhiddenが発火しても最初の非表示開始時刻を保持）
        if (hiddenStartTimeRef.current === null) {
          hiddenStartTimeRef.current = nowFnRef.current();
        }
      } else {
        // 表示（visible）に戻った
        if (hiddenStartTimeRef.current !== null) {
          const duration = Math.max(0, nowFnRef.current() - hiddenStartTimeRef.current);
          hiddenStartTimeRef.current = null;
          onVisibleRef.current?.(duration);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isVisible };
}
