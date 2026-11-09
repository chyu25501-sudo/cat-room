import { CatFullnessLevel, CatFullnessInfo } from '../types/fullness.ts';

export const MIN_FULLNESS_SCORE = 0;
export const MAX_FULLNESS_SCORE = 100;

/** 初期まんぷく度スコア（ほどよい） */
export const DEFAULT_INITIAL_FULLNESS_SCORE = 50;

/**
 * 1分あたりのまんぷく度自然減衰スコア
 * ごきげん度（4点/分）と比べてかなりゆっくり（1点/分、60秒で約1点減衰）減少
 */
export const DEFAULT_FULLNESS_DECAY_PER_MINUTE = 1;

/**
 * まんぷく度レベルのしきい値定義
 * - starving (ペコペコ): 0 〜 14
 * - hungry (小腹すいた): 15 〜 39
 * - satisfied (ほどよい): 40 〜 79
 * - full (まんぷく): 80 〜 100
 */
export const FULLNESS_THRESHOLDS = {
  starving: 15,
  hungry: 40,
  full: 80,
} as const;

export const FULLNESS_INFO_MAP: Record<CatFullnessLevel, CatFullnessInfo> = {
  starving: {
    level: 'starving',
    label: 'ペコペコ',
    emoji: '🥣',
    description: 'お腹がペコペコだよ…！',
    colorClass: 'text-amber-700',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  hungry: {
    level: 'hungry',
    label: '小腹すいた',
    emoji: '🍴',
    description: 'そろそろごはんが欲しいニャ',
    colorClass: 'text-orange-600',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  satisfied: {
    level: 'satisfied',
    label: 'ほどよい',
    emoji: '😋',
    description: 'ちょうどいいお腹具合だよ',
    colorClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  full: {
    level: 'full',
    label: 'まんぷく♡',
    emoji: '🥰',
    description: 'お腹いっぱいで幸せいっぱい♡',
    colorClass: 'text-teal-600',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
  },
};

/**
 * スコア（0〜100）からまんぷく度レベルを判定する純粋関数
 */
export function getFullnessLevel(score: number): CatFullnessLevel {
  if (score >= FULLNESS_THRESHOLDS.full) {
    return 'full';
  }
  if (score >= FULLNESS_THRESHOLDS.hungry) {
    return 'satisfied';
  }
  if (score >= FULLNESS_THRESHOLDS.starving) {
    return 'hungry';
  }
  return 'starving';
}

/**
 * スコアまたはレベルからまんぷく度表示情報を取得する純粋関数
 */
export function getFullnessInfo(
  scoreOrLevel: number | CatFullnessLevel
): CatFullnessInfo {
  const level: CatFullnessLevel =
    typeof scoreOrLevel === 'number'
      ? getFullnessLevel(scoreOrLevel)
      : scoreOrLevel;
  return FULLNESS_INFO_MAP[level];
}

/**
 * ごはんを食べた後の新しいまんぷく度スコアを計算する純粋関数（0〜100でクランプ）
 */
export function calculateNextFullness(
  currentScore: number,
  boost: number
): number {
  const next = currentScore + boost;
  return Math.max(MIN_FULLNESS_SCORE, Math.min(MAX_FULLNESS_SCORE, next));
}

/**
 * 時間経過によるまんぷく度スコアの自然減衰を計算する純粋関数
 * ごきげん度よりもかなりゆっくり減衰（デフォルト1分あたり1点）
 */
export function calculateDecayedFullness(
  currentScore: number,
  elapsedMs: number,
  decayPerMinute: number = DEFAULT_FULLNESS_DECAY_PER_MINUTE,
  minBaseline: number = MIN_FULLNESS_SCORE
): number {
  if (elapsedMs <= 0 || currentScore <= minBaseline) {
    return currentScore;
  }
  const minutes = elapsedMs / (60 * 1000);
  const decayAmount = minutes * decayPerMinute;
  const decayed = Math.round(currentScore - decayAmount);
  return Math.max(minBaseline, Math.min(MAX_FULLNESS_SCORE, decayed));
}
