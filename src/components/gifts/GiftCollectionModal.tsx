import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { GiftInventory, GiftItem } from '../../types/gift.ts';
import { CAT_GIFTS, getTotalGiftCount } from '../../utils/catGifts.ts';
import { TreasureChestIcon } from './TreasureChestButton.tsx';
import { CAT_PRESETS } from '../../types/cat.ts';

export interface GiftCollectionModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** 現在の贈り物インベントリ */
  inventory: GiftInventory;
  /** 贈り物カタログ（デフォルト: CAT_GIFTS） */
  catalog?: readonly GiftItem[];
}

/**
 * これまでに受け取ったおくりものを一覧で確認できるモーダル画面
 */
export const GiftCollectionModal: React.FC<GiftCollectionModalProps> = ({
  isOpen,
  onClose,
  inventory,
  catalog = CAT_GIFTS,
}) => {
  if (!isOpen) {
    return null;
  }

  const totalCount = getTotalGiftCount(inventory);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-collection-title"
      data-testid="gift-collection-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（クリックで閉じる） */}
      <div
        data-testid="gift-collection-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-4 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-orange-200 flex items-center justify-center text-amber-600 shrink-0">
              <TreasureChestIcon className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="gift-collection-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                猫からのおくりもの
              </h2>
              <p className="text-[11px] text-stone-500">
                あつめたおくりもの:{' '}
                <span data-testid="total-gift-count" className="font-extrabold text-orange-600">
                  {totalCount}個
                </span>
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="おくりもの一覧を閉じる"
            data-testid="gift-collection-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダルコンテンツ（おくりもの一覧） */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {totalCount === 0 ? (
            <div
              data-testid="gift-collection-empty"
              className="py-10 px-4 text-center flex flex-col items-center justify-center text-stone-400"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl text-amber-500 mb-3 shadow-inner">
                🎁
              </div>
              <p className="text-sm font-bold text-stone-700">まだおくりものがありません</p>
              <p className="text-xs text-stone-400 mt-1.5 max-w-xs leading-relaxed">
                猫ちゃんをなでたり、ごはんやおもちゃでふれあってなつき度を上げると、おくりものが貰えるよ♪
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {catalog.map((gift) => {
                const record = inventory[gift.id];
                const count = record?.count ?? 0;
                const isAcquired = count > 0;

                return (
                  <div
                    key={gift.id}
                    data-testid={`gift-item-${gift.id}`}
                    className={`p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                      isAcquired
                        ? 'bg-gradient-to-r from-white via-orange-50/30 to-amber-50/40 border-orange-200/80 shadow-2xs'
                        : 'bg-stone-50/60 border-stone-200/60 opacity-60'
                    }`}
                  >
                    {/* ギフトアイコン */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-2xs border ${
                        isAcquired
                          ? 'bg-white border-orange-200'
                          : 'bg-stone-100 border-stone-200 text-stone-300'
                      }`}
                    >
                      {isAcquired ? gift.icon : '？'}
                    </div>

                    {/* ギフト情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-stone-800 truncate">
                          {isAcquired ? gift.name : '？？？？'}
                        </h3>
                        <span
                          data-testid={`gift-count-${gift.id}`}
                          className={`text-xs font-black px-2 py-0.5 rounded-full border shadow-2xs ${
                            isAcquired
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-stone-100 text-stone-400 border-stone-200'
                          }`}
                        >
                          {isAcquired ? `× ${count}` : '未受取'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {isAcquired ? gift.description : '猫ちゃんとふれあうと貰えるかも…？'}
                      </p>

                      {/* 猫別の内訳（受け取っている場合のみ表示） */}
                      {isAcquired && record?.byCat && Object.keys(record.byCat).length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5 pt-1.5 border-t border-orange-100/60 text-[10px] text-stone-500">
                          {CAT_PRESETS.map((preset) => {
                            const catCount = record.byCat?.[preset.id];
                            if (!catCount) return null;
                            return (
                              <span
                                key={preset.id}
                                className="bg-white/80 px-1.5 py-0.5 rounded-md border border-orange-100 text-stone-600 font-medium"
                              >
                                {preset.name}: {catCount}個
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-orange-100 bg-stone-50/80 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>たくさんふれあって、おくりものをあつめてみよう！</span>
        </div>
      </div>
    </div>
  );
};
