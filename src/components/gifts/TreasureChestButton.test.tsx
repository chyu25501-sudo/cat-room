import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TreasureChestButton } from './TreasureChestButton.tsx';

describe('TreasureChestButton コンポーネント', () => {
  it('宝箱アイコンのみを持つ角丸正方形ボタンとしてレンダリングされること', () => {
    const handleClick = vi.fn();
    render(<TreasureChestButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'これまでに受け取ったおくりもの一覧を開く' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'treasure-chest-button');
    // 正方形・角丸クラス
    expect(button).toHaveClass('rounded-2xl');

    // 内部に宝箱アイコンSVGが存在すること
    expect(screen.getByTestId('treasure-chest-icon')).toBeInTheDocument();

    // クリックイベントが発火すること
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
