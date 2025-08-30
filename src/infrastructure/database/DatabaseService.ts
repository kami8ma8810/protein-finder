/**
 * DatabaseService
 * SQLiteデータベースの管理とスキーマ初期化
 */

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;
  private readonly dbName: string;

  constructor(dbName: string = 'protein_finder.db') {
    this.dbName = dbName;
  }

  async initialize(): Promise<void> {
    try {
      // Web版では SQLite を使用しない（モックデータで対応）
      if (Platform.OS === 'web') {
        console.log('🌐 Web版のため、SQLiteはスキップします');
        return;
      }

      // データベース接続
      this.database = await SQLite.openDatabaseAsync(this.dbName);

      // スキーマ作成
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw new Error('Failed to initialize database');
    }
  }

  private async createTables(): Promise<void> {
    if (!this.database) {
      if (Platform.OS === 'web') return;
      throw new Error('Database not initialized');
    }

    // menu_items テーブル
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        chain TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        per TEXT CHECK (per IN ('serving', '100g')) NOT NULL,
        protein_g REAL NOT NULL,
        fat_g REAL,
        carbs_g REAL,
        energy_kcal REAL,
        serving_size TEXT,
        allergens TEXT,
        last_seen_at TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_menu_chain ON menu_items(chain);
      CREATE INDEX IF NOT EXISTS idx_menu_protein ON menu_items(protein_g);
      CREATE INDEX IF NOT EXISTS idx_menu_per ON menu_items(per);
      CREATE INDEX IF NOT EXISTS idx_menu_name ON menu_items(name);
    `);

    // chains テーブル（将来の拡張用）
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS chains (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        logo_url TEXT,
        website_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async execute(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
    if (Platform.OS === 'web') {
      // Web版ではダミーの結果を返す
      return { changes: 0, lastInsertRowId: 0 };
    }
    if (!this.database) throw new Error('Database not initialized');
    return await this.database.runAsync(sql, params);
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (Platform.OS === 'web') {
      // Web版では空の配列を返す
      return [];
    }
    if (!this.database) throw new Error('Database not initialized');
    const result = await this.database.getAllAsync(sql, params);
    return result as T[];
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    if (Platform.OS === 'web') {
      // Web版ではnullを返す
      return null;
    }
    if (!this.database) throw new Error('Database not initialized');
    const result = await this.database.getFirstAsync(sql, params);
    return result as T | null;
  }

  async transaction(callback: (db: SQLite.SQLiteDatabase) => Promise<void>): Promise<void> {
    if (Platform.OS === 'web') {
      // Web版ではトランザクションをスキップ
      console.log('🌐 Web版のため、トランザクションをスキップ');
      return;
    }
    if (!this.database) throw new Error('Database not initialized');

    await this.database.withTransactionAsync(async () => {
      await callback(this.database!);
    });
  }

  async close(): Promise<void> {
    if (this.database) {
      await this.database.closeAsync();
      this.database = null;
    }
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.database) throw new Error('Database not initialized');
    return this.database;
  }
}
