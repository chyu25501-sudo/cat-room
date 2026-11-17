import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfflineCareReportModal } from './OfflineCareReportModal.tsx';
import { CatOfflineFeedResult } from '../../utils/autoFeed.ts';
import { GiftItem } from '../../types/gift.ts';

describe('OfflineCareReportModal コンポーネント', () => {
  const dummyCatResults: Record<string, CatOfflineFeedResult> = {
    black: {
      catId: 'black',
      feedCount: 58,
      totalExpGained: 1450,
      previousExp: 0,
      nextExp: 250,
      finalFullness: 40,
      earnedGifts: [],
    },
    white: {
      catId: 'white',
      feedCount: 58,
      totalExpGained: 1450,
      previousExp: 0,
      nextExp: 250,
      finalFullness: 40,
      earnedGifts: [],
    },
    calico: {
      catId: 'calico',
      feedCount: 58,
      totalExpGained: 1450,
      previousExp: 0,
      nextExp: 250,
      finalFullness: 40,
      earnedGifts: [],
    },
  };

  const dummyGifts: Array<{ catId: 'black' | 'white' | 'calico'; gift: GiftItem }> = [
    {
      catId: 'black',
      gift: {
        id: 'pebble',
        name: 'きれいな小石',
        description: '小石',
        icon: '🪨',
        iconType: 'pebble',
        themeClass: '',
        rarity: 'common',
      },
    },
  ];

  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(
      <OfflineCareReportModal
        isOpen={false}
        onClose={vi.fn()}
        elapsedMs={3600000}
        catResults={dummyCatResults}
        allEarnedGifts={[]}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、タイトル、留守番時間、各猫の食事回数、ギフト一覧が表示されること', () => {
    render(
      <OfflineCareReportModal
        isOpen={true}
        onClose={vi.fn()}
        elapsedMs={24 * 60 * 60 * 1000}
        catResults={dummyCatResults}
        allEarnedGifts={dummyGifts}
      />
    );

    expect(screen.getByTestId('offline-care-report-modal')).toBeInTheDocument();
    expect(screen.getByText(/おかえりなさい！お留守番レポート/)).toBeInTheDocument();
    expect(screen.getByText(/1日と0時間のお留守番でした/)).toBeInTheDocument();
    expect(screen.getByText(/合計 174回/)).toBeInTheDocument();

    expect(screen.getByTestId('offline-cat-result-black')).toHaveTextContent('58回');
    expect(screen.getByTestId('offline-cat-result-white')).toHaveTextContent('58回');
    expect(screen.getByTestId('offline-cat-result-calico')).toHaveTextContent('58回');

    expect(screen.getByText(/もらったおくりもの（1個）/)).toBeInTheDocument();
    expect(screen.getByText('きれいな小石')).toBeInTheDocument();
  });

  it('「すべて受け取る」ボタンをクリックすると onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(
      <OfflineCareReportModal
        isOpen={true}
        onClose={handleClose}
        elapsedMs={3600000}
        catResults={dummyCatResults}
        allEarnedGifts={dummyGifts}
      />
    );

    const acceptButton = screen.getByTestId('offline-report-accept-button');
    fireEvent.click(acceptButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
