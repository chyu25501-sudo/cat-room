import React from 'react';
import { CatMoodLevel } from '../../types/mood.ts';
import { CatShapeProps } from './BlackCat.tsx';

/**
 * 3種類目の猫「みけねこ（calico）」コンポーネント
 * 横向きに立ち、顔は右側（正面向き）、しっぽは左側にある姿勢。
 * 少し短めの足と愛らしいプロポーションを持ち、首筋から前足前面へ自然に繋がっています。
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
        className={`transition-transform duration-300 origin-[56px_124px] ${
          isReacting ? 'rotate-8' : isEcstatic ? 'rotate-6' : isAnnoyed ? '-rotate-6' : 'group-hover:rotate-4'
        }`}
      >
        {/* しっぽ本体（白ベース） */}
        <path
          d="M 56 124 C 34 116 20 90 28 60 C 32 46 46 48 44 62 C 38 84 48 102 64 114 Z"
          className="fill-white stroke-stone-300/90"
          strokeWidth="1.8"
        />
        {/* しっぽの茶色パッチ */}
        <path
          d="M 29 74 C 28 64 31 56 36 52 C 41 48 45 51 44 62 C 41 74 38 80 36 84 Z"
          className="fill-amber-600"
        />
        {/* しっぽ先端の黒パッチ */}
        <path
          d="M 30 62 C 31 52 36 48 40 49 C 43 51 44 56 43 61 C 40 64 35 64 30 62 Z"
          className="fill-stone-800"
        />
      </g>

      {/* ===== 奥側の足（左後ろ足・左前足：少し短めの愛らしい立ち姿） ===== */}
      {/* 左後ろ足（奥側：胴体内部から自然に生えている立ち姿） */}
      <path
        d="M 64 132 C 60 152 61 170 63 190 C 68 191 75 191 76 190 C 76 170 75 152 74 132 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />
      {/* 左前足（奥側） */}
      <path
        d="M 166 136 C 164 154 165 174 166 189 C 171 190 178 190 179 189 C 178 174 176 154 174 136 Z"
        className="fill-stone-100 stroke-stone-300/80"
        strokeWidth="1.5"
      />

      {/* ===== 胴体・首筋・右前足（シームレスに一体化した輪郭線） ===== */}
      {/* 体・首筋・背中が下側に少し下りて短めの愛らしい足になり、右前足の真上に体がしっかり乗っています */}
      <path
        d="
          M 56 124
          C 50 104 68 92 95 94
          C 125 96 152 94 174 84
          C 186 82 198 84 206 90
          C 214 100 216 116 208 130
          C 204 138 202 150 201 162
          C 200 174 200 184 201 192
          C 195 193 189 193 184 192
          C 184 182 184 168 183 156
          C 182 146 176 146 166 152
          C 142 154 114 154 84 154
          C 66 152 54 142 56 124 Z
        "
        className="fill-white stroke-stone-300/90"
        strokeWidth="2"
      />

      {/* ===== 手前側の足（右後ろ足：下地白塗り） ===== */}
      {/* 奥の左後ろ足を自然に隠す白塗り（ストロークなしで横線を描画しない） */}
      <path
        d="
          M 75 132
          C 70 142 72 156 74 172
          C 74 182 76 190 77 192
          C 84 193 92 193 93 192
          C 93 184 92 172 90 158
          C 95 148 96 138 94 132 Z
        "
        className="fill-white"
      />

      {/* 胴体の三毛模様（茶色・オレンジのパッチ：背中中央） */}
      <path
        d="
          M 90 94
          C 105 92 128 93 142 97
          C 148 105 144 119 136 125
          C 120 129 102 123 94 113
          C 88 103 86 97 90 94 Z
        "
        className="fill-amber-600"
      />

      {/* 胴体の三毛模様（黒のパッチ：お尻・腰付近） */}
      <path
        d="
          M 56 124
          C 54 108 64 98 78 96
          C 84 102 86 112 82 122
          C 76 132 64 134 56 124 Z
        "
        className="fill-stone-800"
      />

      {/* 胴体の三毛模様（小さな茶色パッチ：お腹側） */}
      <ellipse cx="146" cy="146" rx="9" ry="6" className="fill-amber-600" />

      {/* ===== 手前側の足の輪郭線・ディテール（余計な横線を描画せず自然に表現） ===== */}
      {/* 1. 右後ろ足の輪郭線（上端の横線は描かず、お尻側〜かかと〜足先の自然なラインのみ描画） */}
      <path
        d="
          M 75 134
          C 71 144 72 156 74 172
          C 74 182 76 190 77 192
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
          M 94 138
          C 95 148 93 166 93 192
        "
        className="stroke-stone-300/90"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 右後ろ足の爪先ディテール */}
      <path d="M 83 188 L 83 192 M 88 188 L 88 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* 右前足の爪先ディテール */}
      <path d="M 189 188 L 189 192 M 195 188 L 195 192" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />

      {/* ===== 頭部と耳（正面向き：下側へ自然に連動し短めの足と愛らしく調和） ===== */}
      <g
        transform="translate(202, 80) scale(1.14) translate(-186, -74)"
        className={`transition-transform duration-300 origin-[202px_80px] ${
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
