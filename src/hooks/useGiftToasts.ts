import { useState, useCallback, useEffect } from 'react';
import { GiftToastItem } from '../components/gifts/GiftToastOverlay.tsx';

export interface UseGiftToastsOptions {
  /** トーストが自動で消去されるまでの時間（ミリ秒、デフォルト: 4000ms） */
  durationMs?: number;
}

export interface UseGiftToastsReturn {
  toasts: GiftToastItem[];
  addGiftToast: (toast: Omit<GiftToastItem, 'id'>) => void;
  dismissGiftToast: (id: string) => void;
  clearAllToasts: () => void;
}

/**
 * おくりもの獲得時のミニトースト通知を管理するカスタムフック
 * 自動ごはんなどで受け取ったおくりものを一定時間画面上部に表示し、自動消去します
 */
export function useGiftToasts(
  options: UseGiftToastsOptions = {}
): UseGiftToastsReturn {
  const { durationMs = 4000 } = options;
  const [toasts, setToasts] = useState<GiftToastItem[]>([]);

  const dismissGiftToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addGiftToast = useCallback(
    (item: Omit<GiftToastItem, 'id'>) => {
      const id = `gift-toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: GiftToastItem = {
        ...item,
        id,
      };

      setToasts((prev) => [...prev, newToast]);

      // 一定時間後に自動消去
      if (durationMs > 0) {
        setTimeout(() => {
          dismissGiftToast(id);
        }, durationMs);
      }
    },
    [durationMs, dismissGiftToast]
  );

  return {
    toasts,
    addGiftToast,
    dismissGiftToast,
    clearAllToasts,
  };
}
