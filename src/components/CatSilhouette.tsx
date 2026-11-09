import React, { useState, useCallback, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { CatPreset, CAT_PRESETS, CatId } from '../types/cat.ts';
import { BlackCat, CatShapeProps } from './cats/BlackCat.tsx';
import { WhiteCat } from './cats/WhiteCat.tsx';
import { useCatPetting, type PetEventDetail } from '../hooks/useCatPetting.ts';
import { DEFAULT_PET_COOLDOWN_MS, type Point } from '../utils/stroke.ts';
import { CatMoodLevel } from '../types/mood.ts';
import { FoodItem, ToyItem } from '../types/care.ts';
import { FoodDish } from './care/FoodDish.tsx';
import { ToyItemView } from './care/ToyItemView.tsx';
import {
  generatePetEffectBurst,
  type PetEffectBurst,
} from '../utils/petEffects.ts';
import { MusicalNoteIcon } from './effects/MusicalNoteIcon.tsx';

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
  /** 猫の現在の機嫌レベル（機嫌に応じて反応・エフェクトが変化） */
  moodLevel?: CatMoodLevel;
  /** 現在猫が食べているごはん（未給餌時はnullまたは未指定） */
  activeFood?: FoodItem | null;
  /** 食事中アニメーション中かどうか */
  isEating?: boolean;
  /** 現在猫が遊んでいるおもちゃ（遊んでいない時はnullまたは未指定） */
  activeToy?: ToyItem | null;
  /** おもちゃ遊び中アニメーション中かどうか */
  isPlayingToy?: boolean;
  /** 猫をなでた（ドラッグストローク完了）ときのコールバック */
  onPet?: (detail?: PetEventDetail) => void;
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
  moodLevel = 'normal',
  activeFood = null,
  isEating = false,
  activeToy = null,
  isPlayingToy = false,
  onPet,
  strokeThreshold,
  cooldownMs,
  onClick,
  className = '',
}) => {
  const ActiveCatComponent = CAT_COMPONENTS[preset.id] ?? BlackCat;

  const effectiveCooldownMs = cooldownMs ?? DEFAULT_PET_COOLDOWN_MS;

  // 画面中央から湧き上がるエフェクトバーストのリスト（常に最新の1バーストのみを保持）
  const [bursts, setBursts] = useState<PetEffectBurst[]>([]);
  const lastEffectTimeRef = useRef<number>(0);

  // なでたカーソル位置（origin）の周辺から湧き上がるエフェクトを発生（機嫌が良いほど華やか、不機嫌時は抑止）
  const triggerPetEffect = useCallback(
    (origin?: Point) => {
      // 不機嫌（愛撫誘発性攻撃行動中）は好意的なエフェクトを発生させない
      if (moodLevel === 'annoyed') {
        setBursts([]);
        return;
      }

      const now = Date.now();
      // クールダウン以内の連続・重複呼び出しを抑制し、音の再生頻度と1:1で同期
      if (now - lastEffectTimeRef.current < effectiveCooldownMs) {
        return;
      }
      lastEffectTimeRef.current = now;

      const burstId = `burst-${now}-${Math.random().toString(36).slice(2, 7)}`;
      // なでたカーソル位置および機嫌レベルに応じたエフェクト粒子群を生成
      const particles = generatePetEffectBurst({ burstId, origin, moodLevel });
      // 常に最新のバースト1組のみを表示（古いバーストと重なって二重発生に見えるのを防止）
      setBursts([{ id: burstId, particles }]);

      // アニメーション完了（約1.5秒）後に古いバーストを消去
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 1500);
    },
    [effectiveCooldownMs, moodLevel]
  );

  const handlePetAction = useCallback(
    (detail?: PetEventDetail) => {
      triggerPetEffect(detail?.relativeOffset);
      if (onPet) {
        onPet(detail);
      } else if (onClick) {
        onClick();
      }
    },
    [onPet, onClick, triggerPetEffect]
  );

  // ドラッグ操作による「なでる」インタラクション（クールダウンで長いストローク時の過剰反応を制御）
  const { isDragging, handlers } = useCatPetting({
    onPet: handlePetAction,
    threshold: strokeThreshold,
    cooldownMs: effectiveCooldownMs,
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
        {/* 撫でたときに画面中央より少し上から湧き上がって正弦曲線状に揺れ動くエフェクト演出 */}
        <div
          data-testid="pet-effects-container"
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30"
          aria-hidden="true"
        >
          {bursts.map((burst) =>
            burst.particles.map((particle) => {
              const isLeft = particle.swayDirection === 'left';
              const isBeamedNote =
                particle.id.endsWith('-0') || particle.id.endsWith('-2');

              return (
                <div
                  key={particle.id}
                  data-testid={`effect-particle-${particle.type}`}
                  className="absolute pointer-events-none animate-rise-up"
                  style={{
                    left: `calc(50% + ${particle.offsetX}px)`,
                    top: `calc(50% + ${particle.offsetY}px)`,
                    animationDelay: `${particle.delayMs}ms`,
                    animationDuration: `${particle.durationMs}ms`,
                  }}
                >
                  <div
                    className={isLeft ? 'animate-sway-left' : 'animate-sway-right'}
                    style={{
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
                      <MusicalNoteIcon
                        size={particle.size}
                        variant={isBeamedNote ? 'beamed' : 'single'}
                        className={`${particle.colorClass} drop-shadow-md`}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 猫のSVGシルエット表示エリア（猫種切り替え時にも高さが変わらない固定ステージ） */}
        <div
          className={`relative w-64 sm:w-72 h-64 sm:h-72 flex items-end justify-center transition-all duration-300 ${
            isEating || isPlayingToy
              ? 'scale-105 -translate-y-1'
              : isReacting || isDragging
              ? 'scale-105 -translate-y-1'
              : 'group-hover:-translate-y-0.5'
          }`}
        >
          <ActiveCatComponent
            isReacting={isReacting || isDragging || isEating || isPlayingToy}
            moodLevel={moodLevel}
          />

          {/* 食事中のごはん皿イラスト（猫の足元手前に描画） */}
          {activeFood && (
            <div
              data-testid="active-food-dish"
              className="absolute -bottom-2 z-20 pointer-events-none drop-shadow-lg"
            >
              <FoodDish food={activeFood} isEating={isEating} />
            </div>
          )}

          {/* 遊び中のおもちゃイラスト（猫の足元手前に描画） */}
          {activeToy && (
            <div
              data-testid="active-toy-item"
              className="absolute -bottom-2 z-20 pointer-events-none drop-shadow-lg"
            >
              <ToyItemView toy={activeToy} isPlaying={isPlayingToy} />
            </div>
          )}
        </div>

        {/* 足元のインタラクションガイドバッジ（機嫌に応じたメッセージ変化） */}
        <div
          className={`mt-3 px-3 py-1 rounded-full border text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xs transition-colors ${
            isEating || isPlayingToy
              ? 'bg-amber-100/90 border-amber-300 text-amber-900'
              : moodLevel === 'annoyed'
              ? 'bg-rose-100/90 border-rose-200 text-rose-700'
              : 'bg-orange-100/80 border-orange-200/60 text-stone-600 group-hover:bg-orange-200/80 group-hover:text-orange-900'
          }`}
        >
          <span>
            {isEating && activeFood
              ? `モグモグ…♪（${activeFood.name}をお食事中）`
              : isPlayingToy && activeToy
              ? `ワクワク…♪（${activeToy.name}であそび中）`
              : moodLevel === 'annoyed'
              ? 'なですぎ注意！少し休ませてあげよう'
              : moodLevel === 'ecstatic'
              ? 'ゴロゴロ…♡（ごきげんMAX）'
              : moodLevel === 'happy'
              ? 'うれしそうになでられています♪'
              : 'なでなで（ドラッグ）してふれあう'}
          </span>
        </div>
      </button>
    </div>
  );
};
