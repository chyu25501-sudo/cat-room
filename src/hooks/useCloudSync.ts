import { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';
import type { NekoppoiSaveData } from '../types/saveData.ts';
import { mergeSaveData, validateAndSanitizeSaveData } from '../utils/saveData.ts';
import {
  CloudCredentials,
  getOrCreateCloudCredentials,
  getStoredCloudCredentials,
  setStoredCloudCredentials,
  getInternalEmailFromUserId,
  isInternalDummyEmail,
  isValidUserIdFormat,
} from '../utils/cloudAuth.ts';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface MigrationInfo {
  isOpen: boolean;
  previousEmail: string;
  credentials: CloudCredentials;
}

export interface UseCloudSyncReturn {
  isConfigured: boolean;
  user: User | null;
  credentials: CloudCredentials | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  syncStatus: SyncStatus;
  syncMessage: string | null;
  lastSyncedAt: number | null;
  migrationInfo: MigrationInfo | null;
  dismissMigrationModal: () => void;
  linkWithCredentials: (
    userId: string,
    transferKey: string,
    currentLocalData?: NekoppoiSaveData
  ) => Promise<{ success: boolean; message: string; mergedData?: NekoppoiSaveData | null }>;
  updateTransferKey: (newKey: string) => Promise<{ success: boolean; message: string }>;
  syncWithCloud: (localData: NekoppoiSaveData) => Promise<NekoppoiSaveData | null>;
  clearMessage: () => void;
}

export function useCloudSync(): UseCloudSyncReturn {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<CloudCredentials | null>(() => {
    return getStoredCloudCredentials() || getOrCreateCloudCredentials();
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [migrationInfo, setMigrationInfo] = useState<MigrationInfo | null>(null);

  const isConfigured = Boolean(supabase);
  const credentialsRef = useRef(credentials);
  credentialsRef.current = credentials;

  // Supabase Auth 初期化とサイレント認証・メールからの移行処理
  useEffect(() => {
    const creds = getOrCreateCloudCredentials();
    setCredentials(creds);

    if (!supabase) {
      setIsLoadingAuth(false);
      return;
    }

    let isMounted = true;

    async function initAuth() {
      if (!supabase) return;

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Failed to get session:', sessionError);
        }

        const currentUser = session?.user;

        // 1. 既存のメールユーザーからの自動移行チェック
        if (currentUser && currentUser.email && !isInternalDummyEmail(currentUser.email)) {
          const oldEmail = currentUser.email;

          // 旧アカウントのクラウドセーブデータを取得
          let oldCloudData: NekoppoiSaveData | null = null;
          try {
            const { data: row } = await supabase
              .from('user_saves')
              .select('save_data')
              .eq('user_id', currentUser.id)
              .maybeSingle();
            if (row?.save_data) {
              oldCloudData = validateAndSanitizeSaveData(row.save_data);
            }
          } catch (e) {
            console.error('Failed to fetch old cloud data during migration:', e);
          }

          // 新しいID・キーでサインアップまたはサインイン
          const newEmail = getInternalEmailFromUserId(creds.userId);
          const newPass = creds.transferKey;

          // 旧セッションからサインアウト
          await supabase.auth.signOut();

          // 新IDでサインアップ試行（失敗した場合はサインイン）
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: newEmail,
            password: newPass,
          });

          let newUser = signUpData?.user;
          if (signUpError || !newUser) {
            const { data: signInData } = await supabase.auth.signInWithPassword({
              email: newEmail,
              password: newPass,
            });
            newUser = signInData?.user ?? null;
          }

          if (newUser) {
            // 旧データを新アカウントのクラウドテーブルに保存
            if (oldCloudData) {
              await supabase.from('user_saves').upsert(
                {
                  user_id: newUser.id,
                  save_data: oldCloudData,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
              );
            }

            if (isMounted) {
              setUser(newUser);
              setMigrationInfo({
                isOpen: true,
                previousEmail: oldEmail,
                credentials: creds,
              });
              setSyncStatus('synced');
              setSyncMessage('ID連携への移行が完了しました！');
            }
          }
          return;
        }

        // 2. 既に内部ダミーアドレスでログイン中の場合
        if (currentUser && isInternalDummyEmail(currentUser.email)) {
          if (isMounted) {
            setUser(currentUser);
          }
          return;
        }

        // 3. 未ログインの場合：現在の credentials でサイレントサインイン／サインアップ
        const dummyEmail = getInternalEmailFromUserId(creds.userId);
        const dummyPass = creds.transferKey;

        // まずサインイン試行
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: dummyEmail,
          password: dummyPass,
        });

        if (signInData?.user) {
          if (isMounted) {
            setUser(signInData.user);
          }
          return;
        }

        // サインイン失敗（未登録）の場合、自動サインアップ
        if (signInError) {
          const { data: signUpData } = await supabase.auth.signUp({
            email: dummyEmail,
            password: dummyPass,
          });
          if (signUpData?.user && isMounted) {
            setUser(signUpData.user);
          }
        }
      } catch (err) {
        console.error('Silent auth error:', err);
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    }

    initAuth();

    // 認証状態の変化を購読
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

  const dismissMigrationModal = useCallback(() => {
    setMigrationInfo((prev) => (prev ? { ...prev, isOpen: false } : null));
  }, []);

  // 別端末からのデータ引き継ぎ（連携IDと引き継ぎキーを入力して接続）
  const linkWithCredentials = useCallback(
    async (
      inputUserId: string,
      inputKey: string,
      currentLocalData?: NekoppoiSaveData
    ): Promise<{ success: boolean; message: string; mergedData?: NekoppoiSaveData | null }> => {
      if (!supabase) {
        return { success: false, message: 'クラウド設定が見つかりません。' };
      }

      const trimmedId = inputUserId.trim().toUpperCase();
      const trimmedKey = inputKey.trim();

      if (!trimmedId || !trimmedKey) {
        return { success: false, message: '連携IDと引き継ぎキーを入力してください。' };
      }

      if (!isValidUserIdFormat(trimmedId)) {
        return { success: false, message: '連携IDの形式が正しくありません。（例: NK-A8F2-9X4B）' };
      }

      setSyncStatus('syncing');
      setSyncMessage('アカウントを引き継ぎ中...');

      try {
        const dummyEmail = getInternalEmailFromUserId(trimmedId);

        // 指定のIDとキーでサインイン
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: dummyEmail,
          password: trimmedKey,
        });

        if (authError || !authData.user) {
          setSyncStatus('error');
          const msg = '連携IDまたは引き継ぎキーが一致しませんでした。';
          setSyncMessage(msg);
          return { success: false, message: msg };
        }

        const newUser = authData.user;
        setUser(newUser);

        // 新しい連携情報をローカルに保存
        const newCreds: CloudCredentials = {
          userId: trimmedId,
          transferKey: trimmedKey,
          createdAt: Date.now(),
        };
        setStoredCloudCredentials(newCreds);
        setCredentials(newCreds);

        // クラウド側のセーブデータを取得してローカルとマージ
        let mergedResult: NekoppoiSaveData | null = null;
        const { data: cloudRow } = await supabase
          .from('user_saves')
          .select('save_data')
          .eq('user_id', newUser.id)
          .maybeSingle();

        if (cloudRow?.save_data && currentLocalData) {
          const cloudSaveData = validateAndSanitizeSaveData(cloudRow.save_data);
          mergedResult = mergeSaveData(currentLocalData, cloudSaveData);

          // クラウドにもマージ後のデータを即時反映
          await supabase.from('user_saves').upsert(
            {
              user_id: newUser.id,
              save_data: mergedResult,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        } else if (cloudRow?.save_data) {
          mergedResult = validateAndSanitizeSaveData(cloudRow.save_data);
        }

        setLastSyncedAt(Date.now());
        setSyncStatus('synced');
        const successMsg = 'データの連携が完了しました！これ以降、複数端末で同じ猫ちゃんデータが自動同期されます。';
        setSyncMessage(successMsg);

        return {
          success: true,
          message: successMsg,
          mergedData: mergedResult,
        };
      } catch (err: unknown) {
        setSyncStatus('error');
        const msg = err instanceof Error ? err.message : '引き継ぎ処理中にエラーが発生しました';
        setSyncMessage(msg);
        return { success: false, message: msg };
      }
    },
    []
  );

  // 引き継ぎ秘密パスワードの変更
  const updateTransferKey = useCallback(
    async (newKey: string): Promise<{ success: boolean; message: string }> => {
      const trimmed = newKey.trim();
      if (!trimmed) {
        return { success: false, message: '新しいパスワードを入力してください。' };
      }
      if (trimmed.length < 6) {
        return { success: false, message: 'パスワードは6文字以上で設定してください。' };
      }

      if (!supabase || !user) {
        // オフライン・未設定環境の場合でもローカルのキーを更新
        const currentCreds = credentialsRef.current || getOrCreateCloudCredentials();
        const updatedCreds: CloudCredentials = {
          ...currentCreds,
          transferKey: trimmed,
        };
        setStoredCloudCredentials(updatedCreds);
        setCredentials(updatedCreds);
        return { success: true, message: '連携・引き継ぎパスワードを変更しました！' };
      }

      setSyncStatus('syncing');
      setSyncMessage('パスワードを更新中...');

      try {
        const { error } = await supabase.auth.updateUser({
          password: trimmed,
        });

        if (error) {
          setSyncStatus('error');
          const msg = `パスワードの更新に失敗しました: ${error.message}`;
          setSyncMessage(msg);
          return { success: false, message: msg };
        }

        const currentCreds = credentialsRef.current || getOrCreateCloudCredentials();
        const updatedCreds: CloudCredentials = {
          ...currentCreds,
          transferKey: trimmed,
        };
        setStoredCloudCredentials(updatedCreds);
        setCredentials(updatedCreds);

        setSyncStatus('synced');
        const successMsg = '連携・引き継ぎパスワードを変更しました！';
        setSyncMessage(successMsg);
        return { success: true, message: successMsg };
      } catch (err: unknown) {
        setSyncStatus('error');
        const msg = err instanceof Error ? err.message : 'パスワード変更中にエラーが発生しました';
        setSyncMessage(msg);
        return { success: false, message: msg };
      }
    },
    [user]
  );

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
    isConfigured,
    user,
    credentials,
    isAuthenticated: Boolean(user),
    isLoadingAuth,
    syncStatus,
    syncMessage,
    lastSyncedAt,
    migrationInfo,
    dismissMigrationModal,
    linkWithCredentials,
    updateTransferKey,
    syncWithCloud,
    clearMessage,
  };
}
