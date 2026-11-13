import { CatId } from './cat.ts';
import { GiftItem } from './gift.ts';

/** なつき度レベル（1 〜 10） */
export type CatAffectionLevel = number;

/** 猫1匹のなつき度ステータス */
export interface CatAffectionState {
  /** 現在のなつき度レベル（1 〜 10） */
  level: CatAffectionLevel;
  /** 現在のレベルにおける累積ゲージ経験値（0 〜 requiredExp） */
  currentExp: number;
  /** 次のレベルまでに必要な経験値（Lv.10 MAX時は0または最大値） */
  requiredExp: number;
}

/** 全猫のなつき度マップ */
export type CatsAffectionMap = Record<CatId, CatAffectionState>;

/** ふれあい（なでる・ごはん・おもちゃ）によるなつき度Exp加算結果 */
export interface AffectionGainResult {
  /** 加算前のレベル */
  previousLevel: CatAffectionLevel;
  /** 加算後のレベル */
  nextLevel: CatAffectionLevel;
  /** レベルアップまたは最大時ゲージ満タン演出トリガー */
  isLevelUp: boolean;
  /** 最大レベル到達後のループゲージ満タンボーナスかどうか */
  isMaxBonus?: boolean;
  /** 加算後の現在Exp */
  currentExp: number;
  /** 現在のレベルの必要Exp */
  requiredExp: number;
  /** 今回獲得したExp */
  gainedExp: number;
  /** ゲージの進行度パーセンテージ（0 〜 100%） */
  progressPercentage: number;
}

/** なつき度レベルアップ演出のトリガーデータ */
export interface AffectionLevelUpTriggerPayload {
  /** 上昇後のレベル（1 〜 10） */
  level: CatAffectionLevel;
  /** 対象の猫の名称 */
  catName: string;
  /** レベルアップ時の称号（肩書き） */
  title: string;
  /** 最大レベル到達後のループゲージ満タンボーナスかどうか */
  isMaxBonus?: boolean;
  /** レベルアップまたはゲージ満タン時に猫からもらったおくりもの */
  gift?: GiftItem;
}

/** なつき度レベルアップ演出の表示ステート */
export interface AffectionLevelUpState extends AffectionLevelUpTriggerPayload {
  /** フェードアウト中フラグ */
  isFading: boolean;
}

