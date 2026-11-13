import { CatId } from './cat.ts';

/**
 * おくりもの（ギフト）の識別子
 * 今後新しい贈り物が追加されても拡張可能な文字列リテラル/文字列型
 */
export type GiftId =
  | 'pebble'
  | 'feather'
  | 'acorn'
  | 'twig'
  | 'seashell'
  | 'fallen-leaf'
  | 'pinecone'
  | 'clover'
  | 'ribbon'
  | 'button'
  | 'old-coin'
  | 'rainbow-feather'
  | 'four-leaf-clover'
  | 'mossy-pebble'
  | 'old-stamp'
  | 'hairpin'
  | 'wilted-flower'
  | 'cicada-shell'
  | 'white-dice'
  | 'glass-marble'
  | 'dirty-plush'
  | 'single-sock'
  | 'sunflower-seed'
  | 'snack-wrapper'
  | 'skewer'
  | 'ice-stick'
  | 'important-paper'
  | 'blue-can'
  | 'empty-bottle'
  | 'pink-handkerchief'
  | 'candy-wrapper'
  | 'bento-baran'
  | 'super-ball'
  | 'small-bell'
  | string;

/**
 * 贈り物のレアリティ
 * common: 通常のおくりもの
 * rare: レアリティの高いおくりもの（もらえる確率が低く、背景が金色）
 */
export type GiftRarity = 'common' | 'rare';

/**
 * 贈り物の定義情報
 */
export interface GiftItem {
  /** 贈り物の一意識別子 */
  id: GiftId;
  /** 贈り物の名称（例: "きれいな小石", "ふしぎな古銭"） */
  name: string;
  /** 贈り物の説明文（例: "どこかで見つけてきた、つるつると丸くてきれいな小石。"） */
  description: string;
  /** 表示用絵文字アイコン（例: "🪨", "🪙"） */
  icon: string;
  /** アイコンの種類（カスタムSVG等との連携用） */
  iconType: string;
  /** アイコン背景や装飾用カラークラス（Tailwindクラス） */
  themeClass?: string;
  /** レアリティ（'common' | 'rare'） */
  rarity?: GiftRarity;
  /** 抽選確率計算用の重み（未指定時はレアリティに応じたデフォルト値） */
  weight?: number;
}

/**
 * 1種類の贈り物の累積受取・所持記録
 * 後から何を何個受け取ったか振り返る機能に必要な情報を保持
 */
export interface GiftRecord {
  /** 贈り物のID */
  giftId: GiftId;
  /** 累積受取個数 */
  count: number;
  /** 猫ごとの受取回数内訳（例: { black: 2, white: 1 }） */
  byCat?: Partial<Record<CatId, number>>;
  /** 初めて受け取った日時（UNIXタイムスタンプ） */
  firstReceivedAt: number;
  /** 最後に受け取った日時（UNIXタイムスタンプ） */
  lastReceivedAt: number;
}

/**
 * 贈り物インベントリ（giftId -> GiftRecord）
 * localStorage への永続化対象
 */
export type GiftInventory = Record<GiftId, GiftRecord>;
