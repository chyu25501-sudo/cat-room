import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { FoodItem } from '../../types/care.ts';

export interface FoodDishProps {
  /** 表示するごはんアイテム */
  food: FoodItem;
  /** 食事中アニメーションフラグ */
  isEating?: boolean;
  /** 追加クラス名 */
  className?: string;
}

/**
 * カリカリ（ドライフード）ボウルのイラストSVG
 */
const KibbleDishSvg: React.FC = () => (
  <svg
    viewBox="0 0 120 70"
    className="w-24 sm:w-28 h-auto drop-shadow-md select-none"
    aria-hidden="true"
    data-testid="kibble-dish-svg"
  >
    {/* 床の影 */}
    <ellipse cx="60" cy="62" rx="48" ry="7" className="fill-stone-400/30" />

    {/* フードボウル本体（陶器風の丸い器） */}
    <path
      d="M 18 36 C 18 58 102 58 102 36 L 96 30 C 96 24 24 24 24 30 Z"
      className="fill-amber-500 stroke-amber-600"
      strokeWidth="2"
    />
    {/* 器のフチ（内側） */}
    <ellipse cx="60" cy="30" rx="38" ry="12" className="fill-amber-100 stroke-amber-400" strokeWidth="1.5" />

    {/* 器の側面ハイライト */}
    <path
      d="M 28 44 C 40 52 80 52 92 44"
      className="fill-none stroke-white/50"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* 器の肉球マーク */}
    <g className="fill-amber-600/70" transform="translate(60, 44) scale(0.65)">
      <ellipse cx="0" cy="2" rx="4.5" ry="3.5" />
      <circle cx="-5" cy="-3.5" r="1.8" />
      <circle cx="-1.8" cy="-5.5" r="1.8" />
      <circle cx="1.8" cy="-5.5" r="1.8" />
      <circle cx="5" cy="-3.5" r="1.8" />
    </g>

    {/* 盛られたカリカリ粒（山盛り） */}
    <ellipse cx="60" cy="28" rx="30" ry="9" className="fill-amber-800" />
    {/* 個別のドライフード粒 */}
    <circle cx="48" cy="26" r="3.2" className="fill-amber-700" />
    <circle cx="58" cy="24" r="3.4" className="fill-amber-600" />
    <circle cx="68" cy="25" r="3.2" className="fill-amber-900" />
    <circle cx="53" cy="21" r="3" className="fill-amber-700" />
    <circle cx="63" cy="20" r="3" className="fill-amber-600" />
    <circle cx="42" cy="28" r="2.8" className="fill-amber-900" />
    <circle cx="76" cy="27" r="3" className="fill-amber-700" />
    <circle cx="60" cy="16" r="3.2" className="fill-amber-500" />
  </svg>
);

/**
 * ねこ缶（ウェットフードまぐろ）プレートのイラストSVG
 */
const CannedDishSvg: React.FC = () => (
  <svg
    viewBox="0 0 130 70"
    className="w-26 sm:w-30 h-auto drop-shadow-md select-none"
    aria-hidden="true"
    data-testid="canned-dish-svg"
  >
    {/* 床の影 */}
    <ellipse cx="54" cy="62" rx="42" ry="6" className="fill-stone-400/30" />
    <ellipse cx="104" cy="58" rx="18" ry="4" className="fill-stone-400/25" />

    {/* パステルブルーの平皿 */}
    <ellipse cx="54" cy="52" rx="40" ry="12" className="fill-sky-400 stroke-sky-500" strokeWidth="2" />
    <ellipse cx="54" cy="48" rx="35" ry="9" className="fill-sky-50 stroke-sky-300" strokeWidth="1.5" />

    {/* ほぐし身のまぐろウェットフード（ジューシーな肉塊） */}
    <path
      d="M 32 46 C 30 36 78 36 76 46 Z"
      className="fill-rose-700/90"
    />
    <ellipse cx="54" cy="43" rx="20" ry="7" className="fill-rose-600" />
    {/* ジューシーなほぐし身テクスチャ */}
    <ellipse cx="46" cy="42" rx="6" ry="3" className="fill-rose-400" />
    <ellipse cx="58" cy="40" rx="7" ry="3" className="fill-rose-300" />
    <ellipse cx="64" cy="44" rx="5" ry="2.5" className="fill-rose-500" />
    <ellipse cx="40" cy="45" rx="4" ry="2" className="fill-rose-500" />

    {/* お皿の側面のお魚マーク */}
    <g className="fill-sky-700/60" transform="translate(54, 55) scale(0.55)">
      <path d="M -8 0 C -4 -5 4 -5 8 0 C 4 5 -4 5 -8 0 Z" />
      <polygon points="8,0 13,-4 13,4" />
      <circle cx="-4" cy="-1" r="0.8" className="fill-white" />
    </g>

    {/* 横に置かれた空き缶（メタリックな缶詰とお魚ラベル） */}
    <g transform="translate(94, 26)">
      {/* 缶の胴体 */}
      <rect x="0" y="10" width="22" height="22" rx="3" className="fill-slate-300 stroke-slate-400" strokeWidth="1.5" />
      {/* 缶のラベル（水色） */}
      <rect x="1" y="14" width="20" height="12" className="fill-sky-400" />
      {/* ラベルのお魚 */}
      <path d="M 6 20 C 8 18 12 18 14 20 C 12 22 8 22 6 20 Z" className="fill-white" />
      {/* 缶の上部フタ（開いている） */}
      <ellipse cx="11" cy="10" rx="11" ry="4" className="fill-slate-200 stroke-slate-400" strokeWidth="1.5" />
      <ellipse cx="11" cy="10" rx="8" ry="2.5" className="fill-slate-400" />
    </g>
  </svg>
);

/**
 * おやつピューレ（とろとろおやつ＆ちゅ〜る風スティック）のイラストSVG
 */
const TreatDishSvg: React.FC = () => (
  <svg
    viewBox="0 0 130 70"
    className="w-26 sm:w-30 h-auto drop-shadow-md select-none"
    aria-hidden="true"
    data-testid="treat-dish-svg"
  >
    {/* 床の影 */}
    <ellipse cx="50" cy="62" rx="36" ry="6" className="fill-stone-400/30" />
    <ellipse cx="98" cy="56" rx="22" ry="5" className="fill-stone-400/25" />

    {/* パステルピンクの小皿 */}
    <ellipse cx="50" cy="52" rx="34" ry="11" className="fill-rose-400 stroke-rose-500" strokeWidth="2" />
    <ellipse cx="50" cy="49" rx="29" ry="8" className="fill-rose-50 stroke-rose-300" strokeWidth="1.5" />

    {/* とろ〜り絞り出されたピューレ（波打つとろとろクリーム） */}
    <path
      d="M 32 49 C 32 40 45 36 50 36 C 58 36 68 42 68 49 C 64 54 36 54 32 49 Z"
      className="fill-pink-500"
    />
    <path
      d="M 36 48 C 38 42 46 39 52 40 C 60 41 62 46 62 49 Z"
      className="fill-pink-300"
    />
    {/* 艶（ハイライト） */}
    <ellipse cx="46" cy="43" rx="4" ry="1.5" className="fill-white/80" />
    <ellipse cx="55" cy="44" rx="3" ry="1.2" className="fill-white/70" />

    {/* ピューレスティック（ちゅ〜る風パウチ） */}
    <g transform="rotate(-25 90 40)">
      {/* スティック本体 */}
      <rect x="75" y="32" width="46" height="13" rx="3" className="fill-rose-400 stroke-rose-500" strokeWidth="1.5" />
      {/* 金色/白のライン */}
      <rect x="75" y="36" width="46" height="3" className="fill-amber-300" />
      {/* 先端の絞り口 */}
      <polygon points="75,34 70,38.5 75,43" className="fill-rose-300 stroke-rose-500" strokeWidth="1" />
      {/* 先端から垂れるピューレの雫 */}
      <circle cx="67" cy="40" r="2.2" className="fill-pink-500" />
    </g>
  </svg>
);

/**
 * 給餌時に画面上（猫の足元）に表示するごはんイラストコンポーネント
 */
export const FoodDish: React.FC<FoodDishProps> = ({
  food,
  isEating = false,
  className = '',
}) => {
  return (
    <div
      data-testid="food-dish-container"
      className={`relative inline-flex flex-col items-center justify-center transition-all duration-300 animate-in fade-in zoom-in-90 ${className}`}
    >
      {/* 食事中のもぐもぐパーティクル（ハート・星・湯気のようなきらめきが立ち上る） */}
      {isEating && (
        <div
          data-testid="eating-particles"
          className="absolute -top-6 inset-x-0 flex items-center justify-center pointer-events-none z-30"
          aria-hidden="true"
        >
          {/* 左側のハート */}
          <span className="absolute -left-2 -top-2 animate-bounce">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-500 animate-pulse drop-shadow-sm" />
          </span>
          {/* 中央のきらめき */}
          <span className="absolute top-0 animate-ping">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </span>
          {/* 右側の星 */}
          <span className="absolute -right-2 -top-1 animate-bounce delay-150">
            <Sparkles className="w-4 h-4 text-orange-400" />
          </span>
        </div>
      )}

      {/* ごはんの種類に応じたSVGイラスト */}
      <div
        className={`transition-transform duration-200 ${
          isEating ? 'animate-bounce-subtle scale-105' : 'hover:scale-105'
        }`}
      >
        {food.id === 'kibble' && <KibbleDishSvg />}
        {food.id === 'canned' && <CannedDishSvg />}
        {food.id === 'treat' && <TreatDishSvg />}
      </div>

      {/* ごはんの名前ミニバッジ */}
      <div className="mt-0.5 px-2 py-0.5 rounded-full bg-white/95 border border-orange-200/90 shadow-2xs text-[10px] font-bold text-stone-700 flex items-center gap-1 select-none">
        <span>{food.name}</span>
        {isEating && (
          <span className="text-orange-500 font-extrabold text-[9px] animate-pulse">
            もぐもぐ…♪
          </span>
        )}
      </div>
    </div>
  );
};
