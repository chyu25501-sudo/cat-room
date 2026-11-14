import { AppSettings, DEFAULT_APP_SETTINGS } from '../types/settings.ts';

/**
 * localStorage から読み込んだ任意の生データを安全な AppSettings にサニタイズする純粋関数
 * 壊れたデータや古いバージョンからのデータでも安全にデフォルト値で復帰します
 *
 * @param raw 読み込んだ生データ
 * @returns 検証・サニタイズ済みの AppSettings
 */
export function sanitizeSettings(raw: unknown): AppSettings {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_APP_SETTINGS };
  }

  const obj = raw as Record<string, unknown>;
  const soundEnabled =
    typeof obj.soundEnabled === 'boolean'
      ? obj.soundEnabled
      : DEFAULT_APP_SETTINGS.soundEnabled;

  return {
    soundEnabled,
  };
}
