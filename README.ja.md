# Protein Finder 🥩

外食チェーンの公式栄養成分データからタンパク質量を検索・比較できるモバイルアプリケーション。React Native、Expo、TypeScriptで構築され、TDDとSOLID原則にしたがって開発されています。

[English version](./README.md)

## 主な使い方

### ユースケースA：店舗別メニュー検索（メイン機能）

「今日すき家に行くから、タンパク質が多いメニューを知りたい」

1. 店舗リストから「すき家」を選択
2. すき家のメニューがタンパク質順で表示
3. PFCバランスや価格でも並び替え可能

### ユースケースB：メニュー横断検索（サブ機能）

「牛丼を食べたいけど、どの店が一番タンパク質が多い？」

1. メニュー名で「牛丼」を検索
2. 全店舗の牛丼が比較表示
3. タンパク質量で最適な選択

## 機能

- 🏪 **店舗別表示**: 店舗を選択してメニュー一覧を表示
- 🔍 **横断検索**: メニュー名で全店舗から検索
- 📊 **栄養成分ソート**: タンパク質量、カロリー、PFCバランスで並び替え
- 🔄 **自動同期**: 公式ソースから毎日更新
- 📱 **オフライン対応**: インターネット接続なしでもデータにアクセス可能
- ♿ **アクセシビリティ**: WCAG AA準拠のインクルーシブデザイン

## 技術スタック

### モバイルアプリ

- **フレームワーク**: React Native + Expo (SDK 50+)
- **言語**: TypeScript
- **状態管理**: Zustand
- **データベース**: SQLite (expo-sqlite)
- **UIコンポーネント**: NativeWind (React Native用TailwindCSS)
- **リストパフォーマンス**: FlashList
- **テスト**: Jest、React Testing Library

### バックエンド（開発予定）

- **ランタイム**: Node.js 20
- **スクレイピング**: Playwright、Cheerio
- **データベース**: PostgreSQL/SQLite
- **API**: ETag対応のREST
- **デプロイ**: Cloud Run + Cloud Scheduler

## はじめに

### 必要要件

- Node.js 18以上
- npmまたはyarn
- Expo CLI
- iOSシミュレータ（Mac）またはAndroidエミュレーター

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/protein-finder.git
cd protein-finder

# 依存関係をインストール
npm install --legacy-peer-deps

# 開発サーバーを起動
npm start
```

### 初回起動時のセットアップ

アプリは初回起動時に自動的に以下を実行します：

1. SQLiteデータベースの初期化
2. テストデータの投入（すき家、吉野家、松屋の実際のメニューに近いデータ）

手動でテストデータをリセットしたい場合：

```bash
# テストデータの再投入
npm run seed
```

### アプリの実行

```bash
# iOS
npm run ios

# Android
npm run android

# Web（実験的）
npm run web
```

### テストの実行

```bash
# ユニットテスト
npm test

# TDD用のウォッチモード
npm test -- --watch

# カバレッジレポート
npm test -- --coverage

# E2Eテスト（開発予定）
npm run test:e2e
```

## プロジェクト構造

```
protein-finder/
├── app/                    # Expo Routerの画面
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # メニュー一覧画面
│   │   └── settings.tsx   # 設定画面
│   └── detail/[id].tsx    # メニュー詳細画面
├── src/
│   ├── core/              # コアビジネスロジック
│   │   ├── domain/        # ドメインモデル
│   │   ├── usecases/      # ビジネスルール
│   │   └── types.ts       # TypeScript定義
│   ├── infrastructure/    # 外部インターフェース
│   │   ├── api/          # APIクライアント
│   │   └── database/     # SQLite実装
│   ├── presentation/      # UIレイヤー
│   │   ├── components/   # 再利用可能なコンポーネント
│   │   ├── screens/      # 画面コンポーネント
│   │   └── stores/       # Zustandストア
│   └── utils/            # ユーティリティ
├── __tests__/            # テストファイル
├── assets/               # 画像、フォント
└── docs/                 # ドキュメント
```

## アーキテクチャ

このプロジェクトは**クリーンアーキテクチャ**の原則にしたがっています：

```
┌─────────────────────────────────────┐
│      プレゼンテーション層           │
│    (Reactコンポーネント、ストア)     │
├─────────────────────────────────────┤
│      アプリケーション層             │
│      (ユースケース、DTO)            │
├─────────────────────────────────────┤
│         ドメイン層                  │
│   (エンティティ、値オブジェクト)     │
├─────────────────────────────────────┤
│     インフラストラクチャ層          │
│   (API、データベース、外部サービス)  │
└─────────────────────────────────────┘
```

## 開発原則

### TDD（テスト駆動開発）

Red-Green-Refactorサイクルに従います：

1. 🔴 失敗するテストを書く
2. 🟢 テストを通す最小限のコードを書く
3. 🔵 品質向上のためリファクタリング

### SOLID原則

- **S**ingle Responsibility: 各クラスには変更する理由が1つ
- **O**pen/Closed: 拡張に対して開き、修正に対して閉じている
- **L**iskov Substitution: サブタイプは置換可能でなければならない
- **I**nterface Segregation: 多くの特定インターフェイス
- **D**ependency Inversion: 抽象に依存する

### アクセシビリティファースト

- WCAGレベルAA準拠を目標
- スクリーンリーダー対応
- キーボードナビゲーション
- ハイコントラスト対応

## コントリビューション

コントリビューションを歓迎します！詳細は[CONTRIBUTING.md](./CONTRIBUTING.md)をご覧ください。

### 開発ワークフロー

1. リポジトリをフォーク
2. フィーチャーブランチを作成（`git checkout -b feature/amazing-feature`）
3. テストを先に書く（TDD）
4. 機能を実装
5. テストを実行（`npm test`）
6. 変更をコミット（`git commit -m 'feat: 素晴らしい機能を追加'`）
7. ブランチにプッシュ（`git push origin feature/amazing-feature`）
8. プルリクエストを開く

### コミット規約

Conventional Commitsを使用：

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: コードスタイルの変更
- `refactor`: コードのリファクタリング
- `test`: テストの追加/変更
- `chore`: メンテナンスタスク

## データソース

すべての栄養データは外食チェーンの公式ウェブサイトから取得：

- データは毎日更新
- ソースURLは常に提供
- 最終更新のタイムスタンプを表示

## プライバシーポリシー

このアプリは：

- 個人データを収集しません
- トラッキングや分析を使用しません（クラッシュレポートを除く）
- データをデバイスにローカル保存します
- データ更新のためにAPIにのみ接続します

## ライセンス

MITライセンス - 詳細は[LICENSE](./LICENSE)ファイルを参照

## 謝辞

- 公開栄養データを提供している外食チェーン
- 素晴らしいフレームワークを提供するExpoチーム
- React Nativeコミュニティ
- コントリビューターとテスター

## サポート

- 📧 メール: support@proteinfinder.app
- 🐛 イシュー: [GitHub Issues](https://github.com/yourusername/protein-finder/issues)
- 💬 ディスカッション: [GitHub Discussions](https://github.com/yourusername/protein-finder/discussions)

---

Protein Finderチームが❤️を込めて作成
