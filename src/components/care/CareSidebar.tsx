import React, { useState } from 'react';
import { Utensils, X, ChevronDown, ChevronUp, Heart, Gamepad2, Sparkles, AlertCircle } from 'lucide-react';
import { FoodItem, ToyItem } from '../../types/care.ts';
import {
  FOOD_ITEMS,
  TOY_ITEMS,
  canFeedCat,
  canPlayWithCat,
  MESSAGE_TOO_FULL_TO_EAT,
  MESSAGE_TOO_HUNGRY_TO_PLAY,
} from '../../utils/catCare.ts';

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
  /** 食事中または遊び中など、お世話アクションが実行不可かどうか（未指定時は isEating || isPlayingToy） */
  isBusy?: boolean;
  /** 現在選択されている猫のまんぷく度スコア（90%以上で給餌不可、10%以下で遊び不可） */
  currentFullnessScore?: number;
  /** サイドバーの開閉状態（制御プロパティ、未指定時は内部ステート） */
  isOpen?: boolean;
  /** 開閉状態が変更されたときのコールバック */
  onToggleOpen?: (isOpen: boolean) => void;
}

export const CareSidebar: React.FC<CareSidebarProps> = ({
  currentCatName,
  onFeed,
  onPlay,
  isEating = false,
  isPlayingToy = false,
  isBusy: controlledIsBusy,
  currentFullnessScore,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isFoodSubmenuOpen, setIsFoodSubmenuOpen] = useState(true);
  const [isToySubmenuOpen, setIsToySubmenuOpen] = useState(true);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const isBusy = controlledIsBusy !== undefined ? controlledIsBusy : (isEating || isPlayingToy);

  // まんぷく度が90%以上のときは「まんぷくで食べられない！」
  const isTooFull = typeof currentFullnessScore === 'number' && !canFeedCat(currentFullnessScore);
  // まんぷく度が10%以下のときは「お腹が空いて遊べない！」
  const isTooHungry = typeof currentFullnessScore === 'number' && !canPlayWithCat(currentFullnessScore);

  const handleSetOpen = (open: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const handleFeedClick = (food: FoodItem) => {
    // 食事中・遊び中、または満腹（90%以上）の場合は給餌不可
    if (isBusy || isTooFull) return;
    onFeed(food);
    // ごはんをあげた直後にサイドバーを自動で閉じ、猫のリアクションやごきげん度が見えるようにする
    handleSetOpen(false);
  };

  const handlePlayClick = (toy: ToyItem) => {
    // 食事中・遊び中、または空腹（10%以下）の場合は遊び不可
    if (isBusy || isTooHungry) return;
    onPlay(toy);
    // おもちゃで遊んだ直後にサイドバーを自動で閉じ、猫のリアクションやごきげん度が見えるようにする
    handleSetOpen(false);
  };

  return (
    <>
      {/* 画面端（右側）に常駐する「お世話ボタン」 */}
      <button
        type="button"
        onClick={() => handleSetOpen(!isOpen)}
        aria-label="お世話メニューを開く"
        aria-expanded={isOpen}
        className="fixed right-3 bottom-6 sm:right-6 sm:bottom-8 z-30 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        <Utensils className="w-5 h-5" />
        <span className="text-sm tracking-wide">お世話</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>

      {/* ドロワーの背景オーバーレイ（開いている時のみ表示） */}
      {isOpen && (
        <div
          role="presentation"
          data-testid="care-sidebar-backdrop"
          onClick={() => handleSetOpen(false)}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 transition-opacity duration-300"
        />
      )}

      {/* スライドインするお世話サイドバー */}
      <aside
        aria-label="お世話サイドバー"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* サイドバーヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
              <Utensils className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-800 leading-tight">
                お世話メニュー
              </h2>
              <p className="text-xs text-stone-500">
                {currentCatName}のお世話（ごはん・あそび）
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleSetOpen(false)}
            aria-label="お世話メニューを閉じる"
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* サイドバーメインコンテンツ（スクロール可能） */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 食事中または遊び中の案内バナー（現在はお世話アクションを受け付けない状態であることを明示） */}
          {isBusy && (
            <div
              data-testid="care-busy-banner"
              className="p-3 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in shadow-2xs"
            >
              <span className="text-xl select-none shrink-0" role="img" aria-label={isEating ? '食事中' : 'あそび中'}>
                {isEating ? '🥣' : '🎾'}
              </span>
              <div className="leading-tight">
                <p className="font-bold">
                  {isEating
                    ? `${currentCatName}がお食事中です♪`
                    : `${currentCatName}がおもちゃであそび中です♪`}
                </p>
                <p className="text-[11px] text-amber-800/80 font-normal mt-0.5">
                  食べ終わる／遊び終わるまでお待ちください
                </p>
              </div>
            </div>
          )}

          {/* お世話カテゴリ: ごはん（食事） */}
          <section className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* カテゴリ開閉トグルボタン */}
            <button
              type="button"
              onClick={() => setIsFoodSubmenuOpen((prev) => !prev)}
              aria-expanded={isFoodSubmenuOpen}
              className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-amber-50/50 transition-colors text-left cursor-pointer border-b border-stone-100"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl" role="img" aria-label="ごはん">
                  🍽️
                </span>
                <div>
                  <span className="font-bold text-stone-800 text-sm block">
                    ごはんをあげる
                  </span>
                  <span className="text-xs text-stone-400">
                    選んでごきげん度アップ
                  </span>
                </div>
              </div>
              <span className="text-stone-400">
                {isFoodSubmenuOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>

            {/* ごはんサブメニュー（選択肢一覧） */}
            {isFoodSubmenuOpen && (
              <div
                data-testid="food-submenu"
                className="p-3 space-y-2.5 bg-gradient-to-b from-stone-50 to-amber-50/30"
              >
                {/* 90%以上の満腹時は給餌不可バナーを表示 */}
                {isTooFull && (
                  <div
                    data-testid="feed-disabled-banner"
                    className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-2xs"
                  >
                    <span className="text-base select-none shrink-0" role="img" aria-label="まんぷく">
                      🈵
                    </span>
                    <span>{MESSAGE_TOO_FULL_TO_EAT}</span>
                  </div>
                )}

                {FOOD_ITEMS.map((food) => (
                  <div
                    key={food.id}
                    className={`relative flex flex-col p-3 rounded-xl border border-stone-200 bg-white transition-all duration-200 ${
                      isBusy || isTooFull ? 'opacity-80' : 'hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          data-testid={`food-badge-icon-${food.id}`}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-amber-50 border border-amber-200 shadow-2xs select-none shrink-0"
                          role="img"
                          aria-label={food.name}
                        >
                          {food.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-stone-800 text-sm leading-tight">
                            {food.name}
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {food.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* 上昇バッジ群（ごきげん度・まんぷく度） */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {/* 機嫌上昇バッジ */}
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                          <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                          +{food.moodBoost}%
                        </span>
                        {/* まんぷく度上昇バッジ */}
                        <span
                          data-testid={`food-fullness-boost-${food.id}`}
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap"
                        >
                          <Utensils className="w-2.5 h-2.5 text-emerald-600" />
                          +{food.fullnessBoost}%
                        </span>
                      </div>
                    </div>

                    {/* あげるボタン（食事中・遊び中・満腹90%以上は無効化） */}
                    <button
                      type="button"
                      disabled={isBusy || isTooFull}
                      onClick={() => handleFeedClick(food)}
                      aria-label={`${food.name}をあげる`}
                      className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-150 ${
                        isBusy || isTooFull
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                          : 'cursor-pointer bg-orange-500 hover:bg-orange-600 text-white active:scale-98 shadow-xs'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>
                        {isBusy
                          ? (isEating ? 'お食事中…' : 'あそび中…')
                          : isTooFull
                          ? MESSAGE_TOO_FULL_TO_EAT
                          : 'あげる'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* お世話カテゴリ: おもちゃ（あそぶ） */}
          <section className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* カテゴリ開閉トグルボタン */}
            <button
              type="button"
              onClick={() => setIsToySubmenuOpen((prev) => !prev)}
              aria-expanded={isToySubmenuOpen}
              className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-amber-50/50 transition-colors text-left cursor-pointer border-b border-stone-100"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl" role="img" aria-label="おもちゃ">
                  🎾
                </span>
                <div>
                  <span className="font-bold text-stone-800 text-sm block">
                    おもちゃであそぶ
                  </span>
                  <span className="text-xs text-stone-400">
                    選んでごきげん度アップ
                  </span>
                </div>
              </div>
              <span className="text-stone-400">
                {isToySubmenuOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>

            {/* おもちゃサブメニュー（選択肢一覧） */}
            {isToySubmenuOpen && (
              <div
                data-testid="toy-submenu"
                className="p-3 space-y-2.5 bg-gradient-to-b from-stone-50 to-amber-50/30"
              >
                {/* 10%以下の空腹時は遊び不可バナーを表示 */}
                {isTooHungry && (
                  <div
                    data-testid="play-disabled-banner"
                    className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-2xs"
                  >
                    <span className="text-base select-none shrink-0" role="img" aria-label="お腹が空いた">
                      🪫
                    </span>
                    <span>{MESSAGE_TOO_HUNGRY_TO_PLAY}</span>
                  </div>
                )}

                {TOY_ITEMS.map((toy) => (
                  <div
                    key={toy.id}
                    className={`relative flex flex-col p-3 rounded-xl border border-stone-200 bg-white transition-all duration-200 ${
                      isBusy || isTooHungry ? 'opacity-80' : 'hover:border-amber-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          data-testid={`toy-badge-icon-${toy.id}`}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-amber-50 border border-amber-200 shadow-2xs select-none shrink-0"
                          role="img"
                          aria-label={toy.name}
                        >
                          {toy.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-stone-800 text-sm leading-tight">
                            {toy.name}
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {toy.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* 機嫌上昇バッジ */}
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                        <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                        +{toy.moodBoost}%
                      </span>
                    </div>

                    {/* あそぶボタン（食事中・遊び中・空腹10%以下は無効化） */}
                    <button
                      type="button"
                      disabled={isBusy || isTooHungry}
                      onClick={() => handlePlayClick(toy)}
                      aria-label={`${toy.name}であそぶ`}
                      className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-150 ${
                        isBusy || isTooHungry
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                          : 'cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white active:scale-98 shadow-xs'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isBusy
                          ? (isPlayingToy ? 'あそび中…' : 'お食事中…')
                          : isTooHungry
                          ? MESSAGE_TOO_HUNGRY_TO_PLAY
                          : 'あそぶ'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* サイドバーフッター */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-center text-xs text-stone-400">
          💡 ごはんやおもちゃでごきげん度アップ＆不機嫌もなおります♪
        </div>
      </aside>
    </>
  );
};
