import React from 'react';

/**
 * カリカリ（ドライフード）のSVGイラストアイコン
 * 温かみのあるオレンジボウルに盛られた香ばしいカリカリ粒
 */
export const KibbleFoodIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="food-icon-kibble"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="kibbleBowlGrad" x1="10" y1="20" x2="38" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="60%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="kibbleInnerGrad" x1="12" y1="16" x2="36" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFEDD5" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
      <linearGradient id="kibbleFoodMound" x1="16" y1="12" x2="32" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9A3412" />
        <stop offset="50%" stopColor="#7C2D12" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    {/* 床の影 */}
    <ellipse cx="24" cy="42" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />

    {/* フードボウル本体（陶器風の丸い器） */}
    <path
      d="M 8 23 C 8 37 40 37 40 23 L 38 20 C 38 16 10 16 10 20 Z"
      fill="url(#kibbleBowlGrad)"
      stroke="#9A3412"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 器の内側 */}
    <ellipse cx="24" cy="20" rx="15" ry="5.5" fill="url(#kibbleInnerGrad)" stroke="#FB923C" strokeWidth="1" />

    {/* 器の側面の光沢ハイライト */}
    <path
      d="M 12 28 C 18 34 30 34 36 28"
      stroke="#FFFFFF"
      strokeOpacity="0.55"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* 器の肉球マーク */}
    <g fill="#FFFFFF" fillOpacity="0.85" transform="translate(24, 29) scale(0.55)">
      <ellipse cx="0" cy="1.5" rx="3.5" ry="2.8" />
      <circle cx="-3.8" cy="-2.5" r="1.3" />
      <circle cx="-1.3" cy="-4.2" r="1.3" />
      <circle cx="1.3" cy="-4.2" r="1.3" />
      <circle cx="3.8" cy="-2.5" r="1.3" />
    </g>

    {/* 盛られたカリカリの山 */}
    <ellipse cx="24" cy="18" rx="12" ry="4.5" fill="url(#kibbleFoodMound)" />

    {/* 個別のカリカリ粒（丸や三角のドライフード） */}
    <circle cx="19" cy="17" r="1.8" fill="#D97706" />
    <circle cx="24" cy="15.5" r="2" fill="#B45309" />
    <circle cx="29" cy="16.5" r="1.8" fill="#92400E" />
    <circle cx="21.5" cy="13.5" r="1.9" fill="#F59E0B" />
    <circle cx="26.5" cy="13" r="1.9" fill="#D97706" />
    <circle cx="24" cy="10.5" r="1.8" fill="#FBBF24" />
    <circle cx="16.5" cy="18" r="1.5" fill="#78350F" />
    <circle cx="31.5" cy="18" r="1.5" fill="#92400E" />

    {/* キラッと光るハイライト */}
    <path
      d="M 33 9 L 34 11 L 36 12 L 34 13 L 33 15 L 32 13 L 30 12 L 32 11 Z"
      fill="#FDE047"
      fillOpacity="0.9"
    />
  </svg>
);

/**
 * ねこ缶（まぐろ）のSVGイラストアイコン
 * 爽やかなマリンブルーラベルの開いた缶詰とジューシーなまぐろ身
 */
export const CannedFoodIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="food-icon-canned"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cannedBodyGrad" x1="10" y1="20" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="cannedMetalRim" x1="10" y1="16" x2="38" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="cannedMeatGrad" x1="16" y1="18" x2="32" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="60%" stopColor="#BE123C" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    {/* 床の影 */}
    <ellipse cx="24" cy="41" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />

    {/* 缶胴体 */}
    <path
      d="M 10 23 L 10 35 C 10 39.5 38 39.5 38 35 L 38 23 Z"
      fill="url(#cannedBodyGrad)"
      stroke="#0369A1"
      strokeWidth="1.5"
    />
    {/* 缶底リム */}
    <ellipse cx="24" cy="35" rx="14" ry="4" fill="none" stroke="#CBD5E1" strokeWidth="1" />

    {/* 缶のラベルお魚マーク */}
    <g fill="#FFFFFF" fillOpacity="0.85" transform="translate(24, 30) scale(0.65)">
      <path d="M -7 0 C -3 -4 3 -4 7 0 C 3 4 -3 4 -7 0 Z" />
      <polygon points="7,0 11,-3.5 11,3.5" />
      <circle cx="-3.5" cy="-0.5" r="0.8" fill="#0284C7" />
    </g>

    {/* 缶上部金属リム */}
    <ellipse cx="24" cy="23" rx="14" ry="4.5" fill="url(#cannedMetalRim)" stroke="#64748B" strokeWidth="1.2" />

    {/* 缶の中のジューシーなマグロウェットフード */}
    <ellipse cx="24" cy="22.5" rx="12" ry="3.8" fill="url(#cannedMeatGrad)" />
    {/* ほぐし身テクスチャ */}
    <path
      d="M 16 22 Q 20 20.5 24 22 T 32 21"
      stroke="#FDA4AF"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="21" cy="21.5" r="1.2" fill="#FFE4E6" />
    <circle cx="27" cy="23" r="1" fill="#FFE4E6" />

    {/* 開いた缶のフタ（後ろに跳ね上がっている） */}
    <g transform="translate(24, 15) rotate(-22)">
      <ellipse cx="0" cy="0" rx="12" ry="3.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
      {/* プルタブリング */}
      <circle cx="0" cy="0" r="2.2" fill="none" stroke="#94A3B8" strokeWidth="1" />
      <path d="M 0 -2.2 L 0 -4.5" stroke="#94A3B8" strokeWidth="1" />
    </g>

    {/* キラッと光るハイライト */}
    <circle cx="34" cy="18" r="1.2" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/**
 * おやつピューレ（チュール風スティックパウチ）のSVGイラストアイコン
 * かわいいピンクパウチからとろっと絞り出されたなめらかピューレ
 */
export const TreatPureeIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="food-icon-treat"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="treatPouchGrad" x1="12" y1="42" x2="32" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="50%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#FB7185" />
      </linearGradient>
      <linearGradient id="treatPasteGrad" x1="28" y1="12" x2="38" y2="6" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* 床の影 */}
    <ellipse cx="23" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.12" />

    {/* スティックパウチ袋本体（斜めに配置） */}
    <g transform="translate(20, 28) rotate(-35)">
      {/* パウチ下部・中間 */}
      <rect
        x="-6"
        y="-14"
        width="12"
        height="26"
        rx="3"
        fill="url(#treatPouchGrad)"
        stroke="#BE123C"
        strokeWidth="1.2"
      />
      {/* パウチの密封ギザギザライン（底） */}
      <line x1="-5" y1="10" x2="5" y2="10" stroke="#BE123C" strokeWidth="1" strokeDasharray="1.5 1.5" />

      {/* パウチの装飾ストライプ */}
      <path d="M -5 -4 L 5 -8 M -5 2 L 5 -2 M -5 8 L 5 4" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />

      {/* パウチ中央のハートマーク */}
      <path
        d="M 0 -2 C -1.5 -4 -4 -3.5 -4 -1.5 C -4 0.5 0 3 0 3 C 0 3 4 0.5 4 -1.5 C 4 -3.5 1.5 -4 0 -2 Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
    </g>

    {/* 先端から絞り出されたとろとろクリームピューレ */}
    <path
      d="M 28 17 C 29 13 32 10 35 9 C 38 8 40 10 39 12 C 38 14 34 16 31 18 Z"
      fill="url(#treatPasteGrad)"
      stroke="#D97706"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* ピューレのぷるんとしたハイライト */}
    <ellipse cx="36" cy="10" rx="1.8" ry="1.2" fill="#FFFFFF" fillOpacity="0.85" />
    {/* こぼれ落ちそうなひとしずく */}
    <circle cx="39" cy="15" r="1.5" fill="#FBBF24" />

    {/* きらきらスター */}
    <path
      d="M 13 14 L 14 16 L 16 17 L 14 18 L 13 20 L 12 18 L 10 17 L 12 16 Z"
      fill="#F472B6"
    />
  </svg>
);

/**
 * ねこじゃらし（羽根スティック）のSVGイラストアイコン
 * しなやかなスティックと3色のふわふわ羽根＆鈴
 */
export const TeaserToyIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="toy-icon-teaser"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="teaserFeatherPink" x1="12" y1="12" x2="24" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="teaserFeatherYellow" x1="12" y1="8" x2="22" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="teaserFeatherMint" x1="8" y1="16" x2="20" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* 床の影 */}
    <ellipse cx="28" cy="42" rx="14" ry="3" fill="#000000" fillOpacity="0.12" />

    {/* しなやかなスティック棒（斜め右下へ） */}
    <path
      d="M 42 42 Q 32 30 22 20"
      stroke="#D97706"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* 持ち手グリップ */}
    <path
      d="M 42 42 L 37 36"
      stroke="#475569"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* 接続部の鈴 */}
    <circle cx="21" cy="19" r="3.2" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
    <circle cx="21" cy="20" r="0.8" fill="#78350F" />

    {/* 上向きイエローの羽根 */}
    <path
      d="M 21 19 C 18 10 12 6 8 8 C 10 14 16 17 21 19 Z"
      fill="url(#teaserFeatherYellow)"
      stroke="#D97706"
      strokeWidth="1"
    />
    {/* 中央ピンクの羽根 */}
    <path
      d="M 21 19 C 14 13 6 14 5 18 C 9 22 17 22 21 19 Z"
      fill="url(#teaserFeatherPink)"
      stroke="#BE123C"
      strokeWidth="1"
    />
    {/* 下向きミントグリーンの羽根 */}
    <path
      d="M 21 19 C 14 18 7 24 6 28 C 12 28 18 24 21 19 Z"
      fill="url(#teaserFeatherMint)"
      stroke="#047857"
      strokeWidth="1"
    />

    {/* 羽根のふわふわテクスチャ */}
    <path d="M 12 14 L 16 16 M 10 18 L 14 19 M 11 23 L 15 22" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.8" />

    {/* 音符／きらめきマーク */}
    <path
      d="M 30 11 L 31 13 L 33 14 L 31 15 L 30 17 L 29 15 L 27 14 L 29 13 Z"
      fill="#F59E0B"
    />
  </svg>
);

/**
 * 毛糸ボール（コロコロボール）のSVGイラストアイコン
 * まあるく巻かれたミントグリーンの毛糸玉とほどけた毛糸
 */
export const YarnBallToyIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="toy-icon-ball"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="yarnBallGrad" x1="10" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* 床の影 */}
    <ellipse cx="23" cy="38" rx="14" ry="4" fill="#000000" fillOpacity="0.12" />
    <ellipse cx="37" cy="39" rx="6" ry="2" fill="#000000" fillOpacity="0.08" />

    {/* ほどけた毛糸（床を這うライン） */}
    <path
      d="M 28 34 Q 34 38 40 35 T 45 37"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* 毛糸ボール本体 */}
    <circle cx="22" cy="22" r="14" fill="url(#yarnBallGrad)" stroke="#065F46" strokeWidth="1.5" />

    {/* 巻き重なる毛糸のカーブライン */}
    <path
      d="M 12 16 C 16 12 28 12 32 16"
      stroke="#A7F3D0"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 10 24 C 14 20 30 20 34 24"
      stroke="#047857"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 12 28 C 16 32 28 32 32 28"
      stroke="#064E3B"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 16 12 C 20 16 20 28 16 32"
      stroke="#34D399"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 24 9 C 28 15 28 29 24 35"
      stroke="#A7F3D0"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 28 12 C 32 17 32 27 28 32"
      stroke="#047857"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* 光沢ハイライト */}
    <ellipse cx="17" cy="15" rx="3.5" ry="2" fill="#FFFFFF" fillOpacity="0.45" transform="rotate(-25 17 15)" />
  </svg>
);

/**
 * レーザーポインターのSVGイラストアイコン
 * スタイリッシュなシルバーペン型ポインターと輝く赤いレーザービーム
 */
export const LaserPointerToyIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="toy-icon-laser"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="laserBodyGrad" x1="8" y1="42" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <radialGradient id="laserSpotGrad" cx="37" cy="11" r="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#EF4444" />
        <stop offset="65%" stopColor="#DC2626" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* 床の影 */}
    <ellipse cx="16" cy="41" rx="10" ry="3" fill="#000000" fillOpacity="0.12" />

    {/* ペンシル型ポインター本体（斜め右上向き） */}
    <g transform="translate(14, 30) rotate(-45)">
      {/* メタリックペンシル本体 */}
      <rect
        x="-3"
        y="-14"
        width="6"
        height="24"
        rx="2"
        fill="url(#laserBodyGrad)"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* クリックボタン（赤色） */}
      <rect x="-1.5" y="-6" width="3" height="4" rx="1" fill="#EF4444" />
      {/* 先端の真鍮リング */}
      <rect x="-3" y="-14" width="6" height="3" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
      {/* クリップ */}
      <path d="M 3 -4 L 4 -4 L 4 4 L 3 4" stroke="#64748B" strokeWidth="1" fill="none" />
    </g>

    {/* 赤いレーザー光線（点線・ビーム） */}
    <line
      x1="23"
      y1="21"
      x2="35"
      y2="13"
      stroke="#EF4444"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="2 1.5"
    />

    {/* 壁や床に当たった赤いレーザースポット光彩 */}
    <circle cx="37" cy="11" r="7" fill="url(#laserSpotGrad)" />
    <circle cx="37" cy="11" r="2.2" fill="#FFFFFF" />

    {/* 照射点のキラキラ星彩 */}
    <path
      d="M 37 4 L 38 9 L 43 11 L 38 13 L 37 18 L 36 13 L 31 11 L 36 9 Z"
      fill="#F87171"
      fillOpacity="0.85"
    />
  </svg>
);

export interface CareItemIconProps {
  /** 'food' または 'toy' */
  type: 'food' | 'toy';
  /** アイテムID ('kibble', 'canned', 'treat', 'teaser', 'ball', 'laser') */
  id: string;
  /** 追加クラス名（デフォルト: 'w-7 h-7'） */
  className?: string;
}

/**
 * ごはん・おもちゃの識別子に応じて適切な専用SVGイラストアイコンを描画するコンポーネント
 */
export const CareItemIcon: React.FC<CareItemIconProps> = ({ type, id, className = 'w-7 h-7' }) => {
  if (type === 'food') {
    switch (id) {
      case 'kibble':
        return <KibbleFoodIcon className={className} />;
      case 'canned':
        return <CannedFoodIcon className={className} />;
      case 'treat':
        return <TreatPureeIcon className={className} />;
      default:
        return <KibbleFoodIcon className={className} />;
    }
  } else {
    switch (id) {
      case 'teaser':
        return <TeaserToyIcon className={className} />;
      case 'ball':
        return <YarnBallToyIcon className={className} />;
      case 'laser':
        return <LaserPointerToyIcon className={className} />;
      default:
        return <TeaserToyIcon className={className} />;
    }
  }
};
