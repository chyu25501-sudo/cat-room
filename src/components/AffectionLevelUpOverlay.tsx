import React from 'react';
import { Sparkles } from 'lucide-react';
import { AffectionLevelUpState } from '../types/affection.ts';
import { GiftIcon } from './gifts/GiftIcon.tsx';

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

  const { level, catName, title, isFading, isMaxBonus = false, gift } = state;

  return (
    <div
      data-testid="affection-levelup-overlay"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none transition-all duration-500 ease-out ${
        isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* 暗い背景バックドロップ（演出中、背後をトーンダウンさせてハートを際立たせる） */}
      <div
        data-testid="affection-levelup-backdrop"
        className={`absolute inset-0 bg-stone-950/65 backdrop-blur-[2px] transition-opacity duration-500 ease-out ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 画面中央演出カードラッパー（Z-10でバックドロップより前面に配置） */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4">
        {/* 回転する光彩サンバースト（背景でゆっくり回転する12条の放射状光輪） */}
        <div
          data-testid="affection-levelup-sunburst"
          className="absolute -inset-16 sm:-inset-20 flex items-center justify-center pointer-events-none animate-spin [animation-duration:14s] opacity-40"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-80 h-80 sm:w-96 sm:h-96 text-pink-300"
            fill="currentColor"
          >
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <polygon
                key={deg}
                points="50,50 46,0 54,0"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
          </svg>
        </div>

        {/* 巨大なハートマークとなつき度数値（回転スピン登場＆左右回転スイングアニメーション付き） */}
        <div
          data-testid="affection-levelup-heart"
          className="relative flex items-center justify-center filter drop-shadow-[0_16px_36px_rgba(244,63,94,0.65)] animate-heart-spin-intro"
        >
          <div className="animate-heart-sway flex items-center justify-center">
            {/* ハートマークSVG */}
            <svg
              viewBox="0 0 24 24"
              className="w-52 h-52 sm:w-60 sm:h-60 fill-gradient text-rose-500"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            {/* ハート内部に表示するなつき度の数値 */}
            <div
              data-testid="affection-levelup-number"
              className="absolute inset-0 flex flex-col items-center justify-center text-white pb-3 drop-shadow-md select-none"
            >
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase opacity-90 mb-0.5">
                {isMaxBonus ? 'だいすき♡' : 'なつき度'}
              </span>
              <span className="text-5xl sm:text-6xl font-black tracking-tight leading-none">
                {isMaxBonus ? 'MAX' : `Lv.${level}`}
              </span>
            </div>
          </div>
        </div>

        {/* その下に表示する祝うメッセージ */}
        <div
          data-testid="affection-levelup-message"
          className="mt-6 flex flex-col items-center text-center px-4 max-w-xs sm:max-w-sm w-full"
        >
          <div className="w-full bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-pink-400">
            <p className="text-base sm:text-lg font-black text-rose-600 tracking-wide flex items-center justify-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{isMaxBonus ? 'ハートがいっぱい♡' : 'なつき度が上がったよ！'}</span>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            </p>
            <p className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
              {isMaxBonus
                ? `${catName}からたくさんの愛を受け取ったよ♡`
                : (
                  <>
                    {catName}は「<span className="text-pink-600 font-extrabold">{title}</span>」になった♡
                  </>
                )}
            </p>

            {/* 猫からもらったおくりもの表示 */}
            {gift && (
              <div
                data-testid="affection-levelup-gift"
                className="mt-3 pt-2.5 border-t border-pink-100 flex items-center gap-2.5 text-left bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-pink-50/90 p-2.5 rounded-xl border border-orange-200/80 shadow-xs"
              >
                <div
                  data-testid="gift-item-icon"
                  className="w-11 h-11 rounded-xl bg-white shadow-xs border border-orange-200 flex items-center justify-center shrink-0 p-1"
                >
                  <GiftIcon giftId={gift.id} className="w-8 h-8" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                    <span>🎁</span>
                    <span>{catName}からのおくりもの</span>
                  </span>
                  <span
                    data-testid="gift-item-name"
                    className="text-xs sm:text-sm font-extrabold text-stone-800 truncate"
                  >
                    {gift.name}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate">
                    {gift.description}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
