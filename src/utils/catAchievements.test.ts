import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementCategoryLabel,
  getAchievementById,
  checkNewAchievements,
  hasGiftCount,
  sanitizeAchievements,
  getAchievementDisplayInfo,
  filterAchievements,
  formatAchievementDate,
  getAchievementProgress,
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
        // 未所持（0個）のときは解除されない
        expect(
          checkNewAchievements({ giftInventory: {} }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-pair-socks');

        // 1個所持のときは解除されない
        const singleInv: GiftInventory = {
          'single-sock': { giftId: 'single-sock', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        };
        expect(
          checkNewAchievements({ giftInventory: singleInv }, unlocked).map((a) => a.id)
        ).not.toContain('hidden-pair-socks');

        // ★バグ再発防止テスト: 1個所持の状態で receivedGift に靴下が渡されても、インベントリが1個なら二重加算されず解除されないこと
        const sockGift = {
          id: 'single-sock',
          name: 'かたっぽの靴下',
          description: '',
          icon: '🧦',
          iconType: 'single-sock',
          themeClass: '',
          rarity: 'rare' as const,
        };
        expect(
          checkNewAchievements(
            { giftInventory: singleInv, receivedGift: sockGift },
            unlocked
          ).map((a) => a.id)
        ).not.toContain('hidden-pair-socks');

        // 2個所持のときに解除される
        const pairInv: GiftInventory = {
          'single-sock': { giftId: 'single-sock', count: 2, firstReceivedAt: 1000, lastReceivedAt: 2000 },
        };
        expect(
          checkNewAchievements({ giftInventory: pairInv }, unlocked).map((a) => a.id)
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

  describe('filterAchievements (カテゴリと達成状況による実績カタログ絞り込み純粋関数)', () => {
    const sampleCatalog: AchievementItem[] = [
      { id: 'act-1', title: 'ふれあい1', description: '', iconType: 'paw', category: 'interaction' },
      { id: 'act-2', title: 'ふれあい2', description: '', iconType: 'paw', category: 'interaction' },
      { id: 'care-1', title: 'お世話1', description: '', iconType: 'food', category: 'care' },
      { id: 'gift-1', title: 'おくりもの1', description: '', iconType: 'gift', category: 'gift' },
    ];

    const unlocked: UnlockedAchievements = {
      'act-1': { id: 'act-1', unlockedAt: 1000 },
      'care-1': { id: 'care-1', unlockedAt: 2000 },
    };

    it('オプション無指定または all のときは全件返すこと', () => {
      expect(filterAchievements(sampleCatalog, unlocked)).toHaveLength(4);
      expect(filterAchievements(sampleCatalog, unlocked, { category: 'all', status: 'all' })).toHaveLength(4);
    });

    it('カテゴリ単独での絞り込みが機能すること', () => {
      const interactionOnly = filterAchievements(sampleCatalog, unlocked, { category: 'interaction' });
      expect(interactionOnly.map((a) => a.id)).toEqual(['act-1', 'act-2']);

      const careOnly = filterAchievements(sampleCatalog, unlocked, { category: 'care' });
      expect(careOnly.map((a) => a.id)).toEqual(['care-1']);
    });

    it('達成状況（status: "unlocked" / "locked"）単独での絞り込みが機能すること', () => {
      const unlockedOnly = filterAchievements(sampleCatalog, unlocked, { status: 'unlocked' });
      expect(unlockedOnly.map((a) => a.id)).toEqual(['act-1', 'care-1']);

      const lockedOnly = filterAchievements(sampleCatalog, unlocked, { status: 'locked' });
      expect(lockedOnly.map((a) => a.id)).toEqual(['act-2', 'gift-1']);
    });

    it('カテゴリと達成状況の組み合わせ（掛け合わせ）絞り込みが機能すること', () => {
      // interaction かつ unlocked -> act-1
      const interactionUnlocked = filterAchievements(sampleCatalog, unlocked, {
        category: 'interaction',
        status: 'unlocked',
      });
      expect(interactionUnlocked.map((a) => a.id)).toEqual(['act-1']);

      // interaction かつ locked -> act-2
      const interactionLocked = filterAchievements(sampleCatalog, unlocked, {
        category: 'interaction',
        status: 'locked',
      });
      expect(interactionLocked.map((a) => a.id)).toEqual(['act-2']);

      // care かつ locked -> care-1 は達成済みなので空配列
      const careLocked = filterAchievements(sampleCatalog, unlocked, {
        category: 'care',
        status: 'locked',
      });
      expect(careLocked).toEqual([]);
    });
  });

  describe('formatAchievementDate', () => {
    it('有効なUNIXタイムスタンプ（ミリ秒）を日本語日付形式（YYYY年M月D日）に整形できること', () => {
      // 2026年11月16日 12:00:00 (JST)
      const d = new Date(2026, 10, 16, 12, 0, 0);
      expect(formatAchievementDate(d.getTime())).toBe('2026年11月16日');
    });

    it('異なる日付でも正しく整形されること', () => {
      const d = new Date(2025, 0, 1, 0, 0, 0);
      expect(formatAchievementDate(d.getTime())).toBe('2025年1月1日');
    });

    it('null, undefined, NaN などの無効値が渡された場合は空文字を返すこと', () => {
      expect(formatAchievementDate(null)).toBe('');
      expect(formatAchievementDate(undefined)).toBe('');
      expect(formatAchievementDate(NaN)).toBe('');
      expect(formatAchievementDate(Infinity)).toBe('');
    });
  });

  describe('getAchievementProgress (未達成実績の目標進捗計算)', () => {
    it('なでなで回数系の実績で現在の進捗が正しく分数文字列として算出されること', () => {
      const item = ACHIEVEMENTS.find((a) => a.id === 'pet-count-100')!;
      const context = {
        careStats: {
          totalPetCount: 42,
          totalFeedCount: 0,
          totalPlayCount: 0,
          currentStreakDays: 0,
          maxStreakDays: 0,
          totalActiveDays: 0,
          activeDates: [],
          firstInteractionAt: null,
          lastInteractionAt: null,
          interactionsByCat: { black: 42, white: 0, calico: 0 },
        },
      };

      const progress = getAchievementProgress(item, context);
      expect(progress).not.toBeNull();
      expect(progress?.current).toBe(42);
      expect(progress?.target).toBe(100);
      expect(progress?.unit).toBe('回');
      expect(progress?.fractionText).toBe('42 / 100 回');
    });

    it('ごはん・おもちゃ回数系で進捗が正しく算出されること', () => {
      const feedItem = ACHIEVEMENTS.find((a) => a.id === 'feed-count-100')!;
      const playItem = ACHIEVEMENTS.find((a) => a.id === 'play-count-500')!;
      const context = {
        careStats: {
          totalPetCount: 0,
          totalFeedCount: 15,
          totalPlayCount: 200,
          currentStreakDays: 0,
          maxStreakDays: 0,
          totalActiveDays: 0,
          activeDates: [],
          firstInteractionAt: null,
          lastInteractionAt: null,
          interactionsByCat: { black: 0, white: 0, calico: 0 },
        },
      };

      expect(getAchievementProgress(feedItem, context)?.fractionText).toBe('15 / 100 回');
      expect(getAchievementProgress(playItem, context)?.fractionText).toBe('200 / 500 回');
    });

    it('連続日数・累計日数系で進捗が正しく算出されること', () => {
      const streakItem = ACHIEVEMENTS.find((a) => a.id === 'streak-7')!;
      const totalDaysItem = ACHIEVEMENTS.find((a) => a.id === 'total-days-30')!;
      const context = {
        careStats: {
          totalPetCount: 0,
          totalFeedCount: 0,
          totalPlayCount: 0,
          currentStreakDays: 3,
          maxStreakDays: 5,
          totalActiveDays: 12,
          activeDates: [],
          firstInteractionAt: null,
          lastInteractionAt: null,
          interactionsByCat: { black: 0, white: 0, calico: 0 },
        },
      };

      // streakは current と max の大きい方（5）が反映される
      expect(getAchievementProgress(streakItem, context)?.fractionText).toBe('5 / 7 日');
      expect(getAchievementProgress(totalDaysItem, context)?.fractionText).toBe('12 / 30 日');
    });

    it('おくりもの総個数・種類数系で進捗が正しく算出されること', () => {
      const giftCountItem = ACHIEVEMENTS.find((a) => a.id === 'gift-count-20')!;
      const uniqueGiftsItem = ACHIEVEMENTS.find((a) => a.id === 'unique-gifts-10')!;
      const context = {
        giftInventory: {
          pebble: { giftId: 'pebble', count: 3, firstReceivedAt: 1000, lastReceivedAt: 1000 },
          feather: { giftId: 'feather', count: 2, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        },
      };

      // 総個数 3 + 2 = 5
      expect(getAchievementProgress(giftCountItem, context)?.fractionText).toBe('5 / 20 個');
      // 種類数 2種類
      expect(getAchievementProgress(uniqueGiftsItem, context)?.fractionText).toBe('2 / 10 種類');
    });

    it('なつき度・全猫ふれあいで進捗が正しく算出されること', () => {
      const affItem = ACHIEVEMENTS.find((a) => a.id === 'affection-level-5')!;
      const allCatsItem = ACHIEVEMENTS.find((a) => a.id === 'all-cats-loved')!;
      const context = {
        maxAffectionLevel: 3,
        careStats: {
          totalPetCount: 10,
          totalFeedCount: 0,
          totalPlayCount: 0,
          currentStreakDays: 0,
          maxStreakDays: 0,
          totalActiveDays: 0,
          activeDates: [],
          firstInteractionAt: null,
          lastInteractionAt: null,
          interactionsByCat: { black: 5, white: 5, calico: 0 },
        },
      };

      expect(getAchievementProgress(affItem, context)?.fractionText).toBe('3 / 5 Lv');
      // 黒・白の2匹とふれあい済み
      expect(getAchievementProgress(allCatsItem, context)?.fractionText).toBe('2 / 3 匹');
    });

    it('隠し実績（isHidden: true）や初回系実績、瞬間スコア系実績は null を返すこと', () => {
      const hiddenItem = ACHIEVEMENTS.find((a) => a.id === 'hidden-pebble-set')!;
      const firstPetItem = ACHIEVEMENTS.find((a) => a.id === 'first-pet')!;
      const moodItem = ACHIEVEMENTS.find((a) => a.id === 'mood-ecstatic')!;

      expect(getAchievementProgress(hiddenItem)).toBeNull();
      expect(getAchievementProgress(firstPetItem)).toBeNull();
      expect(getAchievementProgress(moodItem)).toBeNull();
    });

    it('コンテキスト未指定時もクラッシュせず安全に 0 で計算されること', () => {
      const petItem = ACHIEVEMENTS.find((a) => a.id === 'pet-count-100')!;
      expect(getAchievementProgress(petItem, undefined)?.fractionText).toBe('0 / 100 回');
    });
  });

  describe('hasGiftCount 純粋関数 (累計個数判定)', () => {
    it('インベントリが undefined または空オブジェクトのときは false を返すこと', () => {
      expect(hasGiftCount(undefined, 'single-sock', 2)).toBe(false);
      expect(hasGiftCount({}, 'single-sock', 2)).toBe(false);
    });

    it('指定のギフトが存在しないか所持数が目標未満のときは false を返すこと', () => {
      const inv: GiftInventory = {
        'single-sock': { giftId: 'single-sock', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        feather: { giftId: 'feather', count: 5, firstReceivedAt: 1000, lastReceivedAt: 1000 },
      };
      expect(hasGiftCount(inv, 'single-sock', 2)).toBe(false);
      expect(hasGiftCount(inv, 'hairball', 1)).toBe(false);
    });

    it('所持数が目標数以上のときは true を返すこと（累計個数実績に対応）', () => {
      const inv: GiftInventory = {
        'single-sock': { giftId: 'single-sock', count: 2, firstReceivedAt: 1000, lastReceivedAt: 2000 },
        feather: { giftId: 'feather', count: 10, firstReceivedAt: 1000, lastReceivedAt: 3000 },
      };
      expect(hasGiftCount(inv, 'single-sock', 2)).toBe(true);
      expect(hasGiftCount(inv, 'feather', 10)).toBe(true);
      expect(hasGiftCount(inv, 'feather', 5)).toBe(true);
    });
  });
});
