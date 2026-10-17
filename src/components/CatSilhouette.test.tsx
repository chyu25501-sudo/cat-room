import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatSilhouette } from './CatSilhouette.tsx';
import { CAT_PRESETS } from '../types/cat.ts';

describe('CatSilhouette コンポーネント (第3週: なでるドラッグ操作)', () => {
  it('デフォルトで黒猫のシルエットが表示され、ドラッグ操作でなでられること', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });
    expect(catButton).toBeInTheDocument();
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();
    expect(screen.getByText('なでなで（ドラッグ）してふれあう')).toBeInTheDocument();

    // ドラッグ操作（ストローク距離がしきい値50px以上）
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true }); // +60px
    fireEvent.pointerUp(catButton, { clientX: 160, clientY: 100, isPrimary: true });

    expect(handlePet).toHaveBeenCalledTimes(1);
  });

  it('白猫プリセットを指定した場合、寝転がっている白猫が表示されドラッグでなでられること', () => {
    const whitePreset = CAT_PRESETS.find((p) => p.id === 'white')!;
    const handlePet = vi.fn();
    render(<CatSilhouette preset={whitePreset} onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /しろねこのシルエット/ });
    expect(catButton).toBeInTheDocument();
    expect(screen.getByTestId('white-cat-svg')).toBeInTheDocument();

    // ドラッグ操作
    fireEvent.pointerDown(catButton, { clientX: 50, clientY: 50, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 120, clientY: 50, isPrimary: true }); // +70px
    fireEvent.pointerUp(catButton, { clientX: 120, clientY: 50, isPrimary: true });

    expect(handlePet).toHaveBeenCalledTimes(1);
  });

  it('わずかな動き（しきい値未満）ではなでたと判定されないこと', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // わずか10pxの移動
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 110, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catButton, { clientX: 110, clientY: 100, isPrimary: true });

    expect(handlePet).not.toHaveBeenCalled();
  });

  it('キーボード操作（Space / Enter）でもアクセシビリティとしてなでられること', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });
    fireEvent.keyDown(catButton, { key: ' ' });

    expect(handlePet).toHaveBeenCalledTimes(1);
  });
});
