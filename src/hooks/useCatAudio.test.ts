import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCatAudio } from './useCatAudio.ts';
import * as catSoundModule from '../utils/catSound.ts';

describe('useCatAudio フック', () => {
  it('soundEnabled: true（デフォルト）のときは playMeowSound が呼び出されること', () => {
    const playSpy = vi.spyOn(catSoundModule, 'playMeowSound').mockImplementation(() => {});
    const { result } = renderHook(() => useCatAudio());

    act(() => {
      result.current.meow();
    });

    expect(playSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(true);
    playSpy.mockRestore();
  });

  it('soundEnabled: false のときは playMeowSound が呼び出されず無音になること', () => {
    const playSpy = vi.spyOn(catSoundModule, 'playMeowSound').mockImplementation(() => {});
    const { result } = renderHook(() => useCatAudio({ soundEnabled: false }));

    act(() => {
      result.current.meow();
    });

    // 音声再生関数は呼ばれない
    expect(playSpy).not.toHaveBeenCalled();
    // 視覚的リアクション（isPlaying）は動作する
    expect(result.current.isPlaying).toBe(true);
    playSpy.mockRestore();
  });

  describe('playFanfare', () => {
    it('soundEnabled: true（デフォルト）のときは playFanfareSound が呼び出されること', () => {
      const fanfareSpy = vi.spyOn(catSoundModule, 'playFanfareSound').mockImplementation(() => {});
      const { result } = renderHook(() => useCatAudio());

      act(() => {
        result.current.playFanfare();
      });

      expect(fanfareSpy).toHaveBeenCalledTimes(1);
      fanfareSpy.mockRestore();
    });

    it('soundEnabled: false のときは playFanfareSound が呼び出されないこと', () => {
      const fanfareSpy = vi.spyOn(catSoundModule, 'playFanfareSound').mockImplementation(() => {});
      const { result } = renderHook(() => useCatAudio({ soundEnabled: false }));

      act(() => {
        result.current.playFanfare();
      });

      expect(fanfareSpy).not.toHaveBeenCalled();
      fanfareSpy.mockRestore();
    });
  });
});
