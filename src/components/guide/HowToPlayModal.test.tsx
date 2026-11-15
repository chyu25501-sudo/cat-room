import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HowToPlayModal } from './HowToPlayModal.tsx';

describe('HowToPlayModal コンポーネント', () => {
  it('isOpen が false のときは何も描画されないこと', () => {
    const handleClose = vi.fn();
    render(<HowToPlayModal isOpen={false} onClose={handleClose} />);

    expect(screen.queryByTestId('how-to-play-modal')).not.toBeInTheDocument();
  });

  it('isOpen が true のとき、タイトル、あそびかたの各セクションが表示されること', () => {
    const handleClose = vi.fn();
    render(<HowToPlayModal isOpen={true} onClose={handleClose} />);

    // モーダル本体とタイトルの存在確認
    expect(screen.getByTestId('how-to-play-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'あそびかた' })).toBeInTheDocument();
    expect(screen.getByText('「ねこっぽい」の楽しみ方ガイド')).toBeInTheDocument();

    // ウィンドウ最上部に黒猫のSVG画像が描画されていること
    expect(screen.getByTestId('how-to-play-cat-banner')).toBeInTheDocument();
    expect(screen.getByTestId('how-to-play-black-cat-svg')).toBeInTheDocument();

    // 画面左上のボタンからいつでも確認できる旨が明記されていること
    const reopenNotice = screen.getByTestId('how-to-play-reopen-notice');
    expect(reopenNotice).toHaveTextContent('いつでも確認できます');
    expect(reopenNotice).toHaveTextContent('画面左上のボタン');
    expect(reopenNotice).toHaveTextContent('いつでも何度でも確認できます');
    expect(screen.getByText('画面左上のボタンからいつでも見られます')).toBeInTheDocument();

    // 楽しみ方の各セクションが存在すること
    expect(screen.getByTestId('guide-section-pet')).toBeInTheDocument();
    expect(screen.getByText('1. 猫ちゃんをなでなでしよう')).toBeInTheDocument();

    expect(screen.getByTestId('guide-section-care-food')).toBeInTheDocument();
    expect(screen.getByText('2. ごはんをあげよう（まんぷく度）')).toBeInTheDocument();
    expect(screen.getByText(/「カリカリ」「ねこ缶（まぐろ）」「おやつピューレ」/)).toBeInTheDocument();

    expect(screen.getByTestId('guide-section-care-toy')).toBeInTheDocument();
    expect(screen.getByText('3. おもちゃで一緒にあそぼう')).toBeInTheDocument();

    expect(screen.getByTestId('guide-section-affection-gifts')).toBeInTheDocument();
    expect(screen.getByText('4. なつき度を上げておくりものを集めよう')).toBeInTheDocument();

    expect(screen.getByTestId('guide-section-achievements-journal')).toBeInTheDocument();
    expect(screen.getByText('5. 実績に挑戦＆ふり返り手帳')).toBeInTheDocument();

    expect(screen.getByTestId('guide-section-switching-settings')).toBeInTheDocument();
    expect(screen.getByText('6. 猫ちゃんの切り替え＆設定')).toBeInTheDocument();
  });

  it('右上の閉じるボタン、フッターの「とじる」ボタン、バックドロップのクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<HowToPlayModal isOpen={true} onClose={handleClose} />);

    // 右上の閉じるボタン
    const closeButton = screen.getByTestId('how-to-play-modal-close-button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // フッターの「とじる」ボタン
    const footerCloseButton = screen.getByRole('button', { name: 'とじる' });
    fireEvent.click(footerCloseButton);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // バックドロップ
    const backdrop = screen.getByTestId('how-to-play-modal-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });

  it('Escapeキーの押下で onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<HowToPlayModal isOpen={true} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
