import React from 'react';
import { AchievementToast } from '../../types/achievement.ts';
import { TrophyIcon } from './AchievementButton.tsx';

export interface AchievementToastOverlayProps {
  /** 表示中の実績トースト一覧（複数の場合は縦並び） */
  toasts: AchievementToast[];
  /** トーストをクリックした時の消去コールバック */
  onDismiss?: (id: string) => void;
}

/**
 * 実績解除時に画面上部に表示されるトースト通知コンポーネント
 * 複数同時に解除された場合は縦に並べて表示されます
 */
export const AchievementToastOverlay: React.FC<AchievementToastOverlayProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="実績通知"
      aria-live="polite"
      data-testid="achievement-toast-container"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4 select-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          data-testid={`achievement-toast-${toast.id}`}
          onClick={() => onDismiss?.(toast.id)}
          className="w-full bg-white/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-slide-down pointer-events-auto cursor-pointer hover:border-amber-500 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* トロフィーアイコンバッジ */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs border border-amber-300">
            <TrophyIcon className="w-5 h-5 drop-shadow-2xs" />
          </div>

          {/* 実績獲得メッセージ & 実績タイトル & 説明 */}
          <div className="flex-1 min-w-0 text-left">
            <div
              data-testid="achievement-toast-message"
              className="text-[11px] font-black text-amber-600 tracking-wide flex items-center gap-1 leading-tight"
            >
              <span>実績を獲得！</span>
            </div>
            <h4
              data-testid="achievement-toast-title"
              className="text-sm font-extrabold text-stone-800 truncate leading-snug mt-0.5"
            >
              {toast.title}
            </h4>
            <p
              data-testid="achievement-toast-description"
              className="text-[11px] text-stone-500 truncate leading-tight mt-0.5"
            >
              {toast.description}
            </p>
          </div>
        </div>
      ))}
    </aside>
  );
};
