import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Heart, Sparkles, Music, Music2 } from 'lucide-react';
import { CatPreset, CAT_PRESETS, CatId } from '../types/cat.ts';
import { BlackCat, CatShapeProps } from './cats/BlackCat.tsx';
import { WhiteCat } from './cats/WhiteCat.tsx';
import { useCatPetting } from '../hooks/useCatPetting.ts';
import {
  generatePetEffectBurst,
  type PetEffectBurst,
} from '../utils/petEffects.ts';

/**
 * 将来的な猫の種類増加に対応した猫シルエットコンポーネントマップ
 */
const CAT_COMPONENTS: Record<CatId, React.FC<CatShapeProps>> = {
  black: BlackCat,
  white: WhiteCat,
};

export interface CatSilhouetteProps {
  /** 表示する猫プリセット情報（未指定時はくろねこ） */
  preset?: CatPreset;
  /** 猫が反応中（鳴き声再生中・なでなで直後）かどうか */
  isReacting?: boolean;
  /** 猫をなでた（ドラッグストローク完了）ときのコールバック */
  onPet?: () => void;
  /** なでたと判定する移動距離のしきい値（ピクセル） */
  strokeThreshold?: number;
  /** なでた後のクールダウン時間（ミリ秒） */
  cooldownMs?: number;
  /** 後方互換用：クリック時のコールバック */
  onClick?: () => void;
  /** 追加クラス名 */
  className?: string;
}

export const CatSilhouette: React.FC<CatSilhouetteProps> = ({
  preset = CAT_PRESETS[0],
  isReacting = false,
  onPet,
  strokeThreshold,
  cooldownMs,
  onClick,
  className = '',
}) => {
  const ActiveCatComponent = CAT_COMPONENTS[preset.id] ?? BlackCat;

  // 画面中央から湧き上がるエフェクトバーストのリスト
  const [bursts, setBursts] = useState<PetEffectBurst[]>([]);
  const lastEffectTimeRef = useRef<number>(0);

  // 音の発生タイミング・頻度と完全に同期させてエフェクトを発生
  const triggerPetEffect = useCallback(() => {
    const now = Date.now();
    // 800ms以内の連続・重複呼び出しを抑制し、音の再生頻度と1:1で同期
    if (now - lastEffectTimeRef.current < 800) {
      return;
    }
    lastEffectTimeRef.current = now;

    const burstId = `burst-${now}-${Math.random().toString(36).slice(2, 7)}`;
    const particles = generatePetEffectBurst({ burstId });
    setBursts((prev) => [...prev, { id: burstId, particles }]);

    // アニメーション完了（約1.5秒）後に古いバーストを消去
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 1500);
  }, []);

  const handlePetAction = useCallback(() => {
    triggerPetEffect();
    if (onPet) {
      onPet();
    } else if (onClick) {
      onClick();
    }
  }, [onPet, onClick, triggerPetEffect]);

  // isReacting が外部から true に変化した場合（キーボード操作等）も同期してエフェクトを発生
  const prevIsReactingRef = useRef<boolean>(false);
  useEffect(() => {
    if (isReacting && !prevIsReactingRef.current) {
      triggerPetEffect();
    }
    prevIsReactingRef.current = isReacting;
  }, [isReacting, triggerPetEffect]);

  // ドラッグ操作による「なでる」インタラクション（クールダウンで長いストローク時の過剰反応を制御）
  const { isDragging, handlers } = useCatPetting({
    onPet: handlePetAction,
    threshold: strokeThreshold,
    cooldownMs,
  });

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* ドラッグ・なでなで可能な猫シルエット本体 */}
      <button
        type="button"
        {...handlers}
        onClick={onClick}
        aria-label={`${preset.name}のシルエット（ドラッグしてなでる）`}
        className={`group relative flex flex-col items-center justify-center p-2 rounded-3xl w-72 sm:w-80 h-[320px] sm:h-[352px] select-none transition-transform duration-200 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-orange-300 touch-none ${
          isDragging
            ? 'cursor-grabbing scale-102'
            : 'cursor-grab hover:scale-102 active:scale-95'
        }`}
      >
        {/* 撫でたときに画面中央付近から湧き上がって揺れ動くエフェクト演出（ハート・キラキラ・音符から一度に一種類） */}
        <div
          data-testid="pet-effects-container"
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30"
          aria-hidden="true"
        >
          {bursts.map((burst) =>
            burst.particles.map((particle) => {
              const isLeft = particle.swayDirection === 'left';
              return (
                <div
                  key={particle.id}
                  data-testid={`effect-particle-${particle.type}`}
                  className={`absolute pointer-events-none ${
                    isLeft ? 'animate-sway-left' : 'animate-sway-right'
                  }`}
                  style={{
                    left: `calc(50% + ${particle.offsetX}px)`,
                    top: `calc(50% + ${particle.offsetY}px)`,
                    animationDelay: `${particle.delayMs}ms`,
                    animationDuration: `${particle.durationMs}ms`,
                  }}
                >
                  {particle.type === 'heart' ? (
                    <Heart
                      style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                      }}
                      className={`${particle.colorClass} drop-shadow-md`}
                    />
                  ) : particle.type === 'sparkle' ? (
                    <Sparkles
                      style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                      }}
                      className={`${particle.colorClass} drop-shadow-md`}
                    />
                  ) : (
                    particle.id.endsWith('-0') || particle.id.endsWith('-2') ? (
                      <Music
                        style={{
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                        }}
                        className={`${particle.colorClass} drop-shadow-md`}
                      />
                    ) : (
                      <Music2
                        style={{
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                        }}
                        className={`${particle.colorClass} drop-shadow-md`}
                      />
                    )
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 猫のSVGシルエット表示エリア（猫種切り替え時にも高さが変わらない固定ステージ） */}
        <div
          className={`relative w-64 sm:w-72 h-64 sm:h-72 flex items-end justify-center transition-all duration-300 ${
            isReacting || isDragging
              ? 'scale-105 -translate-y-1'
              : 'group-hover:-translate-y-0.5'
          }`}
        >
          <ActiveCatComponent isReacting={isReacting || isDragging} />
        </div>

        {/* 足元のインタラクションガイドバッジ */}
        <div className="mt-3 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/60 text-stone-600 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xs group-hover:bg-orange-200/80 group-hover:text-orange-900 transition-colors">
          <span>なでなで（ドラッグ）してふれあう</span>
        </div>
      </button>
    </div>
  );
};
