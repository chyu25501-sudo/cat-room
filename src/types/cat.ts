import { CatMoodLevel } from './mood.ts';

export type CatId = 'black' | 'white' | 'calico';

export interface CatPresetSwatch {
  /** 円形ラジオボタンの背景色Tailwindクラス */
  bgClass: string;
  /** 円形ラジオボタンの境界線Tailwindクラス */
  borderClass: string;
  /** 円形ラジオボタンのアクティブ時センタードット色Tailwindクラス */
  dotClass: string;
}

export interface CatPreset {
  /** 一意識別子 */
  id: CatId;
  /** 猫の名前（表示用） */
  name: string;
  /** ポーズの名称（表示用） */
  poseName: string;
  /** ラベル（ボタンやアクセシビリティ表示用） */
  label: string;
  /** 猫の簡単な説明 */
  description: string;
  /** 基本の鳴き声ピッチ倍率 */
  defaultPitch: number;
  /** この猫の鳴き声・リアクションメッセージ一覧（後方互換用） */
  meowMessages: readonly string[];
  /** 機嫌レベル別の鳴き声・リアクションメッセージ一覧 */
  moodMessages?: Record<CatMoodLevel, readonly string[]>;
  /** 円形セレクター（ラジオボタン風）のカラー表示設定 */
  swatch: CatPresetSwatch;
}

export const CAT_PRESETS: readonly CatPreset[] = [
  {
    id: 'black',
    name: 'くろねこ',
    poseName: 'おすわり',
    label: 'くろねこ（おすわり）',
    description: '凛とした姿勢でおすわりしている黒猫',
    defaultPitch: 1.0,
    meowMessages: [
      'ニャ〜ン♪',
      'ゴロゴロ…♪',
      'にゃあ〜♡',
      'すりすり…',
      'ミャオ！',
    ],
    moodMessages: {
      annoyed: ['シャーッ！', 'フシャーッ！', 'ウーッ…', 'カッ…！'],
      normal: ['ニャ〜ン♪', 'すりすり…', 'ミャオ！'],
      happy: ['ゴロゴロ…♪', 'にゃあ〜♡', 'すりすり…ゴロゴロ', 'ニャ〜ン♡'],
      ecstatic: ['ゴロゴロゴロ…♡', 'にゃあぁ〜〜♡', 'ンニャ〜〜♡', 'ミャオ〜〜♡'],
    },
    swatch: {
      bgClass: 'bg-stone-800',
      borderClass: 'border-stone-700',
      dotClass: 'bg-white',
    },
  },
  {
    id: 'white',
    name: 'しろねこ',
    poseName: 'ごろん',
    label: 'しろねこ（ごろん）',
    description: 'リラックスして寝転がっている白猫',
    defaultPitch: 1.15,
    meowMessages: [
      'ふにゃあ…♡',
      'ゴロゴロ…♪',
      'にゃ〜ん♪',
      'すやぁ…',
      'ミャオ〜♡',
    ],
    moodMessages: {
      annoyed: ['ウニャッ！', 'シャーッ！', 'フシューッ！', 'ウーッ…'],
      normal: ['ふにゃあ…', 'すやぁ…', 'にゃ〜ん♪'],
      happy: ['ゴロゴロ…♪', 'ふにゃあ…♡', 'すりすり…♡', 'ぷるる…♪'],
      ecstatic: ['ふにゃあぁ〜〜♡', 'ゴロゴロゴロ…♡', 'ぐるぐる…♡', 'みゃぁ〜〜ん♡'],
    },
    swatch: {
      bgClass: 'bg-white',
      borderClass: 'border-stone-300',
      dotClass: 'bg-stone-800',
    },
  },
  {
    id: 'calico',
    name: 'みけねこ',
    poseName: 'たち',
    label: 'みけねこ（たち）',
    description: '横向きに立ちこちらを見つめている三毛猫',
    defaultPitch: 1.08,
    meowMessages: [
      'ミャ〜ン♪',
      'クルル…♪',
      'ニャオ？',
      'ゴロゴロ…♡',
      'みゃあ♪',
    ],
    moodMessages: {
      annoyed: ['シャーッ！', 'フニャッ！', 'ウーッ…', 'カッ！'],
      normal: ['ミャ〜ン♪', 'ニャオ？', 'トコトコ…♪'],
      happy: ['クルル…♪', 'ゴロゴロ…♡', 'みゃあ〜♡', 'すりすり…♪'],
      ecstatic: ['クルルル…♡', 'ゴロゴロゴロ…♡', 'みゃあぁ〜ん♡', 'ニャ〜〜オ♡'],
    },
    swatch: {
      bgClass: 'bg-amber-100',
      borderClass: 'border-amber-400',
      dotClass: 'bg-amber-700',
    },
  },
] as const;
