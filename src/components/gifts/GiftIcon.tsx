import React from 'react';
import { GiftRarity } from '../../types/gift.ts';
import { CAT_GIFTS } from '../../utils/catGifts.ts';

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
 * 「みどりのクローバー」のSVGイラストアイコン（三つ葉）
 * 説明:「草むらの中から摘んできた、青々とした三つ葉のクローバー。」
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
    {/* 三つ葉のクローバー（上・左下・右下の3枚のハート型の葉） */}
    {/* 上葉 */}
    <path
      d="M24 23C21 16 14 12 17 7C20.5 2.5 24 7.5 24 11C24 7.5 27.5 2.5 31 7C34 12 27 16 24 23Z"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 左下葉（-120度回転） */}
    <path
      d="M24 23C21 16 14 12 17 7C20.5 2.5 24 7.5 24 11C24 7.5 27.5 2.5 31 7C34 12 27 16 24 23Z"
      transform="rotate(-120 24 23)"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 右下葉（+120度回転） */}
    <path
      d="M24 23C21 16 14 12 17 7C20.5 2.5 24 7.5 24 11C24 7.5 27.5 2.5 31 7C34 12 27 16 24 23Z"
      transform="rotate(120 24 23)"
      fill="url(#cloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 茎 */}
    <path
      d="M24 23C23 31 25 38 31 43"
      stroke="#15803D"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* 中央の小さなきらめき */}
    <circle cx="24" cy="23" r="1.5" fill="#DCFCE7" />
  </svg>
);

/**
 * 「よつばのクローバー」のSVGイラストアイコン（レア・四つ葉）
 * 説明:「草むらの中で奇跡的に見つけた、特別な幸運をもたらす四つ葉のクローバー。」
 */
export const FourLeafCloverIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="four-leaf-clover-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="fourLeafCloverGrad" x1="12" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
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
      fill="url(#fourLeafCloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 下葉 */}
    <path
      d="M24 24C22 31 15 35 18 40C21 44 24 39 24 36C24 39 27 44 30 40C33 35 26 31 24 24Z"
      fill="url(#fourLeafCloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 左葉 */}
    <path
      d="M24 24C17 22 13 15 8 18C4 21 9 24 12 24C9 24 4 27 8 30C13 33 17 26 24 24Z"
      fill="url(#fourLeafCloverGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    {/* 右葉 */}
    <path
      d="M24 24C31 22 35 15 40 18C44 21 39 24 36 24C39 24 44 27 40 30C35 33 31 26 24 24Z"
      fill="url(#fourLeafCloverGrad)"
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
 * 「こけむした小石」のSVGイラストアイコン
 * 説明:「湿った日陰で見つけてきた、うっすらと緑の苔が生えた丸い小石。」
 */
export const MossyPebbleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="mossy-pebble-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mossyStoneGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#CBD5E1" />
        <stop offset="40%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="mossGrad" x1="10" y1="12" x2="30" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="60%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="15" ry="4" fill="#000000" fillOpacity="0.12" />
    <path
      d="M14 17C17 10 30 8 36 14C42 20 43 29 37 36C31 42 18 41 12 35C6 29 11 23 14 17Z"
      fill="url(#mossyStoneGrad)"
      stroke="#475569"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 17C18 12 26 11 30 14C33 17 29 22 25 21C22 20 20 23 18 25C15 26 13 22 16 17Z"
      fill="url(#mossGrad)"
    />
    <path
      d="M28 22C31 21 34 23 35 26C36 29 33 30 30 29C28 28 27 24 28 22Z"
      fill="url(#mossGrad)"
      fillOpacity="0.85"
    />
    <circle cx="21" cy="16" r="1.2" fill="#BBF7D0" />
    <circle cx="26" cy="18" r="1" fill="#BBF7D0" />
    <circle cx="31" cy="25" r="1" fill="#86EFAC" />
    <circle cx="17" cy="21" r="0.8" fill="#86EFAC" />
  </svg>
);

/**
 * 「ふるい切手」のSVGイラストアイコン
 * 説明:「どこかの引き出しの奥から見つけてきた、ギザギザの縁取りがあるレトロな切手。」
 */
export const OldStampIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="old-stamp-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="stampPaperGrad" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    <rect
      x="9"
      y="9"
      width="30"
      height="30"
      rx="1.5"
      fill="url(#stampPaperGrad)"
      stroke="#B45309"
      strokeWidth="2"
      strokeDasharray="3 1.5"
    />
    <rect x="13" y="13" width="22" height="22" rx="1" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    <path d="M15 28C18 23 21 26 24 23C27 20 30 25 33 28H15Z" fill="#B45309" fillOpacity="0.7" />
    <circle cx="24" cy="18" r="2.5" fill="#DC2626" />
    <path d="M22 10C24 14 26 14 28 10" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M26 11C28 15 30 15 32 11" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="30" cy="22" r="5" stroke="#78350F" strokeWidth="1" strokeDasharray="2 1" />
  </svg>
);

/**
 * 「かわいいヘアピン」のSVGイラストアイコン
 * 説明:「お部屋のすみに落ちていた、小さなお花の飾りがついたかわいいヘアピン。」
 */
export const HairpinIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="hairpin-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hairpinGold" x1="10" y1="36" x2="38" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.08" />
    <path
      d="M38 12L12 36C10 38 7 35 9 33L35 9"
      stroke="url(#hairpinGold)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M17 31L32 16"
      stroke="url(#hairpinGold)"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="36" cy="11" r="7" fill="#FBCFE8" stroke="#F472B6" strokeWidth="1.2" />
    <circle cx="36" cy="11" r="5" fill="#F472B6" />
    <circle cx="36" cy="11" r="2.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.8" />
    <circle cx="28" cy="19" r="2.2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
    <circle cx="27.5" cy="18.5" r="0.7" fill="#FFFFFF" />
  </svg>
);

/**
 * 「しおれた野花」のSVGイラストアイコン
 * 説明:「道端から摘んできた、少し首をかしげてしおれた素朴で小さなお花。」
 */
export const WiltedFlowerIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="wilted-flower-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="wiltedPetalGrad" x1="16" y1="14" x2="32" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="12" ry="3" fill="#000000" fillOpacity="0.1" />
    <path
      d="M20 42C21 34 23 26 21 19C20 15 16 16 16 20"
      stroke="#65A30D"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M22 28C26 27 29 31 27 35C24 35 22 31 22 28Z"
      fill="#84CC16"
      stroke="#4D7C0F"
      strokeWidth="1"
    />
    <g transform="translate(15, 20) rotate(45)">
      <circle cx="0" cy="0" r="3" fill="#78350F" />
      <ellipse cx="0" cy="-6" rx="2" ry="4" fill="url(#wiltedPetalGrad)" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="5" cy="-3" rx="2" ry="4" transform="rotate(30 5 -3)" fill="url(#wiltedPetalGrad)" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="-5" cy="-3" rx="2" ry="4" transform="rotate(-30 -5 -3)" fill="url(#wiltedPetalGrad)" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="4" cy="4" rx="2" ry="3.5" transform="rotate(60 4 4)" fill="url(#wiltedPetalGrad)" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="-4" cy="4" rx="2" ry="3.5" transform="rotate(-60 -4 4)" fill="url(#wiltedPetalGrad)" stroke="#B45309" strokeWidth="0.8" />
    </g>
  </svg>
);

/**
 * 「せみのぬけがら」のSVGイラストアイコン
 * 説明:「庭の木の幹にくっついていた、琥珀色に透き通った夏のセミの抜け殻。」
 */
export const CicadaShellIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="cicada-shell-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="amberShellGrad" x1="16" y1="10" x2="32" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="10" ry="3" fill="#000000" fillOpacity="0.12" />
    <path d="M17 18L10 14M17 23L9 22M18 28L11 31" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M31 18L38 14M31 23L39 22M30 28L37 31" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="24" cy="14" rx="8" ry="4" fill="url(#amberShellGrad)" stroke="#78350F" strokeWidth="1.2" />
    <circle cx="17" cy="13" r="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
    <circle cx="31" cy="13" r="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
    <path
      d="M17 17C17 23 18 36 24 38C30 36 31 23 31 17Z"
      fill="url(#amberShellGrad)"
      stroke="#78350F"
      strokeWidth="1.5"
    />
    <path d="M24 16V29" stroke="#FEF3C7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19 28C22 30 26 30 29 28" stroke="#78350F" strokeWidth="1" />
    <path d="M20 32C22 34 26 34 28 32" stroke="#78350F" strokeWidth="1" />
  </svg>
);

/**
 * 「しろいサイコロ」のSVGイラストアイコン
 * 説明:「箱のすき間から転がり出てきた、角の取れたつるつると白いサイコロ。」
 */
export const WhiteDiceIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="white-dice-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="diceTop" x1="12" y1="12" x2="36" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="diceLeft" x1="12" y1="20" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="diceRight" x1="24" y1="20" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.12" />
    <path
      d="M24 10L37 17L24 24L11 17L24 10Z"
      fill="url(#diceTop)"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M11 17L24 24V38L11 31V17Z"
      fill="url(#diceLeft)"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M24 24L37 17V31L24 38V24Z"
      fill="url(#diceRight)"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <ellipse cx="24" cy="17" rx="3" ry="2" fill="#EF4444" />
    <circle cx="16" cy="23" r="1.5" fill="#334155" />
    <circle cx="19" cy="32" r="1.5" fill="#334155" />
    <circle cx="28" cy="23" r="1.5" fill="#334155" />
    <circle cx="31" cy="28" r="1.5" fill="#334155" />
    <circle cx="34" cy="33" r="1.5" fill="#334155" />
  </svg>
);

/**
 * 「きらきらしたおはじき」のSVGイラストアイコン
 * 説明:「光にかざすときらきらと輝く、平たくて丸いガラスのおはじき。」
 */
export const GlassMarbleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="glass-marble-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="marbleGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A5F3FC" />
        <stop offset="35%" stopColor="#38BDF8" />
        <stop offset="70%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="marbleShine" x1="14" y1="12" x2="28" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.12" />
    <circle cx="24" cy="24" r="17" fill="url(#marbleGrad)" stroke="#0284C7" strokeWidth="1.8" />
    <path
      d="M13 22C17 16 27 16 33 22C36 25 33 31 27 31C20 31 16 26 21 21C24 18 29 20 28 24"
      stroke="#FDE047"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    <path
      d="M15 27C18 33 28 33 33 26"
      stroke="#F43F5E"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    <ellipse cx="20" cy="16" rx="5" ry="3" transform="rotate(-25 20 16)" fill="url(#marbleShine)" />
    <path
      d="M32 14L33 16.5L35.5 17.5L33 18.5L32 21L31 18.5L28.5 17.5L31 16.5L32 14Z"
      fill="#FFFFFF"
      fillOpacity="0.95"
    />
  </svg>
);

/**
 * 「よごれたぬいぐるみ」のSVGイラストアイコン
 * 説明:「ずっとくわえて遊んでいたのか、少し土がついて愛着のわく小さなぬいぐるみ。」
 */
export const DirtyPlushIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="dirty-plush-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="plushFur" x1="14" y1="10" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="60%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.12" />
    <circle cx="16" cy="14" r="5" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    <circle cx="16" cy="14" r="2.5" fill="#FDE68A" />
    <circle cx="32" cy="14" r="5" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    <circle cx="32" cy="14" r="2.5" fill="#FDE68A" />
    <ellipse cx="24" cy="32" rx="11" ry="10" fill="url(#plushFur)" stroke="#78350F" strokeWidth="1.5" />
    <circle cx="24" cy="20" r="10" fill="url(#plushFur)" stroke="#78350F" strokeWidth="1.5" />
    <ellipse cx="24" cy="23" rx="4.5" ry="3.5" fill="#FEF3C7" />
    <polygon points="24,21 22,23 26,23" fill="#451A03" />
    <path d="M24 23V25" stroke="#451A03" strokeWidth="1" />
    <circle cx="20" cy="18" r="1.5" fill="#1C1917" />
    <circle cx="28" cy="18" r="1.5" fill="#1C1917" />
    <path d="M21 31H27M24 28V34" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
    <ellipse cx="29" cy="33" rx="2" ry="1.2" fill="#57381E" fillOpacity="0.75" />
    <circle cx="18" cy="24" r="1" fill="#57381E" fillOpacity="0.7" />
  </svg>
);

/**
 * 「かたっぽの靴下」のSVGイラストアイコン
 * 説明:「部屋のどこかから持ってきた、しましま模様の片方だけの小さな靴下。」
 */
export const SingleSockIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="single-sock-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sockBlue" x1="16" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <ellipse cx="25" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    <path
      d="M24 9H34V24C34 27 32 30 30 32L17 38C13 40 10 36 12 33L21 23V9Z"
      fill="url(#sockBlue)"
      stroke="#0369A1"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M22 13H34" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M21 19H34" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M19 26L31 29" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M16 32L26 35" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M30 32C33 30 34 27 34 24L31 29Z" fill="#F8FAFC" />
    <path d="M12 33C10 36 13 40 17 38L15 34Z" fill="#F8FAFC" />
    <rect x="23.5" y="7.5" width="11" height="3" rx="1" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1" />
  </svg>
);

/**
 * 「ひまわりの種」のSVGイラストアイコン
 * 説明:「どこからか一粒だけくわえてきた、白黒のしま模様があるひまわりの種。」
 */
export const SunflowerSeedIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="sunflower-seed-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="seedShell" x1="16" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#44403C" />
        <stop offset="60%" stopColor="#292524" />
        <stop offset="100%" stopColor="#1C1917" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="11" ry="3.5" fill="#000000" fillOpacity="0.12" />
    <path
      d="M24 8C20 15 15 24 15 32C15 38 19 41 24 41C29 41 33 38 33 32C33 24 28 15 24 8Z"
      fill="url(#seedShell)"
      stroke="#1C1917"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M24 10V40" stroke="#E7E5E4" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 12C20 18 18 26 18 34" stroke="#E7E5E4" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M24 12C28 18 30 26 30 34" stroke="#E7E5E4" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M24 16C21 22 20 28 20 37" stroke="#A8A29E" strokeWidth="0.9" strokeLinecap="round" />
    <path d="M24 16C27 22 28 28 28 37" stroke="#A8A29E" strokeWidth="0.9" strokeLinecap="round" />
    <circle cx="24" cy="9" r="0.8" fill="#F5F5F4" />
  </svg>
);

/**
 * 「おやつの空き袋」のSVGイラストアイコン
 * 説明:「おいしい匂いが残っているのか、くしゃくしゃに丸められたスナックの空き袋。」
 */
export const SnackWrapperIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="snack-wrapper-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="snackBagGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="40%" stopColor="#EF4444" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    <path
      d="M12 16L16 11L32 13L36 17L33 34L29 37L15 35L11 31L12 16Z"
      fill="url(#snackBagGrad)"
      stroke="#B91C1C"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 16L14 13L16 15L18 12L20 14" stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M16 15L22 24L17 33" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M22 24L31 20L33 30" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
    <path d="M25 13L29 20" stroke="#7F1D1D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M18 28L26 35" stroke="#7F1D1D" strokeWidth="1.2" strokeLinecap="round" />
    <polygon points="21,17 26,19 24,23 20,20" fill="#FFFFFF" fillOpacity="0.5" />
  </svg>
);

/**
 * 「ほそながい串」のSVGイラストアイコン
 * 説明:「どこかで拾ってきた、先が少し丸くなった長くて細い竹串。」
 */
export const SkewerIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="skewer-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bambooGrad" x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="30%" stopColor="#FDE68A" />
        <stop offset="70%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="2.5" fill="#000000" fillOpacity="0.08" />
    <path
      d="M10 38L37 11L39 9L38 8L36 10L9 37C8.5 37.5 9 38.5 10 38Z"
      fill="url(#bambooGrad)"
      stroke="#B45309"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <line x1="17" y1="31" x2="19" y2="29" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="26" y1="22" x2="28" y2="20" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M34 14L37 11" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

/**
 * 「はずれのアイス棒」のSVGイラストアイコン
 * 説明:「おいしく食べたあとの木製アイスバーの棒。「はずれ」の焼き印がある。」
 */
export const IceStickIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="ice-stick-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="woodStickGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    <rect
      x="8"
      y="21"
      width="32"
      height="8"
      rx="4"
      transform="rotate(-30 24 24)"
      fill="url(#woodStickGrad)"
      stroke="#B45309"
      strokeWidth="1.5"
    />
    <path
      d="M13 29L32 18"
      stroke="#D97706"
      strokeWidth="0.8"
      strokeDasharray="4 2"
    />
    <text
      x="24"
      y="25.5"
      transform="rotate(-30 24 24)"
      textAnchor="middle"
      fill="#78350F"
      fontSize="5.5"
      fontWeight="900"
      fontFamily="sans-serif"
      letterSpacing="1"
    >
      はずれ
    </text>
  </svg>
);

/**
 * 「だいじそうな紙」のSVGイラストアイコン
 * 説明:「よくわからないが請求書と書かれている。机の上から見つけてきたらしく、得意げな顔で足元へ差し出してきた。」
 */
export const ImportantPaperIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="important-paper-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="paperGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    <rect x="11" y="8" width="26" height="32" rx="2" fill="url(#paperGrad)" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="11" y1="18" x2="37" y2="18" stroke="#E2E8F0" strokeWidth="1.5" />
    <line x1="11" y1="28" x2="37" y2="28" stroke="#E2E8F0" strokeWidth="1.5" />
    <text
      x="24"
      y="15"
      textAnchor="middle"
      fill="#1E293B"
      fontSize="4.5"
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      請 求 書
    </text>
    <line x1="15" y1="22" x2="33" y2="22" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
    <line x1="15" y1="25" x2="28" y2="25" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="15" y1="32" x2="33" y2="32" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
    <line x1="15" y1="35" x2="26" y2="35" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
    <rect x="29" y="30" width="6" height="6" rx="1" fill="#FEE2E2" stroke="#DC2626" strokeWidth="0.9" />
    <text x="32" y="34.5" textAnchor="middle" fill="#DC2626" fontSize="3.5" fontWeight="black">印</text>
  </svg>
);

/**
 * 「あおい空き缶」のSVGイラストアイコン
 * 説明:「転がして遊んでいたのか、少しへこんだ鮮やかな青色のジュースの空き缶。」
 */
export const BlueCanIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="blue-can-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="canBodyGrad" x1="12" y1="16" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="40%" stopColor="#0284C7" />
        <stop offset="80%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#0C4A6E" />
      </linearGradient>
      <linearGradient id="canSilverRim" x1="14" y1="10" x2="34" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="12" ry="3.5" fill="#000000" fillOpacity="0.12" />
    <ellipse cx="24" cy="38" rx="10" ry="3" fill="#0284C7" stroke="#0369A1" strokeWidth="1.2" />
    <path
      d="M14 14V38C14 39.5 18.5 41 24 41C29.5 41 34 39.5 34 38V14C32 23 30 26 34 29V14H14Z"
      fill="url(#canBodyGrad)"
      stroke="#0369A1"
      strokeWidth="1.2"
    />
    <path d="M19 24C23 27 28 26 31 22" stroke="#075985" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 27C24 29 27 28 29 25" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
    <ellipse cx="24" cy="14" rx="10" ry="3" fill="url(#canSilverRim)" stroke="#64748B" strokeWidth="1.2" />
    <ellipse cx="23" cy="14" rx="3.5" ry="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="0.8" />
    <circle cx="25" cy="14" r="0.8" fill="#475569" />
  </svg>
);

/**
 * 「からっぽのペットボトル」のSVGイラストアイコン
 * 説明:「爪でカリカリ引っかいた跡がある、軽くて透明な空のペットボトル。」
 */
export const EmptyBottleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="empty-bottle-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bottleGrad" x1="14" y1="12" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="11" ry="3" fill="#000000" fillOpacity="0.08" />
    <rect x="21" y="6" width="6" height="4" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
    <path
      d="M22 10V14L16 19V38C16 40 19.5 41 24 41C28.5 41 32 40 32 38V19L26 14V10H22Z"
      fill="url(#bottleGrad)"
      fillOpacity="0.65"
      stroke="#38BDF8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M16 25C19 26.5 29 26.5 32 25" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.6" />
    <path d="M16 31C19 32.5 29 32.5 32 31" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.6" />
    <path d="M20 20L23 23M23 19L26 23" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M19 18V36" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

/**
 * 「ももいろのハンカチ」のSVGイラストアイコン
 * 説明:「洗濯物の近くからくわえてきた、やわらかくて優しいピンク色のハンカチ。」
 */
export const PinkHandkerchiefIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="pink-handkerchief-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="handkerchiefGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCE7F3" />
        <stop offset="50%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    <path
      d="M13 20C12 16 16 12 21 13L33 16C37 17 38 21 36 25L32 35C31 38 27 39 23 37L14 30C12 28 11 24 13 20Z"
      fill="url(#handkerchiefGrad)"
      stroke="#DB2777"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M14 26C18 29 27 28 32 23" stroke="#BE185D" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M20 18C23 23 27 26 34 27" stroke="#FDF2F8" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="17" cy="18" r="1" fill="#FFFFFF" />
    <circle cx="21" cy="22" r="1" fill="#FFFFFF" />
    <circle cx="25" cy="33" r="1" fill="#FFFFFF" />
    <circle cx="29" cy="31" r="1" fill="#FFFFFF" />
  </svg>
);

/**
 * 「おかしの包み紙」のSVGイラストアイコン
 * 説明:「両端がキュッとねじられた、きらきらと光るキャンディの包み紙。」
 */
export const CandyWrapperIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="candy-wrapper-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="candyGrad" x1="12" y1="14" x2="36" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="50%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#FB7185" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    <path
      d="M17 24L7 16V32L17 24Z"
      fill="url(#candyGrad)"
      stroke="#9333EA"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M8 20L15 24L8 28" stroke="#FDF4FF" strokeWidth="1" />
    <path
      d="M31 24L41 16V32L31 24Z"
      fill="url(#candyGrad)"
      stroke="#9333EA"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M40 20L33 24L40 28" stroke="#FDF4FF" strokeWidth="1" />
    <ellipse cx="24" cy="24" rx="9" ry="8" fill="url(#candyGrad)" stroke="#9333EA" strokeWidth="1.5" />
    <path d="M18 19C21 21 21 27 18 29" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
    <path d="M23 16C26 19 26 29 23 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 18C31 21 31 27 28 30" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 「おべんとうのバラン」のSVGイラストアイコン
 * 説明:「お弁当箱のすみにあった、草の形をした緑色のギザギザした仕切りシート。」
 */
export const BentoBaranIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="bento-baran-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="baranGrad" x1="10" y1="12" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    <path
      d="M10 38V24L13 13L16 23L19 11L22 23L25 10L28 23L31 11L34 23L37 13L38 24V38H10Z"
      fill="url(#baranGrad)"
      stroke="#166534"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <line x1="14" y1="20" x2="14" y2="36" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />
    <line x1="19" y1="18" x2="19" y2="36" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="17" x2="24" y2="36" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />
    <line x1="29" y1="18" x2="29" y2="36" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />
    <line x1="34" y1="20" x2="34" y2="36" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 「みどりのスーパーボール」のSVGイラストアイコン
 * 説明:「フローリングの上でよく弾む、鮮やかな緑色のゴム製スーパーボール。」
 */
export const SuperBallIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="super-ball-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="superBallGrad" x1="14" y1="10" x2="34" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A3E635" />
        <stop offset="35%" stopColor="#4ADE80" />
        <stop offset="70%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
      <linearGradient id="superBallShine" x1="16" y1="12" x2="26" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.14" />
    <circle cx="24" cy="24" r="17" fill="url(#superBallGrad)" stroke="#15803D" strokeWidth="1.8" />
    <path
      d="M11 20C16 15 28 17 35 24C38 27 34 35 25 35C17 35 12 28 17 21"
      stroke="#FEF08A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    <path
      d="M17 33C22 36 31 34 36 29"
      stroke="#38BDF8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    <ellipse cx="19" cy="16" rx="5" ry="3" transform="rotate(-30 19 16)" fill="url(#superBallShine)" />
    <circle cx="16" cy="14" r="1.5" fill="#FFFFFF" fillOpacity="0.95" />
  </svg>
);

/**
 * 「ちいさな鈴」のSVGイラストアイコン
 * 説明:「転がすとチリンと軽やかな音が鳴る、金色のちいさな丸い鈴。」
 */
export const SmallBellIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="small-bell-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bellGoldGrad" x1="12" y1="10" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FBBF24" />
        <stop offset="80%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.14" />
    <path
      d="M21 11C21 8 23 6 24 6C25 6 27 8 27 11"
      stroke="#B45309"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="24" cy="11" r="2.5" fill="#D97706" />
    <circle cx="24" cy="26" r="15" fill="url(#bellGoldGrad)" stroke="#B45309" strokeWidth="1.8" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="26" x2="38" y2="26" stroke="#FEF3C7" strokeWidth="0.8" strokeLinecap="round" />
    <circle cx="24" cy="33" r="2.5" fill="#451A03" />
    <path d="M17 35C20 34 24 33 24 33C24 33 28 34 31 35" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="18" cy="18" rx="4" ry="2" transform="rotate(-30 18 18)" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

/**
 * 「あかいろの宝石」のSVGイラストアイコン
 * 説明:「深紅に輝くカットが美しい、どこかの宝飾品から落ちたような小さな赤い宝石。」
 */
export const RedGemIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="red-gem-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="redGemTop" x1="16" y1="10" x2="32" y2="19" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="60%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="redGemMain" x1="10" y1="19" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E11D48" />
        <stop offset="40%" stopColor="#BE123C" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
      <linearGradient id="redGemFacet" x1="24" y1="19" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* 宝石パビリオン（下部三角形全体） */}
    <polygon points="10,19 38,19 24,40" fill="url(#redGemMain)" stroke="#9F1239" strokeWidth="1.5" strokeLinejoin="round" />
    {/* 中央メインファセット */}
    <polygon points="17,19 31,19 24,40" fill="url(#redGemFacet)" opacity="0.95" />
    {/* 上部クラウン面（台形） */}
    <polygon points="15,10 33,10 38,19 10,19" fill="url(#redGemTop)" stroke="#BE123C" strokeWidth="1.5" strokeLinejoin="round" />
    {/* テーブル面（上部中央平坦面） */}
    <polygon points="18,10 30,10 33,19 15,19" fill="#FFF1F2" fillOpacity="0.45" />
    {/* 輝きのハイライトライン */}
    <line x1="15" y1="10" x2="17" y2="19" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" strokeLinecap="round" />
    {/* きらめき星マーク */}
    <path
      d="M36 8C36 11 38 13 41 13C38 13 36 15 36 18C36 15 34 13 31 13C34 13 36 11 36 8Z"
      fill="#FFFFFF"
    />
    <circle cx="16" cy="14" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/**
 * 「あおいろの宝石」のSVGイラストアイコン
 * 説明:「夜空や深い海を閉じ込めたように澄み渡る、吸い込まれそうな青い宝石。」
 */
export const BlueGemIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="blue-gem-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="blueGemGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="30%" stopColor="#0284C7" />
        <stop offset="70%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
      <linearGradient id="blueGemFacetL" x1="12" y1="18" x2="24" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="blueGemFacetR" x1="36" y1="18" x2="24" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0C4A6E" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* しずく型外枠 */}
    <path
      d="M24 7C24 7 11 22 11 30C11 36.6 16.8 41 24 41C31.2 41 37 36.6 37 30C37 22 24 7 24 7Z"
      fill="url(#blueGemGrad)"
      stroke="#0369A1"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* ファセット分割（左側面） */}
    <path
      d="M24 7C24 7 11 22 11 30C11 34 14 38 20 40L24 25L24 7Z"
      fill="url(#blueGemFacetL)"
      fillOpacity="0.6"
    />
    {/* ファセット分割（右側面） */}
    <path
      d="M24 7L24 25L28 40C34 38 37 34 37 30C37 22 24 7 24 7Z"
      fill="url(#blueGemFacetR)"
      fillOpacity="0.5"
    />
    {/* 中央クリスタル面 */}
    <polygon points="24,12 28,26 24,37 20,26" fill="#E0F2FE" fillOpacity="0.5" />
    {/* 反射ハイライト */}
    <path
      d="M17 22C15 26 15 31 17 34"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    {/* きらめき星マーク */}
    <path
      d="M34 10C34 12.5 35.5 14 38 14C35.5 14 34 15.5 34 18C34 15.5 32.5 14 30 14C32.5 14 34 12.5 34 10Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 「きいろの宝石」のSVGイラストアイコン
 * 説明:「陽だまりの光を閉じ込めたように明るくきらめく、黄金色に澄んだ黄色い宝石。」
 */
export const YellowGemIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="yellow-gem-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="yellowGemGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="30%" stopColor="#FACC15" />
        <stop offset="70%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="yellowGemCenter" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* ダイヤモンド型外形（八角形カット） */}
    <polygon
      points="16,9 32,9 39,16 39,32 32,39 16,39 9,32 9,16"
      fill="url(#yellowGemGrad)"
      stroke="#B45309"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 中央テーブル面 */}
    <polygon
      points="19,15 29,15 33,19 33,29 29,33 19,33 15,29 15,19"
      fill="url(#yellowGemCenter)"
      stroke="#D97706"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* コーナーファセット線 */}
    <line x1="16" y1="9" x2="19" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
    <line x1="32" y1="9" x2="29" y2="15" stroke="#FDE047" strokeWidth="1" />
    <line x1="39" y1="16" x2="33" y2="19" stroke="#FDE047" strokeWidth="1" />
    <line x1="39" y1="32" x2="33" y2="29" stroke="#B45309" strokeWidth="1" />
    <line x1="32" y1="39" x2="29" y2="33" stroke="#B45309" strokeWidth="1" />
    <line x1="16" y1="39" x2="19" y2="33" stroke="#B45309" strokeWidth="1" />
    <line x1="9" y1="32" x2="15" y2="29" stroke="#EAB308" strokeWidth="1" />
    <line x1="9" y1="16" x2="15" y2="19" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
    {/* 光沢のハイライト */}
    <circle cx="21" cy="18" r="2" fill="#FFFFFF" fillOpacity="0.9" />
    {/* きらめき星マーク */}
    <path
      d="M10 9C10 11.5 11.5 13 14 13C11.5 13 10 14.5 10 17C10 14.5 8.5 13 6 13C8.5 13 10 11.5 10 9Z"
      fill="#FFFFFF"
    />
    <path
      d="M38 7C38 9 39 10 41 10C39 10 38 11 38 13C38 11 37 10 35 10C37 10 38 9 38 7Z"
      fill="#FEF08A"
    />
  </svg>
);

/**
 * 「あたりのアイス棒」のSVGイラストアイコン
 * 説明:「見事に「あたり」が出た木製アイスバーの棒。もう一本もらえる幸運の証。」
 */
export const WinningIceStickIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="winning-ice-stick-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="winStickWood" x1="18" y1="6" x2="30" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="35%" stopColor="#FDE68A" />
        <stop offset="80%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="10" ry="3" fill="#000000" fillOpacity="0.14" />
    {/* 木製スティック本体 */}
    <rect
      x="18"
      y="6"
      width="12"
      height="34"
      rx="6"
      fill="url(#winStickWood)"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    {/* 木目ライン */}
    <path d="M21 10V36" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.7" />
    <path d="M27 12V34" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.7" />
    {/* 赤い「あたり」スタンプ枠 */}
    <rect x="20" y="11" width="8" height="15" rx="1.5" fill="#FEE2E2" stroke="#DC2626" strokeWidth="0.8" />
    {/* 「あたり」の文字表現（赤文字） */}
    <text
      x="24"
      y="15.5"
      fontSize="3.8"
      fontFamily="sans-serif"
      fontWeight="bold"
      fill="#DC2626"
      textAnchor="middle"
    >
      あ
    </text>
    <text
      x="24"
      y="19.5"
      fontSize="3.8"
      fontFamily="sans-serif"
      fontWeight="bold"
      fill="#DC2626"
      textAnchor="middle"
    >
      た
    </text>
    <text
      x="24"
      y="23.5"
      fontSize="3.8"
      fontFamily="sans-serif"
      fontWeight="bold"
      fill="#DC2626"
      textAnchor="middle"
    >
      り
    </text>
    {/* 赤い星マーク★ */}
    <path
      d="M24 28L24.8 29.5L26.5 29.8L25.2 31L25.5 32.7L24 31.9L22.5 32.7L22.8 31L21.5 29.8L23.2 29.5L24 28Z"
      fill="#DC2626"
    />
    {/* 輝きエフェクト */}
    <path
      d="M13 14C13 16 14 17 16 17C14 17 13 18 13 20C13 18 12 17 10 17C12 17 13 16 13 14Z"
      fill="#F59E0B"
    />
    <path
      d="M35 18C35 20 36 21 38 21C36 21 35 22 35 24C35 22 34 21 32 21C34 21 35 20 35 18Z"
      fill="#F59E0B"
    />
  </svg>
);

/**
 * 「りゅうの鱗」のSVGイラストアイコン
 * 説明:「伝説のドラゴンから剥がれ落ちたと伝わる、虹色に光る硬質で神聖なウロコ。」
 */
export const DragonScaleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="dragon-scale-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dragonScaleGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="25%" stopColor="#2DD4BF" />
        <stop offset="55%" stopColor="#0D9488" />
        <stop offset="85%" stopColor="#047857" />
        <stop offset="100%" stopColor="#312E81" />
      </linearGradient>
      <linearGradient id="dragonScaleShine" x1="24" y1="8" x2="16" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* 竜のウロコ外形（上部が丸く、下部が鋭利な楯型） */}
    <path
      d="M24 7C14 7 10 16 10 24C10 32 17 38 24 41C31 38 38 32 38 24C38 16 34 7 24 7Z"
      fill="url(#dragonScaleGrad)"
      stroke="#065F46"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* 竜の硬質キール（中央の隆起稜線） */}
    <path
      d="M24 8V39"
      stroke="#FDE047"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    {/* 放射状の肋骨・鱗紋様 */}
    <path
      d="M24 16L14 22M24 23L13 29M24 30L17 35"
      stroke="#6EE7B7"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    <path
      d="M24 16L34 22M24 23L35 29M24 30L31 35"
      stroke="#047857"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* ハイライト光沢面 */}
    <path
      d="M24 8C18 8 13 15 13 22C17 19 22 17 24 8Z"
      fill="url(#dragonScaleShine)"
    />
    {/* 神秘のきらめき星マーク */}
    <path
      d="M34 10C34 12 35 13 37 13C35 13 34 14 34 16C34 14 33 13 31 13C33 13 34 12 34 10Z"
      fill="#FDE047"
    />
  </svg>
);

/**
 * 「りゅうの爪」のSVGイラストアイコン
 * 説明:「鋼よりも鋭く湾曲した、古のドラゴンが残したとされる神秘的な黒金の爪。」
 */
export const DragonClawIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="dragon-claw-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dragonClawGrad" x1="12" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="30%" stopColor="#1E293B" />
        <stop offset="70%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="dragonClawGoldEdge" x1="28" y1="8" x2="38" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="dragonScaleBase" x1="10" y1="6" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="26" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* 根元の甲殻・ウロコ関節部 */}
    <path
      d="M10 11C10 7 16 6 22 7C25 7.5 28 10 26 15C23 20 12 18 10 11Z"
      fill="url(#dragonScaleBase)"
      stroke="#1E293B"
      strokeWidth="1.5"
    />
    <circle cx="15" cy="11" r="1.5" fill="#94A3B8" />
    <circle cx="20" cy="12" r="1.2" fill="#94A3B8" />
    {/* 鋭く湾曲した鉤爪本体 */}
    <path
      d="M23 11C28 15 35 23 37 36C33 34 26 31 20 27C14 23 13 18 16 14L23 11Z"
      fill="url(#dragonClawGrad)"
      stroke="#0F172A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* 外側カーブの黄金エッジ刃筋 */}
    <path
      d="M23 11C28 15 35 23 37 36C36 31 32 22 26 15L23 11Z"
      fill="url(#dragonClawGoldEdge)"
    />
    {/* 研ぎ澄まされた鋭利なハイライトライン */}
    <path
      d="M25 14C29 19 34 26 36 35"
      stroke="#FFFFFF"
      strokeWidth="1"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* 先端のキリッとした光彩 */}
    <circle cx="37" cy="36" r="1.5" fill="#FEF08A" />
    <path
      d="M39 31C39 33 40 34 42 34C40 34 39 35 39 37C39 35 38 34 36 34C38 34 39 33 39 31Z"
      fill="#F59E0B"
    />
  </svg>
);

/**
 * 「ほしのかけら」のSVGイラストアイコン
 * 説明:「夜空から落ちてきた流れ星の欠片。手のひらで淡く温かく明滅している。」
 */
export const StarFragmentIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="star-fragment-icon"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="starGlow" cx="24" cy="24" r="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="starBodyGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FEF08A" />
        <stop offset="65%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* 背後の発光オーラ */}
    <circle cx="24" cy="24" r="19" fill="url(#starGlow)" />
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="12" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* ふっくら立体的な星型本体 */}
    <path
      d="M24 6L29 17L40 18L32 26L35 37L24 31L13 37L16 26L8 18L19 17L24 6Z"
      fill="url(#starBodyGrad)"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 中央の立体ピラミッド面 */}
    <polygon points="24,6 24,24 29,17" fill="#FFFFFF" fillOpacity="0.8" />
    <polygon points="40,18 24,24 29,17" fill="#FEF08A" fillOpacity="0.6" />
    <polygon points="40,18 24,24 32,26" fill="#F59E0B" fillOpacity="0.4" />
    <polygon points="35,37 24,24 32,26" fill="#D97706" fillOpacity="0.5" />
    <polygon points="35,37 24,24 24,31" fill="#B45309" fillOpacity="0.5" />
    <polygon points="13,37 24,24 24,31" fill="#F59E0B" fillOpacity="0.6" />
    <polygon points="13,37 24,24 16,26" fill="#FBBF24" fillOpacity="0.7" />
    <polygon points="8,18 24,24 16,26" fill="#FEF08A" fillOpacity="0.8" />
    <polygon points="8,18 24,24 19,17" fill="#FFFFFF" fillOpacity="0.9" />
    <polygon points="24,6 24,24 19,17" fill="#FFFBEB" fillOpacity="0.95" />
    {/* まわりの小さな光の粒・星屑 */}
    <circle cx="9" cy="11" r="1.5" fill="#FEF08A" />
    <circle cx="39" cy="12" r="1.2" fill="#FEF08A" />
    <circle cx="38" cy="35" r="1.5" fill="#FBBF24" />
    <circle cx="10" cy="34" r="1.2" fill="#FBBF24" />
    <path
      d="M37 22C37 23.5 38 24.5 39.5 24.5C38 24.5 37 25.5 37 27C37 25.5 36 24.5 34.5 24.5C36 24.5 37 23.5 37 22Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 「いにしえの歯車」のSVGイラストアイコン
 * 説明:「古代の高度な文明で作られたと思われる、決して錆びることのない真鍮の精密な歯車。」
 */
export const AncientGearIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="ancient-gear-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="gearBrass" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="35%" stopColor="#D97706" />
        <stop offset="70%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="gearInner" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* 12枚歯の歯車外輪 */}
    <path
      d="M22 6H26V9.1C27.4 9.4 28.7 10 29.9 10.7L32.1 8.5L34.9 11.3L32.7 13.5C33.4 14.7 34 16 34.3 17.4H37.4V21.4H34.3C34 22.8 33.4 24.1 32.7 25.3L34.9 27.5L32.1 30.3L29.9 28.1C28.7 28.8 27.4 29.4 26 29.7V32.8H22V29.7C20.6 29.4 19.3 28.8 18.1 28.1L15.9 30.3L13.1 27.5L15.3 25.3C14.6 24.1 14 22.8 13.7 21.4H10.6V17.4H13.7C14 16 14.6 14.7 15.3 13.5L13.1 11.3L15.9 8.5L18.1 10.7C19.3 10 20.6 9.4 22 9.1V6Z"
      transform="translate(0, 4.5)"
      fill="url(#gearBrass)"
      stroke="#78350F"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 内側サークルリム */}
    <circle cx="24" cy="28" r="9.5" fill="url(#gearInner)" stroke="#92400E" strokeWidth="1.2" />
    {/* 4つの抜き穴（古代幾何学デザイン） */}
    <circle cx="24" cy="22" r="2.2" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
    <circle cx="24" cy="34" r="2.2" fill="#78350F" stroke="#92400E" strokeWidth="1" />
    <circle cx="18" cy="28" r="2.2" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    <circle cx="30" cy="28" r="2.2" fill="#B45309" stroke="#92400E" strokeWidth="1" />
    {/* 中心車軸穴 */}
    <circle cx="24" cy="28" r="3.5" fill="#451A03" stroke="#FDE68A" strokeWidth="1.2" />
    <circle cx="24" cy="28" r="1.5" fill="#FDE68A" />
    {/* 真鍮の金属光沢ライン */}
    <path
      d="M17 18.5C19 16.5 22 15.5 25 15.5"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
  </svg>
);

/**
 * 「りっぱな枝」のSVGイラストアイコン
 * 説明:「どこかの神木から落ちたのか、見事な枝振りと小さな金の芽をつけた立派な木の枝。」
 */
export const SplendidBranchIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="splendid-branch-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="splendidWood" x1="10" y1="40" x2="38" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="50%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="goldBud" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="14" ry="3" fill="#000000" fillOpacity="0.14" />
    {/* 太い主幹と分かれ枝 */}
    <path
      d="M10 40C12 36 15 31 18 27C21 23 25 18 29 11L33 8C32 12 28 17 24 22L36 17C38 18 36 21 32 23L24 26C22 30 18 35 15 41C13 42 11 41 10 40Z"
      fill="url(#splendidWood)"
      stroke="#451A03"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* サブの小枝 */}
    <path
      d="M19 25C17 22 14 20 12 20C13 22 15 24 17 27"
      fill="#92400E"
      stroke="#451A03"
      strokeWidth="1.2"
    />
    {/* 枝先の瑞々しい緑の若葉 */}
    <path
      d="M33 8C35 5 39 6 39 8C39 11 35 11 33 8Z"
      fill="#22C55E"
      stroke="#15803D"
      strokeWidth="1"
    />
    <path
      d="M36 17C39 15 42 17 41 19C39 21 36 19 36 17Z"
      fill="#16A34A"
      stroke="#15803D"
      strokeWidth="1"
    />
    <path
      d="M12 20C9 18 9 15 11 15C13 15 14 18 12 20Z"
      fill="#4ADE80"
      stroke="#16A34A"
      strokeWidth="1"
    />
    {/* 神秘の金のつぼみ・新芽 */}
    <circle cx="34" cy="7" r="2" fill="url(#goldBud)" stroke="#CA8A04" strokeWidth="0.8" />
    <circle cx="37" cy="16" r="1.8" fill="url(#goldBud)" stroke="#CA8A04" strokeWidth="0.8" />
    <circle cx="11" cy="19" r="1.5" fill="url(#goldBud)" stroke="#CA8A04" strokeWidth="0.8" />
    {/* 金の輝きスパークル */}
    <path
      d="M28 10C28 11.5 29 12.5 30.5 12.5C29 12.5 28 13.5 28 15C28 13.5 27 12.5 25.5 12.5C27 12.5 28 11.5 28 10Z"
      fill="#FACC15"
    />
  </svg>
);

/**
 * 「きみょうな勾玉」のSVGイラストアイコン
 * 説明:「翡翠のように淡く緑色に透き通る、古い儀式で使われていたような形の不思議な勾玉。」
 */
export const CuriousMagatamaIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="curious-magatama-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="magatamaGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="35%" stopColor="#34D399" />
        <stop offset="70%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064E3B" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* 勾玉特有のなめらかなC字カーブ（頭部が丸く、尾部が細く湾曲） */}
    <path
      d="M24 8C16 8 11 14 11 22C11 31 18 39 27 39C32 39 36 36 36 32C36 27 31 27 28 27C22 27 21 21 22 17C23 13 27 12 28 10C27 8.7 25.6 8 24 8Z"
      fill="url(#magatamaGrad)"
      stroke="#047857"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* 勾玉の穴（頭部貫通孔） */}
    <circle cx="21" cy="18" r="3.2" fill="#064E3B" stroke="#047857" strokeWidth="1" />
    <circle cx="21" cy="18" r="1.5" fill="#022C22" />
    {/* なめらかな翡翠の光沢ハイライト */}
    <path
      d="M16 14C14 17 14 21 16 26"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    <path
      d="M26 36C29 36 32 34 33 32"
      stroke="#A7F3D0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.7"
    />
    {/* 神秘の光彩星 */}
    <path
      d="M35 12C35 14 36 15 38 15C36 15 35 16 35 18C35 16 34 15 32 15C34 15 35 14 35 12Z"
      fill="#6EE7B7"
    />
  </svg>
);

/**
 * 「ひかる苔石」のSVGイラストアイコン
 * 説明:「暗闇で幻想的な淡い青緑の光を放つ、特殊な光る苔がびっしりと覆った不思議な丸石。」
 */
export const GlowingMossStoneIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="glowing-moss-stone-icon"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="mossGlow" cx="24" cy="24" r="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.5" />
        <stop offset="60%" stopColor="#10B981" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="mossStoneBody" x1="14" y1="12" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="45%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
      <linearGradient id="glowMossPatch" x1="12" y1="14" x2="32" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* 苔の周囲に漂う幻想的な発光オーラ */}
    <circle cx="24" cy="26" r="19" fill="url(#mossGlow)" />
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#000000" fillOpacity="0.18" />
    {/* ベースの丸石 */}
    <path
      d="M13 22C13 14 20 11 27 12C34 13 37 19 37 27C37 34 31 39 23 39C15 39 13 32 13 22Z"
      fill="url(#mossStoneBody)"
      stroke="#1E293B"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* 蛍光発光するヒカリゴケ（パッチ1） */}
    <path
      d="M15 20C17 16 22 14 26 15C29 16 32 18 31 22C29 24 27 21 24 21C21 21 20 25 17 25C15 25 14 23 15 20Z"
      fill="url(#glowMossPatch)"
    />
    {/* 蛍光苔パッチ2 */}
    <path
      d="M20 28C22 26 27 25 29 27C31 29 34 30 33 33C31 35 28 34 25 35C22 36 19 34 19 31C19 29 19 29 20 28Z"
      fill="#34D399"
    />
    {/* 苔の粒・自発光の小さな斑点群 */}
    <circle cx="18" cy="19" r="1.2" fill="#A7F3D0" />
    <circle cx="23" cy="17" r="1.5" fill="#D1FAE5" />
    <circle cx="28" cy="20" r="1.2" fill="#A7F3D0" />
    <circle cx="23" cy="28" r="1.2" fill="#D1FAE5" />
    <circle cx="28" cy="30" r="1.5" fill="#A7F3D0" />
    {/* 立ち上る光の胞子パーティクル */}
    <circle cx="12" cy="15" r="1" fill="#6EE7B7" />
    <circle cx="36" cy="14" r="1.2" fill="#34D399" />
    <circle cx="32" cy="8" r="1" fill="#A7F3D0" />
    <path
      d="M19 10C19 11.5 20 12.5 21.5 12.5C20 12.5 19 13.5 19 15C19 13.5 18 12.5 16.5 12.5C18 12.5 19 11.5 19 10Z"
      fill="#A7F3D0"
    />
  </svg>
);

/**
 * 「ちぎれた輪ゴム」のSVGイラストアイコン
 * 説明:「引っ張って遊んでいるうちにプチッとちぎれた、少し伸びきった茶色い輪ゴム。」
 */
export const BrokenRubberBandIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="broken-rubber-band-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rubberGrad" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="14" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* ちぎれてカールした輪ゴム本体 */}
    <path
      d="M10 22C12 14 20 10 28 11C35 12 39 18 37 25C35 31 29 36 21 35C16 34 13 30 15 26C17 22 23 23 25 26C26 28 25 30 22 31"
      stroke="url(#rubberGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* ちぎれた断面・先端 */}
    <circle cx="10" cy="22" r="1.5" fill="#FDE68A" />
    <circle cx="22" cy="31" r="1.5" fill="#FDE68A" />
    {/* ゴムのツヤ */}
    <path
      d="M20 12C24 12 29 14 32 17"
      stroke="#FEF3C7"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
  </svg>
);

/**
 * 「まるめたアルミホイル」のSVGイラストアイコン
 * 説明:「手で転がしてサッカーのように遊んでいた、ぎゅっと小さく丸めた銀色のアルミホイル。」
 */
export const CrumpledAluminumIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="crumpled-aluminum-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="foilGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="25%" stopColor="#E2E8F0" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="75%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* クシャクシャの外輪多角形 */}
    <polygon
      points="17,11 26,9 34,14 38,22 36,31 29,38 20,38 12,32 10,23 12,15"
      fill="url(#foilGrad)"
      stroke="#475569"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* クシャッとした皺（ファセット面） */}
    <polygon points="17,11 26,9 24,19 16,18" fill="#FFFFFF" fillOpacity="0.9" />
    <polygon points="26,9 34,14 28,21 24,19" fill="#94A3B8" />
    <polygon points="34,14 38,22 30,24 28,21" fill="#E2E8F0" />
    <polygon points="38,22 36,31 28,29 30,24" fill="#64748B" />
    <polygon points="36,31 29,38 24,30 28,29" fill="#94A3B8" />
    <polygon points="29,38 20,38 21,29 24,30" fill="#475569" />
    <polygon points="20,38 12,32 17,26 21,29" fill="#64748B" />
    <polygon points="12,32 10,23 18,22 17,26" fill="#CBD5E1" />
    <polygon points="10,23 12,15 16,18 18,22" fill="#E2E8F0" />
    {/* 中央の皺 */}
    <polygon points="16,18 24,19 28,21 30,24 28,29 24,30 21,29 17,26 18,22" fill="#F1F5F9" />
    <line x1="24" y1="19" x2="21" y2="29" stroke="#475569" strokeWidth="1" />
    <line x1="18" y1="22" x2="28" y2="21" stroke="#334155" strokeWidth="1" />
    <line x1="24" y1="30" x2="28" y2="21" stroke="#334155" strokeWidth="1" />
    {/* メタリックな強いハイライト光 */}
    <circle cx="20" cy="15" r="1.5" fill="#FFFFFF" />
    <line x1="26" y1="11" x2="32" y2="15" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 「ちいさなダンボール片」のSVGイラストアイコン
 * 説明:「爪研ぎや噛みつきで器用にちぎり取られた、角がボロボロのダンボールの切れ端。」
 */
export const CardboardScrapIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="cardboard-scrap-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cardboardGrad" x1="10" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="40%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="14" ry="3" fill="#000000" fillOpacity="0.14" />
    {/* ちぎれたダンボール片本体 */}
    <path
      d="M10 16L24 10L37 14L38 27L33 34L20 37L11 31L13 22L10 16Z"
      fill="url(#cardboardGrad)"
      stroke="#78350F"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* ダンボール特有の破れ断面（波状の中芯紙 / フルート） */}
    <path
      d="M10 16C11 18 9 19 11 21C13 23 11 24 13 26"
      stroke="#FEF3C7"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M33 34C34 33 36 34 37 32C38 30 37 29 38 27"
      stroke="#FDE68A"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* クラフト紙の縦筋・折れ目 */}
    <line x1="20" y1="13" x2="18" y2="34" stroke="#78350F" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.6" />
    <line x1="28" y1="12" x2="26" y2="32" stroke="#78350F" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.6" />
    {/* 猫の噛み跡・爪あと */}
    <circle cx="23" cy="22" r="1" fill="#451A03" />
    <circle cx="26" cy="20" r="1.2" fill="#451A03" />
    <line x1="21" y1="24" x2="24" y2="28" stroke="#451A03" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 「ぬけたじぶんのヒゲ」のSVGイラストアイコン
 * 説明:「掃除中に見つかることの多い、ピンと白くて縁起が良いとされる猫自身の抜け落ちたヒゲ。」
 */
export const CatWhiskerIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="cat-whisker-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="whiskerGlow" x1="8" y1="36" x2="40" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="14" ry="2.5" fill="#000000" fillOpacity="0.08" />
    {/* ヒゲのゆるやかなアーチ（根元が少し太く、先が鋭い） */}
    <path
      d="M8 35C16 35 27 30 38 13"
      stroke="#94A3B8"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M8 35C16 35 27 30 38 13"
      stroke="url(#whiskerGlow)"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* 根元の毛根プツッとした小さな粒 */}
    <circle cx="8" cy="35" r="1.6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.8" />
    {/* 縁起の良さを表す繊細な光彩・きらめき */}
    <circle cx="26" cy="27" r="1" fill="#FFFFFF" />
    <path
      d="M34 11C34 13 35 14 37 14C35 14 34 15 34 17C34 15 33 14 31 14C33 14 34 13 34 11Z"
      fill="#CBD5E1"
    />
  </svg>
);

/**
 * 「やぶれたレシート」のSVGイラストアイコン
 * 説明:「くしゃくしゃにして爪で引き裂いた、お買い物合計だけが読める感熱紙のレシート。」
 */
export const TornReceiptIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="torn-receipt-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="receiptGrad" x1="14" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="41" rx="12" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* 破れたレシート用紙（上部ギザギザ、少し斜めにねじれ） */}
    <path
      d="M15 11L18 9L21 11L24 9L27 11L30 9L33 12L31 38L17 39L15 26L14 18L15 11Z"
      fill="url(#receiptGrad)"
      stroke="#94A3B8"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* レシートの印字線（テキスト表現） */}
    <line x1="18" y1="15" x2="28" y2="15" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
    <line x1="18" y1="18" x2="26" y2="18" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="18" y1="21" x2="29" y2="21" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="18" y1="24" x2="27" y2="24" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
    {/* 合計金額ライン */}
    <line x1="17" y1="28" x2="29" y2="28" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
    {/* クシャッとした折れ皺 */}
    <path d="M15 22L22 24L31 20" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    {/* 爪で開けられた小穴 */}
    <circle cx="21" cy="33" r="1.2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.5" />
  </svg>
);

/**
 * 「まるまった毛玉」のSVGイラストアイコン
 * 説明:「ブラッシングのあとや毛づくろいの抜け毛が丸まった、手のひらサイズのふわっと軽い毛玉。」
 */
export const HairballIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="hairball-icon"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="hairballGrad" cx="22" cy="22" r="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="45%" stopColor="#CBD5E1" />
        <stop offset="85%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </radialGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="13" ry="3" fill="#000000" fillOpacity="0.14" />
    {/* ふわふわ毛玉本体 */}
    <circle cx="24" cy="24" r="14" fill="url(#hairballGrad)" stroke="#64748B" strokeWidth="1.2" />
    {/* 飛び出た毛足（ふわふわ感） */}
    <path d="M12 20C10 18 9 21 11 23" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 14C13 11 16 12 17 14" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M22 10C24 8 26 9 25 11" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M32 14C35 13 36 16 34 17" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M37 22C39 24 38 27 36 26" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M33 32C34 35 31 36 30 34" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M18 36C16 38 14 36 16 34" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
    {/* 表面に絡まる毛並みライン */}
    <path d="M17 21C20 18 26 19 28 23C29 27 25 29 21 28" stroke="#475569" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M19 16C23 15 28 17 31 20" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

/**
 * 「ねじれた針金」のSVGイラストアイコン
 * 説明:「食パンの袋を留めていたビニールタイ。ぐにゃぐにゃに曲げて遊んだ跡がある。」
 */
export const TwistedWireIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="twisted-wire-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tieGold" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="13" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* ぐにゃぐにゃに曲がったビニールタイ本体 */}
    <path
      d="M10 28C13 22 17 14 23 16C29 18 23 28 29 30C34 32 37 25 36 18C35 14 37 12 39 12"
      stroke="url(#tieGold)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 中心の芯金ライン */}
    <path
      d="M10 28C13 22 17 14 23 16C29 18 23 28 29 30C34 32 37 25 36 18C35 14 37 12 39 12"
      stroke="#713F12"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 先端から飛び出た針金の金属線 */}
    <line x1="39" y1="12" x2="41" y2="10" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="10" y1="28" x2="8" y2="30" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    {/* ビニールの光沢 */}
    <path d="M21 16C23 17 25 19 25 21" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

/**
 * 「かれたねこじゃらし草」のSVGイラストアイコン
 * 説明:「道端から根元ごとくわえてきた、秋風に吹かれて穂がカサカサに乾いたエノコログサ。」
 */
export const WitheredFoxtailIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="withered-foxtail-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="foxtailDry" x1="16" y1="8" x2="36" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="12" ry="2.5" fill="#000000" fillOpacity="0.12" />
    {/* しなった茎 */}
    <path
      d="M12 40C16 38 24 35 28 26C31 20 33 14 35 9"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* 穂（ふさふさした楕円ベース） */}
    <ellipse
      cx="32"
      cy="13"
      rx="6"
      ry="11"
      transform="rotate(25 32 13)"
      fill="url(#foxtailDry)"
      stroke="#B45309"
      strokeWidth="1.2"
    />
    {/* 穂から放射状に出る乾燥した芒（のぎ / ヒゲ毛） */}
    <path d="M28 6L25 3M32 4L32 1M36 5L39 2" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    <path d="M25 10L21 8M26 15L21 15M27 20L23 22" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    <path d="M37 10L41 8M38 16L43 16M37 22L41 24" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    {/* 茎についた小さな枯葉 */}
    <path
      d="M24 31C20 28 17 28 15 30C18 31 21 32 24 31Z"
      fill="#D97706"
      stroke="#92400E"
      strokeWidth="0.8"
    />
  </svg>
);

/**
 * 「へこんだピンポン球」のSVGイラストアイコン
 * 説明:「夢中で追いかけ回して爪でひと突きされたのか、ペコッとへこんで不規則に転がるピンポン球。」
 */
export const DentedPingpongBallIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="dented-pingpong-ball-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="pingpongGrad" x1="14" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF7ED" />
        <stop offset="40%" stopColor="#FED7AA" />
        <stop offset="85%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <radialGradient id="dentShadow" cx="29" cy="20" r="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C2410C" />
        <stop offset="65%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#FB923C" />
      </radialGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* ピンポン球外形（右上が凹んだ形状） */}
    <path
      d="M24 10C16.3 10 10 16.3 10 24C10 31.7 16.3 38 24 38C31.7 38 38 31.7 38 24C38 21 34 22 30 19C26 16 27 12 24 10Z"
      fill="url(#pingpongGrad)"
      stroke="#C2410C"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* ペコッとへこんだ窪み面 */}
    <path
      d="M24 10C27 12 26 16 30 19C34 22 38 21 38 24C36 27 30 25 27 22C23 18 23 13 24 10Z"
      fill="url(#dentShadow)"
      stroke="#9A3412"
      strokeWidth="1"
    />
    {/* 球面の丸みハイライト */}
    <path
      d="M14 19C15 15 19 13 23 13"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />
    {/* へこみの折り目ライン */}
    <path d="M26 16C28 18 31 20 34 21" stroke="#7C2D12" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 「ちいさなトカゲのしっぽ」のSVGイラストアイコン
 * 説明:「庭先で自切したトカゲから譲り受けた（？）のか、まだかすかにピクピクしている青い尾。」
 */
export const LizardTailIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="lizard-tail-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lizardBlue" x1="12" y1="14" x2="38" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="40%" stopColor="#0284C7" />
        <stop offset="75%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="14" ry="3" fill="#000000" fillOpacity="0.14" />
    {/* S字にうねるトカゲの青い尻尾 */}
    <path
      d="M12 16C16 14 22 17 26 23C30 29 35 32 38 31C40 30 38 27 35 26C31 24 27 19 23 15C18 10 13 12 12 16Z"
      fill="url(#lizardBlue)"
      stroke="#0369A1"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 自切した切断面（ピンク） */}
    <ellipse cx="12.5" cy="15.5" rx="2" ry="3" transform="rotate(-30 12.5 15.5)" fill="#FDA4AF" stroke="#E11D48" strokeWidth="0.8" />
    {/* 鮮やかなコバルトブルーの鱗ハイライト */}
    <path
      d="M18 14C22 15 26 20 29 25C32 29 35 30 37 30"
      stroke="#BAE6FD"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />
    {/* 尾先の細いピクピクカーブ */}
    <path d="M36 30C38 30 40 31 39 33" stroke="#0284C7" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 「やわらかい綿毛」のSVGイラストアイコン
 * 説明:「風に乗ってふわふわ飛んでいたところを前足で上手にキャッチした、まんまるいたんぽぽの綿毛。」
 */
export const SoftDandelionIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="soft-dandelion-icon"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="dandelionCenter" cx="24" cy="22" r="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#F1F5F9" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="42" rx="10" ry="2.5" fill="#000000" fillOpacity="0.1" />
    {/* たんぽぽの茎 */}
    <path d="M24 26V41" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" />
    {/* ふんわりした綿毛の背景グロー */}
    <circle cx="24" cy="22" r="14" fill="url(#dandelionCenter)" />
    {/* 放射状に広がる綿毛の枝線 */}
    <line x1="24" y1="22" x2="24" y2="10" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="22" x2="33" y2="14" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="22" x2="36" y2="22" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="22" x2="33" y2="30" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="22" x2="15" y2="30" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="22" x2="12" y2="22" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="24" y1="22" x2="15" y2="14" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
    {/* 先端の白い綿毛フサ */}
    <circle cx="24" cy="10" r="2" fill="#FFFFFF" />
    <circle cx="33" cy="14" r="2" fill="#FFFFFF" />
    <circle cx="36" cy="22" r="2" fill="#FFFFFF" />
    <circle cx="33" cy="30" r="1.8" fill="#FFFFFF" />
    <circle cx="15" cy="30" r="1.8" fill="#FFFFFF" />
    <circle cx="12" cy="22" r="2" fill="#FFFFFF" />
    <circle cx="15" cy="14" r="2" fill="#FFFFFF" />
    {/* 中心の種子（茶色） */}
    <circle cx="24" cy="22" r="2.5" fill="#78350F" stroke="#A16207" strokeWidth="0.8" />
  </svg>
);

/**
 * 「あいたゼリーのカップ」のSVGイラストアイコン
 * 説明:「甘い果汁の香りに惹かれて転がしてきた、きれいに洗われた小さな透明プラスチックカップ。」
 */
export const JellyCupIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="jelly-cup-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cupGrad" x1="12" y1="12" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.75" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000000" fillOpacity="0.14" />
    {/* プラスチックカップ本体（逆台形） */}
    <path
      d="M12 16L16 36C16.5 38 18 39 24 39C30 39 31.5 38 32 36L36 16"
      fill="url(#cupGrad)"
      stroke="#0284C7"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 上部開口部の楕円リム */}
    <ellipse cx="24" cy="16" rx="12" ry="3.5" fill="#F0F9FF" fillOpacity="0.6" stroke="#0284C7" strokeWidth="1.5" />
    {/* フタを剥がした縁のギザギザ・ツバ */}
    <path d="M11 16H9M37 16H39" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
    {/* 底面の丸みライン */}
    <ellipse cx="24" cy="36" rx="7" ry="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
    {/* 透明プラスチックの縦ハイライト */}
    <line x1="18" y1="19" x2="20" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9" />
  </svg>
);

/**
 * 「すべすべのプラスチックフタ」のSVGイラストアイコン
 * 説明:「床をすべる感触が楽しくてドリブルしていた、ペットボトルのまあるいキャップ。」
 */
export const PlasticBottleCapIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="plastic-bottle-cap-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="capTopGrad" x1="12" y1="12" x2="36" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="60%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="capSideGrad" x1="12" y1="20" x2="36" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="50%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.16" />
    {/* 側面（ギザギザローレット加工） */}
    <path
      d="M11 20V31C11 34.5 16.8 37 24 37C31.2 37 37 34.5 37 31V20"
      fill="url(#capSideGrad)"
      stroke="#075985"
      strokeWidth="1.5"
    />
    {/* 側面の溝（ローレット縦線） */}
    <line x1="15" y1="22" x2="15" y2="33" stroke="#0284C7" strokeWidth="1" />
    <line x1="19" y1="23" x2="19" y2="35" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="24" y1="24" x2="24" y2="36" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="29" y1="23" x2="29" y2="35" stroke="#075985" strokeWidth="1" />
    <line x1="33" y1="22" x2="33" y2="33" stroke="#075985" strokeWidth="1" />
    {/* 上部天面（楕円） */}
    <ellipse cx="24" cy="20" rx="13" ry="5.5" fill="url(#capTopGrad)" stroke="#0284C7" strokeWidth="1.5" />
    {/* 天面の丸みハイライト */}
    <ellipse cx="22" cy="18.5" rx="8" ry="3" fill="#BAE6FD" fillOpacity="0.5" />
  </svg>
);

/**
 * 「かわいた蝉の羽」のSVGイラストアイコン
 * 説明:「ベランダのすみに落ちていた、ステンドグラスのように透明な翅脈の美しい蝉のはね。」
 */
export const CicadaWingIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="cicada-wing-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="wingGrad" x1="10" y1="8" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#F1F5F9" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.12" />
    {/* 蝉の透明な羽の輪郭 */}
    <path
      d="M10 26C12 18 19 10 28 8C33 7 37 9 38 12C39 17 37 25 31 31C24 38 16 36 12 33L10 26Z"
      fill="url(#wingGrad)"
      stroke="#78350F"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 前縁の太い翅脈 */}
    <path d="M10 26C12 18 19 10 28 8C33 7 37 9 38 12" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
    {/* 幾何学的なステンドグラス状の翅脈 */}
    <line x1="20" y1="16" x2="31" y2="31" stroke="#92400E" strokeWidth="1" />
    <line x1="27" y1="12" x2="23" y2="27" stroke="#92400E" strokeWidth="0.8" />
    <line x1="33" y1="15" x2="28" y2="24" stroke="#92400E" strokeWidth="0.8" />
    <line x1="16" y1="23" x2="20" y2="32" stroke="#92400E" strokeWidth="0.8" />
    <path d="M28 8L33 19M31 16L36 24" stroke="#92400E" strokeWidth="0.8" />
    {/* 透明な輝きハイライト */}
    <path d="M16 18C20 14 26 11 31 11" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9" />
  </svg>
);

/**
 * 「まるい毛糸くず」のSVGイラストアイコン
 * 説明:「手芸カゴからこっそり引っ張り出して丸めた、ふかふかと柔らかな短い毛糸の切れ端。」
 */
export const YarnScrapIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="yarn-scrap-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="yarnGrad" x1="14" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="45%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="40" rx="13" ry="3.5" fill="#000000" fillOpacity="0.14" />
    {/* 丸まった毛糸玉本体 */}
    <ellipse cx="24" cy="24" rx="13" ry="12" fill="url(#yarnGrad)" stroke="#9D174D" strokeWidth="1.5" />
    {/* 巻き付いた糸の筋・テクスチャ */}
    <path d="M13 22C17 17 29 16 35 22" stroke="#FBCFE8" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 27C18 31 28 32 34 26" stroke="#9D174D" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 15C22 21 24 29 22 35" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 13C28 19 29 27 31 33" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" />
    {/* ぴょんと飛び出た糸端 */}
    <path
      d="M33 21C37 19 40 22 39 25C38 27 41 29 42 28"
      stroke="#EC4899"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 未獲得（未発見）のおくりもの用プレースホルダーアイコン
 * レアリティに応じて白（通常）、金（レア）、紫（スーパーレア）、オーロラ/虹色（ウルトラレア）で「？」を描画します。
 */
export const UnknownGiftIcon: React.FC<{
  className?: string;
  isRare?: boolean;
  rarity?: GiftRarity;
}> = ({ className = 'w-8 h-8', isRare = false, rarity }) => {
  const resolvedRarity = rarity ?? (isRare ? 'rare' : 'common');
  const isRarityRare = resolvedRarity === 'rare' || isRare;
  const isSuperRare = resolvedRarity === 'super-rare';
  const isUltraRare = resolvedRarity === 'ultra-rare';
  const isSpecial = isRarityRare || isSuperRare || isUltraRare;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid="unknown-gift-icon"
      data-rare={isRarityRare ? 'true' : 'false'}
      data-rarity={resolvedRarity}
      aria-hidden="true"
    >
      <defs>
        {isRarityRare && (
          <>
            <linearGradient id="unknownRareGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#FDE047" />
              <stop offset="80%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="unknownRareShine" x1="12" y1="10" x2="36" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </>
        )}
        {isSuperRare && (
          <>
            <linearGradient id="unknownSuperRareGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5D0FE" />
              <stop offset="40%" stopColor="#E879F9" />
              <stop offset="75%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
            <linearGradient id="unknownSuperRareShine" x1="12" y1="10" x2="36" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </>
        )}
        {isUltraRare && (
          <>
            <linearGradient id="unknownUltraRareGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="35%" stopColor="#F472B6" />
              <stop offset="70%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <linearGradient id="unknownUltraRareShine" x1="12" y1="10" x2="36" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </>
        )}
      </defs>
      <rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="10"
        fill={
          isUltraRare
            ? 'url(#unknownUltraRareGrad)'
            : isSuperRare
            ? 'url(#unknownSuperRareGrad)'
            : isRarityRare
            ? 'url(#unknownRareGrad)'
            : '#F1F5F9'
        }
        stroke={
          isUltraRare
            ? '#E11D48'
            : isSuperRare
            ? '#9333EA'
            : isRarityRare
            ? '#D97706'
            : '#CBD5E1'
        }
        strokeWidth={isSpecial ? '1.8' : '1.5'}
        strokeDasharray="3 3"
      />
      {isSpecial && (
        <>
          <path
            d="M12 12C15 9 24 9 28 11"
            stroke={
              isUltraRare
                ? 'url(#unknownUltraRareShine)'
                : isSuperRare
                ? 'url(#unknownSuperRareShine)'
                : 'url(#unknownRareShine)'
            }
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M34 14L35 16L37 17L35 18L34 20L33 18L31 17L33 16L34 14Z" fill="#FFFFFF" fillOpacity="0.9" />
        </>
      )}
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill={
          isUltraRare
            ? '#881337'
            : isSuperRare
            ? '#581C87'
            : isRarityRare
            ? '#78350F'
            : '#94A3B8'
        }
        fontSize="20"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        ?
      </text>
    </svg>
  );
};

/**
 * 「いちりんの薔薇」のSVGイラストアイコン
 * 説明:「どこかの花壇から一輪だけそっとくわえてきた、真紅の花びらが気品にあふれる薔薇。」
 */
export const SingleRoseIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="single-rose-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rosePetalGrad" x1="16" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="roseStemGrad" x1="20" y1="24" x2="28" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
    </defs>
    {/* 茎 */}
    <path d="M24 24C23 30 25 36 22 42" stroke="url(#roseStemGrad)" strokeWidth="2.5" strokeLinecap="round" />
    {/* トゲ */}
    <path d="M24 32L26 31" stroke="#14532D" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M23 36L21 35" stroke="#14532D" strokeWidth="1.5" strokeLinecap="round" />
    {/* 葉っぱ */}
    <path d="M24 28C28 26 32 27 34 30C31 32 27 31 24 28Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
    {/* 薔薇の花びら */}
    <ellipse cx="24" cy="17" rx="10" ry="9" fill="url(#rosePetalGrad)" stroke="#881337" strokeWidth="1.2" />
    <path d="M17 14C19 10 29 10 31 14C33 19 28 23 24 23C19 23 15 19 17 14Z" fill="#FB7185" fillOpacity="0.4" />
    <path d="M20 15C21 12 27 12 28 15C29 18 25 20 24 20C22 20 19 18 20 15Z" fill="#BE123C" stroke="#9F1239" strokeWidth="1" />
    <path d="M22 16C23 14 25 14 26 16C26 18 24 19 24 19C23 19 22 18 22 16Z" fill="#FFE4E6" />
    {/* キラキラ */}
    <circle cx="34" cy="11" r="1.5" fill="#FDA4AF" />
    <circle cx="14" cy="19" r="1" fill="#FDA4AF" />
  </svg>
);

/**
 * 「うつくしい鈴」のSVGイラストアイコン
 * 説明:「透き通るような涼やかな音色を奏でる、細かな彫刻が施された美しい真鍮の鈴。」
 */
export const BeautifulBellIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="beautiful-bell-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bbGoldGrad" x1="14" y1="12" x2="34" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="30%" stopColor="#FBBF24" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="bbRibbonGrad" x1="16" y1="6" x2="32" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
    </defs>
    {/* リボン */}
    <path d="M19 10C15 8 16 4 20 6C23 8 24 10 24 10C24 10 25 8 28 6C32 4 33 8 29 10C26 11 24 12 24 12C24 12 22 11 19 10Z" fill="url(#bbRibbonGrad)" stroke="#9F1239" strokeWidth="1" />
    {/* 上部リング */}
    <circle cx="24" cy="12" r="3.5" fill="none" stroke="#D97706" strokeWidth="2" />
    {/* 鈴本体 */}
    <circle cx="24" cy="27" r="13" fill="url(#bbGoldGrad)" stroke="#78350F" strokeWidth="1.5" />
    {/* 中央の飾り帯 */}
    <path d="M11 26C14 28 34 28 37 26" stroke="#92400E" strokeWidth="1.5" />
    <circle cx="18" cy="23" r="1" fill="#FEF08A" />
    <circle cx="24" cy="23" r="1" fill="#FEF08A" />
    <circle cx="30" cy="23" r="1" fill="#FEF08A" />
    {/* 鈴のスリットと丸穴 */}
    <path d="M16 34C20 33 28 33 32 34" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="33.5" r="2" fill="#451A03" />
    {/* ハイライト */}
    <ellipse cx="19" cy="20" rx="3" ry="1.5" transform="rotate(-30 19 20)" fill="#FFFFFF" fillOpacity="0.75" />
  </svg>
);

/**
 * 「ぴかぴかのコイン」のSVGイラストアイコン
 * 説明:「まるで新品のようにまばゆく輝く、どこかの自販機の下で見つけたピカピカの硬貨。」
 */
export const ShinyCoinIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="shiny-coin-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="scCoinGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    {/* コイン影 */}
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.12" />
    {/* コイン外枠 */}
    <circle cx="24" cy="24" r="15" fill="url(#scCoinGrad)" stroke="#A16207" strokeWidth="1.8" />
    {/* 内側の縁取り */}
    <circle cx="24" cy="24" r="12" fill="none" stroke="#CA8A04" strokeWidth="1" strokeDasharray="2 1.5" />
    {/* コイン中央スター */}
    <path d="M24 16L25.8 21.2L31.3 21.5L27 25L28.5 30.5L24 27.2L19.5 30.5L21 25L16.7 21.5L22.2 21.2L24 16Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
    {/* 反射光ライン */}
    <path d="M15 15L33 33" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
    {/* ピカピカきらめき */}
    <path d="M35 11L36 14L39 15L36 16L35 19L34 16L31 15L34 14L35 11Z" fill="#FACC15" />
    <path d="M12 30L12.7 32L14.7 32.7L12.7 33.3L12 35.3L11.3 33.3L9.3 32.7L11.3 32L12 30Z" fill="#FEF08A" />
  </svg>
);

/**
 * 「きらきら貝殻」のSVGイラストアイコン
 * 説明:「真珠層が虹色に光を反射する、波打ち際で見つけてきたとても綺麗な巻貝の殻。」
 */
export const SparklingSeashellIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="sparkling-seashell-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ssShellGrad" x1="12" y1="12" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="30%" stopColor="#FCE7F3" />
        <stop offset="60%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="13" ry="3.5" fill="#000000" fillOpacity="0.1" />
    {/* 扇型の貝殻 */}
    <path
      d="M24 37C14 37 10 26 12 18C14 13 20 11 24 11C28 11 34 13 36 18C38 26 34 37 24 37Z"
      fill="url(#ssShellGrad)"
      stroke="#38BDF8"
      strokeWidth="1.5"
    />
    {/* 放射状のリブ（溝） */}
    <path d="M24 36V11" stroke="#F472B6" strokeWidth="1" strokeOpacity="0.6" />
    <path d="M24 36C22 28 17 21 16 16" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
    <path d="M24 36C26 28 31 21 32 16" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
    <path d="M24 36C20 30 14 25 12 21" stroke="#F472B6" strokeWidth="0.8" strokeOpacity="0.5" />
    <path d="M24 36C28 30 34 25 36 21" stroke="#F472B6" strokeWidth="0.8" strokeOpacity="0.5" />
    {/* 付け根 */}
    <path d="M20 36C22 38 26 38 28 36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    {/* キラキラ光彩 */}
    <circle cx="20" cy="18" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M37 13L38 15L40 16L38 17L37 19L36 17L34 16L36 15L37 13Z" fill="#F472B6" />
    <path d="M10 28L10.6 29.5L12 30L10.6 30.5L10 32L9.4 30.5L8 30L9.4 29.5L10 28Z" fill="#38BDF8" />
  </svg>
);

/**
 * 「かるい流木」のSVGイラストアイコン
 * 説明:「川辺で長い年月をかけて削られ、すべすべの手触りになった不思議と軽い小さな流木。」
 */
export const LightDriftwoodIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="light-driftwood-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ldWoodGrad" x1="8" y1="20" x2="40" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E7E5E4" />
        <stop offset="50%" stopColor="#D6D3D1" />
        <stop offset="100%" stopColor="#A8A29E" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="38" rx="16" ry="3" fill="#000000" fillOpacity="0.1" />
    {/* 流木本体 */}
    <path
      d="M9 25C13 22 20 23 27 20C32 18 36 15 39 19C41 22 38 27 34 28C27 30 18 29 11 31C8 32 7 27 9 25Z"
      fill="url(#ldWoodGrad)"
      stroke="#78716C"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* 小さな枝角 */}
    <path d="M26 21C27 16 30 14 31 16" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
    {/* 滑らかな木目 */}
    <path d="M14 26C20 25 28 24 33 24" stroke="#A8A29E" strokeWidth="1" strokeLinecap="round" />
    <path d="M12 28C18 28 26 27 32 26" stroke="#78716C" strokeWidth="0.8" strokeLinecap="round" />
    {/* 木の節 */}
    <ellipse cx="22" cy="25" rx="1.5" ry="1" fill="#78716C" />
  </svg>
);

/**
 * 「ねこのアクスタ」のSVGイラストアイコン
 * 説明:「猫の愛らしいポーズが印刷された透明なアクリルスタンド。どこかの机から拝借してきたらしい。」
 */
export const CatAcrylicStandIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="cat-acrylic-stand-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="casAcrylicGrad" x1="14" y1="8" x2="34" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* アクリル台座 */}
    <ellipse cx="24" cy="39" rx="14" ry="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
    <ellipse cx="24" cy="38" rx="12" ry="3.5" fill="#F8FAFC" fillOpacity="0.8" />
    <rect x="22" y="37" width="4" height="2" rx="1" fill="#64748B" />
    {/* アクリルプレート本体 */}
    <path
      d="M17 12C17 9 31 9 31 12V36C31 37 30 38 29 38H19C18 38 17 37 17 36V12Z"
      fill="url(#casAcrylicGrad)"
      stroke="#7DD3FC"
      strokeWidth="1.5"
    />
    {/* 中に印刷された猫のシルエット */}
    <path
      d="M21 21C19.5 21 19 18 20 16L22 18C23 17.5 25 17.5 26 18L28 16C29 18 28.5 21 27 21C28 23 28 28 28 32H20C20 28 20 23 21 21Z"
      fill="#334155"
    />
    {/* しっぽ */}
    <path d="M28 29C30 28 31 25 30 24" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
    {/* アクリルの斜めハイライト */}
    <line x1="19" y1="12" x2="29" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
    <circle cx="28" cy="13" r="1.5" fill="#38BDF8" />
  </svg>
);

/**
 * 「おおきな鰹節」のSVGイラストアイコン
 * 説明:「台所の戸棚から見事に一本まるごと持ち出してきた、香ばしい出汁の香りが漂う特大の本枯節。」
 */
export const LargeBonitoFlakeIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="large-bonito-flake-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lbfFishGrad" x1="10" y1="16" x2="38" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="50%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#292524" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="15" ry="3.5" fill="#000000" fillOpacity="0.12" />
    {/* 鰹節の丸ごと一本形状 */}
    <path
      d="M10 28C14 20 24 16 38 21C39 23 38 26 35 28C26 33 16 34 10 28Z"
      fill="url(#lbfFishGrad)"
      stroke="#1C1917"
      strokeWidth="1.5"
    />
    {/* 削り面のピンクがかった赤褐色の断面 */}
    <path d="M12 27C15 23 20 21 25 21C20 24 16 27 12 27Z" fill="#F43F5E" fillOpacity="0.6" />
    {/* 尾びれの筋 */}
    <path d="M34 23L37 20M34 25L38 24M33 27L36 28" stroke="#A8A29E" strokeWidth="1" strokeLinecap="round" />
    {/* 削り節の削り粉 */}
    <path d="M14 33C16 32 17 33 19 32" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
    {/* 香りの湯気 */}
    <path d="M22 13C23 11 22 9 24 8" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M27 14C28 12 27 10 29 9" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 「へびの抜け殻」のSVGイラストアイコン
 * 説明:「草むらの奥で見つけてきた、破れひとつない一本まるまる綺麗に残った縁起物の抜け殻。」
 */
export const SnakeSheddingIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="snake-shedding-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ssShedGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#ECFCCB" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#D9F99D" stopOpacity="0.75" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="38" rx="14" ry="4" fill="#000000" fillOpacity="0.08" />
    {/* とぐろを巻いた半透明な抜け殻 */}
    <path
      d="M17 18C15 14 20 10 26 11C32 12 35 17 33 22C31 27 22 28 17 30C13 32 13 36 19 37C25 38 33 36 35 32"
      stroke="url(#ssShedGrad)"
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* うろこのメッシュ模様 */}
    <path
      d="M17 18C15 14 20 10 26 11C32 12 35 17 33 22C31 27 22 28 17 30C13 32 13 36 19 37C25 38 33 36 35 32"
      stroke="#84CC16"
      strokeWidth="1"
      strokeDasharray="2 2"
      strokeLinecap="round"
      fill="none"
    />
    {/* 頭の殻部分 */}
    <ellipse cx="17" cy="18" rx="2.5" ry="3" fill="#FEF08A" stroke="#65A30D" strokeWidth="1" />
  </svg>
);

/**
 * 「まるい球根」のSVGイラストアイコン
 * 説明:「春に大輪の花を咲かせる日を夢見て、花壇の土の中から丁寧に掘り出してきた丸い球根。」
 */
export const RoundBulbIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="round-bulb-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rbBulbGrad" x1="14" y1="16" x2="34" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="40%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="11" ry="3" fill="#000000" fillOpacity="0.1" />
    {/* 緑の小さな芽 */}
    <path d="M24 16C22 12 21 8 23 6C24 9 25 12 24 16Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="1" />
    <path d="M24 16C26 13 28 10 27 8C26 10 25 13 24 16Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="0.8" />
    {/* 球根本体 */}
    <path
      d="M24 16C16 16 13 24 14 30C15 36 21 38 24 38C27 38 33 36 34 30C35 24 32 16 24 16Z"
      fill="url(#rbBulbGrad)"
      stroke="#9A3412"
      strokeWidth="1.5"
    />
    {/* 皮の縦ライン */}
    <path d="M24 16C21 22 21 32 24 38" stroke="#EA580C" strokeWidth="1" />
    <path d="M24 16C27 22 27 32 24 38" stroke="#EA580C" strokeWidth="1" />
    {/* 下部の根っこ */}
    <path d="M22 38L21 42M24 38L24 43M26 38L27 42" stroke="#A8A29E" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 「こうきゅう絵筆」のSVGイラストアイコン
 * 説明:「毛先がなめらかに揃った上質な絵筆。アトリエの筆立てから大切そうにくわえて持ってきた。」
 */
export const LuxuryPaintbrushIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="luxury-paintbrush-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lpbWoodGrad" x1="12" y1="36" x2="34" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="lpbGoldGrad" x1="28" y1="18" x2="34" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3" fill="#000000" fillOpacity="0.1" />
    {/* 筆の柄（木軸） */}
    <path d="M10 38L28 20L31 23L13 41C11 42 9 40 10 38Z" fill="url(#lpbWoodGrad)" stroke="#451A03" strokeWidth="1" />
    {/* 金色の口金（フェルール） */}
    <path d="M28 20L32 16L35 19L31 23Z" fill="url(#lpbGoldGrad)" stroke="#B45309" strokeWidth="1" />
    {/* 上質な毛先 */}
    <path d="M32 16C34 14 38 10 40 8C39 12 36 17 35 19L32 16Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
    {/* 絵の具の雫 */}
    <circle cx="41" cy="7" r="1.5" fill="#60A5FA" />
  </svg>
);

/**
 * 「おおきなカボチャ」のSVGイラストアイコン
 * 説明:「自分の体よりもはるかに立派でずっしりと重い濃緑色の南瓜。いったいどうやって持ってきたのだろうか…」
 */
export const LargePumpkinIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="large-pumpkin-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lpGreenGrad" x1="12" y1="14" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="50%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
    </defs>
    {/* 影 */}
    <ellipse cx="24" cy="41" rx="16" ry="4" fill="#000000" fillOpacity="0.15" />
    {/* 太いヘタ */}
    <path d="M23 16C22 12 21 9 24 8C26 8 26 11 25 16" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    {/* 外側のふくらみ */}
    <ellipse cx="16" cy="28" rx="8" ry="11" fill="url(#lpGreenGrad)" stroke="#052E16" strokeWidth="1.2" />
    <ellipse cx="32" cy="28" rx="8" ry="11" fill="url(#lpGreenGrad)" stroke="#052E16" strokeWidth="1.2" />
    {/* 中間のふくらみ */}
    <ellipse cx="20" cy="28" rx="7.5" ry="11.5" fill="url(#lpGreenGrad)" stroke="#052E16" strokeWidth="1.2" />
    <ellipse cx="28" cy="28" rx="7.5" ry="11.5" fill="url(#lpGreenGrad)" stroke="#052E16" strokeWidth="1.2" />
    {/* 中央のふくらみ */}
    <ellipse cx="24" cy="28" rx="6" ry="12" fill="#16A34A" stroke="#052E16" strokeWidth="1.2" />
    {/* ハイライト・斑点 */}
    <ellipse cx="22" cy="22" rx="1.5" ry="3" fill="#4ADE80" fillOpacity="0.4" />
    <circle cx="28" cy="24" r="1" fill="#4ADE80" fillOpacity="0.4" />
  </svg>
);

/**
 * 「ちいさな豆電球」のSVGイラストアイコン
 * 説明:「実験器具から外してきたのか、フィラメントが繊細に残っている丸くて小さな豆電球。」
 */
export const MiniLightBulbIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="mini-light-bulb-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mlbGlassGrad" x1="16" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#FDE047" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FEF9C3" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* 光輪 */}
    <circle cx="24" cy="20" r="14" fill="#FEF08A" fillOpacity="0.25" />
    {/* ガラス球本体 */}
    <path
      d="M24 10C18 10 15 15 15 21C15 25 18 27 19 30H29C30 27 33 25 33 21C33 15 30 10 24 10Z"
      fill="url(#mlbGlassGrad)"
      stroke="#EAB308"
      strokeWidth="1.5"
    />
    {/* フィラメント */}
    <path d="M21 28V20L23 17L25 17L27 20V28" stroke="#CA8A04" strokeWidth="1" strokeLinejoin="round" />
    {/* ソケットネジ部 */}
    <rect x="19" y="30" width="10" height="3" rx="1" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
    <rect x="20" y="33" width="8" height="3" rx="1" fill="#B45309" stroke="#92400E" strokeWidth="0.8" />
    {/* 底面接点 */}
    <path d="M22 36C22 37.5 26 37.5 26 36" fill="#475569" stroke="#334155" strokeWidth="1" />
    {/* ガラスの反射 */}
    <path d="M18 15C19 13 22 12 24 12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 「つやつやの布」のSVGイラストアイコン
 * 説明:「光の加減で優美な光沢を放つシルクの布切れ。とても手触りがよく、寝床から引き抜いてきたらしい。」
 */
export const GlossyClothIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="glossy-cloth-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="gcSilkGrad" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="40%" stopColor="#C084FC" />
        <stop offset="80%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="15" ry="3.5" fill="#000000" fillOpacity="0.1" />
    {/* ドレープの布 */}
    <path
      d="M12 16C16 14 22 18 28 15C34 12 37 16 36 22C35 28 32 34 26 36C20 38 14 34 12 28C10 22 10 18 12 16Z"
      fill="url(#gcSilkGrad)"
      stroke="#6B21A8"
      strokeWidth="1.5"
    />
    {/* しわ・ドレープライン */}
    <path d="M16 19C20 22 24 28 26 35" stroke="#E9D5FF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
    <path d="M26 17C28 21 30 26 31 32" stroke="#581C87" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 26C18 27 22 30 25 33" stroke="#FDF4FF" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.9" />
  </svg>
);

/**
 * 「ちえのわ」のSVGイラストアイコン
 * 説明:「複雑に絡み合った二つの金属の輪。猫の前足でガチャガチャと弄ばれた跡がある。」
 */
export const PuzzleRingIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="puzzle-ring-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="prSilverGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="40%" stopColor="#CBD5E1" />
        <stop offset="80%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="40" rx="14" ry="3.5" fill="#000000" fillOpacity="0.1" />
    {/* リング1（左側） */}
    <path
      d="M20 14C14 14 10 19 10 25C10 31 14 36 20 36C26 36 29 31 29 27"
      stroke="url(#prSilverGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* リング2（右側で絡み合う） */}
    <path
      d="M28 34C34 34 38 29 38 23C38 17 34 12 28 12C22 12 19 17 19 21"
      stroke="url(#prSilverGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* ハイライト */}
    <circle cx="14" cy="19" r="1.5" fill="#FFFFFF" />
    <circle cx="34" cy="29" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 「おうごんの小判」のSVGイラストアイコン
 * 説明:「純金製でずっしりと重く、「壱両」の極印が打たれた正真正銘の江戸時代の本物の小判。」
 */
export const GoldenKobanIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="golden-koban-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="gkGoldGrad" x1="14" y1="6" x2="34" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="25%" stopColor="#FACC15" />
        <stop offset="60%" stopColor="#EAB308" />
        <stop offset="85%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="#000000" fillOpacity="0.15" />
    {/* 小判の楕円形 */}
    <rect
      x="15"
      y="8"
      width="18"
      height="32"
      rx="9"
      fill="url(#gkGoldGrad)"
      stroke="#854D0E"
      strokeWidth="1.8"
    />
    {/* ござ目模様（横縞の刻み） */}
    <line x1="17" y1="12" x2="31" y2="12" stroke="#CA8A04" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <line x1="16" y1="16" x2="32" y2="16" stroke="#CA8A04" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <line x1="16" y1="20" x2="32" y2="20" stroke="#CA8A04" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <line x1="16" y1="28" x2="32" y2="28" stroke="#CA8A04" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <line x1="16" y1="32" x2="32" y2="32" stroke="#CA8A04" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <line x1="17" y1="36" x2="31" y2="36" stroke="#CA8A04" strokeWidth="1" strokeDasharray="1.5 1.5" />
    {/* 中央の「壱両」極印の枠と文字表現 */}
    <rect x="21" y="22" width="6" height="4" rx="0.8" fill="#FEF08A" stroke="#854D0E" strokeWidth="0.8" />
    <path d="M22.5 24H25.5" stroke="#854D0E" strokeWidth="0.8" />
    {/* まばゆい輝き */}
    <path d="M12 12L13 14L15 15L13 16L12 18L11 16L9 15L11 14L12 12Z" fill="#FDE047" />
    <path d="M36 28L37 30L39 31L37 32L36 34L35 32L33 31L35 30L36 28Z" fill="#FDE047" />
  </svg>
);

/**
 * 「こだいのコンパス」のSVGイラストアイコン
 * 説明:「失われた古代の航路を指し示すかのように、磁北ではない特定の場所を常に指し続ける羅針盤。」
 */
export const AncientCompassIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="ancient-compass-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="acBrassGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.14" />
    {/* 上部リング */}
    <circle cx="24" cy="8" r="3" fill="none" stroke="#D97706" strokeWidth="1.8" />
    {/* 真鍮の円形ケース */}
    <circle cx="24" cy="25" r="15" fill="url(#acBrassGrad)" stroke="#78350F" strokeWidth="1.8" />
    {/* 文字盤（ダークネイビー） */}
    <circle cx="24" cy="25" r="12" fill="#0F172A" stroke="#D97706" strokeWidth="1" />
    {/* 方位目盛 */}
    <line x1="24" y1="14" x2="24" y2="17" stroke="#FDE68A" strokeWidth="1.2" />
    <line x1="24" y1="33" x2="24" y2="36" stroke="#FDE68A" strokeWidth="1.2" />
    <line x1="13" y1="25" x2="16" y2="25" stroke="#FDE68A" strokeWidth="1.2" />
    <line x1="32" y1="25" x2="35" y2="25" stroke="#FDE68A" strokeWidth="1.2" />
    {/* 磁針（北: 赤金、南: 水色） */}
    <polygon points="24,15 26.5,25 21.5,25" fill="#EF4444" stroke="#991B1B" strokeWidth="0.6" />
    <polygon points="24,35 26.5,25 21.5,25" fill="#38BDF8" stroke="#0369A1" strokeWidth="0.6" />
    <circle cx="24" cy="25" r="2" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
    {/* ガラスの反射 */}
    <path d="M16 19C19 15 27 15 31 18" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
);

/**
 * 「たまむしの羽根」のSVGイラストアイコン
 * 説明:「見る角度によってエメラルドや紫に色を変える、玉虫厨子にも使われた奇跡の構造色を持つ翅。」
 */
export const JewelBeetleWingIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="jewel-beetle-wing-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="jbwWingGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="30%" stopColor="#06B6D4" />
        <stop offset="70%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="12" ry="3.5" fill="#000000" fillOpacity="0.12" />
    {/* 鞘翅のシャープな楕円形 */}
    <path
      d="M24 8C17 12 14 24 16 34C18 39 24 41 26 40C29 36 34 22 31 13C29 9 26 8 24 8Z"
      fill="url(#jbwWingGrad)"
      stroke="#047857"
      strokeWidth="1.5"
    />
    {/* 翅の縦ライン（構造色の筋） */}
    <path d="M22 11C18 20 18 31 20 37" stroke="#A7F3D0" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
    <path d="M25 9C24 19 25 31 25 39" stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.9" />
    <path d="M28 12C29 20 30 28 29 35" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
    {/* 煌めき */}
    <circle cx="21" cy="17" r="1.5" fill="#FFFFFF" />
    <path d="M12 22L12.7 23.5L14 24L12.7 24.5L12 26L11.3 24.5L10 24L11.3 23.5L12 22Z" fill="#34D399" />
  </svg>
);

/**
 * 「うさんくさい自己啓発本」のSVGイラストアイコン
 * 説明:「「猫のように生きれば年収1億円」と金文字で書かれた、どこか怪しげな魅力にあふれる単行本。」
 */
export const ShadySelfHelpBookIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="shady-self-help-book-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ssbCoverGrad" x1="14" y1="8" x2="34" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BE185D" />
        <stop offset="50%" stopColor="#881337" />
        <stop offset="100%" stopColor="#4C0519" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.14" />
    {/* 本のページ束（小口） */}
    <rect x="15" y="10" width="20" height="28" rx="2" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
    {/* 本の表紙 */}
    <path
      d="M13 9C13 8 14 7 15 7H33C34 7 35 8 35 9V37C35 38 34 39 33 39H15C14 39 13 38 13 37V9Z"
      fill="url(#ssbCoverGrad)"
      stroke="#4C0519"
      strokeWidth="1.5"
    />
    {/* 金文字のタイトル風ライン */}
    <rect x="17" y="12" width="14" height="2" rx="0.5" fill="#FDE047" />
    <rect x="19" y="16" width="10" height="1.8" rx="0.5" fill="#FACC15" />
    {/* 表紙の怪しい猫シルエット */}
    <circle cx="24" cy="22" r="2.5" fill="#FDE047" />
    {/* 黄色い帯 */}
    <rect x="13" y="27" width="22" height="8" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
    {/* 帯の「1億」風の赤文字マーク */}
    <rect x="17" y="30" width="14" height="2" rx="0.5" fill="#DC2626" />
    {/* 怪しいきらめき星 */}
    <path d="M37 11L37.8 12.8L39.5 13.5L37.8 14.2L37 16L36.2 14.2L34.5 13.5L36.2 12.8L37 11Z" fill="#FACC15" />
  </svg>
);

/**
 * 「きせきのエラーコイン」のSVGイラストアイコン
 * 説明:「表と裏で図柄が大きくズレて刻印された、貨幣コレクターが目の色を変えて探し求める幻の硬貨。」
 */
export const MiracleErrorCoinIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="miracle-error-coin-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mecBaseGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="50%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="mecErrorGrad" x1="16" y1="12" x2="36" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000000" fillOpacity="0.14" />
    {/* コイン基盤の円 */}
    <circle cx="24" cy="24" r="15" fill="url(#mecBaseGrad)" stroke="#475569" strokeWidth="1.8" />
    {/* 大きく中心からズレた型押し（エラーコインの醍醐味） */}
    <circle cx="28" cy="21" r="12" fill="none" stroke="url(#mecErrorGrad)" strokeWidth="2" strokeDasharray="3 1.5" />
    <circle cx="28" cy="21" r="8" fill="url(#mecErrorGrad)" fillOpacity="0.25" stroke="#CA8A04" strokeWidth="1" />
    {/* ズレた中心の模様 */}
    <polygon points="28,16 30,20 34,21 31,23 32,27 28,25 24,27 25,23 22,21 26,20" fill="#FDE047" stroke="#A16207" strokeWidth="0.8" />
    {/* 刻印のはみ出し段差 */}
    <path d="M12 20C14 16 18 13 23 11" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 「やみの結晶」のSVGイラストアイコン
 * 説明:「周囲の光を吸い込むように深く暗い黒紫に輝く、冥界の魔力を秘めた未知の鉱物の結晶。」
 */
export const DarkCrystalIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="dark-crystal-icon"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dcCrystalGrad" x1="14" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="35%" stopColor="#6B21A8" />
        <stop offset="70%" stopColor="#3B0764" />
        <stop offset="100%" stopColor="#18022E" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="41" rx="14" ry="4" fill="#000000" fillOpacity="0.2" />
    {/* 闇の魔力オーラ */}
    <path
      d="M24 6C15 15 13 30 24 40C35 30 33 15 24 6Z"
      fill="#581C87"
      fillOpacity="0.3"
    />
    {/* メインクリスタル（幾何学的ファセット） */}
    <polygon points="24,8 33,20 29,38 19,38 15,20" fill="url(#dcCrystalGrad)" stroke="#C084FC" strokeWidth="1.2" />
    {/* ファセット分割線 */}
    <polygon points="24,8 24,38 19,38 15,20" fill="#3B0764" fillOpacity="0.5" stroke="#A855F7" strokeWidth="0.8" />
    <line x1="24" y1="8" x2="24" y2="38" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.9" />
    <line x1="15" y1="20" x2="24" y2="26" stroke="#C084FC" strokeWidth="0.8" />
    <line x1="33" y1="20" x2="24" y2="26" stroke="#C084FC" strokeWidth="0.8" />
    {/* 漂う闇のパーティクル */}
    <circle cx="12" cy="16" r="1.5" fill="#C084FC" />
    <circle cx="36" cy="14" r="1.5" fill="#E9D5FF" />
    <circle cx="10" cy="28" r="1" fill="#A855F7" />
    <circle cx="37" cy="30" r="1.2" fill="#C084FC" />
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
  /** レアリティ（未入手時にレア用の金色?アイコンを描画するために利用可能） */
  rarity?: GiftRarity;
}

/**
 * おくりものIDに応じた専用SVGイラストを描画するディスパッチャーコンポーネント
 */
export const GiftIcon: React.FC<GiftIconProps> = ({
  giftId,
  className = 'w-8 h-8',
  isAcquired = true,
  rarity,
}) => {
  const targetGift = giftId ? CAT_GIFTS.find((g) => g.id === giftId) : undefined;
  const resolvedRarity = rarity ?? targetGift?.rarity ?? 'common';
  const isRare = resolvedRarity === 'rare';

  if (!isAcquired) {
    return <UnknownGiftIcon className={className} isRare={isRare} rarity={resolvedRarity} />;
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
    case 'four-leaf-clover':
      return <FourLeafCloverIcon className={className} />;
    case 'mossy-pebble':
      return <MossyPebbleIcon className={className} />;
    case 'old-stamp':
      return <OldStampIcon className={className} />;
    case 'hairpin':
      return <HairpinIcon className={className} />;
    case 'wilted-flower':
      return <WiltedFlowerIcon className={className} />;
    case 'cicada-shell':
      return <CicadaShellIcon className={className} />;
    case 'white-dice':
      return <WhiteDiceIcon className={className} />;
    case 'glass-marble':
      return <GlassMarbleIcon className={className} />;
    case 'dirty-plush':
      return <DirtyPlushIcon className={className} />;
    case 'single-sock':
      return <SingleSockIcon className={className} />;
    case 'sunflower-seed':
      return <SunflowerSeedIcon className={className} />;
    case 'snack-wrapper':
      return <SnackWrapperIcon className={className} />;
    case 'skewer':
      return <SkewerIcon className={className} />;
    case 'ice-stick':
      return <IceStickIcon className={className} />;
    case 'important-paper':
      return <ImportantPaperIcon className={className} />;
    case 'blue-can':
      return <BlueCanIcon className={className} />;
    case 'empty-bottle':
      return <EmptyBottleIcon className={className} />;
    case 'pink-handkerchief':
      return <PinkHandkerchiefIcon className={className} />;
    case 'candy-wrapper':
      return <CandyWrapperIcon className={className} />;
    case 'bento-baran':
      return <BentoBaranIcon className={className} />;
    case 'super-ball':
      return <SuperBallIcon className={className} />;
    case 'small-bell':
      return <SmallBellIcon className={className} />;
    case 'red-gem':
      return <RedGemIcon className={className} />;
    case 'blue-gem':
      return <BlueGemIcon className={className} />;
    case 'yellow-gem':
      return <YellowGemIcon className={className} />;
    case 'winning-ice-stick':
      return <WinningIceStickIcon className={className} />;
    case 'dragon-scale':
      return <DragonScaleIcon className={className} />;
    case 'dragon-claw':
      return <DragonClawIcon className={className} />;
    case 'star-fragment':
      return <StarFragmentIcon className={className} />;
    case 'ancient-gear':
      return <AncientGearIcon className={className} />;
    case 'splendid-branch':
      return <SplendidBranchIcon className={className} />;
    case 'curious-magatama':
      return <CuriousMagatamaIcon className={className} />;
    case 'glowing-moss-stone':
      return <GlowingMossStoneIcon className={className} />;
    case 'broken-rubber-band':
      return <BrokenRubberBandIcon className={className} />;
    case 'crumpled-aluminum':
      return <CrumpledAluminumIcon className={className} />;
    case 'cardboard-scrap':
      return <CardboardScrapIcon className={className} />;
    case 'cat-whisker':
      return <CatWhiskerIcon className={className} />;
    case 'torn-receipt':
      return <TornReceiptIcon className={className} />;
    case 'hairball':
      return <HairballIcon className={className} />;
    case 'twisted-wire':
      return <TwistedWireIcon className={className} />;
    case 'withered-foxtail':
      return <WitheredFoxtailIcon className={className} />;
    case 'dented-pingpong-ball':
      return <DentedPingpongBallIcon className={className} />;
    case 'lizard-tail':
      return <LizardTailIcon className={className} />;
    case 'soft-dandelion':
      return <SoftDandelionIcon className={className} />;
    case 'jelly-cup':
      return <JellyCupIcon className={className} />;
    case 'plastic-bottle-cap':
      return <PlasticBottleCapIcon className={className} />;
    case 'cicada-wing':
      return <CicadaWingIcon className={className} />;
    case 'yarn-scrap':
      return <YarnScrapIcon className={className} />;
    case 'single-rose':
      return <SingleRoseIcon className={className} />;
    case 'beautiful-bell':
      return <BeautifulBellIcon className={className} />;
    case 'shiny-coin':
      return <ShinyCoinIcon className={className} />;
    case 'sparkling-seashell':
      return <SparklingSeashellIcon className={className} />;
    case 'light-driftwood':
      return <LightDriftwoodIcon className={className} />;
    case 'cat-acrylic-stand':
      return <CatAcrylicStandIcon className={className} />;
    case 'large-bonito-flake':
      return <LargeBonitoFlakeIcon className={className} />;
    case 'snake-shedding':
      return <SnakeSheddingIcon className={className} />;
    case 'round-bulb':
      return <RoundBulbIcon className={className} />;
    case 'luxury-paintbrush':
      return <LuxuryPaintbrushIcon className={className} />;
    case 'large-pumpkin':
      return <LargePumpkinIcon className={className} />;
    case 'mini-light-bulb':
      return <MiniLightBulbIcon className={className} />;
    case 'glossy-cloth':
      return <GlossyClothIcon className={className} />;
    case 'puzzle-ring':
      return <PuzzleRingIcon className={className} />;
    case 'golden-koban':
      return <GoldenKobanIcon className={className} />;
    case 'ancient-compass':
      return <AncientCompassIcon className={className} />;
    case 'jewel-beetle-wing':
      return <JewelBeetleWingIcon className={className} />;
    case 'shady-self-help-book':
      return <ShadySelfHelpBookIcon className={className} />;
    case 'miracle-error-coin':
      return <MiracleErrorCoinIcon className={className} />;
    case 'dark-crystal':
      return <DarkCrystalIcon className={className} />;
    default:
      return <DefaultGiftIcon className={className} />;
  }
};
