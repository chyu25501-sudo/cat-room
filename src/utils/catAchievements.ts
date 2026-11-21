import {
  AchievementCategory,
  AchievementId,
  AchievementItem,
  AchievementRecord,
  UnlockedAchievements,
  AchievementStatusFilter,
  AchievementProgress,
  AchievementProgressContext,
} from '../types/achievement.ts';
import { CatMoodLevel } from '../types/mood.ts';
import { CatFullnessLevel } from '../types/fullness.ts';
import { CareStats } from '../types/journal.ts';
import { GiftItem, GiftInventory } from '../types/gift.ts';
import { CatId } from '../types/cat.ts';
import { CAT_GIFTS, getTotalGiftCount, getAcquiredGiftTypeCount } from './catGifts.ts';

/**
 * 実績カテゴリ情報
 */
export interface AchievementCategoryInfo {
  id: AchievementCategory;
  label: string;
}

/**
 * 実績のカテゴリ一覧（全3種類）
 * 画面上部の絞り込みタブ用
 */
export const ACHIEVEMENT_CATEGORIES: readonly AchievementCategoryInfo[] = [
  { id: 'interaction', label: 'ふれあい' },
  { id: 'care', label: 'お世話' },
  { id: 'gift', label: 'おくりもの' },
];

/**
 * カテゴリIDから日本語表示ラベルを取得するヘルパー関数
 */
export function getAchievementCategoryLabel(category: AchievementCategory): string {
  const match = ACHIEVEMENT_CATEGORIES.find((c) => c.id === category);
  return match ? match.label : 'その他';
}

/**
 * 実績マスターデータリスト（全70種類: 通常実績52種類 + 隠し実績18種類）
 * カテゴリごとにグループ化して整列（ふれあい -> お世話 -> おくりもの）
 */
export const ACHIEVEMENTS: readonly AchievementItem[] = [
  // ==========================================
  // 【ふれあい】カテゴリ（計23種類）
  // ==========================================
  {
    id: 'first-pet',
    title: 'はじめまして！',
    description: '猫ちゃんを初めてなでなでしてふれあった。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'mood-ecstatic',
    title: 'ゴロゴロごきげん',
    description: '猫ちゃんのごきげん度を最高（大よろこび）にした。',
    iconType: 'sparkle',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'pet-count-100',
    title: 'なでなでマスター',
    description: '猫を撫でた総回数が100回を超えた。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'pet-count-500',
    title: 'なでなで名人',
    description: '猫を撫でた総回数が500回を超えた。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'pet-count-1000',
    title: '極上のなでなで職人',
    description: '猫を撫でた総回数が1000回を超えた。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'pet-count-5000',
    title: '神の手を持つ撫で手',
    description: '猫を撫でた総回数が5000回を超えた。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'pet-count-10000',
    title: '伝説のなでなで愛好家',
    description: '猫を撫でた総回数が10000回を超えた。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'affection-level-5',
    title: '大のなかよし',
    description: 'いずれかの猫がはじめてなつき度レベル5になった。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'affection-level-10',
    title: 'ずっと一緒♡',
    description: 'いずれかの猫がはじめてなつき度レベル10になった。',
    iconType: 'sparkle',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'all-cats-loved',
    title: 'みんな大好き',
    description: 'くろねこ・しろねこ・みけねこの3匹みんなとふれあった。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'all-cats-affection-3',
    title: 'みんななかよし',
    description: 'くろねこ・しろねこ・みけねこの3匹すべてのなつき度レベルを3以上にした。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'all-cats-affection-10',
    title: 'みんなずっと一緒♡',
    description: 'くろねこ・しろねこ・みけねこの3匹すべてのなつき度レベルを10にした。',
    iconType: 'sparkle',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'streak-3',
    title: 'まいにちのおともだち',
    description: '3日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'streak-7',
    title: 'いっしゅうかん一緒',
    description: '7日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'streak-14',
    title: 'ふたしゅうかんの絆',
    description: '14日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'streak-30',
    title: 'まいにち猫日和',
    description: '30日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'total-days-7',
    title: '7日間の思い出',
    description: 'ふれあった合計日数が7日になった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'total-days-14',
    title: '14日間の積み重ね',
    description: 'ふれあった合計日数が14日になった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'total-days-30',
    title: 'ひと月のかけがえのない時間',
    description: 'ふれあった合計日数が30日になった。',
    iconType: 'calendar',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'first-rename-cat',
    title: 'あたらしいお名前',
    description: 'いずれかの猫の名前をはじめて変更した。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'rename-cat-neko',
    title: 'そのまんまじゃん！',
    description: '猫の名前を「ねこ」「ネコ」「にゃんこ」のいずれかに変更した。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'time-midnight-pet',
    title: '夜更かしにゃんこ',
    description: '午前0時～午前2時の間に猫ちゃんとふれあった。',
    iconType: 'sparkle',
    category: 'interaction',
    isHidden: false,
  },
  {
    id: 'time-early-morning-pet',
    title: '早起きにゃんこ',
    description: '午前5時～午前7時の間に猫ちゃんとふれあった。',
    iconType: 'paw',
    category: 'interaction',
    isHidden: false,
  },

  // ==========================================
  // 【お世話】カテゴリ（計18種類）
  // ==========================================
  {
    id: 'first-feed',
    title: 'ごはんの時間',
    description: '猫ちゃんに初めてごはんを食べさせてあげた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'fullness-full',
    title: 'おなかいっぱい！',
    description: '猫ちゃんのまんぷく度を最高（まんぷく）にした。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'perfect-satisfaction',
    title: '至福のひととき',
    description: '猫ちゃんのごきげん度とまんぷく度の両方を同時にMAX（100%）にした。',
    iconType: 'sparkle',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'feed-count-100',
    title: 'もぐもぐシェフ',
    description: 'ごはんをあげた総回数が100回を超えた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'feed-count-500',
    title: 'グルメのごちそう番',
    description: 'ごはんをあげた総回数が500回を超えた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'feed-count-1000',
    title: '三ツ星ごはんマイスター',
    description: 'ごはんをあげた総回数が1000回を超えた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'feed-count-5000',
    title: '愛の宮廷料理人',
    description: 'ごはんをあげた総回数が5000回を超えた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'feed-count-10000',
    title: '満腹の守護神',
    description: 'ごはんをあげた総回数が10000回を超えた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'first-play',
    title: 'あそぼうよ！',
    description: '猫ちゃんと初めておもちゃを使って遊んだ。',
    iconType: 'toy',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'play-count-100',
    title: 'あそびの天才',
    description: 'おもちゃで遊んだ総回数が100回を超えた。',
    iconType: 'toy',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'play-count-500',
    title: 'じゃらしのエキスパート',
    description: 'おもちゃで遊んだ総回数が500回を超えた。',
    iconType: 'toy',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'play-count-1000',
    title: '熱狂のエンターテイナー',
    description: 'おもちゃで遊んだ総回数が1000回を超えた。',
    iconType: 'toy',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'play-count-5000',
    title: '奇跡のプレイメーカー',
    description: 'おもちゃで遊んだ総回数が5000回を超えた。',
    iconType: 'toy',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'play-count-10000',
    title: '無限のあそび王',
    description: 'おもちゃで遊んだ総回数が10000回を超えた。',
    iconType: 'toy',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'time-lunch-feed',
    title: 'お昼ごはんの時間',
    description: '午前11時～午後1時の間に猫ちゃんへごはんをあげた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'time-snack-feed',
    title: '３時のおやつ',
    description: '午後3時～午後4時の間に猫ちゃんへごはんをあげた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'first-auto-feed',
    title: 'おまかせカリカリ',
    description: '自動ごはん機能を使って初めて猫ちゃんにごはんを食べさせてあげた。',
    iconType: 'food',
    category: 'care',
    isHidden: false,
  },
  {
    id: 'first-offline-report',
    title: 'お留守番できたよ',
    description: 'はじめてお留守番レポートを受け取った。',
    iconType: 'calendar',
    category: 'care',
    isHidden: false,
  },

  // ==========================================
  // 【おくりもの】カテゴリ（計29種類: 通常11種類 + 隠し18種類）
  // ==========================================
  {
    id: 'first-gift',
    title: '小さなプレゼント',
    description: '猫ちゃんから初めておくりものを受け取った。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'unique-gifts-10',
    title: '小さなおくりもの図鑑',
    description: '異なる種類のおくりものを10種類以上集めた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'unique-gifts-40',
    title: 'おくりもの大百科',
    description: '異なる種類のおくりものを40種類以上集めた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-20',
    title: 'たからもの集め',
    description: '受け取ったおくりものの総数が20個を超えた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-100',
    title: 'おくりものコレクター',
    description: '受け取ったおくりものの総数が100個を超えた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-222',
    title: 'にゃんにゃんトレジャー',
    description: '受け取ったおくりものの総数が222個を超えた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-500',
    title: '大富豪の宝箱',
    description: '受け取ったおくりものの総数が500個を超えた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-1000',
    title: '伝説のギフトマスター',
    description: '受け取ったおくりものの総数が1000個を超えた。',
    iconType: 'gift',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'first-rare-gift',
    title: '特別なめぐり逢い',
    description: 'はじめてレアなおくりものを受け取った。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'first-super-rare-gift',
    title: 'とっておきの宝物',
    description: 'はじめてスーパーレアなおくりものを受け取った。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: false,
  },
  {
    id: 'first-ultra-rare-gift',
    title: '奇跡のめぐり逢い',
    description: 'はじめてウルトラレアなおくりものを受け取った。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: false,
  },

  // ==========================================
  // 【おくりもの】隠し実績（計18種類、isHidden: true）
  // ==========================================
  {
    id: 'hidden-pebble-set',
    title: '石ころマニア',
    description: '「きれいな小石」「こけむした小石」「ひかる苔石」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-branch-set',
    title: '枝拾いの達人',
    description: '「ほそい小枝」「りっぱな枝」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-clover-set',
    title: '幸運を呼ぶしっぽ',
    description: '「みどりのクローバー」「よつばのクローバー」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-cicada-set',
    title: '夏のおとしもの',
    description: '「せみのぬけがら」「かわいた蝉の羽」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-ice-stick-set',
    title: 'もう一本たべたい！',
    description: '「はずれのアイス棒」「あたりのアイス棒」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-feather-set',
    title: '大空のきらめき',
    description: '「ふわふわの羽根」「なないろの羽根」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-gem-set',
    title: 'ジュエルキャッツ',
    description: '「あかいろの宝石」「あおいろの宝石」「きいろの宝石」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-dragon-set',
    title: '竜の伝説',
    description: '「りゅうの鱗」「りゅうの爪」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-dandelion-seed-set',
    title: '陽だまりのおとしもの',
    description: '「やわらかい綿毛」「ひまわりの種」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-super-rare-trio-set',
    title: '至高の輝き',
    description: '「よつばのクローバー」「ほしのかけら」「りゅうの鱗」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-ultra-rare-set',
    title: '幻のマスター',
    description: '「なないろの羽根」「いにしえの歯車」「りゅうの爪」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-rainbow-colors-set',
    title: 'パレットキャット',
    description: '「みどりのクローバー」「みどりのスーパーボール」「しろいサイコロ」「ももいろのハンカチ」「あおい空き缶」「あかいろの宝石」「あおいろの宝石」「きいろの宝石」「なないろの羽根」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-pair-socks',
    title: '両足そろった！',
    description: '「かたっぽの靴下」を2個以上集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-cat-treasures-set',
    title: 'ねこのひみつコレクション',
    description: '「まるまった毛玉」「ぬけたじぶんのヒゲ」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-shiny-shiny-set',
    title: '光の収集家',
    description: '「きらきらしたおはじき」「ちいさな鈴」「ほしのかけら」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-dark-collector-set',
    title: '闇の収集家',
    description: '「だいじそうな紙」「やみの結晶」「うさんくさい自己啓発本」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-beach-treasures-set',
    title: '浜辺のたからもの',
    description: '「ちいさな貝殻」「かるい流木」「きらきら貝殻」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
  {
    id: 'hidden-coins-set',
    title: 'コインコレクター',
    description: '「ぴかぴかのコイン」「ふしぎな古銭」「おうごんの小判」「きせきのエラーコイン」をすべて集めた。',
    iconType: 'sparkle',
    category: 'gift',
    isHidden: true,
  },
] as const;

/** localStorage 保存用キー */
export const ACHIEVEMENTS_STORAGE_KEY = 'nekoppoi_achievements';

/**
 * 実績一覧画面での表示用テキスト情報
 */
export interface AchievementDisplayInfo {
  /** 画面表示用タイトル（未獲得時は伏せ字「？？？」） */
  displayTitle: string;
  /** 画面表示用説明文（未獲得の隠し実績は伏せ字「？？？？？？」、通常実績は未獲得でも条件を表示） */
  displayDescription: string;
  /** 獲得済みフラグ */
  isUnlocked: boolean;
  /** 隠し実績フラグ */
  isHidden: boolean;
}

/**
 * 実績の獲得状態および隠し実績設定に基づいて、実績一覧画面に表示すべきタイトルと説明文を決定する純粋関数
 * - 通常の実績:
 *   - 獲得前: 名前のみ伏せ字（「？？？」）、獲得条件（説明文）は表示
 *   - 獲得後: 名前と説明文を表示
 * - 隠し実績:
 *   - 獲得前: 名前（「？？？」）と獲得条件（「？？？？？？」）の両方を伏せ字にして存在のみわかるようにする
 *   - 獲得後: 名前と説明文を表示
 */
export function getAchievementDisplayInfo(
  item: AchievementItem,
  isUnlocked: boolean
): AchievementDisplayInfo {
  const isHidden = !!item.isHidden;

  if (isUnlocked) {
    return {
      displayTitle: item.title,
      displayDescription: item.description,
      isUnlocked: true,
      isHidden,
    };
  }

  // 未獲得の場合
  return {
    displayTitle: '？？？',
    displayDescription: isHidden ? '？？？？？？' : item.description,
    isUnlocked: false,
    isHidden,
  };
}

/**
 * 実績IDから実績情報を取得する純粋関数
 */
export function getAchievementById(
  id: AchievementId,
  catalog: readonly AchievementItem[] = ACHIEVEMENTS
): AchievementItem | undefined {
  return catalog.find((item) => item.id === id);
}

/**
 * 実績チェック時に渡されるアクションおよび現在の状態コンテキスト
 */
export interface AchievementCheckContext {
  /** 直前に実行したアクション */
  action?: 'pet' | 'feed' | 'play' | 'gift' | 'rename';
  /** 自動ごはんによるアクションかどうか（手動給餌・ふれあい実績の除外判定用） */
  isAutoFeed?: boolean;
  /** チェック実行時の現在時刻（ミリ秒タイムスタンプまたはDate、未指定時はDate.now()） */
  now?: number | Date;
  /** チェック実行時の現在の時（0〜23、テストおよび指定用） */
  currentHour?: number;
  /** 現在のごきげんスコア（0 〜 100） */
  moodScore?: number;
  /** 現在のごきげんレベル */
  moodLevel?: CatMoodLevel;
  /** 現在のまんぷく度スコア（0 〜 100） */
  fullnessScore?: number;
  /** 現在のまんぷく度レベル */
  fullnessLevel?: CatFullnessLevel;
  /** 現在の累計おくりもの受取個数 */
  totalGifts?: number;
  /** ふり返り手帳のお世話統計データ */
  careStats?: CareStats;
  /** 直前に受け取ったギフトアイテム（レア度判定用） */
  receivedGift?: GiftItem | null;
  /** レアなおくりものを所持しているか（インベントリ全体の判定） */
  hasRareGift?: boolean;
  /** スーパーレアなおくりものを所持しているか（インベントリ全体の判定） */
  hasSuperRareGift?: boolean;
  /** ウルトラレアなおくりものを所持しているか（インベントリ全体の判定） */
  hasUltraRareGift?: boolean;
  /** 猫の名前を変更したか */
  isCatRenamed?: boolean;
  /** 変更後の猫の名前（単体） */
  catName?: string;
  /** 全猫の名前マップ（複数） */
  catNames?: Partial<Record<CatId, string>>;
  /** お留守番レポートを受け取ったかどうか */
  hasOfflineReport?: boolean;
  /** 対象の猫のなつき度レベル */
  affectionLevel?: number;
  /** 全猫の中の最高なつき度レベル */
  maxAffectionLevel?: number;
  /** 全猫の中の最低なつき度レベル（全員なかよし判定用） */
  minAffectionLevel?: number;
  /** 現在のおくりものインベントリ（セット収集判定用） */
  giftInventory?: GiftInventory;
}

/**
 * 指定したすべてのおくりものを1個以上所持しているか（または直前に受け取ったか）判定する純粋関数
 */
export function hasAllGifts(
  inventory: GiftInventory | undefined,
  targetIds: readonly string[],
  receivedGiftId?: string
): boolean {
  return targetIds.every((id) => {
    const inInv = (inventory?.[id]?.count ?? 0) >= 1;
    const isJustReceived = id === receivedGiftId;
    return inInv || isJustReceived;
  });
}

/**
 * 指定した特定のおくりものを指定個数以上所持しているか判定する純粋関数
 */
export function hasGiftCount(
  inventory: GiftInventory | undefined,
  giftId: string,
  minCount: number
): boolean {
  const currentCount = inventory?.[giftId]?.count ?? 0;
  return currentCount >= minCount;
}

/**
 * 現在のコンテキストと既知の実績解除マップを照合し、新しく解除された実績のリストを返す純粋関数
 * 複数の実績が同時に条件を満たした場合は、満たしたすべての実績が返されます。
 */
export function checkNewAchievements(
  context: AchievementCheckContext,
  unlocked: UnlockedAchievements,
  catalog: readonly AchievementItem[] = ACHIEVEMENTS
): AchievementItem[] {
  const newAchievements: AchievementItem[] = [];

  for (const item of catalog) {
    // 既に解除済みの実績はスキップ
    if (unlocked[item.id]) {
      continue;
    }

    let isMet = false;
    switch (item.id) {
      // --- 初回系 ---
      case 'first-pet':
        if (context.action === 'pet') {
          isMet = true;
        }
        break;

      case 'first-feed':
        if (context.action === 'feed') {
          isMet = true;
        }
        break;

      case 'first-play':
        if (context.action === 'play') {
          isMet = true;
        }
        break;

      case 'mood-ecstatic':
        if (
          context.moodLevel === 'ecstatic' ||
          (typeof context.moodScore === 'number' && context.moodScore >= 100)
        ) {
          isMet = true;
        }
        break;

      case 'first-gift':
        if (
          context.action === 'gift' ||
          (typeof context.totalGifts === 'number' && context.totalGifts > 0)
        ) {
          isMet = true;
        }
        break;

      case 'unique-gifts-10': {
        const uniqueIds = new Set<string>();
        if (context.giftInventory) {
          for (const [id, record] of Object.entries(context.giftInventory)) {
            if (record && record.count > 0) {
              uniqueIds.add(id);
            }
          }
        }
        if (context.receivedGift) {
          uniqueIds.add(context.receivedGift.id);
        }
        if (uniqueIds.size >= 10) {
          isMet = true;
        }
        break;
      }

      case 'unique-gifts-40': {
        const uniqueIds = new Set<string>();
        if (context.giftInventory) {
          for (const [id, record] of Object.entries(context.giftInventory)) {
            if (record && record.count > 0) {
              uniqueIds.add(id);
            }
          }
        }
        if (context.receivedGift) {
          uniqueIds.add(context.receivedGift.id);
        }
        if (uniqueIds.size >= 40) {
          isMet = true;
        }
        break;
      }

      // --- まんぷく系 ---
      case 'fullness-full':
        if (
          context.fullnessLevel === 'full' ||
          (typeof context.fullnessScore === 'number' && context.fullnessScore >= 100)
        ) {
          isMet = true;
        }
        break;

      // --- お世話・状態連携系 ---
      case 'perfect-satisfaction':
        if (
          typeof context.moodScore === 'number' &&
          context.moodScore >= 100 &&
          typeof context.fullnessScore === 'number' &&
          context.fullnessScore >= 100
        ) {
          isMet = true;
        }
        break;

      // --- 連続ふれあい日数系 (Streak) ---
      case 'streak-3':
        if (
          context.careStats &&
          (context.careStats.currentStreakDays >= 3 || context.careStats.maxStreakDays >= 3)
        ) {
          isMet = true;
        }
        break;

      case 'streak-7':
        if (
          context.careStats &&
          (context.careStats.currentStreakDays >= 7 || context.careStats.maxStreakDays >= 7)
        ) {
          isMet = true;
        }
        break;

      case 'streak-14':
        if (
          context.careStats &&
          (context.careStats.currentStreakDays >= 14 || context.careStats.maxStreakDays >= 14)
        ) {
          isMet = true;
        }
        break;

      case 'streak-30':
        if (
          context.careStats &&
          (context.careStats.currentStreakDays >= 30 || context.careStats.maxStreakDays >= 30)
        ) {
          isMet = true;
        }
        break;

      // --- 合計日数系 ---
      case 'total-days-7':
        if (context.careStats && context.careStats.totalActiveDays >= 7) {
          isMet = true;
        }
        break;

      case 'total-days-14':
        if (context.careStats && context.careStats.totalActiveDays >= 14) {
          isMet = true;
        }
        break;

      case 'total-days-30':
        if (context.careStats && context.careStats.totalActiveDays >= 30) {
          isMet = true;
        }
        break;

      // --- なでた総回数系 ---
      case 'pet-count-100':
        if (context.careStats && context.careStats.totalPetCount >= 100) {
          isMet = true;
        }
        break;

      case 'pet-count-500':
        if (context.careStats && context.careStats.totalPetCount >= 500) {
          isMet = true;
        }
        break;

      case 'pet-count-1000':
        if (context.careStats && context.careStats.totalPetCount >= 1000) {
          isMet = true;
        }
        break;

      case 'pet-count-5000':
        if (context.careStats && context.careStats.totalPetCount >= 5000) {
          isMet = true;
        }
        break;

      case 'pet-count-10000':
        if (context.careStats && context.careStats.totalPetCount >= 10000) {
          isMet = true;
        }
        break;

      // --- ごはんをあげた総回数系 ---
      case 'feed-count-100':
        if (context.careStats && context.careStats.totalFeedCount >= 100) {
          isMet = true;
        }
        break;

      case 'feed-count-500':
        if (context.careStats && context.careStats.totalFeedCount >= 500) {
          isMet = true;
        }
        break;

      case 'feed-count-1000':
        if (context.careStats && context.careStats.totalFeedCount >= 1000) {
          isMet = true;
        }
        break;

      case 'feed-count-5000':
        if (context.careStats && context.careStats.totalFeedCount >= 5000) {
          isMet = true;
        }
        break;

      case 'feed-count-10000':
        if (context.careStats && context.careStats.totalFeedCount >= 10000) {
          isMet = true;
        }
        break;

      // --- おもちゃで遊んだ総回数系 ---
      case 'play-count-100':
        if (context.careStats && context.careStats.totalPlayCount >= 100) {
          isMet = true;
        }
        break;

      case 'play-count-500':
        if (context.careStats && context.careStats.totalPlayCount >= 500) {
          isMet = true;
        }
        break;

      case 'play-count-1000':
        if (context.careStats && context.careStats.totalPlayCount >= 1000) {
          isMet = true;
        }
        break;

      case 'play-count-5000':
        if (context.careStats && context.careStats.totalPlayCount >= 5000) {
          isMet = true;
        }
        break;

      case 'play-count-10000':
        if (context.careStats && context.careStats.totalPlayCount >= 10000) {
          isMet = true;
        }
        break;

      // --- おくりものの総数系 ---
      case 'gift-count-20':
        if (typeof context.totalGifts === 'number' && context.totalGifts >= 20) {
          isMet = true;
        }
        break;

      case 'gift-count-100':
        if (typeof context.totalGifts === 'number' && context.totalGifts >= 100) {
          isMet = true;
        }
        break;

      case 'gift-count-222':
        if (typeof context.totalGifts === 'number' && context.totalGifts >= 222) {
          isMet = true;
        }
        break;

      case 'gift-count-500':
        if (typeof context.totalGifts === 'number' && context.totalGifts >= 500) {
          isMet = true;
        }
        break;

      case 'gift-count-1000':
        if (typeof context.totalGifts === 'number' && context.totalGifts >= 1000) {
          isMet = true;
        }
        break;

      // --- レアおくりもの系 ---
      case 'first-rare-gift':
        if (
          context.receivedGift?.rarity === 'rare' ||
          context.receivedGift?.rarity === 'super-rare' ||
          context.receivedGift?.rarity === 'ultra-rare' ||
          context.hasRareGift === true
        ) {
          isMet = true;
        }
        break;

      case 'first-super-rare-gift':
        if (
          context.receivedGift?.rarity === 'super-rare' ||
          context.hasSuperRareGift === true ||
          (context.giftInventory &&
            Object.keys(context.giftInventory).some(
              (id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare'
            ))
        ) {
          isMet = true;
        }
        break;

      case 'first-ultra-rare-gift':
        if (
          context.receivedGift?.rarity === 'ultra-rare' ||
          context.hasUltraRareGift === true ||
          (context.giftInventory &&
            Object.keys(context.giftInventory).some(
              (id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare'
            ))
        ) {
          isMet = true;
        }
        break;

      // --- 猫の名前変更系 ---
      case 'first-rename-cat':
        if (context.action === 'rename' || context.isCatRenamed === true) {
          isMet = true;
        }
        break;

      case 'rename-cat-neko':
        if (
          context.action === 'rename' ||
          context.isCatRenamed === true ||
          context.catName ||
          context.catNames
        ) {
          const targetNames = ['ねこ', 'ネコ', 'にゃんこ'];
          const singleMatch = context.catName ? targetNames.includes(context.catName.trim()) : false;
          const multiMatch = context.catNames
            ? Object.values(context.catNames).some((n) => n && targetNames.includes(n.trim()))
            : false;
          if (singleMatch || multiMatch) {
            isMet = true;
          }
        }
        break;

      case 'first-auto-feed':
        if (context.action === 'feed' && context.isAutoFeed === true) {
          isMet = true;
        }
        break;

      case 'first-offline-report':
        if (context.hasOfflineReport === true) {
          isMet = true;
        }
        break;

      // --- 時間帯・生活リズム系 ---
      case 'time-midnight-pet':
        if (
          !context.isAutoFeed &&
          (context.action === 'pet' || context.action === 'feed' || context.action === 'play')
        ) {
          const hour =
            context.currentHour ??
            (context.now ? new Date(context.now).getHours() : new Date().getHours());
          if (hour >= 0 && hour < 2) {
            isMet = true;
          }
        }
        break;

      case 'time-early-morning-pet':
        if (
          !context.isAutoFeed &&
          (context.action === 'pet' || context.action === 'feed' || context.action === 'play')
        ) {
          const hour =
            context.currentHour ??
            (context.now ? new Date(context.now).getHours() : new Date().getHours());
          if (hour >= 5 && hour < 7) {
            isMet = true;
          }
        }
        break;

      case 'time-lunch-feed':
        if (context.action === 'feed' && !context.isAutoFeed) {
          const hour =
            context.currentHour ??
            (context.now ? new Date(context.now).getHours() : new Date().getHours());
          if (hour >= 11 && hour < 13) {
            isMet = true;
          }
        }
        break;

      case 'time-snack-feed':
        if (context.action === 'feed' && !context.isAutoFeed) {
          const hour =
            context.currentHour ??
            (context.now ? new Date(context.now).getHours() : new Date().getHours());
          if (hour >= 15 && hour < 16) {
            isMet = true;
          }
        }
        break;

      // --- なつき度レベル系 ---
      case 'affection-level-5':
        if (
          (typeof context.maxAffectionLevel === 'number' && context.maxAffectionLevel >= 5) ||
          (typeof context.affectionLevel === 'number' && context.affectionLevel >= 5)
        ) {
          isMet = true;
        }
        break;

      case 'affection-level-10':
        if (
          (typeof context.maxAffectionLevel === 'number' && context.maxAffectionLevel >= 10) ||
          (typeof context.affectionLevel === 'number' && context.affectionLevel >= 10)
        ) {
          isMet = true;
        }
        break;

      case 'all-cats-loved':
        if (context.careStats?.interactionsByCat) {
          const byCat = context.careStats.interactionsByCat;
          if (
            (byCat['black'] ?? 0) > 0 &&
            (byCat['white'] ?? 0) > 0 &&
            (byCat['calico'] ?? 0) > 0
          ) {
            isMet = true;
          }
        }
        break;

      case 'all-cats-affection-3':
        if (typeof context.minAffectionLevel === 'number' && context.minAffectionLevel >= 3) {
          isMet = true;
        }
        break;

      case 'all-cats-affection-10':
        if (typeof context.minAffectionLevel === 'number' && context.minAffectionLevel >= 10) {
          isMet = true;
        }
        break;

      // --- 隠し実績：おくりもの収集セット ---
      case 'hidden-pebble-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['pebble', 'mossy-pebble', 'glowing-moss-stone'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-branch-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['twig', 'splendid-branch'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-clover-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['clover', 'four-leaf-clover'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-cicada-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['cicada-shell', 'cicada-wing'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-ice-stick-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['ice-stick', 'winning-ice-stick'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-feather-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['feather', 'rainbow-feather'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-gem-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['red-gem', 'blue-gem', 'yellow-gem'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-dragon-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['dragon-scale', 'dragon-claw'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-dandelion-seed-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['soft-dandelion', 'sunflower-seed'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-super-rare-trio-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['four-leaf-clover', 'star-fragment', 'dragon-scale'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-ultra-rare-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['rainbow-feather', 'ancient-gear', 'dragon-claw'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-rainbow-colors-set':
        if (
          hasAllGifts(
            context.giftInventory,
            [
              'clover',
              'super-ball',
              'white-dice',
              'pink-handkerchief',
              'blue-can',
              'red-gem',
              'blue-gem',
              'yellow-gem',
              'rainbow-feather',
            ],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-pair-socks':
        if (hasGiftCount(context.giftInventory, 'single-sock', 2)) {
          isMet = true;
        }
        break;

      case 'hidden-cat-treasures-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['hairball', 'cat-whisker'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-shiny-shiny-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['glass-marble', 'small-bell', 'star-fragment'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-dark-collector-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['important-paper', 'dark-crystal', 'shady-self-help-book'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-beach-treasures-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['seashell', 'light-driftwood', 'sparkling-seashell'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      case 'hidden-coins-set':
        if (
          hasAllGifts(
            context.giftInventory,
            ['shiny-coin', 'old-coin', 'golden-koban', 'miracle-error-coin'],
            context.receivedGift?.id
          )
        ) {
          isMet = true;
        }
        break;

      default:
        break;
    }

    if (isMet) {
      newAchievements.push(item);
    }
  }

  return newAchievements;
}

/**
 * localStorage から読み込んだ生データを安全な UnlockedAchievements にサニタイズする純粋関数
 */
export function sanitizeAchievements(raw: unknown): UnlockedAchievements {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const result: UnlockedAchievements = {};
  const obj = raw as Record<string, unknown>;

  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const rec = val as Record<string, unknown>;
      const unlockedAt =
        typeof rec.unlockedAt === 'number' && Number.isFinite(rec.unlockedAt)
          ? rec.unlockedAt
          : Date.now();

      result[key] = {
        id: key,
        unlockedAt,
      };
    }
  }

  return result;
}

export interface FilterAchievementsOptions {
  /** カテゴリ絞り込み（'all' または各カテゴリ文字列） */
  category?: string;
  /** 達成状況絞り込み（'all': すべて, 'unlocked': 達成済みのみ, 'locked': 未達成のみ, 'recent': 新着10件） */
  status?: AchievementStatusFilter;
  /** 新着順表示時の最大取得件数（デフォルト: 10） */
  recentLimit?: number;
}

/**
 * 獲得済みの実績を達成日時の新しい順（降順）に最大件数まで取得する純粋関数
 */
export function getRecentUnlockedAchievements(
  catalog: readonly AchievementItem[],
  unlocked: UnlockedAchievements,
  limit: number = 10
): AchievementItem[] {
  return catalog
    .filter((item) => !!unlocked[item.id])
    .sort((a, b) => {
      const timeA = unlocked[a.id]?.unlockedAt ?? 0;
      const timeB = unlocked[b.id]?.unlockedAt ?? 0;
      return timeB - timeA;
    })
    .slice(0, limit);
}

/**
 * カテゴリと達成状況に基づいて実績カタログを絞り込む純粋関数
 */
export function filterAchievements(
  catalog: readonly AchievementItem[],
  unlocked: UnlockedAchievements,
  options: FilterAchievementsOptions = {}
): AchievementItem[] {
  const { category = 'all', status = 'all', recentLimit = 10 } = options;

  if (status === 'recent') {
    const categoryFiltered = catalog.filter((item) => {
      if (category !== 'all' && (item.category ?? 'interaction') !== category) {
        return false;
      }
      return !!unlocked[item.id];
    });

    return categoryFiltered
      .sort((a, b) => {
        const timeA = unlocked[a.id]?.unlockedAt ?? 0;
        const timeB = unlocked[b.id]?.unlockedAt ?? 0;
        return timeB - timeA;
      })
      .slice(0, recentLimit);
  }

  return catalog.filter((item) => {
    // カテゴリ判定
    if (category !== 'all' && (item.category ?? 'interaction') !== category) {
      return false;
    }
    // 達成状況判定
    const isUnlocked = !!unlocked[item.id];
    if (status === 'unlocked' && !isUnlocked) {
      return false;
    }
    if (status === 'locked' && isUnlocked) {
      return false;
    }
    return true;
  });
}

/**
 * 実績の達成日時タイムスタンプを日本語の日付文字列（例: 2026年11月16日）に整形する純粋関数
 * タイムスタンプが無効または未設定の場合は空文字を返します
 */
export function formatAchievementDate(timestamp: number | null | undefined): string {
  if (timestamp == null || !Number.isFinite(timestamp)) {
    return '';
  }

  const d = new Date(timestamp);
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 実績進捗のオブジェクトを生成する内部ヘルパー
 */
function createProgress(currentRaw: number, target: number, unit: string): AchievementProgress {
  const current = Math.min(Math.max(0, currentRaw), target);
  return {
    current,
    target,
    unit,
    fractionText: `${current} / ${target} ${unit}`,
  };
}

/**
 * 未達成の通常実績について、回数や日数などの進捗状況（分数表示用）を計算する純粋関数
 * 隠し実績や初回達成型（0か1のアクション）など、進捗数値の対象外となる実績は null を返します
 */
export function getAchievementProgress(
  item: AchievementItem,
  context?: AchievementProgressContext
): AchievementProgress | null {
  // 隠し実績は獲得前は伏せ字（？？？）のため進捗は非表示
  if (item.isHidden) {
    return null;
  }

  const careStats = context?.careStats;
  const giftInventory = context?.giftInventory;

  switch (item.id) {
    // --- なでた総回数系 ---
    case 'pet-count-100':
      return createProgress(careStats?.totalPetCount ?? 0, 100, '回');
    case 'pet-count-500':
      return createProgress(careStats?.totalPetCount ?? 0, 500, '回');
    case 'pet-count-1000':
      return createProgress(careStats?.totalPetCount ?? 0, 1000, '回');
    case 'pet-count-5000':
      return createProgress(careStats?.totalPetCount ?? 0, 5000, '回');
    case 'pet-count-10000':
      return createProgress(careStats?.totalPetCount ?? 0, 10000, '回');

    // --- ごはんをあげた総回数系 ---
    case 'feed-count-100':
      return createProgress(careStats?.totalFeedCount ?? 0, 100, '回');
    case 'feed-count-500':
      return createProgress(careStats?.totalFeedCount ?? 0, 500, '回');
    case 'feed-count-1000':
      return createProgress(careStats?.totalFeedCount ?? 0, 1000, '回');
    case 'feed-count-5000':
      return createProgress(careStats?.totalFeedCount ?? 0, 5000, '回');
    case 'feed-count-10000':
      return createProgress(careStats?.totalFeedCount ?? 0, 10000, '回');

    // --- おもちゃで遊んだ総回数系 ---
    case 'play-count-100':
      return createProgress(careStats?.totalPlayCount ?? 0, 100, '回');
    case 'play-count-500':
      return createProgress(careStats?.totalPlayCount ?? 0, 500, '回');
    case 'play-count-1000':
      return createProgress(careStats?.totalPlayCount ?? 0, 1000, '回');
    case 'play-count-5000':
      return createProgress(careStats?.totalPlayCount ?? 0, 5000, '回');
    case 'play-count-10000':
      return createProgress(careStats?.totalPlayCount ?? 0, 10000, '回');

    // --- 連続ふれあい日数系 (Streak) ---
    case 'streak-3': {
      const currentStreak = Math.max(careStats?.currentStreakDays ?? 0, careStats?.maxStreakDays ?? 0);
      return createProgress(currentStreak, 3, '日');
    }
    case 'streak-7': {
      const currentStreak = Math.max(careStats?.currentStreakDays ?? 0, careStats?.maxStreakDays ?? 0);
      return createProgress(currentStreak, 7, '日');
    }
    case 'streak-14': {
      const currentStreak = Math.max(careStats?.currentStreakDays ?? 0, careStats?.maxStreakDays ?? 0);
      return createProgress(currentStreak, 14, '日');
    }
    case 'streak-30': {
      const currentStreak = Math.max(careStats?.currentStreakDays ?? 0, careStats?.maxStreakDays ?? 0);
      return createProgress(currentStreak, 30, '日');
    }

    // --- 合計日数系 ---
    case 'total-days-7':
      return createProgress(careStats?.totalActiveDays ?? 0, 7, '日');
    case 'total-days-14':
      return createProgress(careStats?.totalActiveDays ?? 0, 14, '日');
    case 'total-days-30':
      return createProgress(careStats?.totalActiveDays ?? 0, 30, '日');

    // --- おくりものの総数系 ---
    case 'gift-count-20':
      return createProgress(getTotalGiftCount(giftInventory ?? {}), 20, '個');
    case 'gift-count-100':
      return createProgress(getTotalGiftCount(giftInventory ?? {}), 100, '個');
    case 'gift-count-222':
      return createProgress(getTotalGiftCount(giftInventory ?? {}), 222, '個');
    case 'gift-count-500':
      return createProgress(getTotalGiftCount(giftInventory ?? {}), 500, '個');
    case 'gift-count-1000':
      return createProgress(getTotalGiftCount(giftInventory ?? {}), 1000, '個');

    // --- おくりもの種類数系 ---
    case 'unique-gifts-10':
      return createProgress(getAcquiredGiftTypeCount(giftInventory ?? {}, CAT_GIFTS), 10, '種類');
    case 'unique-gifts-40':
      return createProgress(getAcquiredGiftTypeCount(giftInventory ?? {}, CAT_GIFTS), 40, '種類');

    // --- なつき度レベル系 ---
    case 'affection-level-5':
      return createProgress(context?.maxAffectionLevel ?? 1, 5, 'Lv');
    case 'affection-level-10':
      return createProgress(context?.maxAffectionLevel ?? 1, 10, 'Lv');
    case 'all-cats-affection-3':
      return createProgress(context?.minAffectionLevel ?? 1, 3, 'Lv');
    case 'all-cats-affection-10':
      return createProgress(context?.minAffectionLevel ?? 1, 10, 'Lv');

    // --- 全猫ふれあい ---
    case 'all-cats-loved': {
      const byCat = careStats?.interactionsByCat ?? {};
      const lovedCatsCount = (['black', 'white', 'calico'] as const).filter(
        (c) => (byCat[c] ?? 0) > 0
      ).length;
      return createProgress(lovedCatsCount, 3, '匹');
    }

    default:
      return null;
  }
}



