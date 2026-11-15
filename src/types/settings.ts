import { CatId } from './cat.ts';

/** 猫ごとのカスタム名 */
export type CatCustomNames = Record<CatId, string>;

/** ゲージ類の表示位置・表示スタイル（'bottom': 猫の下・標準、'side': 猫の横・シンプル簡略化） */
export type GaugeDisplayPosition = 'bottom' | 'side';

/** アプリケーションの全体設定インターフェース */
export interface AppSettings {
  /** サウンド（鳴き声・効果音）の再生を有効にするかどうか（デフォルト: true） */
  soundEnabled: boolean;
  /** 猫ごとの名前設定（未設定・空文字時はデフォルト名） */
  catNames: CatCustomNames;
  /** ごきげん度等のゲージ類の表示位置・スタイル（デフォルト: 'bottom'） */
  gaugePosition: GaugeDisplayPosition;
}

/** 猫のデフォルト名定義 */
export const DEFAULT_CAT_NAMES: CatCustomNames = {
  black: 'くろねこ',
  white: 'しろねこ',
  calico: 'みけねこ',
};

/** 設定のデフォルト値 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  soundEnabled: true,
  catNames: DEFAULT_CAT_NAMES,
  gaugePosition: 'bottom',
};

/** localStorage 保存用キー */
export const SETTINGS_STORAGE_KEY = 'nekoppoi_settings';
