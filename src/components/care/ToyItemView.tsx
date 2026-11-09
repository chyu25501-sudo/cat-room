import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { ToyItem } from '../../types/care.ts';

export interface ToyItemViewProps {
  /** 表示するおもちゃアイテム */
  toy: ToyItem;
  /** 遊び中アニメーションフラグ */
  isPlaying?: boolean;
  /** 追加クラス名 */
  className?: string;
}

/**
 * ねこじゃらし（羽根スティック）のイラストSVG
 */
const TeaserToySvg: React.FC<{ isPlaying?: boolean }> = ({ isPlaying }) => (
  <svg
    viewBox="0 0 120 80"
    className="w-28 sm:w-32 h-auto drop-shadow-md select-none overflow-visible"
    aria-hidden="true"
    data-testid="teaser-toy-svg"
  >
    {/* 床の影 */}
    <ellipse cx="60" cy="72" rx="42" ry="5" className="fill-stone-400/25" />

    {/* ねこじゃらし本体：持ち手根元（105px 68px）を軸に振る */}
    <g
      className={isPlaying ? 'animate-teaser-stick' : ''}
      style={{ transformOrigin: '105px 68px' }}
      data-testid="teaser-stick-group"
    >
      {/* スティックの棒（しなやかなプラスチックの柄） */}
      <path
        d="M 110 70 Q 75 45 42 28"
        className="fill-none stroke-amber-600 stroke-[3]"
        strokeLinecap="round"
      />
      <path
        d="M 110 70 L 100 64"
        className="fill-none stroke-stone-700 stroke-[4.5]"
        strokeLinecap="round"
      />

      {/* ねこじゃらしの先端（羽根・鈴）：スティックの先端（40px 27px）を軸にパタパタ振る */}
      <g
        className={isPlaying ? 'animate-teaser-feather' : ''}
        style={{ transformOrigin: '40px 27px' }}
        data-testid="teaser-feather-group"
      >
        {/* 接続部の鈴 */}
        <circle cx="40" cy="27" r="3.5" className="fill-amber-400 stroke-amber-600" strokeWidth="1" />

        {/* ふわふわの羽根群（3色で華やか） */}
        {/* 中央のピンクの羽根 */}
        <path
          d="M 40 27 C 30 18 10 16 6 22 C 16 28 32 30 40 27 Z"
          className="fill-rose-400 stroke-rose-500"
          strokeWidth="1"
        />
        {/* 上向きのイエローの羽根 */}
        <path
          d="M 40 27 C 32 12 18 6 12 10 C 18 20 30 25 40 27 Z"
          className="fill-amber-300 stroke-amber-400"
          strokeWidth="1"
        />
        {/* 下向きのミントグリーンの羽根 */}
        <path
          d="M 40 27 C 28 26 12 34 10 40 C 22 38 34 32 40 27 Z"
          className="fill-emerald-400 stroke-emerald-500"
          strokeWidth="1"
        />
        {/* ふわふわの毛並みテクスチャ */}
        <path d="M 22 21 L 28 24 M 20 27 L 27 28 M 24 16 L 30 21" className="stroke-white/70 stroke-[1]" />
      </g>
    </g>
  </svg>
);

/**
 * 毛糸ボール（コロコロボール）のイラストSVG
 */
const BallToySvg: React.FC<{ isPlaying?: boolean }> = ({ isPlaying }) => (
  <svg
    viewBox="0 0 110 70"
    className={`w-24 sm:w-28 h-auto drop-shadow-md select-none ${
      isPlaying ? 'animate-bounce' : ''
    }`}
    aria-hidden="true"
    data-testid="ball-toy-svg"
  >
    {/* 床の影 */}
    <ellipse cx="50" cy="62" rx="35" ry="6" className="fill-stone-400/30" />
    <ellipse cx="85" cy="62" rx="15" ry="3" className="fill-stone-400/20" />

    {/* ほどけた毛糸のライン（床を這う毛糸） */}
    <path
      d="M 58 56 Q 72 64 88 58 T 104 60"
      className="fill-none stroke-emerald-500 stroke-[2.5]"
      strokeLinecap="round"
    />

    {/* 毛糸玉本体 */}
    <circle cx="48" cy="42" r="20" className="fill-emerald-500 stroke-emerald-600" strokeWidth="1.5" />

    {/* 毛糸の編み目・巻き筋パターン */}
    <path
      d="M 32 38 C 40 30 56 30 64 38"
      className="fill-none stroke-emerald-300 stroke-[2]"
      strokeLinecap="round"
    />
    <path
      d="M 30 46 C 40 54 58 54 66 44"
      className="fill-none stroke-emerald-300 stroke-[2]"
      strokeLinecap="round"
    />
    <path
      d="M 40 24 C 36 34 38 52 46 61"
      className="fill-none stroke-teal-300 stroke-[2]"
      strokeLinecap="round"
    />
    <path
      d="M 52 23 C 58 32 58 50 52 61"
      className="fill-none stroke-teal-200 stroke-[2]"
      strokeLinecap="round"
    />

    {/* ハイライト */}
    <ellipse cx="42" cy="34" rx="4" ry="2" className="fill-white/60" />
  </svg>
);

/**
 * レーザーポインター（照射器と赤い光点）のイラストSVG
 */
const LaserToySvg: React.FC<{ isPlaying?: boolean }> = ({ isPlaying }) => (
  <svg
    viewBox="0 0 130 70"
    className="w-28 sm:w-32 h-auto drop-shadow-md select-none overflow-visible"
    aria-hidden="true"
    data-testid="laser-toy-svg"
  >
    {/* 床の影 */}
    <ellipse cx="40" cy="62" rx="20" ry="5" className="fill-stone-400/30" />
    <ellipse cx="102" cy="58" rx="22" ry="4" className="fill-stone-400/20" />

    {/* レーザー照射機構全体（手元 95px 35px を軸に左右に光を振る） */}
    <g
      className={isPlaying ? 'animate-laser-sweep' : ''}
      style={{ transformOrigin: '95px 35px' }}
      data-testid="laser-aim-group"
    >
      {/* ポインターからの赤い光線ガイドライン（照射ビーム） */}
      <line
        x1="79"
        y1="39"
        x2="38"
        y2="52"
        className="stroke-rose-500/25 stroke-[2.5]"
      />
      <line
        x1="79"
        y1="39"
        x2="38"
        y2="52"
        className={`stroke-rose-400/70 stroke-[1.5] stroke-dasharray-[3,3] ${
          isPlaying ? 'animate-laser-beam' : ''
        }`}
      />

      {/* 赤いレーザー光点（床の上に輝く赤いスポット） */}
      <g
        transform="translate(38, 52)"
        className={isPlaying ? 'animate-laser-dot-pulse' : ''}
        data-testid="laser-dot-group"
      >
        {/* 光の拡散オーラ */}
        <circle
          cx="0"
          cy="0"
          r={isPlaying ? '16' : '12'}
          className="fill-rose-500/25 animate-ping"
        />
        <circle cx="0" cy="0" r="10" className="fill-rose-500/40" />
        {/* 核心の鮮やかな赤い光点 */}
        <circle cx="0" cy="0" r="5" className="fill-rose-600" />
        <circle cx="0" cy="0" r="2.5" className="fill-white" />
      </g>

      {/* レーザーポインター本体（シルバー＆ブラックのペン型） */}
      <g transform="rotate(-20 95 35)">
        {/* メタリックボディ */}
        <rect
          x="80"
          y="28"
          width="38"
          height="10"
          rx="3"
          className="fill-slate-700 stroke-slate-800"
          strokeWidth="1"
        />
        {/* メタリックキャップ */}
        <rect
          x="76"
          y="29"
          width="6"
          height="8"
          rx="1.5"
          className="fill-slate-300 stroke-slate-500"
          strokeWidth="0.8"
        />
        {/* ボタン（赤い照射ボタン） */}
        <rect x="92" y="26" width="6" height="3" rx="1" className="fill-rose-500 animate-pulse" />
        {/* クリップ */}
        <rect x="106" y="27" width="10" height="2" className="fill-slate-400" />
      </g>
    </g>
  </svg>
);

/**
 * 遊び時に画面上（猫の足元・手前）に表示するおもちゃイラストコンポーネント
 */
export const ToyItemView: React.FC<ToyItemViewProps> = ({
  toy,
  isPlaying = false,
  className = '',
}) => {
  return (
    <div
      data-testid="toy-item-container"
      className={`relative inline-flex flex-col items-center justify-center transition-all duration-300 animate-in fade-in zoom-in-90 ${className}`}
    >
      {/* 遊び中のワクワクパーティクル（星・ハート・きらめきが左右にゆらゆら昇る演出） */}
      {isPlaying && (
        <div
          data-testid="playing-particles"
          className="absolute -top-3 inset-x-0 flex items-center justify-center pointer-events-none z-30 overflow-visible"
          aria-hidden="true"
        >
          {/* 左側のきらめき */}
          <div
            className="absolute pointer-events-none animate-eating-rise"
            style={{
              left: 'calc(50% - 24px)',
              top: '0px',
              animationDelay: '0ms',
            }}
          >
            <div
              className="animate-eating-sway-left"
              style={{ animationDelay: '0ms' }}
            >
              <Sparkles className="w-4 h-4 text-amber-400 drop-shadow-md" />
            </div>
          </div>

          {/* 中央のハート */}
          <div
            className="absolute pointer-events-none animate-eating-rise"
            style={{
              left: 'calc(50% - 2px)',
              top: '-4px',
              animationDelay: '400ms',
            }}
          >
            <div
              className="animate-eating-sway-right"
              style={{ animationDelay: '400ms' }}
            >
              <Heart className="w-4 h-4 fill-rose-400 text-rose-500 drop-shadow-md" />
            </div>
          </div>

          {/* 右側の星 */}
          <div
            className="absolute pointer-events-none animate-eating-rise"
            style={{
              left: 'calc(50% + 20px)',
              top: '2px',
              animationDelay: '800ms',
            }}
          >
            <div
              className="animate-eating-sway-left"
              style={{ animationDelay: '800ms' }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400 drop-shadow-md" />
            </div>
          </div>
        </div>
      )}

      {/* おもちゃの種類に応じたSVGイラスト */}
      <div className="transition-transform duration-200">
        {toy.id === 'teaser' && <TeaserToySvg isPlaying={isPlaying} />}
        {toy.id === 'ball' && <BallToySvg isPlaying={isPlaying} />}
        {toy.id === 'laser' && <LaserToySvg isPlaying={isPlaying} />}
      </div>

      {/* おもちゃの名前ミニバッジ */}
      <div className="mt-0.5 px-2 py-0.5 rounded-full bg-white/95 border border-amber-200/90 shadow-2xs text-[10px] font-bold text-stone-700 flex items-center gap-1 select-none">
        <span>{toy.name}</span>
        {isPlaying && (
          <span className="text-amber-600 font-extrabold text-[9px] animate-pulse">
            あそび中…♪
          </span>
        )}
      </div>
    </div>
  );
};
