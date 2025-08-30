# React Native パフォーマンス最適化ガイドライン

## 概要

React Nativeアプリケーションのパフォーマンスを最適化するためのガイドラインです。
本プロジェクトでは、ユーザー体験を最優先に考え、スムーズな動作を実現するために以下の最適化手法を採用しています。

## 1. メモ化戦略

### React.memo の使用

コンポーネントの不要な再レンダリングを防ぐため、以下の条件でReact.memoを使用：

- リストアイテムコンポーネント
- 頻繁に再レンダリングされる親を持つ子コンポーネント
- propsの変更が少ないコンポーネント

```typescript
const MenuItemComponent = React.memo(({ item, onPress }) => {
  return <TouchableOpacity>...</TouchableOpacity>;
}, (prevProps, nextProps) => {
  // カスタム比較関数（必要な場合）
  return prevProps.item.id === nextProps.item.id;
});
```

### useCallback の使用

関数の再生成を防ぐため、以下の場面でuseCallbackを使用：

- 子コンポーネントに渡すイベントハンドラー
- useEffectの依存配列に含まれる関数
- React.memoでラップされたコンポーネントに渡す関数

```typescript
const handleMenuPress = useCallback(
  (itemId: string) => {
    router.push(`/menu/${itemId}`);
  },
  [router],
);
```

### useMemo の使用

高コストな計算の結果をメモ化：

- フィルタリングやソート処理
- 複雑な計算を伴うデータ変換
- 大規模なデータセットの処理

```typescript
const sortedMenuItems = useMemo(() => {
  return sortMenuItems(menuItems, sortOption);
}, [menuItems, sortOption]);
```

## 2. FlatList 最適化

### 必須の最適化項目

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}

  // パフォーマンス最適化プロパティ
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
  removeClippedSubviews={true}

  // ビューポート外のアイテムの事前レンダリング
  onEndReachedThreshold={0.5}
  onEndReached={loadMoreItems}
/>
```

### FlashList の導入検討

大量のアイテム（100件以上）を扱う場合は、ShopifyのFlashListの使用を検討：

```bash
npm install @shopify/flash-list
```

## 3. useEffect の最適化

### 依存配列の適切な管理

```typescript
// ❌ Bad: 毎回実行される
useEffect(() => {
  loadData();
});

// ✅ Good: 必要な時のみ実行
useEffect(() => {
  loadData();
}, [id]);
```

### クリーンアップの実装

```typescript
useEffect(() => {
  const subscription = subscribeToData();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 非同期処理の適切な処理

```typescript
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    const data = await loadData();
    if (isMounted) {
      setData(data);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, [id]);
```

## 4. 画像の最適化

### React Native Fast Imageの使用

```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  style={styles.image}
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

## 5. アニメーション最適化

### useNativeDriverの使用

```typescript
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // 必須
}).start();
```

### InteractionManagerの活用

```typescript
InteractionManager.runAfterInteractions(() => {
  // 重い処理を実行
  performHeavyTask();
});
```

## 6. 状態管理の最適化

### 状態の分割

```typescript
// ❌ Bad: 大きな状態オブジェクト
const [state, setState] = useState({
  loading: false,
  data: [],
  error: null,
  filter: '',
});

// ✅ Good: 分割された状態
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [error, setError] = useState(null);
const [filter, setFilter] = useState('');
```

## 7. デバッグとプロファイリング

### React DevToolsの活用

```bash
npx react-devtools
```

### Flipperの使用

- Network Inspector
- Layout Inspector
- React DevTools Integration

### console.logの削除

本番環境では必ずconsole.logを削除：

```javascript
// babel.config.js
module.exports = {
  plugins: [
    'transform-remove-console', // 本番環境のみ
  ],
};
```

## 8. バンドルサイズの最適化

### 不要な依存関係の削除

```bash
# パッケージサイズの確認
npm ls --depth=0

# 未使用パッケージの検出
npx depcheck
```

### 動的インポートの活用

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## 9. メトリクスとモニタリング

### 重要なメトリクス

- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- FPS (Frames Per Second)
- Memory Usage
- Bundle Size

### パフォーマンス測定

```typescript
import { PerformanceObserver } from 'perf_hooks';

const measure = (name: string, fn: () => void) => {
  performance.mark(`${name}-start`);
  fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
};
```

## 10. チェックリスト

### 開発時

- [ ] React.memoを適切に使用しているか
- [ ] useCallbackで関数をメモ化しているか
- [ ] useMemoで高コストな計算をメモ化しているか
- [ ] FlatListの最適化プロパティを設定しているか
- [ ] useEffectの依存配列を正しく設定しているか

### リリース前

- [ ] console.logを削除したか
- [ ] 不要な依存関係を削除したか
- [ ] パフォーマンステストを実施したか
- [ ] メモリリークのチェックを行ったか

## 11. Expo SDK 53 固有の最適化

### New Architecture の活用

SDK 53ではNew Architectureがデフォルトで有効化：

```json
// app.json
{
  "expo": {
    "newArchEnabled": true // SDK 53ではデフォルト
  }
}
```

### Expo Atlas でバンドルサイズ分析

```bash
# バンドルサイズの可視化
EXPO_ATLAS=1 npx expo start
```

### expo-audio の使用（expo-avより高速）

```typescript
// ❌ Old: expo-av
import { Audio } from 'expo-av';

// ✅ New: expo-audio（より高速）
import { useAudioPlayer } from 'expo-audio';
```

### Edge-to-Edge Display（Android）

```json
// app.json
{
  "expo": {
    "android": {
      "edgeToEdgeEnabled": true
    }
  }
}
```

### ビルド時間の最適化

Expo SDK 53では、プリビルドモジュールによりAndroidビルド時間が短縮

## 参考資料

- [React Native Performance](https://reactnative.dev/docs/performance)
- [React.memo](https://react.dev/reference/react/memo)
- [Understanding useMemo and useCallback](https://www.joshwcomeau.com/react/usememo-and-usecallback/)
- [@shopify/flash-list](https://shopify.github.io/flash-list/)
- [Expo SDK 53 Changelog](https://expo.dev/changelog/sdk-53)
- [Best Practices for reducing lag in Expo apps](https://expo.dev/blog/best-practices-for-reducing-lag-in-expo-apps)
