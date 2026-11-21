/**
 * クラウドID連携用の認証情報管理・ID生成ユーティリティ
 */

export interface CloudCredentials {
  /** ユーザーに表示される連携ID（例: NK-A8F2-9X4B） */
  userId: string;
  /** ユーザーに表示される秘密の引き継ぎキー（12文字の英数字） */
  transferKey: string;
  /** 発行日時（タイムスタンプ） */
  createdAt: number;
}

export const CLOUD_CREDENTIALS_STORAGE_KEY = 'nekoppoi_cloud_credentials';
export const CLOUD_MIGRATION_SEEN_STORAGE_KEY = 'nekoppoi_cloud_migration_seen';

/**
 * 視認性が高く入力間違いの少ない英数字文字セット（紛らわしい 0, O, 1, I, l を除外）
 */
const ID_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const KEY_CHARSET = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * ランダムな文字列を生成する
 */
function getRandomString(length: number, charset: string): string {
  let result = '';
  const charsetLength = charset.length;
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charsetLength];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charsetLength)];
    }
  }
  return result;
}

/**
 * 新しいランダムな連携ID（例: NK-A8F2-9X4B）と引き継ぎキーを生成する
 */
export function generateCloudCredentials(): CloudCredentials {
  const part1 = getRandomString(4, ID_CHARSET);
  const part2 = getRandomString(4, ID_CHARSET);
  const userId = `NK-${part1}-${part2}`;
  const transferKey = getRandomString(12, KEY_CHARSET);

  return {
    userId,
    transferKey,
    createdAt: Date.now(),
  };
}

/**
 * 連携IDと引き継ぎキーから、Supabase Auth 内部用のダミーメールアドレスを生成する
 */
export function getInternalEmailFromUserId(userId: string): string {
  // 小文字化して記号を正規化
  const sanitized = userId.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `user-${sanitized}@nekoppoi.internal`;
}

/**
 * 与えられたメールアドレスが内部生成されたダミーアドレスかどうかを判定する
 */
export function isInternalDummyEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith('@nekoppoi.internal');
}

/**
 * ローカルストレージから保存済みの連携情報を取得する
 */
export function getStoredCloudCredentials(): CloudCredentials | null {
  try {
    const raw = localStorage.getItem(CLOUD_CREDENTIALS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.userId === 'string' && typeof parsed.transferKey === 'string') {
      return {
        userId: parsed.userId,
        transferKey: parsed.transferKey,
        createdAt: typeof parsed.createdAt === 'number' ? parsed.createdAt : Date.now(),
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to read cloud credentials from localStorage:', e);
    return null;
  }
}

/**
 * ローカルストレージに連携情報を保存する
 */
export function setStoredCloudCredentials(credentials: CloudCredentials): void {
  try {
    localStorage.setItem(CLOUD_CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
  } catch (e) {
    console.error('Failed to save cloud credentials to localStorage:', e);
  }
}

/**
 * 既存の連携情報を取得するか、未作成の場合は新規発行して一度だけ保存する
 */
export function getOrCreateCloudCredentials(): CloudCredentials {
  const existing = getStoredCloudCredentials();
  if (existing) {
    return existing;
  }
  const newlyCreated = generateCloudCredentials();
  setStoredCloudCredentials(newlyCreated);
  return newlyCreated;
}

/**
 * 連携IDの入力フォーマットが正しいか検証する
 */
export function isValidUserIdFormat(userId: string): boolean {
  // NK-XXXX-XXXX（英数字）または NKXXXXXXXX などの柔軟な許容
  const cleaned = userId.trim().toUpperCase();
  return /^NK-[2-9A-Z]{4}-[2-9A-Z]{4}$/.test(cleaned);
}
