import { describe, it, expect } from 'vitest';
import {
  getMoodLevel,
  getMoodInfo,
  calculateNextMood,
  calculateVariedMoodIncrement,
  calculateDecayedMood,
  calculatePitchForMood,
  getMeowMessageForMood,
  getParticleCountForMood,
  checkOverstimulation,
  isCatAnnoyed,
  MOOD_THRESHOLDS,
  DEFAULT_INITIAL_MOOD_SCORE,
  DEFAULT_PET_MOOD_INCREMENT,
  DEFAULT_OVERSTIMULATION_WINDOW_MS,
  DEFAULT_OVERSTIMULATION_THRESHOLD_COUNT,
  DEFAULT_MIN_MOOD_VARIATION,
  DEFAULT_MAX_MOOD_VARIATION,
} from './catMood.ts';
import { CAT_PRESETS } from '../types/cat.ts';

describe('catMood ユーティリティ (純粋関数テスト)', () => {
  it('getMoodLevel: スコアに応じて適切な機嫌レベルを判定すること（不機嫌フラグ優先）', () => {
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

    // 不機嫌（愛撫誘発性攻撃行動）フラグが true の時はスコアによらず 'annoyed'
    expect(getMoodLevel(100, true)).toBe('annoyed');
    expect(getMoodLevel(20, true)).toBe('annoyed');
  });

  it('getMoodInfo: 機嫌情報（表示名、バッジクラス）を取得できること', () => {
    const annoyedInfo = getMoodInfo('annoyed');
    expect(annoyedInfo.label).toBe('ごきげんななめ');
    expect(annoyedInfo.description).toContain('イライラ');

    const normalInfo = getMoodInfo('normal');
    expect(normalInfo.label).toBe('おだやか');

    const happyInfo = getMoodInfo(50);
    expect(happyInfo.label).toBe('ごきげん♪');

    const ecstaticInfo = getMoodInfo(85);
    expect(ecstaticInfo.label).toBe('ごきげんMAX♡');
  });

  it('checkOverstimulation: 短時間に連続して過剰に撫でた場合のみ過剰刺激と判定すること', () => {
    const now = 20000;
    const windowMs = DEFAULT_OVERSTIMULATION_WINDOW_MS; // 12000ms
    const thresholdCount = DEFAULT_OVERSTIMULATION_THRESHOLD_COUNT; // 10回

    // 履歴が空、またはしきい値未満
    expect(checkOverstimulation([], now, windowMs, thresholdCount)).toBe(false);
    expect(checkOverstimulation([now, now - 1000, now - 2000], now, windowMs, thresholdCount)).toBe(false);

    // 12秒間に10回連続で撫でた場合（過剰刺激発生！）
    const fastPets = [
      now - 9000,
      now - 8000,
      now - 7000,
      now - 6000,
      now - 5000,
      now - 4000,
      now - 3000,
      now - 2000,
      now - 1000,
      now,
    ];
    expect(checkOverstimulation(fastPets, now, windowMs, thresholdCount)).toBe(true);

    // 10回あるが、一部がウィンドウ外（12秒より昔）の場合
    const slowPets = [
      now - 16000, // ウィンドウ外
      now - 14000, // ウィンドウ外
      now - 7000,
      now - 6000,
      now - 5000,
      now - 4000,
      now - 3000,
      now - 2000,
      now - 1000,
      now,
    ];
    expect(checkOverstimulation(slowPets, now, windowMs, thresholdCount)).toBe(false);
  });

  it('isCatAnnoyed: 不機嫌期限と現在時刻から正しく不機嫌状態を判定すること', () => {
    const now = 5000;
    expect(isCatAnnoyed(undefined, now)).toBe(false);
    expect(isCatAnnoyed(4000, now)).toBe(false); // 期限切れ（回復済み）
    expect(isCatAnnoyed(6000, now)).toBe(true);  // 不機嫌継続中
  });

  it('calculatePitchForMood: 不機嫌時は低く唸り、機嫌が良いほど高音に変化すること', () => {
    const basePitch = 1.0;

    // annoyed: 低くドスの利いたピッチ（約0.82倍）
    expect(calculatePitchForMood(basePitch, 'annoyed')).toBe(0.82);

    // normal: 基本ピッチ
    expect(calculatePitchForMood(basePitch, 'normal')).toBe(1.0);

    // happy: やや高め（約1.08倍）
    expect(calculatePitchForMood(basePitch, 'happy')).toBe(1.08);

    // ecstatic: 嬉しさ弾ける高音（約1.18倍）
    expect(calculatePitchForMood(basePitch, 'ecstatic')).toBe(1.18);
  });

  it('getMeowMessageForMood: 猫の機嫌レベル（不機嫌時の威嚇含む）に合ったセリフが返されること', () => {
    const blackCat = CAT_PRESETS.find((p) => p.id === 'black')!;

    // annoyed（威嚇音）
    const annoyedMsg = getMeowMessageForMood(blackCat, 'annoyed', () => 0.0);
    expect(blackCat.moodMessages?.annoyed).toContain(annoyedMsg);

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

  it('calculateVariedMoodIncrement: 基準値15から±1〜5%の範囲（10〜20）でランダムに変動すること', () => {
    // 最小境界（randomFnが0.0のとき: 15 - 5 = 10）
    expect(calculateVariedMoodIncrement(15, () => 0.0)).toBe(10);

    // 中央値（randomFnが中央付近のとき: 15 + 0 = 15）
    // range: 11 values (-5 to +5). index 5 is 0. 5/11 ≈ 0.455 ~ 0.545
    expect(calculateVariedMoodIncrement(15, () => 0.5)).toBe(15);

    // 最大境界（randomFnが0.999のとき: 15 + 5 = 20）
    expect(calculateVariedMoodIncrement(15, () => 0.999)).toBe(20);

    // デフォルト（Math.random）で実行した場合も常に10〜20の範囲に収まること
    for (let i = 0; i < 50; i++) {
      const increment = calculateVariedMoodIncrement();
      expect(increment).toBeGreaterThanOrEqual(10);
      expect(increment).toBeLessThanOrEqual(20);
    }
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

