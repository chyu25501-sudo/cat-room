import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { CatMoodLevel } from '../types/mood.ts';
import { getMoodInfo } from '../utils/catMood.ts';

export interface CatMoodIndicatorProps {
  /** 現在のごきげんスコア（0 〜 100） */
  moodScore: number;
  /** 現在のごきげんレベル */
  moodLevel: CatMoodLevel;
  /** 対象の猫の名称（表示用） */
  catName?: string;
  className?: string;
}

/**
 * 猫のごきげん度（機嫌スコア・機嫌レベル）を視覚的に表示するゲージ＆バッジコンポーネント
 */
export const CatMoodIndicator: React.FC<CatMoodIndicatorProps> = ({
  moodScore,
  moodLevel,
  catName = 'ねこ',
  className = '',
}) => {
  const info = getMoodInfo(moodLevel);

  // ゲージバーのグラデーションカラー（機嫌が上がるにつれてオレンジ〜ローズ〜ピンクに変化）
  const gaugeGradientClass =
    moodLevel === 'ecstatic'
      ? 'from-rose-400 via-pink-400 to-rose-500'
      : moodLevel === 'happy'
      ? 'from-amber-400 via-orange-400 to-amber-500'
      : 'from-stone-300 via-amber-300 to-orange-300';

  return (
    <div
      className={`bg-white/80 backdrop-blur-xs border border-orange-200/80 rounded-2xl p-2.5 sm:p-3 shadow-xs select-none transition-all duration-300 ${className}`}
      data-testid="cat-mood-indicator"
    >
      {/* 上段：猫のなまえと現在の機嫌バッジ */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-stone-700 truncate">
            {catName}のごきげん
          </span>
          {moodLevel === 'ecstatic' && (
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
          )}
          {moodLevel === 'happy' && (
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow shrink-0" />
          )}
        </div>

        {/* 機嫌ステータスバッジ */}
        <div
          data-testid="mood-status-badge"
          className={`px-2 py-0.5 rounded-full border text-xs font-bold flex items-center gap-1 tracking-wide shadow-2xs transition-colors duration-300 ${info.badgeClass}`}
        >
          <span className="text-xs" aria-hidden="true">
            {info.emoji}
          </span>
          <span>{info.label}</span>
        </div>
      </div>

      {/* 中段：ごきげんプログレスバー */}
      <div className="relative w-full">
        <div
          role="progressbar"
          aria-valuenow={moodScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${catName}のごきげん度: ${moodScore}% (${info.label})`}
          className="w-full bg-orange-100/90 h-3 rounded-full overflow-hidden p-0.5 border border-orange-200/60 shadow-inner"
        >
          <div
            data-testid="mood-gauge-fill"
            className={`h-full rounded-full bg-gradient-to-r ${gaugeGradientClass} transition-all duration-500 ease-out`}
            style={{ width: `${Math.max(4, Math.min(100, moodScore))}%` }}
          />
        </div>
      </div>

      {/* 下段：現在の状態説明テキスト */}
      <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
        <span className="truncate">{info.description}</span>
        <span className="font-semibold text-stone-600 shrink-0 ml-2">
          {moodScore}%
        </span>
      </div>
    </div>
  );
};

