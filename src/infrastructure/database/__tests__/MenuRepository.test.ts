/**
 * MenuRepository Tests
 * TDD: Repository Patternのテスト
 */

import { MenuRepository } from '../MenuRepository';
import { MenuItem } from '@core/domain/MenuItem';
import { DatabaseService } from '../DatabaseService';

// モックデータ
const mockMenuItems: MenuItem[] = [
  new MenuItem({
    id: 'sukiya_gyudon_regular',
    chain: 'sukiya',
    name: '牛丼（並盛）',
    category: '丼物',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 22.5, unit: 'g' },
      { type: 'fat', value: 25.2, unit: 'g' },
      { type: 'carbs', value: 103.1, unit: 'g' },
    ],
    servingSize: '並盛（350g）',
    lastSeenAt: '2024-12-28T10:00:00Z',
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'abc123',
  }),
  new MenuItem({
    id: 'yoshinoya_gyudon_regular',
    chain: 'yoshinoya',
    name: '牛丼（並盛）',
    category: '丼物',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 20.4, unit: 'g' },
      { type: 'fat', value: 23.4, unit: 'g' },
      { type: 'carbs', value: 113.1, unit: 'g' },
    ],
    servingSize: '並盛（320g）',
    lastSeenAt: '2024-12-28T10:00:00Z',
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'def456',
  }),
  new MenuItem({
    id: 'matsuya_gyumeshi_regular',
    chain: 'matsuya',
    name: 'プレミアム牛めし（並盛）',
    category: '丼物',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 18.6, unit: 'g' },
      { type: 'fat', value: 25.9, unit: 'g' },
      { type: 'carbs', value: 102.0, unit: 'g' },
    ],
    servingSize: '並盛（320g）',
    lastSeenAt: '2024-12-28T10:00:00Z',
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'ghi789',
  }),
];

describe('MenuRepository', () => {
  let repository: MenuRepository;
  let db: DatabaseService;

  beforeAll(async () => {
    // インメモリデータベースでテスト
    db = new DatabaseService(':memory:');
    await db.initialize();
    repository = new MenuRepository(db);
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    // データクリア
    await db.execute('DELETE FROM menu_items');
    // テストデータ挿入
    for (const item of mockMenuItems) {
      await repository.save(item);
    }
  });

  describe('findByChain', () => {
    it('指定した店舗のメニューのみ取得できる', async () => {
      const sukiyaMenus = await repository.findByChain('sukiya');
      
      expect(sukiyaMenus).toHaveLength(1);
      expect(sukiyaMenus[0]?.chain).toBe('sukiya');
      expect(sukiyaMenus[0]?.name).toBe('牛丼（並盛）');
    });

    it('存在しない店舗の場合は空配列を返す', async () => {
      const result = await repository.findByChain('nonexistent');
      
      expect(result).toEqual([]);
    });

    it('タンパク質量で降順ソートされている', async () => {
      // 複数のすき家メニューを追加
      await repository.save(new MenuItem({
        id: 'sukiya_cheese_gyudon',
        chain: 'sukiya',
        name: 'チーズ牛丼',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 28.5, unit: 'g' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'xyz',
      }));

      const sukiyaMenus = await repository.findByChain('sukiya');
      
      expect(sukiyaMenus).toHaveLength(2);
      expect(sukiyaMenus[0]?.proteinInGrams).toBe(28.5);
      expect(sukiyaMenus[1]?.proteinInGrams).toBe(22.5);
    });
  });

  describe('searchByName', () => {
    it('メニュー名で部分一致検索ができる', async () => {
      const gyudonMenus = await repository.searchByName('牛丼');
      
      expect(gyudonMenus).toHaveLength(2);
      expect(gyudonMenus.map(m => m.chain)).toContain('sukiya');
      expect(gyudonMenus.map(m => m.chain)).toContain('yoshinoya');
    });

    it('大文字小文字を区別しない', async () => {
      const results = await repository.searchByName('プレミアム');
      
      expect(results).toHaveLength(1);
      expect(results[0]?.chain).toBe('matsuya');
    });

    it('タンパク質量で降順ソートされている', async () => {
      const gyudonMenus = await repository.searchByName('牛');
      
      expect(gyudonMenus).toHaveLength(3);
      expect(gyudonMenus[0]?.proteinInGrams).toBe(22.5); // sukiya
      expect(gyudonMenus[1]?.proteinInGrams).toBe(20.4); // yoshinoya
      expect(gyudonMenus[2]?.proteinInGrams).toBe(18.6); // matsuya
    });
  });

  describe('findByNutrientFilter', () => {
    it('最小タンパク質量でフィルタできる', async () => {
      const highProteinMenus = await repository.findByNutrientFilter({
        minProtein: 20,
      });
      
      expect(highProteinMenus).toHaveLength(2);
      expect(highProteinMenus.every(m => m.proteinInGrams >= 20)).toBe(true);
    });

    it('複数の栄養素条件でフィルタできる', async () => {
      const filteredMenus = await repository.findByNutrientFilter({
        minProtein: 18,
        maxCarbs: 105,
      });
      
      expect(filteredMenus).toHaveLength(2); // sukiyaとmatsuya
    });

    it('per（1食/100g）でフィルタできる', async () => {
      // 100gあたりのメニューを追加
      await repository.save(new MenuItem({
        id: 'test_100g',
        chain: 'test',
        name: 'Test Item',
        per: '100g',
        nutrients: [
          { type: 'protein', value: 30, unit: 'g' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'test',
      }));

      const servingOnly = await repository.findByNutrientFilter({
        per: 'serving',
      });
      
      expect(servingOnly).toHaveLength(3);
      expect(servingOnly.every(m => m.per === 'serving')).toBe(true);
    });
  });

  describe('save', () => {
    it('新しいメニューアイテムを保存できる', async () => {
      const newItem = new MenuItem({
        id: 'new_item',
        chain: 'new_chain',
        name: 'New Item',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 15, unit: 'g' },
        ],
        lastSeenAt: '2024-12-28T10:00:00Z',
        sourceUrl: 'https://example.com',
        sourceHash: 'new',
      });

      await repository.save(newItem);
      const found = await repository.findById('new_item');
      
      expect(found).not.toBeNull();
      expect(found?.name).toBe('New Item');
    });

    it('既存のメニューアイテムを更新できる（upsert）', async () => {
      const updated = new MenuItem({
        id: 'sukiya_gyudon_regular',
        chain: 'sukiya',
        name: '牛丼（並盛）- 更新',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 25, unit: 'g' },
        ],
        lastSeenAt: '2024-12-28T11:00:00Z',
        sourceUrl: 'https://example.com/sukiya',
        sourceHash: 'updated',
      });

      await repository.save(updated);
      const found = await repository.findById('sukiya_gyudon_regular');
      
      expect(found?.name).toBe('牛丼（並盛）- 更新');
      expect(found?.proteinInGrams).toBe(25);
    });
  });

  describe('bulkSave', () => {
    it('複数のメニューアイテムを一括保存できる', async () => {
      const newItems = [
        new MenuItem({
          id: 'bulk1',
          chain: 'test',
          name: 'Bulk Item 1',
          per: 'serving',
          nutrients: [{ type: 'protein', value: 10, unit: 'g' }],
          lastSeenAt: '2024-12-28T10:00:00Z',
          sourceUrl: 'https://example.com',
          sourceHash: 'bulk1',
        }),
        new MenuItem({
          id: 'bulk2',
          chain: 'test',
          name: 'Bulk Item 2',
          per: 'serving',
          nutrients: [{ type: 'protein', value: 20, unit: 'g' }],
          lastSeenAt: '2024-12-28T10:00:00Z',
          sourceUrl: 'https://example.com',
          sourceHash: 'bulk2',
        }),
      ];

      await repository.bulkSave(newItems);
      const testItems = await repository.findByChain('test');
      
      expect(testItems).toHaveLength(2);
    });
  });

  describe('getAvailableChains', () => {
    it('利用可能な店舗リストを取得できる', async () => {
      const chains = await repository.getAvailableChains();
      
      expect(chains).toHaveLength(3);
      expect(chains).toContain('sukiya');
      expect(chains).toContain('yoshinoya');
      expect(chains).toContain('matsuya');
    });
  });
});