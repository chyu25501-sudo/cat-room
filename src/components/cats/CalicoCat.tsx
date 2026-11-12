import React from 'react';
import { CatMoodLevel } from '../../types/mood.ts';
import { CatShapeProps } from './BlackCat.tsx';

/**
 * 3種類目の猫「みけねこ（calico）」コンポーネント
 * 横向きに立ち、顔はこちら（正面）を向いていて、顔は右側、しっぽは左側にある姿勢。
 * 白ベースに茶色（オレンジ系）と黒の美しい三毛ぶち模様を持ちます。
 */
export const CalicoCat: React.FC<CatShapeProps> = ({
  isReacting = false,
  moodLevel = 'normal',
}) => {
  const isEcstatic = moodLevel === 'ecstatic';
  const isHappy = moodLevel === 'happy';
  const isAnnoyed = moodLevel === 'annoyed';

  return (
    <svg
      viewBox="0 0 260 210"
      className="w-64 h-52 sm:w-72 sm:h-60 drop-shadow-xl transition-all duration-300"
      aria-hidden="true"
      data-testid="calico-cat-svg"
    >
      {/* ===== 地面の影 ===== */}
      <ellipse
        cx="130"
        cy="192"
        rx="96"
        ry="11"
        className={`transition-all duration-300 ${
          isReacting ? 'fill-orange-300/40 scale-110' : 'fill-stone-300/60'
        }`}
      />

      {/* 音声再生・反応時の床の波紋エフェクト */}
      {isReacting && (
        <ellipse
          cx="130"
          cy="192"
          rx="108"
          ry="14"
          className="fill-orange-400/20 animate-ping"
        />
      )}

      {/* ===== しっぽ（左側でお尻から上へ優雅にカール） ===== */}
      <g
        className={`transition-transform duration-300 origin-[54px_118px] ${
          isReacting ? 'rotate-8' : isEcstatic ? 'rotate-6' : isAnnoyed ? '-rotate-6' : 'group-hover:rotate-4'
        }`}
      >
        {/* しっぽ本体（白ベース） */}
        <path
          d="M 54 118 C 32 110 18 84 26 54 C 30 40 44 42 42 56 C 36 78 46 96 62 108 Z"
          className="fill-white stroke-stone-300/90"
          strokeWidth="1.5"
        />
        {/* しっぽの茶色パッチ */}
        <path
          d="M 27 68 C 26 58 29 50 34 46 C 39 42 43 45 42 56 C 39 68 36 74 34 78 Z"
          className="fill-amber-600"
        />
        {/* しっぽ先端の黒パッチ */}
        <path
          d="M 28 56 C 29 46 34 42 38 43 C 41 45 42 50 41 55 C 38 58 33 58 28 56 Z"
          className="fill-stone-800"
        />
      </g>

      {/* ===== 奥側の足（左後ろ足・左前足：少し暗めで立体感を表現） ===== */}
      {/* 左後ろ足（奥側） */}
      <path
        d="M 64 142 C 60 160 62 178 63 190 C 68 191 75 191 76 190 C 76 178 74 158 72 142 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />
      {/* 左前足（奥側） */}
      <path
        d="M 166 136 C 164 152 165 174 166 189 C 171 190 178 190 179 189 C 178 174 176 150 174 136 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />

      {/* ===== 胴体（横向きに立つ姿勢） ===== */}
      <path
        d="
          M 56 116
          C 50 96 68 84 95 86
          C 125 88 152 92 176 102
          C 186 112 188 126 186 142
          C 174 146 160 148 140 146
          C 116 144 98 148 84 146
          C 66 144 54 134 56 116 Z
        "
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* 胴体の三毛模様（茶色・オレンジのパッチ：背中中央） */}
      <path
        d="
          M 90 86
          C 105 84 128 86 142 90
          C 148 98 144 112 136 118
          C 120 122 102 116 94 106
          C 88 96 86 90 90 86 Z
        "
        className="fill-amber-600"
      />

      {/* 胴体の三毛模様（黒のパッチ：お尻・腰付近） */}
      <path
        d="
          M 56 116
          C 54 100 64 90 78 88
          C 84 94 86 104 82 114
          C 76 124 64 126 56 116 Z
        "
        className="fill-stone-800"
      />

      {/* 胴体の三毛模様（小さな茶色パッチ：お腹側） */}
      <ellipse cx="148" cy="138" rx="10" ry="7" className="fill-amber-600" />

      {/* ===== 手前側の足（右後ろ足・右前足） ===== */}
      {/* 右後ろ足（手前側：しっかりした大腿部から伸びる立ち姿） */}
      <path
        d="
          M 78 124
          C 70 134 72 150 74 168
          C 74 180 76 190 77 192
          C 84 193 92 193 93 192
          C 93 182 92 168 90 152
          C 96 144 98 134 94 124 Z
        "
        className="fill-white stroke-stone-300/90"
        strokeWidth="1.5"
      />
      {/* 右後ろ足の爪先ディテール */}
      <path d="M 83 188 L 83 192 M 88 188 L 88 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* 右前足（手前側：胸元からすっと伸びる立ち姿） */}
      <path
        d="
          M 178 122
          C 174 136 175 154 176 174
          C 176 182 177 191 178 192
          C 185 193 193 193 194 192
          C 194 180 193 162 191 144
          C 192 136 190 128 186 122 Z
        "
        className="fill-white stroke-stone-300/90"
        strokeWidth="1.5"
      />
      {/* 右前足の爪先ディテール */}
      <path d="M 183 188 L 183 192 M 189 188 L 189 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* ===== 胸元のふんわりした白毛 ===== */}
      <path
        d="M 172 108 C 182 114 186 124 184 136 C 176 138 168 136 166 128 Z"
        className="fill-white"
      />

      {/* ===== 頭部（右側に位置し、顔はこちら正面を向いている！） ===== */}
      <g
        className={`transition-transform duration-300 origin-[188px_82px] ${
          isReacting ? 'scale-105' : isHappy ? 'scale-102' : ''
        }`}
      >
        {/* 耳（左耳・奥側：黒パッチ） */}
        <path
          d="M 166 66 L 158 38 C 168 40 180 48 182 58 Z"
          className="fill-stone-800 stroke-stone-300/80"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 左耳の内側ピンク */}
        <path d="M 167 62 L 163 45 C 169 47 176 52 177 58 Z" className="fill-rose-300/70" />

        {/* 耳（右耳・手前側：茶色パッチ） */}
        <path
          d="M 198 56 C 204 46 216 38 224 38 L 218 66 Z"
          className="fill-amber-600 stroke-stone-300/80"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 右耳の内側ピンク */}
        <path d="M 203 58 C 208 51 216 46 220 45 L 215 62 Z" className="fill-rose-300/70" />

        {/* 顔の輪郭（正面向きのまんまるヘッド） */}
        <ellipse
          cx="190"
          cy="80"
          rx="27"
          ry="23"
          className="fill-white stroke-stone-300/90"
          strokeWidth="2"
        />

        {/* 顔の三毛ぶち模様：左上の黒パッチ */}
        <path
          d="M 166 70 C 165 58 174 58 182 60 C 178 72 172 78 166 70 Z"
          className="fill-stone-800"
        />

        {/* 顔の三毛ぶち模様：右上の茶色パッチ */}
        <path
          d="M 214 70 C 215 58 206 58 198 60 C 202 72 208 78 214 70 Z"
          className="fill-amber-600"
        />

        {/* ===== 表情パーツ ===== */}
        {/* ほんのりピンクのチーク（両頬） */}
        <ellipse cx="174" cy="85" rx="5" ry="3" className="fill-rose-300/40" />
        <ellipse cx="206" cy="85" rx="5" ry="3" className="fill-rose-300/40" />

        {/* 目（moodLevelに応じた表情変化） */}
        {isAnnoyed ? (
          // 不機嫌（annoyed）：キッとしたつり目
          <g stroke="#292524" strokeWidth="2.5" strokeLinecap="round">
            <line x1="174" y1="78" x2="182" y2="74" />
            <line x1="206" y1="78" x2="198" y2="74" />
          </g>
        ) : isEcstatic ? (
          // 大喜び（ecstatic）：目を細めて嬉しそうな笑顔アーチ
          <g stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 174 76 Q 179 70 184 76" />
            <path d="M 196 76 Q 201 70 206 76" />
          </g>
        ) : isHappy ? (
          // ごきげん（happy）：にっこり目
          <g stroke="#292524" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M 174 76 Q 179 72 184 76" />
            <path d="M 196 76 Q 201 72 206 76" />
          </g>
        ) : (
          // 通常（normal）：こちらをじっと見つめるクリクリの丸い瞳
          <g>
            {/* 左目 */}
            <ellipse cx="179" cy="76" rx="3.5" ry="4.5" className="fill-stone-900" />
            <circle cx="177.5" cy="74.5" r="1.3" className="fill-white" />
            {/* 右目 */}
            <ellipse cx="201" cy="76" rx="3.5" ry="4.5" className="fill-stone-900" />
            <circle cx="199.5" cy="74.5" r="1.3" className="fill-white" />
          </g>
        )}

        {/* 鼻（小さなピンクの逆三角形） */}
        <polygon points="188,83 192,83 190,86" className="fill-rose-400" />

        {/* 口（ωの形をしたかわいい口元） */}
        <path
          d="M 186 88 Q 190 91 190 87 Q 190 91 194 88"
          stroke="#78716c"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ひげ（左側2本、右側2本） */}
        <g stroke="#a8a29e" strokeWidth="1" strokeLinecap="round">
          {/* 左ひげ */}
          <line x1="168" y1="84" x2="154" y2="81" />
          <line x1="168" y1="87" x2="152" y2="88" />
          {/* 右ひげ */}
          <line x1="212" y1="84" x2="226" y2="81" />
          <line x1="212" y1="87" x2="228" y2="88" />
        </g>
      </g>
    </svg>
  );
};
