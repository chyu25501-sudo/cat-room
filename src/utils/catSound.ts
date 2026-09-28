/**
 * Web Audio API を用いた猫の鳴き声（ニャー）シンセサイザー
 * 外部音声ファイルへの依存がないため、ネットワーク遅延やファイル欠落の心配がなく、
 * ブラウザ上で確実に低遅延再生が可能です。
 */

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
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
