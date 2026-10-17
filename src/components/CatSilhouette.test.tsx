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

  it('長いストロークでドラッグしても、クールダウンにより1回のストローク内で過剰に連続反応しないこと', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // 100pxから340pxまで一気に240px分ドラッグ（50pxごとのしきい値判定のみなら4回反応してしまう距離）
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true }); // +60px（1回目のなでなで成立）
    fireEvent.pointerMove(catButton, { clientX: 220, clientY: 100, isPrimary: true }); // +60px（クールダウン中のため抑制）
    fireEvent.pointerMove(catButton, { clientX: 280, clientY: 100, isPrimary: true }); // +60px（クールダウン中のため抑制）
    fireEvent.pointerMove(catButton, { clientX: 340, clientY: 100, isPrimary: true }); // +60px（クールダウン中のため抑制）
    fireEvent.pointerUp(catButton, { clientX: 340, clientY: 100, isPrimary: true });

    // 長いストロークでも1回のみ落ち着いて反応すること
    expect(handlePet).toHaveBeenCalledTimes(1);
  });

  it('キーボード操作の素早い連打時もクールダウンにより過剰発火が防止されること', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });
    fireEvent.keyDown(catButton, { key: ' ' });
    fireEvent.keyDown(catButton, { key: ' ' });
    fireEvent.keyDown(catButton, { key: 'Enter' });

    expect(handlePet).toHaveBeenCalledTimes(1);
  });

  it('撫でたときに画面中央付近からハートとキラキラのまとまり（従来の約2倍サイズ）が出現すること', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // 初期状態ではエフェクト粒子が存在しない
    expect(screen.queryAllByTestId('effect-particle-heart')).toHaveLength(0);
    expect(screen.queryAllByTestId('effect-particle-sparkle')).toHaveLength(0);

    // ドラッグ操作で撫でる
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catButton, { clientX: 160, clientY: 100, isPrimary: true });

    // なでなで成立後にハートとキラキラのまとまりが出現
    const hearts = screen.getAllByTestId('effect-particle-heart');
    const sparkles = screen.getAllByTestId('effect-particle-sparkle');

    expect(hearts.length).toBeGreaterThanOrEqual(3);
    expect(sparkles.length).toBeGreaterThanOrEqual(3);

    // 各要素が揺れ動くアニメーションクラスを持っていること
    for (const heart of hearts) {
      expect(
        heart.classList.contains('animate-sway-left') ||
          heart.classList.contains('animate-sway-right')
      ).toBe(true);
    }

    for (const sparkle of sparkles) {
      expect(
        sparkle.classList.contains('animate-sway-left') ||
          sparkle.classList.contains('animate-sway-right')
      ).toBe(true);
    }
  });
});


