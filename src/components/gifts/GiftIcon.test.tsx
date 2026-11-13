import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  GiftIcon,
  PebbleIcon,
  FeatherIcon,
  AcornIcon,
  TwigIcon,
  SeashellIcon,
  FallenLeafIcon,
  PineconeIcon,
  CloverIcon,
  RibbonIcon,
  ButtonIcon,
  OldCoinIcon,
  RainbowFeatherIcon,
  FourLeafCloverIcon,
} from './GiftIcon.tsx';

describe('GiftIcon コンポーネント (おくりもののSVGイラスト描画)', () => {
  it('各ギフトIDが渡されたとき、対応する専用SVGが描画されること', () => {
    const testCases = [
      { id: 'pebble', testId: 'pebble-icon' },
      { id: 'feather', testId: 'feather-icon' },
      { id: 'acorn', testId: 'acorn-icon' },
      { id: 'twig', testId: 'twig-icon' },
      { id: 'seashell', testId: 'seashell-icon' },
      { id: 'fallen-leaf', testId: 'fallen-leaf-icon' },
      { id: 'pinecone', testId: 'pinecone-icon' },
      { id: 'clover', testId: 'clover-icon' },
      { id: 'ribbon', testId: 'ribbon-icon' },
      { id: 'button', testId: 'button-icon' },
      { id: 'old-coin', testId: 'old-coin-icon' },
      { id: 'rainbow-feather', testId: 'rainbow-feather-icon' },
      { id: 'four-leaf-clover', testId: 'four-leaf-clover-icon' },
    ];

    for (const { id, testId } of testCases) {
      const { unmount } = render(<GiftIcon giftId={id} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    }
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

  it('個別SVGコンポーネントが正常にレンダリングされること', () => {
    const components = [
      PebbleIcon,
      FeatherIcon,
      AcornIcon,
      TwigIcon,
      SeashellIcon,
      FallenLeafIcon,
      PineconeIcon,
      CloverIcon,
      RibbonIcon,
      ButtonIcon,
      OldCoinIcon,
      RainbowFeatherIcon,
      FourLeafCloverIcon,
    ];

    for (const Comp of components) {
      const { container, unmount } = render(<Comp className="w-10 h-10" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      unmount();
    }
  });
});
