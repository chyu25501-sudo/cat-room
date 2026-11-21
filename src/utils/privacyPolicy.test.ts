import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PRIVACY_POLICY_ACCEPTED_STORAGE_KEY,
  hasAcceptedPrivacyPolicy,
  markPrivacyPolicyAsAccepted,
  resetPrivacyPolicyAccepted,
} from './privacyPolicy.ts';

describe('privacyPolicy ユーティリティ', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('初期状態（未同意）では false を返すこと', () => {
    expect(hasAcceptedPrivacyPolicy()).toBe(false);
  });

  it('markPrivacyPolicyAsAccepted を呼ぶと localStorage に true が保存され hasAcceptedPrivacyPolicy が true を返すこと', () => {
    markPrivacyPolicyAsAccepted();
    expect(localStorage.getItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY)).toBe('true');
    expect(hasAcceptedPrivacyPolicy()).toBe(true);
  });

  it('resetPrivacyPolicyAccepted でキーが削除され false に戻ること', () => {
    markPrivacyPolicyAsAccepted();
    expect(hasAcceptedPrivacyPolicy()).toBe(true);

    resetPrivacyPolicyAccepted();
    expect(localStorage.getItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY)).toBeNull();
    expect(hasAcceptedPrivacyPolicy()).toBe(false);
  });

  it('localStorage 読み込み時に例外が発生してもクラッシュせず false を返すこと（エラー耐性）', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    expect(hasAcceptedPrivacyPolicy()).toBe(false);
  });

  it('localStorage 書き込み時に例外が発生してもクラッシュしないこと（エラー耐性）', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    expect(() => markPrivacyPolicyAsAccepted()).not.toThrow();
  });
});
