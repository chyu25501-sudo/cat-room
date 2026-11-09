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
  /** 与えた時のごきげん度上昇値（パーセント） */
  moodBoost: number;
  /** 猫の種類ごとのもぐもぐセリフ・鳴き声 */
  eatingMessages: Record<CatId, readonly string[]>;
  /** アイコン背景・バッジ用カラー（Tailwindクラス） */
  themeClass: string;
}

/** お世話メニューのカテゴリ（第6週: まずはごはん、将来のおもちゃ等にも拡張可能） */
export type CareCategory = 'food';
