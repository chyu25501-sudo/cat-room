import { CatId } from './cat.ts';

/**
 * 猫のまんぷく度レベル
 * - full: まんぷく（80〜100%）
 * - satisfied: ほどよい（40〜79%）
 * - hungry: 小腹すいた（15〜39%）
 * - starving: ペコペコ（0〜14%）
 */
export type CatFullnessLevel = 'full' | 'satisfied' | 'hungry' | 'starving';

export interface CatFullnessInfo {
  level: CatFullnessLevel;
  label: string;
  emoji: string;
  description: string;
  colorClass: string;
  badgeClass: string;
}

export interface CatFullnessState {
  /** 現在のまんぷく度スコア（0 〜 100） */
  score: number;
  /** 最終給餌（または更新）タイムスタンプ */
  lastFedAt: number;
}

export type CatsFullnessMap = Record<CatId, CatFullnessState>;
