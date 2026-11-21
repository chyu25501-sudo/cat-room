import React from 'react';
import { Utensils } from 'lucide-react';

export interface CareButtonProps {
  /** クリック時にお世話メニューモーダルを開くコールバック */
  onClick: () => void;
  /** 追加クラス名 */
  className?: string;
  /** アクセシビリティ用ラベル */
  ariaLabel?: string;
}

/**
 * 画面左上（あそびかたとおくりもの一覧ボタンの間）に配置する「お世話メニュー」を開く角丸正方形ボタン
 */
export const CareButton: React.FC<CareButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'お世話メニューを開く',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="お世話メニュー"
      data-testid="care-menu-button"
      className={`fixed top-4 left-[4.25rem] sm:top-5 sm:left-[4.875rem] z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-orange-200/90 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-orange-500 hover:text-orange-600 hover:border-orange-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};
