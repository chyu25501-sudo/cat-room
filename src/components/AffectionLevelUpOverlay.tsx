import React from 'react';
import { Sparkles } from 'lucide-react';
import { AffectionLevelUpState } from '../types/affection.ts';

export interface AffectionLevelUpOverlayProps {
  /** レベルアップ演出ステート（null のときは非表示） */
  state: AffectionLevelUpState | null;
}

/**
 * なつき度レベルアップ時に画面中央に大きく表示されるお祝い演出オーバーレイ
 * 巨大なハートマークと数値、祝うメッセージを表示し、一定時間後にフェードアウトします。
 */
export const AffectionLevelUpOverlay: React.FC<AffectionLevelUpOverlayProps> = ({ state }) => {
  if (!state) {
    return null;
  }

  const { level, catName, title, isFading } = state;

  return (
    <div
      data-testid="affection-levelup-overlay"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none transition-all duration-500 ease-out ${
        isFading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
      }`}
    >
      {/* 画面中央演出カードラッパー */}
      <div className="flex flex-col items-center justify-center p-4">
        {/* 巨大なハートマークとなつき度数値 */}
        <div
          data-testid="affection-levelup-heart"
          className="relative flex items-center justify-center filter drop-shadow-[0_12px_28px_rgba(244,63,94,0.45)] transform transition-transform duration-300 hover:scale-105"
        >
          {/* ハートマークSVG */}
          <svg
            viewBox="0 0 24 24"
            className="w-48 h-48 sm:w-56 sm:h-56 fill-gradient text-rose-500"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* ハート内部に表示するなつき度の数値 */}
          <div
            data-testid="affection-levelup-number"
            className="absolute inset-0 flex flex-col items-center justify-center text-white pb-3 drop-shadow-md"
          >
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase opacity-90 mb-0.5">
              なつき度
            </span>
            <span className="text-5xl sm:text-6xl font-black tracking-tight leading-none">
              Lv.{level}
            </span>
          </div>
        </div>

        {/* その下に表示する祝うメッセージ */}
        <div
          data-testid="affection-levelup-message"
          className="mt-4 flex flex-col items-center text-center px-4 max-w-xs sm:max-w-sm w-full animate-bounce"
        >
          <div className="w-full bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border-2 border-pink-300">
            <p className="text-base sm:text-lg font-black text-rose-600 tracking-wide flex items-center justify-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <span>なつき度が上がったよ！</span>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            </p>
            <p className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
              {catName}は「<span className="text-pink-600 font-extrabold">{title}</span>」になった♡
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
