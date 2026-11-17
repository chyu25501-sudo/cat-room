import { describe, it, expect } from 'vitest';
import {
  isAutoFeedUnlocked,
  calculateOfflineFeedCycles,
  simulateCatOfflineAutoFeed,
  simulateAllCatsOfflineAutoFeed,
  applyAutoFeedToCareStats,
  AUTO_FEED_MAX_OFFLINE_DAYS,
  AUTO_FEED_MAX_OFFLINE_MS,
  AUTO_FEED_CYCLE_MINUTES,
} from './autoFeed.ts';
import { CareStats } from '../types/journal.ts';
import { GiftItem } from '../types/gift.ts';

describe('autoFeed utils (自動ごはんの計算・シミュレーション)', () => {
  describe('isAutoFeedUnlocked (解禁判定)', () => {
    it('全猫（black, white, calico）のなつき度がLv.10のとき解禁（true）になること', () => {
      const levels = {
        black: 10,
        white: 10,
        calico: 10,
      };
      expect(isAutoFeedUnlocked(levels)).toBe(true);
    });

    it('オブジェクト形式 { level: number } でも判定できること', () => {
      const levels = {
        black: { level: 10 },
        white: { level: 10 },
        calico: { level: 10 },
      };
      expect(isAutoFeedUnlocked(levels)).toBe(true);
    });

    it('1匹でもLv.9以下の猫がいる場合は未解禁（false）になること', () => {
      expect(isAutoFeedUnlocked({ black: 10, white: 9, calico: 10 })).toBe(false);
      expect(isAutoFeedUnlocked({ black: 1, white: 1, calico: 1 })).toBe(false);
    });

    it('猫の情報が不足している場合や null/undefined の場合は未解禁（false）になること', () => {
      expect(isAutoFeedUnlocked(null)).toBe(false);
      expect(isAutoFeedUnlocked(undefined)).toBe(false);
      expect(isAutoFeedUnlocked({ black: 10, white: 10 })).toBe(false);
    });
  });

  describe('calculateOfflineFeedCycles (給餌サイクル計算)', () => {
    it('経過時間が0以下の場合は給餌0回、まんぷく度はそのまま維持されること', () => {
      const res = calculateOfflineFeedCycles(50, 0);
      expect(res.feedCount).toBe(0);
      expect(res.remainingFullness).toBe(50);
    });

    it('40%に達する前の時間では給餌は発生せず、自然減衰のみ行われること', () => {
      // 50%から40%になるには10分必要。5分経過時は給餌0回、45%になる
      const res = calculateOfflineFeedCycles(50, 5 * 60 * 1000);
      expect(res.feedCount).toBe(0);
      expect(res.remainingFullness).toBe(45);
    });

    it('ちょうど40%に達したときに1回目の給餌が発生し、65%に回復すること', () => {
      // 50%から40%になる10分後
      const res = calculateOfflineFeedCycles(50, 10 * 60 * 1000);
      expect(res.feedCount).toBe(1);
      expect(res.remainingFullness).toBe(65);
    });

    it('65%から25分（1サイクル）経過するごとに次の給餌が発生すること', () => {
      // 初期40%の場合:
      // 0分: 1回目給餌（65%）
      // 25分後: 2回目給餌（65%）
      const res25 = calculateOfflineFeedCycles(40, 25 * 60 * 1000);
      expect(res25.feedCount).toBe(2);
      expect(res25.remainingFullness).toBe(65);

      // 35分後: 2回給餌、最後の給餌から10分経過で 65 - 10 = 55%
      const res35 = calculateOfflineFeedCycles(40, 35 * 60 * 1000);
      expect(res35.feedCount).toBe(2);
      expect(res35.remainingFullness).toBe(55);
    });

    it('24時間（1440分）放置した場合、初期40%で約58回給餌されること（試算との整合性）', () => {
      const res = calculateOfflineFeedCycles(40, 24 * 60 * 60 * 1000);
      // 1440分: 0分に1回目、残り1440分 ÷ 25 = 57回追加 → 合計58回
      expect(res.feedCount).toBe(58);
      // 1440 % 25 = 15分減衰 → 65 - 15 = 50%
      expect(res.remainingFullness).toBe(50);
    });

    it('最大上限（7日間）を超えて放置しても7日分でキャップされること', () => {
      const res7Days = calculateOfflineFeedCycles(50, AUTO_FEED_MAX_OFFLINE_MS);
      // 10日間放置
      const res10Days = calculateOfflineFeedCycles(
        50,
        10 * 24 * 60 * 60 * 1000
      );

      expect(res10Days.feedCount).toBe(res7Days.feedCount);
      expect(res10Days.remainingFullness).toBe(res7Days.remainingFullness);
    });
  });

  describe('simulateCatOfflineAutoFeed (単一猫シミュレーション)', () => {
    it('24時間放置でExpが1,450pt獲得され、おくりものが2個手に入ること（試算との整合性）', () => {
      const res = simulateCatOfflineAutoFeed({
        catId: 'black',
        currentExp: 0,
        currentFullness: 40,
        elapsedMs: 24 * 60 * 60 * 1000,
      });

      // 58回 × 25 Exp = 1,450 Exp
      expect(res.feedCount).toBe(58);
      expect(res.totalExpGained).toBe(1450);
      // 1450 Exp ÷ 600 Exp = 2個（余り 250 Exp）
      expect(res.earnedGifts.length).toBe(2);
      expect(res.nextExp).toBe(250);
    });

    it('すでにゲージにExpが溜まっていた場合、合算して判定されること', () => {
      // 初期400 Exp + 250 Exp = 650 Exp（1回満タン、残り50 Exp）
      const res = simulateCatOfflineAutoFeed({
        catId: 'white',
        currentExp: 400,
        currentFullness: 40,
        // 250 Exp = 10回給餌 = 9サイクル × 25分 = 225分
        elapsedMs: 225 * 60 * 1000,
      });

      expect(res.feedCount).toBe(10);
      expect(res.totalExpGained).toBe(250);
      expect(res.earnedGifts.length).toBe(1);
      expect(res.nextExp).toBe(50);
    });
  });

  describe('simulateAllCatsOfflineAutoFeed (全猫シミュレーション)', () => {
    it('3匹全員にシミュレーションが実行され、結果が集約されること', () => {
      const allRes = simulateAllCatsOfflineAutoFeed({
        catExpMap: { black: 0, white: 0, calico: 0 },
        catFullnessMap: { black: 40, white: 40, calico: 40 },
        elapsedMs: 24 * 60 * 60 * 1000,
      });

      expect(allRes.catResults.black.feedCount).toBe(58);
      expect(allRes.catResults.white.feedCount).toBe(58);
      expect(allRes.catResults.calico.feedCount).toBe(58);
      expect(allRes.totalFeedCount).toBe(58 * 3);
      // 3匹 × 2個 = 6個のおくりもの
      expect(allRes.allEarnedGifts.length).toBe(6);
    });
  });

  describe('applyAutoFeedToCareStats (手帳統計反映とふれあい日数の保護)', () => {
    const initialStats: CareStats = {
      firstInteractionAt: 10000,
      lastInteractionAt: 20000,
      lastInteractionDateStr: '2026-11-15',
      totalPetCount: 10,
      totalFeedCount: 5,
      totalPlayCount: 3,
      currentStreakDays: 3,
      maxStreakDays: 5,
      totalActiveDays: 4,
      interactionsByCat: { black: 10, white: 5, calico: 3 },
    };

    it('給餌回数（totalFeedCount）と猫別ふれあい回数（interactionsByCat）のみが加算されること', () => {
      const updated = applyAutoFeedToCareStats(initialStats, {
        black: 58,
        white: 58,
        calico: 58,
      });

      // ごはん累計回数: 5 + (58 * 3) = 179
      expect(updated.totalFeedCount).toBe(5 + 174);
      // 猫別回数
      expect(updated.interactionsByCat.black).toBe(10 + 58);
      expect(updated.interactionsByCat.white).toBe(5 + 58);
      expect(updated.interactionsByCat.calico).toBe(3 + 58);
    });

    it('【重要要件】ふれあい日数（totalActiveDays, currentStreakDays, maxStreakDays, lastInteractionDateStr）は一切変更されないこと', () => {
      const updated = applyAutoFeedToCareStats(initialStats, {
        black: 58,
        white: 58,
        calico: 58,
      });

      expect(updated.totalActiveDays).toBe(initialStats.totalActiveDays);
      expect(updated.currentStreakDays).toBe(initialStats.currentStreakDays);
      expect(updated.maxStreakDays).toBe(initialStats.maxStreakDays);
      expect(updated.lastInteractionDateStr).toBe(initialStats.lastInteractionDateStr);
      expect(updated.totalPetCount).toBe(initialStats.totalPetCount);
      expect(updated.totalPlayCount).toBe(initialStats.totalPlayCount);
    });
  });
});
