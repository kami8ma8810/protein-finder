/**
 * 横断検索画面
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MenuItem } from '@/core/domain/MenuItem';
import { MenuRepository } from '@/infrastructure/database/MenuRepository';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';
import {
  SearchBar,
  LoadingSpinner,
  AccessibleCard,
  ErrorBoundary,
} from '@/presentation/components/common';
import { Colors, Typography, Spacing } from '@/presentation/design-system/tokens';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const db = new DatabaseService();
      await db.initialize();
      const repository = new MenuRepository(db);
      const results = await repository.searchByName(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const renderMenuItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      <AccessibleCard
        title={item.name}
        subtitle={`${item.chain} • ${item.caloriesInKcal}kcal`}
        onPress={() => router.push(`/menu/${item.id}`)}
        badge={`${item.proteinInGrams}g`}
        badgeColor="#DC143C"
        showChevron
        accessibilityLabel={`${item.name}、${item.chain}、タンパク質${item.proteinInGrams}グラム`}
        accessibilityHint="タップして詳細を表示"
        testID={`search-result-${item.id}`}
      />
    ),
    [router],
  );

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="メニューを検索（例：牛丼）"
          onSubmit={handleSearch}
          autoFocus={false}
          testID="search-input"
        />

        {loading ? (
          <LoadingSpinner message="検索中..." />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.listContainer}
          />
        ) : searchQuery.trim() ? (
          <View style={styles.centerContainer}>
            <Text style={styles.noResultsText}>検索結果がありません</Text>
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.instructionText}>メニュー名を入力して検索</Text>
            <Text style={styles.subInstructionText}>複数の店舗から横断的に検索できます</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  instructionText: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.label.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subInstructionText: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.label.secondary,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: Typography.fontSize.body,
    color: Colors.label.secondary,
  },
  listContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.padding.screen,
  },
});
