import { describe, it, expect } from 'vitest';
import {
  getMoodLevel,
  getMoodInfo,
  calculateNextMood,
  calculateDecayedMood,
  calculatePitchForMood,
  getMeowMessageForMood,
  getParticleCountForMood,
  MOOD_THRESHOLDS,
  DEFAULT_INITIAL_MOOD_SCORE,
  DEFAULT_PET_MOOD_INCREMENT,
} from './catMood.ts';
import { CAT_PRESETS } from '../types/cat.ts';

describe('catMood ユーティリティ (純粋関数テスト)', () => {
  it('getMoodLevel: スコアに応じて適切な機嫌レベルを判定すること', () => {
    // normal: 0 〜 39
    expect(getMoodLevel(0)).toBe('normal');
    expect(getMoodLevel(20)).toBe('normal');
    expect(getMoodLevel(MOOD_THRESHOLDS.happy - 1)).toBe('normal');

    // happy: 40 〜 74
    expect(getMoodLevel(MOOD_THRESHOLDS.happy)).toBe('happy');
    expect(getMoodLevel(55)).toBe('happy');
    expect(getMoodLevel(MOOD_THRESHOLDS.ecstatic - 1)).toBe('happy');

    // ecstatic: 75 〜 100
    expect(getMoodLevel(MOOD_THRESHOLDS.ecstatic)).toBe('ecstatic');
    expect(getMoodLevel(90)).toBe('ecstatic');
    expect(getMoodLevel(100)).toBe('ecstatic');
  });

  it('getMoodInfo: 機嫌情報（表示名、絵文字、バッジクラス）を取得できること', () => {
    const normalInfo = getMoodInfo('normal');
    expect(normalInfo.label).toBe('おだやか');
    expect(normalInfo.emoji).toBe('😌');

    const happyInfo = getMoodInfo(50);
    expect(happyInfo.label).toBe('ごきげん♪');
    expect(happyInfo.emoji).toBe('😸');

    const ecstaticInfo = getMoodInfo(85);
    expect(ecstaticInfo.label).toBe('ごきげんMAX♡');
    expect(ecstaticInfo.emoji).toBe('😻');
  });

  it('calculateNextMood: なでた後の機嫌スコアが加算され、最大100でクランプされること', () => {
    // デフォルト加算 (+15)
    expect(calculateNextMood(20)).toBe(20 + DEFAULT_PET_MOOD_INCREMENT);

    // カスタム加算
    expect(calculateNextMood(20, 10)).toBe(30);

    // 100を超えない
    expect(calculateNextMood(95, 15)).toBe(100);
    expect(calculateNextMood(100, 15)).toBe(100);
  });

  it('calculateDecayedMood: 時間経過に応じて自然減衰し、ベースライン未満には下がらないこと', () => {
    const initial = 80;

    // 経過時間0なら変化なし
    expect(calculateDecayedMood(initial, 0)).toBe(initial);

    // 10分経過（1分あたり2点減衰 -> -20点）
    const tenMinutesMs = 10 * 60 * 1000;
    expect(calculateDecayedMood(initial, tenMinutesMs, 2)).toBe(60);

    // 長時間放置されても初期ベースライン（20）より下には下がらない
    const oneDayMs = 24 * 60 * 60 * 1000;
    expect(calculateDecayedMood(initial, oneDayMs, 2, DEFAULT_INITIAL_MOOD_SCORE)).toBe(
      DEFAULT_INITIAL_MOOD_SCORE
    );
  });

  it('calculatePitchForMood: 機嫌が良いほど高らかで甘えたピッチに変化すること', () => {
    const basePitch = 1.0;

    // normal: 基本ピッチ
    expect(calculatePitchForMood(basePitch, 'normal')).toBe(1.0);

    // happy: やや高め（約1.08倍）
    expect(calculatePitchForMood(basePitch, 'happy')).toBe(1.08);

    // ecstatic: 嬉しさ弾ける高音（約1.18倍）
    expect(calculatePitchForMood(basePitch, 'ecstatic')).toBe(1.18);
  });

  it('getMeowMessageForMood: 猫の機嫌レベルに合ったセリフが返されること', () => {
    const blackCat = CAT_PRESETS.find((p) => p.id === 'black')!;

    // normal
    const normalMsg = getMeowMessageForMood(blackCat, 'normal', () => 0.0);
    expect(blackCat.moodMessages?.normal).toContain(normalMsg);

    // happy
    const happyMsg = getMeowMessageForMood(blackCat, 'happy', () => 0.0);
    expect(blackCat.moodMessages?.happy).toContain(happyMsg);

    // ecstatic
    const ecstaticMsg = getMeowMessageForMood(blackCat, 'ecstatic', () => 0.0);
    expect(blackCat.moodMessages?.ecstatic).toContain(ecstaticMsg);
  });

  it('getParticleCountForMood: 機嫌が良いほどエフェクト出現数が増加すること', () => {
    // normal: 3個
    expect(getParticleCountForMood('normal')).toBe(3);

    // happy: 3〜4個
    const happyCountMin = getParticleCountForMood('happy', () => 0.0);
    const happyCountMax = getParticleCountForMood('happy', () => 0.9);
    expect(happyCountMin).toBe(3);
    expect(happyCountMax).toBe(4);

    // ecstatic: 4〜5個
    const ecstaticCountMin = getParticleCountForMood('ecstatic', () => 0.0);
    const ecstaticCountMax = getParticleCountForMood('ecstatic', () => 0.9);
    expect(ecstaticCountMin).toBe(4);
    expect(ecstaticCountMax).toBe(5);
  });
});

