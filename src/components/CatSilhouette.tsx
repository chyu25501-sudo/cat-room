import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { CatPreset, CAT_PRESETS, CatId } from '../types/cat.ts';
import { BlackCat, CatShapeProps } from './cats/BlackCat.tsx';
import { WhiteCat } from './cats/WhiteCat.tsx';

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
  /** 猫が反応中（鳴き声再生中・タップ直後）かどうか */
  isReacting?: boolean;
  /** 猫を直接クリック/タップしたときのコールバック */
  onClick?: () => void;
  /** 追加クラス名 */
  className?: string;
}

export const CatSilhouette: React.FC<CatSilhouetteProps> = ({
  preset = CAT_PRESETS[0],
  isReacting = false,
  onClick,
  className = '',
}) => {
  const ActiveCatComponent = CAT_COMPONENTS[preset.id] ?? BlackCat;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* クリック可能な猫シルエット本体 */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${preset.name}のシルエット（タップしてふれあう）`}
        className="group relative flex flex-col items-center justify-center p-2 rounded-3xl cursor-pointer select-none transition-transform duration-200 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-orange-300 active:scale-95 hover:scale-102"
      >
        {/* 反応中のフローティング演出（ハート・きらきら） */}
        {isReacting && (
          <div className="absolute -top-6 inset-x-0 flex justify-around pointer-events-none z-20">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-bounce transition-all duration-300" />
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse transition-all duration-300" />
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-bounce delay-100 transition-all duration-300" />
          </div>
        )}

        {/* 猫のSVGシルエット */}
        <div
          className={`relative transition-all duration-300 ${
            isReacting
              ? 'scale-105 -translate-y-1'
              : 'group-hover:-translate-y-0.5'
          }`}
        >
          <ActiveCatComponent isReacting={isReacting} />
        </div>

        {/* 足元のインタラクションガイドバッジ */}
        <div className="mt-3 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/60 text-stone-600 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xs group-hover:bg-orange-200/80 group-hover:text-orange-900 transition-colors">
          <span>タップ（クリック）してふれあう</span>
        </div>
      </button>
    </div>
  );
};
