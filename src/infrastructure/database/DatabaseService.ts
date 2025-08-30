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

    // menu_items テーブル（改良版）
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
        data_source_id TEXT,
        last_manual_update TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id)
      );

      CREATE INDEX IF NOT EXISTS idx_menu_chain ON menu_items(chain);
      CREATE INDEX IF NOT EXISTS idx_menu_protein ON menu_items(protein_g);
      CREATE INDEX IF NOT EXISTS idx_menu_per ON menu_items(per);
      CREATE INDEX IF NOT EXISTS idx_menu_name ON menu_items(name);
      CREATE INDEX IF NOT EXISTS idx_menu_updated ON menu_items(updated_at);
    `);

    // chains テーブル（拡張版）
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS chains (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        logo_url TEXT,
        website_url TEXT,
        nutrition_page_url TEXT,
        terms_url TEXT,
        data_collection_method TEXT CHECK (data_collection_method IN ('manual', 'api', 'scraping')),
        legal_notice TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // data_sources テーブル（新規）
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS data_sources (
        id TEXT PRIMARY KEY,
        chain_id TEXT NOT NULL,
        source_type TEXT CHECK (source_type IN ('official_website', 'api', 'manual_entry', 'user_submission')),
        source_url TEXT,
        last_fetched_at TEXT,
        fetch_method TEXT CHECK (fetch_method IN ('manual', 'automated')),
        data_accuracy_note TEXT,
        legal_compliance_note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chain_id) REFERENCES chains(id)
      );

      CREATE INDEX IF NOT EXISTS idx_data_source_chain ON data_sources(chain_id);
      CREATE INDEX IF NOT EXISTS idx_data_source_type ON data_sources(source_type);
    `);

    // update_logs テーブル（新規）
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS update_logs (
        id TEXT PRIMARY KEY,
        menu_item_id TEXT,
        chain_id TEXT,
        update_type TEXT CHECK (update_type IN ('manual', 'automated', 'user_correction')),
        updater_name TEXT,
        update_note TEXT,
        old_values TEXT,
        new_values TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
        FOREIGN KEY (chain_id) REFERENCES chains(id)
      );

      CREATE INDEX IF NOT EXISTS idx_update_log_menu ON update_logs(menu_item_id);
      CREATE INDEX IF NOT EXISTS idx_update_log_date ON update_logs(created_at);
    `);

    // legal_notices テーブル（新規）
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS legal_notices (
        id TEXT PRIMARY KEY,
        type TEXT CHECK (type IN ('disclaimer', 'terms_of_use', 'privacy_policy', 'data_usage')),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        version TEXT NOT NULL,
        effective_date TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_legal_type ON legal_notices(type);
      CREATE INDEX IF NOT EXISTS idx_legal_active ON legal_notices(is_active);
    `);

    // user_consent_logs テーブル（新規）
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS user_consent_logs (
        id TEXT PRIMARY KEY,
        legal_notice_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        consent_given INTEGER NOT NULL,
        ip_hash TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (legal_notice_id) REFERENCES legal_notices(id)
      );

      CREATE INDEX IF NOT EXISTS idx_consent_device ON user_consent_logs(device_id);
      CREATE INDEX IF NOT EXISTS idx_consent_date ON user_consent_logs(created_at);
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
