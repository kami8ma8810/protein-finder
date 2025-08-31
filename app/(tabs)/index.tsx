/**
 * ホーム画面 - メイン検索画面
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { ChainInfo } from '@/core/services/IMenuApiService';
import { MenuItem } from '@/core/domain/MenuItem';
import { getRandomProteinTip } from '@/data/proteinTips';
import { getChainIcon as getChainIconData } from '@/data/chainData';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [popularChains, setPopularChains] = useState<ChainInfo[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);
  const [currentTip, setCurrentTip] = useState<string>('');

  const loadHomeData = useCallback(async () => {
    try {
      const apiService = new MenuApiService();
      
      // チェーン店を取得して並び替え
      const chains = await apiService.fetchAvailableChains();
      // 日本語とアルファベットで分類してソート
      const sortedChains = [...chains].sort((a, b) => {
        const aIsJapanese = a.displayName.charAt(0).match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
        const bIsJapanese = b.displayName.charAt(0).match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
        
        if (aIsJapanese && !bIsJapanese) return -1;
        if (!aIsJapanese && bIsJapanese) return 1;
        
        return a.displayName.localeCompare(b.displayName, aIsJapanese ? 'ja' : 'en');
      });
      setPopularChains(sortedChains);

      // 高タンパクメニューを取得
      const allMenus = await apiService.fetchAllMenus();
      if (allMenus) {
        // タンパク質が多い順でソート
        const sorted = [...allMenus.items].sort((a, b) => b.proteinInGrams - a.proteinInGrams);
        setRecommendedItems(sorted.slice(0, 5)); // 上位5つ
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
    // 初回表示時にTipsを設定
    setCurrentTip(getRandomProteinTip());
  }, [loadHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData();
    // リフレッシュ時に新しいTipsを表示
    setCurrentTip(getRandomProteinTip());
  }, [loadHomeData]);

  const getChainDisplayName = (chain: ChainInfo) => {
    return chain.displayName || chain.name;
  };

  // 業態に応じたアイコンを返す
  const getChainIcon = (chainId: string) => {
    const iconInfo = getChainIconData(chainId);
    
    switch (iconInfo.iconFamily) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconInfo.iconName as any} size={iconInfo.size} color={iconInfo.color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconInfo.iconName as any} size={iconInfo.size} color={iconInfo.color} />;
      case 'Ionicons':
      default:
        return <Ionicons name={iconInfo.iconName as any} size={iconInfo.size} color={iconInfo.color} />;
    }
  };


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC143C" />
      }
    >
      {/* ヘッダー部分 - アプリの目的を明確に */}
      <LinearGradient
        colors={['#DC143C', '#FF6B6B']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>たんぱく質ファインダー</Text>
          <Text style={styles.appDescription}>チェーン店のたんぱく質量をすぐに検索</Text>
        </View>
      </LinearGradient>

      {/* クイック検索セクション */}
      <View style={styles.quickSearchSection}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="search" size={24} color="#DC143C" />
          <Text style={styles.searchButtonText}>食べたいメニューを検索</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* チェーン店一覧 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>チェーン店から探す</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/chains')}>
            <Text style={styles.seeAllText}>すべて →</Text>
          </TouchableOpacity>
        </View>
        {popularChains.slice(0, 4).map((chain) => (
          <TouchableOpacity
            key={chain.id}
            style={styles.chainListItem}
            onPress={() => router.push(`/chain/${chain.id}`)}
          >
            <View style={styles.chainListIconContainer}>
              {getChainIcon(chain.id)}
            </View>
            <Text style={styles.chainListName}>
              {getChainDisplayName(chain)}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 高タンパクメニューランキング */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>高たんぱくメニュー TOP5</Text>
        </View>
        {recommendedItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.recommendCard}
            onPress={() => router.push(`/menu/${item.id}`)}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.recommendContent}>
              <Text style={styles.recommendName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.recommendChain}>
                {(() => {
                  const chainInfo = popularChains.find(c => c.id === item.chain);
                  return chainInfo?.displayName || item.chain;
                })()}
              </Text>
            </View>
            <View style={styles.proteinBadge}>
              <Text style={styles.proteinBadgeValue}>{item.proteinInGrams}</Text>
              <Text style={styles.proteinBadgeUnit}>g</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tipsセクション */}
      <View style={styles.tipsSection}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb-outline" size={16} color="#DC143C" />
          <Text style={styles.tipsLabel}>たんぱく質Tips</Text>
        </View>
        <Text style={styles.tipsText}>{currentTip}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickSearchSection: {
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#DC143C',
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recommendContent: {
    flex: 1,
  },
  recommendName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  recommendChain: {
    fontSize: 14,
    color: '#666',
  },
  proteinBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  proteinBadgeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  proteinBadgeUnit: {
    fontSize: 12,
    color: '#DC143C',
    marginLeft: 2,
  },
  tipsSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FFF9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  tipsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC143C',
    letterSpacing: 0.5,
  },
  tipsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  chainListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chainListIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chainListName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});