import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
  const handleDataSync = () => {
    Alert.alert('手動同期', '公式サイトから最新データを手動で確認しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '確認する', onPress: () => console.log('Manual sync started') },
    ]);
  };

  const adminActions = [
    {
      title: 'メニュー追加',
      description: '新しいメニューアイテムを手動で追加',
      icon: 'add-circle-outline',
      route: '/admin/add-menu',
      color: '#4CAF50',
    },
    {
      title: 'チェーン店管理',
      description: 'チェーン店情報の追加・編集',
      icon: 'business-outline',
      route: '/admin/chains',
      color: '#2196F3',
    },
    {
      title: '法的事項',
      description: '免責事項・利用規約の管理',
      icon: 'document-text-outline',
      route: '/admin/legal',
      color: '#FF9800',
    },
    {
      title: 'データ同期',
      description: '手動でデータを更新',
      icon: 'sync-outline',
      onPress: handleDataSync,
      color: '#9C27B0',
    },
  ];

  const stats = {
    totalMenus: 0,
    totalChains: 0,
    lastUpdate: '未更新',
    dataSource: '手動入力',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>管理画面</Text>
        <Text style={styles.subtitle}>データ管理とメンテナンス</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalMenus}</Text>
          <Text style={styles.statLabel}>総メニュー数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalChains}</Text>
          <Text style={styles.statLabel}>チェーン店数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.lastUpdate}</Text>
          <Text style={styles.statLabel}>最終更新</Text>
        </View>
      </View>

      <View style={styles.warningCard}>
        <Ionicons name="warning-outline" size={24} color="#FF5722" />
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>データ収集に関する注意</Text>
          <Text style={styles.warningText}>
            各飲食チェーンの公式サイトから手動でデータを転記してください。
            自動取得は利用規約違反となる可能性があります。
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {adminActions.map((action, index) =>
          action.route ? (
            <Link key={index} href={action.route as any} asChild>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#999" />
              </TouchableOpacity>
            </Link>
          ) : (
            <TouchableOpacity key={index} style={styles.actionCard} onPress={action.onPress}>
              <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#999" />
            </TouchableOpacity>
          ),
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>データ元: 各チェーン店公式サイト（手動転記）</Text>
        <Text style={styles.footerText}>
          ※ 栄養成分は参考値です。最新情報は公式サイトをご確認ください。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF5722',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#795548',
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 16,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
});
