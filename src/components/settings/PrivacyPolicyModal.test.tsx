import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PrivacyPolicyModal } from './PrivacyPolicyModal.tsx';

describe('PrivacyPolicyModal コンポーネント', () => {
  it('isOpen が false のときは何も描画されないこと', () => {
    const { container } = render(<PrivacyPolicyModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、タイトルおよびプライバシー方針の各項目が表示されること', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('privacy-policy-modal')).toBeInTheDocument();
    expect(screen.getByText('データの取り扱いとプライバシー')).toBeInTheDocument();
    expect(screen.getByText(/基本方針（端末内保存・完全無料）/)).toBeInTheDocument();
    expect(screen.getByText('取得する情報')).toBeInTheDocument();
    expect(screen.getAllByText('利用目的').length).toBeGreaterThan(0);
    expect(screen.getByText('安全管理・セキュリティ')).toBeInTheDocument();
    expect(screen.getByText(/開発者であってもパスワードの平文を見ることはできません/)).toBeInTheDocument();
    expect(screen.getByText('プライバシーポリシーの変更')).toBeInTheDocument();
    expect(screen.getByText(/運営者の判断により本ポリシーを変更できるものとします/)).toBeInTheDocument();
    expect(screen.getByText(/アプリ内でポップアップ通知等により事前にお知らせし/)).toBeInTheDocument();
    expect(screen.getByText('端末内ストレージ（localStorage）の利用')).toBeInTheDocument();
    expect(screen.getByText('外部送信および利用サービスについて')).toBeInTheDocument();
    expect(screen.getByText(/Vercel, Inc\./)).toBeInTheDocument();
    expect(screen.getByText(/Supabase, Inc\./)).toBeInTheDocument();
    expect(screen.getByText('データの削除およびお問い合わせ窓口')).toBeInTheDocument();
    expect(screen.getByText('goi')).toBeInTheDocument();
    expect(screen.getByText('gliscoroil@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('未成年者のご利用について')).toBeInTheDocument();
    expect(screen.getByText(/制定日：2026年11月21日/)).toBeInTheDocument();
  });

  it('閉じるボタン・バックドロップ・確認ボタンのクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<PrivacyPolicyModal isOpen={true} onClose={handleClose} />);

    // 閉じるボタン
    const closeBtn = screen.getByTestId('privacy-policy-close-button');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // バックドロップ
    const backdrop = screen.getByTestId('privacy-policy-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // 確認ボタン
    const confirmBtn = screen.getByTestId('privacy-policy-confirm-button');
    fireEvent.click(confirmBtn);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });

  describe('同意要求モード（isConsentMode=true）', () => {
    it('同意モード用のタイトル・案内バナーが表示され、閉じるボタンが非表示であること', () => {
      render(
        <PrivacyPolicyModal
          isOpen={true}
          isConsentMode={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('プライバシーポリシーへの同意')).toBeInTheDocument();
      expect(screen.getByTestId('privacy-consent-banner')).toBeInTheDocument();
      expect(screen.getByText(/安心してお楽しみいただくため、ご確認・ご同意をお願いいたします/)).toBeInTheDocument();

      // 同意必須のためXボタンや「確認しました」ボタンは存在しない
      expect(screen.queryByTestId('privacy-policy-close-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('privacy-policy-confirm-button')).not.toBeInTheDocument();

      // 代わりに「プライバシーポリシーに同意して利用を開始する」ボタンが存在すること
      expect(screen.getByTestId('privacy-policy-accept-button')).toBeInTheDocument();
    });

    it('バックドロップをクリックしても onClose が呼ばれないこと（同意必須）', () => {
      const handleClose = vi.fn();
      render(
        <PrivacyPolicyModal
          isOpen={true}
          isConsentMode={true}
          onClose={handleClose}
        />
      );

      const backdrop = screen.getByTestId('privacy-policy-backdrop');
      fireEvent.click(backdrop);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('「同意して利用を開始する」ボタンを押すと onAccept と onClose が呼ばれること', () => {
      const handleAccept = vi.fn();
      const handleClose = vi.fn();
      render(
        <PrivacyPolicyModal
          isOpen={true}
          isConsentMode={true}
          onAccept={handleAccept}
          onClose={handleClose}
        />
      );

      const acceptBtn = screen.getByTestId('privacy-policy-accept-button');
      fireEvent.click(acceptBtn);

      expect(handleAccept).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('統計送信トグルが表示され、切り替えができること', () => {
      const handleToggleAnalytics = vi.fn();
      render(
        <PrivacyPolicyModal
          isOpen={true}
          isConsentMode={true}
          onClose={vi.fn()}
          isAnalyticsEnabled={true}
          onToggleAnalytics={handleToggleAnalytics}
        />
      );

      const toggle = screen.getByTestId('privacy-consent-analytics-toggle');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(toggle);
      expect(handleToggleAnalytics).toHaveBeenCalledWith(false);
    });
  });
});
