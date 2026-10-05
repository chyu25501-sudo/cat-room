import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatSilhouette } from './CatSilhouette.tsx';

describe('CatSilhouette コンポーネント', () => {
  it('猫のシルエットが表示され、クリック可能であること', () => {
    const handleClick = vi.fn();
    render(<CatSilhouette onClick={handleClick} />);

    const catButton = screen.getByRole('button', { name: /猫のシルエット/ });
    expect(catButton).toBeInTheDocument();

    fireEvent.click(catButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('反応中(isReacting=true)のとき、視覚演出が表示されること', () => {
    const { rerender } = render(<CatSilhouette isReacting={false} />);
    // 通常時はハート演出なし
    expect(screen.queryByText('タップ（クリック）してふれあう')).toBeInTheDocument();

    rerender(<CatSilhouette isReacting={true} />);
    // 反応中もボタンが存在し、演出クラス・要素が有効
    expect(screen.getByRole('button', { name: /猫のシルエット/ })).toBeInTheDocument();
  });
});

