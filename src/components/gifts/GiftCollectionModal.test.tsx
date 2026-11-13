import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByTestId('gift-tile-icon-pebble')).toHaveTextContent('🪨');
    expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('× 3');

    // 未受け取りの羽根のタイル
    const featherTile = screen.getByTestId('gift-tile-feather');
    expect(featherTile).toHaveClass('aspect-square');
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
