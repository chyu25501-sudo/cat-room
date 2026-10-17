import { describe, it, expect } from 'vitest';
import {
  generateParticleCluster,
  generatePetEffectBurst,
  pickRandomEffectType,
  MIN_PARTICLE_SIZE,
  MAX_PARTICLE_SIZE,
  HEART_COLORS,
  SPARKLE_COLORS,
  NOTE_COLORS,
  EFFECT_TYPES,
  type EffectType,
} from './petEffects.ts';

describe('petEffects ユーティリティ (純粋関数テスト)', () => {
  it('generateParticleCluster: ハート用の粒子群が指定カラー・サイズで生成されること', () => {
    const fixedRandom = () => 0.5;
    const cluster = generateParticleCluster({
      type: 'heart',
      count: 3,
      clusterCenterX: 0,
      clusterCenterY: 0,
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
      clusterCenterX: 0,
      clusterCenterY: 0,
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

  it('generateParticleCluster: 音符用クラスター（カラフルな色つき音符）が生成されること', () => {
    const cluster = generateParticleCluster({
      type: 'note',
      count: 4,
      clusterCenterX: 0,
      clusterCenterY: 0,
      spreadRadius: 20,
    });

    expect(cluster).toHaveLength(4);
    for (const particle of cluster) {
      expect(particle.type).toBe('note');
      expect(particle.size).toBeGreaterThanOrEqual(MIN_PARTICLE_SIZE);
      expect(particle.size).toBeLessThanOrEqual(MAX_PARTICLE_SIZE);
      expect(NOTE_COLORS).toContain(particle.colorClass);
    }
  });

  it('pickRandomEffectType: heart, sparkle, note の中から正しく選択されること', () => {
    expect(pickRandomEffectType(() => 0.0)).toBe('heart');
    expect(pickRandomEffectType(() => 0.4)).toBe('sparkle');
    expect(pickRandomEffectType(() => 0.8)).toBe('note');
  });

  it('generatePetEffectBurst: 一度のバーストにつき「一種類だけ」のエフェクトがまとまって生成されること', () => {
    // ハート指定時: すべてハート
    const heartBurst = generatePetEffectBurst({ type: 'heart', burstId: 'b-heart' });
    expect(heartBurst.length).toBeGreaterThanOrEqual(3);
    expect(heartBurst.every((p) => p.type === 'heart')).toBe(true);

    // キラキラ指定時: すべてキラキラ
    const sparkleBurst = generatePetEffectBurst({ type: 'sparkle', burstId: 'b-sparkle' });
    expect(sparkleBurst.length).toBeGreaterThanOrEqual(3);
    expect(sparkleBurst.every((p) => p.type === 'sparkle')).toBe(true);

    // 音符指定時: すべて音符
    const noteBurst = generatePetEffectBurst({ type: 'note', burstId: 'b-note' });
    expect(noteBurst.length).toBeGreaterThanOrEqual(3);
    expect(noteBurst.every((p) => p.type === 'note')).toBe(true);

    // ランダム生成時も混ざらず、必ず単一種類のみで構成されること
    for (let i = 0; i < 15; i++) {
      const burst = generatePetEffectBurst();
      const distinctTypes = new Set(burst.map((p) => p.type));
      expect(distinctTypes.size).toBe(1);
      const [type] = distinctTypes;
      expect(EFFECT_TYPES).toContain(type as EffectType);

      // すべてサイズが約2倍（36〜44px）であること
      for (const p of burst) {
        expect(p.size).toBeGreaterThanOrEqual(MIN_PARTICLE_SIZE);
        expect(p.size).toBeLessThanOrEqual(MAX_PARTICLE_SIZE);
      }
    }
  });
});
