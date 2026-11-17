import React from 'react';
import { X, Sparkles, Utensils, Heart } from 'lucide-react';
import { CatId } from '../../types/cat.ts';
import { GiftItem } from '../../types/gift.ts';
import { CatOfflineFeedResult } from '../../utils/autoFeed.ts';
import { GiftIcon } from '../gifts/GiftIcon.tsx';
import { getGiftRarityLabel, getGiftIconBgClass } from '../../utils/catGifts.ts';
import { getCatDisplayName } from '../../utils/catSettings.ts';

export interface OfflineCareReportModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じる・受け取るコールバック */
  onClose: () => void;
  /** 留守中の経過ミリ秒 */
  elapsedMs: number;
  /** 各猫の給餌結果 */
  catResults: Record<CatId, CatOfflineFeedResult>;
  /** 獲得したすべてのおくりもの */
  allEarnedGifts: Array<{ catId: CatId; gift: GiftItem }>;
  /** 猫の名前設定 */
  catNames?: Partial<Record<CatId, string>>;
}

/**
 * 留守中に自動ごはんで給餌とおくりもの獲得が行われた際に、
 * アプリ復帰時にまとめて成果を確認・受け取れるモーダルコンポーネント
 */
export const OfflineCareReportModal: React.FC<OfflineCareReportModalProps> = ({
  isOpen,
  onClose,
  elapsedMs,
  catResults,
  allEarnedGifts,
  catNames,
}) => {
  if (!isOpen) return null;

  // 経過時間の表示テキスト
  const totalMinutes = Math.floor(elapsedMs / (60 * 1000));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  let timeText = `${totalMinutes}分間`;
  if (totalDays > 0) {
    const remainHours = totalHours % 24;
    timeText = `${totalDays}日と${remainHours}時間`;
  } else if (totalHours > 0) {
    const remainMinutes = totalMinutes % 60;
    timeText = `${totalHours}時間${remainMinutes}分`;
  }

  const targetCats: CatId[] = ['black', 'white', 'calico'];
  const totalFeedCount = Object.values(catResults).reduce(
    (sum, r) => sum + (r.feedCount || 0),
    0
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-report-title"
      data-testid="offline-care-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ */}
      <div
        data-testid="offline-report-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-xs transition-opacity"
      />

      {/* モーダル本体 */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* ヘッダー */}
        <div className="px-5 py-3.5 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="offline-report-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                おかえりなさい！お留守番レポート
              </h2>
              <p className="text-[11px] text-stone-500">
                留守中の自動ごはんの記録です
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="レポートを閉じる"
            data-testid="offline-report-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3.5 text-left">
          {/* お留守番メッセージバナー */}
          <div className="p-3 bg-gradient-to-br from-amber-50/80 to-orange-50/60 border border-orange-200/90 rounded-2xl flex items-center gap-2.5">
            <span className="text-2xl select-none" role="img" aria-label="お留守番">
              🏠
            </span>
            <div className="text-xs text-stone-700 leading-snug">
              <p className="font-bold">
                {timeText}のお留守番でした！
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                みんなで仲良くカリカリを食べながら待っていました♪
              </p>
            </div>
          </div>

          {/* 各猫の給餌状況 */}
          <div
            data-testid="offline-report-cats-section"
            className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 px-1">
              <span>猫ちゃんたちの食事記録</span>
              <span className="text-orange-600 font-extrabold">
                合計 {totalFeedCount}回
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {targetCats.map((catId) => {
                const res = catResults[catId];
                const catName = getCatDisplayName(catId, catNames);
                return (
                  <div
                    key={catId}
                    data-testid={`offline-cat-result-${catId}`}
                    className="bg-white p-2.5 rounded-xl border border-stone-200 text-center shadow-2xs"
                  >
                    <span className="text-xs font-bold text-stone-800 block truncate">
                      {catName}
                    </span>
                    <span className="text-xs font-black text-amber-600 mt-1 block">
                      {res?.feedCount ?? 0}回
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      +{res?.totalExpGained ?? 0} Exp
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* もらったおくりもの一覧 */}
          <div
            data-testid="offline-report-gifts-section"
            className="space-y-2"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>もらったおくりもの（{allEarnedGifts.length}個）</span>
              </span>
            </div>

            {allEarnedGifts.length === 0 ? (
              <div
                data-testid="offline-report-no-gifts"
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-400 font-medium"
              >
                今回はおくりものは見つかりませんでした。また次回に期待しましょう！
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {allEarnedGifts.map(({ catId, gift }, idx) => {
                  const catName = getCatDisplayName(catId, catNames);
                  const rarityLabel = getGiftRarityLabel(gift.rarity);
                  const bgClass = getGiftIconBgClass(gift.rarity);

                  return (
                    <div
                      key={`${gift.id}-${idx}`}
                      data-testid={`offline-gift-item-${gift.id}`}
                      className="bg-white p-2.5 rounded-xl border border-orange-200/90 shadow-2xs flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border p-0.5 ${bgClass}`}
                      >
                        <GiftIcon
                          giftId={gift.id}
                          rarity={gift.rarity}
                          className="w-7 h-7"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                            {catName}
                          </span>
                          {gift.rarity && gift.rarity !== 'common' && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                              {rarityLabel}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold text-stone-800 truncate mt-0.5">
                          {gift.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[11px] text-stone-400 text-center leading-relaxed">
            ※留守中のごはん回数は手帳に記録されました。ふれあい日数はアプリを開いた日のみ記録されます。
          </p>
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-orange-100 bg-stone-50/80 flex items-center justify-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            data-testid="offline-report-accept-button"
            className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>すべて受け取る</span>
          </button>
        </div>
      </div>
    </div>
  );
};
