import React from 'react';

/**
 * 「きれいな小石」のSVGイラストアイコン
 * 説明:「どこかで見つけてきた、つるつると丸くてきれいな小石。」
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
      <linearGradient id="pebbleGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="35%" stopColor="#94A3B8" />
        <stop offset="85%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="pebbleShine" x1="14" y1="10" x2="28" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="15" ry="4" fill="#000000" fillOpacity="0.12" />
    <path
      d="M14 17C17 10 30 8 36 14C42 20 43 29 37 36C31 42 18 41 12 35C6 29 11 23 14 17Z"
      fill="url(#pebbleGrad)"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 16C19 12 28 11 32 15C34 18 31 22 26 21C20 20 14 20 16 16Z"
      fill="url(#pebbleShine)"
    />
    <circle cx="20" cy="15" r="1.5" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="28" cy="17" r="1" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

/**
 * 「ふわふわの羽根」のSVGイラストアイコン
 * 説明:「日向で見つけてくわえてきた、やわらかく軽やかな羽根。」
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
      <linearGradient id="featherSoftGrad" x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#F8FAFC" />
        <stop offset="75%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="featherShaftGrad" x1="8" y1="42" x2="38" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="60%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <ellipse cx="23" cy="40" rx="14" ry="3.5" fill="#000000" fillOpacity="0.08" />
    <path
      d="M11 36C10 31 11 24 17 18C23 12 31 8 38 7C35 13 31 19 28 25C25 31 19 35 11 36Z"
      fill="url(#featherSoftGrad)"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M11 36C17 36 23 33 28 27C33 21 36 14 38 7C38 11 36 16 33 21L30 20L32 24C29 28 25 31 20 33L18 32L17 36H11Z"
      fill="#F8FAFC"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M7 42C12 38 23 25 39 6"
      stroke="url(#featherShaftGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M21 23L16 21" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M26 18L20 15" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 13L25 11" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 「まるいどんぐり」のSVGイラストアイコン
 * 説明:「森の木陰で見つけてきた、つやつやと丸い秋のどんぐり。」
 */
export const AcornIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="acorn-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="acornBodyGrad" x1="15" y1="18" x2="33" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="acornCapGrad" x1="12" y1="10" x2="36" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A16207" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="10" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* どんぐりの丸い実 */}
    <path
      d="M13 21C13 29 18 39 24 41C30 39 35 29 35 21C35 18 13 18 13 21Z"
      fill="url(#acornBodyGrad)"
      stroke="#78350F"
      strokeWidth="1.5"
    />
    {/* つややかなハイライト */}
    <ellipse cx="19" cy="27" rx="3" ry="6" transform="rotate(-15 19 27)" fill="#FFFFFF" fillOpacity="0.35" />
    {/* どんぐりの帽子（殻斗） */}
    <path
      d="M11 19C11 13 17 11 24 11C31 11 37 13 37 19C37 21 11 21 11 19Z"
      fill="url(#acornCapGrad)"
      stroke="#451A03"
      strokeWidth="1.5"
    />
    {/* 帽子の網目模様 */}
    <path d="M16 19C17 14 20 12 24 12C28 12 31 14 32 19" stroke="#78350F" strokeWidth="1" strokeDasharray="2 2" />
    {/* どんぐりの軸 */}
    <path d="M24 11V6C24 5 26 4 28 5" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * 「ほそい小枝」のSVGイラストアイコン
 * 説明:「お庭の植え込みから折ってくわえてきた、香りのいい小枝。」
 */
export const TwigIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="twig-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="leafGrad" x1="20" y1="12" x2="38" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    {/* 小枝のメイン軸 */}
    <path
      d="M10 39C16 33 24 24 36 9"
      stroke="#854D0E"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* 枝分かれ */}
    <path
      d="M22 26C26 23 29 24 33 21"
      stroke="#854D0E"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* 若葉1（先端） */}
    <path
      d="M36 9C38 5 43 7 41 12C39 15 36 13 36 9Z"
      fill="url(#leafGrad)"
      stroke="#15803D"
      strokeWidth="1"
    />
    {/* 若葉2（枝分かれ先） */}
    <path
      d="M33 21C37 18 41 21 38 25C35 27 33 24 33 21Z"
      fill="url(#leafGrad)"
      stroke="#15803D"
      strokeWidth="1"
    />
    {/* 若葉3（中央付近） */}
    <path
      d="M20 28C16 26 17 21 21 22C24 23 23 27 20 28Z"
      fill="url(#leafGrad)"
      stroke="#15803D"
      strokeWidth="1"
    />
  </svg>
);

/**
 * 「ちいさな貝殻」のSVGイラストアイコン
 * 説明:「どこかで見つけてきた、うっすらピンク色のかわいい貝殻。」
 */
export const SeashellIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="seashell-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="shellGrad" x1="12" y1="12" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="50%" stopColor="#FBCFE8" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    {/* 貝殻の扇形フォルム */}
    <path
      d="M24 38L18 36C12 30 10 21 14 14C18 9 30 9 34 14C38 21 36 30 30 36L24 38Z"
      fill="url(#shellGrad)"
      stroke="#DB2777"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 放射状の貝殻の筋（リブ） */}
    <path d="M24 38V10" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 38C22 28 17 19 16 13" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 38C26 28 31 19 32 13" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 38C20 30 13 24 11 18" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M24 38C28 30 35 24 37 18" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
    {/* パールの輝きハイライト */}
    <circle cx="21" cy="14" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/**
 * 「あかい落ち葉」のSVGイラストアイコン
 * 説明:「ひらひらと風に舞っていた、鮮やかな赤色のもみじの葉。」
 */
export const FallenLeafIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="fallen-leaf-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mapleGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="35%" stopColor="#F97316" />
        <stop offset="85%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="13" ry="3" fill="#000000" fillOpacity="0.1" />
    {/* もみじの葉の輪郭 */}
    <path
      d="M24 8L27 15L35 12L32 19L40 21L33 26L36 33L29 31L26 39L24 35L22 39L19 31L12 33L15 26L8 21L16 19L13 12L21 15L24 8Z"
      fill="url(#mapleGrad)"
      stroke="#991B1B"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 葉脈 */}
    <path d="M24 35V14" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 25L32 18" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M24 25L16 18" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M24 29L33 26" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
    <path d="M24 29L15 26" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
    {/* 葉柄 */}
    <path d="M24 35L25 43" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 「おおきな松ぼっくり」のSVGイラストアイコン
 * 説明:「公園の松の木の下で見つけた、笠の開いた立派な松ぼっくり。」
 */
export const PineconeIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="pinecone-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="coneGrad" x1="14" y1="12" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A16207" />
        <stop offset="60%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="11" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* 松ぼっくりの本体たまご形シルエット */}
    <path
      d="M24 9C17 15 13 25 14 34C15 39 21 42 24 42C27 42 33 39 34 34C35 25 31 15 24 9Z"
      fill="url(#coneGrad)"
      stroke="#451A03"
      strokeWidth="1.5"
    />
    {/* 重なる笠（スケール）の波模様 */}
    <path d="M18 18C21 21 27 21 30 18" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 24C19 28 29 28 33 24" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 30C19 34 29 34 33 30" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 36C21 39 27 39 30 36" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    {/* 先端の小さな軸 */}
    <path d="M24 9V6" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 「みどりのクローバー」のSVGイラストアイコン
 * 説明:「草むらの中から摘んできた、青々とした四つ葉のクローバー。」
 */
export const CloverIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="clover-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cloverGrad" x1="12" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="12" ry="3" fill="#000000" fillOpacity="0.1" />
    {/* 四つ葉の4枚のハート（上・下・左・右） */}
    {/* 上葉 */}
    <path
      d="M24 24C22 17 15 13 18 8C21 4 24 9 24 12C24 9 27 4 30 8C33 13 26 17 24 24Z"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 下葉 */}
    <path
      d="M24 24C22 31 15 35 18 40C21 44 24 39 24 36C24 39 27 44 30 40C33 35 26 31 24 24Z"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 左葉 */}
    <path
      d="M24 24C17 22 13 15 8 18C4 21 9 24 12 24C9 24 4 27 8 30C13 33 17 26 24 24Z"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 右葉 */}
    <path
      d="M24 24C31 22 35 15 40 18C44 21 39 24 36 24C39 24 44 27 40 30C35 33 31 26 24 24Z"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 茎 */}
    <path
      d="M24 24C23 32 26 40 33 44"
      stroke="#15803D"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* 中央の小さなきらめき */}
    <circle cx="24" cy="24" r="1.5" fill="#DCFCE7" />
  </svg>
);

/**
 * 「ながいリボン」のSVGイラストアイコン
 * 説明:「部屋のすみに落ちていた、さらさらと光沢のある細長いリボン。」
 */
export const RibbonIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="ribbon-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ribbonGrad" x1="10" y1="12" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    {/* くるりとカールするリボンのループ */}
    <path
      d="M14 18C10 13 13 7 19 8C24 9 24 16 19 22L11 38"
      stroke="url(#ribbonGrad)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M34 18C38 13 35 7 29 8C24 9 24 16 29 22L37 38"
      stroke="url(#ribbonGrad)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* リボンの結び目 */}
    <circle cx="24" cy="18" r="4.5" fill="#BE185D" stroke="#9D174D" strokeWidth="1.5" />
    {/* リボンのツヤ光沢 */}
    <circle cx="23" cy="17" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

/**
 * 「ひかるボタン」のSVGイラストアイコン
 * 説明:「床のすみに転がっていた、光を受けてきらりと輝く小さなボタン。」
 */
export const ButtonIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="button-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="buttonGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000000" fillOpacity="0.12" />
    {/* ボタンの外枠円 */}
    <circle cx="24" cy="24" r="17" fill="url(#buttonGrad)" stroke="#075985" strokeWidth="2" />
    {/* ボタンの内側の窪みリム */}
    <circle cx="24" cy="24" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
    {/* 4つの糸通し穴 */}
    <circle cx="20" cy="20" r="1.8" fill="#0C4A6E" />
    <circle cx="28" cy="20" r="1.8" fill="#0C4A6E" />
    <circle cx="20" cy="28" r="1.8" fill="#0C4A6E" />
    <circle cx="28" cy="28" r="1.8" fill="#0C4A6E" />
    {/* きらりと光るスパークル光沢 */}
    <path
      d="M17 14L18.5 17.5L22 19L18.5 20.5L17 24L15.5 20.5L12 19L15.5 17.5L17 14Z"
      fill="#FFFFFF"
      fillOpacity="0.9"
    />
  </svg>
);

/**
 * 「ふしぎな古銭」のSVGイラストアイコン（レア）
 * 説明:「どこかの古い蔵や床下で見つけてきたのか、不思議な文字が刻まれた丸い古銭。」
 */
export const OldCoinIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="old-coin-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="coinBronzeGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="35%" stopColor="#D97706" />
        <stop offset="70%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="coinGoldShine" x1="12" y1="10" x2="36" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.14" />
    {/* 古銭の外枠円盤 */}
    <circle cx="24" cy="24" r="18" fill="url(#coinBronzeGrad)" stroke="#78350F" strokeWidth="2" />
    {/* 古銭の外周リング縁取り */}
    <circle cx="24" cy="24" r="15.5" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
    {/* 中央の正方形の穴（方孔） */}
    <rect x="18" y="18" width="12" height="12" rx="1" fill="#78350F" stroke="#FDE68A" strokeWidth="1.2" />
    {/* 古代の四文字レリーフ（上下左右） */}
    <path d="M21 12H27M24 10V15" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 33H27M24 33V37" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 21V27M10 24H15" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M36 21V27M33 24H38" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />
    {/* アンティークな光沢ハイライト */}
    <path d="M11 18C13 13 18 10 24 9" stroke="url(#coinGoldShine)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="15" cy="14" r="1.5" fill="#FFFBEB" />
  </svg>
);

/**
 * 「なないろの羽根」のSVGイラストアイコン（レア）
 * 説明:「光に透かすと虹色にきらめく、伝説の鳥が落としていったような奇跡の羽根。」
 */
export const RainbowFeatherIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="rainbow-feather-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rainbowGrad" x1="10" y1="38" x2="38" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="20%" stopColor="#8B5CF6" />
        <stop offset="40%" stopColor="#3B82F6" />
        <stop offset="60%" stopColor="#10B981" />
        <stop offset="80%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
      <linearGradient id="goldShaft" x1="6" y1="42" x2="40" y2="6" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <ellipse cx="23" cy="40" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    <path
      d="M11 36C10 31 11 24 17 18C23 12 31 8 38 7C35 13 31 19 28 25C25 31 19 35 11 36Z"
      fill="url(#rainbowGrad)"
      stroke="#A855F7"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M11 36C17 36 23 33 28 27C33 21 36 14 38 7C38 11 36 16 33 21L30 20L32 24C29 28 25 31 20 33L18 32L17 36H11Z"
      fill="url(#rainbowGrad)"
      fillOpacity="0.9"
      stroke="#A855F7"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M7 42C12 38 23 25 39 6"
      stroke="url(#goldShaft)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="19" cy="19" r="1.5" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="28" cy="14" r="1.8" fill="#FFFFFF" fillOpacity="0.95" />
    <path
      d="M32 22L33 24L35 25L33 26L32 28L31 26L29 25L31 24L32 22Z"
      fill="#FEF08A"
    />
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
  /** ギフトのID */
  giftId?: string;
  /** 追加クラス名 */
  className?: string;
  /** 獲得済みかどうか（false のときは ? アイコンを描画） */
  isAcquired?: boolean;
}

/**
 * おくりものIDに応じた専用SVGイラストを描画するディスパッチャーコンポーネント
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
    case 'acorn':
      return <AcornIcon className={className} />;
    case 'twig':
      return <TwigIcon className={className} />;
    case 'seashell':
      return <SeashellIcon className={className} />;
    case 'fallen-leaf':
      return <FallenLeafIcon className={className} />;
    case 'pinecone':
      return <PineconeIcon className={className} />;
    case 'clover':
      return <CloverIcon className={className} />;
    case 'ribbon':
      return <RibbonIcon className={className} />;
    case 'button':
      return <ButtonIcon className={className} />;
    case 'old-coin':
      return <OldCoinIcon className={className} />;
    case 'rainbow-feather':
      return <RainbowFeatherIcon className={className} />;
    default:
      return <DefaultGiftIcon className={className} />;
  }
};
