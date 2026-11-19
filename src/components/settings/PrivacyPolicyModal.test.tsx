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
    expect(screen.getByText('利用目的')).toBeInTheDocument();
    expect(screen.getByText('安全管理・セキュリティ')).toBeInTheDocument();
    expect(screen.getByText(/開発者であってもパスワードの平文を見ることはできません/)).toBeInTheDocument();
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
});
