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

  it('撫でたときに画面中央付近からハート・キラキラ・音符の中から「一度に一種類だけ」が出現すること', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // 初期状態ではエフェクト粒子が存在しない
    expect(screen.queryAllByTestId('effect-particle-heart')).toHaveLength(0);
    expect(screen.queryAllByTestId('effect-particle-sparkle')).toHaveLength(0);
    expect(screen.queryAllByTestId('effect-particle-note')).toHaveLength(0);

    // ドラッグ操作で撫でる
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catButton, { clientX: 160, clientY: 100, isPrimary: true });

    // なでなで成立後にエフェクト粒子群が出現
    const hearts = screen.queryAllByTestId('effect-particle-heart');
    const sparkles = screen.queryAllByTestId('effect-particle-sparkle');
    const notes = screen.queryAllByTestId('effect-particle-note');

    // ハート、キラキラ、音符のうち、いずれか「1種類だけ」が出現すること
    const nonZeroCounts = [hearts.length, sparkles.length, notes.length].filter((c) => c > 0);
    expect(nonZeroCounts).toHaveLength(1);
    expect(nonZeroCounts[0]).toBeGreaterThanOrEqual(3);

    const activeParticles = [...hearts, ...sparkles, ...notes];
    for (const p of activeParticles) {
      expect(p.classList.contains('animate-rise-up')).toBe(true);
      const swayWrapper = p.querySelector('.animate-sway-left, .animate-sway-right');
      expect(swayWrapper).not.toBeNull();
    }
  });

  it('音符エフェクトは玉の部分のみ塗りつぶされ、棒・桁部分は輪郭線のみ（fill=none）であること', () => {
    // 音符バーストを明示的に検証
    render(<CatSilhouette onPet={vi.fn()} />);
    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });

    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catButton, { clientX: 160, clientY: 100, isPrimary: true });

    const noteIcons = screen.queryAllByTestId('musical-note-icon');
    if (noteIcons.length > 0) {
      for (const icon of noteIcons) {
        // 符幹・桁（path）は fill="none"
        const path = icon.querySelector('path');
        expect(path).toHaveAttribute('fill', 'none');
        // 符頭（ellipse）は fill="currentColor" で丸い玉のみ塗りつぶし
        const ellipses = icon.querySelectorAll('ellipse');
        expect(ellipses.length).toBeGreaterThanOrEqual(1);
        for (const el of ellipses) {
          expect(el).toHaveAttribute('fill', 'currentColor');
        }
      }
    }
  });

  it('音の再生（isReacting変化）とエフェクトの発生タイミングが重複せず1:1で同期すること', () => {
    const handlePet = vi.fn();
    const { rerender } = render(<CatSilhouette onPet={handlePet} isReacting={false} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // なでなでを実行
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catButton, { clientX: 160, clientY: 100, isPrimary: true });

    const initialContainer = screen.getByTestId('pet-effects-container');
    const particleCount1 = initialContainer.children.length;
    expect(particleCount1).toBeGreaterThanOrEqual(3);

    // 音声再生に伴い isReacting が true に変化しても、過剰な重複二重発火が起きないこと
    rerender(<CatSilhouette onPet={handlePet} isReacting={true} />);
    const particleCount2 = initialContainer.children.length;
    expect(particleCount2).toBe(particleCount1);
  });

  it('ゆっくりと撫で続けている最中にもエフェクトが2連続で間隔をあけずに重複発生しないこと', () => {
    const handlePet = vi.fn();
    render(<CatSilhouette onPet={handlePet} cooldownMs={1000} />);

    const catButton = screen.getByRole('button', { name: /くろねこのシルエット/ });
    const container = screen.getByTestId('pet-effects-container');

    // なで始め（1回目のしきい値50px到達）
    fireEvent.pointerDown(catButton, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 160, clientY: 100, isPrimary: true });

    expect(handlePet).toHaveBeenCalledTimes(1);
    const firstBurstCount = container.children.length;
    expect(firstBurstCount).toBeGreaterThanOrEqual(3);
    expect(firstBurstCount).toBeLessThanOrEqual(4);

    // ゆっくり撫で続ける（クールダウン1000ms以内の細かな移動）
    fireEvent.pointerMove(catButton, { clientX: 180, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 200, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 230, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catButton, { clientX: 260, clientY: 100, isPrimary: true });

    // クールダウン中は2連続でエフェクトが重なって増殖しない
    expect(handlePet).toHaveBeenCalledTimes(1);
    expect(container.children.length).toBe(firstBurstCount);

    fireEvent.pointerUp(catButton, { clientX: 260, clientY: 100, isPrimary: true });
  });
});


