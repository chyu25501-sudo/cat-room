import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareSidebar } from './CareSidebar.tsx';
import { FOOD_ITEMS, TOY_ITEMS } from '../../utils/catCare.ts';

describe('CareSidebar コンポーネント (第6週: お世話サイドバー＆ごはん・おもちゃサブメニュー)', () => {
  it('お世話ボタンが表示され、クリックでサイドバーが開閉すること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} />);

    const openButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
    expect(openButton).toBeInTheDocument();

    // 初期状態ではモーダルは非表示
    expect(screen.queryByRole('dialog', { name: /お世話メニュー/ })).not.toBeInTheDocument();

    // 開く
    fireEvent.click(openButton);
    expect(screen.getByRole('dialog', { name: /お世話メニュー/ })).toBeInTheDocument();

    // 閉じるボタンで閉じる
    const closeButton = screen.getByRole('button', { name: 'お世話メニューを閉じる' });
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog', { name: /お世話メニュー/ })).not.toBeInTheDocument();
  });

  it('背景オーバーレイをクリックするとサイドバーが閉じること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} />);

    const openButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
    fireEvent.click(openButton);

    const backdrop = screen.getByTestId('care-modal-backdrop');
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop);
    expect(screen.queryByRole('dialog', { name: /お世話メニュー/ })).not.toBeInTheDocument();
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
    expect(within(screen.getByTestId('food-badge-icon-kibble')).getByTestId('food-icon-kibble')).toBeInTheDocument();
    expect(screen.queryByTestId('food-name-icon-kibble')).not.toBeInTheDocument();
    expect(screen.getByText('定番の総合栄養食')).toBeInTheDocument();
    expect(screen.getByText('+18%')).toBeInTheDocument();
    expect(screen.getByTestId('food-fullness-boost-kibble')).toHaveTextContent('+25%');

    // ねこ缶
    expect(screen.getByText('ねこ缶（まぐろ）')).toBeInTheDocument();
    expect(within(screen.getByTestId('food-badge-icon-canned')).getByTestId('food-icon-canned')).toBeInTheDocument();
    expect(screen.queryByTestId('food-name-icon-canned')).not.toBeInTheDocument();
    expect(screen.getByText('ジューシーなごちそう')).toBeInTheDocument();
    expect(screen.getByText('+28%')).toBeInTheDocument();
    expect(screen.getByTestId('food-fullness-boost-canned')).toHaveTextContent('+35%');

    // おやつピューレ
    expect(screen.getByText('おやつピューレ')).toBeInTheDocument();
    expect(within(screen.getByTestId('food-badge-icon-treat')).getByTestId('food-icon-treat')).toBeInTheDocument();
    expect(screen.queryByTestId('food-name-icon-treat')).not.toBeInTheDocument();
    expect(screen.getByText('大好物のとろとろおやつ')).toBeInTheDocument();
    expect(screen.getByText('+38%')).toBeInTheDocument();
    expect(screen.getByTestId('food-fullness-boost-treat')).toHaveTextContent('+15%');
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

    expect(screen.getByRole('dialog', { name: /お世話メニュー/ })).toBeInTheDocument();

    // ごはんをあげる
    const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
    fireEvent.click(feedKibbleBtn);

    // 即座に閉じる
    expect(screen.queryByRole('dialog', { name: /お世話メニュー/ })).not.toBeInTheDocument();

    // 再度サイドバーを開く
    fireEvent.click(openButton);
    expect(screen.getByRole('dialog', { name: /お世話メニュー/ })).toBeInTheDocument();

    // 引き続き「あげる」ボタンが表示されていること
    expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toBeInTheDocument();
  });

  it('おもちゃサブメニューをアコーディオン開閉でき、3つのおもちゃが表示されること', () => {
    render(<CareSidebar currentCatName="くろねこ" onFeed={vi.fn()} onPlay={vi.fn()} isOpen={true} />);

    // 初期状態でおもちゃサブメニューが展開されている
    expect(screen.getByTestId('toy-submenu')).toBeInTheDocument();

    // ねこじゃらし
    expect(screen.getByText('ねこじゃらし')).toBeInTheDocument();
    expect(within(screen.getByTestId('toy-badge-icon-teaser')).getByTestId('toy-icon-teaser')).toBeInTheDocument();
    expect(screen.getByText('ふわふわ羽根で狩猟本能刺激')).toBeInTheDocument();
    expect(screen.getByText('+16%')).toBeInTheDocument();

    // 毛糸ボール
    expect(screen.getByText('毛糸ボール')).toBeInTheDocument();
    expect(within(screen.getByTestId('toy-badge-icon-ball')).getByTestId('toy-icon-ball')).toBeInTheDocument();
    expect(screen.getByText('コロコロ転がしてケリケリ')).toBeInTheDocument();
    expect(screen.getByText('+26%')).toBeInTheDocument();

    // レーザーポインター
    expect(screen.getByText('レーザーポインター')).toBeInTheDocument();
    expect(within(screen.getByTestId('toy-badge-icon-laser')).getByTestId('toy-icon-laser')).toBeInTheDocument();
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

  it('まんぷく度が90%以上のとき、「まんぷくで食べられない！」と表示され、ごはんボタンがdisabledになりごはんをあげられないこと', () => {
    const handleFeed = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={handleFeed}
        onPlay={vi.fn()}
        isOpen={true}
        currentFullnessScore={90}
      />
    );

    // バナーが表示されていること
    expect(screen.getByTestId('feed-disabled-banner')).toHaveTextContent('まんぷくで食べられない！');

    // 全てのごはんボタンが disabled であり、「まんぷくで食べられない！」と表示されていること
    const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
    expect(feedButtons).toHaveLength(3);
    for (const btn of feedButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('まんぷくで食べられない！');
      fireEvent.click(btn);
    }
    expect(handleFeed).not.toHaveBeenCalled();

    // おもちゃボタンは有効であること
    const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
    for (const btn of playButtons) {
      expect(btn).toBeEnabled();
    }
  });

  it('まんぷく度が10%以下のとき、「お腹が空いて遊べない！」と表示され、おもちゃボタンがdisabledになりおもちゃで遊べないこと', () => {
    const handlePlay = vi.fn();
    render(
      <CareSidebar
        currentCatName="しろねこ"
        onFeed={vi.fn()}
        onPlay={handlePlay}
        isOpen={true}
        currentFullnessScore={10}
      />
    );

    // バナーが表示されていること
    expect(screen.getByTestId('play-disabled-banner')).toHaveTextContent('お腹が空いて遊べない！');

    // 全てのおもちゃボタンが disabled であり、「お腹が空いて遊べない！」と表示されていること
    const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
    expect(playButtons).toHaveLength(3);
    for (const btn of playButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('お腹が空いて遊べない！');
      fireEvent.click(btn);
    }
    expect(handlePlay).not.toHaveBeenCalled();

    // ごはんボタンは有効であること
    const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
    for (const btn of feedButtons) {
      expect(btn).toBeEnabled();
    }
  });

  it('初期状態（なつき度1）のとき、カリカリは最初から解禁され、その他のアイテムは「なつき度nで解禁されるよ！」と明記されること', () => {
    const handleFeed = vi.fn();
    const handlePlay = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={handleFeed}
        onPlay={handlePlay}
        isOpen={true}
        currentAffectionLevel={1}
      />
    );

    // ごはん・おもちゃの名前は全て表示されていること
    expect(screen.getByText('カリカリ')).toBeInTheDocument();
    expect(screen.getByText('ねこ缶（まぐろ）')).toBeInTheDocument();
    expect(screen.getByText('おやつピューレ')).toBeInTheDocument();
    expect(screen.getByText('ねこじゃらし')).toBeInTheDocument();
    expect(screen.getByText('毛糸ボール')).toBeInTheDocument();
    expect(screen.getByText('レーザーポインター')).toBeInTheDocument();

    // カリカリはLv.1（最初）から解禁されていること
    const kibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
    expect(kibbleBtn).toBeEnabled();
    fireEvent.click(kibbleBtn);
    expect(handleFeed).toHaveBeenCalledWith(FOOD_ITEMS[0]);
    expect(screen.queryByTestId('food-locked-button-kibble')).not.toBeInTheDocument();

    // 他の未解禁アイテムには「なつき度nで解禁されるよ！」と明記された非活性ボタンが表示されること
    const cannedBtn = screen.getByTestId('food-locked-button-canned');
    expect(cannedBtn).toBeDisabled();
    expect(cannedBtn).toHaveTextContent('なつき度4で解禁されるよ！');

    const treatBtn = screen.getByTestId('food-locked-button-treat');
    expect(treatBtn).toBeDisabled();
    expect(treatBtn).toHaveTextContent('なつき度6で解禁されるよ！');

    const teaserBtn = screen.getByTestId('toy-locked-button-teaser');
    expect(teaserBtn).toBeDisabled();
    expect(teaserBtn).toHaveTextContent('なつき度3で解禁されるよ！');
    fireEvent.click(teaserBtn);
    expect(handlePlay).not.toHaveBeenCalled();

    const ballBtn = screen.getByTestId('toy-locked-button-ball');
    expect(ballBtn).toBeDisabled();
    expect(ballBtn).toHaveTextContent('なつき度5で解禁されるよ！');

    const laserBtn = screen.getByTestId('toy-locked-button-laser');
    expect(laserBtn).toBeDisabled();
    expect(laserBtn).toHaveTextContent('なつき度7で解禁されるよ！');

    // 未解禁のおもちゃの有効ボタンは存在しないこと
    expect(screen.queryByRole('button', { name: 'ねこじゃらしであそぶ' })).not.toBeInTheDocument();
  });

  it('なつき度に応じて対象アイテムのみ順次解禁されること（例: なつき度3でカリカリとねこじゃらしが解禁）', () => {
    const handleFeed = vi.fn();
    const handlePlay = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={handleFeed}
        onPlay={handlePlay}
        isOpen={true}
        currentAffectionLevel={3}
      />
    );

    // カリカリ (Lv.2) -> 解禁
    const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
    expect(feedKibbleBtn).toBeEnabled();
    fireEvent.click(feedKibbleBtn);
    expect(handleFeed).toHaveBeenCalledWith(FOOD_ITEMS[0]);

    // ねこじゃらし (Lv.3) -> 解禁
    const playTeaserBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
    expect(playTeaserBtn).toBeEnabled();
    fireEvent.click(playTeaserBtn);
    expect(handlePlay).toHaveBeenCalledWith(TOY_ITEMS[0]);

    // ねこ缶 (Lv.4) -> まだ未解禁
    expect(screen.getByTestId('food-locked-button-canned')).toHaveTextContent('なつき度4で解禁されるよ！');
    // 毛糸ボール (Lv.5) -> まだ未解禁
    expect(screen.getByTestId('toy-locked-button-ball')).toHaveTextContent('なつき度5で解禁されるよ！');
  });

  it('isAutoFeedEnabled が true のとき、自動ごはんバナーが表示され、ごはんボタンが無効化されて手動給餌が制限されること', () => {
    const handleFeed = vi.fn();
    render(
      <CareSidebar
        currentCatName="くろねこ"
        onFeed={handleFeed}
        onPlay={vi.fn()}
        isOpen={true}
        isAutoFeedEnabled={true}
      />
    );

    // 自動ごはん稼働中バナーが表示されていること
    expect(screen.getByTestId('auto-feed-active-banner')).toBeInTheDocument();
    expect(screen.getByText(/自動ごはんが稼働中です/)).toBeInTheDocument();

    // ごはんボタンが無効化され、「自動ごはん稼働中」と表示されていること
    const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
    for (const btn of feedButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('自動ごはん稼働中');
      fireEvent.click(btn);
    }
    expect(handleFeed).not.toHaveBeenCalled();

    // おもちゃボタンは通常通り遊べること
    const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
    expect(playButtons[0]).toBeEnabled();
  });

  describe('タブ切り替え（「ふれあい」と「自動化」）および自動ごはん設定', () => {
    it('デフォルトで「ふれあい」タブが選択され、手動ごはん・おもちゃが表示されること', () => {
      render(
        <CareSidebar
          currentCatName="くろねこ"
          onFeed={vi.fn()}
          onPlay={vi.fn()}
          isOpen={true}
        />
      );

      // タブボタンが存在し、初期状態では「ふれあい」タブが選択されていること
      const interactionTab = screen.getByTestId('care-tab-interaction');
      const automationTab = screen.getByTestId('care-tab-automation');
      expect(interactionTab).toHaveAttribute('aria-selected', 'true');
      expect(automationTab).toHaveAttribute('aria-selected', 'false');

      // ふれあいタブパネルが表示されていること
      expect(screen.getByTestId('care-tabpanel-interaction')).toBeInTheDocument();
      expect(screen.getByText('ごはんをあげる')).toBeInTheDocument();
      expect(screen.getByText('おもちゃであそぶ')).toBeInTheDocument();

      // 自動化タブパネルは非表示であること
      expect(screen.queryByTestId('care-tabpanel-automation')).not.toBeInTheDocument();
    });

    it('「自動化」タブをクリックすると自動化タブに切り替わり、自動ごはん設定と注意書きが表示されること', () => {
      const handleToggle = vi.fn();
      render(
        <CareSidebar
          currentCatName="くろねこ"
          onFeed={vi.fn()}
          onPlay={vi.fn()}
          isOpen={true}
          isAutoFeedUnlocked={true}
          isAutoFeedEnabled={false}
          onToggleAutoFeed={handleToggle}
        />
      );

      // 「自動化」タブをクリック
      const automationTab = screen.getByTestId('care-tab-automation');
      fireEvent.click(automationTab);

      expect(automationTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('care-tab-interaction')).toHaveAttribute('aria-selected', 'false');

      // 自動化タブパネルと設定カードが表示されていること
      expect(screen.getByTestId('care-tabpanel-automation')).toBeInTheDocument();
      const section = screen.getByTestId('care-auto-feed-section');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('解禁済み')).toBeInTheDocument();
      expect(screen.getByText(/自動ごはんは現在オフです/)).toBeInTheDocument();

      // 注意書きが表示されていること（赤文字警告）
      const warning = screen.getByTestId('care-auto-feed-warning');
      expect(warning).toBeInTheDocument();
      expect(warning).toHaveTextContent('日付系の実績');

      // トグルスイッチをクリックするとコールバックが呼ばれること
      const toggleBtn = screen.getByTestId('care-auto-feed-toggle-button');
      expect(toggleBtn).toBeEnabled();
      expect(toggleBtn).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(toggleBtn);
      expect(handleToggle).toHaveBeenCalledWith(true);

      // 「ふれあい」タブを再度クリックするとふれあいタブに戻ること
      const interactionTab = screen.getByTestId('care-tab-interaction');
      fireEvent.click(interactionTab);
      expect(screen.getByTestId('care-tabpanel-interaction')).toBeInTheDocument();
      expect(screen.queryByTestId('care-tabpanel-automation')).not.toBeInTheDocument();
    });

    it('自動ごはんがオンのとき、トグルスイッチが aria-checked=true となり、クリックでオフにできること', () => {
      const handleToggle = vi.fn();
      render(
        <CareSidebar
          currentCatName="くろねこ"
          onFeed={vi.fn()}
          onPlay={vi.fn()}
          isOpen={true}
          isAutoFeedUnlocked={true}
          isAutoFeedEnabled={true}
          onToggleAutoFeed={handleToggle}
          defaultTab="automation"
        />
      );

      const toggleBtn = screen.getByTestId('care-auto-feed-toggle-button');
      expect(toggleBtn).toHaveAttribute('aria-checked', 'true');
      expect(
        screen.getByText(/全猫のまんぷく度が40%以下になると自動でカリカリを食べます/)
      ).toBeInTheDocument();

      fireEvent.click(toggleBtn);
      expect(handleToggle).toHaveBeenCalledWith(false);
    });

    it('自動ごはんがオンのとき、「自動化」タブに稼働中ドットが表示されること', () => {
      render(
        <CareSidebar
          currentCatName="くろねこ"
          onFeed={vi.fn()}
          onPlay={vi.fn()}
          isOpen={true}
          isAutoFeedUnlocked={true}
          isAutoFeedEnabled={true}
        />
      );

      expect(screen.getByTestId('auto-feed-active-dot')).toBeInTheDocument();
    });

    it('未解禁（isAutoFeedUnlocked=false）のとき、トグルスイッチが無効化され未解禁案内が表示されること', () => {
      const handleToggle = vi.fn();
      render(
        <CareSidebar
          currentCatName="くろねこ"
          onFeed={vi.fn()}
          onPlay={vi.fn()}
          isOpen={true}
          isAutoFeedUnlocked={false}
          isAutoFeedEnabled={false}
          onToggleAutoFeed={handleToggle}
          defaultTab="automation"
        />
      );

      expect(screen.getByText('未解禁')).toBeInTheDocument();
      expect(screen.getByText(/なつき度がLv\.10.*到達すると解禁/)).toBeInTheDocument();
      const toggleBtn = screen.getByTestId('care-auto-feed-toggle-button');
      expect(toggleBtn).toBeDisabled();
      fireEvent.click(toggleBtn);
      expect(handleToggle).not.toHaveBeenCalled();
    });
  });
});
