import {
  AchievementCategory,
  AchievementId,
  AchievementItem,
  AchievementRecord,
  UnlockedAchievements,
} from '../types/achievement.ts';
import { CatMoodLevel } from '../types/mood.ts';
import { CatFullnessLevel } from '../types/fullness.ts';
import { CareStats } from '../types/journal.ts';
import { GiftItem, GiftInventory } from '../types/gift.ts';
import { CAT_GIFTS } from './catGifts.ts';

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
 * 実績マスターデータリスト（全52種類: 通常実績39種類 + 隠し実績13種類）
 * カテゴリごとにグループ化して整列（ふれあい -> お世話 -> おくりもの）
 */
export const ACHIEVEMENTS: readonly AchievementItem[] = [
  // ==========================================
  // 【ふれあい】カテゴリ（計17種類）
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

  // ==========================================
  // 【お世話】カテゴリ（計13種類）
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

  // ==========================================
  // 【おくりもの】カテゴリ（計9種類）
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
  // 【おくりもの】隠し実績（計13種類、isHidden: true）
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
  /** 対象の猫のなつき度レベル */
  affectionLevel?: number;
  /** 全猫の中の最高なつき度レベル */
  maxAffectionLevel?: number;
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
 * 指定した特定のおくりものを指定個数以上所持しているか（または直前に受け取ったか）判定する純粋関数
 */
export function hasGiftCount(
  inventory: GiftInventory | undefined,
  giftId: string,
  minCount: number,
  receivedGiftId?: string
): boolean {
  const currentCount = inventory?.[giftId]?.count ?? 0;
  const total = currentCount + (receivedGiftId === giftId ? 1 : 0);
  return total >= minCount;
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

      // --- まんぷく系 ---
      case 'fullness-full':
        if (
          context.fullnessLevel === 'full' ||
          (typeof context.fullnessScore === 'number' && context.fullnessScore >= 100)
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
        if (
          hasGiftCount(
            context.giftInventory,
            'single-sock',
            2,
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
