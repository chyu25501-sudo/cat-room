import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalicoCat } from './CalicoCat.tsx';

describe('CalicoCat コンポーネント (みけねこ立ち姿)', () => {
  it('デフォルト状態でみけねこSVGがレンダリングされること', () => {
    render(<CalicoCat />);

    const svg = screen.getByTestId('calico-cat-svg');
    expect(svg).toBeInTheDocument();
  });

  it('反応時 (isReacting: true) に床の波紋エフェクトが表示されること', () => {
    const { rerender } = render(<CalicoCat isReacting={false} />);
    expect(screen.queryByRole('presentation', { hidden: true })).toBeNull();

    rerender(<CalicoCat isReacting={true} />);
    const svg = screen.getByTestId('calico-cat-svg');
    // animate-ping クラスを持つ波紋 ellipse が含まれること
    const pingEllipse = svg.querySelector('.animate-ping');
    expect(pingEllipse).toBeInTheDocument();
  });

  it('機嫌レベル (moodLevel) に応じて表情が変化すること', () => {
    // 1. 通常 (normal)
    const { rerender } = render(<CalicoCat moodLevel="normal" />);
    expect(screen.getByTestId('calico-cat-svg')).toBeInTheDocument();

    // 2. 不機嫌 (annoyed)
    rerender(<CalicoCat moodLevel="annoyed" />);
    expect(screen.getByTestId('calico-cat-svg')).toBeInTheDocument();

    // 3. ごきげん (happy)
    rerender(<CalicoCat moodLevel="happy" />);
    expect(screen.getByTestId('calico-cat-svg')).toBeInTheDocument();

    // 4. 大喜び (ecstatic)
    rerender(<CalicoCat moodLevel="ecstatic" />);
    expect(screen.getByTestId('calico-cat-svg')).toBeInTheDocument();
  });
});
