/**
 * 店舗一覧画面
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, SectionList, StyleSheet, RefreshControl, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { ChainInfo } from '@/core/services/IMenuApiService';
import {
  LoadingSpinner,
  AccessibleCard,
  ErrorBoundary,
  SearchBar,
} from '@/presentation/components/common';
import { Spacing } from '@/presentation/design-system/tokens';

interface ChainSection {
  title: string;
  data: ChainInfo[];
}

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
      if (result && result.length > 0) {
        setChains(result);
      }
    } catch (error) {
      console.error('Failed to load chains:', error);
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

  const renderSectionHeader = useCallback(
    ({ section }: { section: ChainSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    ),
    [],
  );

  // 店舗を日本語とアルファベットで分類して並び替え
  const sortAndGroupChains = useCallback((chainsToSort: ChainInfo[]): ChainSection[] => {
    // 五十音のグループ定義
    const kanaGroups = {
      'あ行': /^[あ-おア-オ]/,
      'か行': /^[か-こが-ごカ-コガ-ゴ]/,
      'さ行': /^[さ-そざ-ぞサ-ソザ-ゾ]/,
      'た行': /^[た-とだ-どタ-トダ-ド]/,
      'な行': /^[な-のナ-ノ]/,
      'は行': /^[は-ほば-ぼぱ-ぽハ-ホバ-ボパ-ポ]/,
      'ま行': /^[ま-もマ-モ]/,
      'や行': /^[や-よヤ-ヨ]/,
      'ら行': /^[ら-ろラ-ロ]/,
      'わ行': /^[わ-んワ-ン]/,
    };

    // グループごとに店舗を分類
    const groupedChains: { [key: string]: ChainInfo[] } = {};
    const alphabetChains: ChainInfo[] = [];

    chainsToSort.forEach(chain => {
      const firstChar = chain.displayName.charAt(0);
      let grouped = false;

      // 五十音グループでチェック
      for (const [group, pattern] of Object.entries(kanaGroups)) {
        if (pattern.test(chain.displayName)) {
          if (!groupedChains[group]) {
            groupedChains[group] = [];
          }
          groupedChains[group].push(chain);
          grouped = true;
          break;
        }
      }

      // 日本語でもアルファベットでもない場合（漢字で始まるなど）は、読み方を推測
      if (!grouped && firstChar.match(/[\u4E00-\u9FAF]/)) {
        // 漢字の場合は最初の行に入れる（実際のアプリでは読み仮名データが必要）
        if (!groupedChains['その他']) {
          groupedChains['その他'] = [];
        }
        groupedChains['その他'].push(chain);
      } else if (!grouped) {
        // アルファベット
        alphabetChains.push(chain);
      }
    });

    // セクションを構築
    const sections: ChainSection[] = [];
    
    // 五十音順にセクションを追加
    const orderedGroups = ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行', 'その他'];
    
    orderedGroups.forEach(group => {
      if (groupedChains[group] && groupedChains[group].length > 0) {
        // グループ内でソート
        groupedChains[group].sort((a, b) => a.displayName.localeCompare(b.displayName, 'ja'));
        sections.push({
          title: group,
          data: groupedChains[group],
        });
      }
    });
    
    // アルファベットセクション
    if (alphabetChains.length > 0) {
      alphabetChains.sort((a, b) => a.displayName.localeCompare(b.displayName, 'en'));
      sections.push({
        title: 'A-Z',
        data: alphabetChains,
      });
    }

    return sections;
  }, []);

  // 検索クエリに基づいて店舗をフィルタリング
  const filteredSections = useMemo(() => {
    let filteredChains = chains;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredChains = chains.filter(
        (chain) =>
          chain.displayName.toLowerCase().includes(query) || chain.name.toLowerCase().includes(query),
      );
    }
    
    return sortAndGroupChains(filteredChains);
  }, [chains, searchQuery, sortAndGroupChains]);

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
        <SectionList
          sections={filteredSections}
          keyExtractor={(item) => item.id}
          renderItem={renderChainItem}
          renderSectionHeader={renderSectionHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#DC143C"
            />
          }
          contentContainerStyle={styles.listContainer}
          stickySectionHeadersEnabled={false}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.padding.screen,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: Spacing.padding.screen,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
});
