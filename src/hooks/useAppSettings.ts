import { useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  DEFAULT_CAT_NAMES,
  CatCustomNames,
  GaugeDisplayPosition,
  SETTINGS_STORAGE_KEY,
} from '../types/settings.ts';
import { CatId } from '../types/cat.ts';
import { sanitizeSettings } from '../utils/catSettings.ts';

export interface UseAppSettingsReturn {
  /** 現在の設定オブジェクト */
  settings: AppSettings;
  /** サウンド再生が有効かどうか（デフォルト: true） */
  isSoundEnabled: boolean;
  /** 猫ごとの名前設定オブジェクト */
  catNames: CatCustomNames;
  /** ゲージの表示位置（'bottom': 下部・標準、'side': 横側・シンプル） */
  gaugePosition: GaugeDisplayPosition;
  /** 自動ごはんが有効かどうか（デフォルト: false） */
  isAutoFeedEnabled: boolean;
  /** サウンド再生の有効/無効を更新する関数 */
  setSoundEnabled: (enabled: boolean) => void;
  /** サウンド再生の有効/無効を反転（トグル）する関数 */
  toggleSound: () => void;
  /** 特定の猫の名前を更新する関数 */
  setCatName: (catId: CatId, name: string) => void;
  /** 全ての猫の名前をデフォルトに戻す関数 */
  resetCatNames: () => void;
  /** ゲージの表示位置・スタイルを更新する関数 */
  setGaugePosition: (position: GaugeDisplayPosition) => void;
  /** 自動ごはんの有効/無効を更新する関数 */
  setAutoFeedEnabled: (enabled: boolean) => void;
  /** 自動ごはんの有効/無効を反転（トグル）する関数 */
  toggleAutoFeed: () => void;
}

/**
 * アプリケーション設定（サウンド・猫の名前）の読み込み・永続化を行うカスタムフック
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
      // localStorage が制限された環境でも画面クラッシュを防止
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

  const setCatName = useCallback((catId: CatId, name: string) => {
    setSettings((prev) => ({
      ...prev,
      catNames: {
        ...prev.catNames,
        [catId]: name,
      },
    }));
  }, []);

  const resetCatNames = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      catNames: { ...DEFAULT_CAT_NAMES },
    }));
  }, []);

  const setGaugePosition = useCallback((position: GaugeDisplayPosition) => {
    setSettings((prev) => ({
      ...prev,
      gaugePosition: position,
    }));
  }, []);

  const setAutoFeedEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      autoFeedEnabled: enabled,
    }));
  }, []);

  const toggleAutoFeed = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      autoFeedEnabled: !prev.autoFeedEnabled,
    }));
  }, []);

  return {
    settings,
    isSoundEnabled: settings.soundEnabled,
    catNames: settings.catNames,
    gaugePosition: settings.gaugePosition,
    isAutoFeedEnabled: settings.autoFeedEnabled,
    setSoundEnabled,
    toggleSound,
    setCatName,
    resetCatNames,
    setGaugePosition,
    setAutoFeedEnabled,
    toggleAutoFeed,
  };
}
