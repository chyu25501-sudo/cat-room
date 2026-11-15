/**
 * あそびかた初回ガイド閲覧フラグの localStorage キー
 */
export const GUIDE_SEEN_STORAGE_KEY = 'nekoppoi_has_seen_guide';

/**
 * ユーザーがあそびかたガイドをすでに閲覧済み（2回目以降の訪問）かどうかを判定する純粋関数
 * localStorage へのアクセスエラーや未対応環境でもクラッシュしないフォールバックを備えます
 */
export function hasSeenGuide(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const value = window.localStorage.getItem(GUIDE_SEEN_STORAGE_KEY);
    return value === 'true';
  } catch (e) {
    console.warn('Failed to read guide seen flag from localStorage:', e);
    return false;
  }
}

/**
 * あそびかたガイドを閲覧済みとして localStorage に記録する関数
 */
export function markGuideAsSeen(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
  } catch (e) {
    console.warn('Failed to save guide seen flag to localStorage:', e);
  }
}

/**
 * あそびかたガイド閲覧フラグをリセットする関数（テスト・デバッグ用）
 */
export function resetGuideSeen(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(GUIDE_SEEN_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset guide seen flag in localStorage:', e);
  }
}
