import { AppSettings } from './settings.ts';
import { CatsAffectionMap } from './affection.ts';
import { CatsFullnessMap } from './fullness.ts';
import { GiftInventory } from './gift.ts';
import { AchievementMap } from './achievement.ts';
import { CareStats } from './journal.ts';

/** セーブデータフォーマットの現在のバージョン */
export const SAVE_DATA_VERSION = 1;

/**
 * 「ねこっぽい」の全セーブデータをまとめたデータ構造
 * ファイル書き出し・読み込み（インポート/エクスポート）および
 * 将来のクラウド同期（Supabase等）で共通のペイロードとして使用されます。
 */
export interface NekoppoiSaveData {
  /** フォーマットバージョン（将来のデータ構造変更・マイグレーション用） */
  version: number;
  /** 書き出し（または最終同期）時のUNIXタイムスタンプ（ミリ秒） */
  timestamp: number;
  /** アプリ設定（名前、音、ゲージ位置、簡略化設定など） */
  settings?: AppSettings;
  /** 各猫のなつき度データ */
  affection?: CatsAffectionMap;
  /** 各猫のまんぷく度データ */
  fullness?: CatsFullnessMap;
  /** おくりものインベントリ */
  gifts?: GiftInventory;
  /** 実績データ */
  achievements?: AchievementMap;
  /** ふり返り手帳（お世話統計）データ */
  careJournal?: CareStats;
  /** 最終アクティブ時刻（留守番時間計算用） */
  lastActiveTime?: number;
  /** あそびかた閲覧済みフラグ */
  guideSeen?: boolean;
}
