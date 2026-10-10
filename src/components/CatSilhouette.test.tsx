import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatSilhouette } from './CatSilhouette.tsx';
import { CAT_PRESETS } from '../types/cat.ts';

describe('CatSilhouette コンポーネント', () => {
  it('デフォルトで黒猫のシルエットが表示され、クリック可能であること', () => {
    const handleClick = vi.fn();
    render(<CatSilhouette onClick={handleClick} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });
    expect(catButton).toBeInTheDocument();
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();

    fireEvent.click(catButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('白猫プリセットを指定した場合、寝転がっている白猫のシルエットが表示されること', () => {
    const whitePreset = CAT_PRESETS.find((p) => p.id === 'white')!;
    const handleClick = vi.fn();
    render(<CatSilhouette preset={whitePreset} onClick={handleClick} />);

    const catButton = screen.getByRole('button', { name: /しろねこのシルエット/ });
    expect(catButton).toBeInTheDocument();
    expect(screen.getByTestId('white-cat-svg')).toBeInTheDocument();

    fireEvent.click(catButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('反応中(isReacting=true)のとき、視覚演出が表示されること', () => {
    const { rerender } = render(<CatSilhouette isReacting={false} />);
    expect(screen.queryByText('タップ（クリック）してふれあう')).toBeInTheDocument();

    rerender(<CatSilhouette isReacting={true} />);
    expect(screen.getByRole('button', { name: /くろねこのシルエット/ })).toBeInTheDocument();
  });
});
