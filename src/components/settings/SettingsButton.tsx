import React from 'react';

export interface SettingsButtonProps {
  /** クリック時に設定画面を開くコールバック */
  onClick: () => void;
  /** 追加のTailwindクラス */
  className?: string;
  /** ボタンのラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

/**
 * 歯車の線画アイコン（Lucide等のデザインシステムと統一感を持たせたシンプルなSVG）
 */
export const SettingsIcon: React.FC<{ className?: string }> = ({
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
    data-testid="settings-icon"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * 画面左上のふり返り手帳ボタンの右横に配置する設定ボタン
 * 歯車アイコンのみを描いた角丸正方形のシンプルな見た目
 */
export const SettingsButton: React.FC<SettingsButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = '設定を開く',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="設定"
      data-testid="settings-button"
      className={`fixed top-4 left-[10.75rem] sm:top-5 sm:left-[12.625rem] z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-orange-200/90 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-stone-600 hover:text-stone-800 hover:border-orange-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};
