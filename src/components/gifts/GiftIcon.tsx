import React from 'react';

/**
 * 「きれいな小石」のSVGイラストアイコン
 * 説明:「どこかで見つけてきた、つるつると丸くてきれいな小石。」に合わせ、
 * 滑らかな丸みと、光を受けてつるつると光沢を放つ立体的な色合い・ハイライトを描画
 */
export const PebbleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="pebble-icon"
    aria-hidden="true"
  >
    <defs>
      {/* つるつるの滑らかな丸みを表現するソフトなストーングラデーション */}
      <linearGradient id="pebbleGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="35%" stopColor="#94A3B8" />
        <stop offset="85%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>

      {/* 小石表面のなめらかな光沢ハイライト */}
      <linearGradient id="pebbleShine" x1="14" y1="10" x2="28" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* 接地面のやわらかな影 */}
    <ellipse cx="24" cy="40" rx="15" ry="4" fill="#000000" fillOpacity="0.12" />

    {/* メインのつるつるした丸い小石のフォルム */}
    <path
      d="M14 17C17 10 30 8 36 14C42 20 43 29 37 36C31 42 18 41 12 35C6 29 11 23 14 17Z"
      fill="url(#pebbleGrad)"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* 表面の光沢ハイライト（つるつるした光の反射） */}
    <path
      d="M16 16C19 12 28 11 32 15C34 18 31 22 26 21C20 20 14 20 16 16Z"
      fill="url(#pebbleShine)"
    />

    {/* 太陽の光を浴びた小さなきらめき */}
    <circle cx="20" cy="15" r="1.5" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="28" cy="17" r="1" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

/**
 * 「ふわふわの羽根」のSVGイラストアイコン
 * 説明:「日向で見つけてくわえてきた、やわらかく軽やかな羽根。」に合わせ、
 * 軽やかな曲線、日向の温かみを感じるオフホワイト〜ペールスカイ・アンバーの色彩、柔らかな毛並みを描画
 */
export const FeatherIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="feather-icon"
    aria-hidden="true"
  >
    <defs>
      {/* 日向の光を浴びた軽やかで柔らかい羽毛のグラデーション */}
      <linearGradient id="featherSoftGrad" x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#F8FAFC" />
        <stop offset="75%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>

      {/* 琥珀色・温かみのある羽軸 */}
      <linearGradient id="featherShaftGrad" x1="8" y1="42" x2="38" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="60%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    {/* 羽根のやわらかな影 */}
    <ellipse cx="23" cy="40" rx="14" ry="3.5" fill="#000000" fillOpacity="0.08" />

    {/* ふわふわの羽毛本体（左側） */}
    <path
      d="M11 36C10 31 11 24 17 18C23 12 31 8 38 7C35 13 31 19 28 25C25 31 19 35 11 36Z"
      fill="url(#featherSoftGrad)"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* ふわふわの羽毛本体（右側・繊細な切れ込み入り） */}
    <path
      d="M11 36C17 36 23 33 28 27C33 21 36 14 38 7C38 11 36 16 33 21L30 20L32 24C29 28 25 31 20 33L18 32L17 36H11Z"
      fill="#F8FAFC"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* 中央のしなやかな羽軸（クイル/ラキス） */}
    <path
      d="M7 42C12 38 23 25 39 6"
      stroke="url(#featherShaftGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* 柔らかな羽毛の筋目ライン（微細な立体テクスチャ） */}
    <path d="M21 23L16 21" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M26 18L20 15" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 13L25 11" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M25 25L29 27" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M29 20L34 22" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 未獲得（未発見）のおくりもの用プレースホルダーアイコン
 */
export const UnknownGiftIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="unknown-gift-icon"
    aria-hidden="true"
  >
    <rect x="8" y="8" width="32" height="32" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fill="#94A3B8"
      fontSize="20"
      fontWeight="900"
      fontFamily="sans-serif"
    >
      ?
    </text>
  </svg>
);

/**
 * 汎用フォールバック用ギフトアイコン
 */
export const DefaultGiftIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="default-gift-icon"
    aria-hidden="true"
  >
    <rect x="8" y="16" width="32" height="24" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
    <rect x="6" y="10" width="36" height="8" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
    <line x1="24" y1="10" x2="24" y2="40" stroke="#EF4444" strokeWidth="3" />
  </svg>
);

export interface GiftIconProps {
  /** ギフトのID（'pebble' | 'feather' など） */
  giftId?: string;
  /** 追加クラス名 */
  className?: string;
  /** 獲得済みかどうか（false のときは ? アイコンを描画） */
  isAcquired?: boolean;
}

/**
 * おくりものIDに応じた専用SVGイラストを描画するディスパッチャーコンポーネント
 * 今後新しいおくりものが追加された場合も、switchにcaseを追加するだけで拡張可能
 */
export const GiftIcon: React.FC<GiftIconProps> = ({
  giftId,
  className = 'w-8 h-8',
  isAcquired = true,
}) => {
  if (!isAcquired) {
    return <UnknownGiftIcon className={className} />;
  }

  switch (giftId) {
    case 'pebble':
      return <PebbleIcon className={className} />;
    case 'feather':
      return <FeatherIcon className={className} />;
    default:
      return <DefaultGiftIcon className={className} />;
  }
};
