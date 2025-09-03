# Protein Finder 開発コマンド一覧

## 開発サーバー起動

```bash
npm start          # Expo開発サーバー起動
npm run ios        # iOSシミュレータで起動
npm run android    # Androidエミュレータで起動
npm run web        # Webブラウザで起動
```

## コード品質チェック

```bash
npm run lint            # ESLintでコードチェック
npm run lint:fix        # ESLintエラーを自動修正
npm run format          # Prettierでコード整形
npm run format:check    # フォーマットチェック
npm run type-check      # TypeScript型チェック
```

## テスト

```bash
npm test               # テスト実行
npm run test:watch     # ウォッチモードでテスト
npm run test:coverage  # カバレッジレポート生成
```

## データ管理

```bash
npm run seed           # テストデータ投入
```

## タスク完了時に実行すべきコマンド

1. `npm run type-check` - 型エラーがないか確認
2. `npm run lint:fix` - Lintエラーを修正
3. `npm run format` - コード整形
4. `npm test` - テストが通ることを確認

## Git コマンド

```bash
git status            # 変更状況確認
git diff              # 変更内容確認
git add .             # 変更をステージング
git commit -m "..."   # コミット
```

## システムコマンド (macOS)

```bash
ls -la                # ファイル一覧表示
find . -name "*.ts"   # TypeScriptファイル検索
grep -r "pattern" .   # パターン検索
```
