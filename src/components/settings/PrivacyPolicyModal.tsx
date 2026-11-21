import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Database,
  FileText,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Server,
  Mail,
  Users,
} from 'lucide-react';

export interface PrivacyPolicyModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** 同意要求モードかどうか（初回起動・新方式移行時など: true） */
  isConsentMode?: boolean;
  /** 同意して利用を開始するコールバック */
  onAccept?: () => void;
  /** 匿名の利用統計送信の有効/無効 */
  isAnalyticsEnabled?: boolean;
  /** 匿名の利用統計送信の切り替えコールバック */
  onToggleAnalytics?: (enabled: boolean) => void;
}

/**
 * プライバシーとデータの取り扱い方針モーダル
 * アカウントデータやセーブデータの安全管理について明記するコンポーネント
 */
export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  isConsentMode = false,
  onAccept,
  isAnalyticsEnabled = true,
  onToggleAnalytics,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleAccept = () => {
    onAccept?.();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      data-testid="privacy-policy-modal"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 select-none animate-fade-in"
    >
      {/* 背景バックドロップ（同意モード時はクリックで閉じない） */}
      <div
        data-testid="privacy-policy-backdrop"
        onClick={isConsentMode ? undefined : onClose}
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-[2px] transition-opacity"
      />

      {/* モーダルカード本体 */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* ヘッダー */}
        <div className="px-5 py-3.5 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-amber-50/40 to-sky-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="privacy-policy-title"
                className="text-base sm:text-lg font-bold text-stone-800 tracking-tight"
              >
                {isConsentMode ? 'プライバシーポリシーへの同意' : 'データの取り扱いとプライバシー'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {isConsentMode
                  ? '安心してお楽しみいただくため、ご確認・ご同意をお願いいたします'
                  : '安心してお楽しみいただくための方針'}
              </p>
            </div>
          </div>

          {/* 閉じるボタン（同意モード時は非表示） */}
          {!isConsentMode && (
            <button
              type="button"
              onClick={onClose}
              aria-label="プライバシー方針を閉じる"
              data-testid="privacy-policy-close-button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* スクロール可能な本文コンテンツ */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-left text-xs text-stone-700 leading-relaxed">
          {/* 同意モード時のご案内バナー */}
          {isConsentMode && (
            <div
              data-testid="privacy-consent-banner"
              className="p-3 bg-gradient-to-br from-sky-50 via-indigo-50/40 to-stone-50 border border-sky-200 rounded-2xl shadow-2xs"
            >
              <p className="font-bold text-stone-800 text-xs sm:text-sm mb-1">
                「ねこっぽい」へようこそ！
              </p>
              <p className="text-stone-600 leading-relaxed">
                本アプリでは、メールアドレス不要の安全なID連携およびアプリ改善のための匿名統計分析を行っています。安心してお楽しみいただくため、以下のデータの取り扱い方針をご確認の上、同意をお願いいたします。
              </p>
            </div>
          )}

          {/* 基本方針 */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>基本方針（端末内保存・完全無料）</span>
            </div>
            <p className="text-stone-600">
              「ねこっぽい」は、原則としてお使いのブラウザ（端末内）にのみデータを保存して動作するプライバシー配慮設計です。
              アカウント作成やクラウド連携は<strong>希望される方のみの任意機能</strong>であり、登録を行わなくてもすべての要素（お世話・なつき度・おくりもの・実績など）を完全無料でお楽しみいただけます。
            </p>
          </div>

          {/* 取得する情報 */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Database className="w-4 h-4 text-sky-600 shrink-0" />
              <span>取得する情報</span>
            </div>
            <p className="mb-1 text-stone-600">
              クラウド連携をご利用いただく場合のみ、以下の情報を安全にお預かりします（メールアドレス等の個人を特定する情報は一切取得しません）：
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li><strong>連携識別情報</strong>：自動発行されるランダムな連携ID</li>
              <li><strong>セーブデータ</strong>：猫ちゃんたちのお名前、ごきげん度、まんぷく度、なつき度、おくりもの獲得状況、実績解除状況、手帳の統計</li>
              <li><strong>匿名利用統計</strong>：おくりものの収集率、実績の達成率、機能の利用傾向などの統計数値（※完全な匿名データであり、個人を特定できる情報は含みません）</li>
            </ul>
          </div>

          {/* 利用目的 */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>利用目的</span>
            </div>
            <p className="text-stone-600 leading-relaxed mb-1">
              お預かりした情報は、以下の目的にのみ適切に使用いたします：
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li><strong>データ同期・引き継ぎ</strong>：異なる端末（PCやスマートフォン）間でのセーブデータの共有および認証</li>
              <li><strong>アプリ改善・バランス調整</strong>：おくりものの出現バランス調整、実績難易度の適正化、新機能開発および不具合調査のための統計分析</li>
            </ul>
            <p className="text-[11px] text-stone-500 mt-1">
              ※宣伝や広告配信、マーケティング分析などの他の用途には一切利用いたしません。
            </p>
          </div>

          {/* 統計収集の停止（オプトアウト） */}
          <div className="p-3 bg-sky-50/60 border border-sky-200/80 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>利用統計送信の停止（オプトアウト）</span>
              </div>
              {onToggleAnalytics && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnalyticsEnabled}
                  aria-label="匿名の利用統計送信の許可"
                  data-testid="privacy-consent-analytics-toggle"
                  onClick={() => onToggleAnalytics(!isAnalyticsEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
                    isAnalyticsEnabled ? 'bg-sky-500' : 'bg-stone-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isAnalyticsEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              )}
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              アプリ改善のための匿名利用統計の送信は、設定画面（または上記スイッチ）の**「アプリ改善のための匿名の利用統計送信」をオフにすることで、いつでも停止（集計対象から除外）できます**。オフにした場合でも、クラウド同期を含むすべての機能を制限なくご利用いただけます。
            </p>
          </div>

          {/* 安全管理とセキュリティ */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>安全管理・セキュリティ</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-stone-600">
              <li>
                <strong>通信の暗号化</strong>：すべての通信は SSL / TLS による暗号化通信で保護されています。
              </li>
              <li>
                <strong>パスワードの厳格保護</strong>：パスワードは最新の暗号学的ハッシュ関数により変換されて保管され、<strong>開発者であってもパスワードの平文を見ることはできません</strong>。
              </li>
              <li>
                <strong>行単位セキュリティ（RLS）</strong>：データベースの厳格なアクセス制御により、ログイン中のご本人以外のユーザーからセーブデータが閲覧・改ざんされることはありません。
              </li>
              <li>
                <strong>第三者提供の禁止</strong>：法令に基づく開示要請がある場合を除き、個人情報やセーブデータを第三者に提供・販売することは一切ありません。
              </li>
            </ul>
          </div>

          {/* 端末内ストレージ（localStorage）の利用 */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <HardDrive className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>端末内ストレージ（localStorage）の利用</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              本アプリはトラッキング目的のCookieは使用しておらず、お使いのブラウザの「ローカルストレージ（localStorage）」機能を用いて、ゲームの進行状況やお名前、サウンドなどの設定を端末内に保存しています。
            </p>
          </div>

          {/* 外部送信および利用サービスについて（電気通信事業法・インフラ対応） */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Server className="w-4 h-4 text-sky-600 shrink-0" />
              <span>外部送信および利用サービスについて</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs mb-1.5">
              本アプリでは、サービスの安全な配信およびセーブデータ保管のため、以下の外部事業者のサーバーを利用しています：
            </p>
            <div className="space-y-2 text-stone-600 text-xs">
              <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1">
                <div className="font-bold text-stone-800">
                  ・Vercel, Inc.（Webサイトの配信・ホスティング）
                </div>
                <div className="pl-3 space-y-0.5 text-stone-600 text-[11px]">
                  <div><strong>送信情報</strong>：アクセス時の通信ログ（IPアドレス、ブラウザ情報等）</div>
                  <div><strong>利用目的</strong>：Webアプリの高速・安定した配信および不正アクセスの防止</div>
                </div>
              </div>
              <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1">
                <div className="font-bold text-stone-800">
                  ・Supabase, Inc.（クラウドデータ保管・認証）
                </div>
                <div className="pl-3 space-y-0.5 text-stone-600 text-[11px]">
                  <div><strong>送信情報</strong>：自動発行された連携ID、暗号化ハッシュキー、セーブデータ</div>
                  <div><strong>利用目的</strong>：クラウドデータの安全な保管および認証基盤の提供</div>
                </div>
              </div>
            </div>
          </div>

          {/* データの削除およびお問い合わせ窓口 */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>データの削除およびお問い合わせ窓口</span>
            </div>
            <div className="space-y-1.5 text-stone-600 text-xs leading-relaxed">
              <p>
                <strong>端末内データ</strong>：お使いのブラウザの閲覧履歴・サイトデータ（ストレージ）を消去することで、いつでもご自身で即座に完全削除できます。
              </p>
              <p>
                <strong>クラウドデータ・お問い合わせ</strong>：クラウド上のセーブデータの削除をご希望の場合や、本ポリシーに関するご質問・ご意見は、下記窓口までご連絡ください。
              </p>
              <div className="mt-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <div>
                  <span className="font-bold text-stone-700">開発者</span>：<span>goi</span>
                </div>
                <div>
                  <span className="font-bold text-stone-700">お問い合わせ先</span>：
                  <a
                    href="mailto:gliscoroil@gmail.com"
                    className="text-sky-600 hover:text-sky-700 underline font-mono ml-1"
                  >
                    gliscoroil@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 未成年者のご利用について */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <Users className="w-4 h-4 text-amber-600 shrink-0" />
              <span>未成年者のご利用について</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              未成年（お子様）がクラウド連携機能をご利用になる場合は、保護者（親権者）の方の同意を得た上でご利用ください。
            </p>
          </div>

          {/* プライバシーポリシーの変更について */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm mb-1.5">
              <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>プライバシーポリシーの変更</span>
            </div>
            <p className="text-stone-600 leading-relaxed mb-1">
              本ポリシーの内容は、法令の改正やサービスの改善等に伴い、今後変更されることがあります。
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li>
                <strong>変更と効力発生</strong>：法令に別段の定めがある場合を除き、運営者の判断により本ポリシーを変更できるものとします。変更後の内容は、本アプリ内に掲載された時点から効力を生じるものとします。
              </li>
              <li>
                <strong>重要な変更の告知</strong>：利用目的を大きく変更する場合や、法令上ユーザーの皆様の同意が必要となる変更を行う場合は、アプリ内でポップアップ通知等により事前にお知らせし、必要に応じて改めて同意を得るものとします。
              </li>
            </ul>
          </div>

          {/* 制定日・改定日 */}
          <div className="pt-2.5 border-t border-stone-200/80 text-[11px] text-stone-400 flex flex-col gap-0.5">
            <div>制定日：2026年11月21日</div>
            <div>最終改定日：2026年11月21日</div>
          </div>
        </div>

        {/* フッター */}
        <div className="px-5 py-3 border-t border-sky-100 bg-stone-50/90 flex items-center justify-end">
          {isConsentMode ? (
            <button
              type="button"
              data-testid="privacy-policy-accept-button"
              onClick={handleAccept}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 active:from-sky-700 active:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>プライバシーポリシーに同意して利用を開始する</span>
            </button>
          ) : (
            <button
              type="button"
              data-testid="privacy-policy-confirm-button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              確認しました
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
