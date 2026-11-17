import React from 'react';
import { GiftItem } from '../../types/gift.ts';
import { CatId } from '../../types/cat.ts';
import { GiftIcon } from './GiftIcon.tsx';
import { getGiftRarityLabel, getGiftIconBgClass } from '../../utils/catGifts.ts';

export interface GiftToastItem {
  id: string;
  catId: CatId;
  catName: string;
  gift: GiftItem;
}

export interface GiftToastOverlayProps {
  /** 表示中のギフトトースト一覧 */
  toasts: GiftToastItem[];
  /** トーストをクリックした時の消去コールバック */
  onDismiss?: (id: string) => void;
}

/**
 * 自動ごはんやおくりもの獲得時に画面上部に表示されるミニトースト通知コンポーネント
 * 実績トーストと同様にコンパクトで、プレイの邪魔にならない一時的なバナー通知です
 */
export const GiftToastOverlay: React.FC<GiftToastOverlayProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="おくりもの通知"
      aria-live="polite"
      data-testid="gift-toast-container"
      className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4 select-none"
    >
      {toasts.map((toast) => {
        const rarityLabel = getGiftRarityLabel(toast.gift.rarity);
        const bgClass = getGiftIconBgClass(toast.gift.rarity);

        return (
          <div
            key={toast.id}
            role="status"
            data-testid={`gift-toast-${toast.id}`}
            onClick={() => onDismiss?.(toast.id)}
            className="w-full bg-white/95 backdrop-blur-md border-2 border-orange-300 rounded-2xl p-2.5 shadow-xl flex items-center gap-3 animate-slide-down pointer-events-auto cursor-pointer hover:border-orange-400 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {/* ギフトアイコンボックス */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs border p-0.5 ${bgClass}`}
            >
              <GiftIcon
                giftId={toast.gift.id}
                rarity={toast.gift.rarity}
                className="w-7 h-7"
              />
            </div>

            {/* テキスト情報 */}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[11px] font-bold text-orange-600 tracking-wide flex items-center gap-1 leading-tight">
                <span>🎁 {toast.catName}からのおくりもの！</span>
                {toast.gift.rarity && toast.gift.rarity !== 'common' && (
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    {rarityLabel}
                  </span>
                )}
              </div>
              <h4
                data-testid={`gift-toast-title-${toast.id}`}
                className="text-sm font-extrabold text-stone-800 truncate leading-snug mt-0.5"
              >
                {toast.gift.name} を受け取りました！
              </h4>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
