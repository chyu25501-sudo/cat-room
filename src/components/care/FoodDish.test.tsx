import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FoodDish } from './FoodDish.tsx';
import { FOOD_ITEMS } from '../../utils/catCare.ts';

describe('FoodDish コンポーネント (ごはんイラスト描画)', () => {
  it('カリカリ選択時に専用のボウルSVGと名前が描画されること', () => {
    render(<FoodDish food={FOOD_ITEMS[0]} />);

    expect(screen.getByTestId('kibble-dish-svg')).toBeInTheDocument();
    expect(screen.getByText('カリカリ')).toBeInTheDocument();
  });

  it('ねこ缶選択時に専用の缶・お皿SVGと名前が描画されること', () => {
    render(<FoodDish food={FOOD_ITEMS[1]} />);

    expect(screen.getByTestId('canned-dish-svg')).toBeInTheDocument();
    expect(screen.getByText('ねこ缶（まぐろ）')).toBeInTheDocument();
  });

  it('おやつピューレ選択時に専用のピューレ皿・スティックSVGと名前が描画されること', () => {
    render(<FoodDish food={FOOD_ITEMS[2]} />);

    expect(screen.getByTestId('treat-dish-svg')).toBeInTheDocument();
    expect(screen.getByText('おやつピューレ')).toBeInTheDocument();
  });

  it('isEating が true の時、もぐもぐパーティクルともぐもぐ中テキストが表示されること', () => {
    const { container } = render(<FoodDish food={FOOD_ITEMS[0]} isEating={true} />);

    expect(screen.getByTestId('eating-particles')).toBeInTheDocument();
    expect(screen.getByText('もぐもぐ…♪')).toBeInTheDocument();

    // 左右にゆらゆらしながら上昇するアニメーションクラスが付与されていること
    expect(container.querySelector('.animate-eating-rise')).toBeInTheDocument();
    expect(container.querySelector('.animate-eating-sway-left')).toBeInTheDocument();
    expect(container.querySelector('.animate-eating-sway-right')).toBeInTheDocument();
  });

  it('isEating が false の時、もぐもぐパーティクルが表示されないこと', () => {
    render(<FoodDish food={FOOD_ITEMS[0]} isEating={false} />);

    expect(screen.queryByTestId('eating-particles')).not.toBeInTheDocument();
    expect(screen.queryByText('もぐもぐ…♪')).not.toBeInTheDocument();
  });
});
