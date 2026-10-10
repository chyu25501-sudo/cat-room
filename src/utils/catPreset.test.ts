import { describe, it, expect } from 'vitest';
import {
  getNextCatPreset,
  getCatPresetById,
  getRandomMeowMessage,
  calculateVariedPitch,
} from './catPreset.ts';
import { CatPreset, CAT_PRESETS } from '../types/cat.ts';

describe('catPreset ユーティリティ', () => {
  it('getNextCatPreset: black から white へ、white から black へ循環切り替えできること', () => {
    const nextAfterBlack = getNextCatPreset('black');
    expect(nextAfterBlack.id).toBe('white');

    const nextAfterWhite = getNextCatPreset('white');
    expect(nextAfterWhite.id).toBe('black');
  });

  it('getNextCatPreset: 3種類以上のプリセットが存在する場合も順番に循環すること', () => {
    const customPresets: CatPreset[] = [
      { id: 'black', name: '黒', poseName: '座り', label: '黒', description: '', defaultPitch: 1, meowMessages: ['ニャ'] },
      { id: 'white', name: '白', poseName: '寝転がり', label: '白', description: '', defaultPitch: 1.1, meowMessages: ['ミャ'] },
      { id: 'black', name: '三毛', poseName: '伸び', label: '三毛', description: '', defaultPitch: 1.2, meowMessages: ['ニャー'] },
    ];
    const first = customPresets[0];
    const second = getNextCatPreset(first.id, customPresets);
    expect(second.name).toBe('白');
  });

  it('getCatPresetById: 存在するIDで正しいプリセットが取得でき、存在しない場合は先頭にフォールバックすること', () => {
    const black = getCatPresetById('black');
    expect(black.id).toBe('black');
    expect(black.name).toBe('くろねこ');

    const white = getCatPresetById('white');
    expect(white.id).toBe('white');
    expect(white.name).toBe('しろねこ');

    // 不正なID
    const fallback = getCatPresetById('unknown' as any);
    expect(fallback.id).toBe('black');
  });

  it('getRandomMeowMessage: プリセット内のメッセージのいずれかが返されること', () => {
    const whitePreset = CAT_PRESETS.find((p) => p.id === 'white')!;
    const msg = getRandomMeowMessage(whitePreset);
    expect(whitePreset.meowMessages).toContain(msg);
  });

  it('calculateVariedPitch: 基本ピッチの近傍値が返されること', () => {
    const pitch = calculateVariedPitch(1.0);
    expect(pitch).toBeGreaterThanOrEqual(0.95);
    expect(pitch).toBeLessThanOrEqual(1.05);
  });
});

