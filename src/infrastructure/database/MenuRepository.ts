/**
 * MenuRepository
 * SQLiteを使用したRepository実装
 */

import { IMenuRepository, NutrientFilter } from '@core/repositories/IMenuRepository';
import { MenuItem } from '@core/domain/MenuItem';
import { DatabaseService } from './DatabaseService';
import { MenuItemData } from '@core/domain/types';

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
    const row = await this.db.get<MenuItemRow>(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    if (!row) return null;
    return this.rowToMenuItem(row);
  }

  async save(item: MenuItem): Promise<void> {
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
    await this.db.transaction(async () => {
      for (const item of items) {
        await this.save(item);
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  }

  async findByChain(chain: string): Promise<MenuItem[]> {
    const rows = await this.db.query<MenuItemRow>(
      'SELECT * FROM menu_items WHERE chain = ? ORDER BY protein_g DESC',
      [chain]
    );

    return rows.map(row => this.rowToMenuItem(row));
  }

  async searchByName(query: string): Promise<MenuItem[]> {
    const rows = await this.db.query<MenuItemRow>(
      `SELECT * FROM menu_items 
       WHERE LOWER(name) LIKE LOWER(?) 
       ORDER BY protein_g DESC`,
      [`%${query}%`]
    );

    return rows.map(row => this.rowToMenuItem(row));
  }

  async findByNutrientFilter(filter: NutrientFilter): Promise<MenuItem[]> {
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
    return rows.map(row => this.rowToMenuItem(row));
  }

  async getAvailableChains(): Promise<string[]> {
    const rows = await this.db.query<{ chain: string }>(
      'SELECT DISTINCT chain FROM menu_items ORDER BY chain'
    );
    return rows.map(row => row.chain);
  }

  async getLastUpdatedAt(): Promise<Date | null> {
    const row = await this.db.get<{ last_seen_at: string }>(
      'SELECT MAX(last_seen_at) as last_seen_at FROM menu_items'
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
        ...(row.fat_g !== null ? [{ type: 'fat' as const, value: row.fat_g, unit: 'g' as const }] : []),
        ...(row.carbs_g !== null ? [{ type: 'carbs' as const, value: row.carbs_g, unit: 'g' as const }] : []),
        ...(row.energy_kcal !== null ? [{ type: 'energy' as const, value: row.energy_kcal, unit: 'kcal' as const }] : []),
      ],
      servingSize: row.serving_size || undefined,
      allergens: row.allergens ? JSON.parse(row.allergens) : undefined,
      lastSeenAt: row.last_seen_at,
      sourceUrl: row.source_url,
      sourceHash: row.source_hash,
    };

    return new MenuItem(data);
  }
}