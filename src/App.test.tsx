import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App.tsx';

describe('App コンポーネント (第2週: ねこっぽい)', () => {
  it('サイト名「ねこっぽい」と猫のシルエットが表示され、開発用表記がないこと', () => {
    render(<App />);

    expect(screen.getByText('ねこっぽい')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /猫のシルエット/ })).toBeInTheDocument();
    expect(screen.queryByText(/第1週プロトタイプ/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Week 1/)).not.toBeInTheDocument();
  });

  it('猫のシルエットをクリックすると直接ふれあえ、吹き出しメッセージが表示されること', () => {
    render(<App />);

    const catSilhouette = screen.getByRole('button', { name: /猫のシルエット/ });
    fireEvent.click(catSilhouette);

    // 吹き出し（ニャ〜ン♪、ミャオ！、にゃあ〜♡、ゴロゴロ…♪、すりすり… のいずれか）が表示される
    const bubbleElement = screen.getByText(/ニャ〜ン♪|ミャオ！|にゃあ〜♡|ゴロゴロ…♪|すりすり…/);
    expect(bubbleElement).toBeInTheDocument();
  });
});
