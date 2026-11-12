import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
    expect(screen.getByRole('radio', { name: /みけねこ（たち）を選択/ })).toBeInTheDocument();
  });

  it('切り替えマークを押すと黒猫・白猫・三毛猫が順番に循環切り替えされること', () => {
    render(<App />);

    // 初期状態: 黒猫
    expect(screen.getByTestId('black-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /くろねこのシルエット/ })).toBeInTheDocument();

    // 切り替えマークを押す (1回目 -> 白猫)
    const switchButton = screen.getByRole('button', { name: /猫の見た目を切り替える/ });
    fireEvent.click(switchButton);

    expect(screen.getByTestId('white-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /しろねこのシルエット/ })).toBeInTheDocument();
    expect(screen.getByText(/しろねこにきりかえたよ/)).toBeInTheDocument();

    // 切り替えマークを押す (2回目 -> 三毛猫: 横向き立ち姿)
    fireEvent.click(switchButton);
    expect(screen.getByTestId('calico-cat-svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /みけねこのシルエット/ })).toBeInTheDocument();
    expect(screen.getByText(/みけねこにきりかえたよ/)).toBeInTheDocument();

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

    // 三毛猫の円形ラジオボタンをクリック
    const calicoRadio = screen.getByRole('radio', { name: /みけねこ（たち）を選択/ });
    fireEvent.click(calicoRadio);

    // 三毛猫に切り替わる
    expect(screen.getByTestId('calico-cat-svg')).toBeInTheDocument();
    expect(screen.getByText(/みけねこにきりかえたよ/)).toBeInTheDocument();

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
    const indicator = screen.getByTestId('cat-mood-indicator');
    expect(within(indicator).getByText('20%')).toBeInTheDocument();
    expect(within(indicator).getByText('おだやか')).toBeInTheDocument();

    const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });

    // 1回撫でる (20 + (10〜20)% = 30〜40% に上昇)
    fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
    fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
    fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

    const updatedScoreElement = within(indicator).getByText(/3[0-9]%|40%/);
    expect(updatedScoreElement).toBeInTheDocument();
    const updatedScoreText = updatedScoreElement.textContent!;

    // 白猫に切り替える
    const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
    fireEvent.click(whiteRadio);

    // 白猫はまだ撫でられていないため初期20%（猫ごとの独立管理）
    expect(within(indicator).getByText('しろねこのごきげん')).toBeInTheDocument();
    expect(within(indicator).getByText('20%')).toBeInTheDocument();

    // 黒猫に戻す
    const blackRadio = screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ });
    fireEvent.click(blackRadio);

    // 黒猫の機嫌スコアが保持されていること
    expect(within(indicator).getByText('くろねこのごきげん')).toBeInTheDocument();
    expect(within(indicator).getByText(updatedScoreText)).toBeInTheDocument();
  });

  it('短時間に何度も過剰に撫ですぎると愛撫誘発性攻撃行動が発生し、不機嫌（ごきげんななめ）になること (第5週)', () => {
    vi.useFakeTimers();
    try {
      render(<App />);

      const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
      let currentTime = Date.now();

      // クールダウン（DEFAULT_PET_COOLDOWN_MS = 1000ms）を挟みつつ、過剰刺激監視ウィンドウ（12000ms）内に10回連続で撫でる
      for (let i = 0; i < 10; i++) {
        act(() => {
          currentTime += 1050;
          vi.setSystemTime(currentTime);
          vi.advanceTimersByTime(1050);
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });
      }

      // 不機嫌（ごきげんななめ）バッジと威嚇セリフが表示されること
      expect(screen.getByText('ごきげんななめ')).toBeInTheDocument();
      expect(screen.getByText('5%')).toBeInTheDocument();
      expect(screen.getByText(/シャーッ！|フシャーッ！|ウーッ…|カッ…！/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  describe('第6週: お世話機能（サイドバー＆ごはん給餌）', () => {
    it('お世話ボタンを押してサイドバーを開き、カリカリを与えるとごきげん度が上昇してもぐもぐメッセージが表示されること', () => {
      render(<App />);

      const indicator = screen.getByTestId('cat-mood-indicator');
      expect(within(indicator).getByText('20%')).toBeInTheDocument();

      // お世話ボタンをクリック
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // ごはんのカリカリ（+18%）を与える
      const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
      fireEvent.click(feedKibbleBtn);

      // サイドバーが即座に閉じ、猫の様子が見えること
      const sidebar = screen.getByRole('complementary', { name: 'お世話サイドバー' });
      expect(sidebar).toHaveClass('translate-x-full');

      // スコアが 20 + 18 = 38% に上昇
      expect(within(indicator).getByText('38%')).toBeInTheDocument();

      // 猫の足元手前にカリカリボウルのイラストが描画されること
      expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();
      expect(screen.getByTestId('kibble-dish-svg')).toBeInTheDocument();
      expect(screen.getByText('モグモグ…♪（カリカリをお食事中）')).toBeInTheDocument();

      // 吹き出しに黒猫のもぐもぐセリフが表示される
      expect(
        screen.getByText(/カリカリ…ニャムニャム♪|サクサク…ミャオ！|カリッ…カリッ…ゴロゴロ…/)
      ).toBeInTheDocument();
    });

    it('撫ですぎで不機嫌（ごきげんななめ）になった猫に、ごはんを与えると即座に不機嫌が解消され機嫌が回復すること', () => {
      vi.useFakeTimers();
      try {
        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        let currentTime = Date.now();

        // 10回連続で撫でて不機嫌状態にする
        for (let i = 0; i < 10; i++) {
          act(() => {
            currentTime += 1050;
            vi.setSystemTime(currentTime);
            vi.advanceTimersByTime(1050);
            fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
            fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
            fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          });
        }

        expect(screen.getByText('ごきげんななめ')).toBeInTheDocument();
        expect(screen.getByText('5%')).toBeInTheDocument();

        // お世話ボタンを開く
        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
        fireEvent.click(careButton);

        // おやつピューレ（+38%）をあげる
        const feedTreatBtn = screen.getByRole('button', { name: 'おやつピューレをあげる' });
        act(() => {
          fireEvent.click(feedTreatBtn);
        });

        // 不機嫌（5%）から 5 + 38 = 43% に回復し、「ごきげん♪」に転じる
        expect(screen.queryByText('ごきげんななめ')).not.toBeInTheDocument();
        expect(screen.getByText('43%')).toBeInTheDocument();
        expect(screen.getByText('ごきげん♪')).toBeInTheDocument();

        // ごはんを与えた直後なので「なでられて嬉しそう」ではなく「ごはんを食べて嬉しそうにしているよ♪」が表示されること
        expect(screen.getByText('ごはんを食べて嬉しそうにしているよ♪')).toBeInTheDocument();
        expect(screen.queryByText('なでられて嬉しそうにしているよ♪')).not.toBeInTheDocument();

        // おやつピューレのイラストが描画されること
        expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();
        expect(screen.getByTestId('treat-dish-svg')).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('お世話ボタンからおもちゃ（ねこじゃらし）を選んで遊ばせると、ごきげん度が上昇し遊びセリフとおもちゃイラストが描画されること', () => {
      render(<App />);

      const indicator = screen.getByTestId('cat-mood-indicator');
      expect(within(indicator).getByText('20%')).toBeInTheDocument();

      // お世話ボタンをクリック
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // ねこじゃらし（+16%）であそぶ
      const playTeaserBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
      fireEvent.click(playTeaserBtn);

      // サイドバーが即座に閉じる
      const sidebar = screen.getByRole('complementary', { name: 'お世話サイドバー' });
      expect(sidebar).toHaveClass('translate-x-full');

      // スコアが 20 + 16 = 36% に上昇
      expect(within(indicator).getByText('36%')).toBeInTheDocument();

      // 猫の手前におもちゃイラストが描画されること
      expect(screen.getByTestId('active-toy-item')).toBeInTheDocument();
      expect(screen.getByTestId('teaser-toy-svg')).toBeInTheDocument();
      expect(screen.getByText('ワクワク…♪（ねこじゃらしであそび中）')).toBeInTheDocument();

      // 吹き出しに黒猫の遊びセリフが表示される
      expect(
        screen.getByText(
          /カシャカシャ…ニャッ！|パシッ！…ミャオ！|ウニャ〜！…ササッ！|ちょいちょいっ！…ミャオ♪/
        )
      ).toBeInTheDocument();
    });

    it('撫ですぎで不機嫌になった猫に、おもちゃ（毛糸ボール）で遊んであげると不機嫌が即座に解消されること', () => {
      vi.useFakeTimers();
      try {
        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        let currentTime = Date.now();

        // 10回連続で撫でて不機嫌状態にする
        for (let i = 0; i < 10; i++) {
          act(() => {
            currentTime += 1050;
            vi.setSystemTime(currentTime);
            vi.advanceTimersByTime(1050);
            fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
            fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
            fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          });
        }

        expect(screen.getByText('ごきげんななめ')).toBeInTheDocument();
        expect(screen.getByText('5%')).toBeInTheDocument();

        // お世話ボタンを開く
        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
        fireEvent.click(careButton);

        // 毛糸ボール（+26%）であそぶ
        const playBallBtn = screen.getByRole('button', { name: '毛糸ボールであそぶ' });
        act(() => {
          fireEvent.click(playBallBtn);
        });

        // 不機嫌（5%）から 5 + 26 = 31% に回復
        expect(screen.queryByText('ごきげんななめ')).not.toBeInTheDocument();
        expect(screen.getByText('31%')).toBeInTheDocument();
        expect(screen.getByText('おだやか')).toBeInTheDocument();

        // 毛糸ボールのイラストが描画されること
        expect(screen.getByTestId('active-toy-item')).toBeInTheDocument();
        expect(screen.getByTestId('ball-toy-svg')).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('猫が食事中または遊び中の間、サイドバーから新しいごはんやおもちゃを選択できず、終了後に再び選択可能になること', () => {
      vi.useFakeTimers();
      try {
        render(<App />);

        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });

        // 1. カリカリを与える
        fireEvent.click(careButton);
        const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
        act(() => {
          fireEvent.click(feedKibbleBtn);
        });

        // 猫がお食事中になる
        expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();

        // お食事中にサイドバーを再度開く
        fireEvent.click(careButton);

        // お食事中バナーが表示され、ごはん・おもちゃボタンが非活性になっていること
        expect(screen.getByTestId('care-busy-banner')).toHaveTextContent('お食事中です♪');
        const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
        for (const btn of feedButtons) {
          expect(btn).toBeDisabled();
        }
        const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
        for (const btn of playButtons) {
          expect(btn).toBeDisabled();
        }

        // 食事時間（DEFAULT_EATING_DURATION_MS = 6000ms）を経過させる
        act(() => {
          vi.advanceTimersByTime(6500);
        });

        // 食事が完了すると、ボタンが再び有効化されること
        expect(screen.queryByTestId('care-busy-banner')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'ねこじゃらしであそぶ' })).toBeEnabled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('画面上にまんぷく度が表示され、ごはんを与えると上昇し、時間経過でごきげん度よりゆっくり減少すること', () => {
      vi.useFakeTimers();
      try {
        localStorage.clear();
        let currentTime = 1000000;
        vi.setSystemTime(currentTime);

        render(<App />);

        // 1. 初期状態でまんぷく度が表示されていること
        expect(screen.getByTestId('cat-fullness-section')).toBeInTheDocument();
        expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('50%');
        expect(screen.getByTestId('fullness-status-badge')).toHaveTextContent('ほどよい');

        // 2. カリカリ（満腹度+25%）を与える
        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
        fireEvent.click(careButton);
        const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
        act(() => {
          fireEvent.click(feedKibbleBtn);
        });

        // まんぷく度が 50 + 25 = 75% に上昇すること
        expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('75%');

        // 3. 時間経過によるゆるやかな減少（ごきげん度よりもかなりゆっくり）
        // 5分（300,000ms）経過:
        // まんぷく度は 1分に1点減衰 -> 5点減衰して 75 - 5 = 70%
        act(() => {
          vi.advanceTimersByTime(300000);
        });

        expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('70%');
      } finally {
        vi.useRealTimers();
      }
    });

    it('おもちゃで遊ぶとまんぷく度が5〜10%微減すること', () => {
      localStorage.clear();
      render(<App />);

      // 初期状態でまんぷく度は 50%
      expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('50%');

      // お世話メニューを開く
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // ねこじゃらし（ごきげん度+25%）であそぶ
      const playFeatherBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
      act(() => {
        fireEvent.click(playFeatherBtn);
      });

      // ごきげん度は上昇（初期20% + ねこじゃらし16% = 36%）
      const moodIndicator = screen.getByTestId('cat-mood-indicator');
      expect(within(moodIndicator).getByText('36%')).toBeInTheDocument();

      // まんぷく度は 5〜10% 微減（50 - 10 = 40% 〜 50 - 5 = 45% の範囲内）
      const fullnessText = screen.getByTestId('fullness-score-percentage').textContent;
      const fullnessMatch = fullnessText?.match(/(\d+)%/);
      expect(fullnessMatch).not.toBeNull();
      const fullnessScore = Number(fullnessMatch![1]);
      expect(fullnessScore).toBeGreaterThanOrEqual(40);
      expect(fullnessScore).toBeLessThanOrEqual(45);
    });

    it('猫にあげるごはんは、まんぷく度回復量が多いほど食べる時間が少しだけ長くなること', () => {
      vi.useFakeTimers();
      try {
        localStorage.clear();
        render(<App />);

        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });

        // 1. おやつピューレ（回復量15%: 3000ms）を与える
        fireEvent.click(careButton);
        const feedTreatBtn = screen.getByRole('button', { name: 'おやつピューレをあげる' });
        act(() => {
          fireEvent.click(feedTreatBtn);
        });

        // 食事中であること
        expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();

        // 2900ms時点: まだ食事中
        act(() => {
          vi.advanceTimersByTime(2900);
        });
        expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();

        // 3100ms時点: 食事終了
        act(() => {
          vi.advanceTimersByTime(200);
        });
        expect(screen.queryByTestId('active-food-dish')).not.toBeInTheDocument();

        // 2. ねこ缶（回復量35%: 3800ms）を与える
        fireEvent.click(careButton);
        const feedCannedBtn = screen.getByRole('button', { name: 'ねこ缶（まぐろ）をあげる' });
        act(() => {
          fireEvent.click(feedCannedBtn);
        });

        expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();

        // おやつピューレなら終了していた3100ms経過時点でも、ねこ缶はまだ食事中
        act(() => {
          vi.advanceTimersByTime(3100);
        });
        expect(screen.getByTestId('active-food-dish')).toBeInTheDocument();

        // 3900ms（合計）経過時点: 食事終了
        act(() => {
          vi.advanceTimersByTime(800);
        });
        expect(screen.queryByTestId('active-food-dish')).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('まんぷく度が0〜39％のとき、ごきげん度が最大10%まで下がり、ごはん回復後は平常通り20%までしか下がらないこと', () => {
      vi.useFakeTimers();
      try {
        localStorage.clear();
        // 黒猫のまんぷく度を30%（空腹）、ごきげん度20%で初期化
        localStorage.setItem(
          'nekoppoi_cats_fullness',
          JSON.stringify({
            black: { score: 30, lastFedAt: Date.now() },
            white: { score: 50, lastFedAt: Date.now() },
          })
        );

        render(<App />);

        // まんぷく度が30%（小腹すいた）であることを確認
        expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('30%');

        const moodIndicator = screen.getByTestId('cat-mood-indicator');
        expect(within(moodIndicator).getByTestId('mood-score-percentage')).toHaveTextContent('20%');

        // 空腹状態（30%）なので、放置すると通常の下限20%を突き抜けて最大10%まで下がる（6点/分で減衰）
        // 2分（120秒）進めると 20 - 12 = 8 -> 下限10%でクランプ
        act(() => {
          vi.advanceTimersByTime(120 * 1000);
        });

        expect(within(moodIndicator).getByTestId('mood-score-percentage')).toHaveTextContent('10%');

        // ここでごはん（カリカリ: 満腹度+25%, 機嫌+18%）を与える
        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
        fireEvent.click(careButton);
        const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
        act(() => {
          fireEvent.click(feedKibbleBtn);
        });

        // 機嫌が 10 + 18 = 28% に回復
        expect(within(moodIndicator).getByTestId('mood-score-percentage')).toHaveTextContent('28%');

        // まんぷく度が回復（2分経過で30-2=28%に減衰後、カリカリ+25%で53%）し、40%以上に回復したことを確認
        expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('53%');

        // 満腹度回復後は、平常時の減り方（下限20%）に戻る
        // 30分放置しても、下限20%より下には下がらないこと
        act(() => {
          vi.advanceTimersByTime(30 * 60 * 1000);
        });

        expect(within(moodIndicator).getByTestId('mood-score-percentage')).toHaveTextContent('20%');
      } finally {
        vi.useRealTimers();
      }
    });

    it('まんぷく度が90%以上のときは「まんぷくで食べられない！」と表示されごはんをあげられないこと', () => {
      localStorage.clear();
      // 黒猫のまんぷく度を 95%（90%以上）に設定
      localStorage.setItem(
        'nekoppoi_cats_fullness',
        JSON.stringify({
          black: { score: 95, lastFedAt: Date.now() },
          white: { score: 50, lastFedAt: Date.now() },
        })
      );

      render(<App />);

      expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('95%');

      // お世話メニューを開く
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // 「まんぷくで食べられない！」バナーが表示されていること
      expect(screen.getByTestId('feed-disabled-banner')).toHaveTextContent('まんぷくで食べられない！');

      // ごはんボタンが無効化されていること
      const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
      for (const btn of feedButtons) {
        expect(btn).toBeDisabled();
        expect(btn).toHaveTextContent('まんぷくで食べられない！');
        fireEvent.click(btn);
      }

      // 食事中にならないこと
      expect(screen.queryByTestId('active-food-dish')).not.toBeInTheDocument();
    });

    it('まんぷく度が10%以下のときは「お腹が空いて遊べない！」と表示されおもちゃで遊べないこと', () => {
      localStorage.clear();
      // 黒猫のまんぷく度を 8%（10%以下）に設定
      localStorage.setItem(
        'nekoppoi_cats_fullness',
        JSON.stringify({
          black: { score: 8, lastFedAt: Date.now() },
          white: { score: 50, lastFedAt: Date.now() },
        })
      );

      render(<App />);

      expect(screen.getByTestId('fullness-score-percentage')).toHaveTextContent('8%');

      // お世話メニューを開く
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // 「お腹が空いて遊べない！」バナーが表示されていること
      expect(screen.getByTestId('play-disabled-banner')).toHaveTextContent('お腹が空いて遊べない！');

      // おもちゃボタンが無効化されていること
      const playButtons = screen.getAllByRole('button', { name: /であそぶ$/ });
      for (const btn of playButtons) {
        expect(btn).toBeDisabled();
        expect(btn).toHaveTextContent('お腹が空いて遊べない！');
        fireEvent.click(btn);
      }

      // 遊び中にならないこと
      expect(screen.queryByTestId('active-toy-item')).not.toBeInTheDocument();
    });
  });

  describe('第7週: なつき度（Affection）機能の統合テスト', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('初期状態で黒猫のなつき度Lv.1（はじめまして、0%）が表示されること', () => {
      render(<App />);

      expect(screen.getByTestId('cat-affection-section')).toBeInTheDocument();
      expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.1 はじめまして');
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('0%');
      expect(screen.getByText(/次のLvまで あと 100pt/)).toBeInTheDocument();
    });

    it('撫でる・ごはん・おもちゃの「ふれあい」でなつき度Expが増加すること', () => {
      vi.useFakeTimers();
      try {
        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });

        // 1. 撫でる (+10pt / 100pt = 10%)
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('10%');
        expect(screen.getByText(/次のLvまで あと 90pt/)).toBeInTheDocument();

        // 2. ごはん（カリカリ: +25pt -> 35pt / 100pt = 35%）
        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
        fireEvent.click(careButton);
        const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
        act(() => {
          fireEvent.click(feedKibbleBtn);
        });

        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('35%');
        expect(screen.getByText(/次のLvまで あと 65pt/)).toBeInTheDocument();

        // 食事完了（カリカリは3400ms）までタイマーを進めて次のアクションを受け付け可能にする
        act(() => {
          vi.advanceTimersByTime(4000);
        });

        // 3. おもちゃ（ねこじゃらし: +20pt -> 55pt / 100pt = 55%）
        const playFeatherBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
        act(() => {
          fireEvent.click(playFeatherBtn);
        });

        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('55%');
        expect(screen.getByText(/次のLvまで あと 45pt/)).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('ゲージが1回満タンになるとLv.2にレベルアップし、画面中央に巨大ハートとなつき度数値・祝うメッセージが表示されフェードアウトすること', () => {
      vi.useFakeTimers();
      try {
        // 事前に黒猫のExpを95pt（Lv.1の残り5pt）に設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 1, currentExp: 95, requiredExp: 100 },
            white: { level: 1, currentExp: 0, requiredExp: 100 },
          })
        );

        render(<App />);

        expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.1 はじめまして');
        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('95%');

        // レベルアップ前は中央演出は表示されていないこと
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();

        // 撫でる (+10pt -> 95 + 10 = 105pt, 100ptでレベルアップしLv.2へ。余剰5pt / 125pt = 4%)
        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // インジケーター側: レベル2（ちょっと気になる）に上昇し、ゲージがリセット
        expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.2 ちょっと気になる');
        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('4%');
        expect(screen.getByText(/次のLvまで あと 120pt/)).toBeInTheDocument();

        // 画面中央に大きくレベルアップ演出が表示されること
        const overlay = screen.getByTestId('affection-levelup-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass('opacity-100');

        // 暗い背景バックドロップが表示されていること
        expect(screen.getByTestId('affection-levelup-backdrop')).toBeInTheDocument();

        // 巨大なハートマーク（回転アニメーション付き）となつき度の数値 (Lv.2)
        const heart = screen.getByTestId('affection-levelup-heart');
        expect(heart).toBeInTheDocument();
        expect(heart).toHaveClass('animate-heart-spin-intro');
        expect(screen.getByTestId('affection-levelup-number')).toHaveTextContent('Lv.2');

        // その下に祝うメッセージが表示されること
        const message = screen.getByTestId('affection-levelup-message');
        expect(message).toHaveTextContent('なつき度が上がったよ！');
        expect(message).toHaveTextContent('くろねこは「ちょっと気になる」になった♡');

        // 少しの間表示された後（2400ms）、フェードアウト開始（opacity-0）
        act(() => {
          vi.advanceTimersByTime(2400);
        });
        expect(screen.getByTestId('affection-levelup-overlay')).toHaveClass('opacity-0');

        // アニメーション完了（さらに600ms）で画面から完全に消えること
        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('猫ごとに独立してなつき度が管理されること', () => {
      render(<App />);

      // 初期状態は黒猫・Lv.1 (0%)
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('0%');

      // 黒猫を撫でる (+10pt)
      const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
      fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
      fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
      fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('10%');

      // 白猫に切り替える
      const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
      fireEvent.click(whiteRadio);

      // 白猫はまだふれあっていないため初期Lv.1 (0%)
      expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.1 はじめまして');
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('0%');

      // 再び黒猫に戻すと10%が維持されていること
      const blackRadio = screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ });
      fireEvent.click(blackRadio);
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('10%');
    });

    it('なつき度の最大値が10であり、Lv.10到達時はゲージがMAX表示を維持すること', () => {
      localStorage.setItem(
        'nekoppoi_cats_affection',
        JSON.stringify({
          black: { level: 10, currentExp: 300, requiredExp: 300 },
          white: { level: 1, currentExp: 0, requiredExp: 100 },
        })
      );

      render(<App />);

      // Lv.10 MAX表示
      expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.10 MAX♡');
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('MAX');
      expect(screen.getByText('深い絆で結ばれた最高のパートナー♡')).toBeInTheDocument();
    });
  });
});
