import { CatId } from './cat.ts';

export type FoodId = 'kibble' | 'canned' | 'treat';

export interface FoodItem {
  /** ごはんの一意識別子 */
  id: FoodId;
  /** ごはんの名称（例: "カリカリ", "ねこ缶（まぐろ）", "おやつピューレ"） */
  name: string;
  /** 簡単な説明やサブタイトル（例: "定番の総合栄養食"） */
  subtitle: string;
  /** アイコンの種類 */
  iconType: 'bowl' | 'can' | 'treat';
  /** 表示用絵文字アイコン（例: "🥣", "🐟", "🍦"） */
  icon: string;
  /** 与えた時のごきげん度上昇値（パーセント） */
  moodBoost: number;
  /** 猫の種類ごとのもぐもぐセリフ・鳴き声 */
  eatingMessages: Record<CatId, readonly string[]>;
  /** アイコン背景・バッジ用カラー（Tailwindクラス） */
  themeClass: string;
}

export type ToyId = 'teaser' | 'ball' | 'laser';

export interface ToyItem {
  /** おもちゃの一意識別子 */
  id: ToyId;
  /** おもちゃの名称（例: "ねこじゃらし", "毛糸ボール", "レーザーポインター"） */
  name: string;
  /** 簡単な説明やサブタイトル（例: "ふわふわ羽根で狩猟本能刺激"） */
  subtitle: string;
  /** アイコンの種類 */
  iconType: 'teaser' | 'ball' | 'laser';
  /** 表示用絵文字アイコン（例: "🪶", "🧶", "🔴"） */
  icon: string;
  /** 遊んだ時のごきげん度上昇値（パーセント） */
  moodBoost: number;
  /** 猫の種類ごとの遊んだときのセリフ・鳴き声・興奮音 */
  playMessages: Record<CatId, readonly string[]>;
  /** アイコン背景・バッジ用カラー（Tailwindクラス） */
  themeClass: string;
}

/** お世話メニューのカテゴリ（第6週: ごはん・おもちゃ） */
export type CareCategory = 'food' | 'toy';
