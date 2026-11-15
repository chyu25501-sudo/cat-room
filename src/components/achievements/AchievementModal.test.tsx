import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AchievementModal } from './AchievementModal.tsx';
import { UnlockedAchievements } from '../../types/achievement.ts';

describe('AchievementModal コンポーネント', () => {
  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(
      <AchievementModal isOpen={false} onClose={vi.fn()} unlocked={{}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、タイトル、達成率バッジ、実績リストが表示されること', () => {
    const unlocked: UnlockedAchievements = {
      'first-pet': { id: 'first-pet', unlockedAt: 1000 },
      'first-feed': { id: 'first-feed', unlockedAt: 2000 },
    };

    render(<AchievementModal isOpen={true} onClose={vi.fn()} unlocked={unlocked} />);

    expect(screen.getByRole('dialog', { name: /実績/ })).toBeInTheDocument();
    expect(screen.getByTestId('achievement-rate-badge')).toHaveTextContent('2/5');

    // 達成済み実績: 「達成！」バッジが表示され、名前と説明文が表示されていること
    expect(screen.getByTestId('achievement-title-first-pet')).toHaveTextContent('はじめまして！');
    expect(screen.getByTestId('achievement-desc-first-pet')).toHaveTextContent(
      '猫ちゃんを初めてなでなでしてふれあった。'
    );
    expect(screen.getByTestId('achievement-badge-first-pet')).toHaveTextContent('達成！');

    expect(screen.getByTestId('achievement-title-first-feed')).toHaveTextContent('ごはんの時間');
    expect(screen.getByTestId('achievement-desc-first-feed')).toHaveTextContent(
      '猫ちゃんに初めてごはんを食べさせてあげた。'
    );
    expect(screen.getByTestId('achievement-badge-first-feed')).toHaveTextContent('達成！');

    // 未達成の通常実績: 名前は伏せ字（「？？？」）、獲得条件は表示され「未達成」バッジが表示されていること
    expect(screen.getByTestId('achievement-title-first-play')).toHaveTextContent('？？？');
    expect(screen.getByTestId('achievement-desc-first-play')).toHaveTextContent(
      '猫ちゃんと初めておもちゃを使って遊んだ。'
    );
    expect(screen.getByTestId('achievement-badge-first-play')).toHaveTextContent('未達成');
  });

  it('隠し実績が設定されている場合、獲得前は名前と獲得条件の両方が伏せられ、獲得後は開示されること', () => {
    const customCatalog = [
      {
        id: 'hidden-sample',
        title: 'ひみつの大発見',
        description: '秘密の条件を満たして猫と大冒険した。',
        iconType: 'sparkle',
        isHidden: true,
      },
      {
        id: 'normal-sample',
        title: '通常の実績',
        description: '通常の獲得条件です。',
        iconType: 'paw',
        isHidden: false,
      },
    ];

    // 1. 未達成の場合
    const { rerender } = render(
      <AchievementModal
        isOpen={true}
        onClose={vi.fn()}
        unlocked={{}}
        catalog={customCatalog}
      />
    );

    // 隠し実績は名前・条件ともに伏せ字（枠と未達成バッジのみ確認できる）
    expect(screen.getByTestId('achievement-title-hidden-sample')).toHaveTextContent('？？？');
    expect(screen.getByTestId('achievement-desc-hidden-sample')).toHaveTextContent('？？？？？？');
    expect(screen.getByTestId('achievement-badge-hidden-sample')).toHaveTextContent('未達成');

    // 通常実績は名前のみ伏せ字、条件は表示
    expect(screen.getByTestId('achievement-title-normal-sample')).toHaveTextContent('？？？');
    expect(screen.getByTestId('achievement-desc-normal-sample')).toHaveTextContent(
      '通常の獲得条件です。'
    );
    expect(screen.getByTestId('achievement-badge-normal-sample')).toHaveTextContent('未達成');

    // 2. 隠し実績を獲得した場合
    rerender(
      <AchievementModal
        isOpen={true}
        onClose={vi.fn()}
        unlocked={{
          'hidden-sample': { id: 'hidden-sample', unlockedAt: 5000 },
        }}
        catalog={customCatalog}
      />
    );

    // 獲得後は名前・獲得条件ともに本来の内容が開示され、「達成！」バッジになる
    expect(screen.getByTestId('achievement-title-hidden-sample')).toHaveTextContent('ひみつの大発見');
    expect(screen.getByTestId('achievement-desc-hidden-sample')).toHaveTextContent(
      '秘密の条件を満たして猫と大冒険した。'
    );
    expect(screen.getByTestId('achievement-badge-hidden-sample')).toHaveTextContent('達成！');
  });

  it('閉じるボタンやバックドロップクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<AchievementModal isOpen={true} onClose={handleClose} unlocked={{}} />);

    const closeButton = screen.getByRole('button', { name: '実績を閉じる' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId('achievement-modal-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
