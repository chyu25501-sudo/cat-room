import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsModal } from './SettingsModal.tsx';

describe('SettingsModal コンポーネント', () => {
  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(<SettingsModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、設定ウィンドウとタイトル・歯車アイコンが表示されること', () => {
    render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: '設定' })).toBeInTheDocument();
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument();
    expect(screen.getAllByTestId('settings-icon').length).toBeGreaterThan(0);
    expect(screen.getByText('アプリ情報')).toBeInTheDocument();
    expect(screen.getByText('ねこっぽい')).toBeInTheDocument();
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
