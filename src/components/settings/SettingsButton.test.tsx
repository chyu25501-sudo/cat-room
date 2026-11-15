import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsButton } from './SettingsButton.tsx';

describe('SettingsButton コンポーネント', () => {
  it('歯車アイコンのみを持つ角丸正方形ボタンとしてレンダリングされること', () => {
    const handleClick = vi.fn();
    render(<SettingsButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: '設定を開く' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'settings-button');
    // 正方形・角丸クラス
    expect(button).toHaveClass('rounded-2xl');

    // 実績ボタンの右側（left-[7.5rem] sm:left-[8.75rem]）に配置されていること
    expect(button).toHaveClass('left-[7.5rem]');
    expect(button).toHaveClass('sm:left-[8.75rem]');

    // 内部に歯車アイコンSVGが存在すること
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();

    // クリックイベントが発火すること
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
