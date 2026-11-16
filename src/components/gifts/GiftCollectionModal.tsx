import React, { useState, useMemo } from 'react';
import { X, Sparkles } from 'lucide-react';
import { GiftInventory, GiftItem, GiftAcquisitionFilter } from '../../types/gift.ts';
import {
  CAT_GIFTS,
  getTotalGiftCount,
  getAcquiredGiftTypeCount,
  getAvailableRarities,
  getGiftRarityLabel,
  getGiftRarityShortLabel,
  filterGifts,
} from '../../utils/catGifts.ts';
import { TreasureChestIcon } from './TreasureChestButton.tsx';
import { GiftIcon } from './GiftIcon.tsx';
import { CAT_PRESETS, CatId } from '../../types/cat.ts';
import { getCatDisplayName } from '../../utils/catSettings.ts';

export interface GiftCollectionModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** 現在の贈り物インベントリ */
  inventory: GiftInventory;
  /** 贈り物カタログ（デフォルト: CAT_GIFTS、将来の種類増加に対応） */
  catalog?: readonly GiftItem[];
  /** 猫の名前設定（カスタム名反映用） */
  catNames?: Partial<Record<CatId, string>>;
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
  catNames,
}) => {
  // 初期選択はカタログの先頭アイテム（または未選択時は先頭）
  const [selectedGiftId, setSelectedGiftId] = useState<string>(() => catalog[0]?.id ?? 'pebble');
  // 選択中のレアリティフィルター（'all' または各レアリティ文字列）
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  // 選択中の入手状況フィルター（'all': すべて, 'acquired': 入手済みのみ）
  const [acquisitionFilter, setAcquisitionFilter] = useState<GiftAcquisitionFilter>('all');

  // カタログからユニークなレアリティ一覧を動的抽出（今後レアリティが増加しても自動対応）
  const availableRarities = useMemo(() => getAvailableRarities(catalog), [catalog]);

  // 最上段のレアリティ絞り込み後のカタログ
  const rarityFilteredCatalog = useMemo(() => {
    return filterGifts(catalog, inventory, {
      rarity: selectedRarity,
      acquisition: 'all',
    });
  }, [catalog, inventory, selectedRarity]);

  // レアリティ絞り込み内の総数および入手済み数（2段目フィルター件数表示用）
  const rarityTotalCount = rarityFilteredCatalog.length;
  const rarityAcquiredCount = useMemo(() => {
    return rarityFilteredCatalog.filter((item) => (inventory[item.id]?.count ?? 0) > 0).length;
  }, [rarityFilteredCatalog, inventory]);

  // レアリティ絞り込み ＋ 入手状況絞り込み後のカタログ
  const filteredCatalog = useMemo(() => {
    if (acquisitionFilter === 'all') {
      return rarityFilteredCatalog;
    }
    return rarityFilteredCatalog.filter((item) => (inventory[item.id]?.count ?? 0) > 0);
  }, [rarityFilteredCatalog, acquisitionFilter, inventory]);

  if (!isOpen) {
    return null;
  }

  const totalCount = getTotalGiftCount(inventory);
  const totalCatalogCount = catalog.length;
  const acquiredTypeCount = getAcquiredGiftTypeCount(inventory, catalog);

  // 現在選択されているギフトの定義情報（絞り込みリスト内にあればそれを、無ければ絞り込みリストの先頭アイテム）
  const selectedGift =
    filteredCatalog.find((g) => g.id === selectedGiftId) ??
    filteredCatalog[0] ??
    null;
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
              <div className="flex items-center gap-2">
                <h2
                  id="gift-collection-title"
                  className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
                >
                  猫からのおくりもの
                </h2>
                <span
                  data-testid="gift-collection-rate"
                  aria-label={`収集率: ${totalCatalogCount}種類中${acquiredTypeCount}種類`}
                  className="text-xs sm:text-sm font-black text-orange-600 bg-orange-100/90 px-2 py-0.5 rounded-full border border-orange-200/90 shadow-2xs leading-none shrink-0"
                >
                  {acquiredTypeCount}/{totalCatalogCount}
                </span>
              </div>
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
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-3.5">
          {/* ウィンドウ上部：レアリティ絞り込みフィルター（今後レアリティが増加しても動的拡張可能） */}
          <div
            data-testid="gift-rarity-filter"
            aria-label="レアリティ絞り込み"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0"
          >
            {/* すべて */}
            <button
              type="button"
              data-testid="filter-rarity-all"
              aria-pressed={selectedRarity === 'all'}
              onClick={() => setSelectedRarity('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                selectedRarity === 'all'
                  ? 'bg-orange-500 text-white border-orange-600 shadow-2xs'
                  : 'bg-white/90 text-stone-600 border-orange-200/80 hover:bg-orange-50'
              }`}
            >
              すべて ({catalog.length})
            </button>

            {/* 動的抽出された各レアリティ（C, R, SR, UR 等） */}
            {availableRarities.map((rarity) => {
              const isSelected = selectedRarity === rarity;
              const shortLabel = getGiftRarityShortLabel(rarity);
              const count = catalog.filter((item) => (item.rarity ?? 'common') === rarity).length;

              return (
                <button
                  key={rarity}
                  type="button"
                  data-testid={`filter-rarity-${rarity}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRarity(rarity)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-600 shadow-2xs'
                      : 'bg-white/90 text-stone-600 border-orange-200/80 hover:bg-orange-50'
                  }`}
                >
                  {shortLabel} ({count})
                </button>
              );
            })}
          </div>

          {/* ウィンドウ上部：入手状況絞り込みフィルター（すべて / 入手済みのみ） */}
          <div
            data-testid="gift-acquisition-filter"
            aria-label="入手状況絞り込み"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0"
          >
            <button
              type="button"
              data-testid="filter-acquisition-all"
              aria-pressed={acquisitionFilter === 'all'}
              onClick={() => setAcquisitionFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                acquisitionFilter === 'all'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                  : 'bg-white/90 text-stone-600 border-orange-200/80 hover:bg-orange-50'
              }`}
            >
              すべて ({rarityTotalCount})
            </button>
            <button
              type="button"
              data-testid="filter-acquisition-acquired"
              aria-pressed={acquisitionFilter === 'acquired'}
              onClick={() => setAcquisitionFilter('acquired')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                acquisitionFilter === 'acquired'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                  : 'bg-white/90 text-stone-600 border-orange-200/80 hover:bg-orange-50'
              }`}
            >
              入手済みのみ ({rarityAcquiredCount})
            </button>
          </div>

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
              {filteredCatalog.map((gift) => {
                const isSelected = selectedGift?.id === gift.id;
                const record = inventory[gift.id];
                const count = record?.count ?? 0;
                const isAcquired = count > 0;
                const { rarity = 'common' } = gift;
                const isRareOrAbove = rarity === 'rare' || rarity === 'super-rare' || rarity === 'ultra-rare';

                const ariaLabelUnacquired =
                  rarity === 'ultra-rare'
                    ? '未受取のウルトラレアおくりもの'
                    : rarity === 'super-rare'
                    ? '未受取のスーパーレアおくりもの'
                    : rarity === 'rare'
                    ? '未受取のレアおくりもの'
                    : '未受取のおくりもの';

                // タイルの背景・枠線スタイル（レア度ごとに色分け）
                let tileClass = 'bg-stone-50/70 border-stone-200/70 opacity-60 hover:opacity-90';
                if (isSelected) {
                  if (rarity === 'ultra-rare') {
                    tileClass = isAcquired
                      ? 'ring-2 ring-pink-500 border-pink-500 bg-gradient-to-br from-cyan-200/95 via-fuchsia-100/90 to-rose-300/95 shadow-md scale-102 z-10'
                      : 'ring-2 ring-pink-500 border-pink-400 bg-gradient-to-br from-cyan-100/95 via-fuchsia-50/95 to-rose-200/95 shadow-md scale-102 z-10';
                  } else if (rarity === 'super-rare') {
                    tileClass = isAcquired
                      ? 'ring-2 ring-purple-500 border-purple-500 bg-gradient-to-br from-purple-200/95 via-fuchsia-100/90 to-violet-300/95 shadow-md scale-102 z-10'
                      : 'ring-2 ring-purple-500 border-purple-400 bg-gradient-to-br from-purple-100/95 via-fuchsia-50/95 to-violet-200/95 shadow-md scale-102 z-10';
                  } else if (rarity === 'rare') {
                    tileClass = isAcquired
                      ? 'ring-2 ring-amber-500 border-amber-500 bg-gradient-to-br from-amber-200/95 via-yellow-100/90 to-amber-300/95 shadow-md scale-102 z-10'
                      : 'ring-2 ring-amber-500 border-amber-400 bg-gradient-to-br from-amber-100/95 via-yellow-50/95 to-amber-200/95 shadow-md scale-102 z-10';
                  } else {
                    tileClass = 'ring-2 ring-orange-400 border-orange-400 bg-gradient-to-b from-orange-50/90 to-amber-100/70 shadow-md scale-102 z-10';
                  }
                } else if (isAcquired) {
                  if (rarity === 'ultra-rare') {
                    tileClass = 'bg-gradient-to-br from-cyan-200 via-fuchsia-100 to-rose-300 border-pink-400 hover:border-pink-500 shadow-2xs hover:shadow-xs hover:scale-101';
                  } else if (rarity === 'super-rare') {
                    tileClass = 'bg-gradient-to-br from-purple-200 via-fuchsia-100 to-violet-300 border-purple-400 hover:border-purple-500 shadow-2xs hover:shadow-xs hover:scale-101';
                  } else if (rarity === 'rare') {
                    tileClass = 'bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 border-amber-400 hover:border-amber-500 shadow-2xs hover:shadow-xs hover:scale-101';
                  } else {
                    tileClass = 'bg-white border-orange-200/90 hover:border-orange-300 hover:shadow-xs shadow-2xs hover:scale-101';
                  }
                } else {
                  if (rarity === 'ultra-rare') {
                    tileClass = 'bg-gradient-to-br from-cyan-100/90 via-fuchsia-50/90 to-rose-200/90 border-pink-300/90 hover:border-pink-400 shadow-2xs hover:shadow-xs opacity-90 hover:opacity-100';
                  } else if (rarity === 'super-rare') {
                    tileClass = 'bg-gradient-to-br from-purple-100/90 via-fuchsia-50/90 to-violet-200/90 border-purple-300/90 hover:border-purple-400 shadow-2xs hover:shadow-xs opacity-90 hover:opacity-100';
                  } else if (rarity === 'rare') {
                    tileClass = 'bg-gradient-to-br from-amber-100/90 via-yellow-50/90 to-amber-200/90 border-amber-400/90 hover:border-amber-500 shadow-2xs hover:shadow-xs opacity-90 hover:opacity-100';
                  }
                }

                return (
                  <button
                    key={gift.id}
                    type="button"
                    onClick={() => setSelectedGiftId(gift.id)}
                    data-testid={`gift-tile-${gift.id}`}
                    aria-selected={isSelected}
                    aria-label={`${isAcquired ? gift.name : ariaLabelUnacquired}: ${count}個`}
                    className={`relative aspect-square rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${tileClass}`}
                  >
                    {/* レアアイコンバッジ（レア以上の場合は未入手でも表示） */}
                    {isRareOrAbove && (
                      <span
                        data-testid={`rare-badge-${gift.id}`}
                        className={`absolute top-1.5 left-1.5 text-[9px] font-black px-1 rounded-sm border leading-tight ${
                          rarity === 'ultra-rare'
                            ? isAcquired
                              ? 'text-rose-900 bg-pink-100/90 border-pink-300/80'
                              : 'text-rose-950 bg-pink-200/90 border-pink-400/80'
                            : rarity === 'super-rare'
                            ? isAcquired
                              ? 'text-purple-800 bg-purple-100/90 border-purple-300/80'
                              : 'text-purple-900 bg-purple-200/90 border-purple-400/80'
                            : isAcquired
                            ? 'text-amber-700 bg-amber-100/90 border-amber-300/80'
                            : 'text-amber-800 bg-amber-200/90 border-amber-400/80'
                        }`}
                      >
                        {rarity === 'ultra-rare' ? '★★★' : rarity === 'super-rare' ? '★★' : '★'}
                      </span>
                    )}

                    {/* 正方形の中に描画されたアイコン */}
                    <div
                      data-testid={`gift-tile-icon-${gift.id}`}
                      className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center select-none filter transition-transform ${
                        isSelected ? 'scale-110 drop-shadow-xs' : 'drop-shadow-2xs'
                      }`}
                    >
                      <GiftIcon
                        giftId={gift.id}
                        isAcquired={isAcquired}
                        rarity={gift.rarity}
                        className="w-9 h-9 sm:w-11 sm:h-11"
                      />
                    </div>

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

            {/* 絞り込み結果が0件の時の案内 */}
            {filteredCatalog.length === 0 && (
              <div
                data-testid="gift-filter-empty"
                className="py-8 text-center text-xs text-stone-400 font-medium"
              >
                該当するおくりものがありません
              </div>
            )}
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
                  data-testid="gift-detail-icon-box"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border p-1 ${
                    selectedGift.rarity === 'ultra-rare'
                      ? isSelectedAcquired
                        ? 'bg-gradient-to-br from-cyan-300 via-fuchsia-200 to-rose-300 border-pink-500 shadow-pink-300/50'
                        : 'bg-gradient-to-br from-cyan-100 via-fuchsia-50 to-rose-200 border-pink-400 shadow-pink-200/40'
                      : selectedGift.rarity === 'super-rare'
                      ? isSelectedAcquired
                        ? 'bg-gradient-to-br from-purple-300 via-fuchsia-100 to-violet-400 border-purple-500 shadow-purple-300/50'
                        : 'bg-gradient-to-br from-purple-100 via-fuchsia-50 to-violet-200 border-purple-400 shadow-purple-200/40'
                      : selectedGift.rarity === 'rare'
                      ? isSelectedAcquired
                        ? 'bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-400 border-amber-500 shadow-amber-300/50'
                        : 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 border-amber-400 shadow-amber-200/40'
                      : isSelectedAcquired
                      ? 'bg-white border-orange-200'
                      : 'bg-stone-100 border-stone-200 text-stone-300'
                  }`}
                >
                  <GiftIcon
                    giftId={selectedGift.id}
                    isAcquired={isSelectedAcquired}
                    rarity={selectedGift.rarity}
                    className="w-10 h-10"
                  />
                </div>

                {/* 名前と所持個数バッジ */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <h3
                        data-testid="gift-detail-name"
                        className="text-sm sm:text-base font-extrabold text-stone-800 break-words leading-snug"
                      >
                        {isSelectedAcquired ? selectedGift.name : '？？？？'}
                      </h3>
                      {selectedGift.rarity === 'ultra-rare' && (
                        <span
                          data-testid="gift-detail-rare-badge"
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-black shadow-2xs shrink-0 whitespace-nowrap ${
                            isSelectedAcquired
                              ? 'bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white'
                              : 'bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 text-rose-950 border border-rose-400'
                          }`}
                        >
                          ★★★ ウルトラレア
                        </span>
                      )}
                      {selectedGift.rarity === 'super-rare' && (
                        <span
                          data-testid="gift-detail-rare-badge"
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-black shadow-2xs shrink-0 whitespace-nowrap ${
                            isSelectedAcquired
                              ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                              : 'bg-gradient-to-r from-purple-400 to-violet-400 text-purple-950 border border-purple-400'
                          }`}
                        >
                          ★★ スーパーレア
                        </span>
                      )}
                      {selectedGift.rarity === 'rare' && (
                        <span
                          data-testid="gift-detail-rare-badge"
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-black shadow-2xs shrink-0 whitespace-nowrap ${
                            isSelectedAcquired
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                              : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-400'
                          }`}
                        >
                          ★ レア
                        </span>
                      )}
                    </div>
                    <span
                      data-testid="gift-detail-count-badge"
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs shrink-0 whitespace-nowrap ml-auto ${
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
                    className="text-xs text-stone-600 mt-1.5 leading-relaxed break-words"
                  >
                    {isSelectedAcquired
                      ? selectedGift.description
                      : selectedGift.rarity === 'ultra-rare'
                      ? '幻のように出づらい、最高峰のウルトラレアおくりものです。猫ちゃんと運命的な絆が結ばれると貰えるかも…？'
                      : selectedGift.rarity === 'super-rare'
                      ? 'めったに出会えない、非常に希少なスーパーレアおくりものです。猫ちゃんと奇跡的な絆が結ばれると貰えるかも…？'
                      : selectedGift.rarity === 'rare'
                      ? 'めったにもらえない、とても貴重なレアおくりものです。猫ちゃんとたくさんふれあうと貰えるかも…？'
                      : 'まだ受け取っていないおくりものです。猫ちゃんとたくさんふれあうと貰えるかも…？'}
                  </p>

                  {/* 猫別の受取内訳（受け取っている場合のみ表示） */}
                  {isSelectedAcquired && selectedRecord?.byCat && (
                    <div className="mt-2.5 pt-2 border-t border-orange-100 flex flex-wrap gap-1.5 text-[10px] text-stone-500">
                      <span className="font-semibold text-stone-600 self-center mr-0.5">もらった猫:</span>
                      {CAT_PRESETS.map((preset) => {
                        const catCount = selectedRecord.byCat?.[preset.id];
                        if (!catCount) return null;
                        const catDisplayName = getCatDisplayName(preset.id, catNames);
                        return (
                          <span
                            key={preset.id}
                            className="bg-white px-1.5 py-0.5 rounded-md border border-orange-100 text-stone-700 font-bold"
                          >
                            {catDisplayName}: {catCount}個
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
