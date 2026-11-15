import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GiftCollectionModal } from './GiftCollectionModal.tsx';
import { GiftInventory } from '../../types/gift.ts';

describe('GiftCollectionModal コンポーネント', () => {
  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(
      <GiftCollectionModal isOpen={false} onClose={vi.fn()} inventory={{}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('インベントリが空のとき、空状態の案内メッセージが表示され、タイルには 0 と表示されること', () => {
    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

    expect(screen.getByRole('dialog', { name: /猫からのおくりもの/ })).toBeInTheDocument();
    expect(screen.getByTestId('gift-collection-empty')).toBeInTheDocument();
    expect(screen.getByText(/まだおくりものがありません/)).toBeInTheDocument();
    expect(screen.getByTestId('total-gift-count')).toHaveTextContent('0個');
    expect(screen.getByTestId('gift-collection-rate')).toHaveTextContent('0/60');

    // 正方形タイルの右下に 0 と表示
    expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('0');
    expect(screen.getByTestId('gift-count-feather')).toHaveTextContent('0');
  });

  it('表（グリッド）形式で各おくりものが角丸正方形タイルとして並び、右下に個数が表示されること', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 3,
        byCat: { black: 2, white: 1 },
        firstReceivedAt: 1000,
        lastReceivedAt: 2000,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    // 表（グリッド）要素
    const grid = screen.getByTestId('gift-grid-table');
    expect(grid).toBeInTheDocument();

    // きれいな小石のタイル（角丸正方形、アイコン、右下の個数）
    const pebbleTile = screen.getByTestId('gift-tile-pebble');
    expect(pebbleTile).toHaveClass('aspect-square');
    expect(pebbleTile).toHaveClass('rounded-2xl');
    expect(within(pebbleTile).getByTestId('pebble-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('× 3');

    // 未受け取りの羽根のタイル
    const featherTile = screen.getByTestId('gift-tile-feather');
    expect(featherTile).toHaveClass('aspect-square');
    expect(within(featherTile).getByTestId('unknown-gift-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gift-count-feather')).toHaveTextContent('0');
  });

  it('正方形タイルをクリックすると、ウィンドウ下側の詳細パネルに説明文や猫別内訳が表示されること', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 3,
        byCat: { black: 2, white: 1 },
        firstReceivedAt: 1000,
        lastReceivedAt: 2000,
      },
      feather: {
        giftId: 'feather',
        count: 1,
        byCat: { calico: 1 },
        firstReceivedAt: 1500,
        lastReceivedAt: 1500,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    // 初期状態では先頭の「きれいな小石」が選択されている
    expect(screen.getByTestId('gift-detail-panel')).toBeInTheDocument();
    expect(screen.getByText('きれいな小石')).toBeInTheDocument();
    expect(screen.getByTestId('gift-detail-count-badge')).toHaveTextContent('所持数: 3個');
    expect(screen.getByTestId('gift-detail-description')).toHaveTextContent(
      'どこかで見つけてきた、つるつると丸くてきれいな小石。'
    );
    expect(screen.getByText('くろねこ: 2個')).toBeInTheDocument();
    expect(screen.getByText('しろねこ: 1個')).toBeInTheDocument();

    // ふわふわの羽根のタイルをクリック
    const featherTile = screen.getByTestId('gift-tile-feather');
    fireEvent.click(featherTile);

    // 下側の詳細パネルが「ふわふわの羽根」の内容に切り替わること
    expect(screen.getByText('ふわふわの羽根')).toBeInTheDocument();
    expect(screen.getByTestId('gift-detail-count-badge')).toHaveTextContent('所持数: 1個');
    expect(screen.getByTestId('gift-detail-description')).toHaveTextContent(
      '日向で見つけてくわえてきた、やわらかく軽やかな羽根。'
    );
    expect(screen.getByText('みけねこ: 1個')).toBeInTheDocument();
  });

  it('レアリティの高いおくりものは獲得済みだけでなく未入手状態でも「？」の背景が金色になり、レアだと識別できること', () => {
    // インベントリは空（すべて未入手）
    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

    // 通常アイテムの未入手タイル（feather: 初期非選択の通常アイテム）
    const featherTile = screen.getByTestId('gift-tile-feather');
    expect(featherTile.className).toContain('bg-stone-50');
    const featherUnknownIcon = within(featherTile).getByTestId('unknown-gift-icon');
    expect(featherUnknownIcon).toHaveAttribute('data-rare', 'false');

    // レアアイテムの未入手タイル（ふしぎな古銭、なないろの羽根、よつばのクローバー）
    const rareOldCoinTile = screen.getByTestId('gift-tile-old-coin');
    expect(rareOldCoinTile.className).toContain('from-amber-100');
    expect(rareOldCoinTile.className).toContain('border-amber-400');
    expect(within(rareOldCoinTile).getByTestId('rare-badge-old-coin')).toHaveTextContent('★');

    // 未入手レアの「？」アイコン自体も金色背景（data-rare="true"）
    const oldCoinUnknownIcon = within(rareOldCoinTile).getByTestId('unknown-gift-icon');
    expect(oldCoinUnknownIcon).toHaveAttribute('data-rare', 'true');

    // 未入手のレアタイルをクリックして下部詳細パネルを確認
    fireEvent.click(rareOldCoinTile);

    // 詳細パネルのアイコン枠も金色
    const detailIconBox = screen.getByTestId('gift-detail-icon-box');
    expect(detailIconBox.className).toContain('from-amber-100');
    expect(detailIconBox.className).toContain('border-amber-400');
    expect(within(detailIconBox).getByTestId('unknown-gift-icon')).toHaveAttribute('data-rare', 'true');

    // 詳細パネルにも未入手ながら★レアバッジが表示されること
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★ レア');
  });

  it('レアリティの高いおくりものは背景が白色ではなく、レアは金色、スーパーレアは紫色、ウルトラレアは虹色/オーロラになること', () => {
    const inventory: GiftInventory = {
      pebble: {
        giftId: 'pebble',
        count: 1,
        firstReceivedAt: 1000,
        lastReceivedAt: 1000,
      },
      'old-coin': {
        giftId: 'old-coin',
        count: 1,
        byCat: { black: 1 },
        firstReceivedAt: 1200,
        lastReceivedAt: 1200,
      },
      'four-leaf-clover': {
        giftId: 'four-leaf-clover',
        count: 1,
        byCat: { calico: 1 },
        firstReceivedAt: 1300,
        lastReceivedAt: 1300,
      },
      'rainbow-feather': {
        giftId: 'rainbow-feather',
        count: 1,
        byCat: { white: 1 },
        firstReceivedAt: 1400,
        lastReceivedAt: 1400,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    const oldCoinTile = screen.getByTestId('gift-tile-old-coin');
    const fourLeafTile = screen.getByTestId('gift-tile-four-leaf-clover');
    const rainbowFeatherTile = screen.getByTestId('gift-tile-rainbow-feather');
    const pebbleTile = screen.getByTestId('gift-tile-pebble');

    // 古銭をクリックして選択状態にする（小石は非選択状態になる）
    fireEvent.click(oldCoinTile);

    // 通常の小石のタイル背景は白色系
    expect(pebbleTile.className).toContain('bg-white');

    // レアのふしぎな古銭のタイル背景は金色系（amberグラデーション）
    expect(oldCoinTile.className).toContain('from-amber-200');
    expect(oldCoinTile.className).toContain('border-amber-500');

    // スーパーレアのよつばのクローバーは紫色系（白でも金でもない）
    expect(fourLeafTile.className).toContain('from-purple-200');
    expect(fourLeafTile.className).not.toContain('amber');

    // ウルトラレアのなないろの羽根はオーロラ/虹色系（白でも金でもない）
    expect(rainbowFeatherTile.className).toContain('from-cyan-200');
    expect(rainbowFeatherTile.className).not.toContain('amber');

    // 詳細パネルのアイコン背景ボックスが金色であること（レア選択中）
    const detailIconBox = screen.getByTestId('gift-detail-icon-box');
    expect(detailIconBox.className).toContain('from-amber-300');
    expect(detailIconBox.className).toContain('border-amber-500');

    // レアバッジが表示されること
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★ レア');

    // スーパーレアをクリックすると詳細パネルに「★★ スーパーレア」と紫色アイコンが表示されること
    fireEvent.click(fourLeafTile);
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★★ スーパーレア');
    expect(screen.getByTestId('gift-detail-icon-box').className).toContain('from-purple-300');

    // ウルトラレアをクリックすると詳細パネルに「★★★ ウルトラレア」とオーロラアイコンが表示されること
    fireEvent.click(rainbowFeatherTile);
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★★★ ウルトラレア');
    expect(screen.getByTestId('gift-detail-icon-box').className).toContain('from-cyan-300');
  });

  it('閉じるボタンやバックドロップのクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<GiftCollectionModal isOpen={true} onClose={handleClose} inventory={{}} />);

    const closeButton = screen.getByRole('button', { name: 'おくりもの一覧を閉じる' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId('gift-collection-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('名前が長いおくりものやレアバッジがある場合でも、truncateで省略されずbreak-wordsで全て表示されること', () => {
    const inventory: GiftInventory = {
      'plastic-bottle-cap': {
        giftId: 'plastic-bottle-cap',
        count: 2,
        firstReceivedAt: 1000,
        lastReceivedAt: 1000,
      },
      'winning-ice-stick': {
        giftId: 'winning-ice-stick',
        count: 1,
        firstReceivedAt: 2000,
        lastReceivedAt: 2000,
      },
    };

    render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

    // 長い名前のおくりもの「すべすべのプラスチックフタ」をクリック
    const lidTile = screen.getByTestId('gift-tile-plastic-bottle-cap');
    fireEvent.click(lidTile);

    const nameEl = screen.getByTestId('gift-detail-name');
    expect(nameEl).toHaveTextContent('すべすべのプラスチックフタ');
    expect(nameEl).not.toHaveClass('truncate');
    expect(nameEl).toHaveClass('break-words');

    // レアで長めの名前のおくりもの「あたりのアイス棒」をクリック
    const winningStickTile = screen.getByTestId('gift-tile-winning-ice-stick');
    fireEvent.click(winningStickTile);

    const rareNameEl = screen.getByTestId('gift-detail-name');
    expect(rareNameEl).toHaveTextContent('あたりのアイス棒');
    expect(rareNameEl).not.toHaveClass('truncate');
    expect(rareNameEl).toHaveClass('break-words');
    expect(screen.getByTestId('gift-detail-rare-badge')).toHaveTextContent('★ レア');
    expect(screen.getByTestId('gift-detail-count-badge')).toHaveTextContent('所持数: 1個');
  });

  describe('おくりもの収集率の分数表示', () => {
    it('上部の「猫からのおくりもの」タイトルの右横に、収集率が「受け取った種類数/全種類数」の分数形式で表示されること', () => {
      // 60種類中2種類受け取っている場合（各アイテムの個数が複数でも種類数は2）
      const inventory: GiftInventory = {
        pebble: { giftId: 'pebble', count: 5, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        feather: { giftId: 'feather', count: 2, firstReceivedAt: 1000, lastReceivedAt: 1000 },
      };

      render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={inventory} />);

      const rateBadge = screen.getByTestId('gift-collection-rate');
      expect(rateBadge).toBeInTheDocument();
      expect(rateBadge).toHaveTextContent('2/60');
    });

    it('おくりものの数が今後増減しても、カタログの長さに連動して正確な分数（例: 2/3）が表示されること', () => {
      const customCatalog = [
        { id: 'item-a', name: 'アイテムA', description: '説明', icon: '🎁', iconType: 'pebble', themeClass: '', rarity: 'common' as const },
        { id: 'item-b', name: 'アイテムB', description: '説明', icon: '🎁', iconType: 'feather', themeClass: '', rarity: 'common' as const },
        { id: 'item-c', name: 'アイテムC', description: '説明', icon: '🎁', iconType: 'acorn', themeClass: '', rarity: 'rare' as const },
      ];

      const inventory: GiftInventory = {
        'item-a': { giftId: 'item-a', count: 1, firstReceivedAt: 1000, lastReceivedAt: 1000 },
        'item-c': { giftId: 'item-c', count: 3, firstReceivedAt: 1000, lastReceivedAt: 1000 },
      };

      render(
        <GiftCollectionModal
          isOpen={true}
          onClose={vi.fn()}
          inventory={inventory}
          catalog={customCatalog}
        />
      );

      const rateBadge = screen.getByTestId('gift-collection-rate');
      expect(rateBadge).toHaveTextContent('2/3');
    });

    it('猫の名前設定（catNames）が渡された場合、もらった猫の内訳表示がカスタム名に置き換わること', () => {
      const inventory: GiftInventory = {
        pebble: {
          giftId: 'pebble',
          count: 2,
          byCat: { black: 2 },
          firstReceivedAt: 1000,
          lastReceivedAt: 1000,
        },
      };

      render(
        <GiftCollectionModal
          isOpen={true}
          onClose={vi.fn()}
          inventory={inventory}
          catNames={{ black: 'クロスケ' }}
        />
      );

      // 初期選択の「きれいな小石」の内訳で「クロスケ: 2個」と表示されること
      expect(screen.getByText('クロスケ: 2個')).toBeInTheDocument();
      expect(screen.queryByText('くろねこ: 2個')).not.toBeInTheDocument();
    });
  });

  describe('ウィンドウ上部のレアリティ絞り込みフィルター', () => {
    it('上部に「すべて」「通常」「レア」「スーパーレア」「ウルトラレア」のフィルターボタンが表示され、件数が表示されること', () => {
      render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

      const filterBar = screen.getByTestId('gift-rarity-filter');
      expect(filterBar).toBeInTheDocument();

      const allButton = screen.getByTestId('filter-rarity-all');
      const commonButton = screen.getByTestId('filter-rarity-common');
      const rareButton = screen.getByTestId('filter-rarity-rare');
      const superRareButton = screen.getByTestId('filter-rarity-super-rare');
      const ultraRareButton = screen.getByTestId('filter-rarity-ultra-rare');

      expect(allButton).toHaveTextContent('すべて (60)');
      expect(commonButton).toHaveTextContent('通常 (45)');
      expect(rareButton).toHaveTextContent('レア (7)');
      expect(superRareButton).toHaveTextContent('スーパーレア (5)');
      expect(ultraRareButton).toHaveTextContent('ウルトラレア (3)');

      // 初期状態では「すべて」が選択されている
      expect(allButton).toHaveAttribute('aria-pressed', 'true');
      expect(commonButton).toHaveAttribute('aria-pressed', 'false');
      expect(rareButton).toHaveAttribute('aria-pressed', 'false');
      expect(superRareButton).toHaveAttribute('aria-pressed', 'false');
      expect(ultraRareButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('「通常」ボタンをクリックするとレア以上のアイテムが非表示になり、通常アイテムのみ表示されること', () => {
      render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

      const commonButton = screen.getByTestId('filter-rarity-common');
      fireEvent.click(commonButton);

      expect(commonButton).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-rarity-all')).toHaveAttribute('aria-pressed', 'false');

      // 通常アイテム（きれいな小石）は表示
      expect(screen.getByTestId('gift-tile-pebble')).toBeInTheDocument();
      // レア以上のアイテムは非表示
      expect(screen.queryByTestId('gift-tile-old-coin')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-four-leaf-clover')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-rainbow-feather')).not.toBeInTheDocument();
    });

    it('「レア」ボタンをクリックするとレアアイテムのみ表示されること', () => {
      render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

      const rareButton = screen.getByTestId('filter-rarity-rare');
      fireEvent.click(rareButton);

      expect(rareButton).toHaveAttribute('aria-pressed', 'true');

      // レアアイテム（ふしぎな古銭）は表示
      expect(screen.getByTestId('gift-tile-old-coin')).toBeInTheDocument();
      // 通常、スーパーレア、ウルトラレアは非表示
      expect(screen.queryByTestId('gift-tile-pebble')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-four-leaf-clover')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-rainbow-feather')).not.toBeInTheDocument();
    });

    it('「スーパーレア」ボタンをクリックするとスーパーレアアイテムのみ表示されること', () => {
      render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

      const superRareButton = screen.getByTestId('filter-rarity-super-rare');
      fireEvent.click(superRareButton);

      expect(superRareButton).toHaveAttribute('aria-pressed', 'true');

      // スーパーレアアイテム（よつばのクローバー）は表示
      expect(screen.getByTestId('gift-tile-four-leaf-clover')).toBeInTheDocument();
      // 他は非表示
      expect(screen.queryByTestId('gift-tile-pebble')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-old-coin')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-rainbow-feather')).not.toBeInTheDocument();
    });

    it('「ウルトラレア」ボタンをクリックするとウルトラレアアイテムのみ表示されること', () => {
      render(<GiftCollectionModal isOpen={true} onClose={vi.fn()} inventory={{}} />);

      const ultraRareButton = screen.getByTestId('filter-rarity-ultra-rare');
      fireEvent.click(ultraRareButton);

      expect(ultraRareButton).toHaveAttribute('aria-pressed', 'true');

      // ウルトラレアアイテム（なないろの羽根）は表示
      expect(screen.getByTestId('gift-tile-rainbow-feather')).toBeInTheDocument();
      // 他は非表示
      expect(screen.queryByTestId('gift-tile-pebble')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-old-coin')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-four-leaf-clover')).not.toBeInTheDocument();
    });

    it('将来新しいレアリティ（例: legendary）が追加された場合でも、自動的にフィルターボタンが生成され絞り込みが機能すること', () => {
      const futureCatalog = [
        { id: 'item-common', name: '通常の石', description: '説明', icon: '🪨', iconType: 'pebble', themeClass: '', rarity: 'common' as const },
        { id: 'item-rare', name: 'レアの石', description: '説明', icon: '💎', iconType: 'pebble', themeClass: '', rarity: 'rare' as const },
        { id: 'item-super-rare', name: '激レアの石', description: '説明', icon: '⭐', iconType: 'pebble', themeClass: '', rarity: 'super-rare' },
        { id: 'item-legendary', name: '伝説の石', description: '説明', icon: '🐉', iconType: 'pebble', themeClass: '', rarity: 'legendary' },
      ];

      render(
        <GiftCollectionModal
          isOpen={true}
          onClose={vi.fn()}
          inventory={{}}
          catalog={futureCatalog}
        />
      );

      // 4種類すべてのフィルターボタンが自動生成されること
      expect(screen.getByTestId('filter-rarity-all')).toHaveTextContent('すべて (4)');
      expect(screen.getByTestId('filter-rarity-common')).toHaveTextContent('通常 (1)');
      expect(screen.getByTestId('filter-rarity-rare')).toHaveTextContent('レア (1)');
      expect(screen.getByTestId('filter-rarity-super-rare')).toHaveTextContent('スーパーレア (1)');
      expect(screen.getByTestId('filter-rarity-legendary')).toHaveTextContent('legendary (1)');

      // 新しいレアリティ「legendary」をクリック
      fireEvent.click(screen.getByTestId('filter-rarity-legendary'));

      // legendary アイテムのみ表示され、他は非表示になること
      expect(screen.getByTestId('gift-tile-item-legendary')).toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-item-common')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-item-rare')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-tile-item-super-rare')).not.toBeInTheDocument();
    });
  });
});
