import React, { useState } from 'react';
import { Heart, Zap } from 'lucide-react';
import { useCatAudio } from './hooks/useCatAudio.ts';
import { useCatSelection } from './hooks/useCatSelection.ts';
import { useCatMood } from './hooks/useCatMood.ts';
import { useCatFullness } from './hooks/useCatFullness.ts';
import { useCatFeeding } from './hooks/useCatFeeding.ts';
import { useCatPlay } from './hooks/useCatPlay.ts';
import { useCatAffection } from './hooks/useCatAffection.ts';
import { useCatGifts } from './hooks/useCatGifts.ts';
import { useAffectionLevelUp } from './hooks/useAffectionLevelUp.ts';
import { useSpeechBubble } from './hooks/useSpeechBubble.ts';
import { CatSilhouette } from './components/CatSilhouette.tsx';
import { CatSelector } from './components/CatSelector.tsx';
import { CatMoodIndicator } from './components/CatMoodIndicator.tsx';
import { CareSidebar } from './components/care/CareSidebar.tsx';
import { AffectionLevelUpOverlay } from './components/AffectionLevelUpOverlay.tsx';
import { TreasureChestButton } from './components/gifts/TreasureChestButton.tsx';
import { GiftCollectionModal } from './components/gifts/GiftCollectionModal.tsx';
import { calculateVariedPitch, getCatPresetById } from './utils/catPreset.ts';
import { calculatePitchForMood, getMeowMessageForMood } from './utils/catMood.ts';
import {
  DEFAULT_PET_AFFECTION_EXP,
  FOOD_AFFECTION_EXP_MAP,
  TOY_AFFECTION_EXP_MAP,
  calculatePetAffectionExp,
  calculateVariedAffectionExp,
  getAffectionTitle,
} from './utils/catAffection.ts';
import {
  getEatingMessage,
  getPlayMessage,
  canFeedCat,
  canPlayWithCat,
  MESSAGE_TOO_FULL_TO_EAT,
  MESSAGE_TOO_HUNGRY_TO_PLAY,
} from './utils/catCare.ts';
import { CatId } from './types/cat.ts';
import { FoodItem, ToyItem, LastCareAction } from './types/care.ts';

export default function App() {
  const { currentCatId, currentPreset, nextPreset, switchCat, selectCat } = useCatSelection();
  const { meow, isPlaying } = useCatAudio();
  const { getFullnessScore, getFullnessLevelForCat, feedCatFullness, playCatFullness } = useCatFullness();
  const { getMoodScore, getMoodLevelForCat, petCat, feedCat, playCat } = useCatMood({ getFullnessScore });
  const { activeFood, isEating, startFeeding, stopFeeding } = useCatFeeding();
  const { activeToy, isPlayingToy, startPlaying, stopPlaying } = useCatPlay({ durationMs: 3200 });
  const {
    getAffectionLevel,
    getAffectionProgress,
    getAffectionState,
    gainAffection,
  } = useCatAffection();
  const { inventory, receiveGift } = useCatGifts();
  const { levelUpState, triggerLevelUp } = useAffectionLevelUp();
  const { bubbleText, showBubble } = useSpeechBubble({ durationMs: 2200, minHoldMs: 1500 });

  // おくりもの一覧モーダルの開閉ステート
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // 直前のアクション（なでる・ごはん・おもちゃ）を記録し、ステータスメッセージに自然に反映
  const [lastAction, setLastAction] = useState<LastCareAction | null>(null);

  const currentMoodScore = getMoodScore(currentCatId);
  const currentMoodLevel = getMoodLevelForCat(currentCatId);
  const currentFullnessScore = getFullnessScore(currentCatId);
  const currentFullnessLevel = getFullnessLevelForCat(currentCatId);
  const currentAffectionLevel = getAffectionLevel(currentCatId);
  const currentAffectionProgress = getAffectionProgress(currentCatId);
  const currentAffectionState = getAffectionState(currentCatId);

  const handleInteractCat = () => {
    setLastAction('pet');
    // 撫でることで選択中の猫の機嫌を更新（過剰撫で時は愛撫誘発性攻撃により不機嫌になる）
    const { nextScore, nextLevel } = petCat(currentCatId);
    const isMoodChanged = nextLevel !== currentMoodLevel;
    const isAnnoyed = nextLevel === 'annoyed';

    // 不機嫌でない正常なふれあい時に、猫のごきげん度に応じたなつき度Expを獲得
    // ごきげん度が高ければ高いほど上昇幅が大きくなり、ごきげん度と同様に±1〜5%（±1〜5pt）ランダムで変動します
    if (!isAnnoyed && nextLevel !== 'annoyed') {
      const baseAffectionExp = calculatePetAffectionExp(nextScore);
      const variedAffectionExp = calculateVariedAffectionExp(baseAffectionExp);
      const affRes = gainAffection(currentCatId, variedAffectionExp);
      if (affRes.isLevelUp) {
        const gift = receiveGift(currentCatId);
        triggerLevelUp({
          level: affRes.nextLevel,
          catName: currentPreset.name,
          title: getAffectionTitle(affRes.nextLevel),
          isMaxBonus: affRes.isMaxBonus,
          gift,
        });
      }
    }

    // 機嫌レベルに応じた基本ピッチに自然な揺らぎを加えて鳴き声を再生（不機嫌時は低く鋭い威嚇音）
    const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
    const pitch = calculateVariedPitch(basePitch);
    meow({
      pitchMultiplier: pitch,
      duration: isAnnoyed ? 0.45 : nextLevel === 'ecstatic' ? 0.75 : 0.65,
    });

    // 猫ごと・機嫌レベルに応じた個性あるメッセージを吹き出しに表示（不機嫌突入時・機嫌変化時は即時反映）
    const msg = getMeowMessageForMood(currentPreset, nextLevel);
    showBubble(msg, { force: isMoodChanged || isAnnoyed });
  };

  const handleFeed = (food: FoodItem) => {
    // すでに食事中または遊び中なら新しいお世話アクションを受け付けない
    if (isEating || isPlayingToy) return;

    // まんぷく度が90%以上の時は「まんぷくで食べられない！」と表示し、ごはんをあげられない
    if (!canFeedCat(currentFullnessScore)) {
      showBubble(MESSAGE_TOO_FULL_TO_EAT, { force: true, durationMs: 2400 });
      return;
    }

    // 直前アクションをごはんに設定
    setLastAction('feed');

    // もし遊んでいる途中なら遊び演出を停止
    stopPlaying();

    // ごはんを与えて機嫌を大きく上昇させ、不機嫌も即時解消
    const { nextLevel } = feedCat(currentCatId, food.moodBoost);

    // ごはんを与えてまんぷく度を上昇
    feedCatFullness(currentCatId, food.fullnessBoost);

    // ごはんをあげることでなつき度ゲージを増加
    const foodExp = FOOD_AFFECTION_EXP_MAP[food.id] ?? 25;
    const affRes = gainAffection(currentCatId, foodExp);

    // 猫の足元にごはん皿イラストを描画し、お食事中アニメーションを開始
    startFeeding(food);

    // 美味しいごはんを食べた満足感を表現する明るい鳴き声
    const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
    const pitch = calculateVariedPitch(basePitch * 1.08);
    meow({
      pitchMultiplier: pitch,
      duration: 0.65,
    });

    // なつき度が上がった場合は画面中央に大きくお祝い演出を表示
    if (affRes.isLevelUp) {
      const gift = receiveGift(currentCatId);
      triggerLevelUp({
        level: affRes.nextLevel,
        catName: currentPreset.name,
        title: getAffectionTitle(affRes.nextLevel),
        isMaxBonus: affRes.isMaxBonus,
        gift,
      });
    }

    // ごはんもぐもぐメッセージを吹き出しに表示
    const msg = getEatingMessage(food, currentCatId);
    showBubble(msg, { force: true, durationMs: 2600 });
  };

  const handlePlay = (toy: ToyItem) => {
    // すでに食事中または遊び中なら新しいお世話アクションを受け付けない
    if (isEating || isPlayingToy) return;

    // まんぷく度が10%以下のときは「お腹が空いて遊べない！」と表示しておもちゃで遊べない
    if (!canPlayWithCat(currentFullnessScore)) {
      showBubble(MESSAGE_TOO_HUNGRY_TO_PLAY, { force: true, durationMs: 2400 });
      return;
    }

    // 直前アクションをおもちゃに設定
    setLastAction('play');

    // もし食事中なら食事演出を停止
    stopFeeding();

    // おもちゃで遊んで機嫌を大きく上昇させ、不機嫌も即時解消
    const { nextLevel } = playCat(currentCatId, toy.moodBoost);

    // おもちゃで遊んで運動し、まんぷく度を微減（5〜10%）
    playCatFullness(currentCatId);

    // おもちゃで遊ぶことでなつき度ゲージを増加
    const toyExp = TOY_AFFECTION_EXP_MAP[toy.id] ?? 20;
    const affRes = gainAffection(currentCatId, toyExp);

    // 猫の手前におもちゃイラストを描画し、遊び中アニメーションを開始
    startPlaying(toy);

    // おもちゃに夢中になって興奮した高めの明るい鳴き声
    const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
    const pitch = calculateVariedPitch(basePitch * 1.15);
    meow({
      pitchMultiplier: pitch,
      duration: 0.6,
    });

    // なつき度が上がった場合は画面中央に大きくお祝い演出を表示
    if (affRes.isLevelUp) {
      const gift = receiveGift(currentCatId);
      triggerLevelUp({
        level: affRes.nextLevel,
        catName: currentPreset.name,
        title: getAffectionTitle(affRes.nextLevel),
        isMaxBonus: affRes.isMaxBonus,
        gift,
      });
    }

    // おもちゃメッセージを吹き出しに表示
    const msg = getPlayMessage(toy, currentCatId);
    showBubble(msg, { force: true, durationMs: 2600 });
  };

  const handleSwitchCat = () => {
    stopFeeding();
    stopPlaying();
    setLastAction(null);
    switchCat();
    showBubble(`${nextPreset.name}にきりかえたよ♪`, { force: true, durationMs: 1600 });
  };

  const handleSelectCat = (id: CatId) => {
    if (id === currentCatId) return;
    stopFeeding();
    stopPlaying();
    setLastAction(null);
    selectCat(id);
    const target = getCatPresetById(id);
    showBubble(`${target.name}にきりかえたよ♪`, { force: true, durationMs: 1600 });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 selection:bg-orange-200">
      {/* 画面左上：これまでに受け取ったおくりもの一覧を開く宝箱ボタン */}
      <TreasureChestButton onClick={() => setIsGiftModalOpen(true)} />

      {/* ヘッダーエリア */}
      <header className="w-full max-w-md pt-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
          ねこっぽい
        </h1>
        <p className="text-sm text-stone-500 mt-2">
          猫ちゃんをなでなで（ドラッグ）してふれあってみよう
        </p>

        {/* シンプルな円形ラジオボタン風の猫切り替えコントロール */}
        <div className="mt-4 flex justify-center">
          <CatSelector
            currentCatId={currentCatId}
            onSelectCat={handleSelectCat}
            onSwitchNext={handleSwitchCat}
          />
        </div>
      </header>

      {/* メインアクションエリア */}
      <section className="flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* ごきげん＆まんぷくインジケーター（機嫌・満腹ゲージ＆ステータスバッジ） */}
        <div className="w-full max-w-xs mb-2">
          <CatMoodIndicator
            moodScore={currentMoodScore}
            moodLevel={currentMoodLevel}
            fullnessScore={currentFullnessScore}
            fullnessLevel={currentFullnessLevel}
            affectionLevel={currentAffectionLevel}
            affectionProgress={currentAffectionProgress}
            affectionExp={{
              current: currentAffectionState.currentExp,
              required: currentAffectionState.requiredExp,
            }}
            lastAction={lastAction}
            catName={currentPreset.name}
          />
        </div>

        {/* 鳴き声・切り替え吹き出し */}
        <div className="h-14 flex items-center justify-center mb-2 transition-all duration-300">
          {bubbleText ? (
            <div
              className={`animate-bounce bg-white px-4 py-2 rounded-2xl shadow-md border font-bold text-base flex items-center gap-1.5 ${
                currentMoodLevel === 'annoyed'
                  ? 'border-rose-300 text-rose-700'
                  : 'border-orange-200 text-orange-600'
              }`}
            >
              {currentMoodLevel === 'annoyed' ? (
                <Zap className="w-4 h-4 fill-rose-500 text-rose-500" />
              ) : (
                <Heart className="w-4 h-4 fill-orange-400 text-orange-400" />
              )}
              <span>{bubbleText}</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400 font-medium text-center">
              {currentPreset.description}（なでてみてね）
            </span>
          )}
        </div>

        {/* 猫のシルエット（ドラッグ操作でなでる・ごはんのお食事・おもちゃ遊び） */}
        <CatSilhouette
          preset={currentPreset}
          isReacting={isPlaying}
          moodLevel={currentMoodLevel}
          activeFood={activeFood}
          isEating={isEating}
          activeToy={activeToy}
          isPlayingToy={isPlayingToy}
          lastAction={lastAction}
          onPet={handleInteractCat}
        />
      </section>

      {/* フッターエリア */}
      <footer className="w-full max-w-md pb-6 text-center text-xs text-stone-400">
        <p>※ 音が出ます。端末の音量を調整してご利用ください。</p>
      </footer>

      {/* お世話サイドバー（画面端のお世話ボタン・ごはん・おもちゃサブメニュー） */}
      <CareSidebar
        currentCatName={currentPreset.name}
        isEating={isEating}
        isPlayingToy={isPlayingToy}
        currentFullnessScore={currentFullnessScore}
        onFeed={handleFeed}
        onPlay={handlePlay}
      />

      {/* なつき度レベルアップ時の中央巨大ハート＆祝うメッセージ演出オーバーレイ */}
      <AffectionLevelUpOverlay state={levelUpState} />

      {/* これまでに受け取ったおくりもの一覧モーダル画面 */}
      <GiftCollectionModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        inventory={inventory}
      />
    </main>
  );
}
