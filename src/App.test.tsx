import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App.tsx';

describe('App コンポーネント (猫切り替え機能)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('サイト名「ねこっぽい」と切り替えボタンが表示されること', () => {
    render(<App />);

    expect(screen.getByText('ねこっぽい')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /猫の見た目を切り替える/ })).toBeInTheDocument();
  });

  it('初期状態で黒猫が表示され、切り替えボタンを押すと白猫（寝転がり）に切り替わること', () => {
    render(<App />);

    // 初期状態: 黒猫
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /くろねこのシルエット/ })).toBeInTheDocument();

    // 切り替えボタンを押す
    const switchButton = screen.getByRole('button', { name: /猫の見た目を切り替える/ });
    fireEvent.click(switchButton);

    // 白猫に切り替わる
    expect(screen.getByTestId('white-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /しろねこのシルエット/ })).toBeInTheDocument();
    expect(screen.getByText(/しろねこにきりかえたよ/)).toBeInTheDocument();

    // もう一度押すと黒猫に戻る（循環切り替え）
    fireEvent.click(switchButton);
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /くろねこのシルエット/ })).toBeInTheDocument();
  });

  it('猫のシルエットをクリックすると直接ふれあえ、吹き出しメッセージが表示されること', () => {
    render(<App />);

    const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
    fireEvent.click(catSilhouette);

    // 吹き出しメッセージが表示される
    const bubbleElement = screen.getByText(/ニャ〜ン♪|ゴロゴロ…♪|にゃあ〜♡|すりすり…|ミャオ！/);
    expect(bubbleElement).toBeInTheDocument();
  });
});
