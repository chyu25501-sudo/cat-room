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
  | 'first-rename-cat'
  | string;

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
