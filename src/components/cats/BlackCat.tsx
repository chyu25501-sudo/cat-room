import React from 'react';
import { CatMoodLevel } from '../../types/mood.ts';

export interface CatShapeProps {
  isReacting?: boolean;
  moodLevel?: CatMoodLevel;
}

export const BlackCat: React.FC<CatShapeProps> = ({
  isReacting = false,
  moodLevel = 'normal',
}) => {
  const isEcstatic = moodLevel === 'ecstatic';
  const isHappy = moodLevel === 'happy';

  return (
    <svg
      viewBox="0 0 210 240"
      className="w-56 h-64 sm:w-64 sm:h-72 drop-shadow-xl transition-all duration-300"
      aria-hidden="true"
      data-testid="black-cat-svg"
    >
      {/* 地面の影 */}
      <ellipse
        cx="105"
        cy="226"
        rx="74"
        ry="9"
        className={`transition-all duration-300 ${
          isReacting ? 'fill-orange-300/40 scale-110' : 'fill-stone-300/60'
        }`}
      />

      {/* 音声再生・反応時の床の波紋エフェクト */}
      {isReacting && (
        <ellipse
          cx="105"
          cy="226"
          rx="85"
          ry="12"
          className="fill-orange-400/20 animate-ping"
        />
      )}

      {/* しっぽ（右側に優雅にカーブ） */}
      <path
        d="M 135 195 C 172 200 198 178 194 136 C 190 108 170 114 176 130 C 182 154 165 174 130 180 Z"
        className={`fill-stone-800 transition-transform duration-300 origin-[135px_195px] ${
          isReacting ? 'rotate-6' : isEcstatic ? 'rotate-4' : 'group-hover:rotate-3'
        }`}
      />

      {/* 後ろ足・お尻の丸み（左・右） */}
      <ellipse cx="70" cy="196" rx="28" ry="24" className="fill-stone-800" />
      <ellipse cx="140" cy="196" rx="28" ry="24" className="fill-stone-800" />

      {/* 胴体（座っている猫のしなやかな丸み） */}
      <path
        d="M 76 122 C 68 145 62 178 70 212 C 80 218 130 218 140 212 C 148 178 142 145 134 122 Z"
        className="fill-stone-800"
      />

      {/* 前足（ちょこんと揃えた2本の前足） */}
      <path
        d="M 90 172 L 90 216 C 90 220 95 222 99 222 C 103 222 107 220 107 216 L 107 172 Z"
        className="fill-stone-900"
      />
      <path
        d="M 103 172 L 103 216 C 103 220 108 222 112 222 C 116 222 120 220 120 216 L 120 172 Z"
        className="fill-stone-900"
      />

      {/* 頭部と耳（短めで先端に丸みのある愛らしい耳） */}
      <path
        d="
          M 74 68
          C 64 66 54 50 50 40
          C 48 35 52 34 56 37
          C 64 42 76 50 86 54
          C 92 52 118 52 124 54
          C 134 50 146 42 154 37
          C 158 34 162 35 160 40
          C 156 50 146 66 136 68
          C 148 80 150 104 140 118
          C 130 130 80 130 70 118
          C 60 104 62 80 74 68
          Z"
        className="fill-stone-800"
      />

      {/* 耳の内側のニュアンス */}
      <path d="M 56 42 L 76 56 L 65 64 Z" className="fill-orange-900/30" />
      <path d="M 154 42 L 134 56 L 145 64 Z" className="fill-orange-900/30" />

      {/* ひげ */}
      <g
        stroke="#57534e"
        strokeWidth="2"
        strokeLinecap="round"
        className="transition-opacity duration-200"
      >
        <line x1="62" y1="96" x2="26" y2="90" />
        <line x1="60" y1="102" x2="22" y2="104" />
        <line x1="62" y1="108" x2="28" y2="116" />
        <line x1="148" y1="96" x2="184" y2="90" />
        <line x1="150" y1="102" x2="188" y2="104" />
        <line x1="148" y1="108" x2="182" y2="116" />
      </g>

      {/* 目（反応時またはごきげんMAX時はにっこり目 ^ ^） */}
      {isReacting || isEcstatic ? (
        <g stroke={isEcstatic ? '#f59e0b' : '#fbbf24'} strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 80 94 Q 89 84 98 94" />
          <path d="M 112 94 Q 121 84 130 94" />
        </g>
      ) : isHappy ? (
        <g stroke="#d6d3d1" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M 81 93 Q 89 88 97 93" />
          <path d="M 113 93 Q 121 88 129 93" />
        </g>
      ) : (
        <g stroke="#a8a29e" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M 82 92 Q 89 97 96 92" />
          <path d="M 114 92 Q 121 97 128 92" />
        </g>
      )}

      {/* ほっぺのほんのり赤らみ（反応時またはごきげん時） */}
      {(isReacting || isEcstatic || isHappy) && (
        <g fill="#f43f5e" opacity={isReacting ? 0.45 : isEcstatic ? 0.35 : 0.2}>
          <circle cx="72" cy="104" r={isEcstatic ? 8 : 7} />
          <circle cx="138" cy="104" r={isEcstatic ? 8 : 7} />
        </g>
      )}

      {/* 鼻 */}
      <polygon points="105,103 101,98 109,98" className="fill-rose-400" />
    </svg>
  );
};

