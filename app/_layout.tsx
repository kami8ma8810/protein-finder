/**
 * ルートレイアウト
 * アプリ全体の設定とプロバイダーを管理
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';

export default function RootLayout() {
  useEffect(() => {
    // データベース初期化
    const initDatabase = async () => {
      try {
        const db = new DatabaseService();
        await db.initialize();
        console.log('Database initialized');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="chain/[id]" 
        options={{ 
          title: 'メニュー一覧',
          headerBackTitle: '戻る' 
        }} 
      />
      <Stack.Screen 
        name="menu/[id]" 
        options={{ 
          title: 'メニュー詳細',
          headerBackTitle: '戻る' 
        }} 
      />
    </Stack>
  );
}