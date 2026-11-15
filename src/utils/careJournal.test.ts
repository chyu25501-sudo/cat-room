import { describe, it, expect } from 'vitest';
import {
  INITIAL_CARE_STATS,
  toLocalDateString,
  getYesterdayDateString,
  recordInteraction,
  formatInteractionDate,
  sanitizeCareStats,
} from './careJournal.ts';
import { CareStats } from '../types/journal.ts';

describe('careJournal utils (ふり返り手帳 統計ロジック)', () => {
  describe('toLocalDateString & getYesterdayDateString', () => {
    it('タイムスタンプやDateからYYYY-MM-DD形式の日付文字列を取得できること', () => {
      const d = new Date(2026, 10, 15); // 2026-11-15
      expect(toLocalDateString(d)).toBe('2026-11-15');
      expect(toLocalDateString(d.getTime())).toBe('2026-11-15');
    });

    it('前日の日付文字列を正確に計算できること（月またぎ・年またぎ考慮）', () => {
      expect(getYesterdayDateString('2026-11-15')).toBe('2026-11-14');
      expect(getYesterdayDateString('2026-03-01')).toBe('2026-02-28');
      expect(getYesterdayDateString('2026-01-01')).toBe('2025-12-31');
    });
  });

  describe('recordInteraction', () => {
    const day1 = new Date(2026, 10, 15, 10, 0, 0).getTime();
    const day1Later = new Date(2026, 10, 15, 14, 0, 0).getTime();
    const day2 = new Date(2026, 10, 16, 9, 0, 0).getTime();
    const day4 = new Date(2026, 10, 18, 12, 0, 0).getTime();

    it('初回ふれあいで firstInteractionAt が記録され、各日数が1になること', () => {
      const stats = recordInteraction(INITIAL_CARE_STATS, 'pet', 'black', day1);

      expect(stats.firstInteractionAt).toBe(day1);
      expect(stats.lastInteractionAt).toBe(day1);
      expect(stats.lastInteractionDateStr).toBe('2026-11-15');
      expect(stats.totalPetCount).toBe(1);
      expect(stats.totalFeedCount).toBe(0);
      expect(stats.totalPlayCount).toBe(0);
      expect(stats.currentStreakDays).toBe(1);
      expect(stats.maxStreakDays).toBe(1);
      expect(stats.totalActiveDays).toBe(1);
      expect(stats.interactionsByCat.black).toBe(1);
    });

    it('同日内に複数回ふれあっても streakDays や totalActiveDays は増加しないこと', () => {
      let stats = recordInteraction(INITIAL_CARE_STATS, 'pet', 'black', day1);
      stats = recordInteraction(stats, 'feed', 'white', day1Later);
      stats = recordInteraction(stats, 'play', 'calico', day1Later + 1000);

      expect(stats.firstInteractionAt).toBe(day1);
      expect(stats.totalPetCount).toBe(1);
      expect(stats.totalFeedCount).toBe(1);
      expect(stats.totalPlayCount).toBe(1);
      expect(stats.currentStreakDays).toBe(1);
      expect(stats.maxStreakDays).toBe(1);
      expect(stats.totalActiveDays).toBe(1);
      expect(stats.interactionsByCat.black).toBe(1);
      expect(stats.interactionsByCat.white).toBe(1);
      expect(stats.interactionsByCat.calico).toBe(1);
    });

    it('翌日にふれあうと連続ふれあい日数（Streak）と累計日数が増加すること', () => {
      let stats = recordInteraction(INITIAL_CARE_STATS, 'pet', 'black', day1);
      stats = recordInteraction(stats, 'feed', 'black', day2);

      expect(stats.currentStreakDays).toBe(2);
      expect(stats.maxStreakDays).toBe(2);
      expect(stats.totalActiveDays).toBe(2);
      expect(stats.totalPetCount).toBe(1);
      expect(stats.totalFeedCount).toBe(1);
    });

    it('2日以上間隔が空くと連続日数が1にリセットされ、maxStreakDays は保持されること', () => {
      let stats = recordInteraction(INITIAL_CARE_STATS, 'pet', 'black', day1);
      stats = recordInteraction(stats, 'feed', 'black', day2); // streak 2, max 2
      // day3をスキップしてday4にふれあい
      stats = recordInteraction(stats, 'play', 'black', day4);

      expect(stats.currentStreakDays).toBe(1); // リセット
      expect(stats.maxStreakDays).toBe(2); // 最高連続記録は維持
      expect(stats.totalActiveDays).toBe(3); // 累計日数は増加
    });
  });

  describe('formatInteractionDate', () => {
    it('null のときは「まだふれあっていません」を返すこと', () => {
      expect(formatInteractionDate(null)).toBe('まだふれあっていません');
    });

    it('タイムスタンプから日本語の年月日文字列を返すこと', () => {
      const time = new Date(2026, 10, 15).getTime();
      expect(formatInteractionDate(time)).toBe('2026年11月15日');
    });
  });

  describe('sanitizeCareStats', () => {
    it('正常なデータをそのままサニタイズできること', () => {
      const valid: CareStats = {
        firstInteractionAt: 123456,
        lastInteractionAt: 789012,
        lastInteractionDateStr: '2026-11-15',
        totalPetCount: 10,
        totalFeedCount: 5,
        totalPlayCount: 3,
        currentStreakDays: 2,
        maxStreakDays: 5,
        totalActiveDays: 8,
        interactionsByCat: { black: 10, white: 5, calico: 3 },
      };

      const result = sanitizeCareStats(valid);
      expect(result).toEqual(valid);
    });

    it('不正な値や破損データに対して安全なフォールバック値を適用すること', () => {
      expect(sanitizeCareStats(null)).toEqual(INITIAL_CARE_STATS);
      expect(sanitizeCareStats('invalid')).toEqual(INITIAL_CARE_STATS);
      expect(sanitizeCareStats([])).toEqual(INITIAL_CARE_STATS);

      const corrupted = {
        totalPetCount: -10,
        currentStreakDays: 'abc',
        interactionsByCat: 'broken',
      };
      const result = sanitizeCareStats(corrupted);
      expect(result.totalPetCount).toBe(0);
      expect(result.currentStreakDays).toBe(0);
      expect(result.interactionsByCat).toEqual({ black: 0, white: 0, calico: 0 });
    });
  });
});
