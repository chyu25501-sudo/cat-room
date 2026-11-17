import { CatId } from '../types/cat.ts';
import { GiftItem, GiftInventory } from '../types/gift.ts';
import { CareStats } from '../types/journal.ts';
import {
  MAX_AFFECTION_LEVEL,
  calculateAffectionGain,
  FOOD_AFFECTION_EXP_MAP,
} from './catAffection.ts';
import {
  CAT_GIFTS,
  pickRandomGift,
  addGiftToInventory,
} from './catGifts.ts';
import {
  MIN_FULLNESS_SCORE,
  MAX_FULLNESS_SCORE,
  DEFAULT_FULLNESS_DECAY_PER_MINUTE,
} from './catFullness.ts';
import { FOOD_ITEMS } from './catCare.ts';

/** 自動ごはんの給餌トリガーとなるまんぷく度閾値（40%以下で給餌） */
export const AUTO_FEED_THRESHOLD_FULLNESS = 40;

/** 自動ごはんで給餌するデフォルトフードID（カリカリ固定） */
export const AUTO_FEED_FOOD_ID = 'kibble';

/** カリカリのまんぷく度上昇量（25pt） */
export const AUTO_FEED_FOOD_FULLNESS_BOOST =
  FOOD_ITEMS.find((f) => f.id === AUTO_FEED_FOOD_ID)?.fullnessBoost ?? 25;

/** カリカリ1回あたりの獲得Exp（25 Exp） */
export const AUTO_FEED_FOOD_EXP =
  FOOD_AFFECTION_EXP_MAP[AUTO_FEED_FOOD_ID] ?? 25;

/**
 * 40%でカリカリを食べた後のまんぷく度スコア（40 + 25 = 65%）
 */
export const AUTO_FEED_RECOVERED_FULLNESS =
  AUTO_FEED_THRESHOLD_FULLNESS + AUTO_FEED_FOOD_FULLNESS_BOOST;

/**
 * 自動ごはんの1サイクルあたりの所要時間（分）
 * 65%から40%に減衰するまでに必要な時間（毎分1pt減衰で25分）
 */
export const AUTO_FEED_CYCLE_MINUTES = Math.round(
  AUTO_FEED_FOOD_FULLNESS_BOOST / DEFAULT_FULLNESS_DECAY_PER_MINUTE
);

/** 留守中（オフライン放置）の最大シミュレーション日数（7日間） */
export const AUTO_FEED_MAX_OFFLINE_DAYS = 7;

/** 留守中の最大シミュレーション時間（ミリ秒: 7日間分） */
export const AUTO_FEED_MAX_OFFLINE_MS =
  AUTO_FEED_MAX_OFFLINE_DAYS * 24 * 60 * 60 * 1000;

/**
 * 全猫のなつき度がLv.10（MAX）に到達しているかを判定し、
 * 「自動ごはん」が解禁されているかを返す純粋関数
 *
 * @param affectionLevels 各猫のなつき度レベル（数値または { level: number }）
 * @returns 全猫がLv.10以上なら true
 */
export function isAutoFeedUnlocked(
  affectionLevels?: Partial<Record<CatId, number | { level: number }>> | null
): boolean {
  if (!affectionLevels) return false;

  const targetCats: CatId[] = ['black', 'white', 'calico'];
  return targetCats.every((catId) => {
    const val = affectionLevels[catId];
    if (val === undefined || val === null) return false;
    const level = typeof val === 'number' ? val : val.level;
    return typeof level === 'number' && level >= MAX_AFFECTION_LEVEL;
  });
}

/**
 * 時間経過（ミリ秒）から、オフライン放置中に発生した給餌回数と最終まんぷく度を計算する純粋関数
 *
 * - 経過時間は最大7日間（AUTO_FEED_MAX_OFFLINE_MS）でキャップ
 * - まんぷく度が40%以下になるまでの時間（(fullness - 40)分）が経過すると1回目の給餌が発生（65%に回復）
 * - 以降は25分ごとに1回給餌が発生
 *
 * @param currentFullness 離脱時のまんぷく度スコア（0〜100）
 * @param elapsedMs 離脱時間（ミリ秒）
 * @param maxMs 上限ミリ秒（デフォルト: 7日間）
 */
export function calculateOfflineFeedCycles(
  currentFullness: number,
  elapsedMs: number,
  maxMs: number = AUTO_FEED_MAX_OFFLINE_MS
): { feedCount: number; remainingFullness: number } {
  if (elapsedMs <= 0) {
    return {
      feedCount: 0,
      remainingFullness: Math.max(
        MIN_FULLNESS_SCORE,
        Math.min(MAX_FULLNESS_SCORE, currentFullness)
      ),
    };
  }

  // 上限（最大7日間）でキャップ
  const cappedElapsedMs = Math.min(maxMs, elapsedMs);
  const totalMinutes = Math.floor(cappedElapsedMs / (60 * 1000));

  if (totalMinutes <= 0) {
    return {
      feedCount: 0,
      remainingFullness: Math.max(
        MIN_FULLNESS_SCORE,
        Math.min(MAX_FULLNESS_SCORE, currentFullness)
      ),
    };
  }

  // 40%に達するまでの所要分数
  const minutesToThreshold = Math.max(
    0,
    currentFullness - AUTO_FEED_THRESHOLD_FULLNESS
  );

  // 40%に達する前に復帰した場合（給餌は発生せず自然減衰のみ）
  if (totalMinutes < minutesToThreshold) {
    return {
      feedCount: 0,
      remainingFullness: Math.max(
        AUTO_FEED_THRESHOLD_FULLNESS,
        currentFullness - totalMinutes
      ),
    };
  }

  // 40%に達した瞬間に1回目の給餌が発生し、まんぷく度は65%に回復
  const remainingMinutesAfterFirstFeed = totalMinutes - minutesToThreshold;

  // 以降、AUTO_FEED_CYCLE_MINUTES（25分）ごとに給餌が1回発生
  const additionalFeeds = Math.floor(
    remainingMinutesAfterFirstFeed / AUTO_FEED_CYCLE_MINUTES
  );
  const totalFeedCount = 1 + additionalFeeds;

  // 最後の給餌からの経過分数による減衰
  const minutesSinceLastFeed =
    remainingMinutesAfterFirstFeed % AUTO_FEED_CYCLE_MINUTES;
  const finalFullness = Math.max(
    AUTO_FEED_THRESHOLD_FULLNESS,
    AUTO_FEED_RECOVERED_FULLNESS - minutesSinceLastFeed
  );

  return {
    feedCount: totalFeedCount,
    remainingFullness: finalFullness,
  };
}

/** 単一猫のオフライン自動給餌シミュレーション結果 */
export interface CatOfflineFeedResult {
  catId: CatId;
  feedCount: number;
  totalExpGained: number;
  previousExp: number;
  nextExp: number;
  finalFullness: number;
  earnedGifts: GiftItem[];
}

/**
 * 1匹の猫に対するオフライン自動給餌シミュレーションを実行する純粋関数
 *
 * @param params シミュレーションパラメータ
 */
export function simulateCatOfflineAutoFeed(params: {
  catId: CatId;
  currentExp: number;
  currentFullness: number;
  elapsedMs: number;
  catalog?: readonly GiftItem[];
  randomFn?: () => number;
  maxMs?: number;
}): CatOfflineFeedResult {
  const {
    catId,
    currentExp,
    currentFullness,
    elapsedMs,
    catalog = CAT_GIFTS,
    randomFn = Math.random,
    maxMs = AUTO_FEED_MAX_OFFLINE_MS,
  } = params;

  const { feedCount, remainingFullness } = calculateOfflineFeedCycles(
    currentFullness,
    elapsedMs,
    maxMs
  );

  if (feedCount <= 0) {
    return {
      catId,
      feedCount: 0,
      totalExpGained: 0,
      previousExp: currentExp,
      nextExp: currentExp,
      finalFullness: remainingFullness,
      earnedGifts: [],
    };
  }

  const totalExpGained = feedCount * AUTO_FEED_FOOD_EXP;

  // なつき度Exp加算（Lv.10固定）
  // Lv.10では 600 Expごとにゲージ満タン（おくりもの1個）
  let exp = currentExp + totalExpGained;
  const requiredExp = 600; // Lv.10のゲージ満タン必要Exp
  let giftCount = 0;

  while (exp >= requiredExp) {
    exp -= requiredExp;
    giftCount += 1;
  }

  // おくりものの抽選
  const earnedGifts: GiftItem[] = [];
  for (let i = 0; i < giftCount; i++) {
    const gift = pickRandomGift(catalog, randomFn);
    earnedGifts.push(gift);
  }

  return {
    catId,
    feedCount,
    totalExpGained,
    previousExp: currentExp,
    nextExp: exp,
    finalFullness: remainingFullness,
    earnedGifts,
  };
}

/** 全猫のオフライン自動給餌シミュレーション集約結果 */
export interface AllCatsOfflineFeedResult {
  elapsedMs: number;
  cappedElapsedMs: number;
  totalFeedCount: number;
  catResults: Record<CatId, CatOfflineFeedResult>;
  allEarnedGifts: Array<{ catId: CatId; gift: GiftItem }>;
}

/**
 * 3匹すべての猫に対するオフライン自動給餌シミュレーションを実行する純粋関数
 */
export function simulateAllCatsOfflineAutoFeed(params: {
  catExpMap: Record<CatId, number>;
  catFullnessMap: Record<CatId, number>;
  elapsedMs: number;
  catalog?: readonly GiftItem[];
  randomFn?: () => number;
  maxMs?: number;
}): AllCatsOfflineFeedResult {
  const {
    catExpMap,
    catFullnessMap,
    elapsedMs,
    catalog = CAT_GIFTS,
    randomFn = Math.random,
    maxMs = AUTO_FEED_MAX_OFFLINE_MS,
  } = params;

  const cappedElapsedMs = Math.min(maxMs, Math.max(0, elapsedMs));
  const targetCats: CatId[] = ['black', 'white', 'calico'];

  const catResults: Record<CatId, CatOfflineFeedResult> = {} as Record<
    CatId,
    CatOfflineFeedResult
  >;
  const allEarnedGifts: Array<{ catId: CatId; gift: GiftItem }> = [];
  let totalFeedCount = 0;

  for (const catId of targetCats) {
    const currentExp = catExpMap[catId] ?? 0;
    const currentFullness = catFullnessMap[catId] ?? 50;

    const res = simulateCatOfflineAutoFeed({
      catId,
      currentExp,
      currentFullness,
      elapsedMs: cappedElapsedMs,
      catalog,
      randomFn,
      maxMs,
    });

    catResults[catId] = res;
    totalFeedCount += res.feedCount;

    for (const gift of res.earnedGifts) {
      allEarnedGifts.push({ catId, gift });
    }
  }

  return {
    elapsedMs,
    cappedElapsedMs,
    totalFeedCount,
    catResults,
    allEarnedGifts,
  };
}

/**
 * 留守中に獲得したおくりものを一括でインベントリに適用する純粋関数
 */
export function applyEarnedGiftsToInventory(
  inventory: GiftInventory,
  earnedGifts: Array<{ catId: CatId; gift: GiftItem }>,
  timestamp: number = Date.now()
): GiftInventory {
  let updated = { ...inventory };
  for (const { catId, gift } of earnedGifts) {
    updated = addGiftToInventory(updated, gift.id, catId, timestamp);
  }
  return updated;
}

/**
 * 留守中の自動給餌回数を手帳統計（CareStats）に適用する純粋関数
 *
 * 【重要・厳守】
 * ユーザー指定の通り、自動ごはんでは「毎日のふれあい」としてはカウントせず、
 * ふれあい日数（totalActiveDays, currentStreakDays, maxStreakDays, lastInteractionDateStr）
 * は【一切変更せず】、純粋にごはん累計回数（totalFeedCount）と猫別ふれあい回数（interactionsByCat）
 * のみを安全に加算します。
 */
export function applyAutoFeedToCareStats(
  stats: CareStats,
  feedCountsByCat: Record<CatId, number>
): CareStats {
  const additionalFeedCount = Object.values(feedCountsByCat).reduce(
    (sum, count) => sum + (count || 0),
    0
  );

  if (additionalFeedCount <= 0) {
    return stats;
  }

  const updatedInteractionsByCat = { ...stats.interactionsByCat };
  for (const [catId, count] of Object.entries(feedCountsByCat)) {
    if (count > 0) {
      updatedInteractionsByCat[catId] =
        (updatedInteractionsByCat[catId] ?? 0) + count;
    }
  }

  return {
    ...stats,
    totalFeedCount: stats.totalFeedCount + additionalFeedCount,
    interactionsByCat: updatedInteractionsByCat,
    // 日付系のフィールドは変更しない（プレイヤー自身のふれあいのみで更新される）
  };
}
