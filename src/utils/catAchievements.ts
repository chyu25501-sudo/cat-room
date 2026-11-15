import {
  AchievementId,
  AchievementItem,
  AchievementRecord,
  UnlockedAchievements,
} from '../types/achievement.ts';
import { CatMoodLevel } from '../types/mood.ts';
import { CatFullnessLevel } from '../types/fullness.ts';
import { CareStats } from '../types/journal.ts';
import { GiftItem } from '../types/gift.ts';

/**
 * 実績マスターデータリスト（全35種類）
 * すべて「通常の実績（isHidden: false）」として定義されています。
 */
export const ACHIEVEMENTS: readonly AchievementItem[] = [
  // --- 初期ふれあい実績 ---
  {
    id: 'first-pet',
    title: 'はじめまして！',
    description: '猫ちゃんを初めてなでなでしてふれあった。',
    iconType: 'paw',
    isHidden: false,
  },
  {
    id: 'first-feed',
    title: 'ごはんの時間',
    description: '猫ちゃんに初めてごはんを食べさせてあげた。',
    iconType: 'food',
    isHidden: false,
  },
  {
    id: 'first-play',
    title: 'あそぼうよ！',
    description: '猫ちゃんと初めておもちゃを使って遊んだ。',
    iconType: 'toy',
    isHidden: false,
  },
  {
    id: 'mood-ecstatic',
    title: 'ゴロゴロごきげん',
    description: '猫ちゃんのごきげん度を最高（大よろこび）にした。',
    iconType: 'sparkle',
    isHidden: false,
  },
  {
    id: 'first-gift',
    title: '小さなプレゼント',
    description: '猫ちゃんから初めておくりものを受け取った。',
    iconType: 'gift',
    isHidden: false,
  },

  // --- まんぷく実績 ---
  {
    id: 'fullness-full',
    title: 'おなかいっぱい！',
    description: '猫ちゃんのまんぷく度を最高（まんぷく）にした。',
    iconType: 'food',
    isHidden: false,
  },

  // --- 連続ふれあい日数実績（Streak） ---
  {
    id: 'streak-3',
    title: 'まいにちのおともだち',
    description: '3日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    isHidden: false,
  },
  {
    id: 'streak-7',
    title: 'いっしゅうかん一緒',
    description: '7日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    isHidden: false,
  },
  {
    id: 'streak-14',
    title: 'ふたしゅうかんの絆',
    description: '14日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    isHidden: false,
  },
  {
    id: 'streak-30',
    title: 'まいにち猫日和',
    description: '30日連続で猫ちゃんとふれあった。',
    iconType: 'calendar',
    isHidden: false,
  },

  // --- ふれあい合計日数実績 ---
  {
    id: 'total-days-7',
    title: '7日間の思い出',
    description: 'ふれあった合計日数が7日になった。',
    iconType: 'calendar',
    isHidden: false,
  },
  {
    id: 'total-days-14',
    title: '14日間の積み重ね',
    description: 'ふれあった合計日数が14日になった。',
    iconType: 'calendar',
    isHidden: false,
  },
  {
    id: 'total-days-30',
    title: 'ひと月のかけがえのない時間',
    description: 'ふれあった合計日数が30日になった。',
    iconType: 'calendar',
    isHidden: false,
  },

  // --- 猫を撫でた総回数実績 ---
  {
    id: 'pet-count-100',
    title: 'なでなでマスター',
    description: '猫を撫でた総回数が100回を超えた。',
    iconType: 'paw',
    isHidden: false,
  },
  {
    id: 'pet-count-500',
    title: 'なでなで名人',
    description: '猫を撫でた総回数が500回を超えた。',
    iconType: 'paw',
    isHidden: false,
  },
  {
    id: 'pet-count-1000',
    title: '極上のなでなで職人',
    description: '猫を撫でた総回数が1000回を超えた。',
    iconType: 'paw',
    isHidden: false,
  },
  {
    id: 'pet-count-5000',
    title: '神の手を持つ撫で手',
    description: '猫を撫でた総回数が5000回を超えた。',
    iconType: 'paw',
    isHidden: false,
  },
  {
    id: 'pet-count-10000',
    title: '伝説のなでなで愛好家',
    description: '猫を撫でた総回数が10000回を超えた。',
    iconType: 'paw',
    isHidden: false,
  },

  // --- ごはんをあげた総回数実績 ---
  {
    id: 'feed-count-100',
    title: 'もぐもぐシェフ',
    description: 'ごはんをあげた総回数が100回を超えた。',
    iconType: 'food',
    isHidden: false,
  },
  {
    id: 'feed-count-500',
    title: 'グルメのごちそう番',
    description: 'ごはんをあげた総回数が500回を超えた。',
    iconType: 'food',
    isHidden: false,
  },
  {
    id: 'feed-count-1000',
    title: '三ツ星ごはんマイスター',
    description: 'ごはんをあげた総回数が1000回を超えた。',
    iconType: 'food',
    isHidden: false,
  },
  {
    id: 'feed-count-5000',
    title: '愛の宮廷料理人',
    description: 'ごはんをあげた総回数が5000回を超えた。',
    iconType: 'food',
    isHidden: false,
  },
  {
    id: 'feed-count-10000',
    title: '満腹の守護神',
    description: 'ごはんをあげた総回数が10000回を超えた。',
    iconType: 'food',
    isHidden: false,
  },

  // --- おもちゃで遊んだ総回数実績 ---
  {
    id: 'play-count-100',
    title: 'あそびの天才',
    description: 'おもちゃで遊んだ総回数が100回を超えた。',
    iconType: 'toy',
    isHidden: false,
  },
  {
    id: 'play-count-500',
    title: 'じゃらしのエキスパート',
    description: 'おもちゃで遊んだ総回数が500回を超えた。',
    iconType: 'toy',
    isHidden: false,
  },
  {
    id: 'play-count-1000',
    title: '熱狂のエンターテイナー',
    description: 'おもちゃで遊んだ総回数が1000回を超えた。',
    iconType: 'toy',
    isHidden: false,
  },
  {
    id: 'play-count-5000',
    title: '奇跡のプレイメーカー',
    description: 'おもちゃで遊んだ総回数が5000回を超えた。',
    iconType: 'toy',
    isHidden: false,
  },
  {
    id: 'play-count-10000',
    title: '無限のあそび王',
    description: 'おもちゃで遊んだ総回数が10000回を超えた。',
    iconType: 'toy',
    isHidden: false,
  },

  // --- おくりものの総数実績 ---
  {
    id: 'gift-count-20',
    title: 'たからもの集め',
    description: '受け取ったおくりものの総数が20個を超えた。',
    iconType: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-100',
    title: 'おくりものコレクター',
    description: '受け取ったおくりものの総数が100個を超えた。',
    iconType: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-222',
    title: 'にゃんにゃんトレジャー',
    description: '受け取ったおくりものの総数が222個を超えた。',
    iconType: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-500',
    title: '大富豪の宝箱',
    description: '受け取ったおくりものの総数が500個を超えた。',
    iconType: 'gift',
    isHidden: false,
  },
  {
    id: 'gift-count-1000',
    title: '伝説のギフトマスター',
    description: '受け取ったおくりものの総数が1000個を超えた。',
    iconType: 'gift',
    isHidden: false,
  },

  // --- レアおくりもの実績 ---
  {
    id: 'first-rare-gift',
    title: '特別なめぐり逢い',
    description: 'はじめてレアなおくりものを受け取った。',
    iconType: 'sparkle',
    isHidden: false,
  },

  // --- 猫の名前変更実績 ---
  {
    id: 'first-rename-cat',
    title: 'あたらしいお名前',
    description: 'いずれかの猫の名前をはじめて変更した。',
    iconType: 'paw',
    isHidden: false,
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
  /** 猫の名前を変更したか */
  isCatRenamed?: boolean;
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
          context.hasRareGift === true
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
