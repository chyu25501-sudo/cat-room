import { CatAffectionLevel, AffectionGainResult } from '../types/affection.ts';
import { FoodId, ToyId } from '../types/care.ts';

/** なつき度の初期最小レベル */
export const MIN_AFFECTION_LEVEL = 1;

/** なつき度の最大レベル（第7週仕様: 一旦10） */
export const MAX_AFFECTION_LEVEL = 10;

/** なつき度Lv.1のときにゲージ満タン（Lv.2上昇）に必要な基礎ふれあい経験値 */
export const BASE_AFFECTION_EXP = 100;

/** なつき度が1レベル上がるごとに増加する追加必要経験値 */
export const AFFECTION_EXP_PER_LEVEL = 25;

/** 1回のなでなでで獲得する基準なつき度Exp */
export const DEFAULT_PET_AFFECTION_EXP = 10;

/** ごはんの種類ごとの獲得なつき度Exp */
export const FOOD_AFFECTION_EXP_MAP: Record<FoodId, number> = {
  kibble: 25, // カリカリ
  canned: 35, // ねこ缶
  treat: 45,  // おやつピューレ
};

/** おもちゃの種類ごとの獲得なつき度Exp */
export const TOY_AFFECTION_EXP_MAP: Record<ToyId, number> = {
  teaser: 20, // ねこじゃらし
  ball: 30,   // 毛糸ボール
  laser: 40,  // レーザーポインター
};

/**
 * 指定したなつき度レベルにおけるゲージ満タンに必要な経験値を計算する純粋関数
 * レベルが上がるほど必要な「ふれあい」の量が少しずつ増加します
 * （Lv.1: 100pt, Lv.2: 125pt, Lv.3: 150pt, ... Lv.9: 300pt, Lv.10: 300pt）
 */
export function calculateRequiredExp(level: number): number {
  const effectiveLevel = Math.max(
    MIN_AFFECTION_LEVEL,
    Math.min(MAX_AFFECTION_LEVEL - 1, Math.floor(level))
  );
  return BASE_AFFECTION_EXP + (effectiveLevel - MIN_AFFECTION_LEVEL) * AFFECTION_EXP_PER_LEVEL;
}

/**
 * 現在のゲージ経験値と必要経験値から、ゲージの進行度パーセンテージ（0〜100%）を計算する純粋関数
 * なつき度最大時もゲージを溜めることができるため、現在のExpと必要Expの比率を計算します。
 */
export function calculateAffectionProgress(
  currentExp: number,
  requiredExp: number,
  _level: number = MIN_AFFECTION_LEVEL
): number {
  if (requiredExp <= 0) {
    return 0;
  }
  const ratio = currentExp / requiredExp;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

/**
 * ふれあい（なでる・ごはん・おもちゃ）による経験値獲得とレベルアップを計算する純粋関数
 * ゲージが1回満タンになるとレベルが+1上昇し、ゲージはリセット（余剰Exp引き継ぎ）されます。
 * 最大値（Lv.10）に到達した後も、最大に上げる時と同じ必要量でゲージを溜めることができ、
 * 満タンになるたびに演出トリガー（isLevelUp & isMaxBonus）が発生し、ゲージがリセットされて何度でも溜め直せます。
 *
 * @param currentLevel 加算前のなつき度レベル
 * @param currentExp 加算前の現在ゲージ経験値
 * @param gainedExp 今回獲得したふれあい経験値
 */
export function calculateAffectionGain(
  currentLevel: number,
  currentExp: number,
  gainedExp: number
): AffectionGainResult {
  const safeGained = Math.max(0, gainedExp);
  const startLevel = Math.max(
    MIN_AFFECTION_LEVEL,
    Math.min(MAX_AFFECTION_LEVEL, Math.floor(currentLevel))
  );

  // すでに最大レベル（Lv.10）に達している場合: 同じ必要量（300pt）でゲージを溜め、満タンでリセット＆演出トリガー
  if (startLevel >= MAX_AFFECTION_LEVEL) {
    const required = calculateRequiredExp(MAX_AFFECTION_LEVEL);
    let exp = Math.max(0, currentExp) + safeGained;
    let isMaxBonus = false;

    while (exp >= required) {
      exp -= required;
      isMaxBonus = true;
    }

    const progressPercentage = calculateAffectionProgress(exp, required, MAX_AFFECTION_LEVEL);

    return {
      previousLevel: MAX_AFFECTION_LEVEL,
      nextLevel: MAX_AFFECTION_LEVEL,
      isLevelUp: isMaxBonus,
      isMaxBonus,
      currentExp: exp,
      requiredExp: required,
      gainedExp: safeGained,
      progressPercentage,
    };
  }

  let level = startLevel;
  let exp = Math.max(0, currentExp) + safeGained;
  let required = calculateRequiredExp(level);
  let isLevelUp = false;
  let isMaxBonus = false;

  // ゲージが満タンになったらレベルアップ＆ゲージリセット（余剰Expを次のレベルへ持ち越し）
  while (exp >= required && level < MAX_AFFECTION_LEVEL) {
    exp -= required;
    level += 1;
    isLevelUp = true;
    required = calculateRequiredExp(level);
  }

  // 最大レベルに到達した場合、さらにLv.10の必要量（300pt）を超えている場合はループボーナス
  if (level >= MAX_AFFECTION_LEVEL) {
    while (exp >= required) {
      exp -= required;
      isMaxBonus = true;
    }
  }

  const progressPercentage = calculateAffectionProgress(exp, required, level);

  return {
    previousLevel: startLevel,
    nextLevel: level,
    isLevelUp,
    isMaxBonus,
    currentExp: exp,
    requiredExp: required,
    gainedExp: safeGained,
    progressPercentage,
  };
}

/** なつき度レベルごとの称号定義 */
export const AFFECTION_TITLES: Record<number, string> = {
  1: 'はじめまして',
  2: 'ちょっと気になる',
  3: '顔なじみ',
  4: 'おともだち',
  5: 'なかよし',
  6: 'だいすき',
  7: '心を開いた',
  8: '相思相愛',
  9: '無二の親友',
  10: 'ずっと一緒♡',
};

/**
 * なつき度レベルに応じた称号（肩書き）を取得する純粋関数
 */
export function getAffectionTitle(level: number): string {
  const clamped = Math.max(
    MIN_AFFECTION_LEVEL,
    Math.min(MAX_AFFECTION_LEVEL, Math.floor(level))
  );
  return AFFECTION_TITLES[clamped] ?? 'なかよし';
}

/**
 * なつき度レベルに応じた説明メッセージを取得する純粋関数
 */
export function getAffectionDescription(level: number, progressPercentage: number): string {
  if (level >= MAX_AFFECTION_LEVEL) {
    return 'なつき度MAX！深い絆で結ばれた最高のパートナー♡';
  }
  const title = getAffectionTitle(level);
  return `なつき度 Lv.${level}（${title}） - 次のレベルまで ${100 - progressPercentage}%`;
}
