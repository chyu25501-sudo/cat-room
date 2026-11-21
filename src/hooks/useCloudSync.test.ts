import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NekoppoiSaveData } from '../types/saveData.ts';

// vi.hoisted でモック関数を巻き上げ定義
const { mockAuth, mockFrom } = vi.hoisted(() => {
  return {
    mockAuth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn(),
    },
    mockFrom: vi.fn(),
  };
});

vi.mock('../lib/supabase.ts', () => {
  return {
    isSupabaseConfigured: true,
    supabase: {
      auth: mockAuth,
      from: (...args: unknown[]) => mockFrom(...args),
    },
  };
});

import { useCloudSync } from './useCloudSync.ts';
import { CLOUD_CREDENTIALS_STORAGE_KEY } from '../utils/cloudAuth.ts';

describe('useCloudSync フック (ID連携・メール移行対応)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mockAuth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
    mockAuth.signUp.mockResolvedValue({
      data: { user: { id: 'user-new', email: 'user-nka8f29x4b@nekoppoi.internal' } },
      error: null,
    });
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-new', email: 'user-nka8f29x4b@nekoppoi.internal' } },
      error: null,
    });
    mockAuth.signOut.mockResolvedValue({ error: null });
    mockAuth.updateUser.mockResolvedValue({ data: { user: {} }, error: null });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it('初回起動時に連携IDが自動生成され、ローカルストレージに一度だけ保存されること', async () => {
    expect(localStorage.getItem(CLOUD_CREDENTIALS_STORAGE_KEY)).toBeNull();

    let hookResult: ReturnType<typeof renderHook<ReturnType<typeof useCloudSync>, unknown>> | undefined;
    await act(async () => {
      hookResult = renderHook(() => useCloudSync());
    });

    const result = hookResult!.result;
    expect(result.current.credentials).not.toBeNull();
    expect(result.current.credentials?.userId).toMatch(/^NK-/);
    expect(localStorage.getItem(CLOUD_CREDENTIALS_STORAGE_KEY)).not.toBeNull();
  });

  it('未ログイン時、内部ダミーアドレスでサイレントサインインまたはサインアップが実行されること', async () => {
    let hookResult: ReturnType<typeof renderHook<ReturnType<typeof useCloudSync>, unknown>> | undefined;
    await act(async () => {
      hookResult = renderHook(() => useCloudSync());
    });

    expect(mockAuth.signInWithPassword).toHaveBeenCalled();
    expect(hookResult!.result.current.isAuthenticated).toBe(true);
  });

  it('既存のメールユーザーでログインしていた場合、自動でID連携へ移行され migrationInfo がセットされること', async () => {
    // 既存のメールアドレスユーザーのセッションをモック
    mockAuth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'legacy-email-user', email: 'legacy@example.com' },
        },
      },
      error: null,
    });

    let hookResult: ReturnType<typeof renderHook<ReturnType<typeof useCloudSync>, unknown>> | undefined;
    await act(async () => {
      hookResult = renderHook(() => useCloudSync());
    });

    const result = hookResult!.result;
    // 旧セッションからサインアウトされ、新IDで登録される
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(result.current.migrationInfo).not.toBeNull();
    expect(result.current.migrationInfo?.previousEmail).toBe('legacy@example.com');
    expect(result.current.migrationInfo?.isOpen).toBe(true);

    // dismissMigrationModal で閉じられること
    act(() => {
      result.current.dismissMigrationModal();
    });
    expect(result.current.migrationInfo?.isOpen).toBe(false);
  });

  it('linkWithCredentials で別の端末の連携IDと引き継ぎキーを入力して引き継ぎが成功すること', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'transferred-user', email: 'user-nk99998888@nekoppoi.internal' } },
      error: null,
    });

    const { result } = renderHook(() => useCloudSync());

    let res: { success: boolean; message: string; mergedData?: NekoppoiSaveData | null } | undefined;
    await act(async () => {
      res = await result.current.linkWithCredentials('NK-9999-8888', 'validkey1234');
    });

    expect(res?.success).toBe(true);
    expect(result.current.credentials?.userId).toBe('NK-9999-8888');
    expect(result.current.syncStatus).toBe('synced');
  });

  it('linkWithCredentials でフォーマットが不正な場合はエラーを返すこと', async () => {
    const { result } = renderHook(() => useCloudSync());

    let res: { success: boolean; message: string } | undefined;
    await act(async () => {
      res = await result.current.linkWithCredentials('invalid-id', 'key');
    });

    expect(res?.success).toBe(false);
    expect(res?.message).toContain('形式が正しくありません');
  });

  it('syncWithCloud でローカルデータをクラウドと同期できること', async () => {
    let hookResult: ReturnType<typeof renderHook<ReturnType<typeof useCloudSync>, unknown>> | undefined;
    await act(async () => {
      hookResult = renderHook(() => useCloudSync());
    });

    const result = hookResult!.result;

    const sampleLocal: NekoppoiSaveData = {
      version: 1,
      timestamp: 1000,
      settings: {
        soundEnabled: true,
        catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
        gaugePosition: 'bottom',
        autoFeedEnabled: false,
        compactAffectionCelebration: false,
      },
    };

    let syncedData: NekoppoiSaveData | null = null;
    await act(async () => {
      syncedData = await result.current.syncWithCloud(sampleLocal);
    });

    expect(syncedData).not.toBeNull();
    expect(result.current.syncStatus).toBe('synced');
    expect(result.current.lastSyncedAt).toBeGreaterThan(0);
  });

  it('updateTransferKey で引き継ぎパスワードの変更が成功し、ローカル情報が更新されること', async () => {
    let hookResult: ReturnType<typeof renderHook<ReturnType<typeof useCloudSync>, unknown>> | undefined;
    await act(async () => {
      hookResult = renderHook(() => useCloudSync());
    });

    const result = hookResult!.result;

    let res: { success: boolean; message: string } | undefined;
    await act(async () => {
      res = await result.current.updateTransferKey('myNewPass123');
    });

    expect(res?.success).toBe(true);
    expect(mockAuth.updateUser).toHaveBeenCalledWith({ password: 'myNewPass123' });
    expect(result.current.credentials?.transferKey).toBe('myNewPass123');
  });

  it('updateTransferKey で6文字未満のパスワードはエラーになること', async () => {
    const { result } = renderHook(() => useCloudSync());

    let res: { success: boolean; message: string } | undefined;
    await act(async () => {
      res = await result.current.updateTransferKey('12345');
    });

    expect(res?.success).toBe(false);
    expect(res?.message).toContain('6文字以上');
  });
});
