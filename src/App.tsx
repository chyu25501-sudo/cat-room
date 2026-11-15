import React, { useState, useMemo } from 'react';
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
import { useAppSettings } from './hooks/useAppSettings.ts';
import { useAchievements } from './hooks/useAchievements.ts';
import { useCareJournal } from './hooks/useCareJournal.ts';
import { useFirstVisitGuide } from './hooks/useFirstVisitGuide.ts';
import { CatSilhouette } from './components/CatSilhouette.tsx';
import { CatSelector } from './components/CatSelector.tsx';
import { CatMoodIndicator } from './components/CatMoodIndicator.tsx';
import { CareSidebar } from './components/care/CareSidebar.tsx';
import { AffectionLevelUpOverlay } from './components/AffectionLevelUpOverlay.tsx';
import { HowToPlayButton } from './components/guide/HowToPlayButton.tsx';
import { HowToPlayModal } from './components/guide/HowToPlayModal.tsx';
import { TreasureChestButton } from './components/gifts/TreasureChestButton.tsx';
import { GiftCollectionModal } from './components/gifts/GiftCollectionModal.tsx';
import { SettingsButton } from './components/settings/SettingsButton.tsx';
import { SettingsModal } from './components/settings/SettingsModal.tsx';
import { AchievementButton } from './components/achievements/AchievementButton.tsx';
import { AchievementToastOverlay } from './components/achievements/AchievementToastOverlay.tsx';
import { AchievementModal } from './components/achievements/AchievementModal.tsx';
import { JournalButton } from './components/journal/JournalButton.tsx';
import { JournalModal } from './components/journal/JournalModal.tsx';
import { calculateVariedPitch, getCatPresetById } from './utils/catPreset.ts';
import { resolveCatPresets } from './utils/catSettings.ts';
import { calculatePitchForMood, getMeowMessageForMood } from './utils/catMood.ts';
import { getTotalGiftCount, CAT_GIFTS } from './utils/catGifts.ts';
import { GiftItem } from './types/gift.ts';
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
import { CatId, CAT_PRESETS } from './types/cat.ts';
import { FoodItem, ToyItem, LastCareAction } from './types/care.ts';

export default function App() {
  const {
    isSoundEnabled,
    setSoundEnabled,
    catNames,
    setCatName,
    resetCatNames,
    gaugePosition,
    setGaugePosition,
  } = useAppSettings();
  const { currentCatId, switchCat, selectCat } = useCatSelection();

  // 猫プリセット一覧および現在・次のプリセットをカスタム名で解決
  const resolvedPresets = useMemo(
    () => resolveCatPresets(CAT_PRESETS, catNames),
    [catNames]
  );
  const currentPreset =
    resolvedPresets.find((p) => p.id === currentCatId) ?? resolvedPresets[0];
  const currentIndex = resolvedPresets.findIndex((p) => p.id === currentCatId);
  const nextPreset =
    resolvedPresets[(currentIndex + 1) % resolvedPresets.length] ?? resolvedPresets[0];
  const { meow, isPlaying } = useCatAudio({ soundEnabled: isSoundEnabled });
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
  const {
    unlocked: unlockedAchievements,
    toasts: achievementToasts,
    checkAndUnlock: checkAchievements,
    dismissToast: dismissAchievementToast,
  } = useAchievements();
  const { stats: careJournalStats, recordCareAction } = useCareJournal();

  // あそびかたモーダルの開閉ステート（初回訪問時は自動で強制表示、2回目以降は通常通り）
  const {
    isHowToPlayModalOpen,
    openHowToPlayModal,
    closeHowToPlayModal,
  } = useFirstVisitGuide();

  // おくりもの一覧モーダルの開閉ステート
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // 設定モーダルの開閉ステート
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 実績モーダルの開閉ステート
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  // ふり返り手帳モーダルの開閉ステート
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // 直前のアクション（なでる・ごはん・おもちゃ）を記録し、ステータスメッセージに自然に反映
  const [lastAction, setLastAction] = useState<LastCareAction | null>(null);

  const currentMoodScore = getMoodScore(currentCatId);
  const currentMoodLevel = getMoodLevelForCat(currentCatId);
  const currentFullnessScore = getFullnessScore(currentCatId);
  const currentFullnessLevel = getFullnessLevelForCat(currentCatId);
  const currentAffectionLevel = getAffectionLevel(currentCatId);
  const currentAffectionProgress = getAffectionProgress(currentCatId);
  const currentAffectionState = getAffectionState(currentCatId);

  // 全猫の中の最高なつき度レベルを算出するヘルパー
  const getMaxAffectionLevel = (overrideCatId?: CatId, overrideLevel?: number) => {
    return Math.max(
      ...resolvedPresets.map((p) => {
        if (p.id === overrideCatId && typeof overrideLevel === 'number') {
          return overrideLevel;
        }
        return getAffectionLevel(p.id);
      })
    );
  };

  // 全猫の中の最低なつき度レベルを算出するヘルパー
  const getMinAffectionLevel = (overrideCatId?: CatId, overrideLevel?: number) => {
    return Math.min(
      ...resolvedPresets.map((p) => {
        if (p.id === overrideCatId && typeof overrideLevel === 'number') {
          return overrideLevel;
        }
        return getAffectionLevel(p.id);
      })
    );
  };

  const handleInteractCat = () => {
    setLastAction('pet');
    // 撫でることで選択中の猫の機嫌を更新（過剰撫で時は愛撫誘発性攻撃により不機嫌になる）
    const { nextScore, nextLevel } = petCat(currentCatId);
    const isMoodChanged = nextLevel !== currentMoodLevel;
    const isAnnoyed = nextLevel === 'annoyed';

    // 不機嫌でない正常なふれあい時に、猫のごきげん度に応じたなつき度Expを獲得
    // ごきげん度が高ければ高いほど上昇幅が大きくなり、ごきげん度と同様に±1〜5%（±1〜5pt）ランダムで変動します
    let hasReceivedGift = false;
    let receivedGiftItem: GiftItem | null = null;
    let updatedAffectionLevel = currentAffectionLevel;
    if (!isAnnoyed && nextLevel !== 'annoyed') {
      const baseAffectionExp = calculatePetAffectionExp(nextScore);
      const variedAffectionExp = calculateVariedAffectionExp(baseAffectionExp);
      const affRes = gainAffection(currentCatId, variedAffectionExp);
      updatedAffectionLevel = affRes.nextLevel;
      if (affRes.isLevelUp) {
        const gift = receiveGift(currentCatId);
        receivedGiftItem = gift;
        hasReceivedGift = true;
        triggerLevelUp({
          level: affRes.nextLevel,
          catName: currentPreset.name,
          title: getAffectionTitle(affRes.nextLevel),
          isMaxBonus: affRes.isMaxBonus,
          gift,
        });
      }
    }

    // ふり返り手帳に撫でた記録を追加
    const updatedJournalStats = recordCareAction('pet', currentCatId);

    // インベントリの合計受取個数とレアギフト所持判定（レア以上の判定）
    const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';
    const currentTotalGifts = getTotalGiftCount(inventory) + (hasReceivedGift ? 1 : 0);
    const hasRareGift =
      isRareOrAbove(receivedGiftItem?.rarity) ||
      Object.keys(inventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity));
    const hasSuperRareGift =
      receivedGiftItem?.rarity === 'super-rare' ||
      Object.keys(inventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare');
    const hasUltraRareGift =
      receivedGiftItem?.rarity === 'ultra-rare' ||
      Object.keys(inventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare');

    // 実績判定（なでる・機嫌・まんぷく度・ギフト・手帳統計・なつき度）
    checkAchievements({
      action: 'pet',
      moodScore: nextScore,
      moodLevel: nextLevel,
      fullnessScore: currentFullnessScore,
      fullnessLevel: currentFullnessLevel,
      affectionLevel: updatedAffectionLevel,
      maxAffectionLevel: getMaxAffectionLevel(currentCatId, updatedAffectionLevel),
      minAffectionLevel: getMinAffectionLevel(currentCatId, updatedAffectionLevel),
      totalGifts: currentTotalGifts,
      receivedGift: receivedGiftItem,
      hasRareGift,
      hasSuperRareGift,
      hasUltraRareGift,
      giftInventory: inventory,
      careStats: updatedJournalStats,
    });

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
    const { nextScore, nextLevel } = feedCat(currentCatId, food.moodBoost);

    // ごはんを与えてまんぷく度を上昇
    const { nextScore: nextFullnessScore, nextLevel: nextFullnessLevel } = feedCatFullness(
      currentCatId,
      food.fullnessBoost
    );

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
    let hasReceivedGift = false;
    let receivedGiftItem: GiftItem | null = null;
    if (affRes.isLevelUp) {
      const gift = receiveGift(currentCatId);
      receivedGiftItem = gift;
      hasReceivedGift = true;
      triggerLevelUp({
        level: affRes.nextLevel,
        catName: currentPreset.name,
        title: getAffectionTitle(affRes.nextLevel),
        isMaxBonus: affRes.isMaxBonus,
        gift,
      });
    }

    // ふり返り手帳にごはんの記録を追加
    const updatedJournalStats = recordCareAction('feed', currentCatId);

    // インベントリの合計受取個数とレアギフト所持判定（レア以上の判定）
    const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';
    const currentTotalGifts = getTotalGiftCount(inventory) + (hasReceivedGift ? 1 : 0);
    const hasRareGift =
      isRareOrAbove(receivedGiftItem?.rarity) ||
      Object.keys(inventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity));
    const hasSuperRareGift =
      receivedGiftItem?.rarity === 'super-rare' ||
      Object.keys(inventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare');
    const hasUltraRareGift =
      receivedGiftItem?.rarity === 'ultra-rare' ||
      Object.keys(inventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare');

    // 実績判定（ごはん・機嫌・まんぷく度・ギフト・手帳統計・なつき度）
    checkAchievements({
      action: 'feed',
      moodScore: nextScore,
      moodLevel: nextLevel,
      fullnessScore: nextFullnessScore,
      fullnessLevel: nextFullnessLevel,
      affectionLevel: affRes.nextLevel,
      maxAffectionLevel: getMaxAffectionLevel(currentCatId, affRes.nextLevel),
      minAffectionLevel: getMinAffectionLevel(currentCatId, affRes.nextLevel),
      totalGifts: currentTotalGifts,
      receivedGift: receivedGiftItem,
      hasRareGift,
      hasSuperRareGift,
      hasUltraRareGift,
      giftInventory: inventory,
      careStats: updatedJournalStats,
    });

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
    const { nextScore, nextLevel } = playCat(currentCatId, toy.moodBoost);

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
    let hasReceivedGift = false;
    let receivedGiftItem: GiftItem | null = null;
    if (affRes.isLevelUp) {
      const gift = receiveGift(currentCatId);
      receivedGiftItem = gift;
      hasReceivedGift = true;
      triggerLevelUp({
        level: affRes.nextLevel,
        catName: currentPreset.name,
        title: getAffectionTitle(affRes.nextLevel),
        isMaxBonus: affRes.isMaxBonus,
        gift,
      });
    }

    // ふり返り手帳におもちゃ遊びの記録を追加
    const updatedJournalStats = recordCareAction('play', currentCatId);

    // インベントリの合計受取個数とレアギフト所持判定（レア以上の判定）
    const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';
    const currentTotalGifts = getTotalGiftCount(inventory) + (hasReceivedGift ? 1 : 0);
    const hasRareGift =
      isRareOrAbove(receivedGiftItem?.rarity) ||
      Object.keys(inventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity));
    const hasSuperRareGift =
      receivedGiftItem?.rarity === 'super-rare' ||
      Object.keys(inventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare');
    const hasUltraRareGift =
      receivedGiftItem?.rarity === 'ultra-rare' ||
      Object.keys(inventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare');

    // 実績判定（おもちゃ・機嫌・ギフト・手帳統計・なつき度）
    checkAchievements({
      action: 'play',
      moodScore: nextScore,
      moodLevel: nextLevel,
      fullnessScore: currentFullnessScore,
      fullnessLevel: currentFullnessLevel,
      affectionLevel: affRes.nextLevel,
      maxAffectionLevel: getMaxAffectionLevel(currentCatId, affRes.nextLevel),
      minAffectionLevel: getMinAffectionLevel(currentCatId, affRes.nextLevel),
      totalGifts: currentTotalGifts,
      receivedGift: receivedGiftItem,
      hasRareGift,
      hasSuperRareGift,
      hasUltraRareGift,
      giftInventory: inventory,
      careStats: updatedJournalStats,
    });

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
    const target = resolvedPresets.find((p) => p.id === id) ?? getCatPresetById(id);
    showBubble(`${target.name}にきりかえたよ♪`, { force: true, durationMs: 1600 });
  };

  const handleUpdateCatName = (catId: CatId, name: string) => {
    setCatName(catId, name);
    // 猫の名前を変更したときの実績判定
    checkAchievements({
      action: 'rename',
      isCatRenamed: true,
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 selection:bg-orange-200">
      {/* メイン画面上部の実績獲得トースト通知（複数同時獲得時は縦並び表示） */}
      <AchievementToastOverlay toasts={achievementToasts} onDismiss={dismissAchievementToast} />

      {/* 画面左上：あそびかたボタン・おくりもの一覧ボタン・実績ボタン・ふり返り手帳ボタン・設定ボタン */}
      <HowToPlayButton onClick={openHowToPlayModal} />
      <TreasureChestButton onClick={() => setIsGiftModalOpen(true)} />
      <AchievementButton onClick={() => setIsAchievementModalOpen(true)} />
      <JournalButton onClick={() => setIsJournalModalOpen(true)} />
      <SettingsButton onClick={() => setIsSettingsModalOpen(true)} />

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
            presets={resolvedPresets}
            onSelectCat={handleSelectCat}
            onSwitchNext={handleSwitchCat}
          />
        </div>
      </header>

      {/* メインアクションエリア */}
      <section
        className={`flex flex-col items-center justify-center my-auto w-full transition-all duration-300 ${
          gaugePosition === 'side' ? 'max-w-md' : 'max-w-sm'
        }`}
      >
        {/* 鳴き声・切り替え吹き出し */}
        <div className="h-14 flex items-center justify-center mb-1 transition-all duration-300">
          {bubbleText ? (
            <div
              data-testid="speech-bubble"
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

        {/* 猫エリア（サイド表示設定時は猫とシンプルゲージを横並びに配置） */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full">
          {/* 猫のシルエット（猫切り替えボタンのすぐ下に配置：ドラッグ操作でなでる・ごはんのお食事・おもちゃ遊び） */}
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

          {/* 猫の横側（シンプル簡略化）ゲージ表示 */}
          {gaugePosition === 'side' && (
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
              layout="side"
            />
          )}
        </div>

        {/* ごきげん＆まんぷく・なつき度インジケーター（デフォルト: 猫の下・画面下部へ配置） */}
        {gaugePosition === 'bottom' && (
          <div className="w-full max-w-xs mt-3 mb-2">
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
              layout="bottom"
            />
          </div>
        )}
      </section>

      {/* フッターエリア */}
      <footer className="w-full max-w-md pb-6 text-center text-xs text-stone-400">
        <p>
          {isSoundEnabled
            ? '※ 音が出ます。端末の音量を調整してご利用ください。'
            : '※ サウンドはオフに設定されています。設定からいつでもオンにできます。'}
        </p>
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

      {/* あそびかた（ガイド）モーダル画面 */}
      <HowToPlayModal
        isOpen={isHowToPlayModalOpen}
        onClose={closeHowToPlayModal}
      />

      {/* これまでに受け取ったおくりもの一覧モーダル画面 */}
      <GiftCollectionModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        inventory={inventory}
        catNames={catNames}
      />

      {/* 設定モーダル画面 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={setSoundEnabled}
        catNames={catNames}
        onUpdateCatName={handleUpdateCatName}
        onResetCatNames={resetCatNames}
        gaugePosition={gaugePosition}
        onChangeGaugePosition={setGaugePosition}
      />

      {/* 実績一覧モーダル画面 */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        unlocked={unlockedAchievements}
      />

      {/* ふり返り手帳モーダル画面 */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        stats={careJournalStats}
        catNames={catNames}
      />
    </main>
  );
}
