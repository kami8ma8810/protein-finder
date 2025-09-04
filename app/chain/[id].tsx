/**
 * 店舗別メニュー一覧画面
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MenuItem } from '@/core/domain/MenuItem';
import { MenuRepository } from '@/infrastructure/database/MenuRepository';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { FilterChipGroup } from '@/presentation/components/common';

type SortOption = 'protein' | 'pfc' | 'calories';

export default function ChainMenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('protein');
  const router = useRouter();

  const loadMenuItems = useCallback(
    async (forceRefresh = false) => {
      try {
        // まずAPIから取得を試みる
        const apiService = MenuApiService.getInstance();
        const apiResponse = await apiService.fetchMenusByChain(id, {
          forceRefresh,
        });

        if (apiResponse) {
          // APIから取得できたらDBに保存
          const db = new DatabaseService();
          await db.initialize();
          const repository = new MenuRepository(db);
          await repository.bulkSave(apiResponse.items);
          setMenuItems(sortMenuItems(apiResponse.items, sortOption));
        } else {
          // APIから取得できなかったらローカルDBから
          const db = new DatabaseService();
          await db.initialize();
          const repository = new MenuRepository(db);
          const localItems = await repository.findByChain(id);
          setMenuItems(sortMenuItems(localItems, sortOption));
        }
      } catch (error) {
        console.error('Failed to load menu items:', error);
        setMenuItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id, sortOption],
  );

  const sortMenuItems = useCallback((items: MenuItem[], option: SortOption): MenuItem[] => {
    const sorted = [...items];
    switch (option) {
      case 'protein':
        return sorted.sort((a, b) => b.proteinInGrams - a.proteinInGrams);
      case 'pfc':
        // PFCバランス計算（簡易版）
        return sorted.sort((a, b) => {
          const pfcA =
            a.proteinInGrams /
            (a.proteinInGrams +
              (a.getNutrientInGrams('fat') || 0) +
              (a.getNutrientInGrams('carbs') || 0));
          const pfcB =
            b.proteinInGrams /
            (b.proteinInGrams +
              (b.getNutrientInGrams('fat') || 0) +
              (b.getNutrientInGrams('carbs') || 0));
          return pfcB - pfcA;
        });
      case 'calories':
        return sorted.sort((a, b) => {
          const calA = a.getNutrient('energy')?.value || 0;
          const calB = b.getNutrient('energy')?.value || 0;
          return calA - calB;
        });
    }
  }, []);

  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  useEffect(() => {
    setMenuItems((items) => sortMenuItems(items, sortOption));
  }, [sortOption, sortMenuItems]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMenuItems(true);
  }, [loadMenuItems]);

  const renderMenuItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      <TouchableOpacity style={styles.menuItem} onPress={() => router.push(`/menu/${item.id}`)}>
        <View style={styles.menuContent}>
          <View style={styles.menuInfo}>
            <Text style={styles.menuName}>{item.name}</Text>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionText}>P: {item.proteinInGrams}g</Text>
              {item.getNutrientInGrams('fat') && (
                <Text style={styles.nutritionText}>F: {item.getNutrientInGrams('fat')}g</Text>
              )}
              {item.getNutrientInGrams('carbs') && (
                <Text style={styles.nutritionText}>C: {item.getNutrientInGrams('carbs')}g</Text>
              )}
            </View>
          </View>
          <View style={styles.proteinBadge}>
            <Text style={styles.proteinValue}>{item.proteinInGrams}</Text>
            <Text style={styles.proteinUnit}>g</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [router],
  );

  const getChainDisplayName = useMemo(() => {
    const chainNames: Record<string, string> = {
      sukiya: 'すき家',
      yoshinoya: '吉野家',
      matsuya: '松屋',
      nakau: 'なか卯',
      mcdonalds: 'マクドナルド',
      mosburger: 'モスバーガー',
      subway: 'サブウェイ',
      ootoya: '大戸屋',
      gusto: 'ガスト',
      kfc: 'ケンタッキー',
    };
    return chainNames[id] || id;
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: getChainDisplayName,
        }}
      />
      <View style={styles.container}>
        <View style={styles.sortContainer}>
          <FilterChipGroup
            chips={[
              { id: 'protein', label: 'タンパク質順' },
              { id: 'pfc', label: 'PFC順' },
              { id: 'calories', label: 'カロリー順' },
            ]}
            selectedIds={[sortOption]}
            onChipPress={(id) => setSortOption(id as SortOption)}
            multiSelect={false}
          />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#DC143C" />
            <Text style={styles.loadingText}>メニューを読み込み中...</Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC143C" />
            }
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>メニューデータがありません</Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  sortContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  listContainer: {
    paddingVertical: 16,
  },
  menuItem: {
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
  menuContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  proteinBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  proteinValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  proteinUnit: {
    fontSize: 12,
    color: '#DC143C',
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
