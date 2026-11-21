import React, { useState } from 'react';
import { FoodItem, ToyItem } from '../../types/care.ts';
import { CareButton } from './CareButton.tsx';
import { CareModal, CareTab } from './CareModal.tsx';

export interface CareSidebarProps {
  /** 現在選択されている猫の名前（例: 「くろねこ」） */
  currentCatName: string;
  /** ごはんを選んで与えたときのコールバック */
  onFeed: (food: FoodItem) => void;
  /** おもちゃを選んで遊ばせたときのコールバック */
  onPlay: (toy: ToyItem) => void;
  /** 食事中アニメーション中かどうか */
  isEating?: boolean;
  /** おもちゃ遊び中アニメーション中かどうか */
  isPlayingToy?: boolean;
  /** 食事中または遊び中など、お世話アクションが実行不可かどうか */
  isBusy?: boolean;
  /** 現在選択されている猫のまんぷく度スコア（90%以上で給餌不可、10%以下で遊び不可） */
  currentFullnessScore?: number;
  /** 現在選択されている猫のなつき度レベル（未指定時は全解禁扱い） */
  currentAffectionLevel?: number;
  /** 自動ごはんが解禁されているかどうか（未指定時は true 扱い） */
  isAutoFeedUnlocked?: boolean;
  /** 自動ごはんが有効かどうか（有効時は手動ごはんが無効化される） */
  isAutoFeedEnabled?: boolean;
  /** 自動ごはんのオンオフ切り替えコールバック */
  onToggleAutoFeed?: (enabled: boolean) => void;
  /** デフォルトで開くタブ（未指定時は 'interaction'） */
  defaultTab?: CareTab;
  /** メニューの開閉状態（制御プロパティ、未指定時は内部ステート） */
  isOpen?: boolean;
  /** 開閉状態が変更されたときのコールバック */
  onToggleOpen?: (isOpen: boolean) => void;
  /** トリガーボタンを描画するかどうか（デフォルト: true。App等で個別にCareButtonを置く場合はfalse） */
  showTriggerButton?: boolean;
}

export type { CareTab };

/**
 * お世話メニューコンポーネント（旧CareSidebarからの後方互換ラッパー）
 * 画面左上のボタンおよび中央のモーダルウィンドウとしてお世話メニューを提供します。
 */
export const CareSidebar: React.FC<CareSidebarProps> = ({
  currentCatName,
  onFeed,
  onPlay,
  isEating = false,
  isPlayingToy = false,
  isBusy,
  currentFullnessScore,
  currentAffectionLevel = 10,
  isAutoFeedUnlocked = true,
  isAutoFeedEnabled = false,
  onToggleAutoFeed,
  defaultTab = 'interaction',
  isOpen: controlledIsOpen,
  onToggleOpen,
  showTriggerButton = true,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleSetOpen = (open: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  return (
    <>
      {showTriggerButton && (
        <CareButton onClick={() => handleSetOpen(!isOpen)} />
      )}
      <CareModal
        isOpen={isOpen}
        onClose={() => handleSetOpen(false)}
        currentCatName={currentCatName}
        onFeed={onFeed}
        onPlay={onPlay}
        isEating={isEating}
        isPlayingToy={isPlayingToy}
        isBusy={isBusy}
        currentFullnessScore={currentFullnessScore}
        currentAffectionLevel={currentAffectionLevel}
        isAutoFeedUnlocked={isAutoFeedUnlocked}
        isAutoFeedEnabled={isAutoFeedEnabled}
        onToggleAutoFeed={onToggleAutoFeed}
        defaultTab={defaultTab}
      />
    </>
  );
};
