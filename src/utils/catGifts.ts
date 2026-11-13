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
  {
    id: 'acorn',
    name: 'まるいどんぐり',
    description: '森の木陰で見つけてきた、つやつやと丸い秋のどんぐり。',
    icon: '🌰',
    iconType: 'acorn',
    themeClass: 'from-amber-100 to-amber-200 border-amber-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'twig',
    name: 'ほそい小枝',
    description: 'お庭の植え込みから折ってくわえてきた、香りのいい小枝。',
    icon: '🌿',
    iconType: 'twig',
    themeClass: 'from-lime-100 to-emerald-100 border-lime-300 text-emerald-800',
    rarity: 'common',
  },
  {
    id: 'seashell',
    name: 'ちいさな貝殻',
    description: 'どこかで見つけてきた、うっすらピンク色のかわいい貝殻。',
    icon: '🐚',
    iconType: 'seashell',
    themeClass: 'from-rose-100 to-pink-100 border-pink-300 text-rose-700',
    rarity: 'common',
  },
  {
    id: 'fallen-leaf',
    name: 'あかい落ち葉',
    description: 'ひらひらと風に舞っていた、鮮やかな赤色のもみじの葉。',
    icon: '🍁',
    iconType: 'fallen-leaf',
    themeClass: 'from-orange-100 to-red-100 border-red-300 text-red-700',
    rarity: 'common',
  },
  {
    id: 'pinecone',
    name: 'おおきな松ぼっくり',
    description: '公園の松の木の下で見つけた、笠の開いた立派な松ぼっくり。',
    icon: '🌲',
    iconType: 'pinecone',
    themeClass: 'from-amber-100 to-stone-200 border-amber-400 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'clover',
    name: 'みどりのクローバー',
    description: '草むらの中から摘んできた、青々とした四つ葉のクローバー。',
    icon: '🍀',
    iconType: 'clover',
    themeClass: 'from-emerald-100 to-green-100 border-emerald-300 text-emerald-700',
    rarity: 'common',
  },
  {
    id: 'ribbon',
    name: 'ながいリボン',
    description: '部屋のすみに落ちていた、さらさらと光沢のある細長いリボン。',
    icon: '🎀',
    iconType: 'ribbon',
    themeClass: 'from-pink-100 to-fuchsia-100 border-pink-300 text-pink-700',
    rarity: 'common',
  },
  {
    id: 'button',
    name: 'ひかるボタン',
    description: '床のすみに転がっていた、光を受けてきらりと輝く小さなボタン。',
    icon: '🔘',
    iconType: 'button',
    themeClass: 'from-cyan-100 to-blue-100 border-blue-300 text-cyan-800',
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
