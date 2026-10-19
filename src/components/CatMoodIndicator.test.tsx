import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CatMoodIndicator } from './CatMoodIndicator.tsx';

describe('CatMoodIndicator コンポーネント (第4週: ごきげん視覚表示)', () => {
  it('おだやか（normal）状態のゲージとバッジが正しく表示されること', () => {
    render(
      <CatMoodIndicator
        moodScore={20}
        moodLevel="normal"
        catName="くろねこ"
      />
    );

    expect(screen.getByText('くろねこのごきげん')).toBeInTheDocument();
    expect(screen.getByText('おだやか')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('まったり落ち着いているよ')).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '20');

    const fill = screen.getByTestId('mood-gauge-fill');
    expect(fill.style.width).toBe('20%');
  });

  it('ごきげん（happy）状態のバッジとゲージが正しく表示されること', () => {
    render(
      <CatMoodIndicator
        moodScore={60}
        moodLevel="happy"
        catName="しろねこ"
      />
    );

    expect(screen.getByText('しろねこのごきげん')).toBeInTheDocument();
    expect(screen.getByText('ごきげん♪')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();

    const fill = screen.getByTestId('mood-gauge-fill');
    expect(fill.style.width).toBe('60%');
  });

  it('ごきげんMAX（ecstatic）状態のバッジとゲージが正しく表示されること', () => {
    render(
      <CatMoodIndicator
        moodScore={100}
        moodLevel="ecstatic"
        catName="くろねこ"
      />
    );

    expect(screen.getByText('ごきげんMAX♡')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('なでなでが大好きで幸せいっぱい♡')).toBeInTheDocument();

    const fill = screen.getByTestId('mood-gauge-fill');
    expect(fill.style.width).toBe('100%');
  });
});

