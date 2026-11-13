import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GiftIcon, PebbleIcon, FeatherIcon } from './GiftIcon.tsx';

describe('GiftIcon コンポーネント (おくりもののSVGイラスト描画)', () => {
  it('pebble が渡されたとき、きれいな小石のSVG（pebble-icon）が描画されること', () => {
    render(<GiftIcon giftId="pebble" />);
    expect(screen.getByTestId('pebble-icon')).toBeInTheDocument();
  });

  it('feather が渡されたとき、ふわふわの羽根のSVG（feather-icon）が描画されること', () => {
    render(<GiftIcon giftId="feather" />);
    expect(screen.getByTestId('feather-icon')).toBeInTheDocument();
  });

  it('isAcquired が false のとき、未発見（?）のSVG（unknown-gift-icon）が描画されること', () => {
    render(<GiftIcon giftId="pebble" isAcquired={false} />);
    expect(screen.getByTestId('unknown-gift-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('pebble-icon')).not.toBeInTheDocument();
  });

  it('未定義のIDが渡されたとき、デフォルトギフトのSVG（default-gift-icon）が描画されること', () => {
    render(<GiftIcon giftId="unknown-item" />);
    expect(screen.getByTestId('default-gift-icon')).toBeInTheDocument();
  });

  it('個別コンポーネント PebbleIcon, FeatherIcon が正常にレンダリングされること', () => {
    const { container: c1 } = render(<PebbleIcon className="w-10 h-10" />);
    expect(c1.querySelector('[data-testid="pebble-icon"]')).toBeInTheDocument();

    const { container: c2 } = render(<FeatherIcon className="w-10 h-10" />);
    expect(c2.querySelector('[data-testid="feather-icon"]')).toBeInTheDocument();
  });
});
