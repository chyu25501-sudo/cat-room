import { CatId } from './cat.ts';

/**
 * 猫の機嫌レベル（3段階）
 * - normal: おだやか（初期・平常状態）
 * - happy: ごきげん（なでられて嬉しそうにしている）
 * - ecstatic: ごきげんMAX（なでなでが大好きで甘えん坊モード）
 */
export type CatMoodLevel = 'normal' | 'happy' | 'ecstatic';

export interface CatMoodInfo {
  level: CatMoodLevel;
  /** 日本語表示名（例: "おだやか", "ごきげん", "ごきげんMAX"） */
  label: string;
  /** アイコン絵文字 */
  emoji: string;
  /** 簡単な状態説明 */
  description: string;
  /** テーマカラー（Tailwindクラス） */
  colorClass: string;
  /** 背景バッジ色（Tailwindクラス） */
  badgeClass: string;
}

export interface CatMoodState {
  /** 現在のごきげんスコア（0 〜 100） */
  score: number;
  /** 最後に撫でられたタイムスタンプ（ミリ秒） */
  lastPetAt: number;
}

/**
 * 猫ごとの機嫌状態マップ
 */
export type CatsMoodMap = Record<CatId, CatMoodState>;

