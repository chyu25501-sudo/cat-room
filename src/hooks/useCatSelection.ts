import { useState, useCallback } from 'react';
import { CatId, CatPreset, CAT_PRESETS } from '../types/cat.ts';
import { getNextCatPreset, getCatPresetById } from '../utils/catPreset.ts';

const STORAGE_KEY = 'nekoppoi_selected_cat_id';

export interface UseCatSelectionResult {
  /** 現在選択されている猫ID */
  currentCatId: CatId;
  /** 現在選択されている猫プリセット情報 */
  currentPreset: CatPreset;
  /** 次に切り替えられる猫プリセット情報 */
  nextPreset: CatPreset;
  /** 次の猫プリセットへ循環切り替えする関数 */
  switchCat: () => void;
  /** 特定の猫プリセットを直接選択する関数（ラジオボタン用） */
  selectCat: (id: CatId) => void;
}

/**
 * 猫の選択状態と切り替えを管理するカスタムフック
 * localStorageへの永続化と安全なフォールバックを提供します
 */
export function useCatSelection(): UseCatSelectionResult {
  const [currentCatId, setCurrentCatId] = useState<CatId>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY) as CatId | null;
        if (saved && CAT_PRESETS.some((p) => p.id === saved)) {
          return saved;
        }
      }
    } catch {
      // localStorageが制限されている環境（プライベートブラウズ等）のフォールバック
    }
    return CAT_PRESETS[0].id;
  });

  const currentPreset = getCatPresetById(currentCatId);
  const nextPreset = getNextCatPreset(currentCatId);

  const switchCat = useCallback(() => {
    setCurrentCatId((prevId) => {
      const next = getNextCatPreset(prevId);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, next.id);
        }
      } catch {
        // フォールバック
      }
      return next.id;
    });
  }, []);

  const selectCat = useCallback((id: CatId) => {
    setCurrentCatId(id);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, id);
      }
    } catch {
      // フォールバック
    }
  }, []);

  return {
    currentCatId,
    currentPreset,
    nextPreset,
    switchCat,
    selectCat,
  };
}
