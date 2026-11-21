import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CloudMigrationModal } from './CloudMigrationModal.tsx';

describe('CloudMigrationModal コンポーネント (ID連携移行案内モーダル)', () => {
  const dummyCreds = {
    userId: 'NK-A8F2-9X4B',
    transferKey: 'k7Mp2Q9xL4wZ',
    createdAt: 1700000000000,
  };

  it('isOpen が false のとき、何も表示されないこと', () => {
    const { container } = render(
      <CloudMigrationModal
        isOpen={false}
        onClose={vi.fn()}
        credentials={dummyCreds}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('isOpen が true のとき、移行案内・ID・キー・注意事項が表示されること', () => {
    render(
      <CloudMigrationModal
        isOpen={true}
        onClose={vi.fn()}
        credentials={dummyCreds}
        previousEmail="user@example.com"
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('ID連携への移行が完了しました')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('migration-user-id')).toHaveTextContent('NK-A8F2-9X4B');
    expect(screen.getByTestId('migration-transfer-key')).toHaveTextContent('k7Mp2Q9xL4wZ');
    expect(screen.getByText(/【大切なお願い】IDとパスワードを保管してください/)).toBeInTheDocument();
  });

  it('確認ボタンをクリックすると onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(
      <CloudMigrationModal
        isOpen={true}
        onClose={handleClose}
        credentials={dummyCreds}
      />
    );

    const confirmBtn = screen.getByTestId('migration-confirm-button');
    fireEvent.click(confirmBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('コピーボタンをクリックするとクリップボード書き込みが呼ばれること', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(
      <CloudMigrationModal
        isOpen={true}
        onClose={vi.fn()}
        credentials={dummyCreds}
      />
    );

    const copyIdBtn = screen.getByTestId('migration-copy-id-btn');
    fireEvent.click(copyIdBtn);
    expect(writeTextSpy).toHaveBeenCalledWith('NK-A8F2-9X4B');

    const copyKeyBtn = screen.getByTestId('migration-copy-key-btn');
    fireEvent.click(copyKeyBtn);
    expect(writeTextSpy).toHaveBeenCalledWith('k7Mp2Q9xL4wZ');
  });
});
