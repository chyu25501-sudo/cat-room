import React from 'react';

export interface MusicalNoteIconProps {
  size: number;
  className?: string;
  variant?: 'beamed' | 'single';
}

/**
 * 音符エフェクト用SVGコンポーネント
 * 丸い玉（符頭）の部分のみ塗りつぶし、棒や桁（符幹・桁・旗）は輪郭線のみで描画します
 */
export const MusicalNoteIcon: React.FC<MusicalNoteIconProps> = ({
  size,
  className = '',
  variant = 'beamed',
}) => {
  if (variant === 'single') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        data-testid="musical-note-icon"
      >
        {/* 符幹と旗：輪郭線のみ（内側は塗りつぶさない） */}
        <path d="M11 18V3c3.5 0 7 2.2 7 6.5" fill="none" />
        {/* 符頭：丸い玉の部分のみ塗りつぶし */}
        <ellipse
          cx="7.5"
          cy="18"
          rx="3.5"
          ry="2.8"
          transform="rotate(-15 7.5 18)"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      data-testid="musical-note-icon"
    >
      {/* 符幹と桁：輪郭線のみ（内側は塗りつぶさない） */}
      <path d="M9 18V5l12-2v13" fill="none" />
      {/* 符頭：丸い玉の部分のみ塗りつぶし */}
      <ellipse
        cx="6"
        cy="18"
        rx="3.2"
        ry="2.6"
        transform="rotate(-15 6 18)"
        fill="currentColor"
      />
      <ellipse
        cx="18"
        cy="16"
        rx="3.2"
        ry="2.6"
        transform="rotate(-15 18 16)"
        fill="currentColor"
      />
    </svg>
  );
};

