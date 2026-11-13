import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AffectionLevelUpOverlay } from './AffectionLevelUpOverlay.tsx';

describe('AffectionLevelUpOverlay コンポーネント', () => {
  it('state が null のときは何もレンダリングされないこと', () => {
    const { container } = render(<AffectionLevelUpOverlay state={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('state が渡されたとき、暗い背景・回転する光輪・巨大なハートマーク（回転アニメーション付き）・なつき度数値・祝うメッセージが表示されること', () => {
    render(
      <AffectionLevelUpOverlay
        state={{
          level: 2,
          catName: 'くろねこ',
          title: 'ちょっと気になる',
          isFading: false,
        }}
      />
    );

    // オーバーレイ本体
    const overlay = screen.getByTestId('affection-levelup-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('opacity-100');

    // 暗い背景バックドロップ
    const backdrop = screen.getByTestId('affection-levelup-backdrop');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass('bg-stone-950/65');
    expect(backdrop).toHaveClass('opacity-100');

    // 背後の回転光輪（サンバースト）
    expect(screen.getByTestId('affection-levelup-sunburst')).toBeInTheDocument();

    // 巨大ハートマーク（回転アニメーションクラス付き）
    const heart = screen.getByTestId('affection-levelup-heart');
    expect(heart).toBeInTheDocument();
    expect(heart).toHaveClass('animate-heart-spin-intro');

    // ハート内のなつき度数値
    const numberElement = screen.getByTestId('affection-levelup-number');
    expect(numberElement).toHaveTextContent('Lv.2');

    // 下部の祝うメッセージ
    const messageElement = screen.getByTestId('affection-levelup-message');
    expect(messageElement).toHaveTextContent('なつき度が上がったよ！');
    expect(messageElement).toHaveTextContent('くろねこは「ちょっと気になる」になった♡');
  });

  it('isFading が true のとき、オーバーレイおよび背景バックドロップにフェードアウト用のクラス (opacity-0) が付与されること', () => {
    render(
      <AffectionLevelUpOverlay
        state={{
          level: 3,
          catName: 'しろねこ',
          title: '顔なじみ',
          isFading: true,
        }}
      />
    );

    const overlay = screen.getByTestId('affection-levelup-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('opacity-0');

    const backdrop = screen.getByTestId('affection-levelup-backdrop');
    expect(backdrop).toHaveClass('opacity-0');
  });

  it('state に gift（おくりもの）が含まれる場合、ハートマーク演出とともにおくりものカードが表示されること', () => {
    render(
      <AffectionLevelUpOverlay
        state={{
          level: 5,
          catName: 'みけねこ',
          title: '仲良し',
          isFading: false,
          gift: {
            id: 'pebble',
            name: 'きれいな小石',
            description: 'どこかで見つけてきた、つるつると丸くてきれいな小石。',
            icon: '🪨',
            iconType: 'pebble',
          },
        }}
      />
    );

    const giftCard = screen.getByTestId('affection-levelup-gift');
    expect(giftCard).toBeInTheDocument();
    expect(screen.getByText('みけねこからのおくりもの')).toBeInTheDocument();
    expect(screen.getByTestId('gift-item-name')).toHaveTextContent('きれいな小石');
    expect(screen.getByTestId('pebble-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gift-item-icon')).toHaveClass('bg-white');
    expect(screen.getByText('どこかで見つけてきた、つるつると丸くてきれいな小石。')).toBeInTheDocument();
  });

  it('レアリティの高いおくりものを受け取ったとき、アイコンの背景が金色になりレアバッジが表示されること', () => {
    render(
      <AffectionLevelUpOverlay
        state={{
          level: 10,
          catName: 'くろねこ',
          title: '最高の相棒',
          isFading: false,
          isMaxBonus: true,
          gift: {
            id: 'old-coin',
            name: 'ふしぎな古銭',
            description: 'どこかの古い蔵や床下で見つけてきたのか、不思議な文字が刻まれた丸い古銭。',
            icon: '🪙',
            iconType: 'old-coin',
            rarity: 'rare',
          },
        }}
      />
    );

    const iconBox = screen.getByTestId('gift-item-icon');
    expect(iconBox.className).toContain('from-amber-300');
    expect(iconBox.className).toContain('border-amber-500');
    expect(screen.getByTestId('old-coin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gift-overlay-rare-badge')).toHaveTextContent('★ レア');
  });
});
