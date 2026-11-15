import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HowToPlayButton } from './HowToPlayButton.tsx';

describe('HowToPlayButton コンポーネント', () => {
  it('あそびかたアイコンのみを持つ角丸正方形ボタンとしてレンダリングされること', () => {
    const handleClick = vi.fn();
    render(<HowToPlayButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'あそびかたを開く' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'how-to-play-button');
    // 正方形・角丸クラス
    expect(button).toHaveClass('rounded-2xl');

    // 画面左端（left-4 sm:left-5）に配置されていること
    expect(button).toHaveClass('left-4');
    expect(button).toHaveClass('sm:left-5');

    // 内部にあそびかたアイコンSVGが存在すること
    expect(screen.getByTestId('how-to-play-icon')).toBeInTheDocument();

    // クリックイベントが発火すること
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
