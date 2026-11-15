import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AchievementToastOverlay } from './AchievementToastOverlay.tsx';
import { AchievementToast } from '../../types/achievement.ts';

describe('AchievementToastOverlay コンポーネント', () => {
  it('toasts が空のときは何もレンダリングされないこと', () => {
    const { container } = render(<AchievementToastOverlay toasts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('単一の実績トーストが画面上部に「実績を獲得！」メッセージとタイトル付きで表示されること', () => {
    const toasts: AchievementToast[] = [
      {
        id: 'first-pet',
        title: 'はじめまして！',
        description: '猫ちゃんを初めてなでなでしてふれあった。',
        timestamp: 1000,
      },
    ];

    render(<AchievementToastOverlay toasts={toasts} />);

    expect(screen.getByTestId('achievement-toast-container')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-toast-first-pet')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-toast-message')).toHaveTextContent('実績を獲得！');
    expect(screen.getByTestId('achievement-toast-title')).toHaveTextContent('はじめまして！');
    expect(screen.getByTestId('achievement-toast-description')).toHaveTextContent(
      '猫ちゃんを初めてなでなでしてふれあった。'
    );
  });

  it('複数の実績が同時に獲得された場合、縦に並べて複数表示されること', () => {
    const toasts: AchievementToast[] = [
      {
        id: 'first-feed',
        title: 'ごはんの時間',
        description: '猫ちゃんに初めてごはんを食べさせてあげた。',
        timestamp: 1000,
      },
      {
        id: 'mood-ecstatic',
        title: 'ゴロゴロごきげん',
        description: '猫ちゃんのごきげん度を最高（大よろこび）にした。',
        timestamp: 1000,
      },
    ];

    render(<AchievementToastOverlay toasts={toasts} />);

    const container = screen.getByTestId('achievement-toast-container');
    expect(container).toHaveClass('flex-col');

    expect(screen.getByTestId('achievement-toast-first-feed')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-toast-mood-ecstatic')).toBeInTheDocument();

    const titles = screen.getAllByTestId('achievement-toast-title');
    expect(titles).toHaveLength(2);
    expect(titles[0]).toHaveTextContent('ごはんの時間');
    expect(titles[1]).toHaveTextContent('ゴロゴロごきげん');
  });

  it('トーストをクリックすると onDismiss が呼ばれること', () => {
    const handleDismiss = vi.fn();
    const toasts: AchievementToast[] = [
      {
        id: 'first-pet',
        title: 'はじめまして！',
        description: '猫ちゃんを初めてなでなでしてふれあった。',
        timestamp: 1000,
      },
    ];

    render(<AchievementToastOverlay toasts={toasts} onDismiss={handleDismiss} />);

    const toast = screen.getByTestId('achievement-toast-first-pet');
    fireEvent.click(toast);
    expect(handleDismiss).toHaveBeenCalledWith('first-pet');
  });
});
