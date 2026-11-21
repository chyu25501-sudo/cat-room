import React, { useState } from 'react';
import { X, Sparkles, Volume2, VolumeX, Info, Heart, Tag, RotateCcw, Layout, Utensils, Lock, AlertCircle, Download, Upload, CheckCircle2, Cloud, RefreshCw, ShieldCheck, KeyRound, Copy, Check, Eye, EyeOff, ArrowRightLeft } from 'lucide-react';
import { SettingsIcon } from './SettingsButton.tsx';
import { PrivacyPolicyModal } from './PrivacyPolicyModal.tsx';
import { CatId, CAT_PRESETS } from '../../types/cat.ts';
import { DEFAULT_CAT_NAMES, CatCustomNames, GaugeDisplayPosition } from '../../types/settings.ts';
import { CloudCredentials } from '../../utils/cloudAuth.ts';

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
  /** 自動ごはんが解禁されているかどうか（全猫なつき度Lv.10以上で解禁） */
  isAutoFeedUnlocked?: boolean;
  /** 自動ごはんが有効かどうか */
  isAutoFeedEnabled?: boolean;
  /** 自動ごはんの切り替えコールバック */
  onToggleAutoFeed?: (enabled: boolean) => void;
  /** なつき度演出が簡略化されているかどうか（デフォルト: false） */
  isCompactAffectionCelebration?: boolean;
  /** なつき度演出簡略化の切り替えコールバック */
  onToggleCompactAffectionCelebration?: (enabled: boolean) => void;
  /** アプリ改善のための匿名の利用統計送信が有効かどうか（デフォルト: true） */
  isAnalyticsEnabled?: boolean;
  /** 利用統計送信の切り替えコールバック */
  onToggleAnalytics?: (enabled: boolean) => void;
  /** セーブデータの書き出し（エクスポート）コールバック */
  onExportSaveData?: () => void;
  /** セーブデータの読み込み（インポート）コールバック */
  onImportSaveData?: (file: File) => Promise<{ success: boolean; message: string }>;
  /** クラウド連携が利用可能かどうか（Supabaseが設定されているか） */
  isCloudConfigured?: boolean;
  /** クラウド連携情報（連携ID・引き継ぎキー） */
  cloudCredentials?: CloudCredentials | null;
  /** クラウド同期ステータス */
  cloudSyncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  /** クラウド同期メッセージ */
  cloudSyncMessage?: string | null;
  /** 最終同期日時 */
  cloudLastSyncedAt?: number | null;
  /** 別端末からのデータ引き継ぎコールバック */
  onCloudTransfer?: (userId: string, transferKey: string) => Promise<{ success: boolean; message: string }>;
  /** 引き継ぎ秘密パスワード変更コールバック */
  onUpdateTransferKey?: (newKey: string) => Promise<{ success: boolean; message: string }>;
  /** クラウド今すぐ同期コールバック */
  onCloudSyncNow?: () => Promise<void>;
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
  isAutoFeedUnlocked = false,
  isAutoFeedEnabled = false,
  onToggleAutoFeed,
  isCompactAffectionCelebration = false,
  onToggleCompactAffectionCelebration,
  isAnalyticsEnabled = true,
  onToggleAnalytics,
  onExportSaveData,
  onImportSaveData,
  isCloudConfigured = false,
  cloudCredentials = null,
  cloudSyncStatus = 'idle',
  cloudSyncMessage = null,
  cloudLastSyncedAt = null,
  onCloudTransfer,
  onUpdateTransferKey,
  onCloudSyncNow,
}) => {
  // 初期名リセットの確認画面の開閉ステート
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  // データ読み込み（インポート）のステータスとメッセージ
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // 引き継ぎフォーム開閉ステート・入力ステート
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [transferUserId, setTransferUserId] = useState('');
  const [transferKey, setTransferKey] = useState('');
  const [showTransferKey, setShowTransferKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // パスワード変更フォーム開閉・入力ステート
  const [isChangeKeyOpen, setIsChangeKeyOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [changeKeyError, setChangeKeyError] = useState<string | null>(null);
  const [changeKeySuccess, setChangeKeySuccess] = useState<string | null>(null);

  // プライバシーポリシーモーダルの開閉ステート
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportSaveData) return;

    setImportStatus('loading');
    setImportMessage('データを読み込み中...');

    try {
      const result = await onImportSaveData(file);
      if (result.success) {
        setImportStatus('success');
        setImportMessage(result.message);
      } else {
        setImportStatus('error');
        setImportMessage(result.message);
      }
    } catch {
      setImportStatus('error');
      setImportMessage('ファイルの読み込み中にエラーが発生しました');
    } finally {
      // ファイル選択をリセット（同じファイルを再選択可能にするため）
      e.target.value = '';
    }
  };

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
                  onClick={() => setIsConfirmResetOpen(true)}
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

          {/* 自動ごはん設定カード */}
          <div
            data-testid="auto-feed-section"
            className={`border rounded-2xl p-3.5 transition-colors ${
              isAutoFeedUnlocked
                ? 'bg-amber-50/50 border-orange-200/80'
                : 'bg-stone-50 border-stone-200/80'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <Utensils
                  className={`w-4 h-4 shrink-0 ${
                    isAutoFeedUnlocked ? 'text-orange-600' : 'text-stone-400'
                  }`}
                />
                <span>自動ごはん</span>
                {isAutoFeedUnlocked ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-300 leading-none">
                    解禁済み
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded-full border border-stone-300 leading-none flex items-center gap-0.5">
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
                aria-label="自動ごはんの切り替え"
                data-testid="auto-feed-toggle-button"
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
                ? '🔒 全猫（くろねこ・しろねこ・みけねこ）のなつき度がLv.10（MAX）に到達すると解禁されます。すべての猫ちゃんと絆を深めると、お留守番中も自動でカリカリを食べられるようになります。'
                : isAutoFeedEnabled
                ? '全猫のまんぷく度が40%以下になると自動でカリカリを食べます。アプリを離れている間（最大7日間）も自動で給餌され、次回開いた際にまとめておくりものを受け取れます。※オンの間は手動ごはんがお休みになります。'
                : '自動ごはんは現在オフです。手動で愛情を込めてごはんをあげられます。'}
            </p>

            {/* 注意事項（赤文字で強調） */}
            <div
              data-testid="auto-feed-warning"
              className="mt-2.5 pt-2 border-t border-orange-200/60 flex items-start gap-1.5 text-[11px] text-rose-600 font-bold leading-relaxed"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
              <span>
                【ご注意】自動ごはんがオンの状態でアプリを離れても、日付系の実績（連続ふれあい日数や累計訪問日数など）や手帳のふれあい日数は進みません。毎日自分で猫ちゃんとふれあった日のみカウントされます。
              </span>
            </div>
          </div>

          {/* なつき度演出の簡略化設定カード */}
          <div
            data-testid="compact-affection-celebration-section"
            className="bg-amber-50/50 border border-orange-200/80 rounded-2xl p-3.5"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <Heart className="w-4 h-4 text-orange-600 shrink-0" />
                <span>なつき度演出の簡略化</span>
              </div>

              {/* トグルスイッチ */}
              <button
                type="button"
                role="switch"
                aria-checked={isCompactAffectionCelebration}
                aria-label="なつき度演出の簡略化の切り替え"
                data-testid="compact-affection-celebration-toggle-button"
                onClick={() =>
                  onToggleCompactAffectionCelebration?.(!isCompactAffectionCelebration)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  isCompactAffectionCelebration ? 'bg-orange-500' : 'bg-stone-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    isCompactAffectionCelebration ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {isCompactAffectionCelebration
                ? 'なつき度演出が簡略化されます。自動ごはんの稼働状況に関わらず、画面中央の大きなハート演出を行わず、控えめな通知（トースト）で表示します。'
                : 'なつき度が上がった際に画面中央に大きなハート演出を表示します（※自動ごはん稼働中は自動で簡略化されます）。'}
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

          {/* データのバックアップ・引き継ぎ（ファイル書き出し・読み込み） */}
          <div
            data-testid="save-data-transfer-section"
            className="bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-stone-50 border border-orange-200/90 rounded-2xl p-3.5 shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-stone-800 font-bold text-sm mb-1.5">
              <Download className="w-4 h-4 text-orange-600 shrink-0" />
              <span>データのバックアップ・引き継ぎ</span>
            </div>
            <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
              現在の進行状況（おくりもの・実績・なつき度等）をファイルに保存したり、別端末から読み込んで賢く合算・引き継ぎができます。
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              {onExportSaveData && (
                <button
                  type="button"
                  onClick={onExportSaveData}
                  data-testid="export-save-data-button"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-white hover:bg-amber-50/80 text-stone-700 border border-orange-200 shadow-2xs transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span>ファイルに保存</span>
                </button>
              )}

              {onImportSaveData && (
                <label
                  data-testid="import-save-data-label"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-white hover:bg-orange-50/80 text-stone-700 border border-orange-200 shadow-2xs transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-orange-400"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>ファイルを読み込む</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    data-testid="import-save-data-input"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {importMessage && (
              <div
                role="status"
                data-testid="import-status-message"
                className={`mt-2.5 p-2 rounded-xl text-[11px] flex items-center gap-1.5 leading-snug animate-fade-in ${
                  importStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : importStatus === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {importStatus === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : importStatus === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-spin" />
                )}
                <span>{importMessage}</span>
              </div>
            )}
          </div>

          {/* クラウドデータ連携（複数端末同期）カード */}
          <div
            data-testid="cloud-sync-section"
            className="bg-sky-50/50 border border-sky-200/80 rounded-2xl p-3.5"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <Cloud className="w-4 h-4 text-sky-600 shrink-0" />
                <span>クラウドデータ連携（複数端末同期）</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-2.5 leading-relaxed">
              メールアドレス不要の安全な「連携ID」で自動同期されます。別のスマホやPCと連携すれば、複数端末で同じ猫ちゃんのデータを共有していつでも続きを遊べます（機種変更時の引き継ぎにも使えます）。
            </p>

            {isCloudConfigured && cloudCredentials ? (
              <div className="flex flex-col gap-2.5 animate-fade-in">
                {/* 現在の端末の連携情報 */}
                <div className="p-3 rounded-xl bg-white/90 border border-sky-100 shadow-2xs space-y-2">
                  {/* 連携ID */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-stone-400 block">あなたの連携ID</span>
                      <span
                        data-testid="cloud-user-id"
                        className="text-xs sm:text-sm font-black text-stone-800 tracking-wider font-mono"
                      >
                        {cloudCredentials.userId}
                      </span>
                    </div>
                    <button
                      type="button"
                      data-testid="cloud-copy-id-btn"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(cloudCredentials.userId);
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                        } catch {
                          // フォールバック
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold border border-sky-200 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">コピー完了</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>コピー</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 引き継ぎキー */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-stone-100">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-stone-400 block flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-amber-500" />
                        <span>連携・引き継ぎパスワード（秘密コード）</span>
                      </span>
                      <span
                        data-testid="cloud-transfer-key"
                        className="text-xs sm:text-sm font-mono font-bold text-stone-700 tracking-wider"
                      >
                        {showTransferKey ? cloudCredentials.transferKey : '••••••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        data-testid="toggle-show-key-btn"
                        onClick={() => setShowTransferKey(!showTransferKey)}
                        aria-label={showTransferKey ? '引き継ぎキーを隠す' : '引き継ぎキーを表示'}
                        className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        {showTransferKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        data-testid="toggle-change-key-btn"
                        onClick={() => {
                          setIsChangeKeyOpen(!isChangeKeyOpen);
                          setChangeKeyError(null);
                          setChangeKeySuccess(null);
                          setNewKey('');
                          setConfirmKey('');
                        }}
                        className="px-2 py-1 rounded-lg text-sky-700 hover:bg-sky-50 text-[11px] font-bold border border-sky-200 flex items-center gap-0.5 transition-colors cursor-pointer"
                      >
                        <span>{isChangeKeyOpen ? '閉じる' : '変更'}</span>
                      </button>
                      <button
                        type="button"
                        data-testid="cloud-copy-key-btn"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(cloudCredentials.transferKey);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          } catch {
                            // フォールバック
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">コピー完了</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>コピー</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* パスワード変更インラインフォーム */}
                  {isChangeKeyOpen && (
                    <div
                      data-testid="change-key-form"
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-2 animate-fade-in"
                    >
                      <span className="text-[11px] font-bold text-stone-700 block">
                        新しい連携・引き継ぎパスワードを設定
                      </span>
                      <p className="text-[10px] text-stone-500">
                        別端末との連携や引き継ぎ時に使用するお好みのパスワード（半角英数字6文字以上）を設定できます。
                      </p>
                      <input
                        type="password"
                        data-testid="new-transfer-key-input"
                        placeholder="新しいパスワード（6文字以上）"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-mono text-stone-800 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                      <input
                        type="password"
                        data-testid="confirm-transfer-key-input"
                        placeholder="パスワード（確認用）"
                        value={confirmKey}
                        onChange={(e) => setConfirmKey(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-mono text-stone-800 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          data-testid="submit-update-key-btn"
                          disabled={cloudSyncStatus === 'syncing'}
                          onClick={async () => {
                            setChangeKeyError(null);
                            setChangeKeySuccess(null);
                            if (!newKey.trim()) {
                              setChangeKeyError('新しいパスワードを入力してください');
                              return;
                            }
                            if (newKey.length < 6) {
                              setChangeKeyError('パスワードは6文字以上で設定してください');
                              return;
                            }
                            if (newKey !== confirmKey) {
                              setChangeKeyError('確認用パスワードが一致しません');
                              return;
                            }
                            const res = await onUpdateTransferKey?.(newKey.trim());
                            if (res?.success) {
                              setChangeKeySuccess(res.message);
                              setNewKey('');
                              setConfirmKey('');
                              setTimeout(() => {
                                setIsChangeKeyOpen(false);
                                setChangeKeySuccess(null);
                              }, 1500);
                            } else if (res && !res.success) {
                              setChangeKeyError(res.message);
                            }
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <span>変更を保存</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangeKeyOpen(false);
                            setChangeKeyError(null);
                            setChangeKeySuccess(null);
                          }}
                          className="py-1.5 px-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-bold cursor-pointer"
                        >
                          キャンセル
                        </button>
                      </div>

                      {changeKeyError && (
                        <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{changeKeyError}</span>
                        </div>
                      )}
                      {changeKeySuccess && (
                        <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{changeKeySuccess}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {cloudLastSyncedAt && (
                    <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                      最終同期: {new Date(cloudLastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  )}
                </div>

                {/* 今すぐ同期ボタン */}
                <button
                  type="button"
                  data-testid="cloud-sync-now-button"
                  disabled={cloudSyncStatus === 'syncing'}
                  onClick={async () => {
                    setTransferError(null);
                    await onCloudSyncNow?.();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{cloudSyncStatus === 'syncing' ? 'クラウドと同期中...' : '今すぐクラウドと同期'}</span>
                </button>

                {/* 他端末とのデータ連携・共有アコーディオン */}
                <div className="pt-2 border-t border-sky-200/60">
                  <button
                    type="button"
                    data-testid="toggle-transfer-accordion-btn"
                    onClick={() => {
                      setIsTransferFormOpen(!isTransferFormOpen);
                      setTransferError(null);
                      setTransferSuccess(null);
                    }}
                    className="w-full text-left py-1 text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                      <span>他の端末とデータを連携・共有する（複数端末プレイ／引き継ぎ）</span>
                    </span>
                    <span className="text-[10px] text-sky-600">
                      {isTransferFormOpen ? '閉じる ▲' : '入力する ▼'}
                    </span>
                  </button>

                  {isTransferFormOpen && (
                    <div className="mt-2 p-2.5 bg-white/90 border border-sky-200 rounded-xl space-y-2 animate-fade-in">
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        別のスマホやPCで既に遊んでいる場合、その端末の「連携ID」と「秘密パスワード」を入力すると、**両方の端末が同じデータで連携され、どちらからでも続きを遊べるようになります**（現在の端末のデータも安全に合算されます）。
                      </p>
                      <input
                        type="text"
                        data-testid="transfer-user-id-input"
                        placeholder="連携ID（例: NK-A8F2-9X4B）"
                        value={transferUserId}
                        onChange={(e) => setTransferUserId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-mono text-stone-800 focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400 uppercase"
                      />
                      <input
                        type="password"
                        data-testid="transfer-key-input"
                        placeholder="連携・引き継ぎパスワード（6文字以上）"
                        value={transferKey}
                        onChange={(e) => setTransferKey(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-mono text-stone-800 focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                      />
                      <button
                        type="button"
                        data-testid="execute-transfer-btn"
                        disabled={cloudSyncStatus === 'syncing'}
                        onClick={async () => {
                          setTransferError(null);
                          setTransferSuccess(null);
                          if (!transferUserId.trim() || !transferKey.trim()) {
                            setTransferError('連携IDとパスワードを入力してください');
                            return;
                          }
                          const res = await onCloudTransfer?.(transferUserId.trim(), transferKey.trim());
                          if (res?.success) {
                            setTransferSuccess(res.message);
                            setTransferUserId('');
                            setTransferKey('');
                          } else if (res && !res.success) {
                            setTransferError(res.message);
                          }
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>この端末と連携して同期する</span>
                      </button>

                      {transferError && (
                        <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{transferError}</span>
                        </div>
                      )}
                      {transferSuccess && (
                        <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{transferSuccess}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-stone-400">
                ※クラウド設定が未完了です。端末（ローカル）のストレージにのみ保存されます。
              </p>
            )}

            {cloudSyncMessage && (
              <div
                role="status"
                data-testid="cloud-sync-status-message"
                className={`mt-2 p-2 rounded-xl text-[11px] flex items-center gap-1.5 leading-snug animate-fade-in ${
                  cloudSyncStatus === 'error'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : cloudSyncStatus === 'synced'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-sky-50 text-sky-800 border border-sky-200'
                }`}
              >
                {cloudSyncStatus === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                ) : cloudSyncStatus === 'synced' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-sky-600 shrink-0 animate-spin" />
                )}
                <span>{cloudSyncMessage}</span>
              </div>
            )}

            {/* 匿名の利用統計送信トグル */}
            <div className="mt-3 pt-2.5 border-t border-sky-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-bold text-stone-700 block">
                  アプリ改善のための匿名の利用統計送信
                </span>
                <span className="text-[11px] text-stone-500 leading-relaxed block">
                  おくりもの収集率や実績達成状況などの匿名データを送信し、ゲームバランス調整に役立てます（個人情報は一切含みません）。
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isAnalyticsEnabled}
                aria-label="アプリ改善のための匿名の利用統計送信"
                data-testid="analytics-toggle-button"
                onClick={() => onToggleAnalytics?.(!isAnalyticsEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
                  isAnalyticsEnabled ? 'bg-sky-500' : 'bg-stone-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    isAnalyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* プライバシーとデータの取り扱い方針リンク */}
            <div className="mt-2.5 pt-2 border-t border-sky-100 flex items-center justify-between text-[11px]">
              <button
                type="button"
                data-testid="privacy-policy-link-button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-sky-700 hover:text-sky-900 underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>プライバシーとデータの取り扱いについて</span>
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

        {/* 初期名リセット確認ダイアログ（誤操作防止） */}
        {isConfirmResetOpen && (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-confirm-title"
            aria-describedby="reset-confirm-desc"
            data-testid="reset-confirm-dialog"
            className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-[1px] animate-fade-in"
            onClick={() => setIsConfirmResetOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl border border-orange-200 p-5 w-full max-w-xs text-center animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-2xs border border-orange-200">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3
                id="reset-confirm-title"
                className="text-sm sm:text-base font-extrabold text-stone-800 mb-1.5"
              >
                初期名に戻しますか？
              </h3>
              <p
                id="reset-confirm-desc"
                className="text-xs text-stone-500 mb-4 leading-relaxed"
              >
                すべての猫ちゃんのお名前を最初の名前に戻します。よろしいですか？
              </p>
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  data-testid="reset-confirm-cancel-button"
                  onClick={() => setIsConfirmResetOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  いいえ
                </button>
                <button
                  type="button"
                  data-testid="reset-confirm-ok-button"
                  onClick={() => {
                    onResetCatNames?.();
                    setIsConfirmResetOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-2xs transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  はい
                </button>
              </div>
            </div>
          </div>
        )}
        {/* プライバシーポリシーモーダル */}
        <PrivacyPolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      </div>
    </div>
  );
};
