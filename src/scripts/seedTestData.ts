/**
 * テストデータ投入スクリプト
 * 実際の牛丼チェーン店のメニューに近いテストデータを生成
 */

import { DatabaseService } from '@/infrastructure/database/DatabaseService';
import { MenuRepository } from '@/infrastructure/database/MenuRepository';
import { MenuItem } from '@/core/domain/MenuItem';
import { MenuItemData } from '@/core/domain/types';

// すき家のメニューデータ
const sukiyaMenus: MenuItemData[] = [
  {
    id: 'sukiya_gyudon_mini',
    chain: 'sukiya',
    name: '牛丼（ミニ）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 12.5, unit: 'g' },
      { type: 'fat', value: 14.5, unit: 'g' },
      { type: 'carbs', value: 58.8, unit: 'g' },
      { type: 'energy', value: 419, unit: 'kcal' },
    ],
    servingSize: 'ミニ（240g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_mini_' + Date.now(),
  },
  {
    id: 'sukiya_gyudon_regular',
    chain: 'sukiya',
    name: '牛丼（並盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 22.5, unit: 'g' },
      { type: 'fat', value: 25.2, unit: 'g' },
      { type: 'carbs', value: 103.1, unit: 'g' },
      { type: 'energy', value: 733, unit: 'kcal' },
    ],
    servingSize: '並盛（350g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_regular_' + Date.now(),
  },
  {
    id: 'sukiya_gyudon_large',
    chain: 'sukiya',
    name: '牛丼（大盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 27.1, unit: 'g' },
      { type: 'fat', value: 30.8, unit: 'g' },
      { type: 'carbs', value: 136.8, unit: 'g' },
      { type: 'energy', value: 936, unit: 'kcal' },
    ],
    servingSize: '大盛（460g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_large_' + Date.now(),
  },
  {
    id: 'sukiya_gyudon_tokumori',
    chain: 'sukiya',
    name: '牛丼（特盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 40.2, unit: 'g' },
      { type: 'fat', value: 45.2, unit: 'g' },
      { type: 'carbs', value: 138.5, unit: 'g' },
      { type: 'energy', value: 1134, unit: 'kcal' },
    ],
    servingSize: '特盛（570g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_tokumori_' + Date.now(),
  },
  {
    id: 'sukiya_cheese_gyudon',
    chain: 'sukiya',
    name: 'チーズ牛丼（並盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 28.5, unit: 'g' },
      { type: 'fat', value: 35.2, unit: 'g' },
      { type: 'carbs', value: 105.1, unit: 'g' },
      { type: 'energy', value: 856, unit: 'kcal' },
    ],
    servingSize: '並盛（380g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_cheese_' + Date.now(),
  },
  {
    id: 'sukiya_oroshi_ponzu',
    chain: 'sukiya',
    name: 'おろしポン酢牛丼（並盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 23.2, unit: 'g' },
      { type: 'fat', value: 25.5, unit: 'g' },
      { type: 'carbs', value: 106.3, unit: 'g' },
      { type: 'energy', value: 752, unit: 'kcal' },
    ],
    servingSize: '並盛（380g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_oroshi_' + Date.now(),
  },
  {
    id: 'sukiya_power_salad',
    chain: 'sukiya',
    name: 'パワーサラダ',
    category: 'サラダ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 15.8, unit: 'g' },
      { type: 'fat', value: 8.5, unit: 'g' },
      { type: 'carbs', value: 12.3, unit: 'g' },
      { type: 'energy', value: 189, unit: 'kcal' },
    ],
    servingSize: '1皿（250g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_salad_' + Date.now(),
  },
  {
    id: 'sukiya_tonjiru',
    chain: 'sukiya',
    name: '豚汁',
    category: 'サイドメニュー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 8.5, unit: 'g' },
      { type: 'fat', value: 4.2, unit: 'g' },
      { type: 'carbs', value: 15.3, unit: 'g' },
      { type: 'energy', value: 134, unit: 'kcal' },
    ],
    servingSize: '1杯（250ml）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/sukiya',
    sourceHash: 'sukiya_tonjiru_' + Date.now(),
  },
];

// 吉野家のメニューデータ
const yoshinoyaMenus: MenuItemData[] = [
  {
    id: 'yoshinoya_gyudon_mini',
    chain: 'yoshinoya',
    name: '牛丼（小盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 14.1, unit: 'g' },
      { type: 'fat', value: 16.2, unit: 'g' },
      { type: 'carbs', value: 78.3, unit: 'g' },
      { type: 'energy', value: 518, unit: 'kcal' },
    ],
    servingSize: '小盛（250g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'yoshinoya_mini_' + Date.now(),
  },
  {
    id: 'yoshinoya_gyudon_regular',
    chain: 'yoshinoya',
    name: '牛丼（並盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 20.4, unit: 'g' },
      { type: 'fat', value: 23.4, unit: 'g' },
      { type: 'carbs', value: 113.1, unit: 'g' },
      { type: 'energy', value: 752, unit: 'kcal' },
    ],
    servingSize: '並盛（350g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'yoshinoya_regular_' + Date.now(),
  },
  {
    id: 'yoshinoya_gyudon_large',
    chain: 'yoshinoya',
    name: '牛丼（大盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 25.2, unit: 'g' },
      { type: 'fat', value: 29.1, unit: 'g' },
      { type: 'carbs', value: 145.5, unit: 'g' },
      { type: 'energy', value: 957, unit: 'kcal' },
    ],
    servingSize: '大盛（470g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'yoshinoya_large_' + Date.now(),
  },
  {
    id: 'yoshinoya_gyudon_tokumori',
    chain: 'yoshinoya',
    name: '牛丼（特盛）',
    category: '牛丼',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 35.8, unit: 'g' },
      { type: 'fat', value: 41.5, unit: 'g' },
      { type: 'carbs', value: 145.5, unit: 'g' },
      { type: 'energy', value: 1112, unit: 'kcal' },
    ],
    servingSize: '特盛（550g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'yoshinoya_tokumori_' + Date.now(),
  },
  {
    id: 'yoshinoya_rizap_salad',
    chain: 'yoshinoya',
    name: 'ライザップ牛サラダ',
    category: 'サラダ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 30.2, unit: 'g' },
      { type: 'fat', value: 23.8, unit: 'g' },
      { type: 'carbs', value: 12.2, unit: 'g' },
      { type: 'energy', value: 384, unit: 'kcal' },
    ],
    servingSize: '1皿（300g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'yoshinoya_rizap_' + Date.now(),
  },
  {
    id: 'yoshinoya_miso_soup',
    chain: 'yoshinoya',
    name: 'みそ汁',
    category: 'サイドメニュー',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 2.5, unit: 'g' },
      { type: 'fat', value: 0.8, unit: 'g' },
      { type: 'carbs', value: 5.2, unit: 'g' },
      { type: 'energy', value: 38, unit: 'kcal' },
    ],
    servingSize: '1杯（200ml）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/yoshinoya',
    sourceHash: 'yoshinoya_miso_' + Date.now(),
  },
];

// 松屋のメニューデータ
const matsuyaMenus: MenuItemData[] = [
  {
    id: 'matsuya_gyumeshi_mini',
    chain: 'matsuya',
    name: 'プレミアム牛めし（ミニ）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 11.2, unit: 'g' },
      { type: 'fat', value: 15.8, unit: 'g' },
      { type: 'carbs', value: 62.1, unit: 'g' },
      { type: 'energy', value: 438, unit: 'kcal' },
    ],
    servingSize: 'ミニ（240g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_mini_' + Date.now(),
  },
  {
    id: 'matsuya_gyumeshi_regular',
    chain: 'matsuya',
    name: 'プレミアム牛めし（並盛）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 18.6, unit: 'g' },
      { type: 'fat', value: 25.9, unit: 'g' },
      { type: 'carbs', value: 102.0, unit: 'g' },
      { type: 'energy', value: 718, unit: 'kcal' },
    ],
    servingSize: '並盛（320g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_regular_' + Date.now(),
  },
  {
    id: 'matsuya_gyumeshi_large',
    chain: 'matsuya',
    name: 'プレミアム牛めし（大盛）',
    category: '牛めし',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 22.8, unit: 'g' },
      { type: 'fat', value: 31.8, unit: 'g' },
      { type: 'carbs', value: 135.2, unit: 'g' },
      { type: 'energy', value: 922, unit: 'kcal' },
    ],
    servingSize: '大盛（450g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_large_' + Date.now(),
  },
  {
    id: 'matsuya_brown_sauce_hamburg',
    chain: 'matsuya',
    name: 'ブラウンソースハンバーグ定食',
    category: 'ハンバーグ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 28.5, unit: 'g' },
      { type: 'fat', value: 42.3, unit: 'g' },
      { type: 'carbs', value: 105.8, unit: 'g' },
      { type: 'energy', value: 925, unit: 'kcal' },
    ],
    servingSize: '1人前（450g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_hamburg_' + Date.now(),
  },
  {
    id: 'matsuya_kalbi_yakiniku',
    chain: 'matsuya',
    name: 'カルビ焼肉定食',
    category: '焼肉',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 32.1, unit: 'g' },
      { type: 'fat', value: 48.5, unit: 'g' },
      { type: 'carbs', value: 98.2, unit: 'g' },
      { type: 'energy', value: 968, unit: 'kcal' },
    ],
    servingSize: '1人前（400g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_kalbi_' + Date.now(),
  },
  {
    id: 'matsuya_tonkatsu',
    chain: 'matsuya',
    name: 'ロースとんかつ定食',
    category: 'とんかつ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 35.8, unit: 'g' },
      { type: 'fat', value: 45.2, unit: 'g' },
      { type: 'carbs', value: 112.5, unit: 'g' },
      { type: 'energy', value: 1012, unit: 'kcal' },
    ],
    servingSize: '1人前（480g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_tonkatsu_' + Date.now(),
  },
  {
    id: 'matsuya_tofu_salad',
    chain: 'matsuya',
    name: '豆腐サラダ',
    category: 'サラダ',
    per: 'serving',
    nutrients: [
      { type: 'protein', value: 8.5, unit: 'g' },
      { type: 'fat', value: 5.2, unit: 'g' },
      { type: 'carbs', value: 8.3, unit: 'g' },
      { type: 'energy', value: 115, unit: 'kcal' },
    ],
    servingSize: '1皿（200g）',
    lastSeenAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/matsuya',
    sourceHash: 'matsuya_tofu_salad_' + Date.now(),
  },
];

// データ投入の実行関数
export async function seedTestData(): Promise<void> {
  console.log('🌱 テストデータの投入を開始します...');
  
  try {
    // データベースを初期化
    const db = new DatabaseService();
    await db.initialize();
    const repository = new MenuRepository(db);

    // 各チェーンのデータを投入
    const allMenus = [
      ...sukiyaMenus.map(data => new MenuItem(data)),
      ...yoshinoyaMenus.map(data => new MenuItem(data)),
      ...matsuyaMenus.map(data => new MenuItem(data)),
    ];

    console.log(`📝 ${allMenus.length}件のメニューアイテムを投入します`);

    // バルクインサート（パフォーマンス最適化）
    await repository.bulkSave(allMenus);

    console.log('✅ テストデータの投入が完了しました！');
    
    // 投入結果のサマリー
    const sukiyaCount = await repository.findByChain('sukiya');
    const yoshinoyaCount = await repository.findByChain('yoshinoya');
    const matsuyaCount = await repository.findByChain('matsuya');
    
    console.log('\n📊 投入結果:');
    console.log(`  すき家: ${sukiyaCount.length}件`);
    console.log(`  吉野家: ${yoshinoyaCount.length}件`);
    console.log(`  松屋: ${matsuyaCount.length}件`);
    console.log(`  合計: ${allMenus.length}件`);

    await db.close();
  } catch (error) {
    console.error('❌ テストデータの投入に失敗しました:', error);
    throw error;
  }
}

// 直接実行の場合
if (require.main === module) {
  seedTestData().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}