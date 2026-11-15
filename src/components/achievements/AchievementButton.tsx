import React from 'react';

export interface AchievementButtonProps {
  /** クリック時に実績画面を開くコールバック */
  onClick: () => void;
  /** 追加のTailwindクラス */
  className?: string;
  /** ボタンのラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

/**
 * トロフィーの線画アイコン（Lucide等のデザインシステムと統一感を持たせたシンプルなSVG）
 */
export const TrophyIcon: React.FC<{ className?: string }> = ({
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
    data-testid="trophy-icon"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

/**
 * 画面左上のおくりもの一覧ボタンと設定ボタンの間に配置する実績ボタン
 * トロフィーアイコンのみを描いた角丸正方形のシンプルな見た目
 */
export const AchievementButton: React.FC<AchievementButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = '実績一覧を開く',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="実績一覧"
      data-testid="achievement-button"
      className={`fixed top-4 left-[4.25rem] sm:top-5 sm:left-[4.875rem] z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-orange-200/90 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-amber-500 hover:text-amber-600 hover:border-orange-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};
