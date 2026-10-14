import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCatAudio } from './hooks/useCatAudio.ts';
import { useCatSelection } from './hooks/useCatSelection.ts';
import { CatSilhouette } from './components/CatSilhouette.tsx';
import { CatSelector } from './components/CatSelector.tsx';
import { calculateVariedPitch, getRandomMeowMessage, getCatPresetById } from './utils/catPreset.ts';
import { CatId } from './types/cat.ts';

export default function App() {
  const { currentCatId, currentPreset, nextPreset, switchCat, selectCat } = useCatSelection();
  const { meow, isPlaying } = useCatAudio();
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const handleInteractCat = () => {
    // 選択中の猫の基本ピッチに自然な揺らぎを加えて鳴き声を再生
    const pitch = calculateVariedPitch(currentPreset.defaultPitch);
    meow({ pitchMultiplier: pitch });

    // 猫ごとの個性あるメッセージを吹き出しに表示
    const msg = getRandomMeowMessage(currentPreset);
    setBubbleText(msg);

    // 一定時間後に吹き出しをフェードアウト
    setTimeout(() => {
      setBubbleText(null);
    }, 1400);
  };

  const handleSwitchCat = () => {
    switchCat();
    setBubbleText(`${nextPreset.name}にきりかえたよ♪`);
    setTimeout(() => {
      setBubbleText(null);
    }, 1200);
  };

  const handleSelectCat = (id: CatId) => {
    if (id === currentCatId) return;
    selectCat(id);
    const target = getCatPresetById(id);
    setBubbleText(`${target.name}にきりかえたよ♪`);
    setTimeout(() => {
      setBubbleText(null);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 selection:bg-orange-200">
      {/* ヘッダーエリア */}
      <header className="w-full max-w-md pt-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
          ねこっぽい
        </h1>
        <p className="text-sm text-stone-500 mt-2">
          猫ちゃんをクリック（タップ）してふれあってみよう
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
        {/* 鳴き声・切り替え吹き出し */}
        <div className="h-14 flex items-center justify-center mb-2 transition-all duration-300">
          {bubbleText ? (
            <div className="animate-bounce bg-white px-4 py-2 rounded-2xl shadow-md border border-orange-200 text-orange-600 font-bold text-base flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>{bubbleText}</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400 font-medium text-center">
              {currentPreset.description}（タップしてね）
            </span>
          )}
        </div>

        {/* 猫のシルエット（直接クリックでふれあい） */}
        <CatSilhouette
          preset={currentPreset}
          isReacting={isPlaying}
          onClick={handleInteractCat}
        />
      </section>

      {/* フッターエリア */}
      <footer className="w-full max-w-md pb-6 text-center text-xs text-stone-400">
        <p>※ 音が出ます。端末の音量を調整してご利用ください。</p>
      </footer>
    </main>
  );
}
