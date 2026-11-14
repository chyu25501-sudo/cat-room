import { describe, it, expect } from 'vitest';
import { sanitizeSettings } from './catSettings.ts';
import { DEFAULT_APP_SETTINGS } from '../types/settings.ts';

describe('catSettings ユーティリティ (設定サニタイズ純粋関数テスト)', () => {
  it('nullや未定義、配列、プリミティブなどの不正データが渡された場合はデフォルト設定を返すこと', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_APP_SETTINGS);
    expect(sanitizeSettings(undefined)).toEqual(DEFAULT_APP_SETTINGS);
    expect(sanitizeSettings('invalid')).toEqual(DEFAULT_APP_SETTINGS);
    expect(sanitizeSettings(123)).toEqual(DEFAULT_APP_SETTINGS);
    expect(sanitizeSettings([1, 2, 3])).toEqual(DEFAULT_APP_SETTINGS);
  });

  it('soundEnabled が正しく boolean で指定されている場合はその値を維持すること', () => {
    expect(sanitizeSettings({ soundEnabled: false })).toEqual({ soundEnabled: false });
    expect(sanitizeSettings({ soundEnabled: true })).toEqual({ soundEnabled: true });
  });

  it('soundEnabled が boolean 以外の不正な型の場合はデフォルト値（true）にフォールバックすること', () => {
    expect(sanitizeSettings({ soundEnabled: 'false' })).toEqual({ soundEnabled: true });
    expect(sanitizeSettings({ soundEnabled: null })).toEqual({ soundEnabled: true });
    expect(sanitizeSettings({})).toEqual({ soundEnabled: true });
  });
});
