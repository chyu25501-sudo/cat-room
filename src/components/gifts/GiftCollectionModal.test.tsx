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

  it('インベントリが空のとき、空状態の案内メッセージが表示されること', () => {
    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

    expect(screen.getByRole('dialog', { name: '猫からのおくりもの' })).toBeInTheDocument();
    expect(screen.getByTestId('gift-collection-empty')).toBeInTheDocument();
    expect(screen.getByText('まだおくりものがありません')).toBeInTheDocument();
    expect(screen.getByTestId('total-gift-count')).toHaveTextContent('0個');
  });

  it('受け取ったおくりものがあるとき、各アイテムの名前・アイコン・個数が一覧表示されること', () => {
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

    expect(screen.getByTestId('total-gift-count')).toHaveTextContent('3個');

    // きれいな小石の情報
    expect(screen.getByText('きれいな小石')).toBeInTheDocument();
    expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('× 3');
    expect(screen.getByText('くろねこ: 2個')).toBeInTheDocument();
    expect(screen.getByText('しろねこ: 1個')).toBeInTheDocument();

    // 未受け取りの羽根
    expect(screen.getByTestId('gift-count-feather')).toHaveTextContent('未受取');
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
