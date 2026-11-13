import { GiftId, GiftItem, GiftRecord, GiftInventory } from '../types/gift.ts';
import { CatId } from '../types/cat.ts';

/**
 * 猫から貰えるおくりもののマスターデータリスト
 * 今後贈り物を増やす際はこの配列に追加するだけで拡張可能です。
 */
export const CAT_GIFTS: readonly GiftItem[] = [
  {
    id: 'pebble',
    name: 'きれいな小石',
    description: 'どこかで見つけてきた、つるつると丸くてきれいな小石。',
    icon: '🪨',
    iconType: 'pebble',
    themeClass: 'from-amber-100 to-stone-200 border-stone-300 text-stone-700',
    rarity: 'common',
  },
  {
    id: 'feather',
    name: 'ふわふわの羽根',
    description: '日向で見つけてくわえてきた、やわらかく軽やかな羽根。',
    icon: '🪶',
    iconType: 'feather',
    themeClass: 'from-sky-100 to-indigo-100 border-sky-300 text-sky-700',
    rarity: 'common',
  },
] as const;

/** デフォルトのフォールバック用ギフト（万が一の未登録時） */
export const DEFAULT_GIFT: GiftItem = CAT_GIFTS[0];

/**
 * ギフトIDからギフト定義情報を取得する純粋関数
 */
export function getGiftById(
  giftId: string,
  catalog: readonly GiftItem[] = CAT_GIFTS
): GiftItem | undefined {
  return catalog.find((g) => g.id === giftId);
}

/**
 * ギフト一覧からランダムで1つ選出する純粋関数
 * テスト容易性のために randomFn を注入可能（デフォルト: Math.random）
 */
export function pickRandomGift(
  catalog: readonly GiftItem[] = CAT_GIFTS,
  randomFn: () => number = Math.random
): GiftItem {
  if (catalog.length === 0) {
    return DEFAULT_GIFT;
  }
  const index = Math.floor(randomFn() * catalog.length);
  const clampedIndex = Math.max(0, Math.min(catalog.length - 1, index));
  return catalog[clampedIndex] ?? DEFAULT_GIFT;
}

/**
 * インベントリに新しいギフトの受取を記録する純粋関数（イミュータブルに更新）
 *
 * @param inventory 現在のインベントリ
 * @param giftId 受け取ったギフトID
 * @param catId プレゼントしてくれた猫のID
 * @param timestamp 受取時刻（UNIXタイムスタンプ、未指定時はDate.now()）
 * @returns 更新された新しいGiftInventoryオブジェクト
 */
export function addGiftToInventory(
  inventory: GiftInventory,
  giftId: GiftId,
  catId: CatId,
  timestamp: number = Date.now()
): GiftInventory {
  const existingRecord = inventory[giftId];
  const currentCount = existingRecord ? existingRecord.count : 0;
  const firstReceivedAt = existingRecord ? existingRecord.firstReceivedAt : timestamp;
  const existingByCat = existingRecord?.byCat ?? {};
  const currentCatCount = existingByCat[catId] ?? 0;

  const updatedRecord: GiftRecord = {
    giftId,
    count: currentCount + 1,
    byCat: {
      ...existingByCat,
      [catId]: currentCatCount + 1,
    },
    firstReceivedAt,
    lastReceivedAt: timestamp,
  };

  return {
    ...inventory,
    [giftId]: updatedRecord,
  };
}

/**
 * 指定したギフトの累計受取個数を取得する純粋関数
 */
export function getGiftCount(inventory: GiftInventory, giftId: GiftId): number {
  return inventory[giftId]?.count ?? 0;
}

/**
 * 全ギフトの合計受取個数を計算する純粋関数
 */
export function getTotalGiftCount(inventory: GiftInventory): number {
  return Object.values(inventory).reduce((sum, record) => sum + (record.count || 0), 0);
}

/**
 * localStorage から読み込んだ不明なデータを安全な GiftInventory にサニタイズする純粋関数
 * 壊れたデータや古いバージョンからのデータでも安全に復帰します
 */
export function sanitizeGiftInventory(raw: unknown): GiftInventory {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const result: GiftInventory = {};
  const obj = raw as Record<string, unknown>;

  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const rec = val as Record<string, unknown>;
      const count = typeof rec.count === 'number' && Number.isFinite(rec.count) ? Math.max(0, rec.count) : 0;
      const firstReceivedAt =
        typeof rec.firstReceivedAt === 'number' && Number.isFinite(rec.firstReceivedAt)
          ? rec.firstReceivedAt
          : Date.now();
      const lastReceivedAt =
        typeof rec.lastReceivedAt === 'number' && Number.isFinite(rec.lastReceivedAt)
          ? rec.lastReceivedAt
          : firstReceivedAt;

      const byCat: Partial<Record<CatId, number>> = {};
      if (rec.byCat && typeof rec.byCat === 'object' && !Array.isArray(rec.byCat)) {
        for (const [cId, cCount] of Object.entries(rec.byCat as Record<string, unknown>)) {
          if (typeof cCount === 'number' && Number.isFinite(cCount)) {
            byCat[cId as CatId] = Math.max(0, cCount);
          }
        }
      }

      result[key] = {
        giftId: key,
        count,
        byCat,
        firstReceivedAt,
        lastReceivedAt,
      };
    }
  }

  return result;
}
