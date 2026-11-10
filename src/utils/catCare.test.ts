import { describe, it, expect } from 'vitest';
import {
  FOOD_ITEMS,
  TOY_ITEMS,
  BASE_FEEDING_DURATION_MS,
  FEEDING_DURATION_PER_FULLNESS_MS,
  getFoodById,
  getToyById,
  getEatingMessage,
  getPlayMessage,
  calculateFedMood,
  calculateFeedingDurationMs,
  calculatePlayedMood,
  getFootBadgeMessage,
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

  it('calculateFeedingDurationMs: まんぷく度の回復量が多いほど食べる時間が少しだけ長くなること', () => {
    expect(BASE_FEEDING_DURATION_MS).toBe(2400);
    expect(FEEDING_DURATION_PER_FULLNESS_MS).toBe(40);

    const treat = getFoodById('treat'); // fullnessBoost: 15
    const kibble = getFoodById('kibble'); // fullnessBoost: 25
    const canned = getFoodById('canned'); // fullnessBoost: 35

    const treatDuration = calculateFeedingDurationMs(treat.fullnessBoost);
    const kibbleDuration = calculateFeedingDurationMs(kibble.fullnessBoost);
    const cannedDuration = calculateFeedingDurationMs(canned.fullnessBoost);

    // おやつ(+15%): 2400 + 15*40 = 3000ms
    expect(treatDuration).toBe(3000);
    // カリカリ(+25%): 2400 + 25*40 = 3400ms
    expect(kibbleDuration).toBe(3400);
    // ねこ缶(+35%): 2400 + 35*40 = 3800ms
    expect(cannedDuration).toBe(3800);

    // 回復量が多いほど食事時間が長いこと
    expect(treatDuration).toBeLessThan(kibbleDuration);
    expect(kibbleDuration).toBeLessThan(cannedDuration);

    // 0以下の異常値でも下限値（1000ms）を下回らないこと
    expect(calculateFeedingDurationMs(0)).toBe(2400);
    expect(calculateFeedingDurationMs(-10)).toBe(2400);
  });

  describe('おもちゃ純粋関数テスト', () => {
    it('TOY_ITEMS に3種類のおもちゃ（ねこじゃらし、毛糸ボール、レーザーポインター）が定義されていること', () => {
      expect(TOY_ITEMS).toHaveLength(3);
      const ids = TOY_ITEMS.map((t) => t.id);
      expect(ids).toEqual(['teaser', 'ball', 'laser']);

      // ブースト値
      expect(TOY_ITEMS[0].moodBoost).toBe(16);
      expect(TOY_ITEMS[1].moodBoost).toBe(26);
      expect(TOY_ITEMS[2].moodBoost).toBe(36);

      // アイコン
      expect(TOY_ITEMS[0].icon).toBe('🪶');
      expect(TOY_ITEMS[1].icon).toBe('🧶');
      expect(TOY_ITEMS[2].icon).toBe('🔴');
    });

    it('getToyById: 指定したIDのおもちゃ情報を正しく取得できること', () => {
      const teaser = getToyById('teaser');
      expect(teaser.name).toBe('ねこじゃらし');

      const ball = getToyById('ball');
      expect(ball.name).toBe('毛糸ボール');

      const laser = getToyById('laser');
      expect(laser.name).toBe('レーザーポインター');

      // @ts-expect-error テスト用不正ID
      const fallback = getToyById('unknown');
      expect(fallback.id).toBe('teaser');
    });

    it('getPlayMessage: 猫の種類に応じた遊びメッセージが返されること', () => {
      const teaser = getToyById('teaser');

      const blackMsg = getPlayMessage(teaser, 'black', () => 0.0);
      expect(teaser.playMessages.black).toContain(blackMsg);

      const whiteMsg = getPlayMessage(teaser, 'white', () => 0.0);
      expect(teaser.playMessages.white).toContain(whiteMsg);
    });

    it('すべてのおもちゃメッセージが人間の言語（たのしい等）を含まず、猫の鳴き声・擬音・狩猟音であること', () => {
      const forbiddenPhrases = [
        'たのしい',
        'うれしい',
        'おもしろい',
        '遊んで',
        'もっと',
      ];

      for (const toy of TOY_ITEMS) {
        for (const catId of ['black', 'white'] as const) {
          for (const msg of toy.playMessages[catId]) {
            for (const phrase of forbiddenPhrases) {
              expect(msg).not.toContain(phrase);
            }
          }
        }
      }
    });

    it('おもちゃ3種（ねこじゃらし、毛糸ボール、レーザーポインター）それぞれに「ちょいちょい」を含む自然なメッセージが登録されており、冗長な説明文（手でケリケリ等）が含まれていないこと', () => {
      const forbiddenPhrases = ['手でケリケリ', 'ギュッと抱えて', '前足でケリケリ'];

      for (const toy of TOY_ITEMS) {
        for (const catId of ['black', 'white'] as const) {
          const messages = toy.playMessages[catId];
          const hasChoiChoiMsg = messages.some(
            (msg) => msg.includes('ちょいちょい…') || msg.includes('ちょいちょいっ！')
          );
          expect(hasChoiChoiMsg).toBe(true);

          for (const msg of messages) {
            for (const phrase of forbiddenPhrases) {
              expect(msg).not.toContain(phrase);
            }
          }
        }
      }
    });

    it('calculatePlayedMood: 遊んだ際にごきげん度が加算され、上限100でクランプされること', () => {
      expect(calculatePlayedMood(20, 16)).toBe(36);
      expect(calculatePlayedMood(80, 26)).toBe(100);
      expect(calculatePlayedMood(100, 36)).toBe(100);
    });

    it('getFootBadgeMessage: 食事中・遊び中・直前のアクションに応じて適切な足元メッセージを返すこと', () => {
      // 1. 食事中
      expect(
        getFootBadgeMessage({ moodLevel: 'happy', isEating: true, activeFood: FOOD_ITEMS[0] })
      ).toBe('モグモグ…♪（カリカリをお食事中）');

      // 2. 遊び中
      expect(
        getFootBadgeMessage({ moodLevel: 'happy', isPlayingToy: true, activeToy: TOY_ITEMS[0] })
      ).toBe('ワクワク…♪（ねこじゃらしであそび中）');

      // 3. 不機嫌中
      expect(getFootBadgeMessage({ moodLevel: 'annoyed', lastAction: 'feed' })).toBe(
        'なですぎ注意！少し休ませてあげよう'
      );

      // 4. ごはん後（feed）
      expect(getFootBadgeMessage({ moodLevel: 'happy', lastAction: 'feed' })).toBe(
        '美味しくて満足そうにしています♪'
      );
      expect(getFootBadgeMessage({ moodLevel: 'ecstatic', lastAction: 'feed' })).toBe(
        'お腹いっぱいで大満足…♡（ごきげんMAX）'
      );

      // 5. おもちゃ後（play）
      expect(getFootBadgeMessage({ moodLevel: 'happy', lastAction: 'play' })).toBe(
        '楽しく遊んで満足そうにしています♪'
      );
      expect(getFootBadgeMessage({ moodLevel: 'ecstatic', lastAction: 'play' })).toBe(
        '夢中で遊んで大満足…♡（ごきげんMAX）'
      );

      // 6. なでなで後（pet）またはデフォルト
      expect(getFootBadgeMessage({ moodLevel: 'happy', lastAction: 'pet' })).toBe(
        'うれしそうになでられています♪'
      );
      expect(getFootBadgeMessage({ moodLevel: 'normal' })).toBe('なでなで（ドラッグ）してふれあう');
    });
  });
});
