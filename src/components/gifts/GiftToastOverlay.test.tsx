import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GiftToastOverlay, GiftToastItem } from './GiftToastOverlay.tsx';

describe('GiftToastOverlay コンポーネント', () => {
  it('toasts が空配列のときは何もレンダリングされないこと', () => {
    const { container } = render(<GiftToastOverlay toasts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('ギフトトーストが正しくレンダリングされ、猫の名前やおくりもの名が表示されること', () => {
    const toasts: GiftToastItem[] = [
      {
        id: 'toast-1',
        catId: 'black',
        catName: 'くろねこ',
        gift: {
          id: 'pebble',
          name: 'きれいな小石',
          description: '丸くてすべすべした小石。',
          icon: '🪨',
          iconType: 'pebble',
          themeClass: '',
          rarity: 'common',
        },
      },
    ];

    render(<GiftToastOverlay toasts={toasts} />);

    expect(screen.getByTestId('gift-toast-container')).toBeInTheDocument();
    expect(screen.getByTestId('gift-toast-toast-1')).toBeInTheDocument();
    expect(screen.getByText(/くろねこからのおくりもの！/)).toBeInTheDocument();
    expect(screen.getByText(/きれいな小石 を受け取りました！/)).toBeInTheDocument();
  });

  it('トーストをクリックすると onDismiss が呼ばれること', () => {
    const handleDismiss = vi.fn();
    const toasts: GiftToastItem[] = [
      {
        id: 'toast-1',
        catId: 'white',
        catName: 'しろねこ',
        gift: {
          id: 'old-coin',
          name: '古めかしいコイン',
          description: 'どこか懐かしいコイン。',
          icon: '🪙',
          iconType: 'coin',
          themeClass: '',
          rarity: 'rare',
        },
      },
    ];

    render(<GiftToastOverlay toasts={toasts} onDismiss={handleDismiss} />);

    const toastElement = screen.getByTestId('gift-toast-toast-1');
    fireEvent.click(toastElement);
    expect(handleDismiss).toHaveBeenCalledWith('toast-1');
  });
});
