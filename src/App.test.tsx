import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App.tsx';

describe('App コンポーネント (猫切り替え機能)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('サイト名「ねこっぽい」と切り替えマーク・円形ラジオボタンが表示されること', () => {
    render(<App />);

    expect(screen.getByText('ねこっぽい')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /猫の見た目を切り替える/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ })).toBeInTheDocument();
  });

  it('切り替えマークを押すと白猫（寝転がり）と黒猫が循環切り替えされること', () => {
    render(<App />);

    // 初期状態: 黒猫
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /くろねこのシルエット/ })).toBeInTheDocument();

    // 切り替えマークを押す
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

  it('円形ラジオボタンを直接クリックして猫を切り替えられること', () => {
    render(<App />);

    // 白の円形ラジオボタンをクリック
    const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
    fireEvent.click(whiteRadio);

    // 白猫に切り替わる
    expect(screen.getByTestId('white-cat-svg')).toBeInTheDocument();
    expect(screen.getByText(/しろねこにきりかえたよ/)).toBeInTheDocument();

    // 黒の円形ラジオボタンをクリック
    const blackRadio = screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ });
    fireEvent.click(blackRadio);

    // 黒猫に戻る
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();
    expect(screen.getByText(/くろねこにきりかえたよ/)).toBeInTheDocument();
  });

  it('猫のシルエットをドラッグしてなでると、吹き出しメッセージが表示されること', () => {
    render(<App />);

    const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
    fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

    // 吹き出しメッセージが表示される
    const bubbleElement = screen.getByText(/ニャ〜ン♪|ゴロゴロ…♪|にゃあ〜♡|すりすり…|ミャオ！/);
    expect(bubbleElement).toBeInTheDocument();
  });

  it('撫でるとごきげんゲージが上昇し、猫ごとに機嫌が独立して管理されること (第4週)', () => {
    render(<App />);

    // 初期状態: 黒猫のごきげん度は初期20%（おだやか）
    expect(screen.getByText('くろねこのごきげん')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('おだやか')).toBeInTheDocument();

    const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // 1回撫でる (20 + 15 = 35%)
    fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

    expect(screen.getByText('35%')).toBeInTheDocument();

    // 白猫に切り替える
    const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
    fireEvent.click(whiteRadio);

    // 白猫はまだ撫でられていないため初期20%（猫ごとの独立管理）
    expect(screen.getByText('しろねこのごきげん')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();

    // 黒猫に戻す
    const blackRadio = screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ });
    fireEvent.click(blackRadio);

    // 黒猫の機嫌35%が保持されていること
    expect(screen.getByText('くろねこのごきげん')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
  });
});
