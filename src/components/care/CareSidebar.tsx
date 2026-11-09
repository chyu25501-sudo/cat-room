import React, { useState } from 'react';
import { Utensils, X, ChevronDown, ChevronUp, Sparkles, Heart, Gamepad2 } from 'lucide-react';
import { FoodItem } from '../../types/care.ts';
import { FOOD_ITEMS } from '../../utils/catCare.ts';

export interface CareSidebarProps {
  /** 現在選択されている猫の名前（例: 「くろねこ」） */
  currentCatName: string;
  /** ごはんを選んで与えたときのコールバック */
  onFeed: (food: FoodItem) => void;
  /** サイドバーの開閉状態（制御プロパティ、未指定時は内部ステート） */
  isOpen?: boolean;
  /** 開閉状態が変更されたときのコールバック */
  onToggleOpen?: (isOpen: boolean) => void;
}

export const CareSidebar: React.FC<CareSidebarProps> = ({
  currentCatName,
  onFeed,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isFoodSubmenuOpen, setIsFoodSubmenuOpen] = useState(true);
  const [lastFedFoodId, setLastFedFoodId] = useState<string | null>(null);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleSetOpen = (open: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const handleFeedClick = (food: FoodItem) => {
    setLastFedFoodId(food.id);
    onFeed(food);
    // フィードバック用のアニメーションタイマー（少し経ったら解除）
    setTimeout(() => {
      setLastFedFoodId(null);
    }, 1200);
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
                {currentCatName}にごはんをあげよう
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
                {FOOD_ITEMS.map((food) => {
                  const isJustFed = lastFedFoodId === food.id;
                  return (
                    <div
                      key={food.id}
                      className={`relative flex flex-col p-3 rounded-xl border bg-white transition-all duration-200 ${
                        isJustFed
                          ? 'border-emerald-400 ring-2 ring-emerald-300 shadow-md scale-[1.02]'
                          : 'border-stone-200 hover:border-orange-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" role="img" aria-label={food.name}>
                            {food.icon}
                          </span>
                          <div>
                            <h3 className="font-bold text-stone-800 text-sm leading-tight">
                              {food.name}
                            </h3>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {food.description}
                            </p>
                          </div>
                        </div>

                        {/* 機嫌上昇バッジ */}
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                          <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                          +{food.moodBoost}%
                        </span>
                      </div>

                      {/* あげるボタン */}
                      <button
                        type="button"
                        onClick={() => handleFeedClick(food)}
                        aria-label={`${food.name}をあげる`}
                        className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
                          isJustFed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-98 shadow-xs'
                        }`}
                      >
                        {isJustFed ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>もぐもぐ中…♪</span>
                          </>
                        ) : (
                          <>
                            <Utensils className="w-3.5 h-3.5" />
                            <span>あげる</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 今後実装予定のカテゴリ（おもちゃ・予告プレースホルダー） */}
          <section className="bg-stone-50/60 border border-stone-200/80 rounded-2xl p-3.5 opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-stone-200 text-stone-500 rounded-lg">
                  <Gamepad2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold text-stone-600 text-sm block">
                    おもちゃであそぶ
                  </span>
                  <span className="text-xs text-stone-400">
                    じゃらし・ボール（準備中）
                  </span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 bg-stone-200 text-stone-600 rounded-full font-medium">
                Soon
              </span>
            </div>
          </section>
        </div>

        {/* サイドバーフッター */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-center text-xs text-stone-400">
          💡 ごはんをあげると不機嫌もなおります♪
        </div>
      </aside>
    </>
  );
};
