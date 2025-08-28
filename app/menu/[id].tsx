/**
 * メニュー詳細画面
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MenuItem } from '@/core/domain/MenuItem';
import { MenuRepository } from '@/infrastructure/database/MenuRepository';
import { DatabaseService } from '@/infrastructure/database/DatabaseService';

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuItem = async () => {
      try {
        const db = new DatabaseService();
        await db.initialize();
        const repository = new MenuRepository(db);
        const item = await repository.findById(id);
        setMenuItem(item);
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
        <ActivityIndicator size="large" color="#007AFF" />
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
          <Text style={styles.chainName}>{menuItem.chain}</Text>
        </View>

        <View style={styles.mainNutritionCard}>
          <View style={styles.proteinContainer}>
            <Text style={styles.proteinLabel}>タンパク質</Text>
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
    backgroundColor: '#E8F5E9',
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
    color: '#2E7D32',
    marginBottom: 8,
  },
  proteinValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  proteinValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  proteinUnit: {
    fontSize: 24,
    color: '#2E7D32',
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
});