import { useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_APP_SETTINGS, SETTINGS_STORAGE_KEY } from '../types/settings.ts';
import { sanitizeSettings } from '../utils/catSettings.ts';

export interface UseAppSettingsReturn {
  /** 現在の設定オブジェクト */
  settings: AppSettings;
  /** サウンド再生が有効かどうか（デフォルト: true） */
  isSoundEnabled: boolean;
  /** サウンド再生の有効/無効を更新する関数 */
  setSoundEnabled: (enabled: boolean) => void;
  /** サウンド再生の有効/無効を反転（トグル）する関数 */
  toggleSound: () => void;
}

/**
 * アプリケーション設定の読み込み・永続化を行うカスタムフック
 * localStorage へのアクセスを本フック内に隔離し、フォールバック機構を備えます
 */
export function useAppSettings(): UseAppSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!stored) {
        return { ...DEFAULT_APP_SETTINGS };
      }
      return sanitizeSettings(JSON.parse(stored));
    } catch {
      return { ...DEFAULT_APP_SETTINGS };
    }
  });

  // 設定変更時に localStorage へ自動同期
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage が満杯または無効な環境でも画面クラッシュを防止
    }
  }, [settings]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: enabled,
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  return {
    settings,
    isSoundEnabled: settings.soundEnabled,
    setSoundEnabled,
    toggleSound,
  };
}
