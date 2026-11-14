/**
 * アプリケーションの全体設定インターフェース
 */
export interface AppSettings {
  /** サウンド（鳴き声・効果音）の再生を有効にするかどうか（デフォルト: true） */
  soundEnabled: boolean;
}

/** 設定のデフォルト値 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  soundEnabled: true,
};

/** localStorage 保存用キー */
export const SETTINGS_STORAGE_KEY = 'nekoppoi_settings';
