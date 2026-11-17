import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  DEFAULT_CAT_NAMES,
  CatCustomNames,
  GaugeDisplayPosition,
} from '../types/settings.ts';
import { CatId, CatPreset, CAT_PRESETS } from '../types/cat.ts';

/**
 * 猫IDから現在の有効な表示名を取得する純粋関数
 * 空白文字のみや未設定の場合はデフォルト名（「くろねこ」等）を返します
 */
export function getCatDisplayName(
  catId: CatId,
  customNames?: Partial<Record<CatId, string>>
): string {
  const custom = customNames?.[catId]?.trim();
  if (custom && custom.length > 0) {
    return custom;
  }
  return DEFAULT_CAT_NAMES[catId] ?? catId;
}

/**
 * プリセットの name と label をカスタム名で解決（オーバーライド）した新しいプリセットを返す純粋関数
 */
export function resolveCatPreset(
  preset: CatPreset,
  customNames?: Partial<Record<CatId, string>>
): CatPreset {
  const name = getCatDisplayName(preset.id, customNames);
  return {
    ...preset,
    name,
    label: `${name}（${preset.poseName}）`,
  };
}

/**
 * プリセット一覧の全アイテムをカスタム名で解決した配列を返す純粋関数
 */
export function resolveCatPresets(
  presets: readonly CatPreset[] = CAT_PRESETS,
  customNames?: Partial<Record<CatId, string>>
): CatPreset[] {
  return presets.map((preset) => resolveCatPreset(preset, customNames));
}

/**
 * 任意のテキストに含まれる「くろねこ」「しろねこ」「みけねこ」をカスタム名に置換する純粋関数
 */
export function replaceCatNames(
  text: string,
  customNames?: Partial<Record<CatId, string>>
): string {
  if (!text) return text;
  let result = text;
  for (const catId of ['black', 'white', 'calico'] as const) {
    const defaultName = DEFAULT_CAT_NAMES[catId];
    const customName = customNames?.[catId]?.trim();
    if (customName && customName.length > 0 && customName !== defaultName) {
      result = result.replaceAll(defaultName, customName);
    }
  }
  return result;
}

/**
 * localStorage から読み込んだ任意の生データを安全な AppSettings にサニタイズする純粋関数
 * 壊れたデータや古いバージョンからのデータでも安全にデフォルト値で復帰します
 *
 * @param raw 読み込んだ生データ
 * @returns 検証・サニタイズ済みの AppSettings
 */
export function sanitizeSettings(raw: unknown): AppSettings {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      soundEnabled: DEFAULT_APP_SETTINGS.soundEnabled,
      catNames: { ...DEFAULT_CAT_NAMES },
      gaugePosition: DEFAULT_APP_SETTINGS.gaugePosition,
      autoFeedEnabled: DEFAULT_APP_SETTINGS.autoFeedEnabled,
      compactAffectionCelebration: DEFAULT_APP_SETTINGS.compactAffectionCelebration,
    };
  }

  const obj = raw as Record<string, unknown>;
  const soundEnabled =
    typeof obj.soundEnabled === 'boolean'
      ? obj.soundEnabled
      : DEFAULT_APP_SETTINGS.soundEnabled;

  const autoFeedEnabled =
    typeof obj.autoFeedEnabled === 'boolean'
      ? obj.autoFeedEnabled
      : DEFAULT_APP_SETTINGS.autoFeedEnabled;

  const compactAffectionCelebration =
    typeof obj.compactAffectionCelebration === 'boolean'
      ? obj.compactAffectionCelebration
      : DEFAULT_APP_SETTINGS.compactAffectionCelebration;

  const rawNames =
    obj.catNames && typeof obj.catNames === 'object' && !Array.isArray(obj.catNames)
      ? (obj.catNames as Record<string, unknown>)
      : {};

  const catNames: CatCustomNames = {
    black:
      typeof rawNames.black === 'string' && rawNames.black.trim().length > 0
        ? rawNames.black.trim()
        : DEFAULT_CAT_NAMES.black,
    white:
      typeof rawNames.white === 'string' && rawNames.white.trim().length > 0
        ? rawNames.white.trim()
        : DEFAULT_CAT_NAMES.white,
    calico:
      typeof rawNames.calico === 'string' && rawNames.calico.trim().length > 0
        ? rawNames.calico.trim()
        : DEFAULT_CAT_NAMES.calico,
  };

  const gaugePosition: GaugeDisplayPosition =
    obj.gaugePosition === 'side' ? 'side' : 'bottom';

  return {
    soundEnabled,
    catNames,
    gaugePosition,
    autoFeedEnabled,
    compactAffectionCelebration,
  };
}
