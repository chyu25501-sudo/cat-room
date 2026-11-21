import { useState, useCallback } from 'react';
import { hasAcceptedPrivacyPolicy, markPrivacyPolicyAsAccepted } from '../utils/privacyPolicy.ts';

export interface UsePrivacyConsentReturn {
  /** プライバシーポリシー同意済みかどうか */
  hasAccepted: boolean;
  /** 同意を求めるモーダルが開いているかどうか（未同意の場合は初回起動時に自動でtrue） */
  isConsentModalOpen: boolean;
  /** プライバシーポリシーに同意してモーダルを閉じる関数 */
  acceptConsent: () => void;
  /** 同意モーダルを強制的に開く関数（再確認用など） */
  openConsentModal: () => void;
  /** 同意モーダルを閉じる関数 */
  closeConsentModal: () => void;
}

/**
 * プライバシーポリシーの初回同意および表示管理を行うカスタムフック
 * - 初回訪問者、旧メール方式からの移行者、既存ローカルユーザーの初回起動時に1度だけ同意ウィンドウを表示
 * - 一度同意すると localStorage に記録され、以降は自動表示されません
 */
export function usePrivacyConsent(): UsePrivacyConsentReturn {
  const [hasAccepted, setHasAccepted] = useState<boolean>(() => {
    return hasAcceptedPrivacyPolicy();
  });

  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(() => {
    return !hasAcceptedPrivacyPolicy();
  });

  const acceptConsent = useCallback(() => {
    markPrivacyPolicyAsAccepted();
    setHasAccepted(true);
    setIsConsentModalOpen(false);
  }, []);

  const openConsentModal = useCallback(() => {
    setIsConsentModalOpen(true);
  }, []);

  const closeConsentModal = useCallback(() => {
    setIsConsentModalOpen(false);
  }, []);

  return {
    hasAccepted,
    isConsentModalOpen,
    acceptConsent,
    openConsentModal,
    closeConsentModal,
  };
}
