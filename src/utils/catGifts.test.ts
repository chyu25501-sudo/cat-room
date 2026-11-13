import { describe, it, expect } from 'vitest';
import {
  CAT_GIFTS,
  DEFAULT_GIFT,
  getGiftById,
  pickRandomGift,
  addGiftToInventory,
  getGiftCount,
  getTotalGiftCount,
  sanitizeGiftInventory,
} from './catGifts.ts';
import { GiftInventory } from '../types/gift.ts';

describe('catGifts utils (おくりもの計算・インベントリ管理ロジック)', () => {
  describe('CAT_GIFTS 定数', () => {
    it('合計10種類のおくりものが定義されており、すべて「ひらがな形容詞＋名詞」の命名規則に従っていること', () => {
      expect(CAT_GIFTS.length).toBe(10);

      const expectedIds = [
        'pebble',
        'feather',
        'acorn',
        'twig',
        'seashell',
        'fallen-leaf',
        'pinecone',
        'clover',
        'ribbon',
        'button',
      ];
      expectedIds.forEach((id) => {
        const gift = CAT_GIFTS.find((g) => g.id === id);
        expect(gift).toBeDefined();
        expect(gift?.name).toBeTruthy();
        expect(gift?.description).toBeTruthy();
      });

      // 命名規則の検証: 先頭がひらがなの形容詞・連体修飾語（きれいな、ふわふわの、まるい、ほそい、ちいさな、あかい、おおきな、みどりの、ながい、ひかる等）
      const hiraganaPrefixPattern = /^(きれいな|ふわふわの|まるい|ほそい|ちいさな|あかい|おおきな|みどりの|ながい|ひかる)/;
      CAT_GIFTS.forEach((gift) => {
        expect(gift.name).toMatch(hiraganaPrefixPattern);
      });
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
      // randomFn が 0 のときは先頭アイテム（pebble）
      const item0 = pickRandomGift(CAT_GIFTS, () => 0.0);
      expect(item0.id).toBe('pebble');

      // randomFn が 0.99 のときは最後のアイテム（button）
      const item1 = pickRandomGift(CAT_GIFTS, () => 0.99);
      expect(item1.id).toBe('button');
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
});
