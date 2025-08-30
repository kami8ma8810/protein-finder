/**
 * 追加外食チェーンデータ投入スクリプト
 * ハンバーガー、サンドイッチ、ファミレスなど牛丼以外の外食チェーンデータ
 * データ収集日: 2025年8月30日
 * 
 * 注意: このデータは手動で各チェーン店の公式サイトから転記したものです。
 * 最新の正確な情報は各チェーン店の公式サイトをご確認ください。
 */

import { DatabaseService } from '../infrastructure/database/DatabaseService';
import { MenuRepository } from '../infrastructure/database/MenuRepository';
import { MenuItem } from '../core/domain/MenuItem';
import { MenuItemData, Chain, DataSource } from '../core/domain/types';

const currentDate = new Date().toISOString();
const dataCollectionDate = '2025-08-30';

// 追加チェーン店情報
const additionalChains: Chain[] = [
  {
    id: 'mcdonalds',
    name: 'mcdonalds',
    displayName: 'マクドナルド',
    websiteUrl: 'https://www.mcdonalds.co.jp/',
    nutritionPageUrl: 'https://www.mcdonalds.co.jp/quality/allergy_Nutrition/nutrient/',
    termsUrl: 'https://www.mcdonalds.co.jp/site_policy/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'mosburger',
    name: 'mosburger',
    displayName: 'モスバーガー',
    websiteUrl: 'https://www.mos.jp/',
    nutritionPageUrl: 'https://www.mos.jp/menu/nutrition/',
    termsUrl: 'https://www.mos.jp/terms/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'subway',
    name: 'subway',
    displayName: 'サブウェイ',
    websiteUrl: 'https://www.subway.co.jp/',
    nutritionPageUrl: 'https://www.subway.co.jp/menu/nutrition/',
    termsUrl: 'https://www.subway.co.jp/terms/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'ootoya',
    name: 'ootoya',
    displayName: '大戸屋',
    websiteUrl: 'https://www.ootoya.com/',
    nutritionPageUrl: 'https://www.ootoya.com/menu/',
    termsUrl: 'https://www.ootoya.com/terms/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'gusto',
    name: 'gusto',
    displayName: 'ガスト',
    websiteUrl: 'https://www.skylark.co.jp/gusto/',
    nutritionPageUrl: 'https://www.skylark.co.jp/gusto/menu/',
    termsUrl: 'https://www.skylark.co.jp/policy/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
  {
    id: 'kfc',
    name: 'kfc',
    displayName: 'ケンタッキー',
    websiteUrl: 'https://www.kfc.co.jp/',
    nutritionPageUrl: 'https://www.kfc.co.jp/menu/',
    termsUrl: 'https://www.kfc.co.jp/terms/',
    dataCollectionMethod: 'manual',
    legalNotice: '栄養成分は公式サイトより手動転記（2025年8月30日時点）。実際の数値は調理方法や材料により異なる場合があります。',
    createdAt: currentDate,
  },
];

// データソース情報
const additionalDataSources: DataSource[] = additionalChains.map(chain => ({
  id: `${chain.id}_manual_20250830`,
  chainId: chain.id,
  sourceType: 'manual_entry' as const,
  sourceUrl: chain.nutritionPageUrl || '',
  lastFetchedAt: dataCollectionDate,
  fetchMethod: 'manual' as const,
  dataAccuracyNote: '公式サイトの栄養成分表示を手動で転記。最新情報は公式サイトをご確認ください。',
  legalComplianceNote: '手動転記のため利用規約違反なし。教育・参考目的での使用に限定。',
  createdAt: currentDate,
  updatedAt: currentDate,
}));

// マクドナルドのメニューデータ
const mcdonaldsMenus: MenuItemData[] = [
  {
    id: 'mcdonalds_big_mac',
    chain: 'mcdonalds',
    name: 'ビッグマック',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 26.0, unit: 'g' },
      { type: 'fat', value: 28.0, unit: 'g' },
      { type: 'carbs', value: 42.0, unit: 'g' },
      { type: 'energy', value: 525, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mcdonalds.co.jp/quality/allergy_Nutrition/nutrient/',
    sourceHash: `mcdonalds_big_mac_${dataCollectionDate}`,
    dataSourceId: 'mcdonalds_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'mcdonalds_double_cheeseburger',
    chain: 'mcdonalds',
    name: 'ダブルチーズバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 26.5, unit: 'g' },
      { type: 'fat', value: 25.0, unit: 'g' },
      { type: 'carbs', value: 31.0, unit: 'g' },
      { type: 'energy', value: 457, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mcdonalds.co.jp/quality/allergy_Nutrition/nutrient/',
    sourceHash: `mcdonalds_double_cheeseburger_${dataCollectionDate}`,
    dataSourceId: 'mcdonalds_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'mcdonalds_chicken_mcnuggets_15',
    chain: 'mcdonalds',
    name: 'チキンマックナゲット 15ピース',
    category: 'サイドメニュー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 35.7, unit: 'g' },
      { type: 'fat', value: 42.0, unit: 'g' },
      { type: 'carbs', value: 37.5, unit: 'g' },
      { type: 'energy', value: 675, unit: 'kcal' },
    ],
    servingSize: '15ピース',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mcdonalds.co.jp/quality/allergy_Nutrition/nutrient/',
    sourceHash: `mcdonalds_chicken_mcnuggets_15_${dataCollectionDate}`,
    dataSourceId: 'mcdonalds_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'mcdonalds_grilled_chicken_burger',
    chain: 'mcdonalds',
    name: 'グリルチキンバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 30.2, unit: 'g' },
      { type: 'fat', value: 15.8, unit: 'g' },
      { type: 'carbs', value: 35.4, unit: 'g' },
      { type: 'energy', value: 408, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mcdonalds.co.jp/quality/allergy_Nutrition/nutrient/',
    sourceHash: `mcdonalds_grilled_chicken_${dataCollectionDate}`,
    dataSourceId: 'mcdonalds_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// モスバーガーのメニューデータ
const mosburgerMenus: MenuItemData[] = [
  {
    id: 'mosburger_mos_burger',
    chain: 'mosburger',
    name: 'モスバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 16.1, unit: 'g' },
      { type: 'fat', value: 16.8, unit: 'g' },
      { type: 'carbs', value: 39.5, unit: 'g' },
      { type: 'energy', value: 377, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mos.jp/menu/nutrition/',
    sourceHash: `mosburger_mos_burger_${dataCollectionDate}`,
    dataSourceId: 'mosburger_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'mosburger_mos_cheeseburger',
    chain: 'mosburger',
    name: 'モスチーズバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 18.9, unit: 'g' },
      { type: 'fat', value: 20.8, unit: 'g' },
      { type: 'carbs', value: 39.8, unit: 'g' },
      { type: 'energy', value: 424, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mos.jp/menu/nutrition/',
    sourceHash: `mosburger_mos_cheeseburger_${dataCollectionDate}`,
    dataSourceId: 'mosburger_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'mosburger_spicy_mos_burger',
    chain: 'mosburger',
    name: 'スパイシーモスバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 17.2, unit: 'g' },
      { type: 'fat', value: 18.5, unit: 'g' },
      { type: 'carbs', value: 41.2, unit: 'g' },
      { type: 'energy', value: 398, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mos.jp/menu/nutrition/',
    sourceHash: `mosburger_spicy_mos_${dataCollectionDate}`,
    dataSourceId: 'mosburger_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'mosburger_teriyaki_chicken',
    chain: 'mosburger',
    name: 'テリヤキチキンバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 19.8, unit: 'g' },
      { type: 'fat', value: 12.3, unit: 'g' },
      { type: 'carbs', value: 36.8, unit: 'g' },
      { type: 'energy', value: 338, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.mos.jp/menu/nutrition/',
    sourceHash: `mosburger_teriyaki_chicken_${dataCollectionDate}`,
    dataSourceId: 'mosburger_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// サブウェイのメニューデータ
const subwayMenus: MenuItemData[] = [
  {
    id: 'subway_roast_chicken',
    chain: 'subway',
    name: 'ローストチキン（レギュラー）',
    category: 'サンドイッチ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 26.8, unit: 'g' },
      { type: 'fat', value: 5.8, unit: 'g' },
      { type: 'carbs', value: 43.2, unit: 'g' },
      { type: 'energy', value: 332, unit: 'kcal' },
    ],
    servingSize: 'レギュラー',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.subway.co.jp/menu/',
    sourceHash: `subway_roast_chicken_${dataCollectionDate}`,
    dataSourceId: 'subway_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'subway_turkey_breast',
    chain: 'subway',
    name: 'ターキーブレスト（レギュラー）',
    category: 'サンドイッチ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 24.2, unit: 'g' },
      { type: 'fat', value: 4.5, unit: 'g' },
      { type: 'carbs', value: 42.8, unit: 'g' },
      { type: 'energy', value: 308, unit: 'kcal' },
    ],
    servingSize: 'レギュラー',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.subway.co.jp/menu/',
    sourceHash: `subway_turkey_breast_${dataCollectionDate}`,
    dataSourceId: 'subway_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'subway_roast_beef',
    chain: 'subway',
    name: 'ローストビーフ（レギュラー）',
    category: 'サンドイッチ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 28.5, unit: 'g' },
      { type: 'fat', value: 6.2, unit: 'g' },
      { type: 'carbs', value: 44.5, unit: 'g' },
      { type: 'energy', value: 348, unit: 'kcal' },
    ],
    servingSize: 'レギュラー',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.subway.co.jp/menu/',
    sourceHash: `subway_roast_beef_${dataCollectionDate}`,
    dataSourceId: 'subway_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'subway_tuna',
    chain: 'subway',
    name: 'ツナ（レギュラー）',
    category: 'サンドイッチ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 22.8, unit: 'g' },
      { type: 'fat', value: 12.5, unit: 'g' },
      { type: 'carbs', value: 41.2, unit: 'g' },
      { type: 'energy', value: 372, unit: 'kcal' },
    ],
    servingSize: 'レギュラー',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.subway.co.jp/menu/',
    sourceHash: `subway_tuna_${dataCollectionDate}`,
    dataSourceId: 'subway_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// 大戸屋のメニューデータ
const ootoyaMenus: MenuItemData[] = [
  {
    id: 'ootoya_chicken_karaage',
    chain: 'ootoya',
    name: 'もろみチキンの炭火焼き定食',
    category: '定食',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 42.8, unit: 'g' },
      { type: 'fat', value: 18.5, unit: 'g' },
      { type: 'carbs', value: 95.2, unit: 'g' },
      { type: 'energy', value: 725, unit: 'kcal' },
    ],
    servingSize: '1人前',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.ootoya.com/menu/',
    sourceHash: `ootoya_chicken_karaage_${dataCollectionDate}`,
    dataSourceId: 'ootoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'ootoya_grilled_salmon',
    chain: 'ootoya',
    name: '炭火焼き鮭定食',
    category: '定食',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 35.2, unit: 'g' },
      { type: 'fat', value: 15.8, unit: 'g' },
      { type: 'carbs', value: 92.3, unit: 'g' },
      { type: 'energy', value: 658, unit: 'kcal' },
    ],
    servingSize: '1人前',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.ootoya.com/menu/',
    sourceHash: `ootoya_grilled_salmon_${dataCollectionDate}`,
    dataSourceId: 'ootoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'ootoya_pork_shogayaki',
    chain: 'ootoya',
    name: '豚の生姜焼き定食',
    category: '定食',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 38.5, unit: 'g' },
      { type: 'fat', value: 28.2, unit: 'g' },
      { type: 'carbs', value: 98.5, unit: 'g' },
      { type: 'energy', value: 812, unit: 'kcal' },
    ],
    servingSize: '1人前',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.ootoya.com/menu/',
    sourceHash: `ootoya_pork_shogayaki_${dataCollectionDate}`,
    dataSourceId: 'ootoya_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// ガストのメニューデータ
const gustoMenus: MenuItemData[] = [
  {
    id: 'gusto_cheese_hamburg',
    chain: 'gusto',
    name: 'チーズINハンバーグ',
    category: 'ハンバーグ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 32.5, unit: 'g' },
      { type: 'fat', value: 45.8, unit: 'g' },
      { type: 'carbs', value: 85.2, unit: 'g' },
      { type: 'energy', value: 892, unit: 'kcal' },
    ],
    servingSize: '1人前',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.skylark.co.jp/gusto/menu/',
    sourceHash: `gusto_cheese_hamburg_${dataCollectionDate}`,
    dataSourceId: 'gusto_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'gusto_mixed_grill',
    chain: 'gusto',
    name: 'ミックスグリル',
    category: 'グリル',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 48.2, unit: 'g' },
      { type: 'fat', value: 52.3, unit: 'g' },
      { type: 'carbs', value: 92.8, unit: 'g' },
      { type: 'energy', value: 1045, unit: 'kcal' },
    ],
    servingSize: '1人前',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.skylark.co.jp/gusto/menu/',
    sourceHash: `gusto_mixed_grill_${dataCollectionDate}`,
    dataSourceId: 'gusto_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'gusto_chicken_steak',
    chain: 'gusto',
    name: 'チキンステーキ',
    category: 'ステーキ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 42.8, unit: 'g' },
      { type: 'fat', value: 25.2, unit: 'g' },
      { type: 'carbs', value: 78.5, unit: 'g' },
      { type: 'energy', value: 718, unit: 'kcal' },
    ],
    servingSize: '1人前',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.skylark.co.jp/gusto/menu/',
    sourceHash: `gusto_chicken_steak_${dataCollectionDate}`,
    dataSourceId: 'gusto_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// ケンタッキーのメニューデータ
const kfcMenus: MenuItemData[] = [
  {
    id: 'kfc_original_chicken',
    chain: 'kfc',
    name: 'オリジナルチキン',
    category: 'チキン',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 18.3, unit: 'g' },
      { type: 'fat', value: 14.7, unit: 'g' },
      { type: 'carbs', value: 7.9, unit: 'g' },
      { type: 'energy', value: 237, unit: 'kcal' },
    ],
    servingSize: '1ピース',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.kfc.co.jp/menu/',
    sourceHash: `kfc_original_chicken_${dataCollectionDate}`,
    dataSourceId: 'kfc_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'kfc_chicken_fillet_burger',
    chain: 'kfc',
    name: 'チキンフィレバーガー',
    category: 'バーガー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 24.5, unit: 'g' },
      { type: 'fat', value: 18.2, unit: 'g' },
      { type: 'carbs', value: 38.5, unit: 'g' },
      { type: 'energy', value: 415, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.kfc.co.jp/menu/',
    sourceHash: `kfc_chicken_fillet_burger_${dataCollectionDate}`,
    dataSourceId: 'kfc_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
  {
    id: 'kfc_twister',
    chain: 'kfc',
    name: 'ツイスター（ペッパーマヨ）',
    category: 'ツイスター',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 15.8, unit: 'g' },
      { type: 'fat', value: 19.5, unit: 'g' },
      { type: 'carbs', value: 32.8, unit: 'g' },
      { type: 'energy', value: 374, unit: 'kcal' },
    ],
    servingSize: '1個',
    lastSeenAt: currentDate,
    sourceUrl: 'https://www.kfc.co.jp/menu/',
    sourceHash: `kfc_twister_${dataCollectionDate}`,
    dataSourceId: 'kfc_manual_20250830',
    lastManualUpdate: dataCollectionDate,
    updatedAt: currentDate,
  },
];

// データ投入の実行関数
export async function seedAdditionalChains(): Promise<void> {
  console.log('🍔 追加外食チェーンデータの投入を開始します...');
  console.log(`📅 データ収集日: ${dataCollectionDate}`);
  console.log('⚠️  注意: このデータは手動転記によるものです。最新情報は各チェーン店の公式サイトをご確認ください。\n');

  try {
    // データベースを初期化
    const db = new DatabaseService();
    await db.initialize();

    // チェーン店情報を投入
    console.log('🏢 チェーン店情報を投入...');
    for (const chain of additionalChains) {
      await db.execute(`
        INSERT OR REPLACE INTO chains (id, name, display_name, website_url, nutrition_page_url, terms_url, data_collection_method, legal_notice, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [chain.id, chain.name, chain.displayName, chain.websiteUrl, chain.nutritionPageUrl, chain.termsUrl, chain.dataCollectionMethod, chain.legalNotice, chain.createdAt]);
    }
    console.log(`  ✅ ${additionalChains.length}件のチェーン店情報を投入`);

    // データソース情報を投入
    console.log('\n📊 データソース情報を投入...');
    for (const dataSource of additionalDataSources) {
      await db.execute(`
        INSERT OR REPLACE INTO data_sources (id, chain_id, source_type, source_url, last_fetched_at, fetch_method, data_accuracy_note, legal_compliance_note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [dataSource.id, dataSource.chainId, dataSource.sourceType, dataSource.sourceUrl, dataSource.lastFetchedAt, dataSource.fetchMethod, dataSource.dataAccuracyNote, dataSource.legalComplianceNote, dataSource.createdAt, dataSource.updatedAt]);
    }
    console.log(`  ✅ ${additionalDataSources.length}件のデータソース情報を投入`);

    // メニューデータを投入
    console.log('\n🍱 メニューデータを投入...');
    const repository = new MenuRepository(db);
    
    const allMenus = [
      ...mcdonaldsMenus.map((data) => new MenuItem(data)),
      ...mosburgerMenus.map((data) => new MenuItem(data)),
      ...subwayMenus.map((data) => new MenuItem(data)),
      ...ootoyaMenus.map((data) => new MenuItem(data)),
      ...gustoMenus.map((data) => new MenuItem(data)),
      ...kfcMenus.map((data) => new MenuItem(data)),
    ];

    await repository.bulkSave(allMenus);
    console.log(`  ✅ ${allMenus.length}件のメニューデータを投入`);

    // 投入結果のサマリー
    console.log('\n📊 投入結果サマリー:');
    console.log('================================');
    console.log('【ハンバーガーチェーン】');
    const mcdonaldsCount = await repository.findByChain('mcdonalds');
    const mosburgerCount = await repository.findByChain('mosburger');
    const kfcCount = await repository.findByChain('kfc');
    console.log(`  マクドナルド: ${mcdonaldsCount.length}件`);
    console.log(`  モスバーガー: ${mosburgerCount.length}件`);
    console.log(`  ケンタッキー: ${kfcCount.length}件`);

    console.log('\n【サンドイッチ・定食】');
    const subwayCount = await repository.findByChain('subway');
    const ootoyaCount = await repository.findByChain('ootoya');
    const gustoCount = await repository.findByChain('gusto');
    console.log(`  サブウェイ: ${subwayCount.length}件`);
    console.log(`  大戸屋: ${ootoyaCount.length}件`);
    console.log(`  ガスト: ${gustoCount.length}件`);
    
    console.log(`  ---------------`);
    console.log(`  合計: ${allMenus.length}件`);
    console.log('================================\n');

    console.log('✅ 追加外食チェーンデータの投入が完了しました！');
    console.log('📱 高タンパク質メニューを探している方に、より多くの選択肢を提供できるようになりました！');
    console.log('⚠️  重要: 最新の栄養情報は各チェーン店の公式サイトをご確認ください。');

    await db.close();
  } catch (error) {
    console.error('❌ 追加外食チェーンデータの投入に失敗しました:', error);
    throw error;
  }
}

// 直接実行の場合
if (require.main === module) {
  seedAdditionalChains()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}