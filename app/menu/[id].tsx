/**
 * メニュー詳細画面
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MenuItem } from '@/core/domain/MenuItem';
import { MenuRepository } from '@/infrastructure/database/MenuRepository';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';
import { Colors, Typography, Spacing, BorderRadius } from '@/presentation/design-system/tokens';
import { MenuApiService } from '@/infrastructure/api/MenuApiService';
import { Platform } from 'react-native';

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  // チェーン名の日本語表示（Hooksは条件文の前に定義する必要がある）
  const getChainDisplayName = useCallback((chain: string) => {
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
    return chainNames[chain] || chain;
  }, []);

  useEffect(() => {
    const loadMenuItem = async () => {
      try {
        // Web版の場合はAPIサービスからモックデータを取得
        if (Platform.OS === 'web' || __DEV__) {
          const apiService = MenuApiService.getInstance();
          const allMenus = await apiService.fetchAllMenus();
          if (allMenus) {
            const item = allMenus.items.find(menu => menu.id === id);
            setMenuItem(item || null);
          }
        } else {
          // ネイティブ版の場合はデータベースから取得
          const db = new DatabaseService();
          await db.initialize();
          const repository = new MenuRepository(db);
          const item = await repository.findById(id);
          setMenuItem(item);
        }
      } catch (error) {
        console.error('Failed to load menu item:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  if (!menuItem) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>メニュー情報が見つかりません</Text>
      </View>
    );
  }

  const getNutrientValue = (type: 'fat' | 'carbs' | 'energy') => {
    if (type === 'energy') {
      return menuItem.getNutrient('energy')?.value || '-';
    }
    return menuItem.getNutrientInGrams(type) || '-';
  };

  // 共有機能
  const handleShare = useCallback(async () => {
    if (!menuItem) return;

    try {
      const chainName = getChainDisplayName(menuItem.chain);
      const message = `${chainName}の「${menuItem.name}」\nたんぱく質: ${menuItem.proteinInGrams}g\nカロリー: ${getNutrientValue('energy')}${getNutrientValue('energy') !== '-' ? 'kcal' : ''}\n\n#たんぱく質 #${chainName}`;

      await Share.share({
        message: message,
        title: `${menuItem.name}の栄養情報`,
      });
    } catch (error) {
      console.error('共有エラー:', error);
    }
  }, [menuItem, getChainDisplayName]);

  // ソースURLを開く
  const handleOpenSource = useCallback(async () => {
    if (!menuItem?.sourceUrl) return;

    const supported = await Linking.canOpenURL(menuItem.sourceUrl);

    if (supported) {
      await Linking.openURL(menuItem.sourceUrl);
    } else {
      Alert.alert('エラー', 'URLを開けませんでした');
    }
  }, [menuItem]);

  return (
    <>
      <Stack.Screen
        options={{
          title: menuItem.name,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.menuName}>{menuItem.name}</Text>
          <Text style={styles.chainName}>{getChainDisplayName(menuItem.chain)}</Text>
        </View>

        <View style={styles.mainNutritionCard}>
          <View style={styles.proteinContainer}>
            <Text style={styles.proteinLabel}>たんぱく質</Text>
            <View style={styles.proteinValueContainer}>
              <Text style={styles.proteinValue}>{menuItem.proteinInGrams}</Text>
              <Text style={styles.proteinUnit}>g</Text>
            </View>
          </View>
        </View>

        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>脂質</Text>
            <Text style={styles.nutritionValue}>
              {getNutrientValue('fat')}
              {getNutrientValue('fat') !== '-' && 'g'}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>炭水化物</Text>
            <Text style={styles.nutritionValue}>
              {getNutrientValue('carbs')}
              {getNutrientValue('carbs') !== '-' && 'g'}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>カロリー</Text>
            <Text style={styles.nutritionValue}>
              {getNutrientValue('energy')}
              {getNutrientValue('energy') !== '-' && 'kcal'}
            </Text>
          </View>
        </View>

        {menuItem.servingSize && (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>提供サイズ</Text>
            <Text style={styles.infoValue}>{menuItem.servingSize}</Text>
          </View>
        )}

        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>アレルゲン情報</Text>
            <View style={styles.allergenContainer}>
              {menuItem.allergens.map((allergen, index) => (
                <View key={index} style={styles.allergenBadge}>
                  <Text style={styles.allergenText}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.metaSection}>
          <Text style={styles.metaText}>
            単位: {menuItem.per === 'serving' ? '1食あたり' : '100gあたり'}
          </Text>
          <Text style={styles.metaText}>
            最終更新: {new Date(menuItem.lastSeenAt).toLocaleDateString('ja-JP')}
          </Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            accessibilityLabel="栄養情報を共有"
            accessibilityHint="タップして栄養情報を共有します"
          >
            <Text style={styles.actionButtonText}>共有する</Text>
          </TouchableOpacity>

          {menuItem.sourceUrl && (
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleOpenSource}
              accessibilityLabel="栄養情報の出典を見る"
              accessibilityHint="タップして公式サイトの栄養情報ページを開きます"
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                栄養情報の出典を見る
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
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
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  chainName: {
    fontSize: 16,
    color: '#8E8E93',
  },
  mainNutritionCard: {
    backgroundColor: '#FFE5E5',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  proteinContainer: {
    alignItems: 'center',
  },
  proteinLabel: {
    fontSize: 16,
    color: '#DC143C',
    marginBottom: 8,
  },
  proteinValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  proteinValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  proteinUnit: {
    fontSize: 24,
    color: '#DC143C',
    marginLeft: 4,
  },
  nutritionGrid: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  allergenText: {
    fontSize: 14,
    color: '#E65100',
  },
  metaSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  metaText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#DC143C',
    paddingVertical: Spacing.padding.button,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  actionButtonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.background.primary,
  },
  secondaryButtonText: {
    color: '#DC143C',
  },
});
