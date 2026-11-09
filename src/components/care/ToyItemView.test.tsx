import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToyItemView } from './ToyItemView.tsx';
import { TOY_ITEMS } from '../../utils/catCare.ts';

describe('ToyItemView コンポーネント (おもちゃイラスト描画)', () => {
  it('ねこじゃらし選択時に専用のSVGと名前が描画されること', () => {
    render(<ToyItemView toy={TOY_ITEMS[0]} />);

    expect(screen.getByTestId('teaser-toy-svg')).toBeInTheDocument();
    expect(screen.getByText('ねこじゃらし')).toBeInTheDocument();
  });

  it('毛糸ボール選択時に専用のSVGと名前が描画されること', () => {
    render(<ToyItemView toy={TOY_ITEMS[1]} />);

    expect(screen.getByTestId('ball-toy-svg')).toBeInTheDocument();
    expect(screen.getByText('毛糸ボール')).toBeInTheDocument();
  });

  it('レーザーポインター選択時に専用のSVGと名前が描画されること', () => {
    render(<ToyItemView toy={TOY_ITEMS[2]} />);

    expect(screen.getByTestId('laser-toy-svg')).toBeInTheDocument();
    expect(screen.getByText('レーザーポインター')).toBeInTheDocument();
  });

  it('isPlaying が true の時、遊びパーティクルとあそび中テキストが表示されること', () => {
    const { container } = render(<ToyItemView toy={TOY_ITEMS[0]} isPlaying={true} />);

    expect(screen.getByTestId('playing-particles')).toBeInTheDocument();
    expect(screen.getByText('あそび中…♪')).toBeInTheDocument();

    // 左右にゆらゆらしながら上昇するアニメーションクラスが付与されていること
    expect(container.querySelector('.animate-eating-rise')).toBeInTheDocument();
    expect(container.querySelector('.animate-eating-sway-left')).toBeInTheDocument();
    expect(container.querySelector('.animate-eating-sway-right')).toBeInTheDocument();
  });

  it('isPlaying が false の時、パーティクルが表示されないこと', () => {
    render(<ToyItemView toy={TOY_ITEMS[0]} isPlaying={false} />);

    expect(screen.queryByTestId('playing-particles')).not.toBeInTheDocument();
    expect(screen.queryByText('あそび中…♪')).not.toBeInTheDocument();
  });

  it('ねこじゃらしで遊び中のとき、スティックの持ち手軸スイングと先端羽根のパタパタ振りアニメーションが付与されること', () => {
    const { rerender } = render(<ToyItemView toy={TOY_ITEMS[0]} isPlaying={true} />);

    const stick = screen.getByTestId('teaser-stick-group');
    const feather = screen.getByTestId('teaser-feather-group');

    expect(stick).toHaveClass('animate-teaser-stick');
    expect(feather).toHaveClass('animate-teaser-feather');

    // 遊び終了時はアニメーションが外れること
    rerender(<ToyItemView toy={TOY_ITEMS[0]} isPlaying={false} />);
    expect(stick).not.toHaveClass('animate-teaser-stick');
    expect(feather).not.toHaveClass('animate-teaser-feather');
  });
});
