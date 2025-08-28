import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * App Component
 * 後でexpo-routerによるナビゲーション構造に置き換える予定
 */
export default function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Protein Finder - Coming Soon! 🥩</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});