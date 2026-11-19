/**
 * ブラウザ専用のファイルダウンロードAPIを隔離した関数
 * JSON文字列を指定したファイル名でユーザーの端末にダウンロードさせます
 */
export function downloadJsonFile(jsonString: string, filename: string): void {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function'
  ) {
    return;
  }

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * ユーザーが選択したファイルをテキストとして読み込む関数
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('ファイルの読み込みに失敗しました（非テキスト）'));
      }
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('ファイルの読み込み中にエラーが発生しました'));
    };
    reader.readAsText(file);
  });
}
