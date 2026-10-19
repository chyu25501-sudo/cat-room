import { CatMoodLevel, CatMoodInfo } from '../types/mood.ts';
import { CatPreset } from '../types/cat.ts';

export const MIN_MOOD_SCORE = 0;
export const MAX_MOOD_SCORE = 100;

/** なでていないときのベースライン機嫌スコア（おだやか） */
export const DEFAULT_INITIAL_MOOD_SCORE = 20;

/** 1回のなでなでで上昇する機嫌スコア */
export const DEFAULT_PET_MOOD_INCREMENT = 15;

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
 * 機嫌スコア（0〜100）から機嫌レベル（normal / happy / ecstatic）を判定する純粋関数
 */
export function getMoodLevel(score: number): CatMoodLevel {
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
  decayPerMinute: number = 2,
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
    case 'normal':
    default:
      return 3;
  }
}

