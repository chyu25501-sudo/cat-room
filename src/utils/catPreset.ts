import { CatId, CatPreset, CAT_PRESETS } from '../types/cat.ts';

/**
 * 現在の猫IDから次の猫プリセットを取得する（循環切り替え）
 * 将来的に猫の種類が増えた場合も自動的に全プリセットを順番に循環します
 */
export function getNextCatPreset(
  currentId: CatId,
  presets: readonly CatPreset[] = CAT_PRESETS
): CatPreset {
  if (presets.length === 0) {
    throw new Error('プリセットが空です');
  }
  const currentIndex = presets.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) {
    return presets[0];
  }
  const nextIndex = (currentIndex + 1) % presets.length;
  return presets[nextIndex];
}

/**
 * 指定されたIDの猫プリセットを取得する（見つからない場合は先頭のプリセット）
 */
export function getCatPresetById(
  id: CatId,
  presets: readonly CatPreset[] = CAT_PRESETS
): CatPreset {
  const found = presets.find((p) => p.id === id);
  return found ?? presets[0];
}

/**
 * 猫プリセットに応じたランダムな吹き出しメッセージを取得する
 */
export function getRandomMeowMessage(preset: CatPreset): string {
  const messages = preset.meowMessages;
  if (!messages || messages.length === 0) {
    return 'ニャ〜ン♪';
  }
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

/**
 * 基本ピッチに対して自然な揺らぎ（±5%）を加えたピッチ倍率を計算する
 */
export function calculateVariedPitch(basePitch: number): number {
  const variations = [-0.05, -0.02, 0, 0.02, 0.05];
  const delta = variations[Math.floor(Math.random() * variations.length)];
  return Math.round((basePitch + delta) * 100) / 100;
}

