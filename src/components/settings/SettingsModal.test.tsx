import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsModal } from './SettingsModal.tsx';

describe('SettingsModal コンポーネント', () => {
  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(<SettingsModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、設定ウィンドウとタイトル・歯車アイコンが表示され、バージョン表記は存在しないこと', () => {
    render(<SettingsModal isOpen={true} onClose={vi.fn()} isSoundEnabled={true} />);

    expect(screen.getByRole('dialog', { name: '設定' })).toBeInTheDocument();
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument();
    expect(screen.getAllByTestId('settings-icon').length).toBeGreaterThan(0);
    expect(screen.getByText('アプリ情報')).toBeInTheDocument();
    expect(screen.getByText('ねこっぽい')).toBeInTheDocument();

    // 要件: バージョンについての表記は削除されていること
    expect(screen.queryByText(/バージョン/)).not.toBeInTheDocument();
    expect(screen.queryByText(/0\.1\.0/)).not.toBeInTheDocument();
  });

  it('サウンドトグルスイッチが表示され、クリックで onToggleSound が呼ばれること', () => {
    const handleToggle = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        isSoundEnabled={true}
        onToggleSound={handleToggle}
      />
    );

    const toggleButton = screen.getByRole('switch', { name: 'サウンドのオン・オフ切り替え' });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');

    // トグルをクリックすると反対の値（false）でコールバックが発火すること
    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it('isSoundEnabled が false のときはトグルがオフ状態（aria-checked="false"）になること', () => {
    const handleToggle = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        isSoundEnabled={false}
        onToggleSound={handleToggle}
      />
    );

    const toggleButton = screen.getByRole('switch', { name: 'サウンドのオン・オフ切り替え' });
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(/サウンドは現在オフです/)).toBeInTheDocument();

    // クリックすると true でコールバックが発火すること
    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('閉じるボタンやバックドロップのクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<SettingsModal isOpen={true} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: '設定を閉じる' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId('settings-modal-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
