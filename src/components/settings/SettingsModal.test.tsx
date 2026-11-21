import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsModal } from './SettingsModal.tsx';
import { DEFAULT_CAT_NAMES } from '../../types/settings.ts';

describe('SettingsModal コンポーネント', () => {
  it('isOpen が false のときは何もレンダリングされないこと', () => {
    const { container } = render(<SettingsModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('isOpen が true のとき、設定ウィンドウとタイトル・歯車アイコンが表示され、バージョン表記は存在しないこと', () => {
    render(<SettingsModal isOpen={true} onClose={vi.fn()} isSoundEnabled={true} />);

    expect(screen.getByRole('dialog', { name: '設定' })).toBeInTheDocument();
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument();
    expect(screen.getAllByTestId('settings-icon').length).toBeGreaterThan(0);
    expect(screen.getByText('アプリ情報')).toBeInTheDocument();
    expect(screen.getByText('ねこっぽい')).toBeInTheDocument();

    // 要件: バージョンについての表記は削除されていること
    expect(screen.queryByText(/バージョン/)).not.toBeInTheDocument();
    expect(screen.queryByText(/0\.1\.0/)).not.toBeInTheDocument();
  });

  it('サウンドトグルスイッチが表示され、クリックで onToggleSound が呼ばれること', () => {
    const handleToggle = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        isSoundEnabled={true}
        onToggleSound={handleToggle}
      />
    );

    const toggleButton = screen.getByRole('switch', { name: 'サウンドのオン・オフ切り替え' });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');

    // トグルをクリックすると反対の値（false）でコールバックが発火すること
    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it('isSoundEnabled が false のときはトグルがオフ状態（aria-checked="false"）になること', () => {
    const handleToggle = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        isSoundEnabled={false}
        onToggleSound={handleToggle}
      />
    );

    const toggleButton = screen.getByRole('switch', { name: 'サウンドのオン・オフ切り替え' });
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(/サウンドは現在オフです/)).toBeInTheDocument();

    // クリックすると true でコールバックが発火すること
    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('猫ごとに名前を入力できるテキストフォームが表示され、入力で onUpdateCatName が呼ばれること', () => {
    const handleUpdateCatName = vi.fn();
    const handleResetCatNames = vi.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        catNames={{ black: 'クロ', white: 'シロ', calico: 'ミケ' }}
        onUpdateCatName={handleUpdateCatName}
        onResetCatNames={handleResetCatNames}
      />
    );

    expect(screen.getByTestId('cat-name-section')).toBeInTheDocument();
    expect(screen.getByText('猫ちゃんのお名前')).toBeInTheDocument();

    // 3匹分の名前入力フィールド
    const blackInput = screen.getByTestId('cat-name-input-black') as HTMLInputElement;
    const whiteInput = screen.getByTestId('cat-name-input-white') as HTMLInputElement;
    const calicoInput = screen.getByTestId('cat-name-input-calico') as HTMLInputElement;

    expect(blackInput.value).toBe('クロ');
    expect(whiteInput.value).toBe('シロ');
    expect(calicoInput.value).toBe('ミケ');

    // 要件: ポーズ名（おすわり・ごろん・たち）の記述は削除され、カラーサークルと入力フォームのみになっていること
    expect(screen.queryByText('おすわり')).not.toBeInTheDocument();
    expect(screen.queryByText('ごろん')).not.toBeInTheDocument();
    expect(screen.queryByText('たち')).not.toBeInTheDocument();

    // カラーサークルが表示されていること
    expect(screen.getByTestId('cat-swatch-black')).toBeInTheDocument();
    expect(screen.getByTestId('cat-swatch-white')).toBeInTheDocument();
    expect(screen.getByTestId('cat-swatch-calico')).toBeInTheDocument();

    // プレースホルダーにはデフォルト名が表示されていること
    expect(blackInput.placeholder).toBe(DEFAULT_CAT_NAMES.black);

    // テキストを入力すると onUpdateCatName が呼ばれること
    fireEvent.change(blackInput, { target: { value: 'クロスケ' } });
    expect(handleUpdateCatName).toHaveBeenCalledWith('black', 'クロスケ');
  });

  it('「初期名に戻す」を押した際に確認画面が表示され、「いいえ」でキャンセル、「はい」で初期名リセットが実行されること（誤操作防止）', () => {
    const handleResetCatNames = vi.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        catNames={{ black: 'クロ', white: 'シロ', calico: 'ミケ' }}
        onResetCatNames={handleResetCatNames}
      />
    );

    const resetButton = screen.getByTestId('reset-cat-names-button');
    expect(resetButton).toBeInTheDocument();

    // 初期状態では確認ダイアログは非表示
    expect(screen.queryByTestId('reset-confirm-dialog')).not.toBeInTheDocument();

    // 1. 「初期名に戻す」をクリック
    fireEvent.click(resetButton);

    // 確認ダイアログが表示され、まだ onResetCatNames は呼ばれていないこと
    expect(screen.getByTestId('reset-confirm-dialog')).toBeInTheDocument();
    expect(screen.getByText('初期名に戻しますか？')).toBeInTheDocument();
    expect(screen.getByText(/すべての猫ちゃんのお名前を最初の名前に戻します/)).toBeInTheDocument();
    expect(handleResetCatNames).not.toHaveBeenCalled();

    // 2. 「いいえ」をクリックしてキャンセル
    const cancelButton = screen.getByTestId('reset-confirm-cancel-button');
    expect(cancelButton).toHaveTextContent('いいえ');
    fireEvent.click(cancelButton);

    // 確認ダイアログが閉じ、onResetCatNames は呼ばれていないこと
    expect(screen.queryByTestId('reset-confirm-dialog')).not.toBeInTheDocument();
    expect(handleResetCatNames).not.toHaveBeenCalled();

    // 3. 再び「初期名に戻す」をクリックし、今度は「はい」をクリック
    fireEvent.click(resetButton);
    expect(screen.getByTestId('reset-confirm-dialog')).toBeInTheDocument();

    const okButton = screen.getByTestId('reset-confirm-ok-button');
    expect(okButton).toHaveTextContent('はい');
    fireEvent.click(okButton);

    // onResetCatNames が実行され、確認ダイアログが閉じること
    expect(handleResetCatNames).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('reset-confirm-dialog')).not.toBeInTheDocument();
  });

  it('ゲージ表示位置の切り替えボタン（下部・横側）が表示され、クリックで onChangeGaugePosition が呼ばれること', () => {
    const handleChangeGaugePosition = vi.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        gaugePosition="bottom"
        onChangeGaugePosition={handleChangeGaugePosition}
      />
    );

    expect(screen.getByTestId('gauge-position-section')).toBeInTheDocument();
    expect(screen.getByText('ゲージの表示スタイル')).toBeInTheDocument();

    const bottomButton = screen.getByTestId('gauge-position-bottom-button');
    const sideButton = screen.getByTestId('gauge-position-side-button');

    expect(bottomButton).toHaveAttribute('aria-pressed', 'true');
    expect(sideButton).toHaveAttribute('aria-pressed', 'false');

    // 「横側（シンプル）」をクリックすると side でコールバックが呼ばれること
    fireEvent.click(sideButton);
    expect(handleChangeGaugePosition).toHaveBeenCalledWith('side');
  });

  it('閉じるボタンやバックドロップのクリックで onClose が呼ばれること', () => {
    const handleClose = vi.fn();
    render(<SettingsModal isOpen={true} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: '設定を閉じる' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId('settings-modal-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  describe('自動ごはん設定項目', () => {
    it('未解禁（isAutoFeedUnlocked=false）のとき、未解禁バッジとロック説明が表示され、スイッチが無効化されていること', () => {
      const handleToggle = vi.fn();
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isAutoFeedUnlocked={false}
          onToggleAutoFeed={handleToggle}
        />
      );

      expect(screen.getByTestId('auto-feed-section')).toBeInTheDocument();
      expect(screen.getByText('自動ごはん')).toBeInTheDocument();
      expect(screen.getByText('未解禁')).toBeInTheDocument();
      expect(screen.getByText(/全猫（くろねこ・しろねこ・みけねこ）のなつき度がLv\.10/)).toBeInTheDocument();

      const toggleButton = screen.getByRole('switch', { name: '自動ごはんの切り替え' });
      expect(toggleButton).toBeDisabled();
      fireEvent.click(toggleButton);
      expect(handleToggle).not.toHaveBeenCalled();
    });

    it('解禁済み（isAutoFeedUnlocked=true）のとき、スイッチが操作可能になり、クリックで onToggleAutoFeed が呼ばれること', () => {
      const handleToggle = vi.fn();
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isAutoFeedUnlocked={true}
          isAutoFeedEnabled={false}
          onToggleAutoFeed={handleToggle}
        />
      );

      expect(screen.getByText('解禁済み')).toBeInTheDocument();
      const toggleButton = screen.getByRole('switch', { name: '自動ごはんの切り替え' });
      expect(toggleButton).not.toBeDisabled();
      expect(toggleButton).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(toggleButton);
      expect(handleToggle).toHaveBeenCalledWith(true);
    });

    it('isAutoFeedEnabled が true のとき、トグルがオン状態（aria-checked="true"）になり稼働中説明が表示されること', () => {
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isAutoFeedUnlocked={true}
          isAutoFeedEnabled={true}
        />
      );

      const toggleButton = screen.getByRole('switch', { name: '自動ごはんの切り替え' });
      expect(toggleButton).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByText(/全猫のまんぷく度が40%以下になると自動でカリカリを食べます/)).toBeInTheDocument();
    });

    it('自動ごはんカード内に、日付系実績やふれあい日数が進まないことの注意事項（赤文字強調）が表示されること', () => {
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isAutoFeedUnlocked={true}
          isAutoFeedEnabled={true}
        />
      );

      const warningElement = screen.getByTestId('auto-feed-warning');
      expect(warningElement).toBeInTheDocument();
      expect(warningElement).toHaveClass('text-rose-600');
      expect(warningElement).toHaveTextContent(/【ご注意】自動ごはんがオンの状態でアプリを離れても、日付系の実績/);
      expect(warningElement).toHaveTextContent(/ふれあい日数は進みません/);
    });
  });

  describe('なつき度演出の簡略化設定', () => {
    it('デフォルト（オフ状態）でトグルが表示され、クリックで onToggleCompactAffectionCelebration が発火すること', () => {
      const handleToggle = vi.fn();
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCompactAffectionCelebration={false}
          onToggleCompactAffectionCelebration={handleToggle}
        />
      );

      expect(screen.getByTestId('compact-affection-celebration-section')).toBeInTheDocument();
      expect(screen.getByText('なつき度演出の簡略化')).toBeInTheDocument();

      const toggleButton = screen.getByRole('switch', { name: 'なつき度演出の簡略化の切り替え' });
      expect(toggleButton).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByText(/画面中央に大きなハート演出を表示します/)).toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(handleToggle).toHaveBeenCalledWith(true);
    });

    it('isCompactAffectionCelebration が true のとき、トグルがオン状態になり簡略化の説明文が表示されること', () => {
      const handleToggle = vi.fn();
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCompactAffectionCelebration={true}
          onToggleCompactAffectionCelebration={handleToggle}
        />
      );

      const toggleButton = screen.getByRole('switch', { name: 'なつき度演出の簡略化の切り替え' });
      expect(toggleButton).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByText(/控えめな通知（トースト）で表示します/)).toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(handleToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('セーブデータの書き出し・読み込み（データ引き継ぎ）', () => {
    it('セーブデータ引き継ぎセクションが表示され、「ファイルに保存」をクリックすると onExportSaveData が呼ばれること', () => {
      const handleExport = vi.fn();
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          onExportSaveData={handleExport}
        />
      );

      expect(screen.getByTestId('save-data-transfer-section')).toBeInTheDocument();
      expect(screen.getByText('データのバックアップ・引き継ぎ')).toBeInTheDocument();

      const exportButton = screen.getByTestId('export-save-data-button');
      fireEvent.click(exportButton);
      expect(handleExport).toHaveBeenCalledTimes(1);
    });

    it('ファイルを読み込むと onImportSaveData が呼ばれ、成功メッセージが表示されること', async () => {
      const handleImport = vi.fn().mockResolvedValue({
        success: true,
        message: '引き継ぎが完了しました！',
      });

      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          onImportSaveData={handleImport}
        />
      );

      const input = screen.getByTestId('import-save-data-input');
      const file = new File(['{"version":1}'], 'save.json', { type: 'application/json' });

      fireEvent.change(input, { target: { files: [file] } });

      expect(handleImport).toHaveBeenCalledWith(file);
      const statusMessage = await screen.findByTestId('import-status-message');
      expect(statusMessage).toHaveTextContent('引き継ぎが完了しました！');
    });

    it('インポートが失敗した場合はエラーメッセージが表示されること', async () => {
      const handleImport = vi.fn().mockResolvedValue({
        success: false,
        message: '無効なデータです。',
      });

      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          onImportSaveData={handleImport}
        />
      );

      const input = screen.getByTestId('import-save-data-input');
      const file = new File(['invalid'], 'save.json', { type: 'application/json' });

      fireEvent.change(input, { target: { files: [file] } });

      const statusMessage = await screen.findByTestId('import-status-message');
      expect(statusMessage).toHaveTextContent('無効なデータです。');
    });
  });

  describe('クラウドデータ連携（複数端末同期）UI', () => {
    it('isCloudConfigured が false のとき、クラウド未設定の案内が表示されること', () => {
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCloudConfigured={false}
        />
      );

      expect(screen.getByTestId('cloud-sync-section')).toBeInTheDocument();
      expect(screen.getByText(/クラウド設定が未完了です/)).toBeInTheDocument();
    });

    it('cloudCredentials があるとき、連携ID、引き継ぎキー、今すぐ同期ボタンが表示され操作できること', () => {
      const handleSyncNow = vi.fn();
      const sampleCreds = {
        userId: 'NK-A8F2-9X4B',
        transferKey: 'k7Mp2Q9xL4wZ',
        createdAt: 1700000000000,
      };

      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCloudConfigured={true}
          cloudCredentials={sampleCreds}
          cloudLastSyncedAt={1700000000000}
          onCloudSyncNow={handleSyncNow}
        />
      );

      expect(screen.getByTestId('cloud-user-id')).toHaveTextContent('NK-A8F2-9X4B');
      const keyElem = screen.getByTestId('cloud-transfer-key');
      // 最初はマスクされていること
      expect(keyElem).toHaveTextContent('••••••••••••');

      // 表示ボタンを押すとキーが表示されること
      const toggleKeyBtn = screen.getByTestId('toggle-show-key-btn');
      fireEvent.click(toggleKeyBtn);
      expect(keyElem).toHaveTextContent('k7Mp2Q9xL4wZ');

      // 今すぐ同期ボタンが動作すること
      const syncNowBtn = screen.getByTestId('cloud-sync-now-button');
      fireEvent.click(syncNowBtn);
      expect(handleSyncNow).toHaveBeenCalledTimes(1);
    });

    it('「変更」ボタンを押すとパスワード変更フォームが開き、新しいパスワードを設定できること', async () => {
      const handleUpdateKey = vi.fn().mockResolvedValue({ success: true, message: 'パスワードを変更しました！' });
      const sampleCreds = {
        userId: 'NK-A8F2-9X4B',
        transferKey: 'k7Mp2Q9xL4wZ',
        createdAt: 1700000000000,
      };

      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCloudConfigured={true}
          cloudCredentials={sampleCreds}
          onUpdateTransferKey={handleUpdateKey}
        />
      );

      // 変更ボタンを押す
      const changeBtn = screen.getByTestId('toggle-change-key-btn');
      fireEvent.click(changeBtn);

      const newKeyInput = screen.getByTestId('new-transfer-key-input');
      const confirmInput = screen.getByTestId('confirm-transfer-key-input');
      const submitBtn = screen.getByTestId('submit-update-key-btn');

      // 6文字未満を入力
      fireEvent.change(newKeyInput, { target: { value: '123' } });
      fireEvent.change(confirmInput, { target: { value: '123' } });
      fireEvent.click(submitBtn);
      expect(screen.getByText(/パスワードは6文字以上/)).toBeInTheDocument();
      expect(handleUpdateKey).not.toHaveBeenCalled();

      // 不一致を入力
      fireEvent.change(newKeyInput, { target: { value: 'myPass123' } });
      fireEvent.change(confirmInput, { target: { value: 'different123' } });
      fireEvent.click(submitBtn);
      expect(screen.getByText(/確認用パスワードが一致しません/)).toBeInTheDocument();

      // 正しいパスワードを入力して変更
      fireEvent.change(confirmInput, { target: { value: 'myPass123' } });
      fireEvent.click(submitBtn);
      expect(handleUpdateKey).toHaveBeenCalledWith('myPass123');
    });

    it('「他の端末とデータを連携・共有する」アコーディオンから連携IDとキーを入力して連携が実行できること', async () => {
      const handleTransfer = vi.fn().mockResolvedValue({ success: true, message: 'データの連携が完了しました！' });
      const sampleCreds = {
        userId: 'NK-A8F2-9X4B',
        transferKey: 'k7Mp2Q9xL4wZ',
        createdAt: 1700000000000,
      };

      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCloudConfigured={true}
          cloudCredentials={sampleCreds}
          onCloudTransfer={handleTransfer}
        />
      );

      // アコーディオンを開く
      const accordionBtn = screen.getByTestId('toggle-transfer-accordion-btn');
      fireEvent.click(accordionBtn);

      const idInput = screen.getByTestId('transfer-user-id-input');
      const keyInput = screen.getByTestId('transfer-key-input');
      const transferBtn = screen.getByTestId('execute-transfer-btn');

      // 入力して引き継ぎ実行
      fireEvent.change(idInput, { target: { value: 'NK-1234-5678' } });
      fireEvent.change(keyInput, { target: { value: 'secretkey999' } });
      fireEvent.click(transferBtn);

      expect(handleTransfer).toHaveBeenCalledWith('NK-1234-5678', 'secretkey999');
    });

    it('「プライバシーとデータの取り扱いについて」リンクを押すと、プライバシーポリシーモーダルが開くこと', () => {
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isCloudConfigured={true}
        />
      );

      const privacyLink = screen.getByTestId('privacy-policy-link-button');
      expect(privacyLink).toBeInTheDocument();

      // 最初は非表示
      expect(screen.queryByTestId('privacy-policy-modal')).not.toBeInTheDocument();

      // クリックで開く
      fireEvent.click(privacyLink);
      expect(screen.getByTestId('privacy-policy-modal')).toBeInTheDocument();
      expect(screen.getByText('データの取り扱いとプライバシー')).toBeInTheDocument();

      // 閉じるボタンで閉じる
      const closeBtn = screen.getByTestId('privacy-policy-close-button');
      fireEvent.click(closeBtn);
      expect(screen.queryByTestId('privacy-policy-modal')).not.toBeInTheDocument();
    });

    it('「アプリ改善のための匿名の利用統計送信」トグルスイッチが表示され、クリックで onToggleAnalytics が呼ばれること', () => {
      const handleToggleAnalytics = vi.fn();
      const { rerender } = render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isAnalyticsEnabled={true}
          onToggleAnalytics={handleToggleAnalytics}
        />
      );

      const toggleButton = screen.getByRole('switch', { name: 'アプリ改善のための匿名の利用統計送信' });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByText('アプリ改善のための匿名の利用統計送信')).toBeInTheDocument();

      // クリックすると false でコールバックが呼ばれること
      fireEvent.click(toggleButton);
      expect(handleToggleAnalytics).toHaveBeenCalledWith(false);

      // isAnalyticsEnabled が false の場合
      rerender(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          isAnalyticsEnabled={false}
          onToggleAnalytics={handleToggleAnalytics}
        />
      );
      expect(toggleButton).toHaveAttribute('aria-checked', 'false');

      // クリックすると true でコールバックが呼ばれること
      fireEvent.click(toggleButton);
      expect(handleToggleAnalytics).toHaveBeenCalledWith(true);
    });
  });
});
