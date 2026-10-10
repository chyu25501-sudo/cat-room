import React from 'react';

export interface CatShapeProps {
  isReacting?: boolean;
}

export const WhiteCat: React.FC<CatShapeProps> = ({ isReacting = false }) => {
  return (
    <svg
      viewBox="0 0 250 180"
      className="w-64 h-52 sm:w-72 sm:h-60 drop-shadow-xl transition-all duration-300"
      aria-hidden="true"
      data-testid="white-cat-svg"
    >
      {/* 地面の影 */}
      <ellipse
        cx="128"
        cy="158"
        rx="96"
        ry="11"
        className={`transition-all duration-300 ${
          isReacting ? 'fill-orange-300/40 scale-110' : 'fill-stone-300/60'
        }`}
      />

      {/* 音声再生・反応時の床の波紋エフェクト */}
      {isReacting && (
        <ellipse
          cx="128"
          cy="158"
          rx="108"
          ry="14"
          className="fill-orange-400/20 animate-ping"
        />
      )}

      {/* しっぽ（ごろんと寝転びながら、上へ優雅にカール） */}
      <path
        d="M 195 138 C 228 135 244 105 238 72 C 232 50 210 55 216 75 C 222 95 210 118 178 126 Z"
        className={`fill-white stroke-stone-300/90 transition-transform duration-300 origin-[195px_138px] ${
          isReacting ? 'rotate-6' : 'group-hover:rotate-3'
        }`}
        strokeWidth="2"
      />

      {/* 胴体（床にごろんと寝転がったリラックスシルエット） */}
      <path
        d="
          M 66 90
          C 60 72 85 64 125 64
          C 165 64 195 76 212 106
          C 220 122 215 142 196 148
          C 168 155 98 155 74 148
          C 54 142 50 118 66 90
          Z"
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* 後ろ足・お尻の丸みライン */}
      <path
        d="M 158 100 C 185 100 205 115 204 135 C 202 148 182 150 162 146"
        className="fill-white stroke-stone-300/90"
        strokeWidth="1.8"
      />

      {/* 前足（前方にちょこんと伸ばしたリラックスポーズ） */}
      <path
        d="M 70 134 L 40 140 C 34 141 32 148 38 150 C 44 152 66 152 80 148 Z"
        className="fill-stone-50 stroke-stone-300/90"
        strokeWidth="1.8"
      />
      <path
        d="M 80 128 L 52 134 C 46 135 44 142 50 144 C 56 146 76 146 88 142 Z"
        className="fill-stone-50 stroke-stone-300/90"
        strokeWidth="1.8"
      />

      {/* 頭部と耳（少し首をかしげてこちらを見上げる寝転がりポーズ） */}
      <path
        d="
          M 75 62
          C 68 58 50 58 42 62
          C 34 50 22 32 14 20
          C 18 38 24 54 28 66
          C 18 76 18 94 28 106
          C 38 118 72 120 84 108
          C 92 98 92 78 86 68
          C 90 56 96 38 100 20
          C 92 30 78 50 75 62
          Z"
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* 耳の内側（やさしいピンク） */}
      <path d="M 24 38 L 36 64 L 26 59 Z" className="fill-rose-200/90" />
      <path d="M 90 38 L 78 64 L 88 59 Z" className="fill-rose-200/90" />

      {/* ひげ */}
      <g
        stroke="#78716c"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="transition-opacity duration-200"
      >
        {/* 左のひげ */}
        <line x1="26" y1="86" x2="2" y2="82" />
        <line x1="24" y1="92" x2="0" y2="93" />
        <line x1="26" y1="98" x2="4" y2="103" />
        {/* 右のひげ */}
        <line x1="84" y1="86" x2="108" y2="82" />
        <line x1="86" y1="92" x2="110" y2="93" />
        <line x1="84" y1="98" x2="106" y2="103" />
      </g>

      {/* 目（通常時は心地よくうとうとする糸目、反応時はにっこり目 ^ ^） */}
      {isReacting ? (
        <g stroke="#fbbf24" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 38 88 Q 47 78 56 88" />
          <path d="M 66 88 Q 75 78 84 88" />
        </g>
      ) : (
        <g stroke="#57534e" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M 38 86 Q 46 92 54 86" />
          <path d="M 64 86 Q 72 92 80 86" />
        </g>
      )}

      {/* ほっぺのほんのり赤らみ（反応時） */}
      {isReacting && (
        <g fill="#f43f5e" opacity="0.4">
          <circle cx="32" cy="98" r="7" />
          <circle cx="90" cy="98" r="7" />
        </g>
      )}

      {/* 鼻 */}
      <polygon points="60,98 56,93 64,93" className="fill-rose-400" />
    </svg>
  );
};

