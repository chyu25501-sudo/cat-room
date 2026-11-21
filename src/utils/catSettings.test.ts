import { describe, it, expect } from 'vitest';
import {
  sanitizeSettings,
  getCatDisplayName,
  resolveCatPreset,
  resolveCatPresets,
  replaceCatNames,
} from './catSettings.ts';
import { DEFAULT_APP_SETTINGS, DEFAULT_CAT_NAMES } from '../types/settings.ts';
import { CAT_PRESETS } from '../types/cat.ts';

describe('catSettings ユーティリティ (設定サニタイズ・名前解決純粋関数テスト)', () => {
  describe('getCatDisplayName', () => {
    it('カスタム名が未指定または空文字のときはデフォルト名を返すこと', () => {
      expect(getCatDisplayName('black')).toBe('くろねこ');
      expect(getCatDisplayName('black', {})).toBe('くろねこ');
      expect(getCatDisplayName('black', { black: '' })).toBe('くろねこ');
      expect(getCatDisplayName('black', { black: '   ' })).toBe('くろねこ');
      expect(getCatDisplayName('white')).toBe('しろねこ');
      expect(getCatDisplayName('calico')).toBe('みけねこ');
    });

    it('カスタム名が設定されている場合はトリムしてその名前を返すこと', () => {
      expect(getCatDisplayName('black', { black: 'クロ' })).toBe('クロ');
      expect(getCatDisplayName('white', { white: ' ユキ ' })).toBe('ユキ');
      expect(getCatDisplayName('calico', { calico: 'ミケちゃん' })).toBe('ミケちゃん');
    });
  });

  describe('resolveCatPreset & resolveCatPresets', () => {
    it('カスタム名で name と label が正しくオーバーライドされること', () => {
      const black = CAT_PRESETS[0];
      const resolved = resolveCatPreset(black, { black: 'ノワール' });

      expect(resolved.id).toBe('black');
      expect(resolved.name).toBe('ノワール');
      expect(resolved.label).toBe('ノワール（おすわり）');
    });

    it('resolveCatPresets で全猫のプリセットがカスタム名に解決されること', () => {
      const customNames = { black: 'クロ', white: 'シロ', calico: 'ミケ' };
      const resolvedList = resolveCatPresets(CAT_PRESETS, customNames);

      expect(resolvedList[0].name).toBe('クロ');
      expect(resolvedList[0].label).toBe('クロ（おすわり）');
      expect(resolvedList[1].name).toBe('シロ');
      expect(resolvedList[1].label).toBe('シロ（ごろん）');
      expect(resolvedList[2].name).toBe('ミケ');
      expect(resolvedList[2].label).toBe('ミケ（たち）');
    });
  });

  describe('replaceCatNames', () => {
    it('テキスト内のデフォルト猫名がカスタム名に正しく置き換わること', () => {
      const customNames = { black: 'クロ', white: 'シロ', calico: 'ミケ' };
      const text = 'くろねこがお食事中です♪ しろねこもおくりものをくれました！';
      const replaced = replaceCatNames(text, customNames);

      expect(replaced).toBe('クロがお食事中です♪ シロもおくりものをくれました！');
    });

    it('未設定時はテキストがそのまま返ること', () => {
      const text = 'くろねこがお食事中です♪';
      expect(replaceCatNames(text)).toBe(text);
      expect(replaceCatNames(text, {})).toBe(text);
    });
  });

  describe('sanitizeSettings', () => {
    it('nullや未定義、不正データの場合はデフォルト設定を返すこと', () => {
      expect(sanitizeSettings(null)).toEqual(DEFAULT_APP_SETTINGS);
      expect(sanitizeSettings(undefined)).toEqual(DEFAULT_APP_SETTINGS);
      expect(sanitizeSettings('invalid')).toEqual(DEFAULT_APP_SETTINGS);
    });

    it('soundEnabled と catNames と gaugePosition が正しくサニタイズされ保持されること', () => {
      const raw = {
        soundEnabled: false,
        catNames: {
          black: 'ノワール',
          white: '  ', // 空文字はデフォルトにフォールバック
          calico: '三毛猫さん',
        },
        gaugePosition: 'side',
      };

      const sanitized = sanitizeSettings(raw);
      expect(sanitized.soundEnabled).toBe(false);
      expect(sanitized.catNames.black).toBe('ノワール');
      expect(sanitized.catNames.white).toBe('しろねこ');
      expect(sanitized.catNames.calico).toBe('三毛猫さん');
      expect(sanitized.gaugePosition).toBe('side');
    });

    it('gaugePosition が不正な値の場合はデフォルトの bottom にフォールバックすること', () => {
      const sanitized = sanitizeSettings({ gaugePosition: 'invalid' });
      expect(sanitized.gaugePosition).toBe('bottom');
    });

    it('compactAffectionCelebration が正しくサニタイズされ保持されること（不正値はデフォルトにフォールバック）', () => {
      const enabled = sanitizeSettings({ compactAffectionCelebration: true });
      expect(enabled.compactAffectionCelebration).toBe(true);

      const disabled = sanitizeSettings({ compactAffectionCelebration: false });
      expect(disabled.compactAffectionCelebration).toBe(false);

      const invalid = sanitizeSettings({ compactAffectionCelebration: 'not-a-boolean' });
      expect(invalid.compactAffectionCelebration).toBe(false);
    });

    it('analyticsEnabled が正しくサニタイズされ保持されること（デフォルト true、不正値は true にフォールバック）', () => {
      const enabled = sanitizeSettings({ analyticsEnabled: true });
      expect(enabled.analyticsEnabled).toBe(true);

      const disabled = sanitizeSettings({ analyticsEnabled: false });
      expect(disabled.analyticsEnabled).toBe(false);

      const invalid = sanitizeSettings({ analyticsEnabled: 'invalid' });
      expect(invalid.analyticsEnabled).toBe(true);

      const missing = sanitizeSettings({});
      expect(missing.analyticsEnabled).toBe(true);
    });
  });
});
