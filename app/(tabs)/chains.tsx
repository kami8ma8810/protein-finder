/**
 * 店舗一覧画面
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { ChainInfo } from '@/core/services/IMenuApiService';
import {
  LoadingSpinner,
  AccessibleCard,
  ErrorBoundary,
  SearchBar,
} from '@/presentation/components/common';
import { Colors, Spacing } from '@/presentation/design-system/tokens';

export default function ChainsScreen() {
  const [chains, setChains] = useState<ChainInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const apiService = useMemo(() => new MenuApiService(), []);

  const loadChains = useCallback(async () => {
    try {
      const result = await apiService.fetchAvailableChains();
      setChains(result);
    } catch (error) {
      console.error('Failed to load chains:', error);
      // ハードコーディングされたフォールバック
      setChains([
        {
          id: 'sukiya',
          name: 'sukiya',
          displayName: 'すき家',
          websiteUrl: 'https://www.sukiya.jp/',
        },
        {
          id: 'yoshinoya',
          name: 'yoshinoya',
          displayName: '吉野家',
          websiteUrl: 'https://www.yoshinoya.com/',
        },
        {
          id: 'matsuya',
          name: 'matsuya',
          displayName: '松屋',
          websiteUrl: 'https://www.matsuyafoods.co.jp/',
        },
        {
          id: 'nakau',
          name: 'nakau',
          displayName: 'なか卯',
          websiteUrl: 'https://www.nakau.co.jp/',
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiService]);

  useEffect(() => {
    loadChains();
  }, [loadChains]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadChains();
  }, [loadChains]);

  const renderChainItem = useCallback(
    ({ item }: { item: ChainInfo }) => (
      <AccessibleCard
        title={item.displayName}
        onPress={() => router.push(`/chain/${item.id}`)}
        showChevron
        accessibilityLabel={`${item.displayName}のメニューを表示`}
        accessibilityHint="タップして店舗のメニューを表示します"
        testID={`chain-${item.id}`}
      />
    ),
    [router],
  );

  // 検索クエリに基づいて店舗をフィルタリング
  const filteredChains = useMemo(() => {
    if (!searchQuery.trim()) {
      return chains;
    }
    const query = searchQuery.toLowerCase();
    return chains.filter(
      (chain) =>
        chain.displayName.toLowerCase().includes(query) || chain.name.toLowerCase().includes(query),
    );
  }, [chains, searchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="店舗情報を読み込んでいます..." />;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="店舗名で検索"
          onClear={handleClearSearch}
          showCancelButton={false}
          testID="chain-search-bar"
        />
        <FlatList
          data={filteredChains}
          keyExtractor={(item) => item.id}
          renderItem={renderChainItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary.blue}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  listContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.padding.screen,
  },
});
