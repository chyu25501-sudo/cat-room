import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareButton } from './CareButton.tsx';

describe('CareButton コンポーネント', () => {
  it('お世話メニューを開く角丸正方形ボタンとして正しくレンダリングされ、クリックイベントが発火すること', () => {
    const handleClick = vi.fn();
    render(<CareButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'お世話メニューを開く' });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('care-menu-button')).toBeInTheDocument();

    // 画面左上（あそびかたボタンとおくりもの一覧ボタンの間）に配置されていること
    expect(button).toHaveClass('fixed');
    expect(button).toHaveClass('top-4');
    expect(button).toHaveClass('left-[4.25rem]');
    expect(button).toHaveClass('sm:top-5');
    expect(button).toHaveClass('sm:left-[4.875rem]');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
