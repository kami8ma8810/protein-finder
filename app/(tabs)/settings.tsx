/**
 * 設定画面
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/presentation/design-system/tokens';
import { ErrorBoundary } from '@/presentation/components/common';

export default function SettingsScreen() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const handleOpenUrl = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'キャッシュをクリア',
      'キャッシュをクリアしますか？次回起動時に最新データを取得します。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'クリア',
          style: 'destructive',
          onPress: () => {
            // TODO: キャッシュクリア処理
            Alert.alert('完了', 'キャッシュをクリアしました');
          },
        },
      ],
    );
  }, []);

  const handleUpdateData = useCallback(() => {
    Alert.alert('データを更新', '最新の栄養データを取得します。通信が発生します。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '更新',
        onPress: () => {
          // TODO: データ更新処理
          Alert.alert('完了', 'データを更新しました');
        },
      },
    ]);
  }, []);

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリについて</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>バージョン</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearCache}
            accessibilityLabel="キャッシュをクリア"
            accessibilityHint="タップしてキャッシュをクリアします"
          >
            <Text style={styles.settingText}>キャッシュをクリア</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleUpdateData}
            accessibilityLabel="データを更新"
            accessibilityHint="タップして最新の栄養データを取得します"
          >
            <Text style={styles.settingText}>データを更新</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>サポート</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleOpenUrl('https://github.com/your-repo/protein-finder/issues')}
            accessibilityLabel="フィードバック"
            accessibilityHint="タップしてフィードバックページを開きます"
          >
            <Text style={styles.settingText}>フィードバック</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>法的情報</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowPrivacyModal(true)}
            accessibilityLabel="プライバシーポリシー"
            accessibilityHint="タップしてプライバシーポリシーを表示します"
          >
            <Text style={styles.settingText}>プライバシーポリシー</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowLicenseModal(true)}
            accessibilityLabel="ライセンス"
            accessibilityHint="タップしてライセンス情報を表示します"
          >
            <Text style={styles.settingText}>ライセンス</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            高タンパク質メニューを簡単に見つけて、{'\n'}
            健康的な食生活をサポート
          </Text>
          <Text style={styles.copyrightText}>© 2025 Protein Finder Team</Text>
        </View>

        {/* プライバシーポリシーモーダル */}
        <Modal
          visible={showPrivacyModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowPrivacyModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowPrivacyModal(false)}
                style={styles.closeButton}
                accessibilityLabel="閉じる"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>閉じる</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>プライバシーポリシー</Text>
              <View style={{ width: 60 }} />
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={styles.modalSectionTitle}>1. データ収集について{'\n\n'}</Text>
                Protein Finderは、ユーザーの個人情報を一切収集しません。{'\n\n'}
                <Text style={styles.modalSectionTitle}>2. データの利用{'\n\n'}</Text>•
                栄養データは各飲食チェーンの公式サイトから取得しています{'\n'}•
                データはローカルデバイスに保存されます{'\n'}•
                クラッシュレポート以外の分析データは収集しません{'\n\n'}
                <Text style={styles.modalSectionTitle}>3. データの保管{'\n\n'}</Text>
                すべてのデータはユーザーのデバイス内にのみ保存され、外部サーバーへの送信は行いません。
                {'\n\n'}
                <Text style={styles.modalSectionTitle}>4. 第三者への提供{'\n\n'}</Text>
                ユーザーデータの第三者への提供は一切行いません。{'\n\n'}
                <Text style={styles.modalSectionTitle}>5. お問い合わせ{'\n\n'}</Text>
                プライバシーに関するご質問は、GitHubのIssuesページまでお願いします。{'\n\n'}
                最終更新日: 2025年8月30日
              </Text>
            </ScrollView>
          </View>
        </Modal>

        {/* ライセンスモーダル */}
        <Modal
          visible={showLicenseModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowLicenseModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowLicenseModal(false)}
                style={styles.closeButton}
                accessibilityLabel="閉じる"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>閉じる</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>ライセンス</Text>
              <View style={{ width: 60 }} />
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={styles.modalSectionTitle}>MIT License{'\n\n'}</Text>
                Copyright (c) 2025 Protein Finder Team{'\n\n'}
                Permission is hereby granted, free of charge, to any person obtaining a copy of this
                software and associated documentation files (the "Software"), to deal in the
                Software without restriction, including without limitation the rights to use, copy,
                modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
                and to permit persons to whom the Software is furnished to do so, subject to the
                following conditions:{'\n\n'}
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.{'\n\n'}
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
                OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.{'\n\n'}
                <Text style={styles.modalSectionTitle}>サードパーティライセンス{'\n\n'}</Text>
                このアプリは以下のオープンソースソフトウェアを使用しています：{'\n\n'}• React Native
                (MIT License){'\n'}• Expo (MIT License){'\n'}• TypeScript (Apache License 2.0){'\n'}
                • その他の依存関係についてはpackage.jsonをご確認ください
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  section: {
    marginTop: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#000',
  },
  infoValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  footer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.label.tertiary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.padding.screen,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator.opaque,
  },
  modalTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.label.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  closeButtonText: {
    fontSize: Typography.fontSize.body,
    color: Colors.primary.blue,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.padding.screen,
  },
  modalText: {
    fontSize: Typography.fontSize.body,
    color: Colors.label.primary,
    lineHeight: Typography.lineHeight.body,
  },
  modalSectionTitle: {
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.headline,
    color: Colors.label.primary,
  },
});
