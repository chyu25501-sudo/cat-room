import { describe, it, expect } from 'vitest';
import {
  FOOD_ITEMS,
  getFoodById,
  getEatingMessage,
  calculateFedMood,
} from './catCare.ts';

describe('catCare ユーティリティ (第6週: お世話・ごはん純粋関数テスト)', () => {
  it('FOOD_ITEMS に3種類のごはん（カリカリ、ねこ缶、おやつピューレ）が定義されていること', () => {
    expect(FOOD_ITEMS).toHaveLength(3);
    const ids = FOOD_ITEMS.map((f) => f.id);
    expect(ids).toEqual(['kibble', 'canned', 'treat']);

    // それぞれブースト値が昇順に設定されていること
    expect(FOOD_ITEMS[0].moodBoost).toBe(18); // カリカリ
    expect(FOOD_ITEMS[1].moodBoost).toBe(28); // ねこ缶
    expect(FOOD_ITEMS[2].moodBoost).toBe(38); // おやつピューレ

    // それぞれアイコンが設定されていること
    expect(FOOD_ITEMS[0].icon).toBe('🥣');
    expect(FOOD_ITEMS[1].icon).toBe('🐟');
    expect(FOOD_ITEMS[2].icon).toBe('🍦');
  });

  it('getFoodById: 指定したIDのごはん情報を正しく取得できること', () => {
    const kibble = getFoodById('kibble');
    expect(kibble.name).toBe('カリカリ');

    const canned = getFoodById('canned');
    expect(canned.name).toBe('ねこ缶（まぐろ）');

    const treat = getFoodById('treat');
    expect(treat.name).toBe('おやつピューレ');

    // 存在しないIDの場合は先頭のアイテムをフォールバックとして返すこと
    // @ts-expect-error テスト用不正ID
    const fallback = getFoodById('unknown');
    expect(fallback.id).toBe('kibble');
  });

  it('getEatingMessage: 猫の種類に応じたもぐもぐメッセージが返されること', () => {
    const treat = getFoodById('treat');

    // 黒猫
    const blackMsg = getEatingMessage(treat, 'black', () => 0.0);
    expect(treat.eatingMessages.black).toContain(blackMsg);

    // 白猫
    const whiteMsg = getEatingMessage(treat, 'white', () => 0.0);
    expect(treat.eatingMessages.white).toContain(whiteMsg);
  });

  it('すべてのごはんメッセージが人間の言語（おいしい、ウマウマ、しあわせ等）を含まず、猫の鳴き声・擬音・喉鳴らし音であること', () => {
    const forbiddenPhrases = [
      'おいしい',
      'ウマウマ',
      'んま',
      'ごちそうさま',
      'しあわせ',
      'とろける',
      '極上',
      'たまらない',
      '止まらない',
    ];

    for (const food of FOOD_ITEMS) {
      for (const catId of ['black', 'white'] as const) {
        for (const msg of food.eatingMessages[catId]) {
          for (const phrase of forbiddenPhrases) {
            expect(msg).not.toContain(phrase);
          }
        }
      }
    }
  });

  it('calculateFedMood: ごはんを与えた際にごきげん度が加算され、上限100でクランプされること', () => {
    // 20 + 18 = 38
    expect(calculateFedMood(20, 18)).toBe(38);

    // 80 + 38 = 118 -> 100 にクランプ
    expect(calculateFedMood(80, 38)).toBe(100);

    // 100 + 28 = 100
    expect(calculateFedMood(100, 28)).toBe(100);
  });
});
