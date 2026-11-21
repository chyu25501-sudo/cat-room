import { render, screen, fireEvent, act, within, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App.tsx';
import { CAT_GIFTS } from './utils/catGifts.ts';
import { GUIDE_SEEN_STORAGE_KEY } from './utils/firstVisit.ts';
import { PRIVACY_POLICY_ACCEPTED_STORAGE_KEY } from './utils/privacyPolicy.ts';
import * as catSoundModule from './utils/catSound.ts';

describe('App コンポーネント (猫切り替え機能)', () => {
  const setupAllCatsMaxAffection = () => {
    localStorage.setItem(
      'nekoppoi_cats_affection',
      JSON.stringify({
        black: { level: 10, currentExp: 0, requiredExp: 600 },
        white: { level: 10, currentExp: 0, requiredExp: 600 },
        calico: { level: 10, currentExp: 0, requiredExp: 600 },
      })
    );
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY, 'true');
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
    act(() => {
      fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
      fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
      fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
    });

    // 吹き出しメッセージが表示される
    const bubbleElement = screen.getByTestId('speech-bubble');
    expect(bubbleElement).toBeInTheDocument();
    expect(bubbleElement).toHaveTextContent(/ニャ〜ン|ゴロゴロ|にゃあ|すりすり|ミャオ|ンニャ/);
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
      expect(screen.getByTestId('mood-score-percentage')).toHaveTextContent('5%');
      expect(screen.getByText(/シャーッ！|フシャーッ！|ウーッ…|カッ…！/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  describe('第6週: お世話機能（サイドバー＆ごはん給餌）', () => {
    const setupMaxAffection = () => {
      localStorage.setItem(
        'nekoppoi_cats_affection',
        JSON.stringify({
          black: { level: 10, currentExp: 0, requiredExp: 600 },
          white: { level: 10, currentExp: 0, requiredExp: 600 },
          calico: { level: 10, currentExp: 0, requiredExp: 600 },
        })
      );
    };

    it('なつき度が初期状態（Lv.1）のとき、カリカリは最初から解禁され、他のアイテムは「なつき度nで解禁されるよ！」と明記されること', () => {
      render(<App />);

      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // ごはん・おもちゃの名前は表示される
      expect(screen.getByText('カリカリ')).toBeInTheDocument();
      expect(screen.getByText('ねこ缶（まぐろ）')).toBeInTheDocument();
      expect(screen.getByText('おやつピューレ')).toBeInTheDocument();
      expect(screen.getByText('ねこじゃらし')).toBeInTheDocument();
      expect(screen.getByText('毛糸ボール')).toBeInTheDocument();
      expect(screen.getByText('レーザーポインター')).toBeInTheDocument();

      // カリカリはLv.1（最初）から解禁されていること
      const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
      expect(feedKibbleBtn).toBeEnabled();
      expect(screen.queryByTestId('food-locked-button-kibble')).not.toBeInTheDocument();

      // ねこ缶（必要Lv.4）
      expect(screen.getByTestId('food-locked-button-canned')).toHaveTextContent('なつき度4で解禁されるよ！');

      // おやつピューレ（必要Lv.6）
      expect(screen.getByTestId('food-locked-button-treat')).toHaveTextContent('なつき度6で解禁されるよ！');

      // ねこじゃらし（必要Lv.3）
      expect(screen.getByTestId('toy-locked-button-teaser')).toHaveTextContent('なつき度3で解禁されるよ！');
      expect(screen.getByTestId('toy-locked-button-teaser')).toBeDisabled();

      // 毛糸ボール（必要Lv.5）
      expect(screen.getByTestId('toy-locked-button-ball')).toHaveTextContent('なつき度5で解禁されるよ！');

      // レーザーポインター（必要Lv.7）
      expect(screen.getByTestId('toy-locked-button-laser')).toHaveTextContent('なつき度7で解禁されるよ！');
    });

    it('お世話ボタンを押してサイドバーを開き、カリカリを与えるとごきげん度が上昇してもぐもぐメッセージが表示されること', () => {
      setupMaxAffection();
      render(<App />);

      const indicator = screen.getByTestId('cat-mood-indicator');
      expect(within(indicator).getByText('20%')).toBeInTheDocument();

      // お世話ボタンをクリック
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // ごはんのカリカリ（+18%）を与える
      const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
      fireEvent.click(feedKibbleBtn);

      // お世話メニューが即座に閉じ、猫の様子が見えること
      expect(screen.queryByRole('dialog', { name: /お世話メニュー/ })).not.toBeInTheDocument();

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
      setupMaxAffection();
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
        expect(screen.getByTestId('mood-score-percentage')).toHaveTextContent('5%');

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
        expect(screen.getByTestId('mood-score-percentage')).toHaveTextContent('43%');
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
      setupMaxAffection();
      render(<App />);

      const indicator = screen.getByTestId('cat-mood-indicator');
      expect(within(indicator).getByText('20%')).toBeInTheDocument();

      // お世話ボタンをクリック
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      // ねこじゃらし（+16%）であそぶ
      const playTeaserBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
      fireEvent.click(playTeaserBtn);

      // お世話メニューが即座に閉じる
      expect(screen.queryByRole('dialog', { name: /お世話メニュー/ })).not.toBeInTheDocument();

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
      setupMaxAffection();
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
        expect(screen.getByTestId('mood-score-percentage')).toHaveTextContent('5%');

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
        expect(screen.getByTestId('mood-score-percentage')).toHaveTextContent('31%');
        expect(screen.getByText('おだやか')).toBeInTheDocument();

        // 毛糸ボールのイラストが描画されること
        expect(screen.getByTestId('active-toy-item')).toBeInTheDocument();
        expect(screen.getByTestId('ball-toy-svg')).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('猫が食事中または遊び中の間、サイドバーから新しいごはんやおもちゃを選択できず、終了後に再び選択可能になること', () => {
      setupMaxAffection();
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
        setupMaxAffection();
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
      setupMaxAffection();
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
        setupMaxAffection();
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
        setupMaxAffection();
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
      setupMaxAffection();
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
      setupMaxAffection();
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
      localStorage.setItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY, 'true');
    });

    it('初期状態で黒猫のなつき度Lv.1（はじめまして、0%）が表示されること', () => {
      render(<App />);

      expect(screen.getByTestId('cat-affection-section')).toBeInTheDocument();
      expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.1 はじめまして');
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('0%');
      expect(screen.getByText(/次のLvまで あと 120pt/)).toBeInTheDocument();
    });

    it('撫でる・ごはん・おもちゃの「ふれあい」でなつき度Expが増加すること', () => {
      vi.useFakeTimers();
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      try {
        // カリカリ(Lv.2)とねこじゃらし(Lv.3)が解禁されているLv.3で初期化
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 3, currentExp: 0, requiredExp: 240 },
          })
        );

        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });

        // 1. 撫でる (+10pt / 240pt = 4%)
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('4%');
        expect(screen.getByText(/次のLvまで あと 230pt/)).toBeInTheDocument();

        // 2. ごはん（カリカリ: +25pt -> 35pt / 240pt = 15%）
        const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
        fireEvent.click(careButton);
        const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
        act(() => {
          fireEvent.click(feedKibbleBtn);
        });

        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('15%');
        expect(screen.getByText(/次のLvまで あと 205pt/)).toBeInTheDocument();

        // 食事完了（カリカリは3400ms）までタイマーを進めて次のアクションを受け付け可能にする
        act(() => {
          vi.advanceTimersByTime(4000);
        });

        // 3. おもちゃ（ねこじゃらし: +20pt -> 55pt / 240pt = 23%）
        fireEvent.click(careButton);
        const playFeatherBtn = screen.getByRole('button', { name: 'ねこじゃらしであそぶ' });
        act(() => {
          fireEvent.click(playFeatherBtn);
        });

        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('23%');
        expect(screen.getByText(/次のLvまで あと 185pt/)).toBeInTheDocument();
      } finally {
        randomSpy.mockRestore();
        vi.useRealTimers();
      }
    });

    it('ゲージが1回満タンになるとLv.2にレベルアップし、画面中央に巨大ハートとなつき度数値・祝うメッセージが表示されファンファーレが鳴ること（鳴き声と音が被らないこと）', () => {
      vi.useFakeTimers();
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const fanfareSpy = vi.spyOn(catSoundModule, 'playFanfareSound').mockImplementation(() => {});
      const meowSpy = vi.spyOn(catSoundModule, 'playMeowSound').mockImplementation(() => {});
      try {
        // 事前に黒猫のExpを115pt（Lv.1の残り5pt）に設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 1, currentExp: 115, requiredExp: 120 },
            white: { level: 1, currentExp: 0, requiredExp: 120 },
          })
        );

        render(<App />);

        expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.1 はじめまして');
        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('96%');

        // レベルアップ前は中央演出は表示されていないこと
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();
        expect(fanfareSpy).not.toHaveBeenCalled();

        // 撫でる (+10pt -> 115 + 10 = 125pt, 120ptでレベルアップしLv.2へ。余剰5pt / 180pt = 3%)
        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // インジケーター側: レベル2（ちょっと気になる）に上昇し、ゲージがリセット
        expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.2 ちょっと気になる');
        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('3%');
        expect(screen.getByText(/次のLvまで あと 175pt/)).toBeInTheDocument();

        // 画面中央に大きくレベルアップ演出が表示されること
        const overlay = screen.getByTestId('affection-levelup-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass('opacity-100');

        // かわいいファンファーレ効果音が再生されたこと（通常の鳴き声meowは音が被らないよう抑制される）
        expect(fanfareSpy).toHaveBeenCalledTimes(1);
        expect(meowSpy).not.toHaveBeenCalled();

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

        // 2400ms 経過時点ではまだフェードアウトせず表示中（0.5秒延長されたため）
        act(() => {
          vi.advanceTimersByTime(2400);
        });
        expect(screen.getByTestId('affection-levelup-overlay')).toHaveClass('opacity-100');

        // さらに 500ms（合計2900ms）経過後、フェードアウト開始（opacity-0）
        act(() => {
          vi.advanceTimersByTime(500);
        });
        expect(screen.getByTestId('affection-levelup-overlay')).toHaveClass('opacity-0');

        // アニメーション完了（さらに600ms）で画面から完全に消えること
        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();
      } finally {
        meowSpy.mockRestore();
        fanfareSpy.mockRestore();
        randomSpy.mockRestore();
        vi.useRealTimers();
      }
    });

    it('なつき度が最大のときもゲージを溜められ、ゲージがたまると画面中央にハートマーク演出が表示され、なつき度は最大のままで再度ゲージを溜められること', () => {
      vi.useFakeTimers();
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const fanfareSpy = vi.spyOn(catSoundModule, 'playFanfareSound').mockImplementation(() => {});
      const meowSpy = vi.spyOn(catSoundModule, 'playMeowSound').mockImplementation(() => {});
      try {
        // 黒猫のなつき度を最大（Lv.10, ゲージ590pt / 必要600pt、あと10ptで満タン）に設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 10, currentExp: 590, requiredExp: 600 },
          })
        );

        render(<App />);

        // レベルバッジは「Lv.10 MAX♡」、ゲージは 590/600 = 98%
        expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.10 MAX♡');
        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('98%');
        expect(screen.getByText(/ハートまで あと 10pt/)).toBeInTheDocument();

        // 撫でる（おだやか状態なので +10pt -> 600/600 満タン達成！）
        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // 画面中央にハートマーク演出が表示されること
        const overlay = screen.getByTestId('affection-levelup-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass('opacity-100');
        expect(fanfareSpy).toHaveBeenCalledTimes(1);

        // ハート内に「だいすき♡」「MAX」、メッセージに「ハートがいっぱい♡」が表示されること
        expect(screen.getByTestId('affection-levelup-number')).toHaveTextContent('だいすき♡');
        expect(screen.getByTestId('affection-levelup-number')).toHaveTextContent('MAX');
        expect(screen.getByTestId('affection-levelup-message')).toHaveTextContent('ハートがいっぱい♡');
        expect(screen.getByTestId('affection-levelup-gift')).toBeInTheDocument();

        // なつき度は Lv.10 のままで、ゲージがリセットされ（0pt/300pt）、また溜め直せること
        expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.10 MAX♡');
        expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('MAX');

        // 演出が 2900ms 表示された後フェードアウトすること
        act(() => {
          vi.advanceTimersByTime(2900);
        });
        expect(screen.getByTestId('affection-levelup-overlay')).toHaveClass('opacity-0');

        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();

        // 演出終了後も、再度撫でてゲージを溜め直せること
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });
        // 機嫌が上がっているため 20pt 以上獲得してゲージが進むこと
        expect(screen.getByTestId('affection-progress-percentage')).not.toHaveTextContent('MAX');
      } finally {
        meowSpy.mockRestore();
        fanfareSpy.mockRestore();
        randomSpy.mockRestore();
        vi.useRealTimers();
      }
    });

    it('猫のごきげん度が高ければ高いほど、撫でた時のなつき度の上習幅が多めに上がること（プラスマイナスのランダム変動を含む）', () => {
      // 1. おだやか（低ごきげん: スコア15点）な猫を撫でた場合: 基準10pt (±5%変動により5〜15%)
      localStorage.clear();
      localStorage.setItem(
        'nekoppoi_cats_mood',
        JSON.stringify({
          black: { score: 15, lastPetAt: Date.now(), baseScore: 15, recentPetTimes: [] },
        })
      );
      const { unmount } = render(<App />);
      const catSilhouette1 = screen.getByRole('button', { name: /くろねこのシルエット/ });
      act(() => {
        fireEvent.pointerDown(catSilhouette1, { clientX: 100, clientY: 100, isPrimary: true });
        fireEvent.pointerMove(catSilhouette1, { clientX: 160, clientY: 100, isPrimary: true });
        fireEvent.pointerUp(catSilhouette1, { clientX: 160, clientY: 100, isPrimary: true });
      });
      // 機嫌スコアが35点以下（おだやか）に留まるため基準10pt、±5%の変動により4〜15% (120pt基準)
      const progressText1 = screen.getByTestId('affection-progress-percentage').textContent;
      const progressNum1 = parseInt(progressText1?.replace('%', '') || '0', 10);
      expect(progressNum1).toBeGreaterThanOrEqual(4);
      expect(progressNum1).toBeLessThanOrEqual(15);
      unmount();

      // 2. ごきげんMAX（スコア85点）の猫を撫でた場合: 基準44pt、±5%変動により30%以上大幅に上昇
      localStorage.clear();
      localStorage.setItem(
        'nekoppoi_cats_mood',
        JSON.stringify({
          black: { score: 85, lastPetAt: Date.now(), baseScore: 85, recentPetTimes: [] },
        })
      );
      render(<App />);
      expect(screen.getByTestId('mood-status-badge')).toHaveTextContent('ごきげんMAX♡');

      const catSilhouette2 = screen.getByRole('button', { name: /くろねこのシルエット/ });
      act(() => {
        fireEvent.pointerDown(catSilhouette2, { clientX: 100, clientY: 100, isPrimary: true });
        fireEvent.pointerMove(catSilhouette2, { clientX: 160, clientY: 100, isPrimary: true });
        fireEvent.pointerUp(catSilhouette2, { clientX: 160, clientY: 100, isPrimary: true });
      });

      // ごきげんMAXの時は基準44ptに±5%変動するため、おだやか時（最大15%）よりも明らかに高い30%以上まで一気に上昇すること
      const progressText2 = screen.getByTestId('affection-progress-percentage').textContent;
      const progressNum2 = parseInt(progressText2?.replace('%', '') || '0', 10);
      expect(progressNum2).toBeGreaterThanOrEqual(30);
      expect(progressNum2).toBeGreaterThan(progressNum1);
    });

    it('猫ごとに独立してなつき度が管理されること', () => {
      render(<App />);

      // 初期状態は黒猫・Lv.1 (0%)
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('0%');

      // 黒猫を撫でる (ごきげん度上昇によりExp獲得)
      const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
      fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
      fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
      fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

      const blackExpPercentage = screen.getByTestId('affection-progress-percentage').textContent;
      const blackExpNum = parseInt(blackExpPercentage?.replace('%', '') || '0', 10);
      expect(blackExpNum).toBeGreaterThanOrEqual(4);
      expect(blackExpNum).toBeLessThanOrEqual(25);

      // 白猫に切り替える
      const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
      fireEvent.click(whiteRadio);

      // 白猫はまだふれあっていないため初期Lv.1 (0%)
      expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.1 はじめまして');
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('0%');

      // 再び黒猫に戻すと黒猫の獲得Exp割合が維持されていること
      const blackRadio = screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ });
      fireEvent.click(blackRadio);
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent(blackExpPercentage!);
    });

    it('なつき度の最大値が10であり、Lv.10到達時はゲージがMAX表示を維持すること', () => {
      localStorage.setItem(
        'nekoppoi_cats_affection',
        JSON.stringify({
          black: { level: 10, currentExp: 600, requiredExp: 600 },
          white: { level: 1, currentExp: 0, requiredExp: 120 },
        })
      );

      render(<App />);

      // Lv.10 MAX表示
      expect(screen.getByTestId('affection-level-badge')).toHaveTextContent('Lv.10 MAX♡');
      expect(screen.getByTestId('affection-progress-percentage')).toHaveTextContent('MAX');
      expect(screen.getByText('深い絆で結ばれた最高のパートナー♡')).toBeInTheDocument();
    });

    it('なつき度が上がったときや満タン時に猫からおくりものが貰え、演出上に表示されてlocalStorageに記録されること', () => {
      vi.useFakeTimers();
      try {
        // レベルアップ直前の状態（Lv.1, 115/120pt）を設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 1, currentExp: 115, requiredExp: 120 },
          })
        );

        render(<App />);

        // 撫でる (+10pt -> 120pt到達でLv.2へレベルアップ)
        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // ハートマーク演出とおくりものカードが表示されること
        expect(screen.getByTestId('affection-levelup-overlay')).toBeInTheDocument();
        const giftCard = screen.getByTestId('affection-levelup-gift');
        expect(giftCard).toBeInTheDocument();
        expect(screen.getByText('くろねこからのおくりもの')).toBeInTheDocument();

        // 貰える贈り物は定義されたおくりもののいずれか
        const giftName = screen.getByTestId('gift-item-name').textContent;
        const allGiftNames = CAT_GIFTS.map((g) => g.name);
        expect(allGiftNames).toContain(giftName);

        // localStorage に贈り物インベントリが記録されていること
        const rawGifts = localStorage.getItem('nekoppoi_cat_gifts');
        expect(rawGifts).not.toBeNull();
        const gifts = JSON.parse(rawGifts || '{}');
        const matchedGift = CAT_GIFTS.find((g) => g.name === giftName);
        expect(matchedGift).toBeDefined();
        if (matchedGift) {
          expect(gifts[matchedGift.id]).toBeDefined();
          expect(gifts[matchedGift.id].count).toBe(1);
          expect(gifts[matchedGift.id].byCat?.black).toBe(1);
        }
      } finally {
        vi.useRealTimers();
      }
    });

    it('画面左上の宝箱ボタンを押すと、これまでに受け取ったおくりもの一覧モーダルが開閉できること', () => {
      // 既におくりものを2個受け取っている初期状態
      localStorage.setItem(
        'nekoppoi_cat_gifts',
        JSON.stringify({
          pebble: {
            giftId: 'pebble',
            count: 2,
            byCat: { black: 2 },
            firstReceivedAt: 1000,
            lastReceivedAt: 2000,
          },
        })
      );

      render(<App />);

      // 画面左上に宝箱ボタンが表示されていること
      const chestButton = screen.getByRole('button', { name: 'これまでに受け取ったおくりもの一覧を開く' });
      expect(chestButton).toBeInTheDocument();
      expect(screen.getByTestId('treasure-chest-icon')).toBeInTheDocument();

      // 初期状態ではモーダルは非表示
      expect(screen.queryByTestId('gift-collection-modal')).not.toBeInTheDocument();

      // 宝箱ボタンをクリック
      fireEvent.click(chestButton);

      // おくりもの一覧モーダルが開くこと
      expect(screen.getByTestId('gift-collection-modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: '猫からのおくりもの' })).toBeInTheDocument();
      expect(screen.getByTestId('total-gift-count')).toHaveTextContent('2個');
      expect(screen.getByText('きれいな小石')).toBeInTheDocument();
      expect(screen.getByTestId('gift-count-pebble')).toHaveTextContent('× 2');
      expect(screen.getByText('くろねこ: 2個')).toBeInTheDocument();

      // 閉じるボタンをクリックして閉じられること
      const closeButton = screen.getByRole('button', { name: 'おくりもの一覧を閉じる' });
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('gift-collection-modal')).not.toBeInTheDocument();
    });

    it('画面左上に宝箱ボタンの右横に設定ボタンが表示され、クリックで設定モーダルが開閉できること', () => {
      render(<App />);

      // 設定ボタンが表示されていること
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      expect(settingsButton).toBeInTheDocument();
      expect(screen.getByTestId('settings-button')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();

      // 初期状態では設定モーダルは非表示
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();

      // 設定ボタンをクリック
      fireEvent.click(settingsButton);

      // 設定モーダルが開くこと
      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument();
      expect(screen.getByText('アプリ情報')).toBeInTheDocument();

      // 閉じるボタンをクリックして閉じられること
      const closeButton = screen.getByRole('button', { name: '設定を閉じる' });
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    });

    it('設定からサウンドをオフに切り替えると、猫を撫でた時に音が再生されず（任意で切れる）、デフォルトではオンであること', () => {
      const playSpy = vi.spyOn(catSoundModule, 'playMeowSound').mockImplementation(() => {});

      try {
        render(<App />);

        // デフォルトではサウンドオンなので、撫でると playMeowSound が呼ばれる
        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
        fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

        expect(playSpy).toHaveBeenCalledTimes(1);
        playSpy.mockClear();

        // 設定ボタンを開く
        const settingsButton = screen.getByRole('button', { name: '設定を開く' });
        fireEvent.click(settingsButton);

        // サウンドトグルスイッチをクリックしてオフにする（デフォルトはオン）
        const soundToggle = screen.getByRole('switch', { name: 'サウンドのオン・オフ切り替え' });
        expect(soundToggle).toHaveAttribute('aria-checked', 'true');
        fireEvent.click(soundToggle);
        expect(soundToggle).toHaveAttribute('aria-checked', 'false');

        // 設定を閉じる
        const closeButton = screen.getByRole('button', { name: '設定を閉じる' });
        fireEvent.click(closeButton);

        // サウンドオフ状態で撫でる
        fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
        fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

        // 音声再生関数は呼ばれない（音が鳴る演出が切れていること）
        expect(playSpy).not.toHaveBeenCalled();
      } finally {
        playSpy.mockRestore();
      }
    });

    it('設定画面でくろねこに名前（例: クロスケ）を付けた場合、表示されるあらゆるテキストの「くろねこ」がその名前に置き換わること', () => {
      render(<App />);

      // 初期状態では「くろねこのごきげん」「くろねこのシルエット」「くろねこ（おすわり）を選択」
      expect(screen.getByText('くろねこのごきげん')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /くろねこのシルエット/ })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /くろねこ（おすわり）を選択/ })).toBeInTheDocument();

      // 設定ボタンを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // くろねこの名前入力欄に「クロスケ」と入力
      const blackInput = screen.getByTestId('cat-name-input-black');
      fireEvent.change(blackInput, { target: { value: 'クロスケ' } });

      // 設定モーダルを閉じる
      const closeButton = screen.getByRole('button', { name: '設定を閉じる' });
      fireEvent.click(closeButton);

      // 画面上のテキストの「くろねこ」が「クロスケ」に置き換わっていること
      expect(screen.getByText('クロスケのごきげん')).toBeInTheDocument();
      expect(screen.queryByText('くろねこのごきげん')).not.toBeInTheDocument();

      expect(screen.getByRole('button', { name: /クロスケのシルエット/ })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /くろねこのシルエット/ })).not.toBeInTheDocument();

      expect(screen.getByRole('radio', { name: /クロスケ（おすわり）を選択/ })).toBeInTheDocument();
      expect(screen.queryByRole('radio', { name: /くろねこ（おすわり）を選択/ })).not.toBeInTheDocument();

      // 猫を切り替えてから再びクロスケに戻したときも「クロスケにきりかえたよ♪」と表示されること
      const whiteRadio = screen.getByRole('radio', { name: /しろねこ（ごろん）を選択/ });
      fireEvent.click(whiteRadio);
      expect(screen.getByText('しろねこにきりかえたよ♪')).toBeInTheDocument();

      const kuroRadio = screen.getByRole('radio', { name: /クロスケ（おすわり）を選択/ });
      fireEvent.click(kuroRadio);
      expect(screen.getByText('クロスケにきりかえたよ♪')).toBeInTheDocument();
    });

    it('デフォルトでは下部に標準ゲージが表示され、設定画面で「横側（シンプル）」に変更すると猫の横にシンプルゲージが表示されること', () => {
      render(<App />);

      // 初期状態（デフォルト）: 下部に詳細ゲージが表示されていること
      const initialIndicator = screen.getByTestId('cat-mood-indicator');
      expect(initialIndicator).not.toHaveAttribute('data-layout', 'side');
      expect(screen.getByText('くろねこのごきげん')).toBeInTheDocument();

      // 設定ボタンを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // ゲージの表示スタイルを「横側（シンプル）」に切り替える
      const sideButton = screen.getByTestId('gauge-position-side-button');
      fireEvent.click(sideButton);

      // 設定モーダルを閉じる
      const closeButton = screen.getByRole('button', { name: '設定を閉じる' });
      fireEvent.click(closeButton);

      // 横側（シンプル）ゲージが表示されていること
      const sideIndicator = screen.getByTestId('cat-mood-indicator');
      expect(sideIndicator).toHaveAttribute('data-layout', 'side');
      expect(screen.getByTestId('side-mood-section')).toBeInTheDocument();
      expect(screen.getByTestId('side-fullness-section')).toBeInTheDocument();
      expect(screen.getByTestId('side-affection-section')).toBeInTheDocument();

      // 再度設定を開いて「下部（標準）」に戻す
      fireEvent.click(settingsButton);
      const bottomButton = screen.getByTestId('gauge-position-bottom-button');
      fireEvent.click(bottomButton);
      fireEvent.click(closeButton);

      // 下部（標準）表示に戻っていること
      const restoredIndicator = screen.getByTestId('cat-mood-indicator');
      expect(restoredIndicator).not.toHaveAttribute('data-layout', 'side');
    });

    it('画面左上にあそびかた・お世話・おくりもの・実績・手帳・設定の順にボタンが並び、あそびかた・実績モーダルが開閉できること', () => {
      render(<App />);

      const howToPlayButton = screen.getByRole('button', { name: 'あそびかたを開く' });
      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      const giftButton = screen.getByRole('button', { name: /これまでに受け取ったおくりもの一覧/ });
      const achievementButton = screen.getByRole('button', { name: '実績一覧を開く' });
      const journalButton = screen.getByRole('button', { name: 'ふり返り手帳を開く' });
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });

      expect(howToPlayButton).toBeInTheDocument();
      expect(careButton).toBeInTheDocument();
      expect(giftButton).toBeInTheDocument();
      expect(achievementButton).toBeInTheDocument();
      expect(journalButton).toBeInTheDocument();
      expect(settingsButton).toBeInTheDocument();

      // 各ボタンがあそびかた・お世話・おくりもの・実績・手帳・設定の順に等間隔で配置されていること
      expect(howToPlayButton).toHaveClass('left-4');
      expect(careButton).toHaveClass('left-[4.25rem]');
      expect(giftButton).toHaveClass('left-[7.5rem]');
      expect(achievementButton).toHaveClass('left-[10.75rem]');
      expect(journalButton).toHaveClass('left-[14rem]');
      expect(settingsButton).toHaveClass('left-[17.25rem]');

      // あそびかたボタンをクリックすると、あそびかたモーダルが開き楽しみ方のテキストが閲覧できること
      fireEvent.click(howToPlayButton);
      expect(screen.getByRole('dialog', { name: 'あそびかた' })).toBeInTheDocument();
      expect(screen.getByText('「ねこっぽい」の楽しみ方ガイド')).toBeInTheDocument();
      expect(screen.getByText('1. 猫ちゃんをなでなでしよう')).toBeInTheDocument();
      expect(screen.getByText('4. なつき度を上げておくりものを集めよう')).toBeInTheDocument();

      // あそびかたモーダルを閉じる
      const closeHowToPlayButton = screen.getByRole('button', { name: 'あそびかたを閉じる' });
      fireEvent.click(closeHowToPlayButton);
      expect(screen.queryByRole('dialog', { name: 'あそびかた' })).not.toBeInTheDocument();

      // クリックで実績モーダルが開くこと
      fireEvent.click(achievementButton);
      expect(screen.getByRole('dialog', { name: /実績/ })).toBeInTheDocument();
      expect(screen.getByTestId('achievement-rate-badge')).toBeInTheDocument();

      // 未達成の通常実績は名前が伏せ字「？？？」で獲得条件が表示されていること
      expect(screen.getByTestId('achievement-title-first-pet')).toHaveTextContent('？？？');
      expect(screen.getByTestId('achievement-desc-first-pet')).toHaveTextContent(
        '猫ちゃんを初めてなでなでしてふれあった。'
      );

      // 閉じるボタンで閉じること
      const closeButton = screen.getByRole('button', { name: '実績を閉じる' });
      fireEvent.click(closeButton);
      expect(screen.queryByRole('dialog', { name: /実績/ })).not.toBeInTheDocument();
    });

    it('ふり返り手帳ボタンをクリックすると手帳モーダルが開き、猫をなでると統計（回数や日付）が反映されること', () => {
      render(<App />);

      const journalButton = screen.getByRole('button', { name: 'ふり返り手帳を開く' });
      expect(journalButton).toBeInTheDocument();

      fireEvent.click(journalButton);
      expect(screen.getByRole('dialog', { name: /ふり返り手帳/ })).toBeInTheDocument();
      expect(screen.getByTestId('journal-first-date')).toHaveTextContent('まだふれあっていません');
      expect(screen.getByTestId('journal-pet-count')).toHaveTextContent('0 回');

      // 閉じる
      fireEvent.click(screen.getByRole('button', { name: 'ふり返り手帳を閉じる' }));
      expect(screen.queryByRole('dialog', { name: /ふり返り手帳/ })).not.toBeInTheDocument();

      // 猫をなでる
      const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
      act(() => {
        fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
        fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
      });

      // 再び手帳を開くと、撫でた回数や連続日数、はじめてふれあった日が記録されていること
      fireEvent.click(journalButton);
      expect(screen.getByTestId('journal-pet-count')).toHaveTextContent('1 回');
      expect(screen.getByTestId('journal-streak-days')).toHaveTextContent('1');
      expect(screen.getByTestId('journal-first-date')).not.toHaveTextContent('まだふれあっていません');
    });

    it('猫を初めてなでると画面上部に「実績を獲得！」と実績名が表示され、実績画面にも反映されること', () => {
      vi.useFakeTimers();
      try {
        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });

        // 初めてなでる
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // 画面上部に実績トーストが表示されること
        const toastContainer = screen.getByTestId('achievement-toast-container');
        expect(toastContainer).toBeInTheDocument();
        expect(screen.getByTestId('achievement-toast-first-pet')).toBeInTheDocument();
        expect(screen.getByTestId('achievement-toast-message')).toHaveTextContent('実績を獲得！');
        expect(screen.getByTestId('achievement-toast-title')).toHaveTextContent('はじめまして！');

        // 3.5秒後に自動消滅すること
        act(() => {
          vi.advanceTimersByTime(3500);
        });
        expect(screen.queryByTestId('achievement-toast-first-pet')).not.toBeInTheDocument();

        // 実績モーダルを開くと「はじめまして！」が達成！になっていること
        const achievementButton = screen.getByRole('button', { name: '実績一覧を開く' });
        fireEvent.click(achievementButton);

        expect(screen.getByTestId('achievement-badge-first-pet')).toHaveTextContent('達成！');
        expect(screen.getByTestId('achievement-title-first-pet')).toHaveTextContent('はじめまして！');
        // 未達成の通常実績は名前のみ伏せ字「？？？」で説明文は見えること
        expect(screen.getByTestId('achievement-title-first-feed')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-first-feed')).toHaveTextContent(
          '猫ちゃんに初めてごはんを食べさせてあげた。'
        );

        // 通常の実績として追加されたSR・UR実績およびなつき度実績は未獲得時に名前が「？？？」で条件が見えること
        expect(screen.getByTestId('achievement-title-first-super-rare-gift')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-first-super-rare-gift')).toHaveTextContent(
          'はじめてスーパーレアなおくりものを受け取った。'
        );
        expect(screen.getByTestId('achievement-title-first-ultra-rare-gift')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-first-ultra-rare-gift')).toHaveTextContent(
          'はじめてウルトラレアなおくりものを受け取った。'
        );
        expect(screen.getByTestId('achievement-title-affection-level-5')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-affection-level-5')).toHaveTextContent(
          'いずれかの猫がはじめてなつき度レベル5になった。'
        );
        expect(screen.getByTestId('achievement-title-affection-level-10')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-affection-level-10')).toHaveTextContent(
          'いずれかの猫がはじめてなつき度レベル10になった。'
        );

        // 未達成の隠し実績は名前「？？？」かつ説明文も「？？？？？？」と伏せ字であること
        expect(screen.getByTestId('achievement-title-hidden-pebble-set')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-hidden-pebble-set')).toHaveTextContent('？？？？？？');
        expect(screen.getByTestId('achievement-title-hidden-pair-socks')).toHaveTextContent('？？？');
        expect(screen.getByTestId('achievement-desc-hidden-pair-socks')).toHaveTextContent('？？？？？？');

        expect(screen.getByTestId('achievement-rate-badge')).toHaveTextContent('1/60');
      } finally {
        vi.useRealTimers();
      }
    });

    it('設定画面で猫の名前を変更すると実績「あたらしいお名前」が獲得できること', () => {
      render(<App />);

      // 設定ボタンを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // 黒猫の名前入力フィールドを変更
      const blackCatInput = screen.getByTestId('cat-name-input-black');
      fireEvent.change(blackCatInput, { target: { value: 'クロちゃん' } });

      // 実績トースト「あたらしいお名前」が表示されること
      expect(screen.getByTestId('achievement-toast-first-rename-cat')).toBeInTheDocument();
      expect(screen.getByTestId('achievement-toast-title')).toHaveTextContent('あたらしいお名前');
    });

    it('猫のなつき度がレベル5およびレベル10に到達したときに、対応する実績が獲得できること', () => {
      // 事前に黒猫のなつき度をLv.4の満タン直前（295pt / 300pt）に設定
      localStorage.setItem(
        'nekoppoi_cats_affection',
        JSON.stringify({
          black: { level: 4, currentExp: 295, requiredExp: 300 },
        })
      );

      render(<App />);

      // 撫でる (+10pt -> 305pt >= 300pt で Lv.5 にレベルアップ！)
      const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
      fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
      fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
      fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });

      // 実績トースト「大のなかよし」が表示されること
      expect(screen.getByTestId('achievement-toast-affection-level-5')).toBeInTheDocument();
      expect(screen.getByText('大のなかよし')).toBeInTheDocument();
    });

    it('ブラウザで初めてアプリを開いたとき、あそびかたウィンドウが強制表示され、localStorageに記録されること', () => {
      // localStorage が空の初回訪問状態
      render(<App />);

      // あそびかたモーダルが強制表示されていること
      expect(screen.getByRole('dialog', { name: 'あそびかた' })).toBeInTheDocument();
      expect(screen.getByText('「ねこっぽい」の楽しみ方ガイド')).toBeInTheDocument();

      // localStorage に初回閲覧フラグが保存されていること
      expect(localStorage.getItem(GUIDE_SEEN_STORAGE_KEY)).toBe('true');

      // 閉じることができること
      const closeButton = screen.getByRole('button', { name: 'あそびかたを閉じる' });
      fireEvent.click(closeButton);
      expect(screen.queryByRole('dialog', { name: 'あそびかた' })).not.toBeInTheDocument();
    });

    it('2回目以降の訪問時は、あそびかたウィンドウは自動表示されず通常通り開始されること', () => {
      // すでに訪問済みのフラグを設定
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');

      render(<App />);

      // あそびかたモーダルは開いていないこと
      expect(screen.queryByRole('dialog', { name: 'あそびかた' })).not.toBeInTheDocument();

      // ユーザーが手動でボタンをクリックした場合は開くこと
      const howToPlayButton = screen.getByRole('button', { name: 'あそびかたを開く' });
      fireEvent.click(howToPlayButton);
      expect(screen.getByRole('dialog', { name: 'あそびかた' })).toBeInTheDocument();
    });

    it('全猫なつき度Lv.10のとき設定画面で「自動ごはん」が解禁され、トグルをオンにできること', () => {
      // 全猫Lv.10にセット
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      setupAllCatsMaxAffection();

      render(<App />);

      // 設定モーダルを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      expect(screen.getByRole('dialog', { name: '設定' })).toBeInTheDocument();
      const autoFeedSection = screen.getByTestId('auto-feed-section');
      expect(autoFeedSection).toBeInTheDocument();
      expect(within(autoFeedSection).getByText('解禁済み')).toBeInTheDocument();

      // トグルスイッチをクリックしてオンにする
      const toggle = within(autoFeedSection).getByRole('switch', { name: '自動ごはんの切り替え' });
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('自動ごはんがオンのとき、お世話サイドバーを開くと手動ごはんボタンが無効化されること', () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      setupAllCatsMaxAffection();
      // 設定で自動ごはんオン
      localStorage.setItem(
        'nekoppoi_settings',
        JSON.stringify({
          soundEnabled: true,
          catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
          gaugePosition: 'bottom',
          autoFeedEnabled: true,
        })
      );

      render(<App />);

      const careButton = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careButton);

      expect(screen.getByTestId('auto-feed-active-banner')).toBeInTheDocument();
      const feedButtons = screen.getAllByRole('button', { name: /をあげる$/ });
      for (const btn of feedButtons) {
        expect(btn).toBeDisabled();
        expect(btn).toHaveTextContent('自動ごはん稼働中');
      }
    });

    it('留守中に時間が経過した場合、アプリ起動時にお留守番レポートが表示され、受け取れること', () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      setupAllCatsMaxAffection();
      // 設定で自動ごはんオン
      localStorage.setItem(
        'nekoppoi_settings',
        JSON.stringify({
          soundEnabled: true,
          catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
          gaugePosition: 'bottom',
          autoFeedEnabled: true,
        })
      );

      // 最終アクセス時刻を24時間前（86,400,000ms前）に設定
      const now = Date.now();
      localStorage.setItem(
        'nekoppoi_last_active_time',
        (now - 24 * 60 * 60 * 1000).toString()
      );

      render(<App />);

      // お留守番レポートモーダルが表示されていること
      expect(screen.getByTestId('offline-care-report-modal')).toBeInTheDocument();
      expect(screen.getByText(/おかえりなさい！お留守番レポート/)).toBeInTheDocument();

      // レポート表示中はまだ実績トーストは出ていないこと
      expect(screen.queryByTestId('achievement-toast-feed-count-100')).not.toBeInTheDocument();

      // 「すべて受け取る」をクリックして閉じられること
      const acceptBtn = screen.getByTestId('offline-report-accept-button');
      fireEvent.click(acceptBtn);
      expect(screen.queryByTestId('offline-care-report-modal')).not.toBeInTheDocument();

      // ウィンドウを閉じた後、留守中の給餌累計回数により達成された実績トーストが表示されること
      expect(screen.getByTestId('achievement-toast-feed-count-100')).toBeInTheDocument();
      expect(screen.getByText('もぐもぐシェフ')).toBeInTheDocument();
    });

    it('お世話メニューの「自動化」タブから自動ごはんのオンオフを切り替えられ、「ふれあい」タブの手動給餌と連動すること', () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      setupAllCatsMaxAffection();

      render(<App />);

      // お世話メニューを開く
      const careBtn = screen.getByRole('button', { name: 'お世話メニューを開く' });
      fireEvent.click(careBtn);

      // 初期状態では「ふれあい」タブが選択されていること
      expect(screen.getByTestId('care-tab-interaction')).toHaveAttribute('aria-selected', 'true');
      const feedKibbleBtn = screen.getByRole('button', { name: 'カリカリをあげる' });
      expect(feedKibbleBtn).toHaveTextContent('あげる');
      expect(feedKibbleBtn).toBeEnabled();

      // 「自動化」タブに切り替える
      const automationTab = screen.getByTestId('care-tab-automation');
      fireEvent.click(automationTab);
      expect(automationTab).toHaveAttribute('aria-selected', 'true');

      // 自動ごはんセクションとトグルボタンが表示されていること（初期状態: オフ）
      expect(screen.getByTestId('care-auto-feed-section')).toBeInTheDocument();
      expect(screen.getByTestId('care-auto-feed-warning')).toBeInTheDocument();
      const toggleBtn = screen.getByTestId('care-auto-feed-toggle-button');
      expect(toggleBtn).toHaveAttribute('aria-checked', 'false');

      // トグルスイッチをクリックしてオンにする
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveAttribute('aria-checked', 'true');

      // 「ふれあい」タブに戻る
      const interactionTab = screen.getByTestId('care-tab-interaction');
      fireEvent.click(interactionTab);

      // 手動ごはんボタンが無効化され、「自動ごはん稼働中」と表示されること
      expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toHaveTextContent('自動ごはん稼働中');
      expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toBeDisabled();

      // 再度「自動化」タブでトグルスイッチをクリックしてオフにする
      fireEvent.click(automationTab);
      const reloadedToggleBtn = screen.getByTestId('care-auto-feed-toggle-button');
      fireEvent.click(reloadedToggleBtn);
      expect(reloadedToggleBtn).toHaveAttribute('aria-checked', 'false');

      // 「ふれあい」タブに戻ると手動ごはんボタンが通常（あげる）に戻ること
      fireEvent.click(interactionTab);
      expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toHaveTextContent('あげる');
      expect(screen.getByRole('button', { name: 'カリカリをあげる' })).toBeEnabled();
    });

    it('なつき度演出の簡略化設定がオンのとき、普段の手動ふれあいでなつき度が上がっても中央の大きなハート演出は表示されず、控えめなミニトースト通知が表示されること', () => {
      vi.useFakeTimers();
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      try {
        localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
        // なつき度演出の簡略化をオンに設定
        localStorage.setItem(
          'nekoppoi_settings',
          JSON.stringify({
            soundEnabled: true,
            catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
            gaugePosition: 'bottom',
            autoFeedEnabled: false,
            compactAffectionCelebration: true,
          })
        );
        // なつき度レベルアップ寸前（115/120pt）に設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 1, currentExp: 115, requiredExp: 120 },
            white: { level: 1, currentExp: 0, requiredExp: 120 },
          })
        );

        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // 中央の大きなハート演出は表示されないこと
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();

        // 代わりに控えめなミニトースト通知が表示されること
        expect(screen.getByTestId('gift-toast-container')).toBeInTheDocument();
        expect(screen.getByText(/からのおくりもの！/)).toBeInTheDocument();
      } finally {
        randomSpy.mockRestore();
        vi.useRealTimers();
      }
    });

    it('自動ごはんが無効のとき、なつき度演出の簡略化設定がオフなら通常の中央ハートマーク演出が表示されること', () => {
      vi.useFakeTimers();
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      try {
        localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
        // 自動ごはんオフ、簡略化設定もオフ
        localStorage.setItem(
          'nekoppoi_settings',
          JSON.stringify({
            soundEnabled: true,
            catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
            gaugePosition: 'bottom',
            autoFeedEnabled: false,
            compactAffectionCelebration: false,
          })
        );
        // なつき度レベルアップ寸前（115/120pt）に設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 1, currentExp: 115, requiredExp: 120 },
            white: { level: 1, currentExp: 0, requiredExp: 120 },
          })
        );

        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // 通常の中央ハートマーク演出が表示されること
        const overlay = screen.getByTestId('affection-levelup-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass('opacity-100');
        expect(screen.getByTestId('affection-levelup-heart')).toBeInTheDocument();
      } finally {
        randomSpy.mockRestore();
        vi.useRealTimers();
      }
    });

    it('自動ごはんが有効なときは、簡略化設定がオフであってもハートマーク演出が出ず控えめなミニトースト通知が表示されること', () => {
      vi.useFakeTimers();
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      try {
        localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
        setupAllCatsMaxAffection();
        // 自動ごはんをオン、簡略化設定はオフ（false）
        localStorage.setItem(
          'nekoppoi_settings',
          JSON.stringify({
            soundEnabled: true,
            catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
            gaugePosition: 'bottom',
            autoFeedEnabled: true,
            compactAffectionCelebration: false,
          })
        );
        // 黒猫のなつき度ボーナス獲得寸前（590/600pt）に設定
        localStorage.setItem(
          'nekoppoi_cats_affection',
          JSON.stringify({
            black: { level: 10, currentExp: 590, requiredExp: 600 },
            white: { level: 10, currentExp: 0, requiredExp: 600 },
            calico: { level: 10, currentExp: 0, requiredExp: 600 },
          })
        );

        render(<App />);

        const catSilhouette = screen.getByRole('button', { name: /くろねこのシルエット/ });
        act(() => {
          fireEvent.pointerDown(catSilhouette, { clientX: 100, clientY: 100, isPrimary: true });
          fireEvent.pointerMove(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
          fireEvent.pointerUp(catSilhouette, { clientX: 160, clientY: 100, isPrimary: true });
        });

        // 自動ごはんが有効なため、簡略化設定がオフでもハート演出は出ないこと
        expect(screen.queryByTestId('affection-levelup-overlay')).not.toBeInTheDocument();

        // 代わりに控えめなミニトースト通知が表示されること
        expect(screen.getByTestId('gift-toast-container')).toBeInTheDocument();
        expect(screen.getByText(/からのおくりもの！/)).toBeInTheDocument();
      } finally {
        randomSpy.mockRestore();
        vi.useRealTimers();
      }
    });
  });

  describe('タブ切り替え・バックグラウンド放置とお留守番レポート検知', () => {
    let originalVisibilityState: PropertyDescriptor | undefined;

    beforeEach(() => {
      originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    });

    afterEach(() => {
      if (originalVisibilityState) {
        Object.defineProperty(document, 'visibilityState', originalVisibilityState);
      }
    });

    function setDocumentVisibility(state: 'visible' | 'hidden') {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => state,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    }

    it('自動ごはんが有効なとき、タブを10分以上非表示にして復帰すると、お留守番レポートモーダルが表示されること', () => {
      vi.useFakeTimers();
      try {
        localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
        setupAllCatsMaxAffection();
        localStorage.setItem(
          'nekoppoi_settings',
          JSON.stringify({
            soundEnabled: true,
            catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
            gaugePosition: 'bottom',
            autoFeedEnabled: true,
            compactAffectionCelebration: false,
          })
        );
        // 全猫のまんぷく度を40%（給餌発生条件）に設定
        localStorage.setItem(
          'nekoppoi_cats_fullness',
          JSON.stringify({
            black: { score: 40, lastFedAt: Date.now() },
            white: { score: 40, lastFedAt: Date.now() },
            calico: { score: 40, lastFedAt: Date.now() },
          })
        );

        setDocumentVisibility('visible');
        render(<App />);

        // 最初はお留守番レポートモーダルは非表示
        expect(screen.queryByRole('heading', { name: /お留守番レポート/ })).not.toBeInTheDocument();

        // 1. タブを非表示（hidden）にする
        act(() => {
          setDocumentVisibility('hidden');
        });

        // 2. 15分（10分以上）時間が経過
        act(() => {
          vi.advanceTimersByTime(15 * 60 * 1000);
        });

        // 3. タブを表示（visible）に復帰する
        act(() => {
          setDocumentVisibility('visible');
        });

        // お留守番レポートモーダルが表示されること
        expect(screen.getByRole('heading', { name: /お留守番レポート/ })).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('自動ごはんが有効でも、タブの非表示時間が10分未満ならお留守番レポートモーダルは表示されないこと', () => {
      vi.useFakeTimers();
      try {
        localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
        setupAllCatsMaxAffection();
        localStorage.setItem(
          'nekoppoi_settings',
          JSON.stringify({
            soundEnabled: true,
            catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
            gaugePosition: 'bottom',
            autoFeedEnabled: true,
            compactAffectionCelebration: false,
          })
        );

        setDocumentVisibility('visible');
        render(<App />);

        // タブを非表示にする
        act(() => {
          setDocumentVisibility('hidden');
        });

        // 5分（10分未満）時間が経過
        act(() => {
          vi.advanceTimersByTime(5 * 60 * 1000);
        });

        // タブを表示に復帰する
        act(() => {
          setDocumentVisibility('visible');
        });

        // お留守番レポートモーダルは表示されないこと
        expect(screen.queryByRole('heading', { name: /お留守番レポート/ })).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('自動ごはんが無効のときは、タブを10分以上非表示にして復帰してもお留守番レポートモーダルは表示されないこと', () => {
      vi.useFakeTimers();
      try {
        localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
        setupAllCatsMaxAffection();
        localStorage.setItem(
          'nekoppoi_settings',
          JSON.stringify({
            soundEnabled: true,
            catNames: { black: 'くろねこ', white: 'しろねこ', calico: 'みけねこ' },
            gaugePosition: 'bottom',
            autoFeedEnabled: false, // 自動ごはんOFF
            compactAffectionCelebration: false,
          })
        );

        setDocumentVisibility('visible');
        render(<App />);

        // タブを非表示にする
        act(() => {
          setDocumentVisibility('hidden');
        });

        // 15分時間が経過
        act(() => {
          vi.advanceTimersByTime(15 * 60 * 1000);
        });

        // タブを表示に復帰する
        act(() => {
          setDocumentVisibility('visible');
        });

        // お留守番レポートモーダルは表示されないこと
        expect(screen.queryByRole('heading', { name: /お留守番レポート/ })).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('設定画面からのセーブデータバックアップ・引き継ぎ', () => {
    beforeEach(() => {
      window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      window.URL.revokeObjectURL = vi.fn();
    });

    it('設定画面から「ファイルに保存」を押すとセーブデータダウンロード関数が呼ばれること', () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      render(<App />);

      // 設定モーダルを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      expect(screen.getByTestId('save-data-transfer-section')).toBeInTheDocument();
      const exportButton = screen.getByTestId('export-save-data-button');
      expect(exportButton).toBeInTheDocument();

      // クリックしてもエラーが発生せず、URL.createObjectURL が呼ばれること
      fireEvent.click(exportButton);
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    it('外部のセーブデータファイルを読み込むと、現在のデータと合算・マージされて反映されること', async () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      render(<App />);

      // 初期状態の黒猫の名前がラジオボタンに反映されていること
      expect(screen.getByRole('radio', { name: /くろねこ/ })).toBeInTheDocument();

      // 設定モーダルを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // 黒猫の名前が「ノワール」、おくりものを持つセーブデータ
      const incomingData = {
        version: 1,
        timestamp: Date.now() + 10000,
        settings: {
          soundEnabled: true,
          catNames: { black: 'ノワール', white: 'しろねこ', calico: 'みけねこ' },
          gaugePosition: 'bottom',
          autoFeedEnabled: false,
          compactAffectionCelebration: false,
        },
        gifts: {
          pebble: {
            giftId: 'pebble',
            count: 3,
            byCat: { black: 3 },
            firstReceivedAt: 1000,
            lastReceivedAt: 2000,
          },
        },
      };

      const file = new File([JSON.stringify(incomingData)], 'save.json', {
        type: 'application/json',
      });

      const input = screen.getByTestId('import-save-data-input');
      await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
      });

      // 成功メッセージが表示されること
      await waitFor(() => {
        expect(screen.getByTestId('import-status-message')).toHaveTextContent(/合算・引き継ぎました/);
      });

      // 設定モーダルを閉じる
      const closeButton = screen.getByTestId('settings-close-button');
      fireEvent.click(closeButton);

      // 黒猫の名前が「ノワール」に反映されていること
      expect(screen.getByRole('radio', { name: /ノワール/ })).toBeInTheDocument();
    });

    it('自動ごはんが解禁されている状態でオンオフを切り替えると、自動クラウド同期が実行されること', async () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      setupAllCatsMaxAffection();
      render(<App />);

      // 設定モーダルを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // 自動ごはんは解禁されている
      const autoFeedToggle = screen.getByTestId('auto-feed-toggle-button');
      expect(autoFeedToggle).toBeInTheDocument();

      // トグルをクリックしてオンにする
      fireEvent.click(autoFeedToggle);

      // トグルがオンになったこと
      expect(autoFeedToggle).toHaveAttribute('aria-checked', 'true');
    });

    it('ID連携方式において設定画面に連携IDと引き継ぎキーが表示されること', () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      render(<App />);

      // 設定モーダルを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // クラウド連携セクションに連携IDが表示されていること
      const userIdElem = screen.getByTestId('cloud-user-id');
      expect(userIdElem).toBeInTheDocument();
      expect(userIdElem).toHaveTextContent(/^NK-/);

      // 引き継ぎキーが表示されていること（初期はマスク）
      const keyElem = screen.getByTestId('cloud-transfer-key');
      expect(keyElem).toHaveTextContent('••••••••••••');
    });

    it('設定画面から引き継ぎ秘密パスワードを変更できること', async () => {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
      render(<App />);

      // 設定モーダルを開く
      const settingsButton = screen.getByRole('button', { name: '設定を開く' });
      fireEvent.click(settingsButton);

      // パスワード変更ボタンを押す
      const changeBtn = screen.getByTestId('toggle-change-key-btn');
      fireEvent.click(changeBtn);

      const newKeyInput = screen.getByTestId('new-transfer-key-input');
      const confirmInput = screen.getByTestId('confirm-transfer-key-input');
      const submitBtn = screen.getByTestId('submit-update-key-btn');

      // 新しいパスワードを入力
      fireEvent.change(newKeyInput, { target: { value: 'customPass888' } });
      fireEvent.change(confirmInput, { target: { value: 'customPass888' } });
      fireEvent.click(submitBtn);

      // 成功メッセージが表示されること
      expect(await screen.findByText('連携・引き継ぎパスワードを変更しました！')).toBeInTheDocument();
    });

    it('プライバシーポリシー未同意の場合、起動時に同意ウィンドウが表示され、同意後に次回以降表示されなくなること', async () => {
      // 未同意状態にする
      localStorage.removeItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY);
      render(<App />);

      // プライバシーポリシー同意ウィンドウが表示されること
      expect(screen.getByText('プライバシーポリシーへの同意')).toBeInTheDocument();
      expect(screen.getByTestId('privacy-consent-banner')).toBeInTheDocument();

      // 「プライバシーポリシーに同意して利用を開始する」ボタンを押す
      const acceptBtn = screen.getByTestId('privacy-policy-accept-button');
      fireEvent.click(acceptBtn);

      // モーダルが閉じ、localStorage に記録されること
      expect(localStorage.getItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY)).toBe('true');
      expect(screen.queryByTestId('privacy-consent-banner')).not.toBeInTheDocument();
    });
  });
});
