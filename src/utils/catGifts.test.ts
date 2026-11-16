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
  DEFAULT_SUPER_RARE_GIFT_WEIGHT,
  DEFAULT_ULTRA_RARE_GIFT_WEIGHT,
  getGiftRarityLabel,
  getAvailableRarities,
  GIFT_RARITY_METAS,
  filterGifts,
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
        // 【レア】日常の珍品・古代・伝説 (6)
        'important-paper',
        'winning-ice-stick',
        'old-coin',
        'splendid-branch',
        'glowing-moss-stone',
        'curious-magatama',
        // 【スーパーレア】宝石・天体・奇跡の幸運・竜の遺物 (6)
        'four-leaf-clover',
        'red-gem',
        'blue-gem',
        'yellow-gem',
        'star-fragment',
        'dragon-scale',
        // 【ウルトラレア】伝説・古代の遺物・神話 (3)
        'rainbow-feather',
        'ancient-gear',
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

    it('レアリティごとに並んでいること（通常45種、レア6種、スーパーレア6種、ウルトラレア3種）', () => {
      const commonGifts = CAT_GIFTS.slice(0, 45);
      const rareGifts = CAT_GIFTS.slice(45, 51);
      const superRareGifts = CAT_GIFTS.slice(51, 57);
      const ultraRareGifts = CAT_GIFTS.slice(57, 60);

      expect(commonGifts.length).toBe(45);
      expect(rareGifts.length).toBe(6);
      expect(superRareGifts.length).toBe(6);
      expect(ultraRareGifts.length).toBe(3);

      commonGifts.forEach((gift) => {
        expect(gift.rarity).toBe('common');
      });

      rareGifts.forEach((gift) => {
        expect(gift.rarity).toBe('rare');
      });

      superRareGifts.forEach((gift) => {
        expect(gift.rarity).toBe('super-rare');
      });

      ultraRareGifts.forEach((gift) => {
        expect(gift.rarity).toBe('ultra-rare');
      });

      // スーパーレアに指定された6種
      expect(superRareGifts.map((g) => g.id)).toEqual([
        'four-leaf-clover',
        'red-gem',
        'blue-gem',
        'yellow-gem',
        'star-fragment',
        'dragon-scale',
      ]);

      // ウルトラレアに指定された3種
      expect(ultraRareGifts.map((g) => g.id)).toEqual([
        'rainbow-feather',
        'ancient-gear',
        'dragon-claw',
      ]);
    });
  });

  describe('レアリティと重み計算 (getGiftWeight & getGiftIconBgClass)', () => {
    it('レアリティごとに重みが設定され、common > rare > super-rare > ultra-rare の順に出現率が低くなること', () => {
      expect(DEFAULT_RARE_GIFT_WEIGHT).toBeLessThan(DEFAULT_COMMON_GIFT_WEIGHT);
      expect(DEFAULT_SUPER_RARE_GIFT_WEIGHT).toBeLessThan(DEFAULT_RARE_GIFT_WEIGHT);
      expect(DEFAULT_ULTRA_RARE_GIFT_WEIGHT).toBeLessThan(DEFAULT_SUPER_RARE_GIFT_WEIGHT);

      const commonGift = CAT_GIFTS.find((g) => g.id === 'pebble')!;
      const rareGift = CAT_GIFTS.find((g) => g.id === 'old-coin')!;
      const superRareGift = CAT_GIFTS.find((g) => g.id === 'four-leaf-clover')!;
      const ultraRareGift = CAT_GIFTS.find((g) => g.id === 'rainbow-feather')!;

      expect(getGiftWeight(commonGift)).toBe(DEFAULT_COMMON_GIFT_WEIGHT);
      expect(getGiftWeight(rareGift)).toBe(DEFAULT_RARE_GIFT_WEIGHT);
      expect(getGiftWeight(superRareGift)).toBe(DEFAULT_SUPER_RARE_GIFT_WEIGHT);
      expect(getGiftWeight(ultraRareGift)).toBe(DEFAULT_ULTRA_RARE_GIFT_WEIGHT);
    });

    it('getGiftIconBgClass がレアリティに応じて適切な背景クラスを返し、SR・URは白でも金でもないこと', () => {
      // 通常: 白色
      expect(getGiftIconBgClass('common')).toContain('bg-white');
      expect(getGiftIconBgClass(undefined)).toContain('bg-white');

      // レア: 金色
      expect(getGiftIconBgClass('rare')).toContain('from-amber-200');
      expect(getGiftIconBgClass('rare')).toContain('border-amber-400');

      // スーパーレア: 紫色（白でも金でもない）
      const srBg = getGiftIconBgClass('super-rare');
      expect(srBg).toContain('from-purple-300');
      expect(srBg).toContain('border-purple-400');
      expect(srBg).not.toContain('bg-white');
      expect(srBg).not.toContain('amber');

      // ウルトラレア: オーロラ/虹色（白でも金でもない）
      const urBg = getGiftIconBgClass('ultra-rare');
      expect(urBg).toContain('from-cyan-300');
      expect(urBg).toContain('border-fuchsia-400');
      expect(urBg).not.toContain('bg-white');
      expect(urBg).not.toContain('amber');
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

  describe('レアリティ絞り込み・表示純粋関数 (getGiftRarityLabel & getAvailableRarities)', () => {
    it('getGiftRarityLabel が既知のレアリティに対応する日本語ラベルを返し、未登録時はフォールバックすること', () => {
      expect(getGiftRarityLabel('common')).toBe('通常');
      expect(getGiftRarityLabel('rare')).toBe('レア');
      expect(getGiftRarityLabel('super-rare')).toBe('スーパーレア');
      expect(getGiftRarityLabel('ultra-rare')).toBe('ウルトラレア');
      expect(getGiftRarityLabel(undefined)).toBe('通常');
      // 将来の未登録レアリティでも安全にフォールバックすること
      expect(getGiftRarityLabel('legendary')).toBe('legendary');
    });

    it('getAvailableRarities がカタログ内に存在するユニークなレアリティ一覧を順番通りに返すこと', () => {
      // デフォルトカタログには common, rare, super-rare, ultra-rare が存在
      const rarities = getAvailableRarities(CAT_GIFTS);
      expect(rarities).toEqual(['common', 'rare', 'super-rare', 'ultra-rare']);

      // 将来新しいレアリティが追加されたカスタムカタログの場合
      const extendedCatalog = [
        { id: 'item-1', name: 'アイテム1', description: '説明', icon: '🎁', iconType: 'pebble', themeClass: '', rarity: 'common' as const },
        { id: 'item-2', name: 'アイテム2', description: '説明', icon: '🎁', iconType: 'feather', themeClass: '', rarity: 'rare' as const },
        { id: 'item-3', name: 'アイテム3', description: '説明', icon: '🎁', iconType: 'acorn', themeClass: '', rarity: 'super-rare' as const },
        { id: 'item-4', name: 'アイテム4', description: '説明', icon: '🎁', iconType: 'twig', themeClass: '', rarity: 'legendary' as const },
      ];

      const extendedRarities = getAvailableRarities(extendedCatalog);
      expect(extendedRarities).toEqual(['common', 'rare', 'super-rare', 'legendary']);
    });
  });

  describe('filterGifts (レアリティと入手状況によるカタログ絞り込み純粋関数)', () => {
    const sampleCatalog = [
      { id: 'item-common-1', name: '通常1', description: '', icon: '🎁', iconType: 'pebble', themeClass: '', rarity: 'common' as const },
      { id: 'item-common-2', name: '通常2', description: '', icon: '🎁', iconType: 'feather', themeClass: '', rarity: 'common' as const },
      { id: 'item-rare-1', name: 'レア1', description: '', icon: '🎁', iconType: 'acorn', themeClass: '', rarity: 'rare' as const },
      { id: 'item-super-1', name: 'スーパー1', description: '', icon: '🎁', iconType: 'twig', themeClass: '', rarity: 'super-rare' as const },
    ];

    const inventory: GiftInventory = {
      'item-common-1': { giftId: 'item-common-1', count: 2, firstReceivedAt: 1000, lastReceivedAt: 1000 },
      'item-rare-1': { giftId: 'item-rare-1', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
    };

    it('オプション無指定または all のときは全件返すこと', () => {
      expect(filterGifts(sampleCatalog, inventory)).toHaveLength(4);
      expect(filterGifts(sampleCatalog, inventory, { rarity: 'all', acquisition: 'all' })).toHaveLength(4);
    });

    it('レアリティ単独での絞り込みが機能すること', () => {
      const commonOnly = filterGifts(sampleCatalog, inventory, { rarity: 'common' });
      expect(commonOnly.map((g) => g.id)).toEqual(['item-common-1', 'item-common-2']);

      const rareOnly = filterGifts(sampleCatalog, inventory, { rarity: 'rare' });
      expect(rareOnly.map((g) => g.id)).toEqual(['item-rare-1']);
    });

    it('入手状況（acquisition: "acquired"）単独での絞り込みが機能すること', () => {
      const acquiredOnly = filterGifts(sampleCatalog, inventory, { acquisition: 'acquired' });
      expect(acquiredOnly.map((g) => g.id)).toEqual(['item-common-1', 'item-rare-1']);
    });

    it('レアリティと入手状況の組み合わせ（掛け合わせ）絞り込みが機能すること', () => {
      // common かつ acquired -> item-common-1 のみ
      const commonAcquired = filterGifts(sampleCatalog, inventory, {
        rarity: 'common',
        acquisition: 'acquired',
      });
      expect(commonAcquired.map((g) => g.id)).toEqual(['item-common-1']);

      // super-rare かつ acquired -> 未入手なので空配列
      const superAcquired = filterGifts(sampleCatalog, inventory, {
        rarity: 'super-rare',
        acquisition: 'acquired',
      });
      expect(superAcquired).toEqual([]);
    });
  });
});
