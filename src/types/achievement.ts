import { CareStats } from './journal.ts';
import { GiftInventory } from './gift.ts';

/**
 * 実績（アチーブメント）の識別子
 */
export type AchievementId =
  | 'first-pet'
  | 'first-feed'
  | 'first-play'
  | 'mood-ecstatic'
  | 'first-gift'
  | 'fullness-full'
  | 'streak-3'
  | 'streak-7'
  | 'streak-14'
  | 'streak-30'
  | 'total-days-7'
  | 'total-days-14'
  | 'total-days-30'
  | 'pet-count-100'
  | 'pet-count-500'
  | 'pet-count-1000'
  | 'pet-count-5000'
  | 'pet-count-10000'
  | 'feed-count-100'
  | 'feed-count-500'
  | 'feed-count-1000'
  | 'feed-count-5000'
  | 'feed-count-10000'
  | 'play-count-100'
  | 'play-count-500'
  | 'play-count-1000'
  | 'play-count-5000'
  | 'play-count-10000'
  | 'gift-count-20'
  | 'gift-count-100'
  | 'gift-count-222'
  | 'gift-count-500'
  | 'gift-count-1000'
  | 'first-rare-gift'
  | 'first-super-rare-gift'
  | 'first-ultra-rare-gift'
  | 'first-rename-cat'
  | 'affection-level-5'
  | 'affection-level-10'
  | 'all-cats-loved'
  | 'all-cats-affection-3'
  | 'all-cats-affection-10'
  | 'perfect-satisfaction'
  | 'unique-gifts-10'
  | 'unique-gifts-40'
  | 'hidden-pebble-set'
  | 'hidden-branch-set'
  | 'hidden-clover-set'
  | 'hidden-cicada-set'
  | 'hidden-ice-stick-set'
  | 'hidden-feather-set'
  | 'hidden-gem-set'
  | 'hidden-dragon-set'
  | 'hidden-dandelion-seed-set'
  | 'hidden-super-rare-trio-set'
  | 'hidden-ultra-rare-set'
  | 'hidden-rainbow-colors-set'
  | 'hidden-pair-socks'
  | 'hidden-cat-treasures-set'
  | 'hidden-shiny-shiny-set'
  | string;

/**
 * 実績のカテゴリ種別
 * - interaction: ふれあい（なでる・ごきげん・なつき度・日数・名前）
 * - care: お世話（ごはん・おもちゃ・まんぷく）
 * - gift: おくりもの（ギフト受取・レアギフト・おくりもの収集隠し実績）
 */
export type AchievementCategory = 'interaction' | 'care' | 'gift';

/**
 * 実績アイテムの定義情報
 */
export interface AchievementItem {
  /** 実績の一意識別子 */
  id: AchievementId;
  /** 実績の名称（例: "はじめまして！"） */
  title: string;
  /** 実績の達成条件・説明文 */
  description: string;
  /** アイコンの種類 */
  iconType: 'paw' | 'food' | 'toy' | 'sparkle' | 'gift' | 'calendar' | string;
  /** 実績のカテゴリ */
  category?: AchievementCategory;
  /**
   * 隠し実績フラグ
   * - true の場合: 獲得するまで実績一覧で名前と獲得条件の両方が伏せ字になります（枠の存在のみ分かる）
   * - false または省略時: 通常の実績となり、獲得前は名前のみ伏せ字になり獲得条件は表示されます
   */
  isHidden?: boolean;
}

/**
 * 解除された実績の記録
 */
export interface AchievementRecord {
  /** 実績ID */
  id: AchievementId;
  /** 達成日時（UNIXタイムスタンプ） */
  unlockedAt: number;
}

/**
 * 実績解除マップ（achievementId -> AchievementRecord）
 * localStorage への永続化対象
 */
export type UnlockedAchievements = Record<AchievementId, AchievementRecord>;

/**
 * 実績解除トースト通知オブジェクト
 */
export interface AchievementToast {
  /** 実績ID */
  id: AchievementId;
  /** 実績タイトル */
  title: string;
  /** 実績説明文 */
  description: string;
  /** トースト生成日時（UNIXタイムスタンプ） */
  timestamp: number;
}

/**
 * 実績画面での達成状況絞り込み条件（'all': すべて, 'unlocked': 達成済みのみ, 'locked': 未達成のみ）
 */
export type AchievementStatusFilter = 'all' | 'unlocked' | 'locked';

/**
 * 実績の進捗度情報
 */
export interface AchievementProgress {
  /** 現在の達成数値 */
  current: number;
  /** 目標数値 */
  target: number;
  /** 数値の単位（例: '回', '日', '個', '種類', 'Lv', '匹'） */
  unit: string;
  /** 分数形式の表示文字列（例: '25 / 100 回'） */
  fractionText: string;
}

/**
 * 実績の進捗状況を計算するためのデータコンテキスト
 */
export interface AchievementProgressContext {
  /** ふり返り手帳のお世話統計データ */
  careStats?: CareStats;
  /** 現在のおくりものインベントリ */
  giftInventory?: GiftInventory;
  /** 全猫の中の最高なつき度レベル */
  maxAffectionLevel?: number;
  /** 全猫の中の最低なつき度レベル */
  minAffectionLevel?: number;
}

