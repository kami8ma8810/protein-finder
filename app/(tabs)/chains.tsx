/**
 * 店舗一覧画面
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { ChainInfo } from '@/core/services/IMenuApiService';

export default function ChainsScreen() {
  const [chains, setChains] = useState<ChainInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const renderChainItem = useCallback(({ item }: { item: ChainInfo }) => (
    <TouchableOpacity
      style={styles.chainItem}
      onPress={() => router.push(`/chain/${item.id}`)}
    >
      <View style={styles.chainContent}>
        <Text style={styles.chainName}>{item.displayName}</Text>
        <Text style={styles.chainArrow}>›</Text>
      </View>
    </TouchableOpacity>
  ), [router]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chains}
        keyExtractor={(item) => item.id}
        renderItem={renderChainItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  centerContainer: {
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
  listContainer: {
    paddingVertical: 16,
  },
  chainItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  chainName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  chainArrow: {
    fontSize: 24,
    color: '#C7C7CC',
  },
});