import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AffectionLevelUpOverlay } from './AffectionLevelUpOverlay.tsx';

describe('AffectionLevelUpOverlay コンポーネント', () => {
  it('state が null のときは何もレンダリングされないこと', () => {
    const { container } = render(<AffectionLevelUpOverlay state={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('state が渡されたとき、巨大なハートマーク・なつき度数値・祝うメッセージが表示されること', () => {
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

    // 巨大ハートマーク
    expect(screen.getByTestId('affection-levelup-heart')).toBeInTheDocument();

    // ハート内のなつき度数値
    const numberElement = screen.getByTestId('affection-levelup-number');
    expect(numberElement).toHaveTextContent('Lv.2');

    // 下部の祝うメッセージ
    const messageElement = screen.getByTestId('affection-levelup-message');
    expect(messageElement).toHaveTextContent('なつき度が上がったよ！');
    expect(messageElement).toHaveTextContent('くろねこは「ちょっと気になる」になった♡');
  });

  it('isFading が true のとき、フェードアウト用のクラス (opacity-0) が付与されること', () => {
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
  });
});
