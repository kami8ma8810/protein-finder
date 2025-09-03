# Protein Finder プロジェクト概要

## プロジェクトの目的

飲食店チェーンの公式栄養データから高タンパク質メニューを検索・比較できるモバイルアプリケーション。
TDDとSOLID原則に従ってReact Native、Expo、TypeScriptで構築。

## 技術スタック

- **フレームワーク**: React Native + Expo (SDK 53)
- **言語**: TypeScript 5.9
- **ルーティング**: Expo Router
- **データベース**: SQLite (expo-sqlite)
- **状態管理**: 未実装（Zustand予定）
- **テスト**: Jest, React Testing Library

## アーキテクチャ

クリーンアーキテクチャを採用：

- **Presentation Layer**: React Components, Stores
- **Application Layer**: Use Cases, DTOs
- **Domain Layer**: Entities, Value Objects
- **Infrastructure Layer**: API, Database, External Services

## プロジェクト構造

```
src/
├── core/              # コアビジネスロジック
│   ├── domain/        # ドメインモデル
│   ├── repositories/  # リポジトリインターフェース
│   ├── services/      # サービスインターフェース
│   └── usecases/      # ユースケース
├── infrastructure/    # 外部インターフェース実装
│   ├── api/          # APIクライアント
│   ├── cache/        # キャッシュ管理
│   └── database/     # SQLite実装
├── presentation/      # UIレイヤー
│   ├── components/   # 再利用可能コンポーネント
│   ├── screens/      # 画面コンポーネント
│   ├── stores/       # 状態管理
│   └── design-system/# デザイントークン
├── scripts/          # スクリプト
└── utils/            # ユーティリティ
```

## 主要な使用例

1. **店舗別メニュー検索**: 特定の店舗のメニューをタンパク質量でソート
2. **横断検索**: 全店舗からメニュー名で検索して比較

## 開発原則

- TDD（テスト駆動開発）
- SOLID原則
- アクセシビリティ優先（WCAG AA準拠目標）
