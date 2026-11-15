import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useFirstVisitGuide } from './useFirstVisitGuide.ts';
import { GUIDE_SEEN_STORAGE_KEY } from '../utils/firstVisit.ts';

describe('useFirstVisitGuide カスタムフック', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初回訪問時（フラグなし）は自動的にモーダルが開き、localStorage にフラグが記録されること', () => {
    const { result } = renderHook(() => useFirstVisitGuide());

    expect(result.current.isHowToPlayModalOpen).toBe(true);
    expect(localStorage.getItem(GUIDE_SEEN_STORAGE_KEY)).toBe('true');

    // 閉じる操作
    act(() => {
      result.current.closeHowToPlayModal();
    });
    expect(result.current.isHowToPlayModalOpen).toBe(false);

    // 再度開く操作
    act(() => {
      result.current.openHowToPlayModal();
    });
    expect(result.current.isHowToPlayModalOpen).toBe(true);
  });

  it('2回目以降の訪問時（すでにフラグが存在）はモーダルが閉じた状態で開始されること', () => {
    localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');

    const { result } = renderHook(() => useFirstVisitGuide());

    expect(result.current.isHowToPlayModalOpen).toBe(false);

    // 手動で開く
    act(() => {
      result.current.openHowToPlayModal();
    });
    expect(result.current.isHowToPlayModalOpen).toBe(true);
  });
});
