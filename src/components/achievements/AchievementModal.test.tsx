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
    expect(screen.getByTestId('achievement-rate-badge')).toHaveTextContent('2/60');

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

  it('カテゴリフィルターボタンが表示され、クリックで実績リストを絞り込めること（隠し実績はおくりものカテゴリに統合）', () => {
    render(<AchievementModal isOpen={true} onClose={vi.fn()} unlocked={{}} />);

    // フィルターバーの存在確認
    expect(screen.getByTestId('achievement-category-filter')).toBeInTheDocument();

    const allFilterBtn = screen.getByTestId('filter-category-all');
    const interactionFilterBtn = screen.getByTestId('filter-category-interaction');
    const careFilterBtn = screen.getByTestId('filter-category-care');
    const giftFilterBtn = screen.getByTestId('filter-category-gift');

    expect(allFilterBtn).toHaveTextContent('すべて (60)');
    expect(interactionFilterBtn).toHaveTextContent('ふれあい (20)');
    expect(careFilterBtn).toHaveTextContent('お世話 (14)');
    expect(giftFilterBtn).toHaveTextContent('おくりもの (26)');
    // 「隠し実績」独立ボタンは存在しない
    expect(screen.queryByTestId('filter-category-hidden')).not.toBeInTheDocument();

    // 初期状態（すべて）では「ふれあい」「お世話」「おくりもの（隠し実績含む）」のアイテムが存在する
    expect(screen.getByTestId('achievement-item-first-pet')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-first-feed')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-first-gift')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-hidden-pebble-set')).toBeInTheDocument();

    // 「お世話」をクリック
    fireEvent.click(careFilterBtn);

    // お世話の実績のみ表示され、ふれあいやおくりもの・隠し実績は非表示になる
    expect(screen.getByTestId('achievement-item-first-feed')).toBeInTheDocument();
    expect(screen.queryByTestId('achievement-item-first-pet')).not.toBeInTheDocument();
    expect(screen.queryByTestId('achievement-item-first-gift')).not.toBeInTheDocument();
    expect(screen.queryByTestId('achievement-item-hidden-pebble-set')).not.toBeInTheDocument();

    // 「おくりもの」をクリック（通常のおくりもの実績と隠し実績の両方が含まれる）
    fireEvent.click(giftFilterBtn);

    expect(screen.getByTestId('achievement-item-first-gift')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-hidden-pebble-set')).toBeInTheDocument();
    expect(screen.queryByTestId('achievement-item-first-feed')).not.toBeInTheDocument();
    expect(screen.queryByTestId('achievement-item-first-pet')).not.toBeInTheDocument();

    // 「すべて」をクリックして復帰
    fireEvent.click(allFilterBtn);
    expect(screen.getByTestId('achievement-item-first-pet')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-first-feed')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-first-gift')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-hidden-pebble-set')).toBeInTheDocument();
  });

  it('達成状況フィルター（すべて / 達成済み / 未達成）が表示され、達成状況で絞り込めること', () => {
    const unlocked: UnlockedAchievements = {
      'first-pet': { id: 'first-pet', unlockedAt: 1000 },
      'first-feed': { id: 'first-feed', unlockedAt: 2000 },
    };

    render(<AchievementModal isOpen={true} onClose={vi.fn()} unlocked={unlocked} />);

    // 達成状況フィルターバーの存在確認
    expect(screen.getByTestId('achievement-status-filter')).toBeInTheDocument();

    const allBtn = screen.getByTestId('filter-status-all');
    const unlockedBtn = screen.getByTestId('filter-status-unlocked');
    const lockedBtn = screen.getByTestId('filter-status-locked');

    expect(allBtn).toHaveTextContent('すべて (60)');
    expect(unlockedBtn).toHaveTextContent('達成済み (2)');
    expect(lockedBtn).toHaveTextContent('未達成 (58)');

    // 「達成済み」をクリック
    fireEvent.click(unlockedBtn);
    expect(unlockedBtn).toHaveAttribute('aria-pressed', 'true');

    // 達成済みの実績のみ表示
    expect(screen.getByTestId('achievement-item-first-pet')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-item-first-feed')).toBeInTheDocument();
    // 未達成の実績は非表示
    expect(screen.queryByTestId('achievement-item-first-play')).not.toBeInTheDocument();

    // 「未達成」をクリック
    fireEvent.click(lockedBtn);
    expect(lockedBtn).toHaveAttribute('aria-pressed', 'true');

    // 未達成の実績のみ表示
    expect(screen.getByTestId('achievement-item-first-play')).toBeInTheDocument();
    // 達成済みの実績は非表示
    expect(screen.queryByTestId('achievement-item-first-pet')).not.toBeInTheDocument();
    expect(screen.queryByTestId('achievement-item-first-feed')).not.toBeInTheDocument();
  });

  it('カテゴリ絞り込みと達成状況絞り込みを掛け合わせて利用できること', () => {
    const unlocked: UnlockedAchievements = {
      'first-pet': { id: 'first-pet', unlockedAt: 1000 }, // interaction
    };

    render(<AchievementModal isOpen={true} onClose={vi.fn()} unlocked={unlocked} />);

    // カテゴリ「お世話（care）」をクリック
    fireEvent.click(screen.getByTestId('filter-category-care'));
    // 達成状況「達成済み」をクリック（お世話カテゴリには達成済みがない）
    fireEvent.click(screen.getByTestId('filter-status-unlocked'));

    // 0件メッセージが表示されること
    expect(screen.getByTestId('achievement-filter-empty')).toHaveTextContent('条件に一致する実績はありません');

    // 達成状況を「未達成」に変更
    fireEvent.click(screen.getByTestId('filter-status-locked'));

    // お世話カテゴリの未達成実績（first-feed など）が表示されること
    expect(screen.getByTestId('achievement-item-first-feed')).toBeInTheDocument();
    // ふれあいカテゴリの実績（first-pet）は非表示
    expect(screen.queryByTestId('achievement-item-first-pet')).not.toBeInTheDocument();
  });

  it('カテゴリ選択に応じて、2段目の達成状況絞り込みの件数表示（すべて/達成済み/未達成）が動的に変化すること', () => {
    const unlocked: UnlockedAchievements = {
      'first-pet': { id: 'first-pet', unlockedAt: 1000 }, // interaction
      'first-feed': { id: 'first-feed', unlockedAt: 2000 }, // care
    };

    render(<AchievementModal isOpen={true} onClose={vi.fn()} unlocked={unlocked} />);

    const allBtn = screen.getByTestId('filter-status-all');
    const unlockedBtn = screen.getByTestId('filter-status-unlocked');
    const lockedBtn = screen.getByTestId('filter-status-locked');

    // 初期状態（最上段が「すべて」）
    expect(allBtn).toHaveTextContent('すべて (60)');
    expect(unlockedBtn).toHaveTextContent('達成済み (2)');
    expect(lockedBtn).toHaveTextContent('未達成 (58)');

    // 最上段で「ふれあい」カテゴリを選択（interactionは20件、うち達成1件、未達成19件）
    fireEvent.click(screen.getByTestId('filter-category-interaction'));
    expect(allBtn).toHaveTextContent('すべて (20)');
    expect(unlockedBtn).toHaveTextContent('達成済み (1)');
    expect(lockedBtn).toHaveTextContent('未達成 (19)');

    // 最上段で「お世話」カテゴリを選択（careは14件、うち達成1件、未達成13件）
    fireEvent.click(screen.getByTestId('filter-category-care'));
    expect(allBtn).toHaveTextContent('すべて (14)');
    expect(unlockedBtn).toHaveTextContent('達成済み (1)');
    expect(lockedBtn).toHaveTextContent('未達成 (13)');

    // 最上段で「おくりもの」カテゴリを選択（giftは26件、うち達成0件、未達成26件）
    fireEvent.click(screen.getByTestId('filter-category-gift'));
    expect(allBtn).toHaveTextContent('すべて (26)');
    expect(unlockedBtn).toHaveTextContent('達成済み (0)');
    expect(lockedBtn).toHaveTextContent('未達成 (26)');

    // 再び最上段で「すべて」を選択すると全体の件数に戻ること
    fireEvent.click(screen.getByTestId('filter-category-all'));
    expect(allBtn).toHaveTextContent('すべて (60)');
    expect(unlockedBtn).toHaveTextContent('達成済み (2)');
    expect(lockedBtn).toHaveTextContent('未達成 (58)');
  });

  it('達成済みの実績にはそれぞれの欄に達成日が表示され、未達成の実績には表示されないこと', () => {
    // 2026年11月16日
    const unlockedDate1 = new Date(2026, 10, 16, 10, 30, 0).getTime();
    // 2026年11月10日
    const unlockedDate2 = new Date(2026, 10, 10, 15, 0, 0).getTime();

    const unlocked: UnlockedAchievements = {
      'first-pet': { id: 'first-pet', unlockedAt: unlockedDate1 },
      'first-feed': { id: 'first-feed', unlockedAt: unlockedDate2 },
    };

    render(<AchievementModal isOpen={true} onClose={vi.fn()} unlocked={unlocked} />);

    // 達成済みの first-pet に達成日が表示されていること
    const datePet = screen.getByTestId('achievement-date-first-pet');
    expect(datePet).toBeInTheDocument();
    expect(datePet).toHaveTextContent('達成日: 2026年11月16日');

    // 達成済みの first-feed に達成日が表示されていること
    const dateFeed = screen.getByTestId('achievement-date-first-feed');
    expect(dateFeed).toBeInTheDocument();
    expect(dateFeed).toHaveTextContent('達成日: 2026年11月10日');

    // 未達成の first-play には達成日が表示されないこと
    expect(screen.queryByTestId('achievement-date-first-play')).not.toBeInTheDocument();
  });
});
