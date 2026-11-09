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

  it('ごはんの3つの選択肢が表示され、それぞれのごきげん度上昇値が表示されていること', () => {
    render(<CareSidebar currentCatName="しろねこ" onFeed={vi.fn()} isOpen={true} />);

    expect(screen.getByText('カリカリ')).toBeInTheDocument();
    expect(screen.getByText('+18%')).toBeInTheDocument();

    expect(screen.getByText('ねこ缶（まぐろ）')).toBeInTheDocument();
    expect(screen.getByText('+28%')).toBeInTheDocument();

    expect(screen.getByText('おやつピューレ')).toBeInTheDocument();
    expect(screen.getByText('+38%')).toBeInTheDocument();
  });

  it('ごはんの「あげる」ボタンをクリックすると、選択したごはんアイテムを引数にonFeedが呼ばれること', () => {
    const handleFeed = vi.fn();
    render(<CareSidebar currentCatName="くろねこ" onFeed={handleFeed} isOpen={true} />);

    const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
    fireEvent.click(feedKibbleBtn);

    expect(handleFeed).toHaveBeenCalledTimes(1);
    expect(handleFeed).toHaveBeenCalledWith(FOOD_ITEMS[0]); // kibble

    const feedTreatBtn = screen.getByRole('button', { name: 'おやつピューレをあげる' });
    fireEvent.click(feedTreatBtn);

    expect(handleFeed).toHaveBeenCalledTimes(2);
    expect(handleFeed).toHaveBeenCalledWith(FOOD_ITEMS[2]); // treat
  });
});
