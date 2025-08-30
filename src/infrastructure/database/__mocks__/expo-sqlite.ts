/**
 * expo-sqlite mock for testing
 */

interface MenuItemRecord {
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
  created_at?: string;
  updated_at?: string;
}

export class MockSQLiteDatabase {
  private menuItems: Map<string, MenuItemRecord> = new Map();

  async execAsync(sql: string): Promise<void> {
    // スキーマ作成をシミュレート
    if (sql.includes('CREATE TABLE')) {
      // Do nothing for table creation
    }
  }

  async runAsync(sql: string, params: any[] = []): Promise<any> {
    // INSERT OR REPLACE の処理
    if (sql.includes('INSERT OR REPLACE INTO menu_items')) {
      const item: MenuItemRecord = {
        id: params[0],
        chain: params[1],
        name: params[2],
        category: params[3],
        per: params[4],
        protein_g: params[5],
        fat_g: params[6],
        carbs_g: params[7],
        energy_kcal: params[8],
        serving_size: params[9],
        allergens: params[10],
        last_seen_at: params[11],
        source_url: params[12],
        source_hash: params[13],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.menuItems.set(item.id, item);
      return { lastInsertRowId: 1, changes: 1 };
    }

    // DELETE の処理
    if (sql.includes('DELETE FROM menu_items')) {
      if (sql.includes('WHERE id = ?')) {
        this.menuItems.delete(params[0]);
      } else {
        this.menuItems.clear();
      }
      return { lastInsertRowId: 0, changes: 1 };
    }

    return { lastInsertRowId: 1, changes: 1 };
  }

  async getAllAsync(sql: string, params: any[] = []): Promise<any[]> {
    // SELECT の処理
    let results = Array.from(this.menuItems.values());

    // WHERE句の処理
    if (sql.includes('WHERE chain = ?')) {
      results = results.filter((item) => item.chain === params[0]);
    } else if (sql.includes('WHERE LOWER(name) LIKE LOWER(?)')) {
      const searchTerm = params[0].replace(/%/g, '');
      results = results.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    } else if (sql.includes('WHERE 1=1')) {
      // 複数条件のフィルタ処理
      let paramIndex = 0;

      // SQLの各条件を順番にチェック
      const conditions = sql.split('AND').slice(1); // WHERE 1=1 以降の条件を取得

      for (const condition of conditions) {
        if (condition.includes('protein_g >=')) {
          const minProtein = params[paramIndex++];
          results = results.filter((item) => item.protein_g >= minProtein);
        } else if (condition.includes('protein_g <=')) {
          const maxProtein = params[paramIndex++];
          results = results.filter((item) => item.protein_g <= maxProtein);
        } else if (condition.includes('carbs_g >=')) {
          const minCarbs = params[paramIndex++];
          results = results.filter((item) => item.carbs_g !== null && item.carbs_g >= minCarbs);
        } else if (condition.includes('carbs_g <=')) {
          const maxCarbs = params[paramIndex++];
          results = results.filter((item) => item.carbs_g !== null && item.carbs_g <= maxCarbs);
        } else if (condition.includes('fat_g >=')) {
          const minFat = params[paramIndex++];
          results = results.filter((item) => item.fat_g !== null && item.fat_g >= minFat);
        } else if (condition.includes('fat_g <=')) {
          const maxFat = params[paramIndex++];
          results = results.filter((item) => item.fat_g !== null && item.fat_g <= maxFat);
        } else if (condition.includes('energy_kcal >=')) {
          const minEnergy = params[paramIndex++];
          results = results.filter(
            (item) => item.energy_kcal !== null && item.energy_kcal >= minEnergy,
          );
        } else if (condition.includes('energy_kcal <=')) {
          const maxEnergy = params[paramIndex++];
          results = results.filter(
            (item) => item.energy_kcal !== null && item.energy_kcal <= maxEnergy,
          );
        } else if (condition.includes('per = ?')) {
          const per = params[paramIndex++];
          results = results.filter((item) => item.per === per);
        }
      }
    }

    // ORDER BY の処理
    if (sql.includes('ORDER BY protein_g DESC')) {
      results.sort((a, b) => b.protein_g - a.protein_g);
    }

    // DISTINCT chain の処理
    if (sql.includes('SELECT DISTINCT chain')) {
      const uniqueChains = [...new Set(results.map((item) => item.chain))];
      return uniqueChains.sort().map((chain) => ({ chain }));
    }

    return results;
  }

  async getFirstAsync(sql: string, params: any[] = []): Promise<any> {
    if (sql.includes('SELECT * FROM menu_items WHERE id = ?')) {
      return this.menuItems.get(params[0]) || null;
    }

    if (sql.includes('SELECT MAX(last_seen_at)')) {
      const items = Array.from(this.menuItems.values());
      if (items.length === 0) return null;
      const maxDate = items.reduce(
        (max, item) => (item.last_seen_at > max ? item.last_seen_at : max),
        items[0]!.last_seen_at,
      );
      return { last_seen_at: maxDate };
    }

    return null;
  }

  async withTransactionAsync(callback: () => Promise<void>): Promise<void> {
    await callback();
  }

  async closeAsync(): Promise<void> {
    this.menuItems.clear();
  }
}

export const openDatabaseAsync = jest.fn(async (_name: string) => {
  return new MockSQLiteDatabase();
});

export type SQLiteDatabase = MockSQLiteDatabase;
