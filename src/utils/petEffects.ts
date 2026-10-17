/**
 * 猫をなでた時のハート・キラキラ・音符エフェクトの計算ロジック（純粋関数）
 */

export type EffectType = 'heart' | 'sparkle' | 'note';

export const EFFECT_TYPES: readonly EffectType[] = ['heart', 'sparkle', 'note'];

export interface PetEffectParticle {
  id: string;
  type: EffectType;
  /** 開始位置（画面中央・親要素中心を基準としたオフセットpx） */
  offsetX: number;
  offsetY: number;
  /** サイズ（px）：従来の2倍（約36〜44px） */
  size: number;
  /** 揺れの方向 ('left' | 'right') */
  swayDirection: 'left' | 'right';
  /** アニメーション遅延（ms）: 時間差で自然に湧き上がる */
  delayMs: number;
  /** アニメーション時間（ms） */
  durationMs: number;
  /** カラークラス（Tailwind） */
  colorClass: string;
}

export interface PetEffectBurst {
  id: string;
  type: EffectType;
  particles: PetEffectParticle[];
}

/** 従来のサイズ（16〜20px）の約2倍となるサイズ範囲（36〜44px） */
export const MIN_PARTICLE_SIZE = 36;
export const MAX_PARTICLE_SIZE = 44;

/** エフェクトの基準Yオフセット（中央より少し上側、猫の胸・頭部付近） */
export const DEFAULT_BURST_BASE_OFFSET_Y = -55;

/** ハート用のカラーパレット（暖色系ピンク・ローズ・レッド） */
export const HEART_COLORS: readonly string[] = [
  'text-rose-500 fill-rose-400',
  'text-pink-500 fill-pink-400',
  'text-rose-400 fill-rose-300',
  'text-red-400 fill-rose-400',
];

/** キラキラ用のカラーパレット（ゴールド・アンバー・イエロー） */
export const SPARKLE_COLORS: readonly string[] = [
  'text-amber-400 fill-amber-300',
  'text-yellow-400 fill-yellow-300',
  'text-amber-300 fill-amber-200',
  'text-orange-400 fill-amber-300',
];

/** 音符用のカラーパレット（カラフルなスカイブルー・バイオレット・エメラルド・ピンク・アンバー） */
export const NOTE_COLORS: readonly string[] = [
  'text-sky-500',
  'text-violet-500',
  'text-emerald-500',
  'text-pink-500',
  'text-amber-500',
];

export function getColorsForType(type: EffectType): readonly string[] {
  switch (type) {
    case 'heart':
      return HEART_COLORS;
    case 'sparkle':
      return SPARKLE_COLORS;
    case 'note':
      return NOTE_COLORS;
  }
}

/**
 * ハート・キラキラ・音符からランダムに1種類を選択する純粋関数
 */
export function pickRandomEffectType(randomFn: () => number = Math.random): EffectType {
  const index = Math.floor(randomFn() * EFFECT_TYPES.length);
  return EFFECT_TYPES[Math.min(index, EFFECT_TYPES.length - 1)];
}

export interface GenerateClusterOptions {
  type: EffectType;
  count: number;
  /** クラスターの中心座標（中心からのオフセットpx） */
  clusterCenterX: number;
  clusterCenterY: number;
  /** クラスター内での粒子の散らばり半径（px） */
  spreadRadius?: number;
  idPrefix?: string;
  randomFn?: () => number;
}

/**
 * 同種のエフェクト粒子がまとまって湧き出る「クラスター」を生成する純粋関数
 */
export function generateParticleCluster({
  type,
  count,
  clusterCenterX,
  clusterCenterY,
  spreadRadius = 30,
  idPrefix = 'particle',
  randomFn = Math.random,
}: GenerateClusterOptions): PetEffectParticle[] {
  const particles: PetEffectParticle[] = [];
  const colors = getColorsForType(type);

  for (let i = 0; i < count; i++) {
    // クラスター中心の周りにまとまって配置（ある程度のランダム性を持たせる）
    const angle = randomFn() * 2 * Math.PI;
    const distance = randomFn() * spreadRadius;
    const offsetX = Math.round(clusterCenterX + Math.cos(angle) * distance);
    const offsetY = Math.round(clusterCenterY + Math.sin(angle) * distance);

    // 従来の約2倍のサイズ（36〜44px）
    const size = Math.round(
      MIN_PARTICLE_SIZE + randomFn() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE)
    );

    // 左右の揺れ方向を分散
    const swayDirection: 'left' | 'right' =
      randomFn() > 0.5 ? 'left' : 'right';

    // ふわふわと時間差で湧き上がる遅延（0〜240ms）
    const delayMs = Math.round(i * 60 + randomFn() * 40);

    // 1100〜1400msのアニメーション時間
    const durationMs = Math.round(1100 + randomFn() * 300);

    const colorClass = colors[i % colors.length];

    particles.push({
      id: `${idPrefix}-${type}-${i}`,
      type,
      offsetX,
      offsetY,
      size,
      swayDirection,
      delayMs,
      durationMs,
      colorClass,
    });
  }

  return particles;
}

export interface GenerateBurstOptions {
  burstId?: string;
  /** 特定の種類を明示する場合（未指定時はハート・キラキラ・音符からランダムに1種類） */
  type?: EffectType;
  /** 基準Y座標（未指定時は少し上の DEFAULT_BURST_BASE_OFFSET_Y） */
  baseOffsetY?: number;
  randomFn?: () => number;
}

/**
 * 撫でたときに画面中央付近（少し上側）から出現するエフェクト一式を生成する純粋関数
 * ハート・キラキラ・音符の中から「一度に一種類だけ」が選ばれ、
 * まとまり（3〜4個）として生成されます
 */
export function generatePetEffectBurst({
  burstId = `burst-${Date.now()}`,
  type,
  baseOffsetY = DEFAULT_BURST_BASE_OFFSET_Y,
  randomFn = Math.random,
}: GenerateBurstOptions = {}): PetEffectParticle[] {
  // 一度に一種類だけを選択（指定がなければランダムで1種類決定）
  const selectedType: EffectType = type ?? pickRandomEffectType(randomFn);

  // 画面中央より少し上側（猫の胸・頭付近）を基準位置とする
  const centerJitterX = (randomFn() - 0.5) * 50;
  const centerJitterY = baseOffsetY + (randomFn() - 0.5) * 24;

  const count = 3 + Math.floor(randomFn() * 2); // 3〜4個

  return generateParticleCluster({
    type: selectedType,
    count,
    clusterCenterX: centerJitterX,
    clusterCenterY: centerJitterY,
    spreadRadius: 30,
    idPrefix: burstId,
    randomFn,
  });
}
