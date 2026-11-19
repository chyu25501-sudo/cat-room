import React from 'react';
import { X, ShieldCheck, Lock, Database, FileText, CheckCircle2 } from 'lucide-react';

export interface PrivacyPolicyModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
}

/**
 * プライバシーとデータの取り扱い方針モーダル
 * アカウントデータやセーブデータの安全管理について明記するコンポーネント
 */
export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      data-testid="privacy-policy-modal"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（クリックで閉じる） */}
      <div
        data-testid="privacy-policy-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダルカード本体 */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* ヘッダー */}
        <div className="px-5 py-3.5 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-amber-50/40 to-sky-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="privacy-policy-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                データの取り扱いとプライバシー
              </h2>
              <p className="text-[11px] text-stone-500">
                安心してお楽しみいただくための方針
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="プライバシー方針を閉じる"
            data-testid="privacy-policy-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* スクロール可能な本文コンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-left text-xs text-stone-700 leading-relaxed">
          {/* 基本方針 */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>基本方針（端末内保存・完全無料）</span>
            </div>
            <p className="text-stone-600">
              「ねこっぽい」は、原則としてお使いのブラウザ（端末内）にのみデータを保存して動作するプライバシー配慮設計です。
              アカウント作成やクラウド連携は<strong>希望される方のみの任意機能</strong>であり、登録を行わなくてもすべての要素（お世話・なつき度・おくりもの・実績など）を完全無料でお楽しみいただけます。
            </p>
          </div>

          {/* 取得する情報 */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Database className="w-4 h-4 text-sky-600 shrink-0" />
              <span>取得する情報</span>
            </div>
            <p className="mb-1 text-stone-600">
              クラウド連携（アカウント作成）をご利用いただく場合のみ、以下の情報を安全にお預かりします：
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li><strong>ログイン情報</strong>：登録時に入力されたメールアドレス</li>
              <li><strong>セーブデータ</strong>：猫ちゃんたちのお名前、ごきげん度、まんぷく度、なつき度、おくりもの獲得状況、実績解除状況、手帳の統計</li>
            </ul>
          </div>

          {/* 利用目的 */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>利用目的</span>
            </div>
            <p className="text-stone-600">
              お預かりした情報は、<strong>「異なる端末（PCやスマートフォン）間でのセーブデータの同期・引き継ぎ」および「ログイン認証」のみ</strong>に使用します。
              宣伝メールや広告の送信、マーケティング分析などの他の用途には一切利用いたしません。
            </p>
          </div>

          {/* 安全管理とセキュリティ */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>安全管理・セキュリティ</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-stone-600">
              <li>
                <strong>通信の暗号化</strong>：すべての通信は SSL / TLS による暗号化通信で保護されています。
              </li>
              <li>
                <strong>パスワードの厳格保護</strong>：パスワードは最新の暗号学的ハッシュ関数により変換されて保管され、<strong>開発者であってもパスワードの平文を見ることはできません</strong>。
              </li>
              <li>
                <strong>行単位セキュリティ（RLS）</strong>：データベースの厳格なアクセス制御により、ログイン中のご本人以外のユーザーからセーブデータが閲覧・改ざんされることはありません。
              </li>
              <li>
                <strong>第三者提供の禁止</strong>：法令に基づく開示要請がある場合を除き、個人情報やセーブデータを第三者に提供・販売することは一切ありません。
              </li>
            </ul>
          </div>
        </div>

        {/* フッター */}
        <div className="px-5 py-3 border-t border-sky-100 bg-stone-50/90 flex justify-end">
          <button
            type="button"
            data-testid="privacy-policy-confirm-button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            確認しました
          </button>
        </div>
      </div>
    </div>
  );
};
