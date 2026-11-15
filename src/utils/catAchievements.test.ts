import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementCategoryLabel,
  getAchievementById,
  checkNewAchievements,
  sanitizeAchievements,
  getAchievementDisplayInfo,
} from './catAchievements.ts';
import { AchievementItem, UnlockedAchievements } from '../types/achievement.ts';
import { GiftInventory } from '../types/gift.ts';

describe('catAchievements utils (実績データ・解除判定ロジック)', () => {
  describe('ACHIEVEMENTS 定数', () => {
    it('全60種類の実績が定義されており、3カテゴリ（ふれあい20件、お世話14件、おくりもの26件）に分類され、通常45種(isHidden: false)と隠し実績15種(isHidden: true)があること', () => {
      expect(ACHIEVEMENTS.length).toBe(60);

      const expectedIds = [
        // interaction (20)
        'first-pet',
        'mood-ecstatic',
        'pet-count-100',
        'pet-count-500',
        'pet-count-1000',
        'pet-count-5000',
        'pet-count-10000',
        'affection-level-5',
        'affection-level-10',
        'all-cats-loved',
        'all-cats-affection-3',
        'all-cats-affection-10',
        'streak-3',
        'streak-7',
        'streak-14',
        'streak-30',
        'total-days-7',
        'total-days-14',
        'total-days-30',
        'first-rename-cat',
        // care (14)
        'first-feed',
        'fullness-full',
        'perfect-satisfaction',
        'feed-count-100',
        'feed-count-500',
        'feed-count-1000',
        'feed-count-5000',
        'feed-count-10000',
        'first-play',
        'play-count-100',
        'play-count-500',
        'play-count-1000',
        'play-count-5000',
        'play-count-10000',
        // gift (11 + 15 = 26)
        'first-gift',
        'unique-gifts-10',
        'unique-gifts-40',
        'gift-count-20',
        'gift-count-100',
        'gift-count-222',
        'gift-count-500',
        'gift-count-1000',
        'first-rare-gift',
        'first-super-rare-gift',
        'first-ultra-rare-gift',
        // hidden gift items (15)
        'hidden-pebble-set',
        'hidden-branch-set',
        'hidden-clover-set',
        'hidden-cicada-set',
        'hidden-ice-stick-set',
        'hidden-feather-set',
        'hidden-gem-set',
        'hidden-dragon-set',
        'hidden-dandelion-seed-set',
        'hidden-super-rare-trio-set',
        'hidden-ultra-rare-set',
        'hidden-rainbow-colors-set',
        'hidden-pair-socks',
        'hidden-cat-treasures-set',
        'hidden-shiny-shiny-set',
      ];
      expect(ACHIEVEMENTS.map((a) => a.id)).toEqual(expectedIds);

      ACHIEVEMENTS.forEach((achievement) => {
        expect(achievement.title).toBeTruthy();
        expect(achievement.description).toBeTruthy();
        expect(achievement.iconType).toBeTruthy();
        expect(achievement.category).toBeTruthy();
        if (achievement.id.startsWith('hidden-')) {
          expect(achievement.isHidden).toBe(true);
          expect(achievement.category).toBe('gift');
        } else {
          expect(achievement.isHidden).toBe(false);
        }
      });
    });

    it('ACHIEVEMENT_CATEGORIES とラベルヘルパーが正しく動作すること', () => {
      expect(ACHIEVEMENT_CATEGORIES.length).toBe(3);
      expect(ACHIEVEMENT_CATEGORIES.map((c) => c.id)).toEqual(['interaction', 'care', 'gift']);
      expect(getAchievementCategoryLabel('interaction')).toBe('ふれあい');
      expect(getAchievementCategoryLabel('care')).toBe('お世話');
      expect(getAchievementCategoryLabel('gift')).toBe('おくりもの');
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

      expect(newItems.map((a) => a.id)).toEqual(['mood-ecstatic', 'first-feed']);
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

    it('レア・スーパーレア・ウルトラレアなおくりものを受け取った時に first-rare-gift 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const rareItem = {
        id: 'old-coin',
        name: 'ふしぎな古銭',
        description: '',
        icon: '🪙',
        iconType: 'old-coin',
        themeClass: '',
        rarity: 'rare' as const,
      };

      const newItems = checkNewAchievements({ receivedGift: rareItem }, unlocked);
      expect(newItems.map((a) => a.id)).toContain('first-rare-gift');

      // スーパーレアでも解除されること
      const srItem = {
        id: 'four-leaf-clover',
        name: 'よつばのクローバー',
        description: '',
        icon: '🍀',
        iconType: 'four-leaf-clover',
        themeClass: '',
        rarity: 'super-rare' as const,
      };
      expect(checkNewAchievements({ receivedGift: srItem }, unlocked).map((a) => a.id)).toContain(
        'first-rare-gift'
      );

      // ウルトラレアでも解除されること
      const urItem = {
        id: 'rainbow-feather',
        name: 'なないろの羽根',
        description: '',
        icon: '🪶',
        iconType: 'rainbow-feather',
        themeClass: '',
        rarity: 'ultra-rare' as const,
      };
      expect(checkNewAchievements({ receivedGift: urItem }, unlocked).map((a) => a.id)).toContain(
        'first-rare-gift'
      );

      // hasRareGift フラグでも解除されること
      const newItems2 = checkNewAchievements({ hasRareGift: true }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('first-rare-gift');
    });

    it('スーパーレアなおくりものを受け取った時に first-super-rare-gift 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const srItem = {
        id: 'four-leaf-clover',
        name: 'よつばのクローバー',
        description: '',
        icon: '🍀',
        iconType: 'four-leaf-clover',
        themeClass: '',
        rarity: 'super-rare' as const,
      };

      const newItems = checkNewAchievements({ receivedGift: srItem }, unlocked);
      expect(newItems.map((a) => a.id)).toContain('first-super-rare-gift');

      // hasSuperRareGift フラグでも解除されること
      const newItems2 = checkNewAchievements({ hasSuperRareGift: true }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('first-super-rare-gift');
    });

    it('ウルトラレアなおくりものを受け取った時に first-ultra-rare-gift 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const urItem = {
        id: 'rainbow-feather',
        name: 'なないろの羽根',
        description: '',
        icon: '🪶',
        iconType: 'rainbow-feather',
        themeClass: '',
        rarity: 'ultra-rare' as const,
      };

      const newItems = checkNewAchievements({ receivedGift: urItem }, unlocked);
      expect(newItems.map((a) => a.id)).toContain('first-ultra-rare-gift');

      // hasUltraRareGift フラグでも解除されること
      const newItems2 = checkNewAchievements({ hasUltraRareGift: true }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('first-ultra-rare-gift');
    });

    it('猫の名前を変更した時に first-rename-cat 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      const newItems = checkNewAchievements({ action: 'rename' }, unlocked);
      expect(newItems.map((a) => a.id)).toContain('first-rename-cat');

      const newItems2 = checkNewAchievements({ isCatRenamed: true }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('first-rename-cat');
    });

    it('なつき度レベル5に到達した時に affection-level-5 実績が解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      // レベル4以下では解除されない
      expect(
        checkNewAchievements({ affectionLevel: 4 }, unlocked).map((a) => a.id)
      ).not.toContain('affection-level-5');

      // レベル5で解除される（affectionLevel / maxAffectionLevel 両対応）
      const newItems1 = checkNewAchievements({ affectionLevel: 5 }, unlocked);
      expect(newItems1.map((a) => a.id)).toContain('affection-level-5');
      expect(newItems1.map((a) => a.id)).not.toContain('affection-level-10');

      const newItems2 = checkNewAchievements({ maxAffectionLevel: 6 }, unlocked);
      expect(newItems2.map((a) => a.id)).toContain('affection-level-5');
    });

    it('なつき度レベル10に到達した時に affection-level-10 実績（および未達成ならレベル5も同時に）解除されること', () => {
      const unlocked: UnlockedAchievements = {};
      // レベル9では解除されない
      expect(
        checkNewAchievements({ affectionLevel: 9 }, unlocked).map((a) => a.id)
      ).not.toContain('affection-level-10');

      // レベル10で解除される（未解除のレベル5も同時解除される）
      const newItems = checkNewAchievements({ affectionLevel: 10 }, unlocked);
      const newIds = newItems.map((a) => a.id);
      expect(newIds).toContain('affection-level-5');
      expect(newIds).toContain('affection-level-10');

      // すでにレベル5が解除済みの場合はレベル10のみ解除される
      const unlockedLv5: UnlockedAchievements = {
        'affection-level-5': { id: 'affection-level-5', unlockedAt: 1000 },
      };
      const newItems2 = checkNewAchievements({ maxAffectionLevel: 10 }, unlockedLv5);
      const newIds2 = newItems2.map((a) => a.id);
      expect(newIds2).not.toContain('affection-level-5');
      expect(newIds2).toContain('affection-level-10');
    });

    describe('隠し実績（おくりもの収集セット8種）', () => {
      const makeInventory = (ids: string[]): GiftInventory => {
        const inv: GiftInventory = {};
        ids.forEach((id) => {
          inv[id] = { id, count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 };
        });
        return inv;
      };

      it('小石セット（きれいな小石・こけむした小石・ひかる苔石）を所持したときに hidden-pebble-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        // 2つだけでは解除されない
        const partialInv = makeInventory(['pebble', 'mossy-pebble']);
        expect(
          checkNewAchievements({ giftInventory: partialInv }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-pebble-set');

        // 3つ揃うと解除される
        const fullInv = makeInventory(['pebble', 'mossy-pebble', 'glowing-moss-stone']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-pebble-set');

        // 直前に受け取ったギフトを含めて3つ揃う場合も解除されること
        const justReceived = {
          id: 'glowing-moss-stone',
          name: 'ひかる苔石',
          description: '',
          icon: '🪨',
          iconType: 'glowing-moss-stone',
          themeClass: '',
          rarity: 'rare' as const,
        };
        expect(
          checkNewAchievements(
            { giftInventory: partialInv, receivedGift: justReceived },
            unlocked
          ).map((a) => a.id)
        ).toContain('hidden-pebble-set');
      });

      it('小枝セット（ほそい小枝・りっぱな枝）を所持したときに hidden-branch-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['twig', 'splendid-branch']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-branch-set');
      });

      it('クローバーセット（みどりのクローバー・よつばのクローバー）を所持したときに hidden-clover-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['clover', 'four-leaf-clover']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-clover-set');
      });

      it('セミセット（せみのぬけがら・かわいた蝉の羽）を所持したときに hidden-cicada-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['cicada-shell', 'cicada-wing']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-cicada-set');
      });

      it('アイス棒セット（はずれのアイス棒・あたりのアイス棒）を所持したときに hidden-ice-stick-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['ice-stick', 'winning-ice-stick']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-ice-stick-set');
      });

      it('羽根セット（ふわふわの羽根・なないろの羽根）を所持したときに hidden-feather-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['feather', 'rainbow-feather']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-feather-set');
      });

      it('宝石セット（あかいろ・あおいろ・きいろの宝石）を所持したときに hidden-gem-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['red-gem', 'blue-gem', 'yellow-gem']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-gem-set');
      });

      it('竜セット（りゅうの鱗・りゅうの爪）を所持したときに hidden-dragon-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['dragon-scale', 'dragon-claw']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-dragon-set');
      });

      it('綿毛・種セット（やわらかい綿毛・ひまわりの種）を所持したときに hidden-dandelion-seed-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const partialInv = makeInventory(['soft-dandelion']);
        expect(
          checkNewAchievements({ giftInventory: partialInv }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-dandelion-seed-set');

        const fullInv = makeInventory(['soft-dandelion', 'sunflower-seed']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-dandelion-seed-set');
      });

      it('スーパーレアトリオ（よつばのクローバー・ほしのかけら・りゅうの鱗）を所持したときに hidden-super-rare-trio-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['four-leaf-clover', 'star-fragment', 'dragon-scale']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-super-rare-trio-set');
      });

      it('ウルトラレアセット（なないろの羽根・いにしえの歯車・りゅうの爪）を所持したときに hidden-ultra-rare-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv = makeInventory(['rainbow-feather', 'ancient-gear', 'dragon-claw']);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-ultra-rare-set');
      });

      it('カラフルカラーセット（緑・白・桃・青・赤・黄・虹）をすべて所持したときに hidden-rainbow-colors-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const targetIds = [
          'clover',
          'super-ball',
          'white-dice',
          'pink-handkerchief',
          'blue-can',
          'red-gem',
          'blue-gem',
          'yellow-gem',
          'rainbow-feather',
        ];
        // 1個足りない場合は解除されない
        const partialInv = makeInventory(targetIds.slice(0, 8));
        expect(
          checkNewAchievements({ giftInventory: partialInv }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-rainbow-colors-set');

        const fullInv = makeInventory(targetIds);
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-rainbow-colors-set');
      });

      it('「かたっぽの靴下」を2個以上所持したときに hidden-pair-socks が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        // 1個所持のときは解除されない
        const singleInv: GiftInventory = {
          'single-sock': { giftId: 'single-sock', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        };
        expect(
          checkNewAchievements({ giftInventory: singleInv }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-pair-socks');

        // 2個所持のときに解除される
        const pairInv: GiftInventory = {
          'single-sock': { giftId: 'single-sock', count: 2, firstReceivedAt: 1000, lastReceivedAt: 2000 },
        };
        expect(
          checkNewAchievements({ giftInventory: pairInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-pair-socks');

        // 1個所持の状態で、直前に2個目を受け取ったときにも即座に解除されること
        const sockGift = {
          id: 'single-sock',
          name: 'かたっぽの靴下',
          description: '',
          icon: '🧦',
          iconType: 'single-sock',
          themeClass: '',
          rarity: 'common' as const,
        };
        expect(
          checkNewAchievements(
            { giftInventory: singleInv, receivedGift: sockGift },
            unlocked
          ).map((a) => a.id)
        ).toContain('hidden-pair-socks');
      });

      it('「まるまった毛玉」と「ぬけたじぶんのヒゲ」をすべて集めたときに hidden-cat-treasures-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const partialInv: GiftInventory = {
          hairball: { giftId: 'hairball', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        };
        expect(
          checkNewAchievements({ giftInventory: partialInv }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-cat-treasures-set');

        const fullInv: GiftInventory = {
          hairball: { giftId: 'hairball', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
          'cat-whisker': { giftId: 'cat-whisker', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        };
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-cat-treasures-set');
      });

      it('「きらきらしたおはじき」「ちいさな鈴」「ほしのかけら」をすべて集めたときに hidden-shiny-shiny-set が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const fullInv: GiftInventory = {
          'glass-marble': { giftId: 'glass-marble', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
          'small-bell': { giftId: 'small-bell', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
          'star-fragment': { giftId: 'star-fragment', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        };
        expect(
          checkNewAchievements({ giftInventory: fullInv }, unlocked).map((a) => a.id)
        ).toContain('hidden-shiny-shiny-set');
      });
    });

    describe('新通常実績の解除判定', () => {
      it('ごきげん度とまんぷく度の両方が100になった時に perfect-satisfaction が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        // 片方だけ100では解除されない
        expect(
          checkNewAchievements({ moodScore: 100, fullnessScore: 80 }, unlocked).map((a) => a.id)
        ).not.toContain('perfect-satisfaction');
        expect(
          checkNewAchievements({ moodScore: 80, fullnessScore: 100 }, unlocked).map((a) => a.id)
        ).not.toContain('perfect-satisfaction');

        // 両方100で解除される
        expect(
          checkNewAchievements({ moodScore: 100, fullnessScore: 100 }, unlocked).map((a) => a.id)
        ).toContain('perfect-satisfaction');
      });

      it('3匹みんなとふれあった時に all-cats-loved が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const twoCatsStats: any = {
          interactionsByCat: { black: 5, white: 3, calico: 0 },
        };
        expect(
          checkNewAchievements({ careStats: twoCatsStats }, unlocked).map((a) => a.id)
        ).not.toContain('all-cats-loved');

        const allCatsStats: any = {
          interactionsByCat: { black: 5, white: 3, calico: 1 },
        };
        expect(
          checkNewAchievements({ careStats: allCatsStats }, unlocked).map((a) => a.id)
        ).toContain('all-cats-loved');
      });

      it('全猫のなつき度レベルが3以上になった時に all-cats-affection-3 が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        expect(
          checkNewAchievements({ minAffectionLevel: 2 }, unlocked).map((a) => a.id)
        ).not.toContain('all-cats-affection-3');

        expect(
          checkNewAchievements({ minAffectionLevel: 3 }, unlocked).map((a) => a.id)
        ).toContain('all-cats-affection-3');
        expect(
          checkNewAchievements({ minAffectionLevel: 5 }, unlocked).map((a) => a.id)
        ).toContain('all-cats-affection-3');
      });

      it('全猫のなつき度レベルが10になった時に all-cats-affection-10 が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        expect(
          checkNewAchievements({ minAffectionLevel: 9 }, unlocked).map((a) => a.id)
        ).not.toContain('all-cats-affection-10');

        expect(
          checkNewAchievements({ minAffectionLevel: 10 }, unlocked).map((a) => a.id)
        ).toContain('all-cats-affection-10');
      });

      it('異なるおくりものを10種類以上集めた時に unique-gifts-10 が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const nineGiftsInv: GiftInventory = {};
        for (let i = 1; i <= 9; i++) {
          nineGiftsInv[`gift-${i}`] = { giftId: `gift-${i}`, count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 };
        }
        expect(
          checkNewAchievements({ giftInventory: nineGiftsInv }, unlocked).map((a) => a.id)
        ).not.toContain('unique-gifts-10');

        const tenGiftsInv: GiftInventory = { ...nineGiftsInv };
        tenGiftsInv['gift-10'] = { giftId: 'gift-10', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 };
        expect(
          checkNewAchievements({ giftInventory: tenGiftsInv }, unlocked).map((a) => a.id)
        ).toContain('unique-gifts-10');
      });

      it('異なるおくりものを40種類以上集めた時に unique-gifts-40 が解除されること', () => {
        const unlocked: UnlockedAchievements = {};
        const thirtyNineInv: GiftInventory = {};
        for (let i = 1; i <= 39; i++) {
          thirtyNineInv[`gift-${i}`] = { giftId: `gift-${i}`, count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 };
        }
        expect(
          checkNewAchievements({ giftInventory: thirtyNineInv }, unlocked).map((a) => a.id)
        ).not.toContain('unique-gifts-40');

        const fortyInv: GiftInventory = { ...thirtyNineInv };
        fortyInv['gift-40'] = { giftId: 'gift-40', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 };
        expect(
          checkNewAchievements({ giftInventory: fortyInv }, unlocked).map((a) => a.id)
        ).toContain('unique-gifts-40');
      });
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
