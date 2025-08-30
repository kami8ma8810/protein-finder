/**
 * MenuRepository
 * SQLiteを使用したRepository実装
 */

import { IMenuRepository, NutrientFilter } from '@core/repositories/IMenuRepository';
import { MenuItem } from '@core/domain/MenuItem';
import { DatabaseService } from './DatabaseService';
import { MenuItemData } from '@core/domain/types';
import { Platform } from 'react-native';

interface MenuItemRow {
  id: string;
  chain: string;
  name: string;
  category: string | null;
  per: string;
  protein_g: number;
  fat_g: number | null;
  carbs_g: number | null;
  energy_kcal: number | null;
  serving_size: string | null;
  allergens: string | null;
  last_seen_at: string;
  source_url: string;
  source_hash: string;
}

export class MenuRepository implements IMenuRepository {
  constructor(private db: DatabaseService) {}

  async findById(id: string): Promise<MenuItem | null> {
    if (Platform.OS === 'web') {
      // Web版ではモックデータを返す
      return this.getMockMenuItem(id);
    }

    const row = await this.db.get<MenuItemRow>('SELECT * FROM menu_items WHERE id = ?', [id]);

    if (!row) return null;
    return this.rowToMenuItem(row);
  }

  async save(item: MenuItem): Promise<void> {
    if (Platform.OS === 'web') {
      // Web版では保存をスキップ
      console.log('🌐 Web版のため、データ保存をスキップ');
      return;
    }

    const sql = `
      INSERT OR REPLACE INTO menu_items (
        id, chain, name, category, per, 
        protein_g, fat_g, carbs_g, energy_kcal,
        serving_size, allergens, last_seen_at, 
        source_url, source_hash, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const params = [
      item.id,
      item.chain,
      item.name,
      item.category || null,
      item.per,
      item.proteinInGrams,
      item.getNutrientInGrams('fat'),
      item.getNutrientInGrams('carbs'),
      item.getNutrient('energy')?.value || null,
      item.servingSize || null,
      item.allergens ? JSON.stringify(item.allergens) : null,
      item.lastSeenAt,
      item.sourceUrl,
      item.sourceHash,
    ];

    await this.db.execute(sql, params);
  }

  async bulkSave(items: MenuItem[]): Promise<void> {
    if (Platform.OS === 'web') {
      // Web版では保存をスキップ
      console.log(`🌐 Web版のため、${items.length}件のデータ保存をスキップ`);
      return;
    }
    
    await this.db.transaction(async () => {
      for (const item of items) {
        await this.save(item);
      }
    });
  }

  async delete(id: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Web版では削除をスキップ
      console.log('🌐 Web版のため、削除をスキップ');
      return;
    }
    await this.db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  }

  async findByChain(chain: string): Promise<MenuItem[]> {
    if (Platform.OS === 'web') {
      // Web版ではモックデータを返す
      return this.getMockMenuItems().filter(item => item.chain === chain);
    }

    const rows = await this.db.query<MenuItemRow>(
      'SELECT * FROM menu_items WHERE chain = ? ORDER BY protein_g DESC',
      [chain],
    );

    return rows.map((row) => this.rowToMenuItem(row));
  }

  async searchByName(query: string): Promise<MenuItem[]> {
    if (Platform.OS === 'web') {
      // Web版ではモックデータから検索
      return this.getMockMenuItems().filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const rows = await this.db.query<MenuItemRow>(
      `SELECT * FROM menu_items 
       WHERE LOWER(name) LIKE LOWER(?) 
       ORDER BY protein_g DESC`,
      [`%${query}%`],
    );

    return rows.map((row) => this.rowToMenuItem(row));
  }

  async findByNutrientFilter(filter: NutrientFilter): Promise<MenuItem[]> {
    if (Platform.OS === 'web') {
      // Web版ではモックデータをフィルタリング
      let items = this.getMockMenuItems();
      
      if (filter.minProtein !== undefined) {
        items = items.filter(item => item.proteinInGrams >= filter.minProtein!);
      }
      if (filter.maxProtein !== undefined) {
        items = items.filter(item => item.proteinInGrams <= filter.maxProtein!);
      }
      
      return items;
    }
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params: any[] = [];

    if (filter.minProtein !== undefined) {
      sql += ' AND protein_g >= ?';
      params.push(filter.minProtein);
    }
    if (filter.maxProtein !== undefined) {
      sql += ' AND protein_g <= ?';
      params.push(filter.maxProtein);
    }
    if (filter.minCarbs !== undefined) {
      sql += ' AND carbs_g >= ?';
      params.push(filter.minCarbs);
    }
    if (filter.maxCarbs !== undefined) {
      sql += ' AND carbs_g <= ?';
      params.push(filter.maxCarbs);
    }
    if (filter.minFat !== undefined) {
      sql += ' AND fat_g >= ?';
      params.push(filter.minFat);
    }
    if (filter.maxFat !== undefined) {
      sql += ' AND fat_g <= ?';
      params.push(filter.maxFat);
    }
    if (filter.minCalories !== undefined) {
      sql += ' AND energy_kcal >= ?';
      params.push(filter.minCalories);
    }
    if (filter.maxCalories !== undefined) {
      sql += ' AND energy_kcal <= ?';
      params.push(filter.maxCalories);
    }
    if (filter.per !== undefined) {
      sql += ' AND per = ?';
      params.push(filter.per);
    }

    sql += ' ORDER BY protein_g DESC';

    const rows = await this.db.query<MenuItemRow>(sql, params);
    return rows.map((row) => this.rowToMenuItem(row));
  }

  async getAvailableChains(): Promise<string[]> {
    if (Platform.OS === 'web') {
      // Web版ではモックデータから取得
      const chains = new Set(this.getMockMenuItems().map(item => item.chain));
      return Array.from(chains).sort();
    }
    const rows = await this.db.query<{ chain: string }>(
      'SELECT DISTINCT chain FROM menu_items ORDER BY chain',
    );
    return rows.map((row) => row.chain);
  }

  async getLastUpdatedAt(): Promise<Date | null> {
    if (Platform.OS === 'web') {
      // Web版では現在時刻を返す
      return new Date();
    }
    const row = await this.db.get<{ last_seen_at: string }>(
      'SELECT MAX(last_seen_at) as last_seen_at FROM menu_items',
    );
    return row?.last_seen_at ? new Date(row.last_seen_at) : null;
  }

  private rowToMenuItem(row: MenuItemRow): MenuItem {
    const data: MenuItemData = {
      id: row.id,
      chain: row.chain,
      name: row.name,
      category: row.category || undefined,
      per: row.per as 'serving' | '100g',
      nutrients: [
        { type: 'protein', value: row.protein_g, unit: 'g' },
        ...(row.fat_g !== null
          ? [{ type: 'fat' as const, value: row.fat_g, unit: 'g' as const }]
          : []),
        ...(row.carbs_g !== null
          ? [{ type: 'carbs' as const, value: row.carbs_g, unit: 'g' as const }]
          : []),
        ...(row.energy_kcal !== null
          ? [{ type: 'energy' as const, value: row.energy_kcal, unit: 'kcal' as const }]
          : []),
      ],
      servingSize: row.serving_size || undefined,
      allergens: row.allergens ? JSON.parse(row.allergens) : undefined,
      lastSeenAt: row.last_seen_at,
      sourceUrl: row.source_url,
      sourceHash: row.source_hash,
    };

    return new MenuItem(data);
  }

  // Web版用のモックデータ
  private getMockMenuItems(): MenuItem[] {
    const mockData: MenuItemData[] = [
      {
        id: 'sukiya_gyudon_medium',
        chain: 'sukiya',
        name: '牛丼（並）',
        category: '牛丼',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 20.2, unit: 'g' },
          { type: 'fat', value: 25.0, unit: 'g' },
          { type: 'carbs', value: 103.2, unit: 'g' },
          { type: 'energy', value: 733, unit: 'kcal' },
        ],
        servingSize: '350g',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.sukiya.jp/menu/',
        sourceHash: 'mock_hash_1',
      },
      {
        id: 'yoshinoya_gyudon_medium',
        chain: 'yoshinoya',
        name: '牛丼（並）',
        category: '牛丼',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 20.0, unit: 'g' },
          { type: 'fat', value: 23.4, unit: 'g' },
          { type: 'carbs', value: 92.8, unit: 'g' },
          { type: 'energy', value: 635, unit: 'kcal' },
        ],
        servingSize: '340g',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.yoshinoya.com/menu/',
        sourceHash: 'mock_hash_2',
      },
      {
        id: 'matsuya_gyumeshi_medium',
        chain: 'matsuya',
        name: '牛めし（並）',
        category: '牛めし',
        per: 'serving',
        nutrients: [
          { type: 'protein', value: 18.3, unit: 'g' },
          { type: 'fat', value: 24.8, unit: 'g' },
          { type: 'carbs', value: 100.1, unit: 'g' },
          { type: 'energy', value: 692, unit: 'kcal' },
        ],
        servingSize: '360g',
        lastSeenAt: new Date().toISOString(),
        sourceUrl: 'https://www.matsuyafoods.co.jp/matsuya/menu/',
        sourceHash: 'mock_hash_3',
      },
    ];

    return mockData.map(data => new MenuItem(data));
  }

  private getMockMenuItem(id: string): MenuItem | null {
    const items = this.getMockMenuItems();
    return items.find(item => item.id === id) || null;
  }
}
