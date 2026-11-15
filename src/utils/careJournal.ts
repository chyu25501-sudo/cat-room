import { CareActionType, CareStats } from '../types/journal.ts';

/** localStorage 保存用キー */
export const CARE_JOURNAL_STORAGE_KEY = 'nekoppoi_care_journal_stats';

/**
 * 初期統計データ
 */
export const INITIAL_CARE_STATS: CareStats = {
  firstInteractionAt: null,
  lastInteractionAt: null,
  lastInteractionDateStr: null,
  totalPetCount: 0,
  totalFeedCount: 0,
  totalPlayCount: 0,
  currentStreakDays: 0,
  maxStreakDays: 0,
  totalActiveDays: 0,
  interactionsByCat: {
    black: 0,
    white: 0,
    calico: 0,
  },
};

/**
 * 指定のタイムスタンプまたは現在時刻からローカル日付文字列 (YYYY-MM-DD) を取得する純粋関数
 */
export function toLocalDateString(dateInput: Date | number): string {
  const d = typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ある日付文字列 (YYYY-MM-DD) の前日文字列 (YYYY-MM-DD) を取得する純粋関数
 */
export function getYesterdayDateString(todayStr: string): string {
  const parts = todayStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() - 1);
  return toLocalDateString(d);
}

/**
 * ふれあいアクション（なでる・ごはん・おもちゃ）を記録し、更新された新しい CareStats を返す純粋関数
 *
 * @param prev 以前の統計データ
 * @param actionType アクション種別 ('pet' | 'feed' | 'play')
 * @param catId 猫ID ('black' | 'white' | 'calico' など)
 * @param timestamp 実行タイムスタンプ（指定がない場合は Date.now()）
 */
export function recordInteraction(
  prev: CareStats,
  actionType: CareActionType,
  catId: string,
  timestamp: number = Date.now()
): CareStats {
  const now = timestamp;
  const todayStr = toLocalDateString(now);
  const yesterdayStr = getYesterdayDateString(todayStr);

  const isFirstEver = prev.firstInteractionAt === null;
  const firstInteractionAt = isFirstEver ? now : prev.firstInteractionAt;

  // 連続ふれあい日数（Streak）と累計日数の判定
  let currentStreak = prev.currentStreakDays;
  let totalDays = prev.totalActiveDays;

  if (prev.lastInteractionDateStr === todayStr) {
    // 今日すでにふれあい済みの場合は日数の増加なし
  } else if (prev.lastInteractionDateStr === yesterdayStr) {
    // 昨日から連続している場合
    currentStreak += 1;
    totalDays += 1;
  } else {
    // 初回、または2日以上空いて途切れた場合
    currentStreak = 1;
    totalDays += 1;
  }

  const maxStreak = Math.max(prev.maxStreakDays, currentStreak);

  // 猫別のふれあい回数を加算
  const prevCatCount = prev.interactionsByCat[catId] ?? 0;
  const nextInteractionsByCat = {
    ...prev.interactionsByCat,
    [catId]: prevCatCount + 1,
  };

  return {
    firstInteractionAt,
    lastInteractionAt: now,
    lastInteractionDateStr: todayStr,
    totalPetCount: prev.totalPetCount + (actionType === 'pet' ? 1 : 0),
    totalFeedCount: prev.totalFeedCount + (actionType === 'feed' ? 1 : 0),
    totalPlayCount: prev.totalPlayCount + (actionType === 'play' ? 1 : 0),
    currentStreakDays: currentStreak,
    maxStreakDays: maxStreak,
    totalActiveDays: totalDays,
    interactionsByCat: nextInteractionsByCat,
  };
}

/**
 * 日付タイムスタンプを日本語の読みやすい形式（例: 2026年11月15日）に整形する純粋関数
 */
export function formatInteractionDate(timestamp: number | null): string {
  if (timestamp === null || isNaN(timestamp)) {
    return 'まだふれあっていません';
  }

  const d = new Date(timestamp);
  if (isNaN(d.getTime())) {
    return 'まだふれあっていません';
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * localStorage から読み取った未検証データを安全な CareStats に復元・サニタイズする純粋関数
 */
export function sanitizeCareStats(raw: unknown): CareStats {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...INITIAL_CARE_STATS };
  }

  const data = raw as Partial<CareStats>;

  const firstInteractionAt =
    typeof data.firstInteractionAt === 'number' && !isNaN(data.firstInteractionAt)
      ? data.firstInteractionAt
      : null;

  const lastInteractionAt =
    typeof data.lastInteractionAt === 'number' && !isNaN(data.lastInteractionAt)
      ? data.lastInteractionAt
      : null;

  const lastInteractionDateStr =
    typeof data.lastInteractionDateStr === 'string' ? data.lastInteractionDateStr : null;

  const totalPetCount =
    typeof data.totalPetCount === 'number' && data.totalPetCount >= 0
      ? Math.floor(data.totalPetCount)
      : 0;

  const totalFeedCount =
    typeof data.totalFeedCount === 'number' && data.totalFeedCount >= 0
      ? Math.floor(data.totalFeedCount)
      : 0;

  const totalPlayCount =
    typeof data.totalPlayCount === 'number' && data.totalPlayCount >= 0
      ? Math.floor(data.totalPlayCount)
      : 0;

  const currentStreakDays =
    typeof data.currentStreakDays === 'number' && data.currentStreakDays >= 0
      ? Math.floor(data.currentStreakDays)
      : 0;

  const maxStreakDays =
    typeof data.maxStreakDays === 'number' && data.maxStreakDays >= 0
      ? Math.floor(data.maxStreakDays)
      : 0;

  const totalActiveDays =
    typeof data.totalActiveDays === 'number' && data.totalActiveDays >= 0
      ? Math.floor(data.totalActiveDays)
      : 0;

  const rawCats = data.interactionsByCat;
  const interactionsByCat: Record<string, number> = {
    black: 0,
    white: 0,
    calico: 0,
  };

  if (rawCats && typeof rawCats === 'object' && !Array.isArray(rawCats)) {
    for (const [key, val] of Object.entries(rawCats)) {
      if (typeof val === 'number' && val >= 0) {
        interactionsByCat[key] = Math.floor(val);
      }
    }
  }

  return {
    firstInteractionAt,
    lastInteractionAt,
    lastInteractionDateStr,
    totalPetCount,
    totalFeedCount,
    totalPlayCount,
    currentStreakDays,
    maxStreakDays,
    totalActiveDays,
    interactionsByCat,
  };
}
