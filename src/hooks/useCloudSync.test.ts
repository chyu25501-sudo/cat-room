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

describe('useCloudSync フック', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mockAuth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
    mockAuth.signUp.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@example.com' } },
      error: null,
    });
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@example.com' } },
      error: null,
    });
    mockAuth.signOut.mockResolvedValue({ error: null });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it('初期化時に未ログイン状態であること', async () => {
    let hookResult: ReturnType<typeof renderHook<ReturnType<typeof useCloudSync>, unknown>> | undefined;
    await act(async () => {
      hookResult = renderHook(() => useCloudSync());
    });

    const result = hookResult!.result;
    expect(result.current.isConfigured).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('signUp で新規登録が成功するとユーザー情報がセットされること', async () => {
    const { result } = renderHook(() => useCloudSync());

    let res: { success: boolean; message: string } | undefined;
    await act(async () => {
      res = await result.current.signUp('cat@example.com', 'password123');
    });

    expect(res?.success).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.syncStatus).toBe('synced');
  });

  it('パスワードが6文字未満の場合はバリデーションエラーになること', async () => {
    const { result } = renderHook(() => useCloudSync());

    let res: { success: boolean; message: string } | undefined;
    await act(async () => {
      res = await result.current.signUp('cat@example.com', '12345');
    });

    expect(res?.success).toBe(false);
    expect(res?.message).toContain('6文字以上');
  });

  it('signIn でログインが成功すること', async () => {
    const { result } = renderHook(() => useCloudSync());

    let res: { success: boolean; message: string } | undefined;
    await act(async () => {
      res = await result.current.signIn('cat@example.com', 'password123');
    });

    expect(res?.success).toBe(true);
    expect(result.current.user?.id).toBe('user-1');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signOut でログアウトすると未ログイン状態に戻ること', async () => {
    const { result } = renderHook(() => useCloudSync());

    await act(async () => {
      await result.current.signIn('cat@example.com', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('未ログイン時は syncWithCloud を呼んでも null を返すこと', async () => {
    const { result } = renderHook(() => useCloudSync());

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

    expect(syncedData).toBeNull();
  });

  it('ログイン済みのとき、初回同期でローカルデータがクラウドに保存されること', async () => {
    const { result } = renderHook(() => useCloudSync());

    await act(async () => {
      await result.current.signIn('cat@example.com', 'password123');
    });

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
      gifts: {
        bell: {
          giftId: 'bell',
          count: 2,
          byCat: { black: 2 },
          firstReceivedAt: 1000,
          lastReceivedAt: 2000,
        },
      },
    };

    let syncedData: NekoppoiSaveData | null = null;
    await act(async () => {
      syncedData = await result.current.syncWithCloud(sampleLocal);
    });

    expect(syncedData).toEqual(sampleLocal);
    expect(result.current.syncStatus).toBe('synced');
    expect(result.current.lastSyncedAt).not.toBeNull();
    expect(mockFrom).toHaveBeenCalledWith('user_saves');
  });

  it('ログイン済みのとき、既存のクラウドデータと合算（マージ）されて保存・反映されること', async () => {
    const cloudSaveData: NekoppoiSaveData = {
      version: 1,
      timestamp: 1500,
      settings: {
        soundEnabled: true,
        catNames: { black: 'クロ', white: 'しろねこ', calico: 'みけねこ' },
        gaugePosition: 'bottom',
        autoFeedEnabled: false,
        compactAffectionCelebration: false,
      },
      gifts: {
        bell: {
          giftId: 'bell',
          count: 5,
          byCat: { black: 5 },
          firstReceivedAt: 500,
          lastReceivedAt: 2500,
        },
      },
    };

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { save_data: cloudSaveData },
        error: null,
      }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useCloudSync());

    await act(async () => {
      await result.current.signIn('cat@example.com', 'password123');
    });

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
      gifts: {
        bell: {
          giftId: 'bell',
          count: 2,
          byCat: { black: 2 },
          firstReceivedAt: 1000,
          lastReceivedAt: 2000,
        },
      },
    };

    let syncedData: NekoppoiSaveData | null = null;
    await act(async () => {
      syncedData = await result.current.syncWithCloud(sampleLocal);
    });

    // おくりものの個数は多い方の 5 個にマージされる
    expect(syncedData?.gifts?.bell.count).toBe(5);
    // 名前はクラウドの「クロ」にマージされる
    expect(syncedData?.settings.catNames.black).toBe('クロ');
  });
});
