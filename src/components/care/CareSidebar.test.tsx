import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareSidebar } from './CareSidebar.tsx';
import { FOOD_ITEMS } from '../../utils/catCare.ts';

describe('CareSidebar コンポーネント (第6週: お世話サイドバー＆ごはんサブメニュー)', () => {
  it('お世話ボタンが表示され、クリックでサイドバーが開閉すること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} />);

    const openButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
    expect(openButton).toBeInTheDocument();

    const sidebar = screen.getByRole('complementary', { name: 'お世話サイドバー' });
    expect(sidebar).toHaveClass('translate-x-full');

    // 開く
    fireEvent.click(openButton);
    expect(sidebar).toHaveClass('translate-x-0');

    // 閉じるボタンで閉じる
    const closeButton = screen.getByRole('button', { name: 'お世話メニューを閉じる' });
    fireEvent.click(closeButton);
    expect(sidebar).toHaveClass('translate-x-full');
  });

  it('背景オーバーレイをクリックするとサイドバーが閉じること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} />);

    const openButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
    fireEvent.click(openButton);

    const backdrop = screen.getByTestId('care-sidebar-backdrop');
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop);
    const sidebar = screen.getByRole('complementary', { name: 'お世話サイドバー' });
    expect(sidebar).toHaveClass('translate-x-full');
  });

  it('ごはんサブメニューをアコーディオン開閉できること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} isOpen={true} />);

    // 初期状態では展開されている
    expect(screen.getByTestId('food-submenu')).toBeInTheDocument();

    // ごはんカテゴリボタンをクリックして折りたたむ
    const categoryToggle = screen.getByRole('button', { name: /ごはんをあげる/i });
    fireEvent.click(categoryToggle);

    expect(screen.queryByTestId('food-submenu')).not.toBeInTheDocument();

    // 再度クリックして展開する
    fireEvent.click(categoryToggle);
    expect(screen.getByTestId('food-submenu')).toBeInTheDocument();
  });

  it('ごはんの3つの選択肢が表示され、左側にアイコンバッジと説明文、ごきげん度上昇値が表示されていること', () => {
    render(<CareSidebar currentCatName="しろねこ" onFeed={vi.fn()} isOpen={true} />);

    // カリカリ
    expect(screen.getByText('カリカリ')).toBeInTheDocument();
    expect(screen.getByTestId('food-badge-icon-kibble')).toHaveTextContent('🥣');
    expect(screen.queryByTestId('food-name-icon-kibble')).not.toBeInTheDocument();
    expect(screen.getByText('定番の総合栄養食')).toBeInTheDocument();
    expect(screen.getByText('+18%')).toBeInTheDocument();

    // ねこ缶
    expect(screen.getByText('ねこ缶（まぐろ）')).toBeInTheDocument();
    expect(screen.getByTestId('food-badge-icon-canned')).toHaveTextContent('🐟');
    expect(screen.queryByTestId('food-name-icon-canned')).not.toBeInTheDocument();
    expect(screen.getByText('ジューシーなごちそう')).toBeInTheDocument();
    expect(screen.getByText('+28%')).toBeInTheDocument();

    // おやつピューレ
    expect(screen.getByText('おやつピューレ')).toBeInTheDocument();
    expect(screen.getByTestId('food-badge-icon-treat')).toHaveTextContent('🍦');
    expect(screen.queryByTestId('food-name-icon-treat')).not.toBeInTheDocument();
    expect(screen.getByText('大好物のとろとろおやつ')).toBeInTheDocument();
    expect(screen.getByText('+38%')).toBeInTheDocument();
  });

  it('ごはんの「あげる」ボタンをクリックすると、選択したごはんアイテムを引数にonFeedが呼ばれ、サイドバーが閉じること', () => {
    const handleFeed = vi.fn();
    const handleToggleOpen = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={handleFeed}
        isOpen={true}
        onToggleOpen={handleToggleOpen}
      />
    );

    const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
    fireEvent.click(feedKibbleBtn);

    expect(handleFeed).toHaveBeenCalledTimes(1);
    expect(handleFeed).toHaveBeenCalledWith(FOOD_ITEMS[0]); // kibble
    expect(handleToggleOpen).toHaveBeenCalledWith(false); // 即座に閉じる
  });

  it('内部ステート運用時もごはんをあげるとサイドバーが自動的に閉じること', () => {
    const handleFeed = vi.fn();
    render(<CareSidebar currentCatName="くろねこ" onFeed={handleFeed} />);

    // 開く
    const openButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
    fireEvent.click(openButton);

    const sidebar = screen.getByRole('complementary', { name: 'お世話サイドバー' });
    expect(sidebar).toHaveClass('translate-x-0');

    // ごはんをあげる
    const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
    fireEvent.click(feedKibbleBtn);

    // 即座に閉じる
    expect(sidebar).toHaveClass('translate-x-full');

    // 再度サイドバーを開く
    fireEvent.click(openButton);
    expect(sidebar).toHaveClass('translate-x-0');

    // 「もぐもぐ中」は表示されず、引き続き「あげる」ボタンが表示されていること
    expect(screen.queryByText(/もぐもぐ中/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toBeInTheDocument();
  });
});
