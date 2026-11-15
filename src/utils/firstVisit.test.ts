import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  hasSeenGuide,
  markGuideAsSeen,
  resetGuideSeen,
  GUIDE_SEEN_STORAGE_KEY,
} from './firstVisit.ts';

describe('firstVisit ユーティリティ', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('初期状態（未訪問・未閲覧）では hasSeenGuide() が false を返すこと', () => {
    expect(hasSeenGuide()).toBe(false);
  });

  it('markGuideAsSeen() を呼ぶと localStorage に記録され、hasSeenGuide() が true を返すこと', () => {
    markGuideAsSeen();
    expect(localStorage.getItem(GUIDE_SEEN_STORAGE_KEY)).toBe('true');
    expect(hasSeenGuide()).toBe(true);
  });

  it('resetGuideSeen() を呼ぶとフラグが削除され、再び hasSeenGuide() が false を返すこと', () => {
    markGuideAsSeen();
    expect(hasSeenGuide()).toBe(true);

    resetGuideSeen();
    expect(localStorage.getItem(GUIDE_SEEN_STORAGE_KEY)).toBeNull();
    expect(hasSeenGuide()).toBe(false);
  });

  it('localStorage 読み込み時に例外が発生してもクラッシュせず false を返すこと（エラー耐性）', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('Access denied');
    });

    expect(hasSeenGuide()).toBe(false);
  });

  it('localStorage 書き込み時に例外が発生してもクラッシュしないこと（エラー耐性）', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('Quota exceeded');
    });

    expect(() => markGuideAsSeen()).not.toThrow();
  });
});
