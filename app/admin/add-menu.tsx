import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MenuFormData {
  chain: string;
  name: string;
  category: string;
  per: 'serving' | '100g';
  proteinG: string;
  fatG: string;
  carbsG: string;
  energyKcal: string;
  servingSize: string;
  sourceUrl: string;
  dataAccuracyNote: string;
  isManualEntry: boolean;
}

export default function AddMenuScreen() {
  const [formData, setFormData] = useState<MenuFormData>({
    chain: '',
    name: '',
    category: '',
    per: 'serving',
    proteinG: '',
    fatG: '',
    carbsG: '',
    energyKcal: '',
    servingSize: '',
    sourceUrl: '',
    dataAccuracyNote: '',
    isManualEntry: true,
  });

  const chains = [
    { id: 'sukiya', name: 'すき家' },
    { id: 'yoshinoya', name: '吉野家' },
    { id: 'matsuya', name: '松屋' },
  ];

  const categories = ['牛丼', 'カレー', '定食', 'サイドメニュー', '朝食', 'その他'];

  const handleSubmit = () => {
    // バリデーション
    if (!formData.chain || !formData.name || !formData.proteinG) {
      Alert.alert('エラー', 'チェーン店、メニュー名、タンパク質は必須です');
      return;
    }

    // 確認ダイアログ
    Alert.alert(
      '確認',
      `以下の内容で追加しますか？\n\nチェーン: ${formData.chain}\nメニュー: ${formData.name}\nタンパク質: ${formData.proteinG}g`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '追加',
          onPress: () => {
            // TODO: データベースに保存
            console.log('Saving menu:', formData);
            Alert.alert('成功', 'メニューを追加しました', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  const handleChainSelect = (chainId: string) => {
    const chain = chains.find((c) => c.id === chainId);
    if (chain) {
      setFormData({ ...formData, chain: chainId });
      // 自動的にソースURLを設定
      const sourceUrls: Record<string, string> = {
        sukiya: 'https://www.sukiya.jp/menu/',
        yoshinoya: 'https://www.yoshinoya.com/menu/',
        matsuya: 'https://www.matsuyafoods.co.jp/menu/',
      };
      setFormData((prev) => ({
        ...prev,
        chain: chainId,
        sourceUrl: sourceUrls[chainId] || '',
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本情報</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>チェーン店 *</Text>
            <View style={styles.chainButtons}>
              {chains.map((chain) => (
                <TouchableOpacity
                  key={chain.id}
                  style={[
                    styles.chainButton,
                    formData.chain === chain.id && styles.chainButtonActive,
                  ]}
                  onPress={() => handleChainSelect(chain.id)}
                >
                  <Text
                    style={[
                      styles.chainButtonText,
                      formData.chain === chain.id && styles.chainButtonTextActive,
                    ]}
                  >
                    {chain.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>メニュー名 *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="例: 牛丼（並盛）"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>カテゴリー</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryButtons}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      formData.category === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        formData.category === category && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>栄養成分</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>単位</Text>
            <View style={styles.perButtons}>
              <TouchableOpacity
                style={[styles.perButton, formData.per === 'serving' && styles.perButtonActive]}
                onPress={() => setFormData({ ...formData, per: 'serving' })}
              >
                <Text
                  style={[
                    styles.perButtonText,
                    formData.per === 'serving' && styles.perButtonTextActive,
                  ]}
                >
                  1食あたり
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.perButton, formData.per === '100g' && styles.perButtonActive]}
                onPress={() => setFormData({ ...formData, per: '100g' })}
              >
                <Text
                  style={[
                    styles.perButtonText,
                    formData.per === '100g' && styles.perButtonTextActive,
                  ]}
                >
                  100gあたり
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.label}>タンパク質 (g) *</Text>
              <TextInput
                style={styles.nutritionInput}
                value={formData.proteinG}
                onChangeText={(text) => setFormData({ ...formData, proteinG: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
              />
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.label}>脂質 (g)</Text>
              <TextInput
                style={styles.nutritionInput}
                value={formData.fatG}
                onChangeText={(text) => setFormData({ ...formData, fatG: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
              />
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.label}>炭水化物 (g)</Text>
              <TextInput
                style={styles.nutritionInput}
                value={formData.carbsG}
                onChangeText={(text) => setFormData({ ...formData, carbsG: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
              />
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.label}>カロリー (kcal)</Text>
              <TextInput
                style={styles.nutritionInput}
                value={formData.energyKcal}
                onChangeText={(text) => setFormData({ ...formData, energyKcal: text })}
                keyboardType="decimal-pad"
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>提供サイズ</Text>
            <TextInput
              style={styles.input}
              value={formData.servingSize}
              onChangeText={(text) => setFormData({ ...formData, servingSize: text })}
              placeholder="例: 1杯（350g）"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データソース情報</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>データ元URL</Text>
            <TextInput
              style={styles.input}
              value={formData.sourceUrl}
              onChangeText={(text) => setFormData({ ...formData, sourceUrl: text })}
              placeholder="https://..."
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>データ精度に関する注記</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.dataAccuracyNote}
              onChangeText={(text) => setFormData({ ...formData, dataAccuracyNote: text })}
              placeholder="例: 2024年12月の公式サイトより手動転記"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>手動入力データ</Text>
            <Switch
              value={formData.isManualEntry}
              onValueChange={(value) => setFormData({ ...formData, isManualEntry: value })}
            />
          </View>
        </View>

        <View style={styles.legalNotice}>
          <Ionicons name="information-circle-outline" size={20} color="#FF9800" />
          <Text style={styles.legalText}>
            各チェーン店の公式サイトから手動で転記したデータを入力してください。
            自動取得は利用規約違反となる可能性があります。
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>追加する</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chainButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  chainButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  chainButtonActive: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  chainButtonText: {
    fontSize: 14,
    color: '#666',
  },
  chainButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  perButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  perButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  perButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  perButtonText: {
    fontSize: 14,
    color: '#666',
  },
  perButtonTextActive: {
    color: '#fff',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
  },
  nutritionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legalNotice: {
    backgroundColor: '#FFF3E0',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
  },
  legalText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: '#795548',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FF5722',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
