import {
  AchievementId,
  AchievementItem,
  AchievementRecord,
  UnlockedAchievements,
} from '../types/achievement.ts';
import { CatMoodLevel } from '../types/mood.ts';

/**
 * 実績マスターデータリスト（初期5種類、今後追加可能）
 * 現在実装されている5種類の実績はすべて「通常の実績（isHidden: false）」です。
 */
export const ACHIEVEMENTS: readonly AchievementItem[] = [
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
  action?: 'pet' | 'feed' | 'play' | 'gift';
  /** 現在のごきげんスコア（0 〜 100） */
  moodScore?: number;
  /** 現在のごきげんレベル */
  moodLevel?: CatMoodLevel;
  /** 現在の累計おくりもの受取個数 */
  totalGifts?: number;
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
