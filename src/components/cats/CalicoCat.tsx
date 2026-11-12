import React from 'react';
import { CatMoodLevel } from '../../types/mood.ts';
import { CatShapeProps } from './BlackCat.tsx';

/**
 * 3種類目の猫「みけねこ（calico）」コンポーネント
 * 横向きに立ち、顔は右側（正面向き）、しっぽは左側にある姿勢。
 * 首筋のカーブは右上（顔・喉元）から左下（胸元）へ自然な丸みを帯びて前足へ一体化し、
 * 右前足・右後ろ足ともに付け根の余計な横線を描画せずシームレスな立ち姿を実現しています。
 * 表情は黒猫・白猫と統一されたデザイン（線画の目、ピンクの三角鼻、3本のひげ、条件付きチーク）です。
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
        className={`transition-transform duration-300 origin-[56px_116px] ${
          isReacting ? 'rotate-8' : isEcstatic ? 'rotate-6' : isAnnoyed ? '-rotate-6' : 'group-hover:rotate-4'
        }`}
      >
        {/* しっぽ本体（白ベース） */}
        <path
          d="M 56 116 C 34 108 20 82 28 52 C 32 38 46 40 44 54 C 38 76 48 94 64 106 Z"
          className="fill-white stroke-stone-300/90"
          strokeWidth="1.8"
        />
        {/* しっぽの茶色パッチ */}
        <path
          d="M 29 66 C 28 56 31 48 36 44 C 41 40 45 43 44 54 C 41 66 38 72 36 76 Z"
          className="fill-amber-600"
        />
        {/* しっぽ先端の黒パッチ */}
        <path
          d="M 30 54 C 31 44 36 40 40 41 C 43 43 44 48 43 53 C 40 56 35 56 30 54 Z"
          className="fill-stone-800"
        />
      </g>

      {/* ===== 奥側の足（左後ろ足・左前足：少し暗めで立体感を表現） ===== */}
      {/* 左後ろ足（奥側：胴体内部から自然に生えている立ち姿） */}
      <path
        d="M 64 124 C 60 146 61 168 63 190 C 68 191 75 191 76 190 C 76 168 75 146 74 124 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />
      {/* 左前足（奥側） */}
      <path
        d="M 166 128 C 164 148 165 174 166 189 C 171 190 178 190 179 189 C 178 174 176 148 174 128 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />

      {/* ===== 胴体・首筋・右前足（シームレスに一体化した輪郭線） ===== */}
      {/* 首筋は右上（顔・喉元）から胸元へ自然な丸みを帯びて前足前面へ一体化し、付け根の横線を描画しません */}
      <path
        d="
          M 56 116
          C 50 96 68 84 95 86
          C 125 88 152 86 174 76
          C 184 72 194 74 200 82
          C 204 96 182 114 176 126
          C 174 138 175 154 176 174
          C 176 182 177 191 178 192
          C 185 193 193 193 194 192
          C 194 180 193 162 191 144
          C 189 136 178 138 162 146
          C 138 146 114 146 84 146
          C 66 144 54 134 56 116 Z
        "
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* ===== 手前側の足（右後ろ足：下地白塗り） ===== */}
      {/* 奥の左後ろ足を自然に隠す白塗り（ストロークなしで横線を描画しない） */}
      <path
        d="
          M 75 124
          C 70 134 72 150 74 168
          C 74 180 76 190 77 192
          C 84 193 92 193 93 192
          C 93 182 92 168 90 152
          C 95 142 96 132 94 124 Z
        "
        className="fill-white"
      />

      {/* 胴体の三毛模様（茶色・オレンジのパッチ：背中中央） */}
      <path
        d="
          M 90 86
          C 105 84 128 85 142 89
          C 148 97 144 111 136 117
          C 120 121 102 115 94 105
          C 88 95 86 89 90 86 Z
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
      <ellipse cx="146" cy="138" rx="9" ry="6" className="fill-amber-600" />

      {/* ===== 手前側の足の輪郭線・ディテール（余計な横線を描画せず自然に表現） ===== */}
      {/* 1. 右後ろ足の輪郭線（上端の横線は描かず、お尻側〜かかと〜足先の自然なラインのみ描画） */}
      <path
        d="
          M 75 126
          C 71 138 72 150 74 168
          C 74 180 76 190 77 192
          C 84 193 92 193 93 192
        "
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 2. 右後ろ足の大腿部前縁（お腹側の自然なカーブ） */}
      <path
        d="
          M 94 130
          C 95 142 93 162 93 192
        "
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 右後ろ足の爪先ディテール */}
      <path d="M 83 188 L 83 192 M 88 188 L 88 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* 右前足の爪先ディテール */}
      <path d="M 183 188 L 183 192 M 189 188 L 189 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* ===== 頭部と耳（正面向き：右側に位置し、首筋は右上から左下へと滑らかに繋がる） ===== */}
      <g
        transform="translate(202, 72) scale(1.14) translate(-186, -74)"
        className={`transition-transform duration-300 origin-[202px_72px] ${
          isReacting ? 'scale-105' : isHappy ? 'scale-102' : ''
        }`}
      >
        {/* 頭部と耳のシームレスな輪郭（白猫・黒猫の耳・顔立ちとプロポーションを統一） */}
        <path
          d="
            M 186 52
            C 178 48 168 48 162 52
            C 156 46 148 38 144 32
            C 142 28 138 28 137 32
            C 136 37 140 46 144 56
            C 136 66 138 84 148 96
            C 158 106 182 108 196 98
            C 204 88 206 70 200 60
            C 204 48 208 39 207 34
            C 206 30 202 30 200 34
            C 196 40 192 48 189 54
            Z
          "
          className="fill-white stroke-stone-300/90"
          strokeWidth="2"
          transform="translate(14, 0)"
        />

        {/* 左耳の内側ピンク（黒猫・白猫と完全同一スタイル） */}
        <path d="M 155 42 L 167 58 L 157 56 Z" className="fill-rose-200/90" transform="translate(14, 0)" />
        {/* 右耳の内側ピンク */}
        <path d="M 202 42 L 190 58 L 200 56 Z" className="fill-rose-200/90" transform="translate(14, 0)" />

        {/* 三毛模様：左耳・左頭頂部の黒パッチ */}
        <path
          d="
            M 176 52
            C 170 46 162 38 158 32
            C 156 28 152 28 151 32
            C 150 37 154 46 158 56
            C 150 66 152 76 156 82
            C 166 76 172 64 176 52 Z
          "
          className="fill-stone-800"
        />

        {/* 三毛模様：右耳・右頭頂部の茶色パッチ */}
        <path
          d="
            M 196 52
            C 202 46 210 38 214 32
            C 216 28 220 28 221 32
            C 222 37 218 46 214 56
            C 222 66 220 76 216 82
            C 206 76 200 64 196 52 Z
          "
          className="fill-amber-600"
        />

        {/* ===== 顔パーツ（黒猫・白猫と完全にそろえたデザイン） ===== */}

        {/* 目（黒猫・白猫と同じスタイリッシュな線画スタイル） */}
        {isAnnoyed ? (
          // 不機嫌（annoyed）：吊り上がった鋭いジト目（黒猫・白猫と完全に同構造）
          <g stroke="#f87171" strokeWidth="2.6" strokeLinecap="round" fill="none">
            {/* 左目 */}
            <path d="M 172 75 Q 177 69 182 72" />
            <path d="M 173 75 L 181 73" />
            {/* 右目 */}
            <path d="M 190 72 Q 195 69 200 75" />
            <path d="M 191 73 L 199 75" />
          </g>
        ) : isReacting || isEcstatic ? (
          // 反応時・大喜び（isReacting || isEcstatic）：上向きアーチのにっこり目 ^ ^
          <g stroke={isEcstatic ? '#f59e0b' : '#fbbf24'} strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 172 73 Q 177 63 182 73" />
            <path d="M 190 73 Q 195 63 200 73" />
          </g>
        ) : isHappy ? (
          // ごきげん（isHappy）：にっこり目
          <g stroke="#78716c" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M 172 72 Q 177 67 182 72" />
            <path d="M 190 72 Q 195 67 200 72" />
          </g>
        ) : (
          // 通常（normal）：下向きアーチの落ち着いた優しい目（黒猫・白猫と完全に同構造）
          <g stroke="#57534e" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M 172 72 Q 177 77 182 72" />
            <path d="M 190 72 Q 195 77 200 72" />
          </g>
        )}

        {/* ほっぺのほんのり赤らみ（黒猫・白猫と完全に同構造：平常〜ごきげん時のみ表示、不機嫌時は非表示） */}
        {!isAnnoyed && (isReacting || isEcstatic || isHappy) && (
          <g fill="#f43f5e" opacity={isReacting ? 0.45 : isEcstatic ? 0.35 : 0.2}>
            <circle cx="169" cy="80" r={isEcstatic ? 7 : 6} />
            <circle cx="203" cy="80" r={isEcstatic ? 7 : 6} />
          </g>
        )}

        {/* 鼻（黒猫・白猫と完全に同構造のピンク逆三角形） */}
        <polygon points="186,83 182,78 190,78" className="fill-rose-400" />

        {/* ひげ（黒猫・白猫と完全にそろえた左右3本ずつのすっきりした直線） */}
        <g
          stroke="#78716c"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="transition-opacity duration-200"
        >
          {/* 左のひげ */}
          <line x1="168" y1="76" x2="148" y2="72" />
          <line x1="166" y1="81" x2="144" y2="81" />
          <line x1="168" y1="86" x2="148" y2="90" />
          {/* 右のひげ */}
          <line x1="204" y1="76" x2="224" y2="72" />
          <line x1="206" y1="81" x2="228" y2="81" />
          <line x1="204" y1="86" x2="224" y2="90" />
        </g>
      </g>
    </svg>
  );
};
