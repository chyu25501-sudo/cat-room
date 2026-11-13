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
  MossyPebbleIcon,
  OldStampIcon,
  HairpinIcon,
  WiltedFlowerIcon,
  CicadaShellIcon,
  WhiteDiceIcon,
  GlassMarbleIcon,
  DirtyPlushIcon,
  SingleSockIcon,
  SunflowerSeedIcon,
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
      { id: 'mossy-pebble', testId: 'mossy-pebble-icon' },
      { id: 'old-stamp', testId: 'old-stamp-icon' },
      { id: 'hairpin', testId: 'hairpin-icon' },
      { id: 'wilted-flower', testId: 'wilted-flower-icon' },
      { id: 'cicada-shell', testId: 'cicada-shell-icon' },
      { id: 'white-dice', testId: 'white-dice-icon' },
      { id: 'glass-marble', testId: 'glass-marble-icon' },
      { id: 'dirty-plush', testId: 'dirty-plush-icon' },
      { id: 'single-sock', testId: 'single-sock-icon' },
      { id: 'sunflower-seed', testId: 'sunflower-seed-icon' },
    ];

    for (const { id, testId } of testCases) {
      const { unmount } = render(<GiftIcon giftId={id} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    }
  });

  it('isAcquired が false のとき、未発見（?）のSVG（unknown-gift-icon）が描画され、レアアイテムの場合は金色背景になること', () => {
    // 通常アイテムの未受取: グレー背景
    const { unmount } = render(<GiftIcon giftId="pebble" isAcquired={false} />);
    const commonUnknown = screen.getByTestId('unknown-gift-icon');
    expect(commonUnknown).toBeInTheDocument();
    expect(commonUnknown).toHaveAttribute('data-rare', 'false');
    expect(screen.queryByTestId('pebble-icon')).not.toBeInTheDocument();
    unmount();

    // レアアイテムの未受取: 金色背景（data-rare="true"）
    render(<GiftIcon giftId="old-coin" isAcquired={false} />);
    const rareUnknown = screen.getByTestId('unknown-gift-icon');
    expect(rareUnknown).toBeInTheDocument();
    expect(rareUnknown).toHaveAttribute('data-rare', 'true');
    expect(rareUnknown.querySelector('defs linearGradient#unknownRareGrad')).toBeInTheDocument();
    expect(screen.queryByTestId('old-coin-icon')).not.toBeInTheDocument();
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
      MossyPebbleIcon,
      OldStampIcon,
      HairpinIcon,
      WiltedFlowerIcon,
      CicadaShellIcon,
      WhiteDiceIcon,
      GlassMarbleIcon,
      DirtyPlushIcon,
      SingleSockIcon,
      SunflowerSeedIcon,
    ];

    for (const Comp of components) {
      const { container, unmount } = render(<Comp className="w-10 h-10" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      unmount();
    }
  });
});
