import Database from 'better-sqlite3';
import { chainData } from '../src/data/chainData';
import path from 'path';

const dbPath = path.join(__dirname, '../src/infrastructure/database/menu.db');
const db = new Database(dbPath);

// テーブルを作成
db.exec(`
  CREATE TABLE IF NOT EXISTS chains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    chain_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    protein_g REAL NOT NULL,
    calories INTEGER,
    carbs_g REAL,
    fat_g REAL,
    price_yen INTEGER,
    allergens TEXT,
    is_available INTEGER DEFAULT 1,
    is_seasonal INTEGER DEFAULT 0,
    serving_size_g INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chain_id) REFERENCES chains(id)
  );

  CREATE INDEX IF NOT EXISTS idx_menu_items_chain_id ON menu_items(chain_id);
  CREATE INDEX IF NOT EXISTS idx_menu_items_protein ON menu_items(protein_g);
  CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items(name);
`);

// チェーン店データを挿入
const insertChain = db.prepare(`
  INSERT OR REPLACE INTO chains (id, name, category, logo_url, website_url)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMenuItem = db.prepare(`
  INSERT OR REPLACE INTO menu_items (
    id, chain_id, name, category, protein_g, calories, 
    carbs_g, fat_g, price_yen, allergens, is_available, 
    is_seasonal, serving_size_g
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// トランザクション内で実行
const insertAll = db.transaction(() => {
  let totalChains = 0;
  let totalItems = 0;

  for (const chain of chainData) {
    insertChain.run(
      chain.id,
      chain.name,
      chain.category,
      chain.logoUrl || null,
      chain.websiteUrl || null
    );
    totalChains++;

    for (const item of chain.menuItems) {
      insertMenuItem.run(
        item.id,
        chain.id,
        item.name,
        item.category,
        item.proteinG,
        item.calories || null,
        item.carbsG || null,
        item.fatG || null,
        item.priceYen || null,
        item.allergens ? JSON.stringify(item.allergens) : null,
        item.isAvailable ? 1 : 0,
        item.isSeasonal ? 1 : 0,
        item.servingSizeG || null
      );
      totalItems++;
    }
  }

  console.log(`✅ データベースセットアップ完了！`);
  console.log(`   - ${totalChains}個のチェーン店を登録`);
  console.log(`   - ${totalItems}個のメニューアイテムを登録`);
});

try {
  insertAll();
} catch (error) {
  console.error('❌ データベースセットアップ失敗:', error);
  process.exit(1);
}

// 確認のため、いくつかのデータを表示
const topProteinItems = db.prepare(`
  SELECT m.name, m.protein_g, c.name as chain_name
  FROM menu_items m
  JOIN chains c ON m.chain_id = c.id
  ORDER BY m.protein_g DESC
  LIMIT 5
`).all();

console.log('\n📊 たんぱく質TOP5メニュー:');
topProteinItems.forEach((item: any, index: number) => {
  console.log(`   ${index + 1}. ${item.chain_name} - ${item.name}: ${item.protein_g}g`);
});

db.close();