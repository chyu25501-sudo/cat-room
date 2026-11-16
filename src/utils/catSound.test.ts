import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  playMeowSound,
  playFanfareSound,
  setAudioContextForTesting,
  resetAudioContextForTesting,
} from './catSound.ts';

// Web Audio API のモッククラス群
class MockAudioParam {
  value = 0;
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockOscillatorNode extends MockAudioNode {
  type: OscillatorType = 'sine';
  frequency = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockBiquadFilterNode extends MockAudioNode {
  type: BiquadFilterType = 'bandpass';
  frequency = new MockAudioParam();
  Q = new MockAudioParam();
}

class MockAudioContext {
  currentTime = 0;
  state = 'running';
  destination = new MockAudioNode();
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  resume = vi.fn();
}

describe('catSound ユーティリティ', () => {
  let mockContext: MockAudioContext;

  beforeEach(() => {
    mockContext = new MockAudioContext();
    setAudioContextForTesting(mockContext as unknown as AudioContext);
  });

  afterEach(() => {
    resetAudioContextForTesting();
    vi.restoreAllMocks();
  });

  describe('playMeowSound', () => {
    it('デフォルト設定で猫の鳴き声が再生されること', () => {
      expect(() => playMeowSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
    });

    it('ピッチ倍率や音量オプションを指定して正常に再生されること', () => {
      expect(() =>
        playMeowSound({
          pitchMultiplier: 1.2,
          duration: 0.5,
          volume: 0.9,
        })
      ).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
    });

    it('AudioContext 内部で例外が発生してもクラッシュせず安全にフォールバックすること（エラー耐性）', () => {
      class FailingAudioContext extends MockAudioContext {
        createOscillator = vi.fn(() => {
          throw new Error('Web Audio hardware error');
        });
      }
      setAudioContextForTesting(new FailingAudioContext() as unknown as AudioContext);

      expect(() => playMeowSound()).not.toThrow();
    });
  });

  describe('playFanfareSound', () => {
    it('かわいいファンファーレ効果音が正常に生成・再生されること', () => {
      let createdOscillators = 0;
      let createdGains = 0;

      class CustomMockAudioContext extends MockAudioContext {
        createOscillator = vi.fn(() => {
          createdOscillators++;
          return new MockOscillatorNode();
        });
        createGain = vi.fn(() => {
          createdGains++;
          return new MockGainNode();
        });
      }

      setAudioContextForTesting(new CustomMockAudioContext() as unknown as AudioContext);

      expect(() => playFanfareSound()).not.toThrow();

      // アルペジオ（4音×2オシレーター）＋ 和音（3音×2オシレーター）＋ スパークル（4音×1オシレーター）= 18オシレーター
      expect(createdOscillators).toBeGreaterThanOrEqual(14);
      // マスターゲイン ＋ ノート用ゲイン
      expect(createdGains).toBeGreaterThanOrEqual(10);
    });

    it('オプション（volume, pitchMultiplier）が指定された場合も正常に動作すること', () => {
      expect(() =>
        playFanfareSound({
          volume: 0.5,
          pitchMultiplier: 1.1,
        })
      ).not.toThrow();
    });

    it('AudioContext 内部で例外が発生しても例外を投げず安全にフォールバックすること（エラー耐性）', () => {
      class FailingAudioContext extends MockAudioContext {
        createOscillator = vi.fn(() => {
          throw new Error('Web Audio failure');
        });
      }
      setAudioContextForTesting(new FailingAudioContext() as unknown as AudioContext);

      expect(() => playFanfareSound()).not.toThrow();
    });
  });
});
