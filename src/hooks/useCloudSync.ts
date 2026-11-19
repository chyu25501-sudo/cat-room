import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import type { NekoppoiSaveData } from '../types/saveData.ts';
import { mergeSaveData, validateAndSanitizeSaveData } from '../utils/saveData.ts';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface UseCloudSyncReturn {
  isConfigured: boolean;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  syncStatus: SyncStatus;
  syncMessage: string | null;
  lastSyncedAt: number | null;
  signUp: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<{ success: boolean; message: string }>;
  syncWithCloud: (localData: NekoppoiSaveData) => Promise<NekoppoiSaveData | null>;
  clearMessage: () => void;
}

export function useCloudSync(): UseCloudSyncReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // 初期認証セッションの取得および購読
  useEffect(() => {
    if (!supabase) {
      setIsLoadingAuth(false);
      return;
    }

    let isMounted = true;

    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (isMounted) {
        if (!error && session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoadingAuth(false);
      }
    });

    // 認証状態の変更（ログイン・ログアウト）を購読
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 新規登録
  const signUp = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
      if (!supabase) {
        return { success: false, message: 'クラウド設定が見つかりません。' };
      }
      if (!email.trim() || !pass.trim()) {
        return { success: false, message: 'メールアドレスとパスワードを入力してください。' };
      }
      if (pass.length < 6) {
        return { success: false, message: 'パスワードは6文字以上で設定してください。' };
      }

      setSyncStatus('syncing');
      setSyncMessage('アカウントを作成中...');

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass.trim(),
        });

        if (error) {
          setSyncStatus('error');
          const msg =
            error.message.includes('already registered')
              ? 'このメールアドレスは既に登録されています。ログインをお試しください。'
              : `登録に失敗しました: ${error.message}`;
          setSyncMessage(msg);
          return { success: false, message: msg };
        }

        // ログイン成功（Confirm email がオフの場合）
        if (data.user) {
          setUser(data.user);
          setSyncStatus('synced');
          const msg = 'アカウントの作成とログインが完了しました！';
          setSyncMessage(msg);
          return { success: true, message: msg };
        }

        setSyncStatus('synced');
        const msg = 'アカウントを作成しました。確認メールが送信された場合はご確認ください。';
        setSyncMessage(msg);
        return { success: true, message: msg };
      } catch (err: unknown) {
        setSyncStatus('error');
        const msg = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
        setSyncMessage(msg);
        return { success: false, message: msg };
      }
    },
    []
  );

  // ログイン
  const signIn = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
      if (!supabase) {
        return { success: false, message: 'クラウド設定が見つかりません。' };
      }
      if (!email.trim() || !pass.trim()) {
        return { success: false, message: 'メールアドレスとパスワードを入力してください。' };
      }

      setSyncStatus('syncing');
      setSyncMessage('ログイン中...');

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass.trim(),
        });

        if (error) {
          setSyncStatus('error');
          const msg =
            error.message.includes('Invalid login credentials')
              ? 'メールアドレスまたはパスワードが正しくありません。'
              : `ログインに失敗しました: ${error.message}`;
          setSyncMessage(msg);
          return { success: false, message: msg };
        }

        if (data.user) {
          setUser(data.user);
          setSyncStatus('synced');
          const msg = 'ログインに成功しました！';
          setSyncMessage(msg);
          return { success: true, message: msg };
        }

        return { success: false, message: 'ログインユーザー情報を取得できませんでした。' };
      } catch (err: unknown) {
        setSyncStatus('error');
        const msg = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
        setSyncMessage(msg);
        return { success: false, message: msg };
      }
    },
    []
  );

  // ログアウト
  const signOut = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!supabase) {
      return { success: false, message: 'クラウド設定が見つかりません。' };
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSyncStatus('idle');
      setSyncMessage('ログアウトしました。ローカルデータで動作します。');
      return { success: true, message: 'ログアウトしました。' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ログアウト中にエラーが発生しました';
      setSyncStatus('error');
      setSyncMessage(msg);
      return { success: false, message: msg };
    }
  }, []);

  // クラウドとの双方向同期（マージ）
  const syncWithCloud = useCallback(
    async (localData: NekoppoiSaveData): Promise<NekoppoiSaveData | null> => {
      if (!supabase || !user) {
        return null;
      }

      setSyncStatus('syncing');
      setSyncMessage('クラウドと同期中...');

      try {
        // 1. クラウド側のセーブデータを取得
        const { data: cloudRow, error: fetchError } = await supabase
          .from('user_saves')
          .select('save_data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        let targetDataToSave: NekoppoiSaveData;

        if (cloudRow && cloudRow.save_data) {
          // 既存のクラウドデータがある場合、検証してマージ
          const cloudSaveData = validateAndSanitizeSaveData(cloudRow.save_data);
          targetDataToSave = mergeSaveData(localData, cloudSaveData);
        } else {
          // 初回保存の場合、現在のローカルデータをそのまま登録
          targetDataToSave = localData;
        }

        // 2. クラウドへ保存（upsert）
        const { error: upsertError } = await supabase.from('user_saves').upsert(
          {
            user_id: user.id,
            save_data: targetDataToSave,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

        if (upsertError) {
          throw upsertError;
        }

        const now = Date.now();
        setLastSyncedAt(now);
        setSyncStatus('synced');
        setSyncMessage('クラウドとの同期が完了しました！');

        return targetDataToSave;
      } catch (err: unknown) {
        setSyncStatus('error');
        const msg = err instanceof Error ? err.message : 'クラウド同期中にエラーが発生しました';
        setSyncMessage(`同期エラー: ${msg}`);
        return null;
      }
    },
    [user]
  );

  const clearMessage = useCallback(() => {
    setSyncMessage(null);
    if (syncStatus !== 'syncing') {
      setSyncStatus('idle');
    }
  }, [syncStatus]);

  return {
    isConfigured: isSupabaseConfigured,
    user,
    isAuthenticated: Boolean(user),
    isLoadingAuth,
    syncStatus,
    syncMessage,
    lastSyncedAt,
    signUp,
    signIn,
    signOut,
    syncWithCloud,
    clearMessage,
  };
}
