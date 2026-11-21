import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JournalButton } from './JournalButton.tsx';

describe('JournalButton コンポーネント', () => {
  it('手帳アイコンのみを持つ角丸正方形ボタンとしてレンダリングされること', () => {
    const handleClick = vi.fn();
    render(<JournalButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'ふり返り手帳を開く' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'journal-button');

    // 実績ボタンと設定ボタンの間（left-[14rem] sm:left-[16.5rem]）に配置されていること
    expect(button).toHaveClass('left-[14rem]');
    expect(button).toHaveClass('sm:left-[16.5rem]');

    const icon = screen.getByTestId('journal-icon');
    expect(icon).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
