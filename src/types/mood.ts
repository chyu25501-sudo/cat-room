import { CatId } from './cat.ts';

/**
 * 猫の機嫌レベル（4段階）
 * - annoyed: ごきげんななめ（撫ですぎによる愛撫誘発性攻撃・不機嫌状態）
 * - normal: おだやか（初期・平常状態）
 * - happy: ごきげん（なでられて嬉しそうにしている）
 * - ecstatic: ごきげんMAX（なでなでが大好きで甘えん坊モード）
 */
export type CatMoodLevel = 'annoyed' | 'normal' | 'happy' | 'ecstatic';

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
  /** 最後に撫でられた時点のスコア（減衰計算基準値） */
  baseScore?: number;
  /** 不機嫌（愛撫誘発性攻撃行動）状態が継続する期限タイムスタンプ（ミリ秒） */
  annoyedUntil?: number;
  /** 直近の撫でられたタイムスタンプ配列（過剰刺激判定用、ミリ秒） */
  recentPetTimes?: number[];
}

/**
 * 猫ごとの機嫌状態マップ
 */
export type CatsMoodMap = Record<CatId, CatMoodState>;

