export type CatId = 'black' | 'white';

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
  /** この猫の鳴き声・リアクションメッセージ一覧 */
  meowMessages: readonly string[];
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
    swatch: {
      bgClass: 'bg-white',
      borderClass: 'border-stone-300',
      dotClass: 'bg-stone-800',
    },
  },
] as const;
