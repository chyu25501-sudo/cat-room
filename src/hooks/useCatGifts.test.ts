import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCatGifts, GIFT_STORAGE_KEY } from './useCatGifts.ts';
import { CAT_GIFTS } from '../utils/catGifts.ts';

describe('useCatGifts hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('初期状態ではインベントリが空であり、受取個数0が返ること', () => {
    const { result } = renderHook(() => useCatGifts());
    expect(result.current.inventory).toEqual({});
    expect(result.current.getTotalGiftCount()).toBe(0);
    expect(result.current.getGiftCount('pebble')).toBe(0);
  });

  it('猫から贈り物を受け取るとインベントリにカウントが記録され、localStorageに永続化されること', () => {
    // 常にきれいな小石（index 0）が選出されるように randomFn をモック
    const { result } = renderHook(() => useCatGifts({ randomFn: () => 0 }));

    let receivedGift;
    act(() => {
      receivedGift = result.current.receiveGift('black');
    });

    expect(receivedGift).toEqual(CAT_GIFTS[0]);
    expect(result.current.getGiftCount('pebble')).toBe(1);
    expect(result.current.getTotalGiftCount()).toBe(1);
    expect(result.current.inventory.pebble.byCat?.black).toBe(1);

    // localStorage の内容を確認
    const saved = JSON.parse(localStorage.getItem(GIFT_STORAGE_KEY) || '{}');
    expect(saved.pebble.count).toBe(1);
    expect(saved.pebble.byCat.black).toBe(1);
  });

  it('指定したギフトを受け取れること（猫別内訳もカウントされる）', () => {
    const { result } = renderHook(() => useCatGifts());

    act(() => {
      result.current.receiveGift('white', CAT_GIFTS[1]); // ふわふわの羽根
    });

    expect(result.current.getGiftCount('feather')).toBe(1);
    expect(result.current.inventory.feather.byCat?.white).toBe(1);

    // 同じ猫からもう一度羽根を受け取る
    act(() => {
      result.current.receiveGift('white', CAT_GIFTS[1]);
    });

    expect(result.current.getGiftCount('feather')).toBe(2);
    expect(result.current.inventory.feather.byCat?.white).toBe(2);
  });

  it('保存された localStorage から初期インベントリを復元できること', () => {
    localStorage.setItem(
      GIFT_STORAGE_KEY,
      JSON.stringify({
        pebble: {
          giftId: 'pebble',
          count: 3,
          byCat: { black: 2, calico: 1 },
          firstReceivedAt: 1000,
          lastReceivedAt: 2000,
        },
      })
    );

    const { result } = renderHook(() => useCatGifts());
    expect(result.current.getGiftCount('pebble')).toBe(3);
    expect(result.current.getTotalGiftCount()).toBe(3);
  });

  it('resetInventory でインベントリを初期化できること', () => {
    const { result } = renderHook(() => useCatGifts());

    act(() => {
      result.current.receiveGift('black', CAT_GIFTS[0]);
    });
    expect(result.current.getTotalGiftCount()).toBe(1);

    act(() => {
      result.current.resetInventory();
    });
    expect(result.current.getTotalGiftCount()).toBe(0);
    expect(result.current.inventory).toEqual({});
  });
});
