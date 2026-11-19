import { describe, it, expect } from 'vitest';
import {
  mergeSaveData,
  validateAndSanitizeSaveData,
  serializeSaveData,
  parseSaveDataJson,
} from './saveData.ts';
import { NekoppoiSaveData } from '../types/saveData.ts';
import { DEFAULT_APP_SETTINGS } from './catSettings.ts';
import { INITIAL_CARE_STATS } from './careJournal.ts';

describe('saveData ユーティリティ (セーブデータ管理・マージ)', () => {
  describe('validateAndSanitizeSaveData', () => {
    it('null や無効なデータが渡された場合は null を返すこと', () => {
      expect(validateAndSanitizeSaveData(null)).toBeNull();
      expect(validateAndSanitizeSaveData('string')).toBeNull();
      expect(validateAndSanitizeSaveData([1, 2, 3])).toBeNull();
      expect(validateAndSanitizeSaveData(undefined)).toBeNull();
    });

    it('正常なデータが渡された場合、各プロパティがサニタイズされて返ること', () => {
      const raw = {
        version: 1,
        timestamp: 100000,
        settings: {
          soundEnabled: false,
        },
        affection: {
          black: { level: 5, currentExp: 200, requiredExp: 360 },
        },
        fullness: {
          black: { score: 75, lastFedAt: 100000 },
        },
        gifts: {
          pebble: {
            giftId: 'pebble',
            count: 2,
            byCat: { black: 2 },
            firstReceivedAt: 50000,
            lastReceivedAt: 60000,
          },
        },
        guideSeen: true,
      };

      const result = validateAndSanitizeSaveData(raw);
      expect(result).not.toBeNull();
      expect(result?.version).toBe(1);
      expect(result?.settings?.soundEnabled).toBe(false);
      expect(result?.affection?.black.level).toBe(5);
      expect(result?.fullness?.black.score).toBe(75);
      expect(result?.gifts?.pebble.count).toBe(2);
      expect(result?.guideSeen).toBe(true);
    });
  });

  describe('mergeSaveData (賢いマージ)', () => {
    it('おくりもの: 和集合として合算され、個数や猫別内訳は最大値が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        gifts: {
          pebble: {
            giftId: 'pebble',
            count: 3,
            byCat: { black: 3 },
            firstReceivedAt: 100,
            lastReceivedAt: 500,
          },
          seashell: {
            giftId: 'seashell',
            count: 1,
            byCat: { white: 1 },
            firstReceivedAt: 200,
            lastReceivedAt: 200,
          },
        },
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000,
        gifts: {
          pebble: {
            giftId: 'pebble',
            count: 5,
            byCat: { black: 2, white: 3 },
            firstReceivedAt: 50,
            lastReceivedAt: 800,
          },
          acorn: {
            giftId: 'acorn',
            count: 2,
            byCat: { calico: 2 },
            firstReceivedAt: 300,
            lastReceivedAt: 400,
          },
        },
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.gifts).toBeDefined();

      // pebble: 個数は max(3, 5) = 5
      expect(merged.gifts?.pebble.count).toBe(5);
      expect(merged.gifts?.pebble.byCat?.black).toBe(3); // max(3, 2) = 3
      expect(merged.gifts?.pebble.byCat?.white).toBe(3); // max(0, 3) = 3
      expect(merged.gifts?.pebble.firstReceivedAt).toBe(50); // min(100, 50)
      expect(merged.gifts?.pebble.lastReceivedAt).toBe(800); // max(500, 800)

      // seashell: localのみ
      expect(merged.gifts?.seashell.count).toBe(1);

      // acorn: incomingのみ
      expect(merged.gifts?.acorn.count).toBe(2);
    });

    it('実績: 和集合としてどちらかで達成されていれば達成済みになり、進捗は最大値が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        achievements: {
          'first-pet': { id: 'first-pet', unlockedAt: 200 },
          'pet-10': { id: 'pet-10', progress: 5 },
        },
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000,
        achievements: {
          'first-pet': { id: 'first-pet', unlockedAt: 150 },
          'pet-10': { id: 'pet-10', unlockedAt: 300, progress: 10 },
          'first-feed': { id: 'first-feed', unlockedAt: 250 },
        },
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.achievements?.['first-pet'].unlockedAt).toBe(150); // より早い方
      expect(merged.achievements?.['pet-10'].unlockedAt).toBe(300);
      expect(merged.achievements?.['pet-10'].progress).toBe(10); // max(5, 10)
      expect(merged.achievements?.['first-feed'].unlockedAt).toBe(250);
    });

    it('ふり返り手帳: 各カウントや日数の最大値が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        careJournal: {
          ...INITIAL_CARE_STATS,
          totalPetCount: 50,
          totalFeedCount: 10,
          totalActiveDays: 3,
          currentStreakDays: 3,
          maxStreakDays: 3,
          lastInteractionDateStr: '2026-11-18',
          interactionsByCat: { black: 30, white: 20, calico: 10 },
        },
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000,
        careJournal: {
          ...INITIAL_CARE_STATS,
          totalPetCount: 40,
          totalFeedCount: 25,
          totalActiveDays: 5,
          currentStreakDays: 1,
          maxStreakDays: 5,
          lastInteractionDateStr: '2026-11-19',
          interactionsByCat: { black: 15, white: 25, calico: 25 },
        },
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.careJournal?.totalPetCount).toBe(50); // max(50, 40)
      expect(merged.careJournal?.totalFeedCount).toBe(25); // max(10, 25)
      expect(merged.careJournal?.totalActiveDays).toBe(5); // max(3, 5)
      expect(merged.careJournal?.currentStreakDays).toBe(3); // max(3, 1)
      expect(merged.careJournal?.maxStreakDays).toBe(5); // max(3, 5)
      expect(merged.careJournal?.lastInteractionDateStr).toBe('2026-11-19'); // 新しい日付
      expect(merged.careJournal?.interactionsByCat.black).toBe(30); // max(30, 15)
      expect(merged.careJournal?.interactionsByCat.white).toBe(25); // max(20, 25)
      expect(merged.careJournal?.interactionsByCat.calico).toBe(25); // max(10, 25)
    });

    it('なつき度: より高いレベル（同じならより多いExp）が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        affection: {
          black: { level: 4, currentExp: 100, requiredExp: 300 },
          white: { level: 2, currentExp: 50, requiredExp: 180 },
          calico: { level: 1, currentExp: 0, requiredExp: 120 },
        },
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000,
        affection: {
          black: { level: 4, currentExp: 150, requiredExp: 300 }, // 同レベルでExp大
          white: { level: 3, currentExp: 10, requiredExp: 240 }, // レベル大
          calico: { level: 1, currentExp: 0, requiredExp: 120 },
        },
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.affection?.black.currentExp).toBe(150);
      expect(merged.affection?.white.level).toBe(3);
      expect(merged.affection?.calico.level).toBe(1);
    });

    it('なつき度: レベルMAX(Lv.10)のときはゲージ周回するため、タイムスタンプが新しい方のExpが採用され巻き戻らないこと', () => {
      // local側がおくりものを貰ってゲージが 0 にリセットされた直後（最新）
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 3000,
        affection: {
          black: { level: 10, currentExp: 0, requiredExp: 600 },
          white: { level: 10, currentExp: 0, requiredExp: 600 },
          calico: { level: 10, currentExp: 0, requiredExp: 600 },
        },
      };

      // incoming側が過去の満タン直前データ（古い）
      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        affection: {
          black: { level: 10, currentExp: 580, requiredExp: 600 },
          white: { level: 10, currentExp: 580, requiredExp: 600 },
          calico: { level: 10, currentExp: 580, requiredExp: 600 },
        },
      };

      const merged = mergeSaveData(local, incoming);
      // 新しい local 側の currentExp: 0 が採用され、過去の 580 に巻き戻らないこと
      expect(merged.affection?.black.currentExp).toBe(0);
    });

    it('まんぷく度: 最終給餌（lastFedAt）が新しい方が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        fullness: {
          black: { score: 70, lastFedAt: 1000 },
          white: { score: 30, lastFedAt: 500 },
          calico: { score: 50, lastFedAt: 1000 },
        },
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000,
        fullness: {
          black: { score: 40, lastFedAt: 800 }, // localの方が新しい
          white: { score: 85, lastFedAt: 1500 }, // incomingの方が新しい
          calico: { score: 60, lastFedAt: 1200 },
        },
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.fullness?.black.score).toBe(70);
      expect(merged.fullness?.white.score).toBe(85);
      expect(merged.fullness?.calico.score).toBe(60);
    });

    it('設定: タイムスタンプが新しい方の設定が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        settings: {
          ...DEFAULT_APP_SETTINGS,
          soundEnabled: false,
        },
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000, // 新しい
        settings: {
          ...DEFAULT_APP_SETTINGS,
          soundEnabled: true,
          gaugePosition: 'side',
        },
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.settings?.soundEnabled).toBe(true);
      expect(merged.settings?.gaugePosition).toBe('side');
    });

    it('最終アクティブ時刻（lastActiveTime）: より新しい時刻が採用されること', () => {
      const local: NekoppoiSaveData = {
        version: 1,
        timestamp: 1000,
        lastActiveTime: 5000,
      };

      const incoming: NekoppoiSaveData = {
        version: 1,
        timestamp: 2000,
        lastActiveTime: 9000,
      };

      const merged = mergeSaveData(local, incoming);
      expect(merged.lastActiveTime).toBe(9000);
    });
  });

  describe('serializeSaveData & parseSaveDataJson', () => {
    it('JSON文字列化と復元が正しく行われること', () => {
      const data: NekoppoiSaveData = {
        version: 1,
        timestamp: 123456789,
        guideSeen: true,
      };

      const json = serializeSaveData(data);
      const parsed = parseSaveDataJson(json);
      expect(parsed?.timestamp).toBe(123456789);
      expect(parsed?.guideSeen).toBe(true);
    });

    it('不正なJSON文字列の場合は null を返すこと', () => {
      expect(parseSaveDataJson('invalid json')).toBeNull();
    });
  });
});
