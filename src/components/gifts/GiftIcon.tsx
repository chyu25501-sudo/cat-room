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
 * 説明:「洗濯カゴから引っ張り出してきた、しましま模様の片方だけの小さな靴下。」
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
 * 説明:「よくわからないが請求書と書かれている。」
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
 * 未獲得（未発見）のおくりもの用プレースホルダーアイコン
 * isRare が true の場合、レアリティの高いおくりものだと分かるように金色背景で「？」を描画します。
 */
export const UnknownGiftIcon: React.FC<{ className?: string; isRare?: boolean }> = ({
  className = 'w-8 h-8',
  isRare = false,
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    data-testid="unknown-gift-icon"
    data-rare={isRare ? 'true' : 'false'}
    aria-hidden="true"
  >
    <defs>
      {isRare ? (
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
      ) : null}
    </defs>
    <rect
      x="8"
      y="8"
      width="32"
      height="32"
      rx="10"
      fill={isRare ? 'url(#unknownRareGrad)' : '#F1F5F9'}
      stroke={isRare ? '#D97706' : '#CBD5E1'}
      strokeWidth={isRare ? '1.8' : '1.5'}
      strokeDasharray="3 3"
    />
    {isRare && (
      <>
        {/* レア感を引き立てるツヤ光沢と小さなきらめき星 */}
        <path d="M12 12C15 9 24 9 28 11" stroke="url(#unknownRareShine)" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 14L35 16L37 17L35 18L34 20L33 18L31 17L33 16L34 14Z" fill="#FFFFFF" fillOpacity="0.9" />
      </>
    )}
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fill={isRare ? '#78350F' : '#94A3B8'}
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
  const isRare =
    rarity === 'rare' ||
    (giftId ? CAT_GIFTS.find((g) => g.id === giftId)?.rarity === 'rare' : false);

  if (!isAcquired) {
    return <UnknownGiftIcon className={className} isRare={isRare} />;
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
    default:
      return <DefaultGiftIcon className={className} />;
  }
};
