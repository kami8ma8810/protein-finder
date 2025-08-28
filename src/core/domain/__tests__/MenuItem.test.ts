/**
 * MenuItem Domain Model Tests
 * TDD: Red Phase - まず失敗するテストを書く
 */

import { MenuItem } from '../MenuItem';
import { PerUnit } from '../types';

describe('MenuItem', () => {
  describe('基本的なプロパティ', () => {
    it('メニューアイテムを作成できる', () => {
      const item = new MenuItem({
        id: 'sukiya_gyudon_regular',
        chain: 'sukiya',
        name: '牛丼（並盛）',
        category: '丼物',
        per: 'serving' as PerUnit,
        nutrients: [
          { type: 'protein', value: 22.5, unit: 'g' },
          { type: 'fat', value: 25.2, unit: 'g' },
          { type: 'carbs', value: 103.1, unit: 'g' },
          { type: 'energy', value: 733, unit: 'kcal' },
        ],
        servingSize: '並盛（350g）',
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com/menu',
        sourceHash: 'abc123',
      });

      expect(item.id).toBe('sukiya_gyudon_regular');
      expect(item.chain).toBe('sukiya');
      expect(item.name).toBe('牛丼（並盛）');
      expect(item.per).toBe('serving');
    });
  });

  describe('栄養素の取得', () => {
    it('特定の栄養素を取得できる', () => {
      const item = new MenuItem({
        id: 'test',
        chain: 'test',
        name: 'テスト商品',
        per: 'serving' as PerUnit,
        nutrients: [
          { type: 'protein', value: 30, unit: 'g' },
          { type: 'fat', value: 20, unit: 'g' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      });

      const protein = item.getNutrient('protein');
      expect(protein?.value).toBe(30);
      expect(protein?.unit).toBe('g');

      const carbs = item.getNutrient('carbs');
      expect(carbs).toBeUndefined();
    });

    it('タンパク質をグラム単位で取得できる', () => {
      const item = new MenuItem({
        id: 'test',
        chain: 'test',
        name: 'テスト商品',
        per: 'serving' as PerUnit,
        nutrients: [
          { type: 'protein', value: 5000, unit: 'mg' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      });

      expect(item.proteinInGrams).toBe(5);
    });

    it('mgからgへの単位変換ができる', () => {
      const item = new MenuItem({
        id: 'test',
        chain: 'test',
        name: 'テスト商品',
        per: 'serving' as PerUnit,
        nutrients: [
          { type: 'protein', value: 2500, unit: 'mg' },
          { type: 'sodium', value: 1200, unit: 'mg' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      });

      expect(item.proteinInGrams).toBe(2.5);
      const sodium = item.getNutrientInGrams('sodium');
      expect(sodium).toBe(1.2);
    });
  });

  describe('100gあたり/1食あたりの変換', () => {
    it('100gあたりから1食あたりに変換できる', () => {
      const item = new MenuItem({
        id: 'test',
        chain: 'test',
        name: 'テスト商品',
        per: '100g' as PerUnit,
        nutrients: [
          { type: 'protein', value: 10, unit: 'g' },
          { type: 'fat', value: 5, unit: 'g' },
        ],
        servingSize: '1食（350g）',
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      });

      const perServing = item.convertToPerServing();
      expect(perServing).not.toBeNull();
      expect(perServing!.proteinInGrams).toBe(35); // 10g × 3.5
      expect(perServing!.getNutrient('fat')?.value).toBe(17.5); // 5g × 3.5
    });

    it('サービングサイズがない場合はnullを返す', () => {
      const item = new MenuItem({
        id: 'test',
        chain: 'test',
        name: 'テスト商品',
        per: '100g' as PerUnit,
        nutrients: [
          { type: 'protein', value: 10, unit: 'g' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      });

      const perServing = item.convertToPerServing();
      expect(perServing).toBeNull();
    });

    it('サービングサイズから重量を抽出できる', () => {
      const item = new MenuItem({
        id: 'test',
        chain: 'test',
        name: 'テスト商品',
        per: '100g' as PerUnit,
        nutrients: [],
        servingSize: '1食（350g）',
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      });

      expect(item.extractServingGrams()).toBe(350);
    });

    it('様々なサービングサイズ表記から重量を抽出できる', () => {
      const testCases = [
        { input: '並盛（350g）', expected: 350 },
        { input: '大盛（500g）', expected: 500 },
        { input: '1食分 250g', expected: 250 },
        { input: '約300グラム', expected: 300 },
        { input: '200ｇ', expected: 200 }, // 全角
      ];

      testCases.forEach(({ input, expected }) => {
        const item = new MenuItem({
          id: 'test',
          chain: 'test',
          name: 'テスト商品',
          per: '100g' as PerUnit,
          nutrients: [],
          servingSize: input,
          lastSeenAt: '2024-12-28T10:00:00Z',
          sourceUrl: 'https://example.com',
          sourceHash: 'test',
        });
        expect(item.extractServingGrams()).toBe(expected);
      });
    });
  });

  describe('バリデーション', () => {
    it('必須フィールドがない場合エラーになる', () => {
      expect(() => {
        new MenuItem({
          id: '',
          chain: 'test',
          name: 'テスト',
          per: 'serving' as PerUnit,
          nutrients: [],
          lastSeenAt: '2024-12-28T10:00:00Z',
          sourceUrl: 'https://example.com',
          sourceHash: 'test',
        });
      }).toThrow('ID is required');

      expect(() => {
        new MenuItem({
          id: 'test',
          chain: '',
          name: 'テスト',
          per: 'serving' as PerUnit,
          nutrients: [],
          lastSeenAt: '2024-12-28T10:00:00Z',
          sourceUrl: 'https://example.com',
          sourceHash: 'test',
        });
      }).toThrow('Chain is required');
    });

    it('不正な栄養素値の場合エラーになる', () => {
      expect(() => {
        new MenuItem({
          id: 'test',
          chain: 'test',
          name: 'テスト',
          per: 'serving' as PerUnit,
          nutrients: [
            { type: 'protein', value: -10, unit: 'g' },
          ],
          lastSeenAt: '2024-12-28T10:00:00Z',
          sourceUrl: 'https://example.com',
          sourceHash: 'test',
        });
      }).toThrow('Nutrient values must be non-negative');
    });
  });

  describe('ソート用比較', () => {
    it('タンパク質量で比較できる', () => {
      const item1 = new MenuItem({
        id: '1',
        chain: 'test',
        name: 'Item 1',
        per: 'serving' as PerUnit,
        nutrients: [{ type: 'protein', value: 20, unit: 'g' }],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test1',
      });

      const item2 = new MenuItem({
        id: '2',
        chain: 'test',
        name: 'Item 2',
        per: 'serving' as PerUnit,
        nutrients: [{ type: 'protein', value: 30, unit: 'g' }],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test2',
      });

      const items = [item1, item2];
      items.sort((a, b) => b.proteinInGrams - a.proteinInGrams);

      expect(items[0]?.id).toBe('2');
      expect(items[1]?.id).toBe('1');
    });
  });
});