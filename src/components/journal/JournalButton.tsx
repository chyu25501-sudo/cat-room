import React from 'react';

export interface JournalButtonProps {
  /** クリック時にふり返り手帳を開くコールバック */
  onClick: () => void;
  /** 追加のTailwindクラス */
  className?: string;
  /** ボタンのラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

/**
 * ふり返り手帳の線画アイコン（しおり付き手帳のシンプルなSVG）
 */
export const JournalBookIcon: React.FC<{ className?: string }> = ({
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
    data-testid="journal-icon"
  >
    {/* 手帳の本体 */}
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    {/* 手帳のしおりリボン */}
    <path d="M10 2v7l2.5-2 2.5 2V2" />
    {/* 手帳の背の丸み */}
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
  </svg>
);

/**
 * 画面左上の実績ボタンと設定ボタンの間に配置する「ふり返り手帳」ボタン
 * 手帳アイコンのみを描いた角丸正方形のシンプルな見た目
 */
export const JournalButton: React.FC<JournalButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'ふり返り手帳を開く',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="ふり返り手帳"
      data-testid="journal-button"
      className={`fixed top-4 left-[14rem] sm:top-5 sm:left-[16.5rem] z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-orange-200/90 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-teal-600 hover:text-teal-700 hover:border-teal-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <JournalBookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};
