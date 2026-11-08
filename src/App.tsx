import React from 'react';
import { Heart, Zap } from 'lucide-react';
import { useCatAudio } from './hooks/useCatAudio.ts';
import { useCatSelection } from './hooks/useCatSelection.ts';
import { useCatMood } from './hooks/useCatMood.ts';
import { useSpeechBubble } from './hooks/useSpeechBubble.ts';
import { CatSilhouette } from './components/CatSilhouette.tsx';
import { CatSelector } from './components/CatSelector.tsx';
import { CatMoodIndicator } from './components/CatMoodIndicator.tsx';
import { calculateVariedPitch, getCatPresetById } from './utils/catPreset.ts';
import { calculatePitchForMood, getMeowMessageForMood } from './utils/catMood.ts';
import { CatId } from './types/cat.ts';

export default function App() {
  const { currentCatId, currentPreset, nextPreset, switchCat, selectCat } = useCatSelection();
  const { meow, isPlaying } = useCatAudio();
  const { getMoodScore, getMoodLevelForCat, petCat } = useCatMood();
  const { bubbleText, showBubble } = useSpeechBubble({ durationMs: 2200, minHoldMs: 1500 });

  const currentMoodScore = getMoodScore(currentCatId);
  const currentMoodLevel = getMoodLevelForCat(currentCatId);

  const handleInteractCat = () => {
    // 撫でることで選択中の猫の機嫌を更新（過剰撫で時は愛撫誘発性攻撃により不機嫌になる）
    const { nextLevel } = petCat(currentCatId);
    const isMoodChanged = nextLevel !== currentMoodLevel;
    const isAnnoyed = nextLevel === 'annoyed';

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

  const handleSwitchCat = () => {
    switchCat();
    showBubble(`${nextPreset.name}にきりかえたよ♪`, { force: true, durationMs: 1600 });
  };

  const handleSelectCat = (id: CatId) => {
    if (id === currentCatId) return;
    selectCat(id);
    const target = getCatPresetById(id);
    showBubble(`${target.name}にきりかえたよ♪`, { force: true, durationMs: 1600 });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 selection:bg-orange-200">
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
        {/* ごきげんインジケーター（機嫌ゲージ＆ステータスバッジ） */}
        <div className="w-full max-w-xs mb-2">
          <CatMoodIndicator
            moodScore={currentMoodScore}
            moodLevel={currentMoodLevel}
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

        {/* 猫のシルエット（ドラッグ操作でなでる） */}
        <CatSilhouette
          preset={currentPreset}
          isReacting={isPlaying}
          moodLevel={currentMoodLevel}
          onPet={handleInteractCat}
        />
      </section>

      {/* フッターエリア */}
      <footer className="w-full max-w-md pb-6 text-center text-xs text-stone-400">
        <p>※ 音が出ます。端末の音量を調整してご利用ください。</p>
      </footer>
    </main>
  );
}
