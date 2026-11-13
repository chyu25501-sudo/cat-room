import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GiftCollectionModal } from './GiftCollectionModal.tsx';
import { GiftInventory } from '../../types/gift.ts';

describe('GiftCollectionModal コンポーネント', () => {
  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(
      <GiftCollectionModal isOpen={false} onClose={vi.fn()} inventory={{}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('インベントリが空のとき、空状態の案内メッセージが表示され、タイルには 0 と表示されること', () => {
    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

    expect(screen.getByRole('dialog', { name: '猫からのおくりもの' })).toBeInTheDocument();
    expect(screen.getByTestId('gift-collection-empty')).toBeInTheDocument();
    expect(screen.getByText(/まだおくりものがありません/)).toBeInTheDocument();
    expect(screen.getByTestId('total-gift-count')).toHaveTextContent('0個');

    // 正方形タイルの右下に 0 と表示
    expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('0');
    expect(screen.getByTestId('gift-count-feather')).toHaveTextContent('0');
  });

  it('表（グリッド）形式で各おくりものが角丸正方形タイルとして並び、右下に個数が表示されること', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 3,
        byCat: { black: 2, white: 1 },
        firstReceivedAt: 1000,
        lastReceivedAt: 2000,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    // 表（グリッド）要素
    const grid = screen.getByTestId('gift-grid-table');
    expect(grid).toBeInTheDocument();

    // きれいな小石のタイル（角丸正方形、アイコン、右下の個数）
    const pebbleTile = screen.getByTestId('gift-tile-pebble');
    expect(pebbleTile).toHaveClass('aspect-square');
    expect(pebbleTile).toHaveClass('rounded-2xl');
    expect(within(pebbleTile).getByTestId('pebble-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('× 3');

    // 未受け取りの羽根のタイル
    const featherTile = screen.getByTestId('gift-tile-feather');
    expect(featherTile).toHaveClass('aspect-square');
    expect(within(featherTile).getByTestId('unknown-gift-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gift-count-feather')).toHaveTextContent('0');
  });

  it('正方形タイルをクリックすると、ウィンドウ下側の詳細パネルに説明文や猫別内訳が表示されること', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 3,
        byCat: { black: 2, white: 1 },
        firstReceivedAt: 1000,
        lastReceivedAt: 2000,
      },
      feather: {
        giftId: 'feather',
        count: 1,
        byCat: { calico: 1 },
        firstReceivedAt: 1500,
        lastReceivedAt: 1500,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    // 初期状態では先頭の「きれいな小石」が選択されている
    expect(screen.getByTestId('gift-detail-panel')).toBeInTheDocument();
    expect(screen.getByText('きれいな小石')).toBeInTheDocument();
    expect(screen.getByTestId('gift-detail-count-badge')).toHaveTextContent('所持数: 3個');
    expect(screen.getByTestId('gift-detail-description')).toHaveTextContent(
      'どこかで見つけてきた、つるつると丸くてきれいな小石。'
    );
    expect(screen.getByText('くろねこ: 2個')).toBeInTheDocument();
    expect(screen.getByText('しろねこ: 1個')).toBeInTheDocument();

    // ふわふわの羽根のタイルをクリック
    const featherTile = screen.getByTestId('gift-tile-feather');
    fireEvent.click(featherTile);

    // 下側の詳細パネルが「ふわふわの羽根」の内容に切り替わること
    expect(screen.getByText('ふわふわの羽根')).toBeInTheDocument();
    expect(screen.getByTestId('gift-detail-count-badge')).toHaveTextContent('所持数: 1個');
    expect(screen.getByTestId('gift-detail-description')).toHaveTextContent(
      '日向で見つけてくわえてきた、やわらかく軽やかな羽根。'
    );
    expect(screen.getByText('みけねこ: 1個')).toBeInTheDocument();
  });

  it('レアリティの高いおくりものは獲得済みだけでなく未入手状態でも「？」の背景が金色になり、レアだと識別できること', () => {
    // インベントリは空（すべて未入手）
    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

    // 通常アイテムの未入手タイル（feather: 初期非選択の通常アイテム）
    const featherTile = screen.getByTestId('gift-tile-feather');
    expect(featherTile.className).toContain('bg-stone-50');
    const featherUnknownIcon = within(featherTile).getByTestId('unknown-gift-icon');
    expect(featherUnknownIcon).toHaveAttribute('data-rare', 'false');

    // レアアイテムの未入手タイル（ふしぎな古銭、なないろの羽根、よつばのクローバー）
    const rareOldCoinTile = screen.getByTestId('gift-tile-old-coin');
    expect(rareOldCoinTile.className).toContain('from-amber-100');
    expect(rareOldCoinTile.className).toContain('border-amber-400');
    expect(within(rareOldCoinTile).getByTestId('rare-badge-old-coin')).toHaveTextContent('★');

    // 未入手レアの「？」アイコン自体も金色背景（data-rare="true"）
    const oldCoinUnknownIcon = within(rareOldCoinTile).getByTestId('unknown-gift-icon');
    expect(oldCoinUnknownIcon).toHaveAttribute('data-rare', 'true');

    // 未入手のレアタイルをクリックして下部詳細パネルを確認
    fireEvent.click(rareOldCoinTile);

    // 詳細パネルのアイコン枠も金色
    const detailIconBox = screen.getByTestId('gift-detail-icon-box');
    expect(detailIconBox.className).toContain('from-amber-100');
    expect(detailIconBox.className).toContain('border-amber-400');
    expect(within(detailIconBox).getByTestId('unknown-gift-icon')).toHaveAttribute('data-rare', 'true');

    // 詳細パネルにも未入手ながら★レアバッジが表示されること
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★ レア');
  });

  it('レアリティの高いおくりもの（ふしぎな古銭・なないろの羽根・よつばのクローバー）は、背景が白色ではなく金色になること', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 1,
        firstReceivedAt: 1000,
        lastReceivedAt: 1000,
      },
      'old-coin': {
        giftId: 'old-coin',
        count: 1,
        byCat: { black: 1 },
        firstReceivedAt: 1200,
        lastReceivedAt: 1200,
      },
      'four-leaf-clover': {
        giftId: 'four-leaf-clover',
        count: 1,
        byCat: { calico: 1 },
        firstReceivedAt: 1300,
        lastReceivedAt: 1300,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    const oldCoinTile = screen.getByTestId('gift-tile-old-coin');
    const fourLeafTile = screen.getByTestId('gift-tile-four-leaf-clover');
    const pebbleTile = screen.getByTestId('gift-tile-pebble');

    // 古銭をクリックして選択状態にする（小石は非選択状態になる）
    fireEvent.click(oldCoinTile);

    // 通常の小石のタイル背景は白色系
    expect(pebbleTile.className).toContain('bg-white');

    // レアのふしぎな古銭のタイル背景は金色系（amberグラデーション）
    expect(oldCoinTile.className).toContain('from-amber-200');
    expect(oldCoinTile.className).toContain('border-amber-500');

    // レアのよつばのクローバーも金色系
    expect(fourLeafTile.className).toContain('from-amber-200');

    // 詳細パネルのアイコン背景ボックスが金色であること
    const detailIconBox = screen.getByTestId('gift-detail-icon-box');
    expect(detailIconBox.className).toContain('from-amber-300');
    expect(detailIconBox.className).toContain('border-amber-500');

    // レアバッジが表示されること
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★ レア');
  });

  it('閉じるボタンやバックドロップのクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<GiftCollectionModal isOpen={true} onClose={handleClose} inventory={{}} />);

    const closeButton = screen.getByRole('button', { name: 'おくりもの一覧を閉じる' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId('gift-collection-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
