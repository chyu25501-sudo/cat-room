import { NekoppoiSaveData, SAVE_DATA_VERSION } from '../types/saveData.ts';
import { CatId } from '../types/cat.ts';
import { sanitizeSettings } from './catSettings.ts';
import { sanitizeGiftInventory } from './catGifts.ts';
import { sanitizeAchievements } from './catAchievements.ts';
import { sanitizeCareStats } from './careJournal.ts';
import { CatsAffectionMap, CatAffectionState } from '../types/affection.ts';
import { CatsFullnessMap, CatFullnessState } from '../types/fullness.ts';
import { GiftInventory, GiftRecord } from '../types/gift.ts';
import { UnlockedAchievements } from '../types/achievement.ts';
import { CareStats } from '../types/journal.ts';
import { AppSettings } from '../types/settings.ts';

const CAT_IDS: readonly CatId[] = ['black', 'white', 'calico'] as const;

/**
 * なつき度マップのサニタイズ（安全検証）
 */
export function sanitizeAffectionMap(raw: unknown): CatsAffectionMap {
  const result: CatsAffectionMap = {
    black: { level: 1, currentExp: 0, requiredExp: 120 },
    white: { level: 1, currentExp: 0, requiredExp: 120 },
    calico: { level: 1, currentExp: 0, requiredExp: 120 },
  };

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return result;
  }

  const obj = raw as Record<string, unknown>;
  for (const catId of CAT_IDS) {
    const item = obj[catId];
    if (item && typeof item === 'object') {
      const state = item as Record<string, unknown>;
      const level =
        typeof state.level === 'number' && Number.isFinite(state.level)
          ? Math.max(1, Math.min(10, Math.floor(state.level)))
          : 1;
      const currentExp =
        typeof state.currentExp === 'number' && Number.isFinite(state.currentExp)
          ? Math.max(0, state.currentExp)
          : 0;
      const requiredExp =
        typeof state.requiredExp === 'number' && Number.isFinite(state.requiredExp)
          ? Math.max(0, state.requiredExp)
          : 120;

      result[catId] = { level, currentExp, requiredExp };
    }
  }

  return result;
}

/**
 * まんぷく度マップのサニタイズ（安全検証）
 */
export function sanitizeFullnessMap(raw: unknown): CatsFullnessMap {
  const now = Date.now();
  const result: CatsFullnessMap = {
    black: { score: 50, lastFedAt: now },
    white: { score: 50, lastFedAt: now },
    calico: { score: 50, lastFedAt: now },
  };

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return result;
  }

  const obj = raw as Record<string, unknown>;
  for (const catId of CAT_IDS) {
    const item = obj[catId];
    if (item && typeof item === 'object') {
      const state = item as Record<string, unknown>;
      const score =
        typeof state.score === 'number' && Number.isFinite(state.score)
          ? Math.max(0, Math.min(100, Math.round(state.score)))
          : 50;
      const lastFedAt =
        typeof state.lastFedAt === 'number' && Number.isFinite(state.lastFedAt)
          ? state.lastFedAt
          : now;

      result[catId] = { score, lastFedAt };
    }
  }

  return result;
}

/**
 * 読み込んだ不明なオブジェクトを安全な NekoppoiSaveData にサニタイズ
 */
export function validateAndSanitizeSaveData(raw: unknown): NekoppoiSaveData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const obj = raw as Record<string, unknown>;
  const version = typeof obj.version === 'number' ? obj.version : SAVE_DATA_VERSION;
  const timestamp =
    typeof obj.timestamp === 'number' && Number.isFinite(obj.timestamp)
      ? obj.timestamp
      : Date.now();

  const settings = obj.settings ? sanitizeSettings(obj.settings) : undefined;
  const affection = obj.affection ? sanitizeAffectionMap(obj.affection) : undefined;
  const fullness = obj.fullness ? sanitizeFullnessMap(obj.fullness) : undefined;
  const gifts = obj.gifts ? sanitizeGiftInventory(obj.gifts) : undefined;
  const achievements = obj.achievements ? sanitizeAchievements(obj.achievements) : undefined;
  const careJournal = obj.careJournal ? sanitizeCareStats(obj.careJournal) : undefined;
  const lastActiveTime =
    typeof obj.lastActiveTime === 'number' && Number.isFinite(obj.lastActiveTime)
      ? obj.lastActiveTime
      : undefined;
  const guideSeen = typeof obj.guideSeen === 'boolean' ? obj.guideSeen : undefined;

  return {
    version,
    timestamp,
    settings,
    affection,
    fullness,
    gifts,
    achievements,
    careJournal,
    lastActiveTime,
    guideSeen,
  };
}

/**
 * おくりものインベントリの和集合マージ（最大個数・猫別合算）
 */
function mergeGiftInventories(local: GiftInventory = {}, incoming: GiftInventory = {}): GiftInventory {
  const merged: GiftInventory = {};
  const allIds = new Set([...Object.keys(local), ...Object.keys(incoming)]);

  for (const id of allIds) {
    const loc = local[id];
    const inc = incoming[id];

    if (!loc && inc) {
      merged[id] = inc;
      continue;
    }
    if (loc && !inc) {
      merged[id] = loc;
      continue;
    }
    if (loc && inc) {
      const byCat: Partial<Record<CatId, number>> = {};
      for (const catId of CAT_IDS) {
        const c1 = loc.byCat?.[catId] ?? 0;
        const c2 = inc.byCat?.[catId] ?? 0;
        const maxC = Math.max(c1, c2);
        if (maxC > 0) {
          byCat[catId] = maxC;
        }
      }

      merged[id] = {
        giftId: id,
        count: Math.max(loc.count, inc.count),
        byCat,
        firstReceivedAt: Math.min(loc.firstReceivedAt, inc.firstReceivedAt),
        lastReceivedAt: Math.max(loc.lastReceivedAt, inc.lastReceivedAt),
      };
    }
  }

  return merged;
}

/**
 * 実績データの和集合マージ（達成状況・進捗の大きい方を採用）
 */
function mergeAchievements(
  local: UnlockedAchievements = {},
  incoming: UnlockedAchievements = {}
): UnlockedAchievements {
  const merged: UnlockedAchievements = {};
  const allIds = new Set([...Object.keys(local), ...Object.keys(incoming)]);

  for (const id of allIds) {
    const loc = local[id];
    const inc = incoming[id];

    if (!loc && inc) {
      merged[id] = inc;
      continue;
    }
    if (loc && !inc) {
      merged[id] = loc;
      continue;
    }
    if (loc && inc) {
      // 両方に存在する場合：達成日時はより早い方を採用、進捗は最大値を採用
      let unlockedAt = loc.unlockedAt;
      if (loc.unlockedAt && inc.unlockedAt) {
        unlockedAt = Math.min(loc.unlockedAt, inc.unlockedAt);
      } else if (!loc.unlockedAt && inc.unlockedAt) {
        unlockedAt = inc.unlockedAt;
      }

      const progress = Math.max(loc.progress ?? 0, inc.progress ?? 0);

      merged[id] = {
        id,
        unlockedAt,
        progress: progress > 0 ? progress : undefined,
      };
    }
  }

  return merged;
}

/**
 * ふり返り手帳（お世話統計）の最大値マージ
 */
function mergeCareJournal(local?: CareStats, incoming?: CareStats): CareStats | undefined {
  if (!local && incoming) return incoming;
  if (local && !incoming) return local;
  if (!local && !incoming) return undefined;

  const l = local!;
  const i = incoming!;

  const interactionsByCat: Record<CatId, number> = {
    black: Math.max(l.interactionsByCat?.black ?? 0, i.interactionsByCat?.black ?? 0),
    white: Math.max(l.interactionsByCat?.white ?? 0, i.interactionsByCat?.white ?? 0),
    calico: Math.max(l.interactionsByCat?.calico ?? 0, i.interactionsByCat?.calico ?? 0),
  };

  // 最終インタラクション日付（新しい日付を採用）
  const lastDateStr =
    (l.lastInteractionDateStr ?? '') > (i.lastInteractionDateStr ?? '')
      ? l.lastInteractionDateStr
      : i.lastInteractionDateStr ?? l.lastInteractionDateStr;

  // はじめてふれあった日（最も古いタイムスタンプを採用）
  let firstInteractionAt: number | null = null;
  if (l.firstInteractionAt !== null && i.firstInteractionAt !== null) {
    firstInteractionAt = Math.min(l.firstInteractionAt, i.firstInteractionAt);
  } else {
    firstInteractionAt = l.firstInteractionAt ?? i.firstInteractionAt ?? null;
  }

  // 最後にふれあった日時（最も新しいタイムスタンプを採用）
  let lastInteractionAt: number | null = null;
  if (l.lastInteractionAt !== null && i.lastInteractionAt !== null) {
    lastInteractionAt = Math.max(l.lastInteractionAt, i.lastInteractionAt);
  } else {
    lastInteractionAt = l.lastInteractionAt ?? i.lastInteractionAt ?? null;
  }

  return {
    firstInteractionAt,
    lastInteractionAt,
    lastInteractionDateStr: lastDateStr,
    totalPetCount: Math.max(l.totalPetCount, i.totalPetCount),
    totalFeedCount: Math.max(l.totalFeedCount, i.totalFeedCount),
    totalPlayCount: Math.max(l.totalPlayCount, i.totalPlayCount),
    totalActiveDays: Math.max(l.totalActiveDays, i.totalActiveDays),
    currentStreakDays: Math.max(l.currentStreakDays, i.currentStreakDays),
    maxStreakDays: Math.max(l.maxStreakDays, i.maxStreakDays),
    interactionsByCat,
  };
}

/**
 * なつき度データのマージ（より高いレベルを採用。同じレベルならLv10周回を考慮してタイムスタンプやExpで判定）
 */
function mergeAffection(
  local?: CatsAffectionMap,
  incoming?: CatsAffectionMap,
  isIncomingNewer: boolean = false
): CatsAffectionMap | undefined {
  if (!local && incoming) return incoming;
  if (local && !incoming) return local;
  if (!local && !incoming) return undefined;

  const result: CatsAffectionMap = { ...local! };

  for (const catId of CAT_IDS) {
    const loc = local![catId];
    const inc = incoming![catId];

    if (!loc && inc) {
      result[catId] = inc;
    } else if (loc && inc) {
      if (inc.level > loc.level) {
        result[catId] = inc;
      } else if (loc.level > inc.level) {
        result[catId] = loc;
      } else {
        // 同じレベルの場合：
        // 最大レベル（Lv.10以上）のときはゲージ満タン後におくりものを放出してExpが0に周回するため、
        // タイムスタンプが新しい方のセーブデータを採用（過去の満タン直前Expへの巻き戻りを防ぐ）
        if (loc.level >= 10) {
          result[catId] = isIncomingNewer ? inc : loc;
        } else {
          // 最大レベル未満のときは、より経験値が多い方（同じなら新しい方）を採用
          if (inc.currentExp !== loc.currentExp) {
            result[catId] = inc.currentExp > loc.currentExp ? inc : loc;
          } else {
            result[catId] = isIncomingNewer ? inc : loc;
          }
        }
      }
    }
  }

  return result;
}

/**
 * まんぷく度データのマージ（最終給餌タイムスタンプが新しい方を採用）
 */
function mergeFullness(local?: CatsFullnessMap, incoming?: CatsFullnessMap): CatsFullnessMap | undefined {
  if (!local && incoming) return incoming;
  if (local && !incoming) return local;
  if (!local && !incoming) return undefined;

  const result: CatsFullnessMap = { ...local! };

  for (const catId of CAT_IDS) {
    const loc = local![catId];
    const inc = incoming![catId];

    if (!loc && inc) {
      result[catId] = inc;
    } else if (loc && inc) {
      result[catId] = inc.lastFedAt >= loc.lastFedAt ? inc : loc;
    }
  }

  return result;
}

/**
 * 2つのセーブデータを、ユーザーが定めた理想のルールに基づいて賢くマージする純粋関数
 *
 * - おくりもの・実績: 和集合（合算・最大値）
 * - ふり返り手帳: 各カウントの最大値
 * - なつき度: 高いレベル/Exp
 * - まんぷく度: 最終給餌が新しい方
 * - 設定: セーブデータタイムスタンプが新しい方
 * - 最終アクティブ時間: 新しい方（端末間の空き時間もお留守番として計算可能）
 */
export function mergeSaveData(
  local: NekoppoiSaveData,
  incoming: NekoppoiSaveData
): NekoppoiSaveData {
  const isIncomingNewer = incoming.timestamp >= local.timestamp;

  return {
    version: Math.max(local.version, incoming.version),
    timestamp: Math.max(local.timestamp, incoming.timestamp),
    settings: isIncomingNewer ? (incoming.settings ?? local.settings) : (local.settings ?? incoming.settings),
    affection: mergeAffection(local.affection, incoming.affection, isIncomingNewer),
    fullness: mergeFullness(local.fullness, incoming.fullness),
    gifts: mergeGiftInventories(local.gifts, incoming.gifts),
    achievements: mergeAchievements(local.achievements, incoming.achievements),
    careJournal: mergeCareJournal(local.careJournal, incoming.careJournal),
    lastActiveTime: Math.max(local.lastActiveTime ?? 0, incoming.lastActiveTime ?? 0),
    guideSeen: Boolean(local.guideSeen || incoming.guideSeen),
  };
}

/**
 * セーブデータオブジェクトを整形されたJSON文字列にシリアライズ
 */
export function serializeSaveData(data: NekoppoiSaveData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * JSON文字列をパースしてサニタイズされた NekoppoiSaveData を生成
 */
export function parseSaveDataJson(jsonStr: string): NekoppoiSaveData | null {
  try {
    const raw = JSON.parse(jsonStr);
    return validateAndSanitizeSaveData(raw);
  } catch {
    return null;
  }
}
