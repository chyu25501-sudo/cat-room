/**
 * プライバシーポリシー同意フラグの localStorage キー
 */
export const PRIVACY_POLICY_ACCEPTED_STORAGE_KEY = 'nekoppoi_privacy_policy_accepted';

/**
 * ユーザーがプライバシーポリシーにすでに同意済みかどうかを判定する純粋関数
 * localStorage へのアクセスエラーや未対応環境でもクラッシュしないフォールバックを備えます
 */
export function hasAcceptedPrivacyPolicy(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const value = window.localStorage.getItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY);
    return value === 'true';
  } catch (e) {
    console.warn('Failed to read privacy policy accepted flag from localStorage:', e);
    return false;
  }
}

/**
 * プライバシーポリシーに同意済みとして localStorage に記録する関数
 */
export function markPrivacyPolicyAsAccepted(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY, 'true');
  } catch (e) {
    console.warn('Failed to save privacy policy accepted flag to localStorage:', e);
  }
}

/**
 * プライバシーポリシー同意フラグをリセットする関数（テスト・デバッグ用）
 */
export function resetPrivacyPolicyAccepted(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset privacy policy accepted flag in localStorage:', e);
  }
}
