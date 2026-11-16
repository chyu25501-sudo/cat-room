/**
 * Web Audio API を用いた猫の鳴き声（ニャー）および効果音シンセサイザー
 * 外部音声ファイルへの依存がないため、ネットワーク遅延やファイル欠落の心配がなく、
 * ブラウザ上で確実に低遅延再生が可能です。
 */

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        return null;
      }
      sharedAudioContext = new AudioCtx();
    }
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume();
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
}

/** テスト用: sharedAudioContext の参照を設定またはリセットする関数 */
export function setAudioContextForTesting(ctx: AudioContext | null): void {
  sharedAudioContext = ctx;
}

export function resetAudioContextForTesting(): void {
  sharedAudioContext = null;
}

export interface MeowOptions {
  /** ピッチの高さ（基本周波数倍率：1.0が標準） */
  pitchMultiplier?: number;
  /** 音の長さ（秒：約0.4〜0.8秒） */
  duration?: number;
  /** 音量（0.0 〜 1.0） */
  volume?: number;
}

/**
 * 猫の「ニャー（Meow）」という鳴き声を再生する関数
 */
export function playMeowSound(options: MeowOptions = {}): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const pitch = options.pitchMultiplier ?? 1.0;
    const duration = options.duration ?? 0.65;
    const maxVolume = (options.volume ?? 0.8) * 0.4; // 歪み防止のためのスケール調整

    // 1. オシレーター（猫の声の基音：三角波で温かみのある音色）
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';

    // 2. 倍音用オシレーター（サイン波）
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';

    // 3. フォルマントフィルター（猫の口の開きによる「ニャー」の母音変化）
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);

    // 4. アンプ（エンベロープ：音量の時間変化）
    const gainNode = ctx.createGain();

    // ピッチ遷移：「ニ（高め）」→「ャー（ピーク）」→「オ（下降）」
    const startFreq = 480 * pitch;
    const peakFreq = 820 * pitch;
    const endFreq = 400 * pitch;

    // オシレーター1のピッチベンド
    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.25);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    // オシレーター2（少しデチューンさせて自然な生体音の揺らぎを作る）
    osc2.frequency.setValueAtTime(startFreq * 1.01, now);
    osc2.frequency.exponentialRampToValueAtTime(peakFreq * 1.01, now + duration * 0.25);
    osc2.frequency.exponentialRampToValueAtTime(endFreq * 0.99, now + duration);

    // フィルター周波数遷移（口の母音形成：ア→オ）
    filter.frequency.setValueAtTime(900 * pitch, now);
    filter.frequency.exponentialRampToValueAtTime(1400 * pitch, now + duration * 0.3);
    filter.frequency.exponentialRampToValueAtTime(600 * pitch, now + duration);

    // 音量エンベロープ（アタック・サステイン・リリース）
    gainNode.gain.setValueAtTime(0.001, now);
    // アタック（立ち上がり）
    gainNode.gain.linearRampToValueAtTime(maxVolume, now + 0.05);
    // サステイン（持続）
    gainNode.gain.setValueAtTime(maxVolume, now + duration * 0.6);
    // リリース（フェードアウト）
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // 接続ルート: [Osc1, Osc2] -> Filter -> GainNode -> Destination (スピーカー)
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 再生開始と停止
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (error) {
    console.error('Failed to play cat meow sound:', error);
  }
}

export interface FanfareOptions {
  /** 音量（0.0 〜 1.0、デフォルト: 0.8） */
  volume?: number;
  /** ピッチ倍率（デフォルト: 1.0） */
  pitchMultiplier?: number;
}

/**
 * なつき度レベルアップ時・ハート演出出現時に再生される「かわいいファンファーレ」効果音
 * 澄んだサイン波・三角波とトイベル風のスパークル音で構成された、
 * 明るく華やかな長調ジングル（C5 -> E5 -> G5 -> C6 -> E6 和音）
 */
export function playFanfareSound(options: FanfareOptions = {}): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const pitch = options.pitchMultiplier ?? 1.0;
    const volumeScale = (options.volume ?? 0.8) * 0.32; // 和音の重なりによる音割れを防止

    // マスターゲインノード
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volumeScale, now);
    masterGain.connect(ctx.destination);

    // 1. 前半の軽快なメロディアルペジオ（タ・タ・タ・タッ♪）
    const arpeggioNotes = [
      { freq: 523.25, start: 0.0, dur: 0.1 }, // C5 (ド)
      { freq: 659.25, start: 0.09, dur: 0.1 }, // E5 (ミ)
      { freq: 783.99, start: 0.18, dur: 0.1 }, // G5 (ソ)
      { freq: 1046.5, start: 0.27, dur: 0.13 }, // C6 (高いド)
    ];

    arpeggioNotes.forEach(({ freq, start, dur }) => {
      const startTime = now + start;
      const stopTime = startTime + dur;

      // 主音（三角波でトイピアノのような丸く温かい響き）
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, startTime);

      // ベル風の輝きを与えるサイン波（1オクターブ上）
      const chimeOsc = ctx.createOscillator();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq * 2 * pitch, startTime);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.65, startTime + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      const chimeGain = ctx.createGain();
      chimeGain.gain.setValueAtTime(0.001, startTime);
      chimeGain.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.connect(noteGain);
      noteGain.connect(masterGain);
      osc.start(startTime);
      osc.stop(stopTime);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(masterGain);
      chimeOsc.start(startTime);
      chimeOsc.stop(stopTime);
    });

    // 2. フィニッシュの華やかな和音（C6・E6・G6 の明るい長三和音）
    const chordStart = now + 0.38;
    const chordDuration = 0.82;
    const chordStopTime = chordStart + chordDuration;

    const chordNotes = [
      { freq: 783.99, weight: 0.5 }, // G5 (和音の低域支え)
      { freq: 1046.5, weight: 0.6 }, // C6 (ルート音)
      { freq: 1318.51, weight: 0.75 }, // E6 (メロディ最高音)
    ];

    chordNotes.forEach(({ freq, weight }) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, chordStart);

      const chimeOsc = ctx.createOscillator();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq * pitch, chordStart);

      const chordGain = ctx.createGain();
      chordGain.gain.setValueAtTime(0.001, chordStart);
      chordGain.gain.linearRampToValueAtTime(weight * 0.45, chordStart + 0.02);
      chordGain.gain.setValueAtTime(weight * 0.4, chordStart + 0.25);
      chordGain.gain.exponentialRampToValueAtTime(0.0001, chordStopTime);

      osc.connect(chordGain);
      chimeOsc.connect(chordGain);
      chordGain.connect(masterGain);

      osc.start(chordStart);
      osc.stop(chordStopTime);
      chimeOsc.start(chordStart);
      chimeOsc.stop(chordStopTime);
    });

    // 3. 星がキラリと輝くような高音スパークル音（星の瞬きグリッサンド）
    const sparkles = [
      { freq: 1567.98, delay: 0.42 }, // G6
      { freq: 2093.0, delay: 0.5 }, // C7
      { freq: 2637.02, delay: 0.58 }, // E7
      { freq: 3135.96, delay: 0.66 }, // G7
    ];

    sparkles.forEach(({ freq, delay }) => {
      const sStart = now + delay;
      const sDur = 0.2;
      const sOsc = ctx.createOscillator();
      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(freq * pitch, sStart);

      const sGain = ctx.createGain();
      sGain.gain.setValueAtTime(0.001, sStart);
      sGain.gain.linearRampToValueAtTime(0.12, sStart + 0.01);
      sGain.gain.exponentialRampToValueAtTime(0.0001, sStart + sDur);

      sOsc.connect(sGain);
      sGain.connect(masterGain);

      sOsc.start(sStart);
      sOsc.stop(sStart + sDur);
    });
  } catch (error) {
    console.error('Failed to play fanfare sound:', error);
  }
}

