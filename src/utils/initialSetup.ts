/**
 * 初回起動時のセットアップ
 * データベース初期化とテストデータ投入
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';
import { seedTestData } from '@/scripts/seedTestData';

const SETUP_COMPLETE_KEY = '@protein_finder:setup_complete';

export async function performInitialSetup(): Promise<void> {
  try {
    // セットアップ済みかチェック
    const setupComplete = await AsyncStorage.getItem(SETUP_COMPLETE_KEY);

    if (setupComplete === 'true') {
      console.log('✅ セットアップは既に完了しています');
      return;
    }

    console.log('🚀 初回セットアップを開始します...');

    // データベース初期化
    const db = new DatabaseService();
    await db.initialize();
    console.log('✅ データベースを初期化しました');

    // テストデータ投入
    await seedTestData();
    console.log('✅ テストデータを投入しました');

    // セットアップ完了フラグを保存
    await AsyncStorage.setItem(SETUP_COMPLETE_KEY, 'true');

    console.log('🎉 初回セットアップが完了しました！');
  } catch (error) {
    console.error('❌ セットアップに失敗しました:', error);
    // エラーが発生してもアプリは起動できるようにする
  }
}

/**
 * セットアップ状態をリセット（開発用）
 */
export async function resetSetupStatus(): Promise<void> {
  await AsyncStorage.removeItem(SETUP_COMPLETE_KEY);
  console.log('🔄 セットアップ状態をリセットしました');
}
