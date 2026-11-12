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
  getAffectionTitle,
  getAffectionDescription,
} from './catAffection.ts';

describe('catAffection ユーティリティ (第7週: なつき度純粋関数テスト)', () => {
  it('定数が第7週の仕様通りに設定されていること', () => {
    // 初期値は1、最大値は一旦10
    expect(MIN_AFFECTION_LEVEL).toBe(1);
    expect(MAX_AFFECTION_LEVEL).toBe(10);
    expect(BASE_AFFECTION_EXP).toBe(100);
    expect(AFFECTION_EXP_PER_LEVEL).toBe(25);

    // ごはんとおもちゃのExp設定
    expect(FOOD_AFFECTION_EXP_MAP.kibble).toBe(25);
    expect(FOOD_AFFECTION_EXP_MAP.canned).toBe(35);
    expect(FOOD_AFFECTION_EXP_MAP.treat).toBe(45);

    expect(TOY_AFFECTION_EXP_MAP.teaser).toBe(20);
    expect(TOY_AFFECTION_EXP_MAP.ball).toBe(30);
    expect(TOY_AFFECTION_EXP_MAP.laser).toBe(40);
  });

  describe('calculateRequiredExp (レベルが上がるほど必要なふれあいの量が増えること)', () => {
    it('レベル1のときは100ptで、レベルが上がるごとに25ptずつ必要量が増加すること', () => {
      expect(calculateRequiredExp(1)).toBe(100);
      expect(calculateRequiredExp(2)).toBe(125);
      expect(calculateRequiredExp(3)).toBe(150);
      expect(calculateRequiredExp(4)).toBe(175);
      expect(calculateRequiredExp(5)).toBe(200);
      expect(calculateRequiredExp(6)).toBe(225);
      expect(calculateRequiredExp(7)).toBe(250);
      expect(calculateRequiredExp(8)).toBe(275);
      expect(calculateRequiredExp(9)).toBe(300);
      expect(calculateRequiredExp(10)).toBe(300); // MAX時
    });
  });

  describe('calculateAffectionProgress (ゲージパーセンテージ計算)', () => {
    it('現在のExpと必要Expから正しいパーセンテージを計算すること', () => {
      // 100pt中0pt -> 0%
      expect(calculateAffectionProgress(0, 100, 1)).toBe(0);
      // 100pt中50pt -> 50%
      expect(calculateAffectionProgress(50, 100, 1)).toBe(50);
      // 125pt中25pt -> 20%
      expect(calculateAffectionProgress(25, 125, 2)).toBe(20);
      // Lv.10（MAX）のときは常に100%
      expect(calculateAffectionProgress(0, 300, 10)).toBe(100);
    });
  });

  describe('calculateAffectionGain (経験値獲得とレベルアップ・ゲージリセット)', () => {
    it('ゲージが満タン未満のときはレベルは上がらず、Expのみ加算されること', () => {
      // Lv.1（必要100pt）, 現在0pt, +30pt 獲得 -> Lv.1, 現在30pt, isLevelUp: false
      const res = calculateAffectionGain(1, 0, 30);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(1);
      expect(res.isLevelUp).toBe(false);
      expect(res.currentExp).toBe(30);
      expect(res.requiredExp).toBe(100);
      expect(res.progressPercentage).toBe(30);
    });

    it('ゲージが1回満タンになるとレベルが+1上昇し、ゲージがリセットされること（仕様: 初期値1 -> 満タンで2に上昇しゲージリセット）', () => {
      // Lv.1（必要100pt）, 現在80pt, +20pt 獲得 -> ちょうど満タンで Lv.2, ゲージ0ptにリセット
      const res = calculateAffectionGain(1, 80, 20);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(0);
      expect(res.requiredExp).toBe(125); // Lv.2の必要Exp
      expect(res.progressPercentage).toBe(0);
    });

    it('満タンを超えた余剰Expは次のレベルのゲージに引き継がれること', () => {
      // Lv.1（必要100pt）, 現在80pt, +35pt 獲得 -> 合計115pt -> Lv.2 に上がり、余剰15ptが次のゲージへ
      const res = calculateAffectionGain(1, 80, 35);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(2);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(15);
      expect(res.requiredExp).toBe(125);
      // 15 / 125 = 12%
      expect(res.progressPercentage).toBe(12);
    });

    it('大量のExpを獲得した場合、複数レベルアップが正しく行われること', () => {
      // Lv.1（100pt）+ Lv.2（125pt） = 225pt
      // Lv.1, 0pt から +235pt 獲得 -> Lv.3, 余剰10pt
      const res = calculateAffectionGain(1, 0, 235);
      expect(res.previousLevel).toBe(1);
      expect(res.nextLevel).toBe(3);
      expect(res.isLevelUp).toBe(true);
      expect(res.currentExp).toBe(10);
      expect(res.requiredExp).toBe(150);
    });

    it('最大値（Lv.10）に到達した後は、それ以上レベルが上がらずゲージ満タン（100%）を維持すること', () => {
      // Lv.9（必要300pt）, 現在290pt, +50pt 獲得 -> Lv.10（MAX）に到達
      const res = calculateAffectionGain(9, 290, 50);
      expect(res.previousLevel).toBe(9);
      expect(res.nextLevel).toBe(10);
      expect(res.isLevelUp).toBe(true);
      expect(res.progressPercentage).toBe(100);

      // すでにLv.10の猫にさらにExpを与えてもLv.10のまま
      const resAtMax = calculateAffectionGain(10, 300, 100);
      expect(resAtMax.previousLevel).toBe(10);
      expect(resAtMax.nextLevel).toBe(10);
      expect(resAtMax.isLevelUp).toBe(false);
      expect(resAtMax.progressPercentage).toBe(100);
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
});
