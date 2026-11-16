import React, { useState, useMemo } from 'react';
import { X, Sparkles, CheckCircle2, Lock, Utensils, Heart, Gift, Calendar } from 'lucide-react';
import {
  AchievementItem,
  UnlockedAchievements,
  AchievementStatusFilter,
} from '../../types/achievement.ts';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementDisplayInfo,
  filterAchievements,
} from '../../utils/catAchievements.ts';
import { TrophyIcon } from './AchievementButton.tsx';

export interface AchievementModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** 解除済み実績マップ */
  unlocked: UnlockedAchievements;
  /** 実績カタログ（デフォルト: ACHIEVEMENTS） */
  catalog?: readonly AchievementItem[];
}

/**
 * 実績アイコンの描画コンポーネント
 */
const AchievementItemIcon: React.FC<{ iconType: string; isUnlocked: boolean }> = ({
  iconType,
  isUnlocked,
}) => {
  const iconClass = 'w-6 h-6';

  if (!isUnlocked) {
    return <Lock className={`${iconClass} text-stone-400`} />;
  }

  switch (iconType) {
    case 'paw':
      return <Heart className={`${iconClass} text-rose-500 fill-rose-500`} />;
    case 'food':
      return <Utensils className={`${iconClass} text-emerald-600`} />;
    case 'toy':
      return <Sparkles className={`${iconClass} text-amber-500`} />;
    case 'sparkle':
      return <Sparkles className={`${iconClass} text-yellow-500 fill-yellow-400`} />;
    case 'gift':
      return <Gift className={`${iconClass} text-orange-500`} />;
    case 'calendar':
      return <Calendar className={`${iconClass} text-teal-600`} />;
    default:
      return <TrophyIcon className={`${iconClass} text-amber-500`} />;
  }
};

/**
 * これまでに獲得した実績を一覧表示するモーダルウィンドウ
 */
export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  unlocked,
  catalog = ACHIEVEMENTS,
}) => {
  // 選択中のカテゴリフィルター（'all' または各カテゴリ文字列）
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // 選択中の達成状況フィルター（'all': すべて, 'unlocked': 達成済み, 'locked': 未達成）
  const [statusFilter, setStatusFilter] = useState<AchievementStatusFilter>('all');

  // カテゴリ絞り込み ＋ 達成状況絞り込み後のカタログ
  const filteredCatalog = useMemo(() => {
    return filterAchievements(catalog, unlocked, {
      category: selectedCategory,
      status: statusFilter,
    });
  }, [catalog, unlocked, selectedCategory, statusFilter]);

  if (!isOpen) {
    return null;
  }

  const unlockedCount = catalog.filter((item) => !!unlocked[item.id]).length;
  const totalCount = catalog.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
      data-testid="achievement-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ */}
      <div
        data-testid="achievement-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-orange-200 flex items-center justify-center text-amber-500 shrink-0">
              <TrophyIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="achievement-modal-title"
                  className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
                >
                  実績
                </h2>
                <span
                  data-testid="achievement-rate-badge"
                  aria-label={`達成率: ${totalCount}個中${unlockedCount}個`}
                  className="text-xs sm:text-sm font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs leading-none shrink-0"
                >
                  {unlockedCount}/{totalCount}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                猫ちゃんとふれあって達成した記録です
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="実績を閉じる"
            data-testid="achievement-modal-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ウィンドウ上部：カテゴリ絞り込みフィルター（おくりもの一覧画面と同様の操作性） */}
        <div
          data-testid="achievement-category-filter"
          aria-label="カテゴリ絞り込み"
          className="px-4 sm:px-5 py-2.5 border-b border-orange-100/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-stone-50/60"
        >
          {/* すべて */}
          <button
            type="button"
            data-testid="filter-category-all"
            aria-pressed={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                : 'bg-white/90 text-stone-600 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            すべて ({catalog.length})
          </button>

          {/* 各カテゴリ（ふれあい・お世話・おくりもの） */}
          {ACHIEVEMENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = catalog.filter((item) => (item.category ?? 'interaction') === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                data-testid={`filter-category-${cat.id}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-white/90 text-stone-600 border-amber-200/80 hover:bg-amber-50'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* ウィンドウ上部：達成状況絞り込みフィルター（すべて / 達成済み / 未達成） */}
        <div
          data-testid="achievement-status-filter"
          aria-label="達成状況絞り込み"
          className="px-4 sm:px-5 py-2 border-b border-orange-100/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-amber-50/30"
        >
          <button
            type="button"
            data-testid="filter-status-all"
            aria-pressed={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              statusFilter === 'all'
                ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                : 'bg-white/90 text-stone-600 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            すべて ({catalog.length})
          </button>
          <button
            type="button"
            data-testid="filter-status-unlocked"
            aria-pressed={statusFilter === 'unlocked'}
            onClick={() => setStatusFilter('unlocked')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              statusFilter === 'unlocked'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                : 'bg-white/90 text-stone-600 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            達成済み ({unlockedCount})
          </button>
          <button
            type="button"
            data-testid="filter-status-locked"
            aria-pressed={statusFilter === 'locked'}
            onClick={() => setStatusFilter('locked')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              statusFilter === 'locked'
                ? 'bg-stone-600 text-white border-stone-700 shadow-2xs'
                : 'bg-white/90 text-stone-600 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            未達成 ({totalCount - unlockedCount})
          </button>
        </div>

        {/* 実績リストコンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-2.5 text-left">
          {filteredCatalog.length === 0 ? (
            <div
              data-testid="achievement-filter-empty"
              className="py-12 text-center text-xs text-stone-400 font-medium"
            >
              条件に一致する実績はありません
            </div>
          ) : (
            filteredCatalog.map((item) => {
              const isUnlocked = !!unlocked[item.id];
              const displayInfo = getAchievementDisplayInfo(item, isUnlocked);

              return (
                <div
                  key={item.id}
                  data-testid={`achievement-item-${item.id}`}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-white border-amber-300/90 shadow-2xs'
                    : 'bg-stone-50/80 border-stone-200/70 opacity-75'
                }`}
              >
                {/* アイコンボックス */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                    isUnlocked
                      ? 'bg-white border-amber-300 shadow-amber-200/30'
                      : 'bg-stone-200/70 border-stone-300'
                  }`}
                >
                  <AchievementItemIcon iconType={item.iconType} isUnlocked={isUnlocked} />
                </div>

                {/* タイトルと説明文 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      data-testid={`achievement-title-${item.id}`}
                      className={`text-sm font-extrabold truncate ${
                        isUnlocked
                          ? 'text-stone-800'
                          : 'text-stone-500 tracking-wider'
                      }`}
                    >
                      {displayInfo.displayTitle}
                    </h4>

                    {/* 達成ステータスバッジ */}
                    {isUnlocked ? (
                      <span
                        data-testid={`achievement-badge-${item.id}`}
                        className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-2xs flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>達成！</span>
                      </span>
                    ) : (
                      <span
                        data-testid={`achievement-badge-${item.id}`}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-500 shrink-0"
                      >
                        未達成
                      </span>
                    )}
                  </div>
                  <p
                    data-testid={`achievement-desc-${item.id}`}
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isUnlocked
                        ? 'text-stone-600'
                        : displayInfo.isHidden
                          ? 'text-stone-400 tracking-widest font-mono select-none'
                          : 'text-stone-500'
                    }`}
                  >
                    {displayInfo.displayDescription}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-orange-100 bg-stone-50/80 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>たくさんふれあって、すべての実績を解除しよう！</span>
        </div>
      </div>
    </div>
  );
};
