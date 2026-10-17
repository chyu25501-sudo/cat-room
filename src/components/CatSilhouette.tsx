import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { CatPreset, CAT_PRESETS, CatId } from '../types/cat.ts';
import { BlackCat, CatShapeProps } from './cats/BlackCat.tsx';
import { WhiteCat } from './cats/WhiteCat.tsx';
import { useCatPetting } from '../hooks/useCatPetting.ts';

/**
 * 将来的な猫の種類増加に対応した猫シルエットコンポーネントマップ
 */
const CAT_COMPONENTS: Record<CatId, React.FC<CatShapeProps>> = {
  black: BlackCat,
  white: WhiteCat,
};

export interface CatSilhouetteProps {
  /** 表示する猫プリセット情報（未指定時はくろねこ） */
  preset?: CatPreset;
  /** 猫が反応中（鳴き声再生中・なでなで直後）かどうか */
  isReacting?: boolean;
  /** 猫をなでた（ドラッグストローク完了）ときのコールバック */
  onPet?: () => void;
  /** なでたと判定する移動距離のしきい値（ピクセル） */
  strokeThreshold?: number;
  /** なでた後のクールダウン時間（ミリ秒） */
  cooldownMs?: number;
  /** 後方互換用：クリック時のコールバック */
  onClick?: () => void;
  /** 追加クラス名 */
  className?: string;
}

export const CatSilhouette: React.FC<CatSilhouetteProps> = ({
  preset = CAT_PRESETS[0],
  isReacting = false,
  onPet,
  strokeThreshold,
  cooldownMs,
  onClick,
  className = '',
}) => {
  const ActiveCatComponent = CAT_COMPONENTS[preset.id] ?? BlackCat;

  const handlePetAction = onPet ?? onClick ?? (() => {});

  // ドラッグ操作による「なでる」インタラクション（クールダウンで長いストローク時の過剰反応を制御）
  const { isDragging, handlers } = useCatPetting({
    onPet: handlePetAction,
    threshold: strokeThreshold,
    cooldownMs,
  });

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* ドラッグ・なでなで可能な猫シルエット本体 */}
      <button
        type="button"
        {...handlers}
        onClick={onClick}
        aria-label={`${preset.name}のシルエット（ドラッグしてなでる）`}
        className={`group relative flex flex-col items-center justify-center p-2 rounded-3xl w-72 sm:w-80 h-[320px] sm:h-[352px] select-none transition-transform duration-200 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-orange-300 touch-none ${
          isDragging
            ? 'cursor-grabbing scale-102'
            : 'cursor-grab hover:scale-102 active:scale-95'
        }`}
      >
        {/* 反応中またはドラッグ中のフローティング演出（ハート・きらきら） */}
        {(isReacting || isDragging) && (
          <div className="absolute -top-6 inset-x-0 flex justify-around pointer-events-none z-20">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-bounce transition-all duration-300" />
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse transition-all duration-300" />
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-bounce delay-100 transition-all duration-300" />
          </div>
        )}

        {/* 猫のSVGシルエット表示エリア（猫種切り替え時にも高さが変わらない固定ステージ） */}
        <div
          className={`relative w-64 sm:w-72 h-64 sm:h-72 flex items-end justify-center transition-all duration-300 ${
            isReacting || isDragging
              ? 'scale-105 -translate-y-1'
              : 'group-hover:-translate-y-0.5'
          }`}
        >
          <ActiveCatComponent isReacting={isReacting || isDragging} />
        </div>

        {/* 足元のインタラクションガイドバッジ */}
        <div className="mt-3 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/60 text-stone-600 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xs group-hover:bg-orange-200/80 group-hover:text-orange-900 transition-colors">
          <span>なでなで（ドラッグ）してふれあう</span>
        </div>
      </button>
    </div>
  );
};
