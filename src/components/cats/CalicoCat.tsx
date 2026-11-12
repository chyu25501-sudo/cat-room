import React from 'react';
import { CatMoodLevel } from '../../types/mood.ts';
import { CatShapeProps } from './BlackCat.tsx';

/**
 * 3種類目の猫「みけねこ（calico）」コンポーネント
 * 横向きに立ち、顔はこちら（正面）を向いていて、顔は右側、しっぽは左側にある姿勢。
 * 黒猫・白猫と統一された表情デザイン（優しい線画の目、ピンクの三角鼻、3本のひげ、条件付きチーク）を持ち、
 * 体と首・足の付け根が自然にシームレスに繋がっています。
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
      {/* 左後ろ足（奥側：胴体深部からしっかり生えている自然な立ち姿、離れないよう上部を深くまで延長） */}
      <path
        d="
          M 63 114
          C 60 138 59 166 62 190
          C 67 191 74 191 75 190
          C 77 166 77 138 76 114
          Z
        "
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />
      {/* 左前足（奥側） */}
      <path
        d="M 166 128 C 164 148 165 174 166 189 C 171 190 178 190 179 189 C 178 174 176 148 174 128 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />

      {/* ===== 首と胴体の下地（頭部と胴体を隙間なく完全に連結するネックベース） ===== */}
      <path
        d="
          M 130 90
          C 152 80 174 66 194 64
          C 212 66 224 80 222 100
          C 220 120 204 138 188 142
          C 172 144 156 132 144 116
          C 136 104 132 94 130 90 Z
        "
        className="fill-white"
      />

      {/* ===== 胴体（横向きに立つしなやかな姿勢、首筋へ自然に連続） ===== */}
      <path
        d="
          M 56 116
          C 50 96 68 84 95 86
          C 125 88 152 86 172 74
          C 178 84 186 96 188 114
          C 188 128 186 140 180 144
          C 168 147 156 148 138 146
          C 114 144 98 148 84 146
          C 66 144 54 134 56 116 Z
        "
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
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

      {/* ===== 手前側の足（右後ろ足・右前足） ===== */}
      {/* 右後ろ足（手前側：体の上に余計な横線が出ないよう、お尻・腰から滑らかに一体化） */}
      {/* 1. 白の塗りベース（ストロークなしで胴体と滑らかに融合） */}
      <path
        d="
          M 72 116
          C 70 134 72 154 75 174
          C 75 182 76 191 77 192
          C 84 193 92 193 93 192
          C 93 180 92 164 90 148
          C 96 140 98 130 96 116 Z
        "
        className="fill-white"
      />
      {/* 2. お腹側（前側）の大腿〜足首ライン（体の上に横線は引かず、大腿の前縁のみ描画） */}
      <path
        d="M 96 136 C 94 148 91 168 93 192"
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 3. お尻側（後ろ側）の大腿〜かかとライン */}
      <path
        d="M 70 126 C 70 146 73 170 77 192"
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 4. 右後ろ足の足先ライン */}
      <path
        d="M 77 192 C 83 193 89 193 93 192"
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 右後ろ足の爪先ディテール */}
      <path d="M 83 188 L 83 192 M 88 188 L 88 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* 右前足（手前側：胸元からすっと伸びる立ち姿） */}
      <path
        d="
          M 178 124
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

      {/* ===== 胸元・首元のふんわりした白毛（顔が右へ移動しても胴体と頭部をシームレスに一体化） ===== */}
      <path
        d="
          M 172 76
          C 170 92 174 110 182 126
          C 190 136 198 136 200 122
          C 198 106 194 92 192 78 Z
        "
        className="fill-white"
      />

      {/* ===== 頭部と耳（正面向き：右側へ少し移動し立ち姿のバランスを最適化） ===== */}
      <g
        transform="translate(196, 75) scale(1.14) translate(-186, -75)"
        className={`transition-transform duration-300 origin-[196px_75px] ${
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
