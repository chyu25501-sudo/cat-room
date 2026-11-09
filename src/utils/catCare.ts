import { FoodId, FoodItem } from '../types/care.ts';
import { CatId } from '../types/cat.ts';
import { MIN_MOOD_SCORE, MAX_MOOD_SCORE } from './catMood.ts';

/**
 * 選択可能なごはんアイテム一覧（3種類）
 */
export const FOOD_ITEMS: readonly FoodItem[] = [
  {
    id: 'kibble',
    name: 'カリカリ',
    subtitle: '定番の総合栄養食',
    iconType: 'bowl',
    icon: '🥣',
    moodBoost: 18,
    eatingMessages: {
      black: ['カリカリ…ニャムニャム♪', 'サクサク…ミャオ！', 'カリッ…カリッ…ゴロゴロ…'],
      white: ['サクサク…ふにゃあ♪', 'カリカリ…クニャ〜♪', 'カリッ…ふにゃ〜ん…'],
    },
    themeClass: 'from-amber-400 to-orange-400 text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'canned',
    name: 'ねこ缶（まぐろ）',
    subtitle: 'ジューシーなごちそう',
    iconType: 'can',
    icon: '🐟',
    moodBoost: 28,
    eatingMessages: {
      black: ['ペロペロ…ミャオ〜〜♡', 'ハフハフ…ゴロゴロ…♡', 'ニャムニャム…ンニャ〜♡'],
      white: ['ペロペロ…ふにゃ〜ん♡', 'クニャ〜…ゴロゴロ…♡', 'ニャム…ふにゃぁ〜♡'],
    },
    themeClass: 'from-sky-400 to-blue-400 text-sky-700 bg-sky-50 border-sky-200',
  },
  {
    id: 'treat',
    name: 'おやつピューレ',
    subtitle: '大好物のとろとろおやつ',
    iconType: 'treat',
    icon: '🍦',
    moodBoost: 38,
    eatingMessages: {
      black: ['ペロペロ…！ゴロゴロゴロ…♡', 'ンニャ〜〜…ペロペロ♡', 'ミャ〜〜♡ ゴロゴロ…！'],
      white: ['ペロペロ…ふにゃあぁ〜♡', 'ふにゃ〜〜…ゴロゴロゴロ…', 'クニャ〜ン…ペロペロ…♡'],
    },
    themeClass: 'from-rose-400 to-pink-500 text-rose-700 bg-rose-50 border-rose-200',
  },
] as const;

/**
 * IDからごはんアイテムを取得する純粋関数
 */
export function getFoodById(id: FoodId): FoodItem {
  const item = FOOD_ITEMS.find((f) => f.id === id);
  return item ?? FOOD_ITEMS[0];
}

/**
 * ごはんを食べたときの猫のメッセージを取得する純粋関数
 */
export function getEatingMessage(
  food: FoodItem,
  catId: CatId,
  randomFn: () => number = Math.random
): string {
  const list = food.eatingMessages[catId] ?? food.eatingMessages.black;
  if (!list || list.length === 0) {
    return 'ニャムニャム…♪';
  }
  const index = Math.floor(randomFn() * list.length);
  return list[Math.min(index, list.length - 1)];
}

/**
 * ごはんを食べた後の新しい機嫌スコアを計算する純粋関数（0〜100でクランプ）
 */
export function calculateFedMood(currentScore: number, boost: number): number {
  return Math.max(MIN_MOOD_SCORE, Math.min(MAX_MOOD_SCORE, currentScore + boost));
}
