import { FoodId, FoodItem, ToyId, ToyItem, LastCareAction } from '../types/care.ts';
import { CatId } from '../types/cat.ts';
import { CatMoodLevel } from '../types/mood.ts';
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

/**
 * 選択可能なおもちゃアイテム一覧（3種類）
 */
export const TOY_ITEMS: readonly ToyItem[] = [
  {
    id: 'teaser',
    name: 'ねこじゃらし',
    subtitle: 'ふわふわ羽根で狩猟本能刺激',
    iconType: 'teaser',
    icon: '🪶',
    moodBoost: 16,
    playMessages: {
      black: ['カシャカシャ…ニャッ！', 'パシッ！…ミャオ！', 'ウニャ〜！…ササッ！'],
      white: ['チョイチョイ…ふにゃ♪', 'パシパシ…クニャ！', 'フニャッ！…ゴロゴロ…'],
    },
    themeClass: 'from-amber-400 to-yellow-500 text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'ball',
    name: '毛糸ボール',
    subtitle: 'コロコロ転がしてケリケリ',
    iconType: 'ball',
    icon: '🧶',
    moodBoost: 26,
    playMessages: {
      black: ['コロコロ…ダダダッ！', 'ケリケリ…ミャオ〜！', 'ガシッ…！ンニャ〜！'],
      white: ['コロコロ…スチャッ！', 'ケリケリ…ふにゃ〜ん♪', 'トテトテ…クニャ〜♪'],
    },
    themeClass: 'from-emerald-400 to-teal-500 text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'laser',
    name: 'レーザーポインター',
    subtitle: 'すばやい光を俊敏に追跡',
    iconType: 'laser',
    icon: '🔴',
    moodBoost: 36,
    playMessages: {
      black: ['カカカッ…！', 'シュバッ…！ミャッ！', 'ダダダッ…ンニャ〜〜！'],
      white: ['ピョンッ！…ふにゃあ！', 'カカッ…クニャ〜ン！', 'バシッ！…ふにゃあぁ！'],
    },
    themeClass: 'from-rose-400 to-red-500 text-rose-700 bg-rose-50 border-rose-200',
  },
] as const;

/**
 * IDからおもちゃアイテムを取得する純粋関数
 */
export function getToyById(id: ToyId): ToyItem {
  const item = TOY_ITEMS.find((t) => t.id === id);
  return item ?? TOY_ITEMS[0];
}

/**
 * おもちゃで遊んだときの猫のメッセージを取得する純粋関数
 */
export function getPlayMessage(
  toy: ToyItem,
  catId: CatId,
  randomFn: () => number = Math.random
): string {
  const list = toy.playMessages[catId] ?? toy.playMessages.black;
  if (!list || list.length === 0) {
    return 'ニャッ…！ダダダッ！';
  }
  const index = Math.floor(randomFn() * list.length);
  return list[Math.min(index, list.length - 1)];
}

/**
 * おもちゃで遊んだ後の新しい機嫌スコアを計算する純粋関数（0〜100でクランプ）
 */
export function calculatePlayedMood(currentScore: number, boost: number): number {
  return Math.max(MIN_MOOD_SCORE, Math.min(MAX_MOOD_SCORE, currentScore + boost));
}

export interface FootBadgeParams {
  moodLevel: CatMoodLevel;
  isEating?: boolean;
  activeFood?: FoodItem | null;
  isPlayingToy?: boolean;
  activeToy?: ToyItem | null;
  lastAction?: LastCareAction | null;
}

/**
 * 猫の足元に表示するインタラクションガイドバッジのメッセージを決定する純粋関数
 * 直前の動作（ごはん・おもちゃ・なでる）や食事・遊び中ステータスに応じて最適なテキストを生成
 */
export function getFootBadgeMessage(params: FootBadgeParams): string {
  const { moodLevel, isEating, activeFood, isPlayingToy, activeToy, lastAction } = params;

  if (isEating && activeFood) {
    return `モグモグ…♪（${activeFood.name}をお食事中）`;
  }

  if (isPlayingToy && activeToy) {
    return `ワクワク…♪（${activeToy.name}であそび中）`;
  }

  if (moodLevel === 'annoyed') {
    return 'なですぎ注意！少し休ませてあげよう';
  }

  if (lastAction === 'feed') {
    switch (moodLevel) {
      case 'ecstatic':
        return 'お腹いっぱいで大満足…♡（ごきげんMAX）';
      case 'happy':
        return '美味しくて満足そうにしています♪';
      case 'normal':
      default:
        return '美味しかったニャ〜（なでてみてね）';
    }
  }

  if (lastAction === 'play') {
    switch (moodLevel) {
      case 'ecstatic':
        return '夢中で遊んで大満足…♡（ごきげんMAX）';
      case 'happy':
        return '楽しく遊んで満足そうにしています♪';
      case 'normal':
      default:
        return '楽しかったニャ〜（なでてみてね）';
    }
  }

  // なでなで（pet）、または未指定（デフォルト）
  switch (moodLevel) {
    case 'ecstatic':
      return 'ゴロゴロ…♡（ごきげんMAX）';
    case 'happy':
      return 'うれしそうになでられています♪';
    case 'normal':
    default:
      return 'なでなで（ドラッグ）してふれあう';
  }
}

