import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JournalModal } from './JournalModal.tsx';
import { CareStats } from '../../types/journal.ts';

describe('JournalModal コンポーネント', () => {
  const dummyStats: CareStats = {
    firstInteractionAt: new Date(2026, 10, 15).getTime(),
    lastInteractionAt: new Date(2026, 10, 17).getTime(),
    lastInteractionDateStr: '2026-11-17',
    totalPetCount: 25,
    totalFeedCount: 10,
    totalPlayCount: 8,
    currentStreakDays: 3,
    maxStreakDays: 5,
    totalActiveDays: 4,
    interactionsByCat: {
      black: 20,
      white: 15,
      calico: 8,
    },
  };

  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(
      <JournalModal isOpen={false} onClose={vi.fn()} stats={dummyStats} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、タイトルおよび各種統計情報が表示されること', () => {
    render(<JournalModal isOpen={true} onClose={vi.fn()} stats={dummyStats} />);

    expect(screen.getByRole('dialog', { name: /ふり返り手帳/ })).toBeInTheDocument();
    // 合計回数バッジ (25 + 10 + 8 = 43)
    expect(screen.getByTestId('journal-total-badge')).toHaveTextContent('計 43 回');

    // はじめてふれあった日
    expect(screen.getByTestId('journal-first-date')).toHaveTextContent('2026年11月15日');

    // 連続日数・合計日数
    expect(screen.getByTestId('journal-streak-days')).toHaveTextContent('3');
    expect(screen.getByTestId('journal-max-streak')).toHaveTextContent('最高: 5 日間');
    expect(screen.getByTestId('journal-total-days')).toHaveTextContent('4');

    // お世話内訳
    expect(screen.getByTestId('journal-pet-count')).toHaveTextContent('25 回');
    expect(screen.getByTestId('journal-feed-count')).toHaveTextContent('10 回');
    expect(screen.getByTestId('journal-play-count')).toHaveTextContent('8 回');

    // 猫別
    expect(screen.getByTestId('journal-cat-black')).toHaveTextContent('20 回');
    expect(screen.getByTestId('journal-cat-white')).toHaveTextContent('15 回');
    expect(screen.getByTestId('journal-cat-calico')).toHaveTextContent('8 回');
  });

  it('閉じるボタンやバックドロップクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<JournalModal isOpen={true} onClose={handleClose} stats={dummyStats} />);

    const closeButton = screen.getByRole('button', { name: 'ふり返り手帳を閉じる' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId('journal-modal-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
