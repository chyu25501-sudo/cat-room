import { useState, useCallback, useEffect, useRef } from 'react';
import { CatId } from '../types/cat.ts';
import { GiftId, GiftItem, GiftInventory } from '../types/gift.ts';
import {
  CAT_GIFTS,
  pickRandomGift,
  addGiftToInventory,
  getGiftCount as getGiftCountUtil,
  getTotalGiftCount as getTotalGiftCountUtil,
  sanitizeGiftInventory,
} from '../utils/catGifts.ts';

export const GIFT_STORAGE_KEY = 'nekoppoi_cat_gifts';

export interface UseCatGiftsOptions {
  /** ギフトのカタログリスト（デフォルト: CAT_GIFTS） */
  catalog?: readonly GiftItem[];
  /** 乱数生成関数（テスト用） */
  randomFn?: () => number;
}

export interface UseCatGiftsResult {
  /** 現在の贈り物インベントリ */
  inventory: GiftInventory;
  /**
   * 猫から贈り物を受け取り、インベントリに加算して記録する関数
   * @param catId 贈り物をくれた猫のID
   * @param specificGift 指定のギフト（未指定時はカタログからランダム選出）
   * @returns 受け取ったGiftItem
   */
  receiveGift: (catId: CatId, specificGift?: GiftItem) => GiftItem;
  /** 指定したギフトの累計受取個数を取得 */
  getGiftCount: (giftId: GiftId) => number;
  /** 全ギフトの合計受取個数を取得 */
  getTotalGiftCount: () => number;
  /** インベントリを初期状態（空）にリセット */
  resetInventory: () => void;
}

/**
 * 猫から貰える「おくりもの」のインベントリと受取を管理するカスタムフック
 * localStorage への永続化と、受取個数・猫別の履歴管理を提供します。
 */
export function useCatGifts(options: UseCatGiftsOptions = {}): UseCatGiftsResult {
  const { catalog = CAT_GIFTS, randomFn = Math.random } = options;

  const [inventory, setInventory] = useState<GiftInventory>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(GIFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return sanitizeGiftInventory(parsed);
        }
      }
    } catch {
      // JSONパース失敗時は安全に空でフォールバック
    }
    return {};
  });

  const inventoryRef = useRef(inventory);
  useEffect(() => {
    inventoryRef.current = inventory;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(GIFT_STORAGE_KEY, JSON.stringify(inventory));
      }
    } catch {
      // クォータ超過等のストレージエラーを安全に無視
    }
  }, [inventory]);

  const receiveGift = useCallback(
    (catId: CatId, specificGift?: GiftItem): GiftItem => {
      const gift = specificGift ?? pickRandomGift(catalog, randomFn);
      setInventory((prev) => addGiftToInventory(prev, gift.id, catId));
      return gift;
    },
    [catalog, randomFn]
  );

  const getGiftCount = useCallback(
    (giftId: GiftId): number => {
      return getGiftCountUtil(inventory, giftId);
    },
    [inventory]
  );

  const getTotalGiftCount = useCallback((): number => {
    return getTotalGiftCountUtil(inventory);
  }, [inventory]);

  const resetInventory = useCallback(() => {
    setInventory({});
  }, []);

  return {
    inventory,
    receiveGift,
    getGiftCount,
    getTotalGiftCount,
    resetInventory,
  };
}
