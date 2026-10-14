import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatSelector } from './CatSelector.tsx';
import { CAT_PRESETS, CatPreset } from '../types/cat.ts';

describe('CatSelector コンポーネント', () => {
  it('切り替えマークと黒・白の円形ラジオボタンがレンダリングされること', () => {
    const handleSelect = vi.fn();
    const handleNext = vi.fn();

    render(
      <CatSelector
        currentCatId="black"
        onSelectCat={handleSelect}
        onSwitchNext={handleNext}
      />
    );

    // 切り替えマーク
    expect(screen.getByRole('button', { name: /猫の見た目を切り替える/ })).toBeInTheDocument();

    // ラジオボタン
    const blackRadio = screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ });
    const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
    expect(blackRadio).toBeInTheDocument();
    expect(whiteRadio).toBeInTheDocument();

    // 黒猫が選択中
    expect(blackRadio).toHaveAttribute('aria-checked', 'true');
    expect(whiteRadio).toHaveAttribute('aria-checked', 'false');
  });

  it('円形ボタンをクリックすると onSelectCat が呼び出されること', () => {
    const handleSelect = vi.fn();
    render(<CatSelector currentCatId="black" onSelectCat={handleSelect} />);

    const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
    fireEvent.click(whiteRadio);

    expect(handleSelect).toHaveBeenCalledWith('white');
  });

  it('切り替えマークをクリックすると onSwitchNext が呼び出されること', () => {
    const handleNext = vi.fn();
    render(<CatSelector currentCatId="black" onSelectCat={vi.fn()} onSwitchNext={handleNext} />);

    const switchMark = screen.getByRole('button', { name: /猫の見た目を切り替える/ });
    fireEvent.click(switchMark);

    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('将来的にプリセットが増えた場合、円形ボタンが横並びで増えて描画されること', () => {
    const extendedPresets: CatPreset[] = [
      ...CAT_PRESETS,
      {
        id: 'calico' as any, // 拡張テスト用のユニークID
        name: 'みけねこ',
        poseName: 'のびのび',
        label: 'みけねこ（のびのび）',
        description: '',
        defaultPitch: 1.0,
        meowMessages: [],
        swatch: { bgClass: 'bg-amber-400', borderClass: 'border-amber-500', dotClass: 'bg-white' },
      },
    ];

    render(
      <CatSelector
        currentCatId="black"
        presets={extendedPresets}
        onSelectCat={vi.fn()}
      />
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });
});

