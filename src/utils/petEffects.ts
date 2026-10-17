/**
 * 猫をなでた時のハート・キラキラエフェクトの計算ロジック（純粋関数）
 */

export type EffectType = 'heart' | 'sparkle';

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
  particles: PetEffectParticle[];
}

/** 従来のサイズ（16〜20px）の約2倍となるサイズ範囲（36〜44px） */
export const MIN_PARTICLE_SIZE = 36;
export const MAX_PARTICLE_SIZE = 44;

/** ハート用のカラーパレット */
export const HEART_COLORS: readonly string[] = [
  'text-rose-500 fill-rose-400',
  'text-pink-500 fill-pink-400',
  'text-rose-400 fill-rose-300',
  'text-red-400 fill-rose-400',
];

/** キラキラ用のカラーパレット */
export const SPARKLE_COLORS: readonly string[] = [
  'text-amber-400 fill-amber-300',
  'text-yellow-400 fill-yellow-300',
  'text-amber-300 fill-amber-200',
  'text-orange-400 fill-amber-300',
];

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
 * （ハートはハート、キラキラはキラキラでまとまって配置）
 */
export function generateParticleCluster({
  type,
  count,
  clusterCenterX,
  clusterCenterY,
  spreadRadius = 24,
  idPrefix = 'particle',
  randomFn = Math.random,
}: GenerateClusterOptions): PetEffectParticle[] {
  const particles: PetEffectParticle[] = [];
  const colors = type === 'heart' ? HEART_COLORS : SPARKLE_COLORS;

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
  randomFn?: () => number;
}

/**
 * 撫でたときに画面中央付近から出現するエフェクト一式を生成する純粋関数
 * ハートのまとまり（左寄り〜中央）とキラキラのまとまり（右寄り〜中央）をそれぞれ集約して生成します
 */
export function generatePetEffectBurst({
  burstId = `burst-${Date.now()}`,
  randomFn = Math.random,
}: GenerateBurstOptions = {}): PetEffectParticle[] {
  // 画面中央付近のランダムな基準位置（中心オフセット -20〜+20px）
  const centerJitterX = (randomFn() - 0.5) * 40;
  const centerJitterY = (randomFn() - 0.5) * 30;

  // ハートのまとまり（ハートはハートでまとまって配置: 3〜4個）
  const heartClusterCenterX = -45 + centerJitterX;
  const heartClusterCenterY = 5 + centerJitterY;
  const heartCount = 3 + Math.floor(randomFn() * 2); // 3〜4個

  const heartParticles = generateParticleCluster({
    type: 'heart',
    count: heartCount,
    clusterCenterX: heartClusterCenterX,
    clusterCenterY: heartClusterCenterY,
    spreadRadius: 28,
    idPrefix: burstId,
    randomFn,
  });

  // キラキラのまとまり（キラキラはキラキラでまとまって配置: 3個）
  const sparkleClusterCenterX = 45 + centerJitterX;
  const sparkleClusterCenterY = -15 + centerJitterY;
  const sparkleCount = 3;

  const sparkleParticles = generateParticleCluster({
    type: 'sparkle',
    count: sparkleCount,
    clusterCenterX: sparkleClusterCenterX,
    clusterCenterY: sparkleClusterCenterY,
    spreadRadius: 26,
    idPrefix: burstId,
    randomFn,
  });

  return [...heartParticles, ...sparkleParticles];
}

