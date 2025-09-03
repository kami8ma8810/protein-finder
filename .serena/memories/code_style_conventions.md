# Protein Finder コーディング規約

## TypeScript規約

- **any型の使用禁止** - 型安全性を保つため
- strictモード有効
- インターフェースは`I`プレフィックス（例: `IMenuRepository`）
- 型定義は`types.ts`にまとめる

## 命名規則

- **ファイル名**:
  - コンポーネント: PascalCase（例: `SearchBar.tsx`）
  - その他: camelCase（例: `seedTestData.ts`）
- **変数・関数**: camelCase
- **クラス・インターフェース**: PascalCase
- **定数**: UPPER_SNAKE_CASE

## ディレクトリ構造

- ドメインロジックは`core/`に配置
- 外部依存は`infrastructure/`に配置
- UI関連は`presentation/`に配置
- 各層で責務を明確に分離

## React/React Native

- 関数コンポーネントを使用
- Hooksを活用
- コンポーネントは単一責任原則に従う

## テスト

- テストファイルは`__tests__`ディレクトリまたは`.test.ts`サフィックス
- モックは`__mocks__`ディレクトリに配置
- TDDサイクル（Red-Green-Refactor）を遵守

## アクセシビリティ

- 全てのインタラクティブ要素に`accessibilityLabel`を設定
- `accessibilityRole`と`accessibilityState`を適切に使用
- スクリーンリーダー対応を考慮

## エラーハンドリング

- try-catchブロックで適切にエラーを捕捉
- ユーザーフレンドリーなエラーメッセージを表示
- エラーバウンダリーコンポーネントを使用

## コメント

- 必要最小限のコメントのみ記載
- コードが自己文書化されるように書く
- JSDocは公開APIにのみ使用
