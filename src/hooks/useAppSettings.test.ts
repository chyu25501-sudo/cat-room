import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppSettings } from './useAppSettings.ts';
import { SETTINGS_STORAGE_KEY, DEFAULT_CAT_NAMES } from '../types/settings.ts';

describe('useAppSettings フック', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態ではサウンドがオン、猫の名前がデフォルト値、ゲージ表示位置が bottom（下部・標準）であること', () => {
    const { result } = renderHook(() => useAppSettings());
    expect(result.current.isSoundEnabled).toBe(true);
    expect(result.current.catNames).toEqual(DEFAULT_CAT_NAMES);
    expect(result.current.gaugePosition).toBe('bottom');
  });

  it('setGaugePosition でゲージの表示位置を side に変更でき、localStorage にも反映されること', () => {
    const { result } = renderHook(() => useAppSettings());

    act(() => {
      result.current.setGaugePosition('side');
    });

    expect(result.current.gaugePosition).toBe('side');
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(stored.gaugePosition).toBe('side');
  });

  it('localStorage に保存された猫の名前設定がある場合はそれを読み込むこと', () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        soundEnabled: true,
        catNames: { black: 'クロ', white: 'シロ', calico: 'ミケ' },
      })
    );
    const { result } = renderHook(() => useAppSettings());
    expect(result.current.catNames.black).toBe('クロ');
    expect(result.current.catNames.white).toBe('シロ');
    expect(result.current.catNames.calico).toBe('ミケ');
  });

  it('setCatName で特定の猫の名前を変更でき、localStorage にも反映されること', () => {
    const { result } = renderHook(() => useAppSettings());

    act(() => {
      result.current.setCatName('black', 'クロスケ');
    });

    expect(result.current.catNames.black).toBe('クロスケ');
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(stored.catNames.black).toBe('クロスケ');
  });

  it('resetCatNames で全ての猫の名前をデフォルトに戻せること', () => {
    const { result } = renderHook(() => useAppSettings());

    act(() => {
      result.current.setCatName('black', 'クロ');
      result.current.setCatName('white', 'シロ');
    });
    expect(result.current.catNames.black).toBe('クロ');

    act(() => {
      result.current.resetCatNames();
    });
    expect(result.current.catNames).toEqual(DEFAULT_CAT_NAMES);
  });

  it('なつき度演出の簡略化設定を切り替えられ、localStorage にも反映されること', () => {
    const { result } = renderHook(() => useAppSettings());
    expect(result.current.isCompactAffectionCelebration).toBe(false);

    act(() => {
      result.current.setCompactAffectionCelebration(true);
    });
    expect(result.current.isCompactAffectionCelebration).toBe(true);
    let stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(stored.compactAffectionCelebration).toBe(true);

    act(() => {
      result.current.toggleCompactAffectionCelebration();
    });
    expect(result.current.isCompactAffectionCelebration).toBe(false);
    stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(stored.compactAffectionCelebration).toBe(false);
  });
});
