/**
 * ホーム画面 - ダッシュボード
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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { ChainInfo } from '@/core/services/IMenuApiService';
import { MenuItem } from '@/core/domain/MenuItem';


export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [proteinGoal, setProteinGoal] = useState(60); // デフォルト目標値
  const [popularChains, setPopularChains] = useState<ChainInfo[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      // 今日のタンパク質摂取量を取得（本来はDBから）
      const storedProtein = await AsyncStorage.getItem('dailyProtein');
      if (storedProtein) {
        setDailyProtein(parseFloat(storedProtein));
      }

      // タンパク質目標値を取得
      const storedGoal = await AsyncStorage.getItem('proteinGoal');
      if (storedGoal) {
        setProteinGoal(parseFloat(storedGoal));
      }

      // 人気のチェーン店を取得
      const apiService = new MenuApiService();
      const chains = await apiService.fetchAvailableChains();
      setPopularChains(chains.slice(0, 6)); // 上位6店舗

      // おすすめメニューを取得
      const allMenus = await apiService.fetchAllMenus();
      if (allMenus) {
        // タンパク質が多い順でソート
        const sorted = [...allMenus.items].sort((a, b) => b.proteinInGrams - a.proteinInGrams);
        setRecommendedItems(sorted.slice(0, 3)); // 上位3つ
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const progressPercentage = Math.min((dailyProtein / proteinGoal) * 100, 100);

  const getChainDisplayName = (chain: ChainInfo) => {
    return chain.displayName || chain.name;
  };

  const getChainIcon = (chainId: string): string => {
    const icons: Record<string, string> = {
      sukiya: '🍜',
      yoshinoya: '🍱',
      matsuya: '🍚',
      nakau: '🥢',
      mcdonalds: '🍔',
      mosburger: '🍔',
      subway: '🥪',
      ootoya: '🍽️',
      gusto: '🍴',
      kfc: '🍗',
    };
    return icons[chainId] || '🍴';
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
      }
    >
      {/* ヘッダー部分 - アプリの目的を明確に */}
      <LinearGradient
        colors={['#4CAF50', '#66BB6A']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>今日のタンパク質摂取</Text>
          <Text style={styles.appDescription}>外食でも効率的にタンパク質を摂ろう！</Text>
        </View>
      </LinearGradient>

      {/* 今日のタンパク質進捗 */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>本日の達成度</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressStats}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{dailyProtein.toFixed(1)}</Text>
            <Text style={styles.progressUnit}>g</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              目標: {proteinGoal}g ({progressPercentage.toFixed(0)}%)
            </Text>
          </View>
        </View>

        {progressPercentage < 50 && (
          <View style={styles.encouragement}>
            <Text style={styles.encouragementText}>
              💪 あと{(proteinGoal - dailyProtein).toFixed(1)}g！頑張りましょう！
            </Text>
          </View>
        )}
      </View>

      {/* クイックアクション */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push('/(tabs)/search')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="search" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.quickActionText}>メニュー検索</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push('/(tabs)/chains')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="restaurant" size={24} color="#FF9800" />
          </View>
          <Text style={styles.quickActionText}>店舗から探す</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push('/favorites')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="heart" size={24} color="#E91E63" />
          </View>
          <Text style={styles.quickActionText}>お気に入り</Text>
        </TouchableOpacity>
      </View>

      {/* 人気のチェーン店 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏪 人気のチェーン店</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/chains')}>
            <Text style={styles.seeAllText}>すべて見る →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chainList}
        >
          {popularChains.map((chain) => (
            <TouchableOpacity
              key={chain.id}
              style={styles.chainCard}
              onPress={() => router.push(`/chain/${chain.id}`)}
            >
              <Text style={styles.chainIcon}>{getChainIcon(chain.id)}</Text>
              <Text style={styles.chainName}>{getChainDisplayName(chain)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 高タンパクおすすめメニュー */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🥩 高タンパクメニュー TOP3</Text>
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
              <Text style={styles.recommendName}>{item.name}</Text>
              <Text style={styles.recommendChain}>
                {getChainIcon(item.chain)} {item.chain}
              </Text>
            </View>
            <View style={styles.proteinBadge}>
              <Text style={styles.proteinBadgeValue}>{item.proteinInGrams}</Text>
              <Text style={styles.proteinBadgeUnit}>g</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tips セクション */}
      <View style={styles.tipsSection}>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>今日のヒント</Text>
            <Text style={styles.tipText}>
              タンパク質は1回の食事で20-30gを目安に摂取すると効率的に吸収されます
            </Text>
          </View>
        </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressUnit: {
    fontSize: 12,
    color: '#4CAF50',
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  encouragement: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  encouragementText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 20,
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
    color: '#4CAF50',
  },
  chainList: {
    paddingRight: 20,
  },
  chainCard: {
    width: 80,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chainIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  chainName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 4,
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
    backgroundColor: '#FFE082',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
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
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  proteinBadgeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  proteinBadgeUnit: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 2,
  },
  tipsSection: {
    padding: 20,
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#795548',
    lineHeight: 18,
  },
});