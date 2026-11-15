import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCareJournal } from './useCareJournal.ts';
import { CARE_JOURNAL_STORAGE_KEY } from '../utils/careJournal.ts';

describe('useCareJournal hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態ではデフォルトの統計情報が返されること', () => {
    const { result } = renderHook(() => useCareJournal());

    expect(result.current.stats.firstInteractionAt).toBeNull();
    expect(result.current.stats.totalPetCount).toBe(0);
    expect(result.current.stats.totalFeedCount).toBe(0);
    expect(result.current.stats.totalPlayCount).toBe(0);
    expect(result.current.stats.currentStreakDays).toBe(0);
  });

  it('recordCareAction を呼ぶと統計が加算され localStorage に保存されること', () => {
    const { result } = renderHook(() => useCareJournal());

    act(() => {
      result.current.recordCareAction('pet', 'black');
    });

    expect(result.current.stats.totalPetCount).toBe(1);
    expect(result.current.stats.firstInteractionAt).not.toBeNull();
    expect(result.current.stats.currentStreakDays).toBe(1);

    const stored = JSON.parse(localStorage.getItem(CARE_JOURNAL_STORAGE_KEY) || '{}');
    expect(stored.totalPetCount).toBe(1);
  });

  it('resetStats を呼ぶと初期状態に戻ること', () => {
    const { result } = renderHook(() => useCareJournal());

    act(() => {
      result.current.recordCareAction('feed', 'white');
      result.current.recordCareAction('play', 'calico');
    });

    expect(result.current.stats.totalFeedCount).toBe(1);
    expect(result.current.stats.totalPlayCount).toBe(1);

    act(() => {
      result.current.resetStats();
    });

    expect(result.current.stats.totalFeedCount).toBe(0);
    expect(result.current.stats.totalPlayCount).toBe(0);
  });
});
