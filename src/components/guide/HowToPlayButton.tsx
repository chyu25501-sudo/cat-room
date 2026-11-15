import React from 'react';

export interface HowToPlayButtonProps {
  /** クリック時にあそびかた画面を開くコールバック */
  onClick: () => void;
  /** 追加のTailwindクラス */
  className?: string;
  /** ボタンのラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

/**
 * あそびかた（ヘルプ・ガイド）の線画アイコン（Lucide等のデザインシステムと統一感を持たせたシンプルなSVG）
 */
export const HowToPlayIcon: React.FC<{ className?: string }> = ({
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
    data-testid="how-to-play-icon"
  >
    {/* 外枠のサークル */}
    <circle cx="12" cy="12" r="10" />
    {/* クエスチョンマーク上部 */}
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    {/* クエスチョンマーク下部のドット */}
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/**
 * 画面左上の一番左（おくりもの一覧ボタンの左横）に配置する「あそびかた」を開く正方形ボタン
 * ヘルプ（？）アイコンのみを描いた角丸正方形のシンプルな見た目
 */
export const HowToPlayButton: React.FC<HowToPlayButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'あそびかたを開く',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="あそびかた"
      data-testid="how-to-play-button"
      className={`fixed top-4 left-4 sm:top-5 sm:left-5 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-orange-200/90 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-sky-600 hover:text-sky-700 hover:border-sky-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <HowToPlayIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};
