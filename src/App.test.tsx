import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App.tsx';

describe('App コンポーネント', () => {
  it('タイトルと猫を呼ぶボタンが表示され、プロトタイプ開発表記が表示されないこと', () => {
    render(<App />);

    expect(screen.getByText('あつまれ！ねこのへや')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /猫を呼ぶ/ })).toBeInTheDocument();
    expect(screen.queryByText(/第1週プロトタイプ/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Week 1/)).not.toBeInTheDocument();
  });

  it('ボタンをクリックすると吹き出しメッセージが表示されること', () => {
    render(<App />);

    const button = screen.getByRole('button', { name: /猫を呼ぶ/ });
    fireEvent.click(button);

    // 吹き出し（ニャ〜ン♪、ミャオ！、にゃあ〜、ゴロゴロ…♪ のいずれか）が表示される
    const bubbleElement = screen.getByText(/ニャ〜ン♪|ミャオ！|にゃあ〜|ゴロゴロ…♪/);
    expect(bubbleElement).toBeInTheDocument();
  });
});
