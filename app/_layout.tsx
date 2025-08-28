/**
 * ルートレイアウト
 * アプリ全体の設定とプロバイダーを管理
 */

import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { performInitialSetup } from '@/utils/initialSetup';

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 初回セットアップを実行
    const setup = async () => {
      try {
        await performInitialSetup();
      } catch (error) {
        console.error('Setup error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    setup();
  }, []);

  // セットアップ中は読み込み画面を表示
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>準備中...</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
});