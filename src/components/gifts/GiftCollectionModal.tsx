import React, { useState } from 'react';
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
  /** 贈り物カタログ（デフォルト: CAT_GIFTS、将来の種類増加に対応） */
  catalog?: readonly GiftItem[];
}

/**
 * これまでに受け取ったおくりものを一覧で確認できるモーダル画面
 *
 * - 各おくりものは角が丸い正方形（タイル）の中にアイコンを描画
 * - 正方形タイルの右下に所持個数を表示
 * - 正方形が表（グリッド）で並び、種類が増えてもスクロールして閲覧可能
 * - 正方形をクリックするとウィンドウ下側に詳細な説明や猫別内訳を表示
 */
export const GiftCollectionModal: React.FC<GiftCollectionModalProps> = ({
  isOpen,
  onClose,
  inventory,
  catalog = CAT_GIFTS,
}) => {
  // 初期選択はカタログの先頭アイテム（または未選択時は先頭）
  const [selectedGiftId, setSelectedGiftId] = useState<string>(() => catalog[0]?.id ?? 'pebble');

  if (!isOpen) {
    return null;
  }

  const totalCount = getTotalGiftCount(inventory);

  // 現在選択されているギフトの定義情報とインベントリ記録
  const selectedGift = catalog.find((g) => g.id === selectedGiftId) ?? catalog[0];
  const selectedRecord = selectedGift ? inventory[selectedGift.id] : undefined;
  const selectedCount = selectedRecord?.count ?? 0;
  const isSelectedAcquired = selectedCount > 0;

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

      {/* モーダル本体カード（将来種類が増えても高さを制限し内部スクロール） */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80">
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

        {/* モーダルメインコンテンツ（表グリッドと下部詳細パネル） */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {/* おくりものの表（グリッド並び）：角丸正方形の中にアイコン、右下に個数を表示 */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-stone-600">おくりもの一覧</span>
              <span className="text-[11px] text-stone-400">タップして詳細を見る</span>
            </div>

            <div
              role="grid"
              aria-label="おくりもの一覧表"
              data-testid="gift-grid-table"
              className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 p-1"
            >
              {catalog.map((gift) => {
                const isSelected = selectedGift?.id === gift.id;
                const record = inventory[gift.id];
                const count = record?.count ?? 0;
                const isAcquired = count > 0;

                return (
                  <button
                    key={gift.id}
                    type="button"
                    onClick={() => setSelectedGiftId(gift.id)}
                    data-testid={`gift-tile-${gift.id}`}
                    aria-selected={isSelected}
                    aria-label={`${isAcquired ? gift.name : '未受取のおくりもの'}: ${count}個`}
                    className={`relative aspect-square rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                      isSelected
                        ? 'ring-2 ring-orange-400 border-orange-400 bg-gradient-to-b from-orange-50/90 to-amber-100/70 shadow-md scale-102 z-10'
                        : isAcquired
                        ? 'bg-white border-orange-200/90 hover:border-orange-300 hover:shadow-xs shadow-2xs hover:scale-101'
                        : 'bg-stone-50/70 border-stone-200/70 opacity-60 hover:opacity-90'
                    }`}
                  >
                    {/* 正方形の中に描画されたアイコン */}
                    <span
                      data-testid={`gift-tile-icon-${gift.id}`}
                      className={`text-3xl sm:text-4xl select-none filter transition-transform ${
                        isSelected ? 'scale-110 drop-shadow-xs' : 'drop-shadow-2xs'
                      } ${!isAcquired ? 'grayscale opacity-50 text-stone-400' : ''}`}
                    >
                      {isAcquired ? gift.icon : '？'}
                    </span>

                    {/* 正方形の右下あたりに個数を表示 */}
                    <span
                      data-testid={`gift-count-${gift.id}`}
                      className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black leading-none border shadow-2xs ${
                        isAcquired
                          ? isSelected
                            ? 'bg-orange-500 text-white border-orange-600'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-200 text-stone-500 border-stone-300'
                      }`}
                    >
                      {isAcquired ? `× ${count}` : '0'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ウィンドウ下側の詳細な説明エリア */}
          {selectedGift && (
            <div
              data-testid="gift-detail-panel"
              className="mt-auto bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-stone-50 border border-orange-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs text-left"
            >
              <div className="flex items-start gap-3">
                {/* 詳細アイコン */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs border ${
                    isSelectedAcquired
                      ? 'bg-white border-orange-200'
                      : 'bg-stone-100 border-stone-200 text-stone-300'
                  }`}
                >
                  {isSelectedAcquired ? selectedGift.icon : '？'}
                </div>

                {/* 名前と所持個数バッジ */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-stone-800 truncate">
                      {isSelectedAcquired ? selectedGift.name : '？？？？'}
                    </h3>
                    <span
                      data-testid="gift-detail-count-badge"
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs shrink-0 ${
                        isSelectedAcquired
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-100 text-stone-400 border-stone-200'
                      }`}
                    >
                      {isSelectedAcquired ? `所持数: ${selectedCount}個` : '未受取'}
                    </span>
                  </div>

                  {/* 説明文 */}
                  <p
                    data-testid="gift-detail-description"
                    className="text-xs text-stone-600 mt-1 leading-relaxed"
                  >
                    {isSelectedAcquired
                      ? selectedGift.description
                      : 'まだ受け取っていないおくりものです。猫ちゃんとたくさんふれあうと貰えるかも…？'}
                  </p>

                  {/* 猫別の受取内訳（受け取っている場合のみ表示） */}
                  {isSelectedAcquired && selectedRecord?.byCat && (
                    <div className="mt-2.5 pt-2 border-t border-orange-100 flex flex-wrap gap-1.5 text-[10px] text-stone-500">
                      <span className="font-semibold text-stone-600 self-center mr-0.5">もらった猫:</span>
                      {CAT_PRESETS.map((preset) => {
                        const catCount = selectedRecord.byCat?.[preset.id];
                        if (!catCount) return null;
                        return (
                          <span
                            key={preset.id}
                            className="bg-white px-1.5 py-0.5 rounded-md border border-orange-100 text-stone-700 font-bold"
                          >
                            {preset.name}: {catCount}個
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* まだ1つもおくりものを受け取っていない時のサポート案内 */}
          {totalCount === 0 && (
            <div
              data-testid="gift-collection-empty"
              className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-center text-xs text-stone-600 flex items-center justify-center gap-1.5"
            >
              <span>🎁</span>
              <span>まだおくりものがありません。猫ちゃんをなでたりお世話してなつき度を上げてみてね！</span>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-orange-100 bg-stone-50/80 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>たくさんふれあって、おくりものをあつめてみよう！</span>
        </div>
      </div>
    </div>
  );
};
