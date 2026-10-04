import React, { useState } from 'react';
import { Volume2, Heart } from 'lucide-react';
import { useCatAudio } from './hooks/useCatAudio.ts';

export default function App() {
  const { meow, isPlaying } = useCatAudio();
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const handleCallCat = () => {
    // 猫の鳴き声を再生
    meow();

    // 吹き出しメッセージを表示
    const meowMessages = ['ニャ〜ン♪', 'ミャオ！', 'にゃあ〜', 'ゴロゴロ…♪'];
    const randomMsg = meowMessages[Math.floor(Math.random() * meowMessages.length)];
    setBubbleText(randomMsg);

    // 一定時間後に吹き出しをフェードアウト
    setTimeout(() => {
      setBubbleText(null);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 selection:bg-orange-200">
      {/* ヘッダーエリア */}
      <header className="w-full max-w-md pt-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
          あつまれ！ねこのへや
        </h1>
        <p className="text-sm text-stone-500 mt-2">
          ボタンを押すと、猫ちゃんが元気にお返事してくれるよ
        </p>
      </header>

      {/* メインアクションエリア */}
      <section className="flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* 鳴き声吹き出し */}
        <div className="h-14 flex items-center justify-center mb-4 transition-all duration-300">
          {bubbleText ? (
            <div className="animate-bounce bg-white px-4 py-2 rounded-2xl shadow-md border border-orange-200 text-orange-600 font-bold text-base flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>{bubbleText}</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400 font-medium">
              ボタンを押してねこを呼んでみてね
            </span>
          )}
        </div>

        {/* 猫を呼ぶメインボタン */}
        <button
          type="button"
          onClick={handleCallCat}
          className={`group relative flex flex-col items-center justify-center w-52 h-52 sm:w-56 sm:h-56 rounded-full transition-all duration-200 shadow-xl cursor-pointer active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-orange-300 ${
            isPlaying
              ? 'bg-gradient-to-br from-orange-400 to-amber-500 scale-105 shadow-orange-300/60 ring-4 ring-orange-300'
              : 'bg-gradient-to-br from-orange-300 via-amber-400 to-orange-400 hover:from-orange-400 hover:to-amber-500 hover:shadow-2xl hover:scale-102 shadow-orange-200/50'
          }`}
          aria-label="猫を呼ぶ（鳴き声を再生）"
        >
          {/* 肉球アイコン風デザイン */}
          <div className="flex flex-col items-center justify-center text-white drop-shadow-sm">
            {/* 肉球の指球（3つ） */}
            <div className="flex gap-2.5 mb-2">
              <span className="w-4 h-5 bg-white/90 rounded-full shadow-inner transform -rotate-12" />
              <span className="w-5 h-6 bg-white/95 rounded-full shadow-inner transform -translate-y-1" />
              <span className="w-4 h-5 bg-white/90 rounded-full shadow-inner transform rotate-12" />
            </div>
            {/* 肉球の掌球 */}
            <div className="w-12 h-10 bg-white/95 rounded-2xl shadow-inner flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-orange-500" />
            </div>

            <span className="text-lg font-bold tracking-wide mt-3 text-white">
              ねこを呼ぶ
            </span>
            <span className="text-xs text-white/90 font-medium mt-0.5">
              タップしてニャー！
            </span>
          </div>

          {/* 再生中の波紋エフェクト */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full animate-ping bg-orange-400/30 -z-10 pointer-events-none" />
          )}
        </button>
      </section>

      {/* フッターエリア */}
      <footer className="w-full max-w-md pb-6 text-center text-xs text-stone-400">
        <p>※ 音が出ます。端末の音量を調整してご利用ください。</p>
      </footer>
    </main>
  );
}
