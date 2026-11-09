import { CatMoodLevel, CatMoodInfo } from '../types/mood.ts';
import { CatPreset } from '../types/cat.ts';
import { LastCareAction } from '../types/care.ts';

export const MIN_MOOD_SCORE = 0;
export const MAX_MOOD_SCORE = 100;

/** なでていないときのベースライン機嫌スコア（おだやか） */
export const DEFAULT_INITIAL_MOOD_SCORE = 20;

/** 不機嫌（愛撫誘発性攻撃行動）時の機嫌スコア */
export const ANNOYED_MOOD_SCORE = 5;

/** 1回のなでなでで上昇する機嫌スコア */
export const DEFAULT_PET_MOOD_INCREMENT = 15;

/** 機嫌上昇量のデフォルト変動最小値（-5%） */
export const DEFAULT_MIN_MOOD_VARIATION = -5;

/** 機嫌上昇量のデフォルト変動最大値（+5%） */
export const DEFAULT_MAX_MOOD_VARIATION = 5;

/** 1分あたりの自然減衰スコア（15秒で約1点減衰） */
export const DEFAULT_DECAY_PER_MINUTE = 4;

/** 過剰刺激（愛撫誘発性攻撃行動）の判定ウィンドウ（ミリ秒）: 12秒間 */
export const DEFAULT_OVERSTIMULATION_WINDOW_MS = 12000;

/** ウィンドウ内での過剰撫で回数しきい値（ごきげんMAXを満喫後、しつこく連続して撫で続けたときに不機嫌になる回数）: 10回 */
export const DEFAULT_OVERSTIMULATION_THRESHOLD_COUNT = 10;

/** 不機嫌状態の継続時間（ミリ秒）: 5秒間 */
export const DEFAULT_ANNOYED_DURATION_MS = 5000;

/**
 * 機嫌レベルのしきい値定義
 * - normal: 0 〜 39
 * - happy: 40 〜 74
 * - ecstatic: 75 〜 100
 */
export const MOOD_THRESHOLDS = {
  happy: 40,
  ecstatic: 75,
} as const;

export const MOOD_INFO_MAP: Record<CatMoodLevel, CatMoodInfo> = {
  annoyed: {
    level: 'annoyed',
    label: 'ごきげんななめ',
    emoji: '😾',
    description: 'なですぎてイライラしているよ…！',
    colorClass: 'text-rose-700',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  normal: {
    level: 'normal',
    label: 'おだやか',
    emoji: '😌',
    description: 'まったり落ち着いているよ',
    colorClass: 'text-stone-600',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  },
  happy: {
    level: 'happy',
    label: 'ごきげん♪',
    emoji: '😸',
    description: 'なでられて嬉しそうにしているよ♪',
    colorClass: 'text-amber-600',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  ecstatic: {
    level: 'ecstatic',
    label: 'ごきげんMAX♡',
    emoji: '😻',
    description: 'なでなでが大好きで幸せいっぱい♡',
    colorClass: 'text-rose-600',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
};

/**
 * 現在の時刻と不機嫌期限タイムスタンプから、不機嫌中かどうか判定する純粋関数
 */
export function isCatAnnoyed(annoyedUntil: number | undefined, now: number): boolean {
  if (typeof annoyedUntil !== 'number') {
    return false;
  }
  return now < annoyedUntil;
}

/**
 * 直近の撫でタイムスタンプ履歴から過剰刺激（愛撫誘発性攻撃行動）が発生しているか判定する純粋関数
 */
export function checkOverstimulation(
  recentPetTimes: readonly number[],
  now: number,
  windowMs: number = DEFAULT_OVERSTIMULATION_WINDOW_MS,
  thresholdCount: number = DEFAULT_OVERSTIMULATION_THRESHOLD_COUNT
): boolean {
  if (!recentPetTimes || recentPetTimes.length < thresholdCount) {
    return false;
  }
  const inWindow = recentPetTimes.filter((t) => now - t >= 0 && now - t <= windowMs);
  return inWindow.length >= thresholdCount;
}

/**
 * 機嫌スコア（0〜100）および不機嫌フラグから機嫌レベルを判定する純粋関数
 */
export function getMoodLevel(score: number, isAnnoyed: boolean = false): CatMoodLevel {
  if (isAnnoyed) {
    return 'annoyed';
  }
  if (score >= MOOD_THRESHOLDS.ecstatic) {
    return 'ecstatic';
  }
  if (score >= MOOD_THRESHOLDS.happy) {
    return 'happy';
  }
  return 'normal';
}

/**
 * スコアまたはレベルから機嫌表示情報を取得する純粋関数
 */
export function getMoodInfo(scoreOrLevel: number | CatMoodLevel): CatMoodInfo {
  const level: CatMoodLevel =
    typeof scoreOrLevel === 'number' ? getMoodLevel(scoreOrLevel) : scoreOrLevel;
  return MOOD_INFO_MAP[level];
}

/**
 * 直前のアクション（なでる・ごはん・おもちゃ）および機嫌レベルに応じた自然な説明文を取得する純粋関数
 */
export function getMoodDescription(
  level: CatMoodLevel,
  lastAction?: LastCareAction | null
): string {
  if (level === 'annoyed') {
    return 'なですぎてイライラしているよ…！';
  }

  if (lastAction === 'feed') {
    switch (level) {
      case 'ecstatic':
        return '美味しいごはんで幸せいっぱい♡';
      case 'happy':
        return 'ごはんを食べて嬉しそうにしているよ♪';
      case 'normal':
      default:
        return 'お腹が落ち着いてまったりしているよ';
    }
  }

  if (lastAction === 'play') {
    switch (level) {
      case 'ecstatic':
        return 'いっぱい遊んで大興奮で幸せいっぱい♡';
      case 'happy':
        return 'おもちゃで遊んで嬉しそうにしているよ♪';
      case 'normal':
      default:
        return '遊んだあとでまったりしているよ';
    }
  }

  // なでなで（pet）、または未指定（デフォルト）
  switch (level) {
    case 'ecstatic':
      return 'なでなでが大好きで幸せいっぱい♡';
    case 'happy':
      return 'なでられて嬉しそうにしているよ♪';
    case 'normal':
    default:
      return 'まったり落ち着いているよ';
  }
}

/**
 * 1回なでたときの機嫌スコア上昇量（基準値15に±1〜5%のランダムな揺らぎを加えた値: 10〜20%）を計算する純粋関数
 * @param baseIncrement 基準の上昇値（デフォルト: 15）
 * @param randomFn 乱数生成関数（テスト用注入可能、デフォルト: Math.random）
 * @param minVariation 変動最小値（デフォルト: -5）
 * @param maxVariation 変動最大値（デフォルト: 5）
 * @returns 揺らぎ後の上昇値（最小10 〜 最大20）
 */
export function calculateVariedMoodIncrement(
  baseIncrement: number = DEFAULT_PET_MOOD_INCREMENT,
  randomFn: () => number = Math.random,
  minVariation: number = DEFAULT_MIN_MOOD_VARIATION,
  maxVariation: number = DEFAULT_MAX_MOOD_VARIATION
): number {
  const deltaRange = maxVariation - minVariation + 1;
  const delta = Math.floor(randomFn() * deltaRange) + minVariation;
  return Math.max(1, baseIncrement + delta);
}

/**
 * なでた後の次の機嫌スコアを計算する純粋関数（0〜100でクランプ）
 */
export function calculateNextMood(
  currentScore: number,
  increment: number = DEFAULT_PET_MOOD_INCREMENT
): number {
  const next = currentScore + increment;
  return Math.max(MIN_MOOD_SCORE, Math.min(MAX_MOOD_SCORE, next));
}

/**
 * 時間経過による機嫌スコアの自然減衰を計算する純粋関数
 * 放置されてもベースライン（20）より下には下がらない安全設計
 */
export function calculateDecayedMood(
  currentScore: number,
  elapsedMs: number,
  decayPerMinute: number = DEFAULT_DECAY_PER_MINUTE,
  minBaseline: number = DEFAULT_INITIAL_MOOD_SCORE
): number {
  if (elapsedMs <= 0 || currentScore <= minBaseline) {
    return currentScore;
  }
  const minutes = elapsedMs / (60 * 1000);
  const decayAmount = minutes * decayPerMinute;
  const decayed = Math.round(currentScore - decayAmount);
  return Math.max(minBaseline, Math.min(MAX_MOOD_SCORE, decayed));
}

/**
 * 猫の機嫌レベルに応じた鳴き声のピッチ倍率を計算する純粋関数
 * - normal: 基本ピッチ
 * - happy: 8%上昇（嬉しそうな声）
 * - ecstatic: 18%上昇（甘えた高らかな声）
 */
export function calculatePitchForMood(
  basePitch: number,
  moodLevel: CatMoodLevel
): number {
  switch (moodLevel) {
    case 'ecstatic':
      return Math.round(basePitch * 1.18 * 100) / 100;
    case 'happy':
      return Math.round(basePitch * 1.08 * 100) / 100;
    case 'annoyed':
      return Math.round(basePitch * 0.82 * 100) / 100;
    case 'normal':
    default:
      return basePitch;
  }
}

/**
 * 猫の機嫌レベルに応じた鳴き声メッセージを取得する純粋関数
 */
export function getMeowMessageForMood(
  preset: CatPreset,
  moodLevel: CatMoodLevel,
  randomFn: () => number = Math.random
): string {
  const moodList = preset.moodMessages?.[moodLevel];
  const list = moodList && moodList.length > 0 ? moodList : preset.meowMessages;
  if (!list || list.length === 0) {
    return 'ニャ〜ン♪';
  }
  const index = Math.floor(randomFn() * list.length);
  return list[Math.min(index, list.length - 1)];
}

/**
 * 猫の機嫌レベルに応じたエフェクト粒子数を決定する純粋関数
 * 機嫌が良いほど一度に出現するエフェクト数が華やかになる
 */
export function getParticleCountForMood(
  moodLevel: CatMoodLevel,
  randomFn: () => number = Math.random
): number {
  switch (moodLevel) {
    case 'ecstatic':
      return 4 + Math.floor(randomFn() * 2); // 4〜5個
    case 'happy':
      return 3 + Math.floor(randomFn() * 2); // 3〜4個
    case 'annoyed':
      return 1 + Math.floor(randomFn() * 2); // 1〜2個（怒り・イライラ粒子）
    case 'normal':
    default:
      return 3;
  }
}

