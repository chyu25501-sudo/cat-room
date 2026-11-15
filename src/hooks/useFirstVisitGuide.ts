import { useState, useEffect, useCallback } from 'react';
import { hasSeenGuide, markGuideAsSeen } from '../utils/firstVisit.ts';

export interface UseFirstVisitGuideReturn {
  /** あそびかたモーダルが開いているかどうか */
  isHowToPlayModalOpen: boolean;
  /** あそびかたモーダルを開く関数（ユーザー手動操作時など） */
  openHowToPlayModal: () => void;
  /** あそびかたモーダルを閉じる関数 */
  closeHowToPlayModal: () => void;
}

/**
 * 初回訪問時の「あそびかた」ウィンドウ自動表示と開閉状態を管理するカスタムフック
 * - 初回訪問時（ガイド未閲覧）: 初期状態で自動的にモーダルを開き、閲覧済みフラグを記録
 * - 2回目以降の訪問: 通常通り閉じた状態で開始
 */
export function useFirstVisitGuide(): UseFirstVisitGuideReturn {
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState<boolean>(() => {
    // ガイドをまだ閲覧していない（初回訪問）場合は自動で開く
    return !hasSeenGuide();
  });

  // 初回マウント時に自動表示された場合、閲覧済みフラグを localStorage に記録
  useEffect(() => {
    if (isHowToPlayModalOpen) {
      markGuideAsSeen();
    }
  }, [isHowToPlayModalOpen]);

  const openHowToPlayModal = useCallback(() => {
    setIsHowToPlayModalOpen(true);
  }, []);

  const closeHowToPlayModal = useCallback(() => {
    markGuideAsSeen();
    setIsHowToPlayModalOpen(false);
  }, []);

  return {
    isHowToPlayModalOpen,
    openHowToPlayModal,
    closeHowToPlayModal,
  };
}
