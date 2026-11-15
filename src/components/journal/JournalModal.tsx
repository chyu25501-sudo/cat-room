import React from 'react';
import { X, Calendar, Flame, Heart, Utensils, Sparkles, BookOpen, Clock } from 'lucide-react';
import { CareStats } from '../../types/journal.ts';
import { formatInteractionDate } from '../../utils/careJournal.ts';
import { JournalBookIcon } from './JournalButton.tsx';

export interface JournalModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** 統計データ */
  stats: CareStats;
  /** 猫の名前マップ（設定画面で変更されたカスタム名対応） */
  catNames?: Record<string, string>;
}

/**
 * ふり返り手帳モーダルウィンドウ
 * 猫とふれあった日、なでた回数、ごはん回数、おもちゃ回数、連続日数などの統計情報を閲覧できる
 */
export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  stats,
  catNames = { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
}) => {
  if (!isOpen) {
    return null;
  }

  const totalInteractions = stats.totalPetCount + stats.totalFeedCount + stats.totalPlayCount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
      data-testid="journal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ */}
      <div
        data-testid="journal-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-teal-100 flex items-center justify-between bg-gradient-to-r from-teal-50/80 via-emerald-50/60 to-teal-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
              <JournalBookIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="journal-modal-title"
                  className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
                >
                  ふり返り手帳
                </h2>
                <span
                  data-testid="journal-total-badge"
                  className="text-xs font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300 shadow-2xs leading-none shrink-0"
                >
                  計 {totalInteractions} 回
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                猫ちゃんたちとの日々のふれあい記録です
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="ふり返り手帳を閉じる"
            data-testid="journal-modal-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 統計情報スクロールコンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-3 text-left">
          {/* 日付・連続日数サマリー */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 連続ふれあい日数 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-orange-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-400 shrink-0" />
                <span>連続ふれあい</span>
              </div>
              <div className="mt-2">
                <div
                  data-testid="journal-streak-days"
                  className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight flex items-baseline gap-1"
                >
                  <span>{stats.currentStreakDays}</span>
                  <span className="text-xs font-medium text-stone-500">日連続</span>
                </div>
                <div
                  data-testid="journal-max-streak"
                  className="text-[10px] text-amber-800/80 mt-0.5 font-medium"
                >
                  最高: {stats.maxStreakDays} 日間
                </div>
              </div>
            </div>

            {/* ふれあった合計日数 */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50/60 border border-teal-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center gap-1.5 text-teal-700 text-xs font-bold">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>ふれあい合計日数</span>
              </div>
              <div className="mt-2">
                <div
                  data-testid="journal-total-days"
                  className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight flex items-baseline gap-1"
                >
                  <span>{stats.totalActiveDays}</span>
                  <span className="text-xs font-medium text-stone-500">日間</span>
                </div>
                <div className="text-[10px] text-teal-700/80 mt-0.5 font-medium">
                  まいにちの積み重ね
                </div>
              </div>
            </div>
          </div>

          {/* はじめて猫とふれあった日 */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-700">はじめてふれあった日</div>
                <div
                  data-testid="journal-first-date"
                  className="text-xs text-stone-500 mt-0.5"
                >
                  {formatInteractionDate(stats.firstInteractionAt)}
                </div>
              </div>
            </div>
          </div>

          {/* お世話アクション別集計（撫でた回数、ごはん回数、おもちゃ回数） */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 shadow-2xs">
            <h3 className="text-xs font-bold text-stone-700 mb-2.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>お世話の内訳</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* なでなで */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5 flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-white border border-rose-200 flex items-center justify-center text-rose-500 mb-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium">撫でた回数</span>
                <span
                  data-testid="journal-pet-count"
                  className="text-sm sm:text-base font-black text-rose-700 mt-0.5"
                >
                  {stats.totalPetCount} 回
                </span>
              </div>

              {/* ごはん */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 mb-1">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium">ごはん</span>
                <span
                  data-testid="journal-feed-count"
                  className="text-sm sm:text-base font-black text-emerald-700 mt-0.5"
                >
                  {stats.totalFeedCount} 回
                </span>
              </div>

              {/* おもちゃ */}
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium">おもちゃ</span>
                <span
                  data-testid="journal-play-count"
                  className="text-sm sm:text-base font-black text-amber-700 mt-0.5"
                >
                  {stats.totalPlayCount} 回
                </span>
              </div>
            </div>
          </div>

          {/* 猫ちゃん別のふれあい回数 */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 shadow-2xs">
            <h3 className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>猫ちゃん別のふれあい</span>
            </h3>
            <div className="flex flex-col gap-1.5">
              {Object.entries({
                black: catNames.black ?? 'くろねこ',
                white: catNames.white ?? 'しろねこ',
                calico: catNames.calico ?? 'みけねこ',
              }).map(([catId, name]) => {
                const count = stats.interactionsByCat[catId] ?? 0;
                return (
                  <div
                    key={catId}
                    data-testid={`journal-cat-${catId}`}
                    className="flex items-center justify-between py-1 px-2.5 bg-stone-50/70 rounded-xl text-xs"
                  >
                    <span className="font-medium text-stone-700">{name}</span>
                    <span className="font-bold text-stone-800">{count} 回</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-teal-100 bg-stone-50/80 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span>これからもたくさんの思い出を記録していこう！</span>
        </div>
      </div>
    </div>
  );
};
