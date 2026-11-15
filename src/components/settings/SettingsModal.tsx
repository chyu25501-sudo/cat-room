import React from 'react';
import { X, Sparkles, Volume2, VolumeX, Info, Heart, Tag, RotateCcw, Layout } from 'lucide-react';
import { SettingsIcon } from './SettingsButton.tsx';
import { CatId, CAT_PRESETS } from '../../types/cat.ts';
import { DEFAULT_CAT_NAMES, CatCustomNames, GaugeDisplayPosition } from '../../types/settings.ts';

export interface SettingsModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** サウンド再生が有効かどうか（デフォルト: true） */
  isSoundEnabled?: boolean;
  /** サウンド切り替えコールバック */
  onToggleSound?: (enabled: boolean) => void;
  /** 猫ごとのカスタム名 */
  catNames?: CatCustomNames;
  /** 猫の名前更新コールバック */
  onUpdateCatName?: (catId: CatId, name: string) => void;
  /** 猫の名前リセットコールバック */
  onResetCatNames?: () => void;
  /** ゲージ類の表示位置・スタイル（'bottom': 下部・標準、'side': 横側・シンプル） */
  gaugePosition?: GaugeDisplayPosition;
  /** ゲージ類の表示位置切り替えコールバック */
  onChangeGaugePosition?: (position: GaugeDisplayPosition) => void;
}

/**
 * 設定画面モーダルコンポーネント
 * サウンド設定・猫の名前設定・アプリ情報を表示・変更可能
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isSoundEnabled = true,
  onToggleSound,
  catNames = DEFAULT_CAT_NAMES,
  onUpdateCatName,
  onResetCatNames,
  gaugePosition = 'bottom',
  onChangeGaugePosition,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      data-testid="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（クリックで閉じる） */}
      <div
        data-testid="settings-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダル本体カード */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3.5 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-orange-200 flex items-center justify-center text-stone-600 shrink-0">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="settings-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                設定
              </h2>
              <p className="text-[11px] text-stone-500">
                アプリの環境やお名前を設定できます
              </p>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="設定を閉じる"
            data-testid="settings-close-button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダルメインコンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-3.5 text-left">
          {/* 猫の名前設定カード */}
          <div
            data-testid="cat-name-section"
            className="bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-stone-50 border border-orange-200/90 rounded-2xl p-3.5 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-stone-800 font-bold text-sm">
                <Tag className="w-4 h-4 text-orange-600 shrink-0" />
                <span>猫ちゃんのお名前</span>
              </div>
              {onResetCatNames && (
                <button
                  type="button"
                  onClick={onResetCatNames}
                  data-testid="reset-cat-names-button"
                  title="すべての猫の名前を初期値に戻す"
                  className="text-[11px] text-stone-400 hover:text-orange-600 transition-colors flex items-center gap-1 cursor-pointer focus:outline-hidden focus-visible:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>初期名に戻す</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
              名前を変更すると、画面上のすべてのテキストの表示がその名前に切り替わります。
            </p>

            {/* 3匹の猫の名前入力フォーム */}
            <div className="space-y-2.5">
              {CAT_PRESETS.map((preset) => {
                const currentName = catNames[preset.id] ?? '';
                const defaultName = DEFAULT_CAT_NAMES[preset.id];

                return (
                  <div
                    key={preset.id}
                    className="flex items-center gap-3 bg-white/90 p-2 sm:p-2.5 rounded-xl border border-orange-100 shadow-2xs"
                  >
                    {/* カラーサークル */}
                    <span
                      aria-hidden="true"
                      data-testid={`cat-swatch-${preset.id}`}
                      className={`w-5 h-5 rounded-full border shrink-0 ${preset.swatch.bgClass} ${preset.swatch.borderClass} shadow-2xs`}
                    />

                    {/* テキスト入力フォーム */}
                    <input
                      type="text"
                      maxLength={12}
                      value={currentName}
                      placeholder={defaultName}
                      data-testid={`cat-name-input-${preset.id}`}
                      aria-label={`${defaultName}の名前`}
                      onChange={(e) => onUpdateCatName?.(preset.id, e.target.value)}
                      className="flex-1 min-w-0 px-2.5 py-1 text-xs sm:text-sm font-bold text-stone-800 bg-amber-50/30 border border-orange-200 rounded-lg focus:outline-hidden focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-400 transition-all placeholder:text-stone-300 placeholder:font-normal"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* サウンド設定トグルカード */}
          <div className="bg-amber-50/50 border border-orange-200/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                {isSoundEnabled ? (
                  <Volume2 className="w-4 h-4 text-orange-600 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
                )}
                <span>サウンド（鳴き声・効果音）</span>
              </div>

              {/* トグルスイッチ */}
              <button
                type="button"
                role="switch"
                aria-checked={isSoundEnabled}
                aria-label="サウンドのオン・オフ切り替え"
                data-testid="sound-toggle-button"
                onClick={() => onToggleSound?.(!isSoundEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  isSoundEnabled ? 'bg-orange-500' : 'bg-stone-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isSoundEnabled
                ? '猫ちゃんをなでたり、ごはん・おもちゃでふれあった時に鳴き声や効果音が鳴ります。'
                : 'サウンドは現在オフです。静かな場所でも安心して遊べます。'}
            </p>
          </div>

          {/* ゲージ表示位置・スタイル設定カード */}
          <div
            data-testid="gauge-position-section"
            className="bg-amber-50/50 border border-orange-200/80 rounded-2xl p-3.5"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <Layout className="w-4 h-4 text-orange-600 shrink-0" />
                <span>ゲージの表示スタイル</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 mb-2.5 leading-relaxed">
              ごきげん度・まんぷく度・なつき度ゲージの表示位置と見た目を切り替えます。
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="gauge-position-bottom-button"
                aria-pressed={gaugePosition === 'bottom'}
                onClick={() => onChangeGaugePosition?.('bottom')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  gaugePosition === 'bottom'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-orange-50/60'
                }`}
              >
                <span>下部（標準）</span>
              </button>
              <button
                type="button"
                data-testid="gauge-position-side-button"
                aria-pressed={gaugePosition === 'side'}
                onClick={() => onChangeGaugePosition?.('side')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  gaugePosition === 'side'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-orange-50/60'
                }`}
              >
                <span>横側（シンプル）</span>
              </button>
            </div>
          </div>

          {/* セーブデータ案内カード */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm mb-1.5">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>セーブデータについて</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              猫ちゃんたちのお名前、ごきげん度、まんぷく度、なつき度、および受け取ったおくりものは、お使いのブラウザに自動保存されています。
            </p>
          </div>

          {/* アプリ情報カード（バージョン表記は削除） */}
          <div className="bg-gradient-to-r from-orange-50/40 via-amber-50/40 to-stone-50 border border-orange-100 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm mb-1.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>アプリ情報</span>
            </div>
            <div className="text-xs text-stone-600">
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">アプリ名</span>
                <span className="font-bold text-stone-700">ねこっぽい</span>
              </div>
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 py-3 border-t border-orange-100 bg-stone-50/80 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>設定はいつでも自由に変更できます</span>
        </div>
      </div>
    </div>
  );
};
