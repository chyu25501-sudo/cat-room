import { GiftId, GiftItem, GiftRecord, GiftInventory, GiftRarity } from '../types/gift.ts';
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
    description: '草むらの中から摘んできた、青々とした三つ葉のクローバー。',
    icon: '☘️',
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
  {
    id: 'mossy-pebble',
    name: 'こけむした小石',
    description: '湿った日陰で見つけてきた、うっすらと緑の苔が生えた丸い小石。',
    icon: '🪨',
    iconType: 'mossy-pebble',
    themeClass: 'from-emerald-100 to-stone-200 border-emerald-300 text-stone-700',
    rarity: 'common',
  },
  {
    id: 'old-stamp',
    name: 'ふるい切手',
    description: 'どこかの引き出しの奥から見つけてきた、ギザギザの縁取りがあるレトロな切手。',
    icon: '📮',
    iconType: 'old-stamp',
    themeClass: 'from-amber-50 to-orange-100 border-orange-300 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'hairpin',
    name: 'かわいいヘアピン',
    description: 'お部屋のすみに落ちていた、小さなお花の飾りがついたかわいいヘアピン。',
    icon: '🌸',
    iconType: 'hairpin',
    themeClass: 'from-pink-100 to-rose-100 border-pink-300 text-pink-700',
    rarity: 'common',
  },
  {
    id: 'wilted-flower',
    name: 'しおれた野花',
    description: '道端から摘んできた、少し首をかしげてしおれた素朴で小さなお花。',
    icon: '🥀',
    iconType: 'wilted-flower',
    themeClass: 'from-amber-100 to-yellow-100 border-yellow-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'cicada-shell',
    name: 'せみのぬけがら',
    description: '庭の木の幹にくっついていた、琥珀色に透き通った夏のセミの抜け殻。',
    icon: '🪵',
    iconType: 'cicada-shell',
    themeClass: 'from-amber-100 to-yellow-200 border-amber-300 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'white-dice',
    name: 'しろいサイコロ',
    description: '箱のすき間から転がり出てきた、角の取れたつるつると白いサイコロ。',
    icon: '🎲',
    iconType: 'white-dice',
    themeClass: 'from-slate-100 to-stone-100 border-stone-300 text-stone-800',
    rarity: 'common',
  },
  {
    id: 'glass-marble',
    name: 'きらきらしたおはじき',
    description: '光にかざすときらきらと輝く、平たくて丸いガラスのおはじき。',
    icon: '🔮',
    iconType: 'glass-marble',
    themeClass: 'from-sky-100 via-teal-100 to-blue-100 border-cyan-300 text-cyan-800',
    rarity: 'common',
  },
  {
    id: 'dirty-plush',
    name: 'よごれたぬいぐるみ',
    description: 'ずっとくわえて遊んでいたのか、少し土がついて愛着のわく小さなぬいぐるみ。',
    icon: '🧸',
    iconType: 'dirty-plush',
    themeClass: 'from-amber-100 to-stone-200 border-amber-300 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'single-sock',
    name: 'かたっぽの靴下',
    description: '洗濯カゴから引っ張り出してきた、しましま模様の片方だけの小さな靴下。',
    icon: '🧦',
    iconType: 'single-sock',
    themeClass: 'from-indigo-100 to-sky-100 border-indigo-300 text-indigo-700',
    rarity: 'common',
  },
  {
    id: 'sunflower-seed',
    name: 'ひまわりの種',
    description: 'どこからか一粒だけくわえてきた、白黒のしま模様があるひまわりの種。',
    icon: '🌻',
    iconType: 'sunflower-seed',
    themeClass: 'from-stone-200 to-amber-100 border-stone-400 text-stone-800',
    rarity: 'common',
  },
  {
    id: 'old-coin',
    name: 'ふしぎな古銭',
    description: 'どこかの古い蔵や床下で見つけてきたのか、不思議な文字が刻まれた丸い古銭。',
    icon: '🪙',
    iconType: 'old-coin',
    themeClass: 'from-amber-200 to-yellow-300 border-amber-400 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'rainbow-feather',
    name: 'なないろの羽根',
    description: '光に透かすと虹色にきらめく、伝説の鳥が落としていったような奇跡の羽根。',
    icon: '🪶',
    iconType: 'rainbow-feather',
    themeClass: 'from-pink-200 via-sky-200 to-amber-200 border-purple-300 text-purple-900',
    rarity: 'rare',
  },
  {
    id: 'four-leaf-clover',
    name: 'よつばのクローバー',
    description: '草むらの中で奇跡的に見つけた、特別な幸運をもたらす四つ葉のクローバー。',
    icon: '🍀',
    iconType: 'four-leaf-clover',
    themeClass: 'from-emerald-200 to-green-300 border-emerald-400 text-emerald-900',
    rarity: 'rare',
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

/** 通常アイテムの抽選重み（デフォルト） */
export const DEFAULT_COMMON_GIFT_WEIGHT = 10;

/** レアアイテムの抽選重み（通常の1/5の確率、出にくく希少） */
export const DEFAULT_RARE_GIFT_WEIGHT = 2;

/**
 * ギフトの抽選確率計算用重みを取得する純粋関数
 */
export function getGiftWeight(gift: GiftItem): number {
  if (typeof gift.weight === 'number' && gift.weight > 0) {
    return gift.weight;
  }
  return gift.rarity === 'rare' ? DEFAULT_RARE_GIFT_WEIGHT : DEFAULT_COMMON_GIFT_WEIGHT;
}

/**
 * ギフトのレアリティに応じたアイコン背景Tailwindクラスを返す純粋関数
 * レアリティの高いおくりものは金色、通常のおくりものは白色
 */
export function getGiftIconBgClass(rarity?: GiftRarity): string {
  if (rarity === 'rare') {
    return 'bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 border-amber-400 text-amber-900 shadow-amber-200/60';
  }
  return 'bg-white border-orange-200 text-stone-700';
}

/**
 * ギフト一覧から確率（レアリティ重み）に応じて1つ選出する純粋関数
 * レアアイテムは通常のアイテムと比べて出現確率が低くなります。
 * テスト容易性のために randomFn を注入可能（デフォルト: Math.random）
 */
export function pickRandomGift(
  catalog: readonly GiftItem[] = CAT_GIFTS,
  randomFn: () => number = Math.random
): GiftItem {
  if (catalog.length === 0) {
    return DEFAULT_GIFT;
  }

  const totalWeight = catalog.reduce((sum, item) => sum + getGiftWeight(item), 0);
  if (totalWeight <= 0) {
    return catalog[0] ?? DEFAULT_GIFT;
  }

  // 0 <= rand < totalWeight
  const randVal = Math.max(0, Math.min(0.9999999, randomFn()));
  const rand = randVal * totalWeight;

  let cumulative = 0;
  for (const item of catalog) {
    cumulative += getGiftWeight(item);
    if (rand < cumulative) {
      return item;
    }
  }

  return catalog[catalog.length - 1] ?? DEFAULT_GIFT;
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
