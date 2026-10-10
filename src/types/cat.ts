export type CatId = 'black' | 'white';

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
  },
] as const;

