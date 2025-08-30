import React from 'react';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '管理画面',
          headerStyle: {
            backgroundColor: '#FF5722',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="add-menu"
        options={{
          title: 'メニュー追加',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="chains"
        options={{
          title: 'チェーン店管理',
        }}
      />
      <Stack.Screen
        name="legal"
        options={{
          title: '法的事項管理',
        }}
      />
    </Stack>
  );
}
