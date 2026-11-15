import React, { useEffect } from 'react';
import { X, Heart, Utensils, Sparkles, Trophy, BookOpen, Settings, Smile } from 'lucide-react';
import { HowToPlayIcon } from './HowToPlayButton.tsx';

export interface HowToPlayModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
}

/**
 * あそびかた紹介セクションのデータ型
 */
interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  description: string;
  points: string[];
}

/**
 * あそびかたウィンドウ（モーダル）
 * Webアプリ「ねこっぽい」の楽しみ方をわかりやすいテキスト形式で紹介・閲覧できる
 */
export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const guideSections: GuideSection[] = [
    {
      id: 'pet',
      title: '1. 猫ちゃんをなでなでしよう',
      icon: <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />,
      iconBg: 'bg-rose-50 border-rose-200',
      iconColor: 'text-rose-700',
      description:
        '画面中央の猫ちゃんをドラッグやタップ（スワイプ）することで、やさしくなでることができます。',
      points: [
        'なでると「ごきげん度」が上がり、嬉しい鳴き声やハートがあふれ出します。',
        '短時間にたくさん撫ですぎると、愛撫誘発性攻撃でちょっぴり不機嫌（⚡）になってしまうことも。猫ちゃんの表情を見守りながら触れ合いましょう。',
      ],
    },
    {
      id: 'care-food',
      title: '2. ごはんをあげよう（まんぷく度）',
      icon: <Utensils className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-800',
      description:
        '右下の「お世話メニュー」のごはんボタンから、3種類のごはんを猫ちゃんにあげることができます。',
      points: [
        '「カリカリ」「ねこ缶（まぐろ）」「おやつピューレ」の3種類があり、それぞれまんぷく度やごきげん度の回復量が異なります。',
        'おなかが空きすぎるとごきげん度が下がりやすくなるので、定期的にお腹を満たしてあげましょう。',
      ],
    },
    {
      id: 'care-toy',
      title: '3. おもちゃで一緒にあそぼう',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      iconBg: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-800',
      description:
        '右下の「お世話メニュー」のおもちゃボタンから、猫ちゃんと楽しい遊び時間を過ごせます。',
      points: [
        '「ねこじゃらし」「毛糸ボール」「レーザーポインター」で楽しく遊べます。',
        'なですぎて不機嫌になってしまったときもおもちゃで遊んであげることで、即座にご機嫌を取り戻してくれます！',
      ],
    },
    {
      id: 'affection-gifts',
      title: '4. なつき度を上げておくりものを集めよう',
      icon: <Smile className="w-4 h-4 text-amber-600" />,
      iconBg: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-800',
      description:
        'なでたりお世話を重ねることで、猫ちゃんとの「なつき度」がアップしていきます。',
      points: [
        'なつき度レベルが上がると、猫ちゃんから特別なお礼として「おくりもの」を受け取れます。',
        'おくりものには「ノーマル」「レア」「スーパーレア」「ウルトラレア」の4種類のレアリティが存在します。',
        '左上の宝箱ボタンを押すと、これまでに集めたおくりもの一覧や詳細な説明文を鑑賞できます。',
      ],
    },
    {
      id: 'achievements-journal',
      title: '5. 実績に挑戦＆ふり返り手帳',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-800',
      description:
        'トロフィーボタンから「実績一覧」、手帳ボタンから「ふり返り手帳」を開くことができます。',
      points: [
        '「実績一覧」には多数の目標が用意されており、条件を達成するとトースト通知でお知らせします。中には条件が謎に包まれた「隠し実績」も…？',
        '「ふり返り手帳」では、日々のふれあい回数や継続日数などの大切な記録をいつでも確認できます。',
      ],
    },
    {
      id: 'switching-settings',
      title: '6. 猫ちゃんの切り替え＆設定',
      icon: <Settings className="w-4 h-4 text-stone-600" />,
      iconBg: 'bg-stone-50 border-stone-200',
      iconColor: 'text-stone-800',
      description:
        '画面上部では猫ちゃんを切り替えたり、歯車ボタンからアプリの環境を自由にカスタマイズできます。',
      points: [
        '上部の猫アイコンから「くろねこ」「しろねこ」「みけねこ」をいつでも切り替えてお世話できます。',
        '「設定」では、猫ちゃんにお好きな名前をつけたり、鳴き声音のON/OFF、ごきげんゲージの表示位置（画面下部／猫の横）を切り替えられます。',
      ],
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-modal-title"
      data-testid="how-to-play-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（クリックで閉じる） */}
      <div
        data-testid="how-to-play-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-sky-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
              <HowToPlayIcon className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="how-to-play-modal-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                あそびかた
              </h2>
              <p className="text-[11px] text-stone-500">
                「ねこっぽい」の楽しみ方ガイド
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="あそびかたを閉じる"
            data-testid="how-to-play-modal-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* スクロールコンテンツエリア */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-sky-50/60 p-3 rounded-2xl border border-sky-100/80">
            「ねこっぽい」へようこそ！このアプリでは、個性豊かな3匹の猫ちゃんたちをなでたり、ごはんをあげたり、おもちゃで遊んだりしながら、のんびり触れ合うことができます。
          </p>

          <div className="space-y-3.5">
            {guideSections.map((sec) => (
              <section
                key={sec.id}
                data-testid={`guide-section-${sec.id}`}
                className="bg-stone-50/60 rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border shadow-2xs shrink-0 ${sec.iconBg}`}
                  >
                    {sec.icon}
                  </div>
                  <h3 className={`text-sm font-bold ${sec.iconColor}`}>
                    {sec.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-2">
                  {sec.description}
                </p>
                <ul className="space-y-1 pl-1">
                  {sec.points.map((pt, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] sm:text-xs text-stone-500 flex items-start gap-1.5 leading-snug"
                    >
                      <span className="text-sky-500 font-bold select-none">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-sky-100 bg-stone-50/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-colors shadow-2xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            とじる
          </button>
        </div>
      </div>
    </div>
  );
};
