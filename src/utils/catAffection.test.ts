import { describe, it, expect } from 'vitest';
import {
  MIN_AFFECTION_LEVEL,
  MAX_AFFECTION_LEVEL,
  BASE_AFFECTION_EXP,
  AFFECTION_EXP_PER_LEVEL,
  FOOD_AFFECTION_EXP_MAP,
  TOY_AFFECTION_EXP_MAP,
  calculateRequiredExp,
  calculateAffectionProgress,
  calculateAffectionGain,
  calculatePetAffectionExp,
  calculateVariedAffectionExp,
  DEFAULT_PET_AFFECTION_EXP,
  HAPPY_PET_AFFECTION_EXP,
  ECSTATIC_PET_AFFECTION_EXP,
  DEFAULT_MIN_AFFECTION_VARIATION,
  DEFAULT_MAX_AFFECTION_VARIATION,
  getAffectionTitle,
  getAffectionDescription,
} from './catAffection.ts';

describe('catAffection ユーティリティ (第7週: なつき度純粋関数テスト)', () => {
  it('定数が第7週の仕様通りに設定されていること', () => {
    // 初期値は1、最大値は一旦10
    expect(MIN_AFFECTION_LEVEL).toBe(1);
    expect(MAX_AFFECTION_LEVEL).toBe(10);
    expect(BASE_AFFECTION_EXP).toBe(120);
    expect(AFFECTION_EXP_PER_LEVEL).toBe(60);

    // ごはんとおもちゃのExp設定
    expect(FOOD_AFFECTION_EXP_MAP.kibble).toBe(25);
    expect(FOOD_AFFECTION_EXP_MAP.canned).toBe(35);
    expect(FOOD_AFFECTION_EXP_MAP.treat).toBe(45);

    expect(TOY_AFFECTION_EXP_MAP.teaser).toBe(20);
    expect(TOY_AFFECTION_EXP_MAP.ball).toBe(30);
    expect(TOY_AFFECTION_EXP_MAP.laser).toBe(40);
  });

  describe('calculateRequiredExp (レベルが上がるほど必要なふれあいの量が増えること)', () => {
    it('レベル1のときは120ptで、レベルが上がるごとに60ptずつ必要量が増加しLv.9->10で600ptになること', () => {
      expect(calculateRequiredExp(1)).toBe(120);
      expect(calculateRequiredExp(2)).toBe(180);
      expect(calculateRequiredExp(3)).toBe(240);
      expect(calculateRequiredExp(4)).toBe(300);
      expect(calculateRequiredExp(5)).toBe(360);
      expect(calculateRequiredExp(6)).toBe(420);
      expect(calculateRequiredExp(7)).toBe(480);
      expect(calculateRequiredExp(8)).toBe(540);
      expect(calculateRequiredExp(9)).toBe(600);
      expect(calculateRequiredExp(10)).toBe(600); // MAX時
    });
  });

  describe('calculateAffectionProgress (ゲージパーセンテージ計算)', () => {
    it('現在のExpと必要Expから正しいパーセンテージを計算すること', () => {
      // 120pt中0pt -> 0%
      expect(calculateAffectionProgress(0, 120, 1)).toBe(0);
      // 120pt中60pt -> 50%
      expect(calculateAffectionProgress(60, 120, 1)).toBe(50);
      // 180pt中36pt -> 20%
      expect(calculateAffectionProgress(36, 180, 2)).toBe(20);
      // Lv.10（MAX）のときもゲージ進捗を計算（600pt中300pt -> 50%, 0pt -> 0%）
      expect(calculateAffectionProgress(300, 600, 10)).toBe(50);
      expect(calculateAffectionProgress(0, 600, 10)).toBe(0);
      expect(calculateAffectionProgress(600, 600, 10)).toBe(100);
    });
  });

  describe('calculateAffectionGain (経験値獲得とレベルアップ・ゲージリセット)', () => {
    it('ゲージが満タン未満のときはレベルは上がらず、Expのみ加算されること', () => {
      // Lv.1（必要120pt）, 現在0pt, +30pt 獲得 -> Lv.1, 現在30pt, isLevelUp: false
      const res = calculateAffectionGain(1, 0, 30);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(1);
      expect(res.isLevelUp).toBe(false);
      expect(res.currentExp).toBe(30);
      expect(res.requiredExp).toBe(120);
      expect(res.progressPercentage).toBe(25); // 30 / 120 = 25%
    });

    it('ゲージが1回満タンになるとレベルが+1上昇し、ゲージがリセットされること（仕様: 初期値1 -> 満タンで2に上昇しゲージリセット）', () => {
      // Lv.1（必要120pt）, 現在100pt, +20pt 獲得 -> ちょうど満タンで Lv.2, ゲージ0ptにリセット
      const res = calculateAffectionGain(1, 100, 20);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(0);
      expect(res.requiredExp).toBe(180); // Lv.2の必要Exp
      expect(res.progressPercentage).toBe(0);
    });

    it('満タンを超えた余剰Expは次のレベルのゲージに引き継がれること', () => {
      // Lv.1（必要120pt）, 現在100pt, +38pt 獲得 -> 合計138pt -> Lv.2 に上がり、余剰18ptが次のゲージへ
      const res = calculateAffectionGain(1, 100, 38);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(18);
      expect(res.requiredExp).toBe(180);
      // 18 / 180 = 10%
      expect(res.progressPercentage).toBe(10);
    });

    it('大量のExpを獲得した場合、複数レベルアップが正しく行われること', () => {
      // Lv.1（120pt）+ Lv.2（180pt） = 300pt
      // Lv.1, 0pt から +310pt 獲得 -> Lv.3, 余剰10pt
      const res = calculateAffectionGain(1, 0, 310);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(3);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(10);
      expect(res.requiredExp).toBe(240);
    });

    it('最大値（Lv.10）到達後も同じ必要量（600pt）でゲージを溜められ、満タンになるたびに演出トリガーが発生してゲージがループすること', () => {
      // Lv.9（必要600pt）, 現在590pt, +50pt 獲得 -> Lv.10（MAX）に到達（余剰40ptがLv.10ゲージへ）
      const res = calculateAffectionGain(9, 590, 50);
      expect(res.previousLevel).toBe(9);
      expect(res.nextLevel).toBe(10);
      expect(res.isLevelUp).toBe(true);
      expect(res.isMaxBonus).toBe(false);
      expect(res.currentExp).toBe(40);
      expect(res.requiredExp).toBe(600);
      expect(res.progressPercentage).toBe(7); // 40 / 600 = 6.66% -> 7%

      // すでにLv.10の猫がさらにふれあい（+200pt）-> 240/600pt（40%）、レベルは10のまま、まだ満タン演出は出ない
      const resProgress = calculateAffectionGain(10, 40, 200);
      expect(resProgress.previousLevel).toBe(10);
      expect(resProgress.nextLevel).toBe(10);
      expect(resProgress.isLevelUp).toBe(false);
      expect(resProgress.currentExp).toBe(240);
      expect(resProgress.requiredExp).toBe(600);
      expect(resProgress.progressPercentage).toBe(40);

      // さらにふれあい（現在580ptから+30pt = 610pt）-> 満タン（600pt）達成！
      // レベルは10のままで、演出トリガー（isLevelUp & isMaxBonus）が発火し、余剰10ptでゲージがリセットされる
      const resLoop = calculateAffectionGain(10, 580, 30);
      expect(resLoop.previousLevel).toBe(10);
      expect(resLoop.nextLevel).toBe(10);
      expect(resLoop.isLevelUp).toBe(true);
      expect(resLoop.isMaxBonus).toBe(true);
      expect(resLoop.currentExp).toBe(10);
      expect(resLoop.requiredExp).toBe(600);
      expect(resLoop.progressPercentage).toBe(2); // 10 / 600 = 1.66% -> 2%
    });
  });

  describe('称号・説明文の取得', () => {
    it('レベルに応じた適切な称号を取得できること', () => {
      expect(getAffectionTitle(1)).toBe('はじめまして');
      expect(getAffectionTitle(2)).toBe('ちょっと気になる');
      expect(getAffectionTitle(5)).toBe('なかよし');
      expect(getAffectionTitle(10)).toBe('ずっと一緒♡');
    });

    it('説明文を取得できること', () => {
      const descLv1 = getAffectionDescription(1, 30);
      expect(descLv1).toContain('Lv.1');
      expect(descLv1).toContain('はじめまして');
      expect(descLv1).toContain('70%');

      const descMax = getAffectionDescription(10, 100);
      expect(descMax).toContain('なつき度MAX');
    });
  });

  describe('calculatePetAffectionExp (ごきげん度に応じたなつき度上昇量の計算)', () => {
    it('おだやか（0〜39点 / normal）のときは基準値（10pt）になること', () => {
      expect(calculatePetAffectionExp(0)).toBe(10);
      expect(calculatePetAffectionExp(20)).toBe(10);
      expect(calculatePetAffectionExp(35)).toBe(10);
      expect(calculatePetAffectionExp(39)).toBe(10);
      expect(calculatePetAffectionExp('normal')).toBe(10);
    });

    it('ごきげん♪（40〜74点 / happy）のときは20〜30ptに上昇すること', () => {
      expect(calculatePetAffectionExp(40)).toBe(20);
      expect(calculatePetAffectionExp(57)).toBeGreaterThanOrEqual(24);
      expect(calculatePetAffectionExp(74)).toBe(30);
      expect(calculatePetAffectionExp('happy')).toBe(25);
    });

    it('ごきげんMAX♡（75〜100点 / ecstatic）のときは40〜50ptに特大上昇すること', () => {
      expect(calculatePetAffectionExp(75)).toBe(40);
      expect(calculatePetAffectionExp(85)).toBe(44);
      expect(calculatePetAffectionExp(100)).toBe(50);
      expect(calculatePetAffectionExp('ecstatic')).toBe(45);
    });

    it('ごきげん度が高ければ高いほど、撫でた時のなつき度の上昇幅が多めに上がること（単調増加）', () => {
      const normalExp = calculatePetAffectionExp(20);
      const happyExp = calculatePetAffectionExp(50);
      const ecstaticExp = calculatePetAffectionExp(85);
      const maxExp = calculatePetAffectionExp(100);

      expect(normalExp).toBeLessThan(happyExp);
      expect(happyExp).toBeLessThan(ecstaticExp);
      expect(ecstaticExp).toBeLessThan(maxExp);
    });

    it('不機嫌（annoyed または isAnnoyed: true）のときは 0pt になること', () => {
      expect(calculatePetAffectionExp(10, true)).toBe(0);
      expect(calculatePetAffectionExp(100, true)).toBe(0);
      expect(calculatePetAffectionExp('annoyed')).toBe(0);
    });
  });

  describe('calculateVariedAffectionExp (なつき度上昇量のランダム変動純粋関数テスト)', () => {
    it('定数が仕様通り-5〜+5（±5%相当）に設定されていること', () => {
      expect(DEFAULT_MIN_AFFECTION_VARIATION).toBe(-5);
      expect(DEFAULT_MAX_AFFECTION_VARIATION).toBe(5);
    });

    it('乱数値に応じて正しく-5〜+5の範囲でExpが変動すること', () => {
      // 基準Exp: 10pt（おだやか時）
      // random = 0 のとき: 最小変動 -5pt -> 5pt
      const minVal = calculateVariedAffectionExp(10, () => 0);
      expect(minVal).toBe(5);

      // random = 0.5 のとき: 0pt 変動 -> 10pt
      const midVal = calculateVariedAffectionExp(10, () => 0.5);
      expect(midVal).toBe(10);

      // random = 0.9999 のとき: 最大変動 +5pt -> 15pt
      const maxVal = calculateVariedAffectionExp(10, () => 0.9999);
      expect(maxVal).toBe(15);
    });

    it('基準Expが40pt（ごきげんMAX時）のとき、35〜45ptに変動すること', () => {
      expect(calculateVariedAffectionExp(40, () => 0)).toBe(35);
      expect(calculateVariedAffectionExp(40, () => 0.5)).toBe(40);
      expect(calculateVariedAffectionExp(40, () => 0.9999)).toBe(45);
    });

    it('基準Expが0以下（不機嫌時など）の場合は変動せず0を返すこと', () => {
      expect(calculateVariedAffectionExp(0, () => 0.9999)).toBe(0);
      expect(calculateVariedAffectionExp(-5, () => 0.5)).toBe(0);
    });

    it('計算結果が0以下になる場合でも最低1ptが保証されること', () => {
      // baseExpが3ptで、最小変動-5ptのとき -> -2ptではなく下限1ptにクランプされる
      const clamped = calculateVariedAffectionExp(3, () => 0);
      expect(clamped).toBe(1);
    });
  });
});
