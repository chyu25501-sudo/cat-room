import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, AlertTriangle, KeyRound, UserCheck, X } from 'lucide-react';
import { CloudCredentials } from '../../utils/cloudAuth.ts';

export interface CloudMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: CloudCredentials | null;
  previousEmail?: string;
}

export const CloudMigrationModal: React.FC<CloudMigrationModalProps> = ({
  isOpen,
  onClose,
  credentials,
  previousEmail,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen || !credentials) {
    return null;
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(credentials.userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // コピー失敗時のフォールバック（何もしない）
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(credentials.transferKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {
      // コピー失敗時のフォールバック
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="migration-modal-title"
      data-testid="cloud-migration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* ヘッダー装飾 */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-sky-100 block">
                クラウド連携 仕様変更のお知らせ
              </span>
              <h2 id="migration-modal-title" className="text-lg font-black tracking-tight">
                ID連携への移行が完了しました
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 本文エリア */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-stone-700 text-xs sm:text-sm">
          {/* 丁寧な案内文 */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/70 text-sky-950 leading-relaxed space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-sky-900">
              <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>メール登録方式の廃止とID連携への移行について</span>
            </p>
            <p className="text-xs text-sky-800 leading-relaxed">
              プライバシー保護とセキュリティ向上のため、メールアドレスによるアカウント登録方式を廃止し、
              個人情報の入力が不要な**「連携ID方式」**へリニューアルいたしました。
            </p>
            {previousEmail && (
              <p className="text-xs text-sky-700">
                これまでご利用いただいていたメールアカウント（<span className="font-semibold">{previousEmail}</span>）のデータは、
                **下記の新しい連携IDへ自動的かつ安全に引き継がれました。**
              </p>
            )}
          </div>

          {/* 新しい連携情報カード */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              あなた専用の新しい連携情報
            </h3>

            {/* 連携ID */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-stone-400 block">連携ID（プレイヤーID）</span>
                <span data-testid="migration-user-id" className="text-base font-black text-stone-800 tracking-wider">
                  {credentials.userId}
                </span>
              </div>
              <button
                type="button"
                data-testid="migration-copy-id-btn"
                onClick={handleCopyId}
                aria-label="連携IDをコピー"
                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1 transition-colors border border-sky-200 shrink-0 cursor-pointer"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>コピー</span>
                  </>
                )}
              </button>
            </div>

            {/* 引き継ぎキー */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-stone-400 block flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-500" />
                  <span>連携・引き継ぎパスワード（秘密コード）</span>
                </span>
                <span data-testid="migration-transfer-key" className="text-base font-mono font-bold text-amber-700 tracking-wider">
                  {credentials.transferKey}
                </span>
              </div>
              <button
                type="button"
                data-testid="migration-copy-key-btn"
                onClick={handleCopyKey}
                aria-label="連携パスワードをコピー"
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1 transition-colors border border-amber-200 shrink-0 cursor-pointer"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>コピー</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 重要なお願い・注意 */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">【大切なお願い】IDとパスワードを保管してください</p>
              <p className="text-amber-800 leading-relaxed">
                メールアドレスの登録がなくなったため、万が一ブラウザのCookieや履歴を消去した場合、再発行メール等での復旧ができません。
                別の端末（スマホやPC）と連携して続きを遊ぶ際やバックアップのため、**連携IDとパスワードをスクリーンショットやメモ等で控えて大切に保管してください**。
                （※連携パスワードは、設定画面からいつでもお好みのパスワードに変更できます）
              </p>
            </div>
          </div>
        </div>

        {/* フッター確認ボタン */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            data-testid="migration-confirm-button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            確認しました（閉じる）
          </button>
        </div>
      </div>
    </div>
  );
};
