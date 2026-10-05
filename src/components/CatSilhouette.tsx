import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export interface CatSilhouetteProps {
  /** 猫が反応中（鳴き声再生中・タップ直後）かどうか */
  isReacting?: boolean;
  /** 猫を直接クリック/タップしたときのコールバック */
  onClick?: () => void;
  /** 追加クラス名 */
  className?: string;
}

export const CatSilhouette: React.FC<CatSilhouetteProps> = ({
  isReacting = false,
  onClick,
  className = '',
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* クリック可能な猫シルエット本体 */}
      <button
        type="button"
        onClick={onClick}
        aria-label="猫のシルエット（タップしてふれあう）"
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
          <svg
            viewBox="0 0 210 240"
            className="w-56 h-64 sm:w-64 sm:h-72 drop-shadow-xl transition-all duration-300"
            aria-hidden="true"
          >
            {/* 地面の影 */}
            <ellipse
              cx="105"
              cy="226"
              rx="74"
              ry="9"
              className={`transition-all duration-300 ${
                isReacting
                  ? 'fill-orange-300/40 scale-110'
                  : 'fill-stone-300/60'
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
                isReacting
                  ? 'rotate-6'
                  : 'group-hover:rotate-3'
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

            {/* 頭部と耳（尖った三角耳と丸い輪郭） */}
            <path
              d="
                M 74 68
                C 60 68 48 48 42 24
                C 56 32 76 48 86 54
                C 92 52 118 52 124 54
                C 134 48 154 32 168 24
                C 162 48 150 68 136 68
                C 148 80 150 104 140 118
                C 130 130 80 130 70 118
                C 60 104 62 80 74 68
                Z"
              className="fill-stone-800"
            />

            {/* 耳の内側のニュアンス */}
            <path
              d="M 52 38 L 76 56 L 62 65 Z"
              className="fill-orange-900/30"
            />
            <path
              d="M 158 38 L 134 56 L 148 65 Z"
              className="fill-orange-900/30"
            />

            {/* ひげ */}
            <g
              stroke="#57534e"
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-opacity duration-200"
            >
              {/* 左のひげ */}
              <line x1="62" y1="96" x2="26" y2="90" />
              <line x1="60" y1="102" x2="22" y2="104" />
              <line x1="62" y1="108" x2="28" y2="116" />
              {/* 右のひげ */}
              <line x1="148" y1="96" x2="184" y2="90" />
              <line x1="150" y1="102" x2="188" y2="104" />
              <line x1="148" y1="108" x2="182" y2="116" />
            </g>

            {/* 目（通常時は穏やかな糸目、反応時はにっこり目 ^ ^） */}
            {isReacting ? (
              <g
                stroke="#fbbf24"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 80 94 Q 89 84 98 94" />
                <path d="M 112 94 Q 121 84 130 94" />
              </g>
            ) : (
              <g
                stroke="#a8a29e"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 82 92 Q 89 97 96 92" />
                <path d="M 114 92 Q 121 97 128 92" />
              </g>
            )}

            {/* ほっぺのほんのり赤らみ（反応時） */}
            {isReacting && (
              <g fill="#f43f5e" opacity="0.35">
                <circle cx="72" cy="104" r="7" />
                <circle cx="138" cy="104" r="7" />
              </g>
            )}

            {/* 鼻 */}
            <polygon points="105,103 101,98 109,98" className="fill-rose-400" />
          </svg>
        </div>

        {/* 足元のインタラクションガイドバッジ */}
        <div className="mt-3 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/60 text-stone-600 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xs group-hover:bg-orange-200/80 group-hover:text-orange-900 transition-colors">
          <span>タップ（クリック）してふれあう</span>
        </div>
      </button>
    </div>
  );
};

