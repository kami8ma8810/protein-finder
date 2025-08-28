/**
 * 横断検索画面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MenuItem } from '@/core/domain/MenuItem';
import { MenuRepository } from '@/infrastructure/database/MenuRepository';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
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
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => router.push(`/menu/${item.id}`)}
    >
      <View style={styles.resultContent}>
        <View style={styles.resultInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.chainName}>{item.chain}</Text>
        </View>
        <View style={styles.proteinBadge}>
          <Text style={styles.proteinText}>{item.proteinInGrams}g</Text>
          <Text style={styles.proteinLabel}>タンパク質</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="メニューを検索（例：牛丼）"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : searchQuery.trim() ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>
            検索結果がありません
          </Text>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.instructionText}>
            メニュー名を入力して検索
          </Text>
          <Text style={styles.subInstructionText}>
            複数の店舗から横断的に検索できます
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subInstructionText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  listContainer: {
    paddingVertical: 16,
  },
  resultItem: {
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
  resultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resultInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  chainName: {
    fontSize: 14,
    color: '#8E8E93',
  },
  proteinBadge: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  proteinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  proteinLabel: {
    fontSize: 10,
    color: '#2E7D32',
    marginTop: 2,
  },
});