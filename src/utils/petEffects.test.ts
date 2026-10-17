import { describe, it, expect } from 'vitest';
import {
  generateParticleCluster,
  generatePetEffectBurst,
  MIN_PARTICLE_SIZE,
  MAX_PARTICLE_SIZE,
  HEART_COLORS,
  SPARKLE_COLORS,
} from './petEffects.ts';

describe('petEffects ユーティリティ (純粋関数テスト)', () => {
  it('generateParticleCluster: 指定された種類・個数の粒子をまとまりとして生成すること', () => {
    const fixedRandom = () => 0.5;
    const cluster = generateParticleCluster({
      type: 'heart',
      count: 3,
      clusterCenterX: -40,
      clusterCenterY: 10,
      spreadRadius: 20,
      idPrefix: 'test',
      randomFn: fixedRandom,
    });

    expect(cluster).toHaveLength(3);
    for (const particle of cluster) {
      expect(particle.type).toBe('heart');
      // 従来の約2倍のサイズ（36px〜44px）に収まっていること
      expect(particle.size).toBeGreaterThanOrEqual(MIN_PARTICLE_SIZE);
      expect(particle.size).toBeLessThanOrEqual(MAX_PARTICLE_SIZE);
      expect(['left', 'right']).toContain(particle.swayDirection);
      expect(HEART_COLORS).toContain(particle.colorClass);
      expect(particle.durationMs).toBeGreaterThan(0);
    }
  });

  it('generateParticleCluster: キラキラ用クラスターも指定カラー・プロパティで生成されること', () => {
    const cluster = generateParticleCluster({
      type: 'sparkle',
      count: 4,
      clusterCenterX: 40,
      clusterCenterY: -10,
      spreadRadius: 20,
    });

    expect(cluster).toHaveLength(4);
    for (const particle of cluster) {
      expect(particle.type).toBe('sparkle');
      expect(particle.size).toBeGreaterThanOrEqual(MIN_PARTICLE_SIZE);
      expect(particle.size).toBeLessThanOrEqual(MAX_PARTICLE_SIZE);
      expect(SPARKLE_COLORS).toContain(particle.colorClass);
    }
  });

  it('generatePetEffectBurst: ハートのまとまりとキラキラのまとまりがそれぞれ分離して生成されること', () => {
    // 擬似乱数ジェネレータ（決定論的テスト）
    let seed = 0.1;
    const pseudoRandom = () => {
      seed = (seed + 0.15) % 1;
      return seed;
    };

    const burst = generatePetEffectBurst({
      burstId: 'burst-1',
      randomFn: pseudoRandom,
    });

    const heartParticles = burst.filter((p) => p.type === 'heart');
    const sparkleParticles = burst.filter((p) => p.type === 'sparkle');

    expect(heartParticles.length).toBeGreaterThanOrEqual(3);
    expect(sparkleParticles.length).toBeGreaterThanOrEqual(3);

    // ハートは左寄りクラスター（x座標が負）、キラキラは右寄りクラスター（x座標が正）にまとまっていること
    const avgHeartX =
      heartParticles.reduce((acc, p) => acc + p.offsetX, 0) / heartParticles.length;
    const avgSparkleX =
      sparkleParticles.reduce((acc, p) => acc + p.offsetX, 0) / sparkleParticles.length;

    expect(avgHeartX).toBeLessThan(0);
    expect(avgSparkleX).toBeGreaterThan(0);

    // すべての粒子サイズが従来の約2倍（36〜44px）であること
    for (const p of burst) {
      expect(p.size).toBeGreaterThanOrEqual(MIN_PARTICLE_SIZE);
      expect(p.size).toBeLessThanOrEqual(MAX_PARTICLE_SIZE);
    }
  });
});

