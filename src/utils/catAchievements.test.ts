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
    it('全35種類の実績が定義されており、すべて通常の実績(isHidden: false)であること', () => {
      expect(ACHIEVEMENTS.length).toBe(35);

      const expectedIds = [
        'first-pet',
        'first-feed',
        'first-play',
        'mood-ecstatic',
        'first-gift',
        'fullness-full',
        'streak-3',
        'streak-7',
        'streak-14',
        'streak-30',
        'total-days-7',
        'total-days-14',
        'total-days-30',
        'pet-count-100',
        'pet-count-500',
        'pet-count-1000',
        'pet-count-5000',
        'pet-count-10000',
        'feed-count-100',
        'feed-count-500',
        'feed-count-1000',
        'feed-count-5000',
        'feed-count-10000',
        'play-count-100',
        'play-count-500',
        'play-count-1000',
        'play-count-5000',
        'play-count-10000',
        'gift-count-20',
        'gift-count-100',
        'gift-count-222',
        'gift-count-500',
        'gift-count-1000',
        'first-rare-gift',
        'first-rename-cat',
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

    it('まんぷく度最高（100またはfull）になった時に fullness-full 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements(
        { fullnessScore: 100, fullnessLevel: 'full' },
        unlocked
      );

      expect(newItems.map((a) => a.id)).toContain('fullness-full');
    });

    it('連続ふれあい日数（Streak）に応じて streak-3, streak-7, streak-14, streak-30 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const dummyStats = {
        firstInteractionAt: 1000,
        lastInteractionAt: 2000,
        lastInteractionDateStr: '2026-11-15',
        totalPetCount: 10,
        totalFeedCount: 5,
        totalPlayCount: 3,
        currentStreakDays: 7,
        maxStreakDays: 7,
        totalActiveDays: 7,
        interactionsByCat: { black: 10, white: 5, calico: 3 },
      };

      const newItems = checkNewAchievements({ careStats: dummyStats }, unlocked);
      const newIds = newItems.map((a) => a.id);

      expect(newIds).toContain('streak-3');
      expect(newIds).toContain('streak-7');
      expect(newIds).toContain('total-days-7');
      expect(newIds).not.toContain('streak-14');
      expect(newIds).not.toContain('total-days-14');
    });

    it('お世話の累計回数（なでる・ごはん・おもちゃ）に応じて各回数実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const dummyStats = {
        firstInteractionAt: 1000,
        lastInteractionAt: 2000,
        lastInteractionDateStr: '2026-11-15',
        totalPetCount: 150, // 100回達成
        totalFeedCount: 550, // 100回, 500回達成
        totalPlayCount: 1200, // 100回, 500回, 1000回達成
        currentStreakDays: 1,
        maxStreakDays: 1,
        totalActiveDays: 1,
        interactionsByCat: { black: 100, white: 50, calico: 0 },
      };

      const newItems = checkNewAchievements({ careStats: dummyStats }, unlocked);
      const newIds = newItems.map((a) => a.id);

      // なでる
      expect(newIds).toContain('pet-count-100');
      expect(newIds).not.toContain('pet-count-500');

      // ごはん
      expect(newIds).toContain('feed-count-100');
      expect(newIds).toContain('feed-count-500');
      expect(newIds).not.toContain('feed-count-1000');

      // おもちゃ
      expect(newIds).toContain('play-count-100');
      expect(newIds).toContain('play-count-500');
      expect(newIds).toContain('play-count-1000');
      expect(newIds).not.toContain('play-count-5000');
    });

    it('おくりものの総数に応じて gift-count-20, 100, 222, 500, 1000 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ totalGifts: 250 }, unlocked);
      const newIds = newItems.map((a) => a.id);

      expect(newIds).toContain('gift-count-20');
      expect(newIds).toContain('gift-count-100');
      expect(newIds).toContain('gift-count-222');
      expect(newIds).not.toContain('gift-count-500');
      expect(newIds).not.toContain('gift-count-1000');
    });

    it('レアなおくりものを受け取った時に first-rare-gift 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const rareItem = {
        id: 'rainbow-feather',
        name: 'なないろの羽根',
        description: '虹色の羽根',
        icon: '🪶',
        iconType: 'rainbow-feather',
        themeClass: '',
        rarity: 'rare' as const,
      };

      const newItems = checkNewAchievements({ receivedGift: rareItem }, unlocked);
      expect(newItems.map((a) => a.id)).toContain('first-rare-gift');

      // hasRareGift フラグでも解除されること
      const newItems2 = checkNewAchievements({ hasRareGift: true }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('first-rare-gift');
    });

    it('猫の名前を変更した時に first-rename-cat 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ action: 'rename' }, unlocked);
      expect(newItems.map((a) => a.id)).toContain('first-rename-cat');

      const newItems2 = checkNewAchievements({ isCatRenamed: true }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('first-rename-cat');
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
