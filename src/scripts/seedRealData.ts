/**
 * 実データ投入スクリプト
 * 各飲食チェーン店の公式サイトから手動で転記した栄養データを投入
 * データ収集日: 2025年8月30日
 * 
 * 注意: このデータは手動で各チェーン店の公式サイトから転記したものです。
 * 最新の正確な情報は各チェーン店の公式サイトをご確認ください。
 */

import { DatabaseService } from '../infrastructure/database/DatabaseService';
import { MenuRepository } from '../infrastructure/database/MenuRepository';
import { MenuItem } from '../core/domain/MenuItem';
import { MenuItemData, Chain, DataSource, LegalNotice } from '../core/domain/types';

const currentDate = new Date().toISOString();
const dataCollectionDate = '2025-08-30';

// チェーン店情報
const chains: Chain[] = [
  {
    id: 'sukiya',
    name: 'sukiya',
    displayName: 'すき家',
    websiteUrl: 'https://www.sukiya.jp/',
    nutritionPageUrl: 'https://www.sukiya.jp/menu/',
    termsUrl: 'https://www.sukiya.jp/terms.html',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'yoshinoya',
    name: 'yoshinoya',
    displayName: '吉野家',
    websiteUrl: 'https://www.yoshinoya.com/',
    nutritionPageUrl: 'https://www.yoshinoya.com/menu/',
    termsUrl: 'https://www.yoshinoya.com/sitepolicy/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'matsuya',
    name: 'matsuya',
    displayName: '松屋',
    websiteUrl: 'https://www.matsuyafoods.co.jp/',
    nutritionPageUrl: 'https://www.matsuyafoods.co.jp/menu/',
    termsUrl: 'https://www.matsuyafoods.co.jp/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
];

// データソース情報
const dataSources: DataSource[] = [
  {
    id: 'sukiya_manual_20250830',
    chainId: 'sukiya',
    sourceType: 'manual_entry',
    sourceUrl: 'https://www.sukiya.jp/menu/',
    lastFetchedAt: dataCollectionDate,
    fetchMethod: 'manual',
    dataAccuracyNote: '公式サイトの栄養成分表示を手動で転記。最新情報は公式サイトをご確認ください。',
    legalComplianceNote: '手動転記のため利用規約違反なし。教育・参考目的での使用に限定。',
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: 'yoshinoya_manual_20250830',
    chainId: 'yoshinoya',
    sourceType: 'manual_entry',
    sourceUrl: 'https://www.yoshinoya.com/menu/',
    lastFetchedAt: dataCollectionDate,
    fetchMethod: 'manual',
    dataAccuracyNote: '公式サイトの栄養成分表示を手動で転記。最新情報は公式サイトをご確認ください。',
    legalComplianceNote: '手動転記のため利用規約違反なし。教育・参考目的での使用に限定。',
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: 'matsuya_manual_20250830',
    chainId: 'matsuya',
    sourceType: 'manual_entry',
    sourceUrl: 'https://www.matsuyafoods.co.jp/menu/',
    lastFetchedAt: dataCollectionDate,
    fetchMethod: 'manual',
    dataAccuracyNote: '公式サイトの栄養成分表示を手動で転記。最新情報は公式サイトをご確認ください。',
    legalComplianceNote: '手動転記のため利用規約違反なし。教育・参考目的での使用に限定。',
    createdAt: currentDate,
    updatedAt: currentDate,
  },
];

// 法的事項
const legalNotices: LegalNotice[] = [
  {
    id: 'disclaimer_v1',
    type: 'disclaimer',
    title: '免責事項',
    content: `本アプリケーションで提供される栄養成分情報は、各飲食チェーン店の公式サイトから手動で転記したものです。

以下の点にご注意ください：
1. データは${dataCollectionDate}時点のものです
2. 実際の栄養成分は調理方法、材料、季節により変動する可能性があります
3. アレルギー情報は含まれていません
4. 最新かつ正確な情報は各チェーン店の公式サイトをご確認ください
5. 本アプリの情報を元にした判断により生じた損害について、開発者は一切責任を負いません

健康上の懸念がある場合は、必ず医師や栄養士にご相談ください。`,
    version: '1.0.0',
    effectiveDate: dataCollectionDate,
    isActive: true,
    createdAt: currentDate,
  },
  {
    id: 'data_usage_v1',
    type: 'data_usage',
    title: 'データ利用について',
    content: `本アプリケーションのデータ利用について：

【データ収集方法】
- 各飲食チェーン店の公式ウェブサイトから手動で転記
- 自動取得（スクレイピング）は一切行っていません
- ${dataCollectionDate}時点の情報を使用

【データの正確性】
- 手動転記のため、入力ミスの可能性があります
- 定期的な更新を心がけていますが、最新でない場合があります
- 参考値としてご利用ください

【著作権について】
- 栄養成分データの著作権は各飲食チェーン店に帰属します
- 本アプリは教育・参考目的でのみ使用してください
- 商用利用は禁止されています`,
    version: '1.0.0',
    effectiveDate: dataCollectionDate,
    isActive: true,
    createdAt: currentDate,
  },
];

// すき家の実際のメニューデータ（手動転記）
const sukiyaMenus: MenuItemData[] = [
  {
    id: 'sukiya_gyudon_mini',
    chain: 'sukiya',
    name: '牛丼（ミニ）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 13.0, unit: 'g' },
      { type: 'fat', value: 15.1, unit: 'g' },
      { type: 'carbs', value: 60.2, unit: 'g' },
      { type: 'energy', value: 430, unit: 'kcal' },
    ],
    servingSize: 'ミニ',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.sukiya.jp/menu/in/gyudon/',
    sourceHash: `sukiya_gyudon_mini_${dataCollectionDate}`,
    dataSourceId: 'sukiya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'sukiya_gyudon_regular',
    chain: 'sukiya',
    name: '牛丼（並盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 22.9, unit: 'g' },
      { type: 'fat', value: 25.0, unit: 'g' },
      { type: 'carbs', value: 104.1, unit: 'g' },
      { type: 'energy', value: 733, unit: 'kcal' },
    ],
    servingSize: '並盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.sukiya.jp/menu/in/gyudon/',
    sourceHash: `sukiya_gyudon_regular_${dataCollectionDate}`,
    dataSourceId: 'sukiya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'sukiya_gyudon_large',
    chain: 'sukiya',
    name: '牛丼（大盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 27.7, unit: 'g' },
      { type: 'fat', value: 30.4, unit: 'g' },
      { type: 'carbs', value: 137.9, unit: 'g' },
      { type: 'energy', value: 938, unit: 'kcal' },
    ],
    servingSize: '大盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.sukiya.jp/menu/in/gyudon/',
    sourceHash: `sukiya_gyudon_large_${dataCollectionDate}`,
    dataSourceId: 'sukiya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'sukiya_gyudon_tokumori',
    chain: 'sukiya',
    name: '牛丼（特盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 40.8, unit: 'g' },
      { type: 'fat', value: 45.0, unit: 'g' },
      { type: 'carbs', value: 139.6, unit: 'g' },
      { type: 'energy', value: 1133, unit: 'kcal' },
    ],
    servingSize: '特盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.sukiya.jp/menu/in/gyudon/',
    sourceHash: `sukiya_gyudon_tokumori_${dataCollectionDate}`,
    dataSourceId: 'sukiya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'sukiya_gyudon_mega',
    chain: 'sukiya',
    name: '牛丼（メガ）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 58.8, unit: 'g' },
      { type: 'fat', value: 64.9, unit: 'g' },
      { type: 'carbs', value: 173.4, unit: 'g' },
      { type: 'energy', value: 1521, unit: 'kcal' },
    ],
    servingSize: 'メガ',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.sukiya.jp/menu/in/gyudon/',
    sourceHash: `sukiya_gyudon_mega_${dataCollectionDate}`,
    dataSourceId: 'sukiya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// 吉野家の実際のメニューデータ（手動転記）
const yoshinoyaMenus: MenuItemData[] = [
  {
    id: 'yoshinoya_gyudon_small',
    chain: 'yoshinoya',
    name: '牛丼（小盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 14.5, unit: 'g' },
      { type: 'fat', value: 16.5, unit: 'g' },
      { type: 'carbs', value: 79.2, unit: 'g' },
      { type: 'energy', value: 528, unit: 'kcal' },
    ],
    servingSize: '小盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.yoshinoya.com/menu/gyudon/',
    sourceHash: `yoshinoya_gyudon_small_${dataCollectionDate}`,
    dataSourceId: 'yoshinoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'yoshinoya_gyudon_regular',
    chain: 'yoshinoya',
    name: '牛丼（並盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 20.2, unit: 'g' },
      { type: 'fat', value: 23.4, unit: 'g' },
      { type: 'carbs', value: 113.8, unit: 'g' },
      { type: 'energy', value: 752, unit: 'kcal' },
    ],
    servingSize: '並盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.yoshinoya.com/menu/gyudon/',
    sourceHash: `yoshinoya_gyudon_regular_${dataCollectionDate}`,
    dataSourceId: 'yoshinoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'yoshinoya_gyudon_atama',
    chain: 'yoshinoya',
    name: '牛丼（アタマの大盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 26.0, unit: 'g' },
      { type: 'fat', value: 30.3, unit: 'g' },
      { type: 'carbs', value: 113.8, unit: 'g' },
      { type: 'energy', value: 847, unit: 'kcal' },
    ],
    servingSize: 'アタマの大盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.yoshinoya.com/menu/gyudon/',
    sourceHash: `yoshinoya_gyudon_atama_${dataCollectionDate}`,
    dataSourceId: 'yoshinoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'yoshinoya_gyudon_large',
    chain: 'yoshinoya',
    name: '牛丼（大盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 25.9, unit: 'g' },
      { type: 'fat', value: 30.3, unit: 'g' },
      { type: 'carbs', value: 148.4, unit: 'g' },
      { type: 'energy', value: 976, unit: 'kcal' },
    ],
    servingSize: '大盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.yoshinoya.com/menu/gyudon/',
    sourceHash: `yoshinoya_gyudon_large_${dataCollectionDate}`,
    dataSourceId: 'yoshinoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'yoshinoya_gyudon_tokumori',
    chain: 'yoshinoya',
    name: '牛丼（特盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 37.5, unit: 'g' },
      { type: 'fat', value: 44.1, unit: 'g' },
      { type: 'carbs', value: 148.4, unit: 'g' },
      { type: 'energy', value: 1166, unit: 'kcal' },
    ],
    servingSize: '特盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.yoshinoya.com/menu/gyudon/',
    sourceHash: `yoshinoya_gyudon_tokumori_${dataCollectionDate}`,
    dataSourceId: 'yoshinoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// 松屋の実際のメニューデータ（手動転記）
const matsuyaMenus: MenuItemData[] = [
  {
    id: 'matsuya_gyumeshi_mini',
    chain: 'matsuya',
    name: '牛めし（ミニ盛）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 11.5, unit: 'g' },
      { type: 'fat', value: 16.2, unit: 'g' },
      { type: 'carbs', value: 63.2, unit: 'g' },
      { type: 'energy', value: 448, unit: 'kcal' },
    ],
    servingSize: 'ミニ盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.matsuyafoods.co.jp/menu/',
    sourceHash: `matsuya_gyumeshi_mini_${dataCollectionDate}`,
    dataSourceId: 'matsuya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'matsuya_gyumeshi_regular',
    chain: 'matsuya',
    name: '牛めし（並盛）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 19.1, unit: 'g' },
      { type: 'fat', value: 26.5, unit: 'g' },
      { type: 'carbs', value: 103.8, unit: 'g' },
      { type: 'energy', value: 735, unit: 'kcal' },
    ],
    servingSize: '並盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.matsuyafoods.co.jp/menu/',
    sourceHash: `matsuya_gyumeshi_regular_${dataCollectionDate}`,
    dataSourceId: 'matsuya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'matsuya_gyumeshi_large',
    chain: 'matsuya',
    name: '牛めし（大盛）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 23.5, unit: 'g' },
      { type: 'fat', value: 32.6, unit: 'g' },
      { type: 'carbs', value: 137.8, unit: 'g' },
      { type: 'energy', value: 944, unit: 'kcal' },
    ],
    servingSize: '大盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.matsuyafoods.co.jp/menu/',
    sourceHash: `matsuya_gyumeshi_large_${dataCollectionDate}`,
    dataSourceId: 'matsuya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'matsuya_gyumeshi_tokumori',
    chain: 'matsuya',
    name: '牛めし（特盛）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 34.7, unit: 'g' },
      { type: 'fat', value: 48.8, unit: 'g' },
      { type: 'carbs', value: 139.5, unit: 'g' },
      { type: 'energy', value: 1149, unit: 'kcal' },
    ],
    servingSize: '特盛',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.matsuyafoods.co.jp/menu/',
    sourceHash: `matsuya_gyumeshi_tokumori_${dataCollectionDate}`,
    dataSourceId: 'matsuya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// データ投入の実行関数
export async function seedRealData(): Promise<void> {
  console.log('🌱 実データの投入を開始します...');
  console.log(`📅 データ収集日: ${dataCollectionDate}`);
  console.log('⚠️  注意: このデータは手動転記によるものです。最新情報は各チェーン店の公式サイトをご確認ください。\n');

  try {
    // データベースを初期化
    const db = new DatabaseService();
    await db.initialize();

    // チェーン店情報を投入
    console.log('🏢 チェーン店情報を投入...');
    for (const chain of chains) {
      await db.execute(`
        INSERT OR REPLACE INTO chains (id, name, display_name, website_url, nutrition_page_url, terms_url, data_collection_method, legal_notice, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [chain.id, chain.name, chain.displayName, chain.websiteUrl, chain.nutritionPageUrl, chain.termsUrl, chain.dataCollectionMethod, chain.legalNotice, chain.createdAt]);
    }
    console.log(`  ✅ ${chains.length}件のチェーン店情報を投入`);

    // データソース情報を投入
    console.log('\n📊 データソース情報を投入...');
    for (const dataSource of dataSources) {
      await db.execute(`
        INSERT OR REPLACE INTO data_sources (id, chain_id, source_type, source_url, last_fetched_at, fetch_method, data_accuracy_note, legal_compliance_note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [dataSource.id, dataSource.chainId, dataSource.sourceType, dataSource.sourceUrl, dataSource.lastFetchedAt, dataSource.fetchMethod, dataSource.dataAccuracyNote, dataSource.legalComplianceNote, dataSource.createdAt, dataSource.updatedAt]);
    }
    console.log(`  ✅ ${dataSources.length}件のデータソース情報を投入`);

    // 法的事項を投入
    console.log('\n⚖️  法的事項を投入...');
    for (const notice of legalNotices) {
      await db.execute(`
        INSERT OR REPLACE INTO legal_notices (id, type, title, content, version, effective_date, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [notice.id, notice.type, notice.title, notice.content, notice.version, notice.effectiveDate, notice.isActive ? 1 : 0, notice.createdAt]);
    }
    console.log(`  ✅ ${legalNotices.length}件の法的事項を投入`);

    // メニューデータを投入
    console.log('\n🍱 メニューデータを投入...');
    const repository = new MenuRepository(db);
    
    const allMenus = [
      ...sukiyaMenus.map((data) => new MenuItem(data)),
      ...yoshinoyaMenus.map((data) => new MenuItem(data)),
      ...matsuyaMenus.map((data) => new MenuItem(data)),
    ];

    await repository.bulkSave(allMenus);
    console.log(`  ✅ ${allMenus.length}件のメニューデータを投入`);

    // 投入結果のサマリー
    console.log('\n📊 投入結果サマリー:');
    console.log('================================');
    const sukiyaCount = await repository.findByChain('sukiya');
    const yoshinoyaCount = await repository.findByChain('yoshinoya');
    const matsuyaCount = await repository.findByChain('matsuya');

    console.log(`  すき家: ${sukiyaCount.length}件`);
    console.log(`  吉野家: ${yoshinoyaCount.length}件`);
    console.log(`  松屋: ${matsuyaCount.length}件`);
    console.log(`  ---------------`);
    console.log(`  合計: ${allMenus.length}件`);
    console.log('================================\n');

    console.log('✅ 実データの投入が完了しました！');
    console.log('📱 アプリを起動して、データが正しく表示されることを確認してください。');
    console.log('⚠️  重要: 最新の栄養情報は各チェーン店の公式サイトをご確認ください。');

    await db.close();
  } catch (error) {
    console.error('❌ 実データの投入に失敗しました:', error);
    throw error;
  }
}

// 直接実行の場合
if (require.main === module) {
  seedRealData()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}