import { describe, it, expect } from 'vitest';
import {
  CAT_GIFTS,
  DEFAULT_GIFT,
  getGiftById,
  pickRandomGift,
  addGiftToInventory,
  getGiftCount,
  getTotalGiftCount,
  getAcquiredGiftTypeCount,
  sanitizeGiftInventory,
  getGiftWeight,
  getGiftIconBgClass,
  DEFAULT_COMMON_GIFT_WEIGHT,
  DEFAULT_RARE_GIFT_WEIGHT,
} from './catGifts.ts';
import { GiftInventory } from '../types/gift.ts';

describe('catGifts utils (おくりもの計算・インベントリ管理ロジック)', () => {
  describe('CAT_GIFTS 定数', () => {
    it('合計60種類のおくりものが定義されており、すべて「ひらがな形容詞＋名詞」の命名規則に従っていること', () => {
      expect(CAT_GIFTS.length).toBe(60);

      const expectedIds = [
        // 【通常】自然・植物・木の実 (12)
        'pebble',
        'mossy-pebble',
        'twig',
        'seashell',
        'fallen-leaf',
        'acorn',
        'pinecone',
        'clover',
        'wilted-flower',
        'soft-dandelion',
        'withered-foxtail',
        'sunflower-seed',
        // 【通常】昆虫・生き物・痕跡 (4)
        'cicada-shell',
        'cicada-wing',
        'lizard-tail',
        'cat-whisker',
        // 【通常】おもちゃ・遊び道具・布・毛糸 (9)
        'super-ball',
        'dented-pingpong-ball',
        'glass-marble',
        'white-dice',
        'small-bell',
        'ribbon',
        'yarn-scrap',
        'hairball',
        'dirty-plush',
        // 【通常】日用品・身の回りの小物 (7)
        'feather',
        'old-stamp',
        'hairpin',
        'button',
        'pink-handkerchief',
        'single-sock',
        'broken-rubber-band',
        // 【通常】パッケージ・ゴミ・空き容器 (13)
        'twisted-wire',
        'crumpled-aluminum',
        'cardboard-scrap',
        'torn-receipt',
        'candy-wrapper',
        'snack-wrapper',
        'bento-baran',
        'skewer',
        'ice-stick',
        'plastic-bottle-cap',
        'jelly-cup',
        'blue-can',
        'empty-bottle',
        // 【レア】日常の珍品・幸運・宝石 (7)
        'important-paper',
        'winning-ice-stick',
        'old-coin',
        'four-leaf-clover',
        'red-gem',
        'blue-gem',
        'yellow-gem',
        // 【レア】ファンタジー・神秘・古代・伝説 (8)
        'splendid-branch',
        'glowing-moss-stone',
        'rainbow-feather',
        'ancient-gear',
        'curious-magatama',
        'star-fragment',
        'dragon-scale',
        'dragon-claw',
      ];

      expect(CAT_GIFTS.map((g) => g.id)).toEqual(expectedIds);

      expectedIds.forEach((id) => {
        const gift = CAT_GIFTS.find((g) => g.id === id);
        expect(gift).toBeDefined();
        expect(gift?.name).toBeTruthy();
        expect(gift?.description).toBeTruthy();
      });

      // 「みどりのクローバー」が三つ葉の説明になっていること
      const clover = CAT_GIFTS.find((g) => g.id === 'clover');
      expect(clover?.description).toContain('三つ葉');
      expect(clover?.rarity).toBe('common');

      // 「かたっぽの靴下」の説明文が「部屋のどこかから持ってきた」になっていること
      const singleSock = CAT_GIFTS.find((g) => g.id === 'single-sock');
      expect(singleSock?.description).toContain('部屋のどこかから持ってきた');
      expect(singleSock?.description).not.toContain('洗濯カゴ');
      expect(singleSock?.rarity).toBe('common');

      // 「だいじそうな紙」の説明文が指定通りで、レアリティがレアであること
      const importantPaper = CAT_GIFTS.find((g) => g.id === 'important-paper');
      expect(importantPaper?.description).toContain('よくわからないが請求書と書かれている。');
      expect(importantPaper?.description).toBe(
        'よくわからないが請求書と書かれている。机の上から見つけてきたらしく、得意げな顔で足元へ差し出してきた。'
      );
      expect(importantPaper?.rarity).toBe('rare');

      // 「りゅうの鱗」「りゅうの爪」の「りゅう」がドラゴンであること
      const dragonScale = CAT_GIFTS.find((g) => g.id === 'dragon-scale');
      expect(dragonScale?.description).toContain('ドラゴン');
      const dragonClaw = CAT_GIFTS.find((g) => g.id === 'dragon-claw');
      expect(dragonClaw?.description).toContain('ドラゴン');

      // 命名規則の検証: 先頭がひらがなの形容詞・連体修飾語
      const hiraganaPrefixPattern =
        /^(きれいな|ふわふわの|まるい|ほそい|ちいさな|あかい|おおきな|みどりの|ながい|ひかる|ふしぎな|なないろの|よつばの|こけむした|ふるい|かわいい|しおれた|せみの|しろい|きらきらした|よごれた|かたっぽの|ひまわりの|おやつの|ほそながい|はずれの|だいじそうな|あおい|からっぽの|ももいろの|おかしの|おべんとうの|あかいろの|あおいろの|きいろの|あたりの|りゅうの|ほしの|いにしえの|りっぱな|きみょうな|ちぎれた|まるめた|ぬけた|やぶれた|まるまった|ねじれた|かれた|へこんだ|やわらかい|あいた|すべすべの|かわいた)/;
      CAT_GIFTS.forEach((gift) => {
        expect(gift.name).toMatch(hiraganaPrefixPattern);
      });
    });

    it('通常のレアリティ（common: 45種）が上（前方）に、レア（rare: 15種）が下（後方）に並んでいること', () => {
      const commonGifts = CAT_GIFTS.slice(0, 45);
      const rareGifts = CAT_GIFTS.slice(45);

      expect(commonGifts.length).toBe(45);
      expect(rareGifts.length).toBe(15);

      commonGifts.forEach((gift) => {
        expect(gift.rarity).toBe('common');
      });

      rareGifts.forEach((gift) => {
        expect(gift.rarity).toBe('rare');
      });
    });

    it('レアアイテムの中でファンタジー・神秘世界観のもの（神木、古代文明、星、ドラゴン等）が下方に並んでいること', () => {
      const rareGifts = CAT_GIFTS.slice(45);

      // 前半7種: 日常・幸運・宝石
      const everydayAndLuckyIds = rareGifts.slice(0, 7).map((g) => g.id);
      expect(everydayAndLuckyIds).toEqual([
        'important-paper',
        'winning-ice-stick',
        'old-coin',
        'four-leaf-clover',
        'red-gem',
        'blue-gem',
        'yellow-gem',
      ]);

      // 後半8種: ファンタジー・神秘・古代・伝説
      const fantasyIds = rareGifts.slice(7).map((g) => g.id);
      expect(fantasyIds).toEqual([
        'splendid-branch',
        'glowing-moss-stone',
        'rainbow-feather',
        'ancient-gear',
        'curious-magatama',
        'star-fragment',
        'dragon-scale',
        'dragon-claw',
      ]);
    });
  });

  describe('レアリティと重み計算 (getGiftWeight & getGiftIconBgClass)', () => {
    it('レアアイテムは通常アイテムより重みが小さく、もらえる確率が低くなっていること', () => {
      expect(DEFAULT_RARE_GIFT_WEIGHT).toBeLessThan(DEFAULT_COMMON_GIFT_WEIGHT);

      const commonGift = CAT_GIFTS.find((g) => g.id === 'pebble')!;
      const rareGift = CAT_GIFTS.find((g) => g.id === 'old-coin')!;

      expect(getGiftWeight(commonGift)).toBe(DEFAULT_COMMON_GIFT_WEIGHT);
      expect(getGiftWeight(rareGift)).toBe(DEFAULT_RARE_GIFT_WEIGHT);
      expect(getGiftWeight(rareGift)).toBeLessThan(getGiftWeight(commonGift));
    });

    it('getGiftIconBgClass がレアリティに応じて金色または白色の背景クラスを返すこと', () => {
      expect(getGiftIconBgClass('rare')).toContain('from-amber-200');
      expect(getGiftIconBgClass('rare')).toContain('border-amber-400');
      expect(getGiftIconBgClass('common')).toContain('bg-white');
      expect(getGiftIconBgClass(undefined)).toContain('bg-white');
    });
  });

  describe('getGiftById', () => {
    it('存在するIDでギフト情報が取得できること', () => {
      const gift = getGiftById('pebble');
      expect(gift?.name).toBe('きれいな小石');
    });

    it('存在しないIDの場合は undefined が返ること', () => {
      const gift = getGiftById('unknown-item');
      expect(gift).toBeUndefined();
    });
  });

  describe('pickRandomGift', () => {
    it('randomFn に応じて指定したギフトが選出されること', () => {
      // randomFn が 0 のときは先頭アイテム（pebble: きれいな小石）
      const item0 = pickRandomGift(CAT_GIFTS, () => 0.0);
      expect(item0.id).toBe('pebble');

      // randomFn が 0.999 のときは最後のアイテム（dragon-claw: りゅうの爪）
      const itemLast = pickRandomGift(CAT_GIFTS, () => 0.999);
      expect(itemLast.id).toBe('dragon-claw');
    });

    it('カタログが空の場合はデフォルトギフトを返すこと', () => {
      const gift = pickRandomGift([], () => 0.5);
      expect(gift).toEqual(DEFAULT_GIFT);
    });
  });

  describe('addGiftToInventory', () => {
    it('空のインベントリに新しいギフトを追加すると count が 1 になり、猫別カウントや受取日時が記録されること', () => {
      const initial: GiftInventory = {};
      const updated = addGiftToInventory(initial, 'pebble', 'black', 1000);

      expect(updated.pebble).toBeDefined();
      expect(updated.pebble.count).toBe(1);
      expect(updated.pebble.byCat?.black).toBe(1);
      expect(updated.pebble.firstReceivedAt).toBe(1000);
      expect(updated.pebble.lastReceivedAt).toBe(1000);
    });

    it('同じギフトを追加すると count が加算され、猫別カウントも更新されること', () => {
      const initial: GiftInventory = {
        pebble: {
          giftId: 'pebble',
          count: 1,
          byCat: { black: 1 },
          firstReceivedAt: 1000,
          lastReceivedAt: 1000,
        },
      };

      const updated = addGiftToInventory(initial, 'pebble', 'white', 2000);

      expect(updated.pebble.count).toBe(2);
      expect(updated.pebble.byCat?.black).toBe(1);
      expect(updated.pebble.byCat?.white).toBe(1);
      expect(updated.pebble.firstReceivedAt).toBe(1000); // 初回日時は維持
      expect(updated.pebble.lastReceivedAt).toBe(2000); // 最終日時は更新
    });

    it('異なるギフトを追加した際、他のギフト情報が失われないこと（イミュータブル性）', () => {
      const initial: GiftInventory = {
        pebble: {
          giftId: 'pebble',
          count: 2,
          byCat: { black: 2 },
          firstReceivedAt: 1000,
          lastReceivedAt: 1500,
        },
      };

      const updated = addGiftToInventory(initial, 'feather', 'calico', 3000);

      expect(updated.pebble.count).toBe(2);
      expect(updated.feather.count).toBe(1);
      expect(updated.feather.byCat?.calico).toBe(1);
      expect(initial.feather).toBeUndefined(); // 元オブジェクトは不変
    });
  });

  describe('getGiftCount & getTotalGiftCount', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 3,
        firstReceivedAt: 1000,
        lastReceivedAt: 2000,
      },
      feather: {
        giftId: 'feather',
        count: 2,
        firstReceivedAt: 1000,
        lastReceivedAt: 2000,
      },
    };

    it('指定したギフトの個数を正しく取得できること', () => {
      expect(getGiftCount(inventory, 'pebble')).toBe(3);
      expect(getGiftCount(inventory, 'feather')).toBe(2);
      expect(getGiftCount(inventory, 'unknown')).toBe(0);
    });

    it('全体の合計個数を正しく計算できること', () => {
      expect(getTotalGiftCount(inventory)).toBe(5);
      expect(getTotalGiftCount({})).toBe(0);
    });
  });

  describe('sanitizeGiftInventory', () => {
    it('正常なオブジェクトをそのままサニタイズできること', () => {
      const raw = {
        pebble: {
          giftId: 'pebble',
          count: 5,
          byCat: { black: 3, white: 2 },
          firstReceivedAt: 1234,
          lastReceivedAt: 5678,
        },
      };

      const sanitized = sanitizeGiftInventory(raw);
      expect(sanitized.pebble.count).toBe(5);
      expect(sanitized.pebble.byCat?.black).toBe(3);
      expect(sanitized.pebble.firstReceivedAt).toBe(1234);
    });

    it('破損データや不正な型が混ざっていても空または安全な初期値で復帰すること', () => {
      expect(sanitizeGiftInventory(null)).toEqual({});
      expect(sanitizeGiftInventory('broken string')).toEqual({});
      expect(sanitizeGiftInventory([1, 2, 3])).toEqual({});

      const broken = {
        pebble: {
          count: 'invalid',
          firstReceivedAt: null,
          byCat: 'invalid',
        },
      };
      const sanitized = sanitizeGiftInventory(broken);
      expect(sanitized.pebble).toBeDefined();
      expect(sanitized.pebble.count).toBe(0);
      expect(sanitized.pebble.byCat).toEqual({});
    });
  });

  describe('getAcquiredGiftTypeCount (収集種類数の計算純粋関数)', () => {
    it('インベントリが空のときは0種類であること', () => {
      expect(getAcquiredGiftTypeCount({})).toBe(0);
    });

    it('同じおくりものを複数個受け取っていても種類数としては1とカウントされること', () => {
      const inventory: GiftInventory = {
        pebble: {
          giftId: 'pebble',
          count: 10,
          firstReceivedAt: 1000,
          lastReceivedAt: 2000,
        },
      };
      expect(getAcquiredGiftTypeCount(inventory)).toBe(1);
    });

    it('複数種類のおくりものを受け取っている場合、正確に受け取り済み種類数を算出すること', () => {
      const inventory: GiftInventory = {
        pebble: { giftId: 'pebble', count: 3, firstReceivedAt: 1000, lastReceivedAt: 2000 },
        feather: { giftId: 'feather', count: 1, firstReceivedAt: 1100, lastReceivedAt: 1100 },
        'old-coin': { giftId: 'old-coin', count: 2, firstReceivedAt: 1200, lastReceivedAt: 1300 },
        acorn: { giftId: 'acorn', count: 0, firstReceivedAt: 1400, lastReceivedAt: 1400 }, // count 0は未収集
      };
      expect(getAcquiredGiftTypeCount(inventory)).toBe(3);
    });

    it('将来おくりものの数が増加した場合でも、指定したカタログに連動して正確に種類数を算出できること', () => {
      const customCatalog = [
        { id: 'item-1', name: 'アイテム1', description: '説明', icon: '🎁', iconType: 'pebble', themeClass: '', rarity: 'common' as const },
        { id: 'item-2', name: 'アイテム2', description: '説明', icon: '🎁', iconType: 'feather', themeClass: '', rarity: 'common' as const },
        { id: 'item-3', name: 'アイテム3', description: '説明', icon: '🎁', iconType: 'acorn', themeClass: '', rarity: 'rare' as const },
      ];

      const inventory: GiftInventory = {
        'item-1': { giftId: 'item-1', count: 5, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        'item-3': { giftId: 'item-3', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
      };

      // 3種類中2種類収集済み
      expect(getAcquiredGiftTypeCount(inventory, customCatalog)).toBe(2);
    });
  });
});
