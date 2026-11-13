import React from 'react';

export interface TreasureChestButtonProps {
  /** クリック時におくりもの一覧画面を開くコールバック */
  onClick: () => void;
  /** 追加のTailwindクラス */
  className?: string;
  /** ボタンのラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

/**
 * 宝箱の線画アイコン（Lucide等のデザインシステムと統一感を持たせたシンプルなSVG）
 */
export const TreasureChestIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    data-testid="treasure-chest-icon"
  >
    {/* 宝箱のドーム状の蓋 */}
    <path d="M3 10V8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2" />
    {/* 宝箱の本体 */}
    <rect x="3" y="10" width="18" height="10" rx="2" />
    {/* 中央の留め金・鍵穴パーツ */}
    <path d="M10 10v3a2 2 0 0 0 4 0v-3" />
    {/* 本体の金属リブ水平ライン */}
    <line x1="3" y1="14" x2="21" y2="14" />
  </svg>
);

/**
 * 画面左上に配置する「おくりもの一覧」を開く正方形ボタン
 * 宝箱のアイコンのみを描いた角丸正方形のシンプルな見た目
 */
export const TreasureChestButton: React.FC<TreasureChestButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'これまでに受け取ったおくりもの一覧を開く',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="おくりもの一覧"
      data-testid="treasure-chest-button"
      className={`fixed top-4 left-4 sm:top-5 sm:left-5 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-orange-200/90 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-amber-600 hover:text-amber-700 hover:border-orange-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <TreasureChestIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};
