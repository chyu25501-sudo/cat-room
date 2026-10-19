import React from 'react';
import { CatMoodLevel } from '../../types/mood.ts';

export interface CatShapeProps {
  isReacting?: boolean;
  moodLevel?: CatMoodLevel;
}

export const WhiteCat: React.FC<CatShapeProps> = ({
  isReacting = false,
  moodLevel = 'normal',
}) => {
  const isEcstatic = moodLevel === 'ecstatic';
  const isHappy = moodLevel === 'happy';
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

      {/* 胴体と香箱座りの前足（一体化したシームレスな輪郭線） */}
      <path
        d="
          M 66 90
          C 60 72 85 64 125 64
          C 165 64 195 76 212 106
          C 220 122 215 142 196 148
          C 168 152 90 152 62 150
          C 48 149 44 138 46 128
          C 48 116 56 104 66 90
          Z"
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* 香箱座りの前足の折り込みディテール（fill="none"で不要な黒塗りを防止） */}
      <path
        d="M 46 132 C 54 138 70 140 84 135"
        className="stroke-stone-300/90"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 64 136 C 64 142 66 148 70 150"
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 頭部と耳（短めで少し丸みのある愛らしい耳） */}
      <path
        d="
          M 75 62
          C 68 58 50 58 42 62
          C 36 56 30 48 26 42
          C 24 38 20 38 19 42
          C 18 47 22 56 26 66
          C 18 76 18 94 28 106
          C 38 118 72 120 84 108
          C 92 98 92 78 86 68
          C 90 56 94 47 93 42
          C 92 38 88 38 86 42
          C 82 48 78 56 75 62
          Z"
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* 耳の内側（やさしいピンク：耳に美しく収まる適度なサイズ） */}
      <path d="M 23 44 L 35 60 L 25 58 Z" className="fill-rose-200/90" />
      <path d="M 88 44 L 76 60 L 86 58 Z" className="fill-rose-200/90" />

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

      {/* 目（反応時またはごきげんMAX時はにっこり目 ^ ^） */}
      {isReacting || isEcstatic ? (
        <g stroke={isEcstatic ? '#f59e0b' : '#fbbf24'} strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 38 88 Q 47 78 56 88" />
          <path d="M 66 88 Q 75 78 84 88" />
        </g>
      ) : isHappy ? (
        <g stroke="#78716c" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M 38 87 Q 46 82 54 87" />
          <path d="M 64 87 Q 72 82 80 87" />
        </g>
      ) : (
        <g stroke="#57534e" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M 38 86 Q 46 92 54 86" />
          <path d="M 64 86 Q 72 92 80 86" />
        </g>
      )}

      {/* ほっぺのほんのり赤らみ（反応時またはごきげん時） */}
      {(isReacting || isEcstatic || isHappy) && (
        <g fill="#f43f5e" opacity={isReacting ? 0.45 : isEcstatic ? 0.35 : 0.2}>
          <circle cx="34" cy="98" r={isEcstatic ? 7 : 6} />
          <circle cx="78" cy="98" r={isEcstatic ? 7 : 6} />
        </g>
      )}

      {/* 鼻 */}
      <polygon points="60,98 56,93 64,93" className="fill-rose-400" />
    </svg>
  );
};

