import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import { useGiftToasts } from './hooks/useGiftToasts.ts';
import { usePageVisibility } from './hooks/usePageVisibility.ts';
import { useCloudSync } from './hooks/useCloudSync.ts';
import { CatSilhouette } from './components/CatSilhouette.tsx';
import { CatSelector } from './components/CatSelector.tsx';
import { CatMoodIndicator } from './components/CatMoodIndicator.tsx';
import { CareSidebar } from './components/care/CareSidebar.tsx';
import { OfflineCareReportModal } from './components/care/OfflineCareReportModal.tsx';
import { AffectionLevelUpOverlay } from './components/AffectionLevelUpOverlay.tsx';
import { HowToPlayButton } from './components/guide/HowToPlayButton.tsx';
import { HowToPlayModal } from './components/guide/HowToPlayModal.tsx';
import { TreasureChestButton } from './components/gifts/TreasureChestButton.tsx';
import { GiftCollectionModal } from './components/gifts/GiftCollectionModal.tsx';
import { GiftToastOverlay } from './components/gifts/GiftToastOverlay.tsx';
import { SettingsButton } from './components/settings/SettingsButton.tsx';
import { SettingsModal } from './components/settings/SettingsModal.tsx';
import { AchievementButton } from './components/achievements/AchievementButton.tsx';
import { AchievementToastOverlay } from './components/achievements/AchievementToastOverlay.tsx';
import { AchievementModal } from './components/achievements/AchievementModal.tsx';
import { JournalButton } from './components/journal/JournalButton.tsx';
import { JournalModal } from './components/journal/JournalModal.tsx';
import { calculateVariedPitch, getCatPresetById } from './utils/catPreset.ts';
import { resolveCatPresets, getCatDisplayName } from './utils/catSettings.ts';
import { calculatePitchForMood, getMeowMessageForMood } from './utils/catMood.ts';
import { getTotalGiftCount, addGiftToInventory, CAT_GIFTS } from './utils/catGifts.ts';
import { GiftItem } from './types/gift.ts';
import {
  isAutoFeedUnlocked,
  AUTO_FEED_THRESHOLD_FULLNESS,
  AUTO_FEED_FOOD_ID,
  AUTO_FEED_FOOD_FULLNESS_BOOST,
  AUTO_FEED_FOOD_EXP,
  simulateAllCatsOfflineAutoFeed,
  AllCatsOfflineFeedResult,
  applyAutoFeedToCareStats,
  BACKGROUND_TAB_IDLE_REPORT_THRESHOLD_MS,
} from './utils/autoFeed.ts';
import {
  DEFAULT_PET_AFFECTION_EXP,
  FOOD_AFFECTION_EXP_MAP,
  TOY_AFFECTION_EXP_MAP,
  calculatePetAffectionExp,
  calculateVariedAffectionExp,
  getAffectionTitle,
} from './utils/catAffection.ts';
import {
  FOOD_ITEMS,
  getEatingMessage,
  getPlayMessage,
  canFeedCat,
  canPlayWithCat,
  isFoodUnlocked,
  isToyUnlocked,
  MESSAGE_TOO_FULL_TO_EAT,
  MESSAGE_TOO_HUNGRY_TO_PLAY,
} from './utils/catCare.ts';
import { CatId, CAT_PRESETS } from './types/cat.ts';
import { FoodItem, ToyItem, LastCareAction } from './types/care.ts';
import { AffectionLevelUpTriggerPayload } from './types/affection.ts';
import { NekoppoiSaveData, SAVE_DATA_VERSION } from './types/saveData.ts';
import { mergeSaveData, serializeSaveData, parseSaveDataJson } from './utils/saveData.ts';
import { downloadJsonFile, readTextFile } from './utils/fileTransfer.ts';

export default function App() {
  const {
    isSoundEnabled,
    setSoundEnabled,
    catNames,
    setCatName,
    resetCatNames,
    gaugePosition,
    setGaugePosition,
    isAutoFeedEnabled,
    setAutoFeedEnabled,
    isCompactAffectionCelebration,
    setCompactAffectionCelebration,
    restoreSettings,
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
  const { meow, playFanfare, isPlaying } = useCatAudio({ soundEnabled: isSoundEnabled });
  const {
    fullnessMap,
    getFullnessScore,
    getFullnessLevelForCat,
    feedCatFullness,
    playCatFullness,
    restoreFullnessMap,
  } = useCatFullness();
  const { getMoodScore, getMoodLevelForCat, petCat, feedCat, playCat } = useCatMood({ getFullnessScore });
  const { activeFood, isEating, startFeeding, stopFeeding } = useCatFeeding();
  const { activeToy, isPlayingToy, startPlaying, stopPlaying } = useCatPlay({ durationMs: 3200 });
  const {
    affectionMap,
    getAffectionLevel,
    getAffectionProgress,
    getAffectionState,
    gainAffection,
    restoreAffectionMap,
  } = useCatAffection();
  const { inventory, receiveGift, restoreInventory } = useCatGifts();
  const { levelUpState, triggerLevelUp } = useAffectionLevelUp();
  const { toasts: giftToasts, addGiftToast, dismissGiftToast } = useGiftToasts();

  // なつき度レベルアップ（またはMAXボーナス）時の共通演出（ハートマーク表示と同時にかわいいファンファーレを再生）
  const showLevelUpCelebration = useCallback(
    (payload: AffectionLevelUpTriggerPayload) => {
      triggerLevelUp(payload);
      playFanfare();
    },
    [triggerLevelUp, playFanfare]
  );
  const { bubbleText, showBubble } = useSpeechBubble({ durationMs: 2200, minHoldMs: 1500 });
  const {
    unlocked: unlockedAchievements,
    toasts: achievementToasts,
    checkAndUnlock: checkAchievements,
    dismissToast: dismissAchievementToast,
    restoreAchievements,
  } = useAchievements();
  const { stats: careJournalStats, recordCareAction, addAutoFeedStats, restoreStats } = useCareJournal();

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

  // 自動ごはんの解禁状態（全猫のなつき度がLv.10以上で解禁）
  const isAutoFeedUnlockedValue = useMemo(
    () => isAutoFeedUnlocked(affectionMap),
    [affectionMap]
  );
  // 自動ごはんが現在実際に稼働しているかどうか
  const isAutoFeedActive = isAutoFeedEnabled && isAutoFeedUnlockedValue;

  // なつき度アップ時の演出を簡略化（控えめな通知）にするかどうか
  // （設定「なつき度演出の簡略化」がオン、または自動ごはんが有効な場合に控えめな通知にする）
  const isAffectionCelebrationCompact = isCompactAffectionCelebration || isAutoFeedActive;

  // なつき度アップ時の演出トリガー（簡略化時は控えめなトースト通知、通常時は中央巨大ハート演出を表示）
  const triggerAffectionCelebration = useCallback(
    (catId: CatId, catName: string, level: number, gift: GiftItem, isMaxBonus?: boolean) => {
      if (isAffectionCelebrationCompact) {
        addGiftToast({
          catId,
          catName,
          gift,
        });
      } else {
        showLevelUpCelebration({
          level,
          catName,
          title: getAffectionTitle(level),
          isMaxBonus,
          gift,
        });
      }
    },
    [isAffectionCelebrationCompact, addGiftToast, showLevelUpCelebration]
  );

  // 留守番レポートモーダル用のステート
  const [offlineReportData, setOfflineReportData] = useState<AllCatsOfflineFeedResult | null>(null);
  const [isOfflineReportModalOpen, setIsOfflineReportModalOpen] = useState(false);

  // タブ切り替え・バックグラウンド放置時の復帰コールバック
  const handleTabVisible = useCallback(
    (hiddenDurationMs: number) => {
      const LAST_ACTIVE_TIME_KEY = 'nekoppoi_last_active_time';

      // 自動ごはんが有効かつ10分以上放置され、まだ留守番レポートモーダルが開いていない場合
      if (
        isAutoFeedActive &&
        hiddenDurationMs >= BACKGROUND_TAB_IDLE_REPORT_THRESHOLD_MS &&
        !isOfflineReportModalOpen
      ) {
        const catExpMap: Record<CatId, number> = {
          black: affectionMap.black?.currentExp ?? 0,
          white: affectionMap.white?.currentExp ?? 0,
          calico: affectionMap.calico?.currentExp ?? 0,
        };
        const catFullnessMap: Record<CatId, number> = {
          black: fullnessMap.black?.score ?? 50,
          white: fullnessMap.white?.score ?? 50,
          calico: fullnessMap.calico?.score ?? 50,
        };

        const simResult = simulateAllCatsOfflineAutoFeed({
          catExpMap,
          catFullnessMap,
          elapsedMs: hiddenDurationMs,
          catalog: CAT_GIFTS,
        });

        if (simResult.totalFeedCount > 0) {
          setOfflineReportData(simResult);
          setIsOfflineReportModalOpen(true);
        }
      }

      // 復帰時にアクティブ時刻を最新に更新
      try {
        localStorage.setItem(LAST_ACTIVE_TIME_KEY, Date.now().toString());
      } catch {}
    },
    [isAutoFeedActive, isOfflineReportModalOpen, affectionMap, fullnessMap]
  );

  const { isVisible } = usePageVisibility({
    onVisible: handleTabVisible,
  });

  const isVisibleRef = useRef(isVisible);
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // 留守中（オフライン放置）のシミュレーション（起動時に判定、定期的に最終時刻を更新）
  useEffect(() => {
    const LAST_ACTIVE_TIME_KEY = 'nekoppoi_last_active_time';
    const now = Date.now();
    try {
      const storedTime = localStorage.getItem(LAST_ACTIVE_TIME_KEY);
      if (storedTime && isAutoFeedActive) {
        const lastTime = parseInt(storedTime, 10);
        const elapsedMs = now - lastTime;
        // 1分以上経過している場合
        if (!isNaN(lastTime) && elapsedMs >= 60 * 1000) {
          const catExpMap: Record<CatId, number> = {
            black: affectionMap.black?.currentExp ?? 0,
            white: affectionMap.white?.currentExp ?? 0,
            calico: affectionMap.calico?.currentExp ?? 0,
          };
          const catFullnessMap: Record<CatId, number> = {
            black: fullnessMap.black?.score ?? 50,
            white: fullnessMap.white?.score ?? 50,
            calico: fullnessMap.calico?.score ?? 50,
          };

          const simResult = simulateAllCatsOfflineAutoFeed({
            catExpMap,
            catFullnessMap,
            elapsedMs,
            catalog: CAT_GIFTS,
          });

          if (simResult.totalFeedCount > 0) {
            setOfflineReportData(simResult);
            setIsOfflineReportModalOpen(true);
          }
        }
      }
      localStorage.setItem(LAST_ACTIVE_TIME_KEY, now.toString());
    } catch {}

    const intervalTimer = setInterval(() => {
      // タブが非表示のときはアクティブ時刻の自動更新を停止（バックグラウンド放置時間を維持）
      if (!isVisibleRef.current) return;
      try {
        localStorage.setItem(LAST_ACTIVE_TIME_KEY, Date.now().toString());
      } catch {}
    }, 3000);

    return () => clearInterval(intervalTimer);
  }, [isAutoFeedActive]);

  // オンライン中の自動給餌タイマー（3秒ごとに全猫を監視）
  useEffect(() => {
    // 自動ごはんが無効、またはタブが非表示（バックグラウンド）の間は給餌を行わない（二重給餌防止）
    if (!isAutoFeedActive || !isVisible) return;

    const timer = setInterval(() => {
      const targetCats: CatId[] = ['black', 'white', 'calico'];
      const kibbleFood = FOOD_ITEMS.find((f) => f.id === AUTO_FEED_FOOD_ID) ?? FOOD_ITEMS[0];

      for (const catId of targetCats) {
        const score = getFullnessScore(catId);
        // 40%以下のとき自動給餌実行
        if (score <= AUTO_FEED_THRESHOLD_FULLNESS) {
          const { nextScore: nextFullness, nextLevel: nextFullnessLevel } = feedCatFullness(
            catId,
            AUTO_FEED_FOOD_FULLNESS_BOOST
          );
          const updatedStats = recordCareAction('feed', catId);
          const affRes = gainAffection(catId, AUTO_FEED_FOOD_EXP);

          // 選択中の猫ならごはん皿アニメーション
          if (catId === currentCatId && !isEating && !isPlayingToy) {
            startFeeding(kibbleFood);
          }

          // なつき度満タン（おくりもの獲得）
          if (affRes.isLevelUp) {
            const gift = receiveGift(catId);
            const catDisplayName = getCatDisplayName(catId, catNames);

            // 自動ごはん稼働中は画面中央の大きな演出は出さず、控えめなミニトースト通知を表示
            addGiftToast({
              catId,
              catName: catDisplayName,
              gift,
            });

            // 最新のおくりものインベントリを計算
            const nextInventory = addGiftToInventory(inventory, gift.id, catId);
            const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';

            // 実績判定
            checkAchievements({
              action: 'feed',
              moodScore: getMoodScore(catId),
              moodLevel: getMoodLevelForCat(catId),
              fullnessScore: nextFullness,
              fullnessLevel: nextFullnessLevel,
              affectionLevel: affRes.nextLevel,
              maxAffectionLevel: getMaxAffectionLevel(catId, affRes.nextLevel),
              minAffectionLevel: getMinAffectionLevel(catId, affRes.nextLevel),
              totalGifts: getTotalGiftCount(nextInventory),
              receivedGift: gift,
              hasRareGift:
                isRareOrAbove(gift.rarity) ||
                Object.keys(nextInventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity)),
              hasSuperRareGift:
                gift.rarity === 'super-rare' ||
                gift.rarity === 'ultra-rare' ||
                Object.keys(nextInventory).some((id) => {
                  const r = CAT_GIFTS.find((g) => g.id === id)?.rarity;
                  return r === 'super-rare' || r === 'ultra-rare';
                }),
              hasUltraRareGift:
                gift.rarity === 'ultra-rare' ||
                Object.keys(nextInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare'),
              giftInventory: nextInventory,
              careStats: updatedStats,
            });
          }
        }
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [
    isAutoFeedActive,
    isVisible,
    currentCatId,
    isEating,
    isPlayingToy,
    getFullnessScore,
    feedCatFullness,
    recordCareAction,
    gainAffection,
    startFeeding,
    receiveGift,
    catNames,
    addGiftToast,
    checkAchievements,
    getMoodScore,
    getMoodLevelForCat,
    inventory,
  ]);

  // 留守番レポート受け取りハンドラー
  const handleAcceptOfflineReport = useCallback(() => {
    if (!offlineReportData) {
      setIsOfflineReportModalOpen(false);
      return;
    }

    // 1. おくりものをインベントリに登録
    for (const { catId, gift } of offlineReportData.allEarnedGifts) {
      receiveGift(catId, gift);
    }

    // 2. 各猫のExpとなつき度、まんぷく度を更新
    for (const [catIdStr, res] of Object.entries(offlineReportData.catResults)) {
      const catId = catIdStr as CatId;
      if (res.totalExpGained > 0) {
        gainAffection(catId, res.totalExpGained);
      }
      if (typeof res.finalFullness === 'number') {
        const currentScore = getFullnessScore(catId);
        const diff = res.finalFullness - currentScore;
        feedCatFullness(catId, diff);
      }
    }

    // 3. 手帳統計のごはん回数のみ加算（ふれあい日数は進めない！）
    const feedCountsByCat: Record<string, number> = {
      black: offlineReportData.catResults.black?.feedCount ?? 0,
      white: offlineReportData.catResults.white?.feedCount ?? 0,
      calico: offlineReportData.catResults.calico?.feedCount ?? 0,
    };
    const updatedJournalStats = applyAutoFeedToCareStats(
      careJournalStats,
      feedCountsByCat as Record<CatId, number>
    );
    addAutoFeedStats(feedCountsByCat);

    // 4. 最新のおくりものインベントリを計算
    let updatedInventory = inventory;
    for (const { catId, gift } of offlineReportData.allEarnedGifts) {
      updatedInventory = addGiftToInventory(updatedInventory, gift.id, catId);
    }
    const updatedTotalGifts = getTotalGiftCount(updatedInventory);

    // 5. レアおくりものの所持判定
    const hasRareGift =
      offlineReportData.allEarnedGifts.some(
        ({ gift }) => gift.rarity === 'rare' || gift.rarity === 'super-rare' || gift.rarity === 'ultra-rare'
      ) ||
      Object.keys(updatedInventory).some((id) => {
        const item = CAT_GIFTS.find((g) => g.id === id);
        return item?.rarity === 'rare' || item?.rarity === 'super-rare' || item?.rarity === 'ultra-rare';
      });

    const hasSuperRareGift =
      offlineReportData.allEarnedGifts.some(
        ({ gift }) => gift.rarity === 'super-rare' || gift.rarity === 'ultra-rare'
      ) ||
      Object.keys(updatedInventory).some((id) => {
        const item = CAT_GIFTS.find((g) => g.id === id);
        return item?.rarity === 'super-rare' || item?.rarity === 'ultra-rare';
      });

    const hasUltraRareGift =
      offlineReportData.allEarnedGifts.some(
        ({ gift }) => gift.rarity === 'ultra-rare'
      ) ||
      Object.keys(updatedInventory).some((id) => {
        const item = CAT_GIFTS.find((g) => g.id === id);
        return item?.rarity === 'ultra-rare';
      });

    // 6. ウィンドウを閉じる
    setIsOfflineReportModalOpen(false);
    setOfflineReportData(null);

    // 7. 実績判定（留守中の給餌累計回数・おくりもの獲得等により達成された実績があるか確認）
    checkAchievements({
      action: 'feed',
      moodScore: getMoodScore(currentCatId),
      moodLevel: getMoodLevelForCat(currentCatId),
      fullnessScore: getFullnessScore(currentCatId),
      fullnessLevel: currentFullnessLevel,
      affectionLevel: getMaxAffectionLevel(),
      maxAffectionLevel: getMaxAffectionLevel(),
      minAffectionLevel: getMinAffectionLevel(),
      totalGifts: updatedTotalGifts,
      receivedGift:
        offlineReportData.allEarnedGifts.length > 0
          ? offlineReportData.allEarnedGifts[offlineReportData.allEarnedGifts.length - 1].gift
          : null,
      hasRareGift,
      hasSuperRareGift,
      hasUltraRareGift,
      giftInventory: updatedInventory,
      careStats: updatedJournalStats,
    });
  }, [
    offlineReportData,
    receiveGift,
    gainAffection,
    getFullnessScore,
    feedCatFullness,
    addAutoFeedStats,
    careJournalStats,
    inventory,
    checkAchievements,
    getMoodScore,
    getMoodLevelForCat,
    currentCatId,
    currentFullnessLevel,
    getMaxAffectionLevel,
    getMinAffectionLevel,
  ]);

  // 現在のローカル全体のセーブデータを生成するヘルパー関数
  const getCurrentSaveData = useCallback((): NekoppoiSaveData => {
    const LAST_ACTIVE_TIME_KEY = 'nekoppoi_last_active_time';
    let lastActiveTime = Date.now();
    try {
      const stored = localStorage.getItem(LAST_ACTIVE_TIME_KEY);
      if (stored) lastActiveTime = parseInt(stored, 10);
    } catch {}

    return {
      version: SAVE_DATA_VERSION,
      timestamp: Date.now(),
      settings: {
        soundEnabled: isSoundEnabled,
        catNames,
        gaugePosition,
        autoFeedEnabled: isAutoFeedEnabled,
        compactAffectionCelebration: isCompactAffectionCelebration,
      },
      affection: affectionMap,
      fullness: fullnessMap,
      gifts: inventory,
      achievements: unlockedAchievements,
      careJournal: careJournalStats,
      lastActiveTime,
      guideSeen: true,
    };
  }, [
    isSoundEnabled,
    catNames,
    gaugePosition,
    isAutoFeedEnabled,
    isCompactAffectionCelebration,
    affectionMap,
    fullnessMap,
    inventory,
    unlockedAchievements,
    careJournalStats,
  ]);

  // マージ後のセーブデータを各フック・ローカルストレージへ一括反映するヘルパー関数
  const applyMergedSaveData = useCallback(
    (merged: NekoppoiSaveData) => {
      const LAST_ACTIVE_TIME_KEY = 'nekoppoi_last_active_time';
      if (merged.settings) {
        restoreSettings(merged.settings);
      }
      if (merged.affection) {
        restoreAffectionMap(merged.affection);
      }
      if (merged.fullness) {
        restoreFullnessMap(merged.fullness);
      }
      if (merged.gifts) {
        restoreInventory(merged.gifts);
      }
      if (merged.achievements) {
        restoreAchievements(merged.achievements);
      }
      if (merged.careJournal) {
        restoreStats(merged.careJournal);
      }
      if (merged.lastActiveTime) {
        try {
          localStorage.setItem(LAST_ACTIVE_TIME_KEY, merged.lastActiveTime.toString());
        } catch {}
      }
    },
    [
      restoreSettings,
      restoreAffectionMap,
      restoreFullnessMap,
      restoreInventory,
      restoreAchievements,
      restoreStats,
    ]
  );

  // クラウド同期・認証フック
  const {
    isConfigured: isCloudConfigured,
    user: cloudUser,
    syncStatus: cloudSyncStatus,
    syncMessage: cloudSyncMessage,
    lastSyncedAt: cloudLastSyncedAt,
    signUp: handleCloudSignUp,
    signIn: handleCloudSignIn,
    signOut: handleCloudSignOut,
    syncWithCloud,
  } = useCloudSync();

  // クラウド手動・自動同期ハンドラー（多重実行ガード付き）
  const isSyncingRef = useRef<boolean>(false);
  const handleCloudSyncNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const currentLocal = getCurrentSaveData();
      const synced = await syncWithCloud(currentLocal);
      if (synced) {
        applyMergedSaveData(synced);
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, [getCurrentSaveData, syncWithCloud, applyMergedSaveData]);

  // 最新のハンドラーを ref に保持
  const handleCloudSyncNowRef = useRef(handleCloudSyncNow);
  handleCloudSyncNowRef.current = handleCloudSyncNow;

  // ログイン状態になったとき（ユーザーIDが切り替わった初回1回のみ）自動同期を実行
  const syncedUserIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (cloudUser) {
      if (syncedUserIdRef.current !== cloudUser.id) {
        syncedUserIdRef.current = cloudUser.id;
        handleCloudSyncNowRef.current();
      }
    } else {
      syncedUserIdRef.current = null;
    }
  }, [cloudUser?.id]);

  // おくりもの獲得・実績獲得・お留守番レポート受け取り時の自動クラウド同期
  const prevInventoryCountRef = useRef<number | null>(null);
  const prevAchievementCountRef = useRef<number | null>(null);
  const prevOfflineReportActiveRef = useRef<boolean>(false);

  useEffect(() => {
    if (!cloudUser) {
      prevInventoryCountRef.current = null;
      prevAchievementCountRef.current = null;
      prevOfflineReportActiveRef.current = false;
      return;
    }

    const currentGiftTotal = getTotalGiftCount(inventory);
    const currentAchievementTotal = Object.keys(unlockedAchievements).length;
    const isReportActive = Boolean(offlineReportData);

    // 初回レンダリング時は現在の数値を記録してスキップ
    if (prevInventoryCountRef.current === null || prevAchievementCountRef.current === null) {
      prevInventoryCountRef.current = currentGiftTotal;
      prevAchievementCountRef.current = currentAchievementTotal;
      prevOfflineReportActiveRef.current = isReportActive;
      return;
    }

    const hasNewGift = currentGiftTotal > prevInventoryCountRef.current;
    const hasNewAchievement = currentAchievementTotal > prevAchievementCountRef.current;
    const hasAcceptedReport = prevOfflineReportActiveRef.current && !isReportActive;

    prevInventoryCountRef.current = currentGiftTotal;
    prevAchievementCountRef.current = currentAchievementTotal;
    prevOfflineReportActiveRef.current = isReportActive;

    if (hasNewGift || hasNewAchievement || hasAcceptedReport) {
      const timer = setTimeout(() => {
        handleCloudSyncNowRef.current();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inventory, unlockedAchievements, offlineReportData, cloudUser]);

  // セーブデータのエクスポート（ファイル書き出し）
  const handleExportSaveData = useCallback(() => {
    const saveData = getCurrentSaveData();
    const jsonString = serializeSaveData(saveData);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    downloadJsonFile(jsonString, `nekoppoi_save_${dateStr}.json`);
  }, [getCurrentSaveData]);

  // セーブデータのインポート（ファイル読み込み・賢いマージ）
  const handleImportSaveData = useCallback(
    async (file: File): Promise<{ success: boolean; message: string }> => {
      try {
        const text = await readTextFile(file);
        const incomingData = parseSaveDataJson(text);
        if (!incomingData) {
          return {
            success: false,
            message: '有効なセーブデータファイル（JSON）ではありません。',
          };
        }

        const localSaveData = getCurrentSaveData();

        // 賢いマージを実行
        const merged = mergeSaveData(localSaveData, incomingData);

        // 各ステートへ一括反映
        applyMergedSaveData(merged);

        // もしクラウド連携中であれば、合算結果をクラウドへも同期
        if (cloudUser) {
          await syncWithCloud(merged);
        }

        return {
          success: true,
          message: 'セーブデータを正常に読み込み、現在のデータと合算・引き継ぎました！',
        };
      } catch (e) {
        console.error('Failed to import save data:', e);
        return {
          success: false,
          message: 'ファイルの読み込み中にエラーが発生しました。',
        };
      }
    },
    [getCurrentSaveData, applyMergedSaveData, cloudUser, syncWithCloud]
  );

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
    let isLevelUpCelebration = false;
    let currentInventory = inventory;
    if (!isAnnoyed && nextLevel !== 'annoyed') {
      const baseAffectionExp = calculatePetAffectionExp(nextScore);
      const variedAffectionExp = calculateVariedAffectionExp(baseAffectionExp);
      const affRes = gainAffection(currentCatId, variedAffectionExp);
      updatedAffectionLevel = affRes.nextLevel;
      if (affRes.isLevelUp) {
        if (!isAffectionCelebrationCompact) {
          isLevelUpCelebration = true;
        }
        const gift = receiveGift(currentCatId);
        receivedGiftItem = gift;
        hasReceivedGift = true;
        currentInventory = addGiftToInventory(inventory, gift.id, currentCatId);
        triggerAffectionCelebration(
          currentCatId,
          currentPreset.name,
          affRes.nextLevel,
          gift,
          affRes.isMaxBonus
        );
      }
    }

    // ふり返り手帳に撫でた記録を追加
    const updatedJournalStats = recordCareAction('pet', currentCatId);

    // インベントリの合計受取個数とレアギフト所持判定（レア以上の判定）
    const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';
    const currentTotalGifts = getTotalGiftCount(currentInventory);
    const hasRareGift =
      isRareOrAbove(receivedGiftItem?.rarity) ||
      Object.keys(currentInventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity));
    const hasSuperRareGift =
      receivedGiftItem?.rarity === 'super-rare' ||
      Object.keys(currentInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare');
    const hasUltraRareGift =
      receivedGiftItem?.rarity === 'ultra-rare' ||
      Object.keys(currentInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare');

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
      giftInventory: currentInventory,
      careStats: updatedJournalStats,
    });

    // 機嫌レベルに応じた基本ピッチに自然な揺らぎを加えて鳴き声を再生（不機嫌時は低く鋭い威嚇音）
    // ※なつき度上昇・レベルアップ時はファンファーレが鳴るため、音が被って濁るのを防ぐため通常のmeowは鳴らさない
    if (!isLevelUpCelebration) {
      const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
      const pitch = calculateVariedPitch(basePitch);
      meow({
        pitchMultiplier: pitch,
        duration: isAnnoyed ? 0.45 : nextLevel === 'ecstatic' ? 0.75 : 0.65,
      });
    }

    // 猫ごと・機嫌レベルに応じた個性あるメッセージを吹き出しに表示（不機嫌突入時・機嫌変化時は即時反映）
    const msg = getMeowMessageForMood(currentPreset, nextLevel);
    showBubble(msg, { force: isMoodChanged || isAnnoyed });
  };

  const handleFeed = (food: FoodItem) => {
    // なつき度レベルが不足している場合は給餌できない
    if (!isFoodUnlocked(food, currentAffectionLevel)) return;

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

    // なつき度が上がった場合は画面中央に大きくお祝い演出＆かわいいファンファーレを表示
    // ※レベルアップ時はファンファーレを主役に響かせるため、通常の食事鳴き声と音が被らないようにする
    let hasReceivedGift = false;
    let receivedGiftItem: GiftItem | null = null;
    let currentInventory = inventory;
    if (affRes.isLevelUp) {
      const gift = receiveGift(currentCatId);
      receivedGiftItem = gift;
      hasReceivedGift = true;
      currentInventory = addGiftToInventory(inventory, gift.id, currentCatId);
      triggerAffectionCelebration(
        currentCatId,
        currentPreset.name,
        affRes.nextLevel,
        gift,
        affRes.isMaxBonus
      );
      if (isAffectionCelebrationCompact) {
        // 簡略化時はファンファーレが鳴らないため、通常の食事満足鳴き声を再生
        const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
        const pitch = calculateVariedPitch(basePitch * 1.08);
        meow({
          pitchMultiplier: pitch,
          duration: 0.65,
        });
      }
    } else {
      // 通常時は美味しいごはんを食べた満足感を表現する明るい鳴き声を再生
      const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
      const pitch = calculateVariedPitch(basePitch * 1.08);
      meow({
        pitchMultiplier: pitch,
        duration: 0.65,
      });
    }

    // ふり返り手帳にごはんの記録を追加
    const updatedJournalStats = recordCareAction('feed', currentCatId);

    // インベントリの合計受取個数とレアギフト所持判定（レア以上の判定）
    const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';
    const currentTotalGifts = getTotalGiftCount(currentInventory);
    const hasRareGift =
      isRareOrAbove(receivedGiftItem?.rarity) ||
      Object.keys(currentInventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity));
    const hasSuperRareGift =
      receivedGiftItem?.rarity === 'super-rare' ||
      Object.keys(currentInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare');
    const hasUltraRareGift =
      receivedGiftItem?.rarity === 'ultra-rare' ||
      Object.keys(currentInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare');

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
      giftInventory: currentInventory,
      careStats: updatedJournalStats,
    });

    // ごはんもぐもぐメッセージを吹き出しに表示
    const msg = getEatingMessage(food, currentCatId);
    showBubble(msg, { force: true, durationMs: 2600 });
  };

  const handlePlay = (toy: ToyItem) => {
    // なつき度レベルが不足している場合は遊べない
    if (!isToyUnlocked(toy, currentAffectionLevel)) return;

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

    // なつき度が上がった場合は画面中央に大きくお祝い演出＆かわいいファンファーレを表示
    // ※レベルアップ時はファンファーレを主役に響かせるため、通常のおもちゃ鳴き声と音が被らないようにする
    let hasReceivedGift = false;
    let receivedGiftItem: GiftItem | null = null;
    let currentInventory = inventory;
    if (affRes.isLevelUp) {
      const gift = receiveGift(currentCatId);
      receivedGiftItem = gift;
      hasReceivedGift = true;
      currentInventory = addGiftToInventory(inventory, gift.id, currentCatId);
      triggerAffectionCelebration(
        currentCatId,
        currentPreset.name,
        affRes.nextLevel,
        gift,
        affRes.isMaxBonus
      );
      if (isAffectionCelebrationCompact) {
        // 簡略化時はファンファーレが鳴らないため、通常のおもちゃ興奮鳴き声を再生
        const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
        const pitch = calculateVariedPitch(basePitch * 1.15);
        meow({
          pitchMultiplier: pitch,
          duration: 0.6,
        });
      }
    } else {
      // 通常時はおもちゃに夢中になって興奮した高めの明るい鳴き声を再生
      const basePitch = calculatePitchForMood(currentPreset.defaultPitch, nextLevel);
      const pitch = calculateVariedPitch(basePitch * 1.15);
      meow({
        pitchMultiplier: pitch,
        duration: 0.6,
      });
    }

    // ふり返り手帳におもちゃ遊びの記録を追加
    const updatedJournalStats = recordCareAction('play', currentCatId);

    // インベントリの合計受取個数とレアギフト所持判定（レア以上の判定）
    const isRareOrAbove = (r?: string) => r === 'rare' || r === 'super-rare' || r === 'ultra-rare';
    const currentTotalGifts = getTotalGiftCount(currentInventory);
    const hasRareGift =
      isRareOrAbove(receivedGiftItem?.rarity) ||
      Object.keys(currentInventory).some((id) => isRareOrAbove(CAT_GIFTS.find((g) => g.id === id)?.rarity));
    const hasSuperRareGift =
      receivedGiftItem?.rarity === 'super-rare' ||
      Object.keys(currentInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'super-rare');
    const hasUltraRareGift =
      receivedGiftItem?.rarity === 'ultra-rare' ||
      Object.keys(currentInventory).some((id) => CAT_GIFTS.find((g) => g.id === id)?.rarity === 'ultra-rare');

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
      giftInventory: currentInventory,
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
        currentAffectionLevel={currentAffectionLevel}
        isAutoFeedUnlocked={isAutoFeedUnlockedValue}
        isAutoFeedEnabled={isAutoFeedEnabled}
        onToggleAutoFeed={setAutoFeedEnabled}
        onFeed={handleFeed}
        onPlay={handlePlay}
      />

      {/* なつき度レベルアップ時の中央巨大ハート＆祝うメッセージ演出オーバーレイ */}
      <AffectionLevelUpOverlay state={levelUpState} />

      {/* おくりもの獲得時のミニトースト通知（自動ごはん時の通知など） */}
      <GiftToastOverlay toasts={giftToasts} onDismiss={dismissGiftToast} />

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
        isAutoFeedUnlocked={isAutoFeedUnlockedValue}
        isAutoFeedEnabled={isAutoFeedEnabled}
        onToggleAutoFeed={setAutoFeedEnabled}
        isCompactAffectionCelebration={isCompactAffectionCelebration}
        onToggleCompactAffectionCelebration={setCompactAffectionCelebration}
        onExportSaveData={handleExportSaveData}
        onImportSaveData={handleImportSaveData}
        isCloudConfigured={isCloudConfigured}
        cloudUser={cloudUser}
        cloudSyncStatus={cloudSyncStatus}
        cloudSyncMessage={cloudSyncMessage}
        cloudLastSyncedAt={cloudLastSyncedAt}
        onCloudSignUp={handleCloudSignUp}
        onCloudSignIn={handleCloudSignIn}
        onCloudSignOut={handleCloudSignOut}
        onCloudSyncNow={handleCloudSyncNow}
      />

      {/* お留守番レポート（自動ごはん）モーダル画面 */}
      {offlineReportData && (
        <OfflineCareReportModal
          isOpen={isOfflineReportModalOpen}
          onClose={handleAcceptOfflineReport}
          elapsedMs={offlineReportData.cappedElapsedMs}
          catResults={offlineReportData.catResults}
          allEarnedGifts={offlineReportData.allEarnedGifts}
          catNames={catNames}
        />
      )}

      {/* 実績一覧モーダル画面 */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        unlocked={unlockedAchievements}
        progressContext={{
          careStats: careJournalStats,
          giftInventory: inventory,
          maxAffectionLevel: getMaxAffectionLevel(),
          minAffectionLevel: getMinAffectionLevel(),
        }}
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
