import React from 'react';
import { RefreshCw } from 'lucide-react';
import { CatId, CatPreset, CAT_PRESETS } from '../types/cat.ts';

export interface CatSelectorProps {
  /** 現在選択されている猫ID */
  currentCatId: CatId;
  /** 表示する猫プリセット一覧（未指定時はCAT_PRESETS） */
  presets?: readonly CatPreset[];
  /** 猫を直接選択したときのコールバック */
  onSelectCat: (id: CatId) => void;
  /** 切り替えマークを押したときのコールバック（次へ切り替え） */
  onSwitchNext?: () => void;
  /** 追加クラス名 */
  className?: string;
}

/**
 * テキスト量を抑えたシンプルな円形ラジオボタン風の猫切り替えコンポーネント
 * 将来猫の種類が増えた場合も左右に並べて自然に拡張可能です
 */
export const CatSelector: React.FC<CatSelectorProps> = ({
  currentCatId,
  presets = CAT_PRESETS,
  onSelectCat,
  onSwitchNext,
  className = '',
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="ねこの種類を選択"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-orange-200/90 shadow-2xs ${className}`}
    >
      {/* 切り替えることを表すマーク（クリックで次へ循環切り替え可能） */}
      <button
        type="button"
        onClick={onSwitchNext}
        aria-label="猫の見た目を切り替える"
        title="クリックで次のねこへ切り替え"
        className="flex items-center justify-center text-stone-400 hover:text-orange-500 transition-colors p-1 rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-300 active:scale-95"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>

      {/* 区切り線 */}
      <div className="w-px h-3.5 bg-stone-200" aria-hidden="true" />

      {/* 将来の猫種追加にも対応した横並びの円形ラジオボタングループ */}
      <div className="flex items-center gap-2">
        {presets.map((preset) => {
          const isSelected = preset.id === currentCatId;
          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${preset.name}（${preset.poseName}）を選択`}
              title={`${preset.name}（${preset.poseName}）`}
              onClick={() => onSelectCat(preset.id)}
              className={`relative w-5 h-5 rounded-full border transition-all duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                preset.swatch.bgClass
              } ${preset.swatch.borderClass} ${
                isSelected
                  ? 'ring-2 ring-orange-400 ring-offset-2 scale-110 shadow-xs'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              {/* 選択中のセンタードット */}
              {isSelected && (
                <span
                  className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${preset.swatch.dotClass}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

