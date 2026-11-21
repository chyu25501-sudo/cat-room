import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateCloudCredentials,
  getInternalEmailFromUserId,
  isInternalDummyEmail,
  getStoredCloudCredentials,
  setStoredCloudCredentials,
  getOrCreateCloudCredentials,
  isValidUserIdFormat,
  CLOUD_CREDENTIALS_STORAGE_KEY,
} from './cloudAuth.ts';

describe('cloudAuth ユーティリティ (ランダムID連携・認証情報管理)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generateCloudCredentials で正しいフォーマットの連携IDとキーが生成されること', () => {
    const creds = generateCloudCredentials();
    expect(creds.userId).toMatch(/^NK-[2-9A-Z]{4}-[2-9A-Z]{4}$/);
    expect(creds.transferKey).toHaveLength(12);
    expect(creds.createdAt).toBeGreaterThan(0);
  });

  it('getInternalEmailFromUserId で安全な内部メールアドレスが生成されること', () => {
    const email = getInternalEmailFromUserId('NK-A8F2-9X4B');
    expect(email).toBe('user-nka8f29x4b@nekoppoi.internal');
  });

  it('isInternalDummyEmail でダミーメールアドレスを正しく判定できること', () => {
    expect(isInternalDummyEmail('user-nka8f29x4b@nekoppoi.internal')).toBe(true);
    expect(isInternalDummyEmail('test@gmail.com')).toBe(false);
    expect(isInternalDummyEmail(undefined)).toBe(false);
    expect(isInternalDummyEmail(null)).toBe(false);
  });

  it('getOrCreateCloudCredentials で初回呼び出し時に生成・保存され、2回目以降は同じものが返ること', () => {
    expect(localStorage.getItem(CLOUD_CREDENTIALS_STORAGE_KEY)).toBeNull();

    const creds1 = getOrCreateCloudCredentials();
    expect(creds1.userId).toMatch(/^NK-/);
    expect(localStorage.getItem(CLOUD_CREDENTIALS_STORAGE_KEY)).not.toBeNull();

    const creds2 = getOrCreateCloudCredentials();
    expect(creds2.userId).toBe(creds1.userId);
    expect(creds2.transferKey).toBe(creds1.transferKey);
  });

  it('setStoredCloudCredentials で保存した情報を getStoredCloudCredentials で取得できること', () => {
    const sample = {
      userId: 'NK-TEST-1234',
      transferKey: 'abc123xyz789',
      createdAt: 1700000000000,
    };
    setStoredCloudCredentials(sample);
    const retrieved = getStoredCloudCredentials();
    expect(retrieved).toEqual(sample);
  });

  it('isValidUserIdFormat で連携IDのフォーマット検証ができること', () => {
    expect(isValidUserIdFormat('NK-A8F2-9X4B')).toBe(true);
    expect(isValidUserIdFormat('NK-2345-6789')).toBe(true);
    expect(isValidUserIdFormat('invalid-id')).toBe(false);
    expect(isValidUserIdFormat('')).toBe(false);
  });
});
