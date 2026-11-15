import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AchievementButton } from './AchievementButton.tsx';

describe('AchievementButton コンポーネント', () => {
  it('トロフィーアイコンのみを持つ角丸正方形ボタンとしてレンダリングされること', () => {
    const handleClick = vi.fn();
    render(<AchievementButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: '実績一覧を開く' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'achievement-button');

    // おくりものボタンと設定ボタンの間（left-[4.25rem] sm:left-[4.875rem]）に配置されていること
    expect(button).toHaveClass('left-[4.25rem]');
    expect(button).toHaveClass('sm:left-[4.875rem]');

    const icon = screen.getByTestId('trophy-icon');
    expect(icon).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
