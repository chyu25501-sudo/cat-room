import React from 'react';
import { Heart, Sparkles, Zap, Utensils } from 'lucide-react';
import { CatMoodLevel } from '../types/mood.ts';
import { CatFullnessLevel } from '../types/fullness.ts';
import { LastCareAction } from '../types/care.ts';
import { getMoodInfo, getMoodDescription } from '../utils/catMood.ts';
import { getFullnessInfo } from '../utils/catFullness.ts';

export interface CatMoodIndicatorProps {
  /** 現在のごきげんスコア（0 〜 100） */
  moodScore: number;
  /** 現在のごきげんレベル */
  moodLevel: CatMoodLevel;
  /** 現在のまんぷくスコア（0 〜 100、オプション） */
  fullnessScore?: number;
  /** 現在のまんぷくレベル（オプション） */
  fullnessLevel?: CatFullnessLevel;
  /** 直前のアクション（なでる・ごはん・おもちゃ） */
  lastAction?: LastCareAction | null;
  /** 対象の猫の名称（表示用） */
  catName?: string;
  className?: string;
}

/**
 * 猫のごきげん度およびまんぷく度を視覚的に表示するゲージ＆バッジコンポーネント
 */
export const CatMoodIndicator: React.FC<CatMoodIndicatorProps> = ({
  moodScore,
  moodLevel,
  fullnessScore,
  fullnessLevel,
  lastAction = null,
  catName = 'ねこ',
  className = '',
}) => {
  const info = getMoodInfo(moodLevel);
  const description = getMoodDescription(moodLevel, lastAction);

  // まんぷく度情報の取得
  const effectiveFullnessLevel: CatFullnessLevel =
    fullnessLevel ??
    (typeof fullnessScore === 'number'
      ? getFullnessInfo(fullnessScore).level
      : 'satisfied');
  const fullnessInfo = getFullnessInfo(
    typeof fullnessScore === 'number' ? fullnessScore : effectiveFullnessLevel
  );

  // ごきげん度ゲージバーのグラデーションカラー
  const moodGaugeGradientClass =
    moodLevel === 'annoyed'
      ? 'from-rose-500 via-red-500 to-rose-600'
      : moodLevel === 'ecstatic'
      ? 'from-rose-400 via-pink-400 to-rose-500'
      : moodLevel === 'happy'
      ? 'from-amber-400 via-orange-400 to-amber-500'
      : 'from-stone-300 via-amber-300 to-orange-300';

  // まんぷく度ゲージバーのグラデーションカラー
  const fullnessGaugeGradientClass =
    fullnessInfo.level === 'full'
      ? 'from-emerald-400 via-teal-400 to-emerald-500'
      : fullnessInfo.level === 'satisfied'
      ? 'from-teal-400 via-emerald-400 to-green-500'
      : fullnessInfo.level === 'hungry'
      ? 'from-amber-400 via-orange-400 to-amber-500'
      : 'from-rose-400 to-amber-500';

  return (
    <div
      className={`bg-white/80 backdrop-blur-xs border border-orange-200/80 rounded-2xl p-2.5 sm:p-3 shadow-xs select-none transition-all duration-300 ${className}`}
      data-testid="cat-mood-indicator"
    >
      {/* ===== ごきげん度セクション ===== */}
      {/* 上段：猫のなまえと現在の機嫌バッジ */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-stone-700 truncate">
            {catName}のごきげん
          </span>
          {moodLevel === 'annoyed' && (
            <Zap className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-bounce shrink-0" />
          )}
          {moodLevel === 'ecstatic' && (
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
          )}
          {moodLevel === 'happy' && (
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow shrink-0" />
          )}
        </div>

        {/* 機嫌ステータスバッジ（絵文字のないシンプルなテキストバッジ） */}
        <div
          data-testid="mood-status-badge"
          className={`px-2.5 py-0.5 rounded-full border text-xs font-bold tracking-wide shadow-2xs transition-colors duration-300 ${info.badgeClass}`}
        >
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
            className={`h-full rounded-full bg-gradient-to-r ${moodGaugeGradientClass} transition-all duration-500 ease-out`}
            style={{ width: `${Math.max(4, Math.min(100, moodScore))}%` }}
          />
        </div>
      </div>

      {/* 下段：現在の状態説明テキスト */}
      <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
        <span className="truncate">{description}</span>
        <span
          data-testid="mood-score-percentage"
          className="font-semibold text-stone-600 shrink-0 ml-2"
        >
          {moodScore}%
        </span>
      </div>

      {/* ===== まんぷく度セクション（指定時のみ表示） ===== */}
      {typeof fullnessScore === 'number' && (
        <div
          data-testid="cat-fullness-section"
          className="mt-2.5 pt-2 border-t border-orange-100/80 transition-all duration-300"
        >
          {/* 上段：まんぷく度タイトルとステータスバッジ */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Utensils className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-stone-700 truncate">
                {catName}のまんぷく度
              </span>
            </div>

            {/* まんぷくステータスバッジ */}
            <div
              data-testid="fullness-status-badge"
              className={`px-2.5 py-0.5 rounded-full border text-xs font-bold tracking-wide shadow-2xs transition-colors duration-300 ${fullnessInfo.badgeClass}`}
            >
              <span>{fullnessInfo.label}</span>
            </div>
          </div>

          {/* 中段：まんぷくプログレスバー */}
          <div className="relative w-full">
            <div
              role="progressbar"
              aria-valuenow={fullnessScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${catName}のまんぷく度: ${fullnessScore}% (${fullnessInfo.label})`}
              className="w-full bg-emerald-100/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-200/60 shadow-inner"
            >
              <div
                data-testid="fullness-gauge-fill"
                className={`h-full rounded-full bg-gradient-to-r ${fullnessGaugeGradientClass} transition-all duration-500 ease-out`}
                style={{ width: `${Math.max(4, Math.min(100, fullnessScore))}%` }}
              />
            </div>
          </div>

          {/* 下段：まんぷく度状態説明テキストとパーセント数値 */}
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
            <span className="truncate">{fullnessInfo.description}</span>
            <span
              data-testid="fullness-score-percentage"
              className="font-semibold text-stone-600 shrink-0 ml-2"
            >
              {fullnessScore}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

