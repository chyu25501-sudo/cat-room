import React, { useState } from 'react';
import {
  Utensils,
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  Gamepad2,
  Sparkles,
  AlertCircle,
  Lock,
  Bot,
} from 'lucide-react';
import { FoodItem, ToyItem } from '../../types/care.ts';
import {
  FOOD_ITEMS,
  TOY_ITEMS,
  canFeedCat,
  canPlayWithCat,
  MESSAGE_TOO_FULL_TO_EAT,
  MESSAGE_TOO_HUNGRY_TO_PLAY,
  isFoodUnlocked,
  isToyUnlocked,
  getUnlockRequirementText,
} from '../../utils/catCare.ts';
import { CareItemIcon } from './CareItemIcon.tsx';

export interface CareModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
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
}

export type CareTab = 'interaction' | 'automation';

/**
 * 画面中央に表示される「お世話メニュー」モーダルウィンドウ
 */
export const CareModal: React.FC<CareModalProps> = ({
  isOpen,
  onClose,
  currentCatName,
  onFeed,
  onPlay,
  isEating = false,
  isPlayingToy = false,
  isBusy: controlledIsBusy,
  currentFullnessScore,
  currentAffectionLevel = 10,
  isAutoFeedUnlocked = true,
  isAutoFeedEnabled = false,
  onToggleAutoFeed,
  defaultTab = 'interaction',
}) => {
  const [activeTab, setActiveTab] = useState<CareTab>(defaultTab);
  const [isFoodSubmenuOpen, setIsFoodSubmenuOpen] = useState(true);
  const [isToySubmenuOpen, setIsToySubmenuOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  const isBusy = controlledIsBusy !== undefined ? controlledIsBusy : (isEating || isPlayingToy);
  const isAutoFeedActive = isAutoFeedUnlocked && isAutoFeedEnabled;

  // まんぷく度が90%以上のときは「まんぷくで食べられない！」
  const isTooFull = typeof currentFullnessScore === 'number' && !canFeedCat(currentFullnessScore);
  // まんぷく度が10%以下のときは「お腹が空いて遊べない！」
  const isTooHungry = typeof currentFullnessScore === 'number' && !canPlayWithCat(currentFullnessScore);

  const handleFeedClick = (food: FoodItem) => {
    // なつき度不足、食事中・遊び中、満腹（90%以上）、または自動ごはんONの場合は給餌不可
    if (!isFoodUnlocked(food, currentAffectionLevel) || isBusy || isTooFull || isAutoFeedActive) return;
    onFeed(food);
    // ごはんを選択後、ウィンドウを閉じて猫の様子が見えるようにする
    onClose();
  };

  const handlePlayClick = (toy: ToyItem) => {
    // なつき度不足、食事中・遊び中、または空腹（10%以下）の場合は遊び不可
    if (!isToyUnlocked(toy, currentAffectionLevel) || isBusy || isTooHungry) return;
    onPlay(toy);
    // おもちゃを選択後、ウィンドウを閉じて猫の様子が見えるようにする
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="care-modal-title"
      data-testid="care-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（クリックで閉じる） */}
      <div
        data-testid="care-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="care-modal-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                お世話メニュー
              </h2>
              <p className="text-[11px] text-stone-500">
                {currentCatName}のお世話（ごはん・あそび）
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="お世話メニューを閉じる"
            data-testid="care-modal-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* タブ切り替え（「ふれあい」/「自動化」） */}
        <div className="px-5 pt-3 pb-2 border-b border-orange-100 bg-amber-50/20 shrink-0">
          <div
            role="tablist"
            aria-label="お世話メニュータブ"
            className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl gap-1 border border-stone-200/60"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'interaction'}
              aria-controls="care-tabpanel-interaction"
              id="care-tab-interaction"
              data-testid="care-tab-interaction"
              onClick={() => setActiveTab('interaction')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'interaction'
                  ? 'bg-white text-orange-600 shadow-2xs font-black'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>ふれあい</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'automation'}
              aria-controls="care-tabpanel-automation"
              id="care-tab-automation"
              data-testid="care-tab-automation"
              onClick={() => setActiveTab('automation')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'automation'
                  ? 'bg-white text-orange-600 shadow-2xs font-black'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>自動化</span>
              {isAutoFeedActive && (
                <span
                  data-testid="auto-feed-active-dot"
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                  title="自動ごはん稼働中"
                />
              )}
            </button>
          </div>
        </div>

        {/* モーダルメインコンテンツ（スクロール可能） */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 食事中または遊び中の案内バナー */}
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

          {/* ふれあいタブパネル */}
          {activeTab === 'interaction' && (
            <div
              role="tabpanel"
              id="care-tabpanel-interaction"
              aria-labelledby="care-tab-interaction"
              data-testid="care-tabpanel-interaction"
              className="space-y-4 animate-in fade-in duration-150"
            >
              {/* ごはんセクション（アコーディオン） */}
              <section className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsFoodSubmenuOpen(!isFoodSubmenuOpen)}
                  aria-expanded={isFoodSubmenuOpen}
                  aria-controls="food-submenu"
                  className="w-full flex items-center justify-between p-3.5 bg-stone-50/80 hover:bg-stone-100/70 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                      <Utensils className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-stone-800">
                        ごはんをあげる
                      </h3>
                      <span className="text-xs text-stone-500">
                        まんぷく度＆ごきげん度UP
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
                    id="food-submenu"
                    data-testid="food-submenu"
                    className="p-3 space-y-2.5 bg-gradient-to-b from-stone-50 to-amber-50/30"
                  >
                    {/* 自動ごはん稼働中は手動給餌お休みバナーを表示 */}
                    {isAutoFeedActive && (
                      <div
                        data-testid="auto-feed-active-banner"
                        className="p-2.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-2xs"
                      >
                        <span className="text-base select-none shrink-0" role="img" aria-label="自動給餌中">
                          🤖
                        </span>
                        <div className="leading-tight">
                          <p className="font-bold">自動ごはんが稼働中です</p>
                          <p className="text-[11px] text-amber-800/80 font-normal mt-0.5">
                            まんぷく度が40%以下になると自動でカリカリを食べます。手動ごはんはお休み中です。
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 90%以上の満腹時は給餌不可バナーを表示 */}
                    {!isAutoFeedActive && isTooFull && (
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

                    {FOOD_ITEMS.map((food) => {
                      const unlocked = isFoodUnlocked(food, currentAffectionLevel);
                      return (
                        <div
                          key={food.id}
                          data-testid={`food-item-card-${food.id}`}
                          className={`relative flex flex-col p-3 rounded-xl border border-stone-200 bg-white transition-all duration-200 ${
                            !unlocked
                              ? 'opacity-85 bg-stone-50/70 border-dashed'
                              : isBusy || isTooFull || isAutoFeedActive
                              ? 'opacity-80'
                              : 'hover:border-orange-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span
                                data-testid={`food-badge-icon-${food.id}`}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs select-none shrink-0 ${
                                  !unlocked
                                    ? 'bg-stone-100 border-stone-300 opacity-60'
                                    : 'bg-white border-amber-200/90 shadow-xs'
                                }`}
                                aria-label={food.name}
                              >
                                <CareItemIcon type="food" id={food.id} className="w-7 h-7" />
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="font-bold text-stone-800 text-sm leading-tight">
                                    {food.name}
                                  </h3>
                                  {!unlocked && (
                                    <span
                                      data-testid={`food-lock-badge-${food.id}`}
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200 select-none"
                                    >
                                      <Lock className="w-2.5 h-2.5" />
                                      Lv.{food.requiredAffectionLevel}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  {food.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* 上昇バッジ群（ごきげん度・まんぷく度） */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                                <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                                +{food.moodBoost}%
                              </span>
                              <span
                                data-testid={`food-fullness-boost-${food.id}`}
                                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap"
                              >
                                <Utensils className="w-2.5 h-2.5 text-emerald-600" />
                                +{food.fullnessBoost}%
                              </span>
                            </div>
                          </div>

                          {/* あげるボタン／未解禁ボタン */}
                          {!unlocked ? (
                            <button
                              type="button"
                              disabled={true}
                              data-testid={`food-locked-button-${food.id}`}
                              aria-label={`${food.name}（なつき度${food.requiredAffectionLevel}で解禁されるよ！）`}
                              className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-stone-100 text-stone-400 text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed select-none"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{getUnlockRequirementText(food.requiredAffectionLevel)}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFeedClick(food)}
                              disabled={isBusy || isTooFull || isAutoFeedActive}
                              aria-label={`${food.name}をあげる`}
                              className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                isAutoFeedActive
                                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  : isTooFull
                                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  : isBusy
                                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  : 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-white shadow-xs cursor-pointer'
                              }`}
                            >
                              <Utensils className="w-3.5 h-3.5" />
                              <span>
                                {isAutoFeedActive
                                  ? '自動ごはん稼働中'
                                  : isTooFull
                                  ? MESSAGE_TOO_FULL_TO_EAT
                                  : isEating
                                  ? 'お食事中…'
                                  : isPlayingToy
                                  ? 'あそび中…'
                                  : isBusy
                                  ? 'お食事中…'
                                  : `${food.name}をあげる`}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* おもちゃセクション（アコーディオン） */}
              <section className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsToySubmenuOpen(!isToySubmenuOpen)}
                  aria-expanded={isToySubmenuOpen}
                  aria-controls="toy-submenu"
                  className="w-full flex items-center justify-between p-3.5 bg-stone-50/80 hover:bg-stone-100/70 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                      <Gamepad2 className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-stone-800">
                        おもちゃであそぶ
                      </h3>
                      <span className="text-xs text-stone-500">
                        ごきげん度UP＆不機嫌解消
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
                    id="toy-submenu"
                    data-testid="toy-submenu"
                    className="p-3 space-y-2.5 bg-gradient-to-b from-stone-50 to-purple-50/30"
                  >
                    {/* 10%以下の空腹時は遊び不可バナーを表示 */}
                    {isTooHungry && (
                      <div
                        data-testid="play-disabled-banner"
                        className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-2xs"
                      >
                        <span className="text-base select-none shrink-0" role="img" aria-label="空腹">
                          ⚠️
                        </span>
                        <span>{MESSAGE_TOO_HUNGRY_TO_PLAY}</span>
                      </div>
                    )}

                    {TOY_ITEMS.map((toy) => {
                      const unlocked = isToyUnlocked(toy, currentAffectionLevel);
                      return (
                        <div
                          key={toy.id}
                          data-testid={`toy-item-card-${toy.id}`}
                          className={`relative flex flex-col p-3 rounded-xl border border-stone-200 bg-white transition-all duration-200 ${
                            !unlocked
                              ? 'opacity-85 bg-stone-50/70 border-dashed'
                              : isBusy || isTooHungry
                              ? 'opacity-80'
                              : 'hover:border-purple-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span
                                data-testid={`toy-badge-icon-${toy.id}`}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs select-none shrink-0 ${
                                  !unlocked
                                    ? 'bg-stone-100 border-stone-300 opacity-60'
                                    : 'bg-white border-purple-200/90 shadow-xs'
                                }`}
                                aria-label={toy.name}
                              >
                                <CareItemIcon type="toy" id={toy.id} className="w-7 h-7" />
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="font-bold text-stone-800 text-sm leading-tight">
                                    {toy.name}
                                  </h3>
                                  {!unlocked && (
                                    <span
                                      data-testid={`toy-lock-badge-${toy.id}`}
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200 select-none"
                                    >
                                      <Lock className="w-2.5 h-2.5" />
                                      Lv.{toy.requiredAffectionLevel}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  {toy.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* 上昇バッジ群 */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 whitespace-nowrap">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                                +{toy.moodBoost}%
                              </span>
                              <span
                                data-testid={`toy-fullness-decay-${toy.id}`}
                                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 whitespace-nowrap"
                              >
                                <Utensils className="w-2.5 h-2.5 text-stone-500" />
                                -{toy.fullnessDecay}%
                              </span>
                            </div>
                          </div>

                          {/* あそぶボタン／未解禁ボタン */}
                          {!unlocked ? (
                            <button
                              type="button"
                              disabled={true}
                              data-testid={`toy-locked-button-${toy.id}`}
                              aria-label={`${toy.name}（なつき度${toy.requiredAffectionLevel}で解禁されるよ！）`}
                              className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-stone-100 text-stone-400 text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed select-none"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{getUnlockRequirementText(toy.requiredAffectionLevel)}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePlayClick(toy)}
                              disabled={isBusy || isTooHungry}
                              aria-label={`${toy.name}であそぶ`}
                              className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                isTooHungry
                                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  : isBusy
                                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  : 'bg-purple-600 hover:bg-purple-700 active:scale-98 text-white shadow-xs cursor-pointer'
                              }`}
                            >
                              <Gamepad2 className="w-3.5 h-3.5" />
                              <span>
                                {isTooHungry
                                  ? MESSAGE_TOO_HUNGRY_TO_PLAY
                                  : isEating
                                  ? 'お食事中…'
                                  : isPlayingToy
                                  ? 'あそび中…'
                                  : isBusy
                                  ? 'あそび中…'
                                  : `${toy.name}であそぶ`}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* 自動化タブパネル */}
          {activeTab === 'automation' && (
            <div
              role="tabpanel"
              id="care-tabpanel-automation"
              aria-labelledby="care-tab-automation"
              data-testid="care-tabpanel-automation"
              className="space-y-4 animate-in fade-in duration-150"
            >
              {/* 自動ごはんオンオフ設定カード */}
              <section
                data-testid="care-auto-feed-section"
                className={`border rounded-2xl p-4 transition-colors shadow-2xs ${
                  isAutoFeedUnlocked
                    ? isAutoFeedEnabled
                      ? 'bg-amber-50/70 border-orange-200'
                      : 'bg-stone-50 border-stone-200'
                    : 'bg-stone-50 border-stone-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-stone-800 font-bold text-xs sm:text-sm min-w-0">
                    <Utensils
                      className={`w-4 h-4 shrink-0 ${
                        isAutoFeedUnlocked ? 'text-orange-600' : 'text-stone-400'
                      }`}
                    />
                    <span className="truncate">自動ごはん</span>
                    {isAutoFeedUnlocked ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-300 leading-none shrink-0">
                        解禁済み
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded-full border border-stone-300 leading-none flex items-center gap-0.5 shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>未解禁</span>
                      </span>
                    )}
                  </div>

                  {/* トグルスイッチ */}
                  <button
                    type="button"
                    role="switch"
                    disabled={!isAutoFeedUnlocked}
                    aria-checked={isAutoFeedUnlocked && isAutoFeedEnabled}
                    aria-label="お世話メニューの自動ごはんの切り替え"
                    data-testid="care-auto-feed-toggle-button"
                    onClick={() => onToggleAutoFeed?.(!isAutoFeedEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                      !isAutoFeedUnlocked
                        ? 'bg-stone-200 cursor-not-allowed opacity-60'
                        : isAutoFeedEnabled
                        ? 'bg-orange-500 cursor-pointer'
                        : 'bg-stone-300 cursor-pointer'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isAutoFeedUnlocked && isAutoFeedEnabled
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {!isAutoFeedUnlocked
                    ? '🔒 全猫（くろねこ・しろねこ・みけねこ）のなつき度がLv.10（MAX）に到達すると解禁されます。すべての猫ちゃんと絆を深めると利用可能になります。'
                    : isAutoFeedEnabled
                    ? '全猫のまんぷく度が40%以下になると自動でカリカリを食べます。アプリを離れている間（最大7日間）も自動で給餌され、次回開いた際にまとめておくりものを受け取れます。※オンの間は手動ごはんがお休みになります。'
                    : '自動ごはんは現在オフです。手動で愛情を込めてごはんをあげられます。'}
                </p>

                {/* 注意事項 */}
                <div
                  data-testid="care-auto-feed-warning"
                  className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-start gap-1.5 text-[11px] text-rose-600 font-bold leading-relaxed"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                  <span>
                    【ご注意】自動ごはんがオンの状態でアプリを離れても、日付系の実績（連続ふれあい日数や累計訪問日数など）や手帳のふれあい日数は進みません。毎日自分で猫ちゃんとふれあった日のみカウントされます。
                  </span>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-center text-xs text-stone-400 shrink-0">
          {activeTab === 'interaction'
            ? '💡 ごはんやおもちゃでごきげん度アップ＆不機嫌もなおります♪'
            : '💡 自動ごはん中はアプリを離れていても猫ちゃんがカリカリを食べます♪'}
        </div>
      </div>
    </div>
  );
};
