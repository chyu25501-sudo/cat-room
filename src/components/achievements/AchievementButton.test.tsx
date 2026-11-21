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

    // おくりものボタンと手帳ボタンの間（left-[10.75rem] sm:left-[12.625rem]）に配置されていること
    expect(button).toHaveClass('left-[10.75rem]');
    expect(button).toHaveClass('sm:left-[12.625rem]');

    const icon = screen.getByTestId('trophy-icon');
    expect(icon).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
