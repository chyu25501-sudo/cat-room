import { describe, it, expect } from 'vitest';
import {
  MIN_FULLNESS_SCORE,
  MAX_FULLNESS_SCORE,
  DEFAULT_INITIAL_FULLNESS_SCORE,
  DEFAULT_FULLNESS_DECAY_PER_MINUTE,
  FULLNESS_THRESHOLDS,
  DEFAULT_PLAY_FULLNESS_MIN_REDUCTION,
  DEFAULT_PLAY_FULLNESS_MAX_REDUCTION,
  getFullnessLevel,
  getFullnessInfo,
  calculateNextFullness,
  calculateDecayedFullness,
  calculatePlayFullnessReduction,
  calculatePlayedFullness,
} from './catFullness.ts';

describe('catFullness ユーティリティ (純粋関数テスト)', () => {
  it('初期定数が正しく設定されていること', () => {
    expect(MIN_FULLNESS_SCORE).toBe(0);
    expect(MAX_FULLNESS_SCORE).toBe(100);
    expect(DEFAULT_INITIAL_FULLNESS_SCORE).toBe(50);
    expect(DEFAULT_FULLNESS_DECAY_PER_MINUTE).toBe(1); // 1分に1点減衰（ごきげん度の1/4）
  });

  it('getFullnessLevel: スコアに応じた適切なまんぷく度レベルを判定すること', () => {
    // starving: 0 〜 14
    expect(getFullnessLevel(0)).toBe('starving');
    expect(getFullnessLevel(10)).toBe('starving');
    expect(getFullnessLevel(FULLNESS_THRESHOLDS.starving - 1)).toBe('starving');

    // hungry: 15 〜 39
    expect(getFullnessLevel(FULLNESS_THRESHOLDS.starving)).toBe('hungry');
    expect(getFullnessLevel(25)).toBe('hungry');
    expect(getFullnessLevel(FULLNESS_THRESHOLDS.hungry - 1)).toBe('hungry');

    // satisfied: 40 〜 79
    expect(getFullnessLevel(FULLNESS_THRESHOLDS.hungry)).toBe('satisfied');
    expect(getFullnessLevel(60)).toBe('satisfied');
    expect(getFullnessLevel(FULLNESS_THRESHOLDS.full - 1)).toBe('satisfied');

    // full: 80 〜 100
    expect(getFullnessLevel(FULLNESS_THRESHOLDS.full)).toBe('full');
    expect(getFullnessLevel(90)).toBe('full');
    expect(getFullnessLevel(100)).toBe('full');
  });

  it('getFullnessInfo: まんぷく度情報（ラベル、説明文、バッジクラス）を取得できること', () => {
    const starving = getFullnessInfo('starving');
    expect(starving.label).toBe('ペコペコ');
    expect(starving.description).toContain('ペコペコ');

    const hungry = getFullnessInfo('hungry');
    expect(hungry.label).toBe('小腹すいた');

    const satisfied = getFullnessInfo(50);
    expect(satisfied.label).toBe('ほどよい');

    const full = getFullnessInfo(95);
    expect(full.label).toBe('まんぷく♡');
  });

  it('calculateNextFullness: ごはんを与えたときにスコアが加算され、上限100でクランプされること', () => {
    expect(calculateNextFullness(50, 25)).toBe(75);
    expect(calculateNextFullness(80, 35)).toBe(100);
    expect(calculateNextFullness(100, 15)).toBe(100);
  });

  it('calculateDecayedFullness: 時間経過によりゆるやかに減衰し、下限0でクランプされること', () => {
    // 0ミリ秒経過なら変化なし
    expect(calculateDecayedFullness(50, 0)).toBe(50);

    // 1分（60000ms）経過で1点減衰
    expect(calculateDecayedFullness(50, 60000, 1)).toBe(49);

    // 10分（600000ms）経過で10点減衰
    expect(calculateDecayedFullness(50, 600000, 1)).toBe(40);

    // 大幅な時間経過でも下限0以下にはならないこと
    expect(calculateDecayedFullness(10, 6000000, 1)).toBe(0);
  });

  it('calculatePlayFullnessReduction: 5〜10%の範囲でランダムな減少量を算出すること', () => {
    expect(DEFAULT_PLAY_FULLNESS_MIN_REDUCTION).toBe(5);
    expect(DEFAULT_PLAY_FULLNESS_MAX_REDUCTION).toBe(10);

    // デフォルト乱数呼び出しで5〜10の整数になること
    for (let i = 0; i < 50; i++) {
      const reduction = calculatePlayFullnessReduction();
      expect(reduction).toBeGreaterThanOrEqual(5);
      expect(reduction).toBeLessThanOrEqual(10);
      expect(Number.isInteger(reduction)).toBe(true);
    }

    // 擬似乱数注入テスト（下限・上限の境界値検証）
    expect(calculatePlayFullnessReduction(5, 10, () => 0)).toBe(5);
    expect(calculatePlayFullnessReduction(5, 10, () => 0.999999)).toBe(10);
  });

  it('calculatePlayedFullness: まんぷく度が微減し、下限0でクランプされること', () => {
    // 50から7減少 -> 43
    expect(calculatePlayedFullness(50, 7)).toBe(43);

    // 5から10減少 -> 0（負数にならずクランプ）
    expect(calculatePlayedFullness(5, 10)).toBe(0);

    // 0から5減少 -> 0
    expect(calculatePlayedFullness(0, 5)).toBe(0);

    // 100から5減少 -> 95
    expect(calculatePlayedFullness(100, 5)).toBe(95);
  });
});
