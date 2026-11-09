import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareSidebar } from './CareSidebar.tsx';
import { FOOD_ITEMS, TOY_ITEMS } from '../../utils/catCare.ts';

describe('CareSidebar コンポーネント (第6週: お世話サイドバー＆ごはん・おもちゃサブメニュー)', () => {
  it('お世話ボタンが表示され、クリックでサイドバーが開閉すること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} />);

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
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} />);

    const openButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
    fireEvent.click(openButton);

    const backdrop = screen.getByTestId('care-sidebar-backdrop');
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop);
    const sidebar = screen.getByRole('complementary', { name: 'お世話サイドバー' });
    expect(sidebar).toHaveClass('translate-x-full');
  });

  it('ごはんサブメニューをアコーディオン開閉できること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} isOpen={true} />);

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
    render(<CareSidebar currentCatName="しろねこ" onFeed={vi.fn()} onPlay={vi.fn()} isOpen={true} />);

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
        onPlay={vi.fn()}
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
    render(<CareSidebar currentCatName="くろねこ" onFeed={handleFeed} onPlay={vi.fn()} />);

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

    // 引き続き「あげる」ボタンが表示されていること
    expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toBeInTheDocument();
  });

  it('おもちゃサブメニューをアコーディオン開閉でき、3つのおもちゃが表示されること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} isOpen={true} />);

    // 初期状態でおもちゃサブメニューが展開されている
    expect(screen.getByTestId('toy-submenu')).toBeInTheDocument();

    // ねこじゃらし
    expect(screen.getByText('ねこじゃらし')).toBeInTheDocument();
    expect(screen.getByTestId('toy-badge-icon-teaser')).toHaveTextContent('🪶');
    expect(screen.getByText('ふわふわ羽根で狩猟本能刺激')).toBeInTheDocument();
    expect(screen.getByText('+16%')).toBeInTheDocument();

    // 毛糸ボール
    expect(screen.getByText('毛糸ボール')).toBeInTheDocument();
    expect(screen.getByTestId('toy-badge-icon-ball')).toHaveTextContent('🧶');
    expect(screen.getByText('コロコロ転がしてケリケリ')).toBeInTheDocument();
    expect(screen.getByText('+26%')).toBeInTheDocument();

    // レーザーポインター
    expect(screen.getByText('レーザーポインター')).toBeInTheDocument();
    expect(screen.getByTestId('toy-badge-icon-laser')).toHaveTextContent('🔴');
    expect(screen.getByText('すばやい光を俊敏に追跡')).toBeInTheDocument();
    expect(screen.getByText('+36%')).toBeInTheDocument();

    // おもちゃカテゴリボタンをクリックして折りたたむ
    const toyToggle = screen.getByRole('button', { name: /おもちゃであそぶ/i });
    fireEvent.click(toyToggle);
    expect(screen.queryByTestId('toy-submenu')).not.toBeInTheDocument();
  });

  it('おもちゃの「あそぶ」ボタンをクリックすると、選択したおもちゃを引数にonPlayが呼ばれ、サイドバーが閉じること', () => {
    const handlePlay = vi.fn();
    const handleToggleOpen = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={vi.fn()}
        onPlay={handlePlay}
        isOpen={true}
        onToggleOpen={handleToggleOpen}
      />
    );

    const playTeaserBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
    fireEvent.click(playTeaserBtn);

    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(TOY_ITEMS[0]); // teaser
    expect(handleToggleOpen).toHaveBeenCalledWith(false); // 即座に閉じる
  });

  it('猫がお食事中のとき、サイドバー内のごはん・おもちゃボタンがすべて非活性（disabled）になり選択できないこと', () => {
    const handleFeed = vi.fn();
    const handlePlay = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={handleFeed}
        onPlay={handlePlay}
        isOpen={true}
        isEating={true}
      />
    );

    // お食事中バナーが表示されていること
    expect(screen.getByTestId('care-busy-banner')).toHaveTextContent('くろねこがお食事中です♪');

    // ごはんボタンがdisabledになっていること
    const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
    expect(feedButtons).toHaveLength(3);
    for (const btn of feedButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('お食事中…');
      fireEvent.click(btn);
    }
    expect(handleFeed).not.toHaveBeenCalled();

    // おもちゃボタンもdisabledになっていること
    const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
    expect(playButtons).toHaveLength(3);
    for (const btn of playButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('お食事中…');
      fireEvent.click(btn);
    }
    expect(handlePlay).not.toHaveBeenCalled();
  });

  it('猫がおもちゃで遊び中のとき、サイドバー内のごはん・おもちゃボタンがすべて非活性（disabled）になり選択できないこと', () => {
    const handleFeed = vi.fn();
    const handlePlay = vi.fn();
    render(
      <CareSidebar
        currentCatName="しろねこ"
        onFeed={handleFeed}
        onPlay={handlePlay}
        isOpen={true}
        isPlayingToy={true}
      />
    );

    // あそび中バナーが表示されていること
    expect(screen.getByTestId('care-busy-banner')).toHaveTextContent('しろねこがおもちゃであそび中です♪');

    // ごはんボタンがdisabledになっていること
    const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
    for (const btn of feedButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('あそび中…');
      fireEvent.click(btn);
    }
    expect(handleFeed).not.toHaveBeenCalled();

    // おもちゃボタンもdisabledになっていること
    const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
    for (const btn of playButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('あそび中…');
      fireEvent.click(btn);
    }
    expect(handlePlay).not.toHaveBeenCalled();
  });
});
