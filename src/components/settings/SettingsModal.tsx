import React from 'react';
import { X, Sparkles, Volume2, Info, Heart } from 'lucide-react';
import { SettingsIcon } from './SettingsButton.tsx';

export interface SettingsModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
}

/**
 * 設定画面モーダルコンポーネント
 * おくりもの一覧モーダルと同様のスタイル・デザインで設定やアプリ情報を表示
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      data-testid="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（クリックで閉じる） */}
      <div
        data-testid="settings-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-orange-200 flex items-center justify-center text-stone-600 shrink-0">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="settings-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                設定
              </h2>
              <p className="text-[11px] text-stone-500">
                アプリの環境や情報を確認できます
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="設定を閉じる"
            data-testid="settings-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダルメインコンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-3.5 text-left">
          {/* サウンド設定・案内カード */}
          <div className="bg-amber-50/50 border border-orange-200/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm mb-1.5">
              <Volume2 className="w-4 h-4 text-orange-600 shrink-0" />
              <span>サウンド（鳴き声・効果音）</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              端末のスピーカーから猫ちゃんの鳴き声やふれあい音が再生されます。音量は端末本体のボリュームで調整してください。
            </p>
          </div>

          {/* セーブデータ案内カード */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm mb-1.5">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>セーブデータについて</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              猫ちゃんたちのごきげん度・まんぷく度・なつき度、および受け取ったおくりものは、お使いのブラウザに自動保存されています。
            </p>
          </div>

          {/* アプリ情報カード */}
          <div className="bg-gradient-to-r from-orange-50/40 via-amber-50/40 to-stone-50 border border-orange-100 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm mb-1.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>アプリ情報</span>
            </div>
            <div className="text-xs text-stone-600 space-y-1">
              <div className="flex justify-between py-0.5 border-b border-stone-200/50">
                <span className="text-stone-500">アプリ名</span>
                <span className="font-bold text-stone-700">ねこっぽい</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-stone-200/50">
                <span className="text-stone-500">バージョン</span>
                <span className="font-semibold text-stone-700">0.1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-orange-100 bg-stone-50/80 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>今後のアップデートで追加項目を拡張予定です</span>
        </div>
      </div>
    </div>
  );
};
