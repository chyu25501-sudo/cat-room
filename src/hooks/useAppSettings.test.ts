import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppSettings } from './useAppSettings.ts';
import { SETTINGS_STORAGE_KEY } from '../types/settings.ts';

describe('useAppSettings フック', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態ではサウンドがデフォルトでオン（true）であること', () => {
    const { result } = renderHook(() => useAppSettings());
    expect(result.current.isSoundEnabled).toBe(true);
    expect(result.current.settings.soundEnabled).toBe(true);
  });

  it('localStorage に保存された設定がある場合はそれを初期値として読み込むこと', () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ soundEnabled: false }));
    const { result } = renderHook(() => useAppSettings());
    expect(result.current.isSoundEnabled).toBe(false);
  });

  it('setSoundEnabled で設定を変更でき、localStorage にも反映されること', () => {
    const { result } = renderHook(() => useAppSettings());

    act(() => {
      result.current.setSoundEnabled(false);
    });

    expect(result.current.isSoundEnabled).toBe(false);
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(stored.soundEnabled).toBe(false);

    act(() => {
      result.current.setSoundEnabled(true);
    });

    expect(result.current.isSoundEnabled).toBe(true);
    const updated = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(updated.soundEnabled).toBe(true);
  });

  it('toggleSound で設定をトグル反転できること', () => {
    const { result } = renderHook(() => useAppSettings());
    expect(result.current.isSoundEnabled).toBe(true);

    act(() => {
      result.current.toggleSound();
    });
    expect(result.current.isSoundEnabled).toBe(false);

    act(() => {
      result.current.toggleSound();
    });
    expect(result.current.isSoundEnabled).toBe(true);
  });
});
