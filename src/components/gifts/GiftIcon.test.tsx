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
  SnackWrapperIcon,
  SkewerIcon,
  IceStickIcon,
  ImportantPaperIcon,
  BlueCanIcon,
  EmptyBottleIcon,
  PinkHandkerchiefIcon,
  CandyWrapperIcon,
  BentoBaranIcon,
  SuperBallIcon,
  SmallBellIcon,
  RedGemIcon,
  BlueGemIcon,
  YellowGemIcon,
  WinningIceStickIcon,
  DragonScaleIcon,
  DragonClawIcon,
  StarFragmentIcon,
  AncientGearIcon,
  SplendidBranchIcon,
  CuriousMagatamaIcon,
  GlowingMossStoneIcon,
  BrokenRubberBandIcon,
  CrumpledAluminumIcon,
  CardboardScrapIcon,
  CatWhiskerIcon,
  TornReceiptIcon,
  HairballIcon,
  TwistedWireIcon,
  WitheredFoxtailIcon,
  DentedPingpongBallIcon,
  LizardTailIcon,
  SoftDandelionIcon,
  JellyCupIcon,
  PlasticBottleCapIcon,
  CicadaWingIcon,
  YarnScrapIcon,
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
      { id: 'snack-wrapper', testId: 'snack-wrapper-icon' },
      { id: 'skewer', testId: 'skewer-icon' },
      { id: 'ice-stick', testId: 'ice-stick-icon' },
      { id: 'important-paper', testId: 'important-paper-icon' },
      { id: 'blue-can', testId: 'blue-can-icon' },
      { id: 'empty-bottle', testId: 'empty-bottle-icon' },
      { id: 'pink-handkerchief', testId: 'pink-handkerchief-icon' },
      { id: 'candy-wrapper', testId: 'candy-wrapper-icon' },
      { id: 'bento-baran', testId: 'bento-baran-icon' },
      { id: 'super-ball', testId: 'super-ball-icon' },
      { id: 'small-bell', testId: 'small-bell-icon' },
      { id: 'red-gem', testId: 'red-gem-icon' },
      { id: 'blue-gem', testId: 'blue-gem-icon' },
      { id: 'yellow-gem', testId: 'yellow-gem-icon' },
      { id: 'winning-ice-stick', testId: 'winning-ice-stick-icon' },
      { id: 'dragon-scale', testId: 'dragon-scale-icon' },
      { id: 'dragon-claw', testId: 'dragon-claw-icon' },
      { id: 'star-fragment', testId: 'star-fragment-icon' },
      { id: 'ancient-gear', testId: 'ancient-gear-icon' },
      { id: 'splendid-branch', testId: 'splendid-branch-icon' },
      { id: 'curious-magatama', testId: 'curious-magatama-icon' },
      { id: 'glowing-moss-stone', testId: 'glowing-moss-stone-icon' },
      { id: 'broken-rubber-band', testId: 'broken-rubber-band-icon' },
      { id: 'crumpled-aluminum', testId: 'crumpled-aluminum-icon' },
      { id: 'cardboard-scrap', testId: 'cardboard-scrap-icon' },
      { id: 'cat-whisker', testId: 'cat-whisker-icon' },
      { id: 'torn-receipt', testId: 'torn-receipt-icon' },
      { id: 'hairball', testId: 'hairball-icon' },
      { id: 'twisted-wire', testId: 'twisted-wire-icon' },
      { id: 'withered-foxtail', testId: 'withered-foxtail-icon' },
      { id: 'dented-pingpong-ball', testId: 'dented-pingpong-ball-icon' },
      { id: 'lizard-tail', testId: 'lizard-tail-icon' },
      { id: 'soft-dandelion', testId: 'soft-dandelion-icon' },
      { id: 'jelly-cup', testId: 'jelly-cup-icon' },
      { id: 'plastic-bottle-cap', testId: 'plastic-bottle-cap-icon' },
      { id: 'cicada-wing', testId: 'cicada-wing-icon' },
      { id: 'yarn-scrap', testId: 'yarn-scrap-icon' },
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

    // 「だいじそうな紙」（レア）の未受取も金色背景になること
    const { unmount: unmountPaper } = render(<GiftIcon giftId="important-paper" isAcquired={false} />);
    const paperUnknown = screen.getAllByTestId('unknown-gift-icon')[1];
    expect(paperUnknown).toHaveAttribute('data-rare', 'true');
    unmountPaper();
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
      SnackWrapperIcon,
      SkewerIcon,
      IceStickIcon,
      ImportantPaperIcon,
      BlueCanIcon,
      EmptyBottleIcon,
      PinkHandkerchiefIcon,
      CandyWrapperIcon,
      BentoBaranIcon,
      SuperBallIcon,
      SmallBellIcon,
      RedGemIcon,
      BlueGemIcon,
      YellowGemIcon,
      WinningIceStickIcon,
      DragonScaleIcon,
      DragonClawIcon,
      StarFragmentIcon,
      AncientGearIcon,
      SplendidBranchIcon,
      CuriousMagatamaIcon,
      GlowingMossStoneIcon,
      BrokenRubberBandIcon,
      CrumpledAluminumIcon,
      CardboardScrapIcon,
      CatWhiskerIcon,
      TornReceiptIcon,
      HairballIcon,
      TwistedWireIcon,
      WitheredFoxtailIcon,
      DentedPingpongBallIcon,
      LizardTailIcon,
      SoftDandelionIcon,
      JellyCupIcon,
      PlasticBottleCapIcon,
      CicadaWingIcon,
      YarnScrapIcon,
    ];

    for (const Comp of components) {
      const { container, unmount } = render(<Comp className="w-10 h-10" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      unmount();
    }
  });
});
