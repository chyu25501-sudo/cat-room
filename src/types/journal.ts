/**
 * ふり返り手帳（Care Journal）の統計データ型定義
 */

export interface CareStats {
  /** 初めて猫とふれあった日時（UNIXタイムスタンプ ms、未ふれあいの場合は null） */
  firstInteractionAt: number | null;
  /** 最後にふれあった日時（UNIXタイムスタンプ ms） */
  lastInteractionAt: number | null;
  /** 最後にふれあった日付文字列 (YYYY-MM-DD、ローカル時間基準) */
  lastInteractionDateStr: string | null;
  /** 猫を撫でた総回数 */
  totalPetCount: number;
  /** ごはんをあげた総回数 */
  totalFeedCount: number;
  /** おもちゃで遊んだ総回数 */
  totalPlayCount: number;
  /** 現在の連続ふれあい日数（Streak） */
  currentStreakDays: number;
  /** 過去最高連続ふれあい日数 */
  maxStreakDays: number;
  /** 累計ふれあい日数（ユニーク日数） */
  totalActiveDays: number;
  /** 猫の種類別ふれあい回数マップ (catId -> ふれあい回数) */
  interactionsByCat: Record<string, number>;
}

/** ふれあいの種類 */
export type CareActionType = 'pet' | 'feed' | 'play';
