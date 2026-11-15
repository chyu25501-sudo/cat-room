import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS,
  getAchievementById,
  checkNewAchievements,
  sanitizeAchievements,
  getAchievementDisplayInfo,
} from './catAchievements.ts';
import { AchievementItem, UnlockedAchievements } from '../types/achievement.ts';

describe('catAchievements utils (実績データ・解除判定ロジック)', () => {
  describe('ACHIEVEMENTS 定数', () => {
    it('初期実績として5種類の実績が定義されており、すべて通常の実績(isHidden: false)であること', () => {
      expect(ACHIEVEMENTS.length).toBe(5);

      const expectedIds = [
        'first-pet',
        'first-feed',
        'first-play',
        'mood-ecstatic',
        'first-gift',
      ];
      expect(ACHIEVEMENTS.map((a) => a.id)).toEqual(expectedIds);

      ACHIEVEMENTS.forEach((achievement) => {
        expect(achievement.title).toBeTruthy();
        expect(achievement.description).toBeTruthy();
        expect(achievement.iconType).toBeTruthy();
        expect(achievement.isHidden).toBe(false);
      });
    });
  });

  describe('getAchievementById', () => {
    it('存在するIDで実績情報を取得できること', () => {
      const achievement = getAchievementById('first-pet');
      expect(achievement?.title).toBe('はじめまして！');
    });

    it('存在しないIDの場合は undefined が返ること', () => {
      expect(getAchievementById('unknown-id')).toBeUndefined();
    });
  });

  describe('checkNewAchievements', () => {
    it('初めてなでた時に first-pet 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ action: 'pet' }, unlocked);

      expect(newItems.map((a) => a.id)).toEqual(['first-pet']);
    });

    it('初めてごはんをあげた時に first-feed 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ action: 'feed' }, unlocked);

      expect(newItems.map((a) => a.id)).toEqual(['first-feed']);
    });

    it('初めておもちゃで遊んだ時に first-play 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ action: 'play' }, unlocked);

      expect(newItems.map((a) => a.id)).toEqual(['first-play']);
    });

    it('ごきげん度が100（または ecstatic）になった時に mood-ecstatic 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements(
        { moodScore: 100, moodLevel: 'ecstatic' },
        unlocked
      );

      expect(newItems.map((a) => a.id)).toEqual(['mood-ecstatic']);
    });

    it('おくりものを受け取った時に first-gift 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ action: 'gift', totalGifts: 1 }, unlocked);

      expect(newItems.map((a) => a.id)).toEqual(['first-gift']);
    });

    it('既に解除済みの実績は二重に解除されないこと', () => {
      const unlocked: UnlockedAchievements = {
        'first-pet': { id: 'first-pet', unlockedAt: 1000 },
      };
      const newItems = checkNewAchievements({ action: 'pet' }, unlocked);

      expect(newItems).toHaveLength(0);
    });

    it('複数の実績が同時に条件を満たした場合、同時にすべて解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      // 初めてごはんをあげて、同時にごきげん度が100になった場合
      const newItems = checkNewAchievements(
        { action: 'feed', moodScore: 100, moodLevel: 'ecstatic' },
        unlocked
      );

      expect(newItems.map((a) => a.id)).toEqual(['first-feed', 'mood-ecstatic']);
    });
  });

  describe('sanitizeAchievements', () => {
    it('正常なオブジェクトをそのままサニタイズできること', () => {
      const raw = {
        'first-pet': { id: 'first-pet', unlockedAt: 12345 },
      };
      const sanitized = sanitizeAchievements(raw);
      expect(sanitized['first-pet'].id).toBe('first-pet');
      expect(sanitized['first-pet'].unlockedAt).toBe(12345);
    });

    it('破損データやnullの場合は空オブジェクトを返すこと', () => {
      expect(sanitizeAchievements(null)).toEqual({});
      expect(sanitizeAchievements('broken string')).toEqual({});
      expect(sanitizeAchievements([1, 2, 3])).toEqual({});
    });
  });

  describe('getAchievementDisplayInfo (隠し実績・通常実績の表示情報判定)', () => {
    const normalItem: AchievementItem = {
      id: 'normal-item',
      title: '通常の実績名',
      description: '通常の実績の獲得条件です。',
      iconType: 'paw',
      isHidden: false,
    };

    const hiddenItem: AchievementItem = {
      id: 'hidden-item',
      title: '秘密の実績名',
      description: '秘密の獲得条件です。',
      iconType: 'sparkle',
      isHidden: true,
    };

    it('通常の実績（未獲得時）: タイトルのみ「？？？」に伏せられ、獲得条件はそのまま表示されること', () => {
      const info = getAchievementDisplayInfo(normalItem, false);
      expect(info.displayTitle).toBe('？？？');
      expect(info.displayDescription).toBe('通常の実績の獲得条件です。');
      expect(info.isUnlocked).toBe(false);
      expect(info.isHidden).toBe(false);
    });

    it('通常の実績（獲得後）: タイトル・獲得条件ともに本来の内容が表示されること', () => {
      const info = getAchievementDisplayInfo(normalItem, true);
      expect(info.displayTitle).toBe('通常の実績名');
      expect(info.displayDescription).toBe('通常の実績の獲得条件です。');
      expect(info.isUnlocked).toBe(true);
      expect(info.isHidden).toBe(false);
    });

    it('隠し実績（未獲得時）: タイトル「？？？」および獲得条件「？？？？？？」の両方が伏せ字になること', () => {
      const info = getAchievementDisplayInfo(hiddenItem, false);
      expect(info.displayTitle).toBe('？？？');
      expect(info.displayDescription).toBe('？？？？？？');
      expect(info.isUnlocked).toBe(false);
      expect(info.isHidden).toBe(true);
    });

    it('隠し実績（獲得後）: タイトル・獲得条件ともに本来の内容が表示されること', () => {
      const info = getAchievementDisplayInfo(hiddenItem, true);
      expect(info.displayTitle).toBe('秘密の実績名');
      expect(info.displayDescription).toBe('秘密の獲得条件です。');
      expect(info.isUnlocked).toBe(true);
      expect(info.isHidden).toBe(true);
    });
  });
});
