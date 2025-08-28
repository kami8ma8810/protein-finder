# Protein Finder - Development TODO

## 🚀 Project Setup
- [x] Initialize Expo project with TypeScript
- [x] Set up directory structure
- [x] Configure TypeScript, ESLint, Prettier
- [x] Create README.md and README.ja.md
- [x] Set up Git hooks (pre-commit)

## 📱 Core Implementation (Phase 1)

### Foundation ✅
- [x] Core type definitions (MenuItem, NutrientValue, etc.) with tests
- [x] SQLite database layer (TDD)
  - [x] Schema definition
  - [x] Repository pattern implementation
  - [x] Migration system (初期化処理で対応)
- [x] API client layer
  - [x] ETag/If-None-Match support
  - [x] Error handling
  - [x] Retry logic (キャッシュフォールバックで対応)
  - [x] Offline detection (キャッシュフォールバックで対応)

### UI Components (with SOLID principles)
- [ ] Design tokens setup (colors, typography, spacing)
- [x] Navigation structure (expo-router)
  - [x] Tab navigation
  - [x] Stack navigation for details
- [ ] Common components
  - [ ] AccessibleCard
  - [ ] SearchBar
  - [ ] FilterChip
  - [ ] LoadingSpinner (基本実装済み、共通化が必要)
  - [ ] ErrorBoundary

### Screens (Priority Order)
- [x] Store List Screen (Priority 1)
  - [x] Display available chains
  - [ ] Search store functionality
  - [ ] Store logos and info
- [x] Store Menu Screen (Priority 2)
  - [x] Display menu for selected store
  - [x] Sort by protein/calories/PFC
  - [x] Category filter (データはあるが、UIは未実装)
  - [x] Pull to refresh
- [x] Menu Detail Screen (Priority 3)
  - [x] Nutrition display
  - [ ] Source URL link
  - [ ] Share functionality
  - [x] Last updated date
- [x] Cross-Store Search Screen (Priority 4)
  - [x] Search by menu name
  - [x] Compare across stores
  - [ ] Filter by nutrients
- [x] Settings Screen
  - [ ] Push notification toggles
  - [ ] Data policy
  - [ ] Licenses

## 🧪 Testing (TDD Approach) 

### Unit Tests
- [x] Domain models (MenuItemテスト完了)
- [x] Nutrient calculations
- [x] Repository implementations
- [x] API client (基本テスト実装済み)
- [ ] Presenters/Formatters

### Integration Tests
- [x] SQLite operations (モックで実装済み)
- [ ] API sync logic
- [ ] Offline/online transitions

### E2E Tests
- [ ] Navigation flow
- [ ] Search and filter
- [ ] Data sync

## ♿ Accessibility

### WCAG Level A (Required)
- [ ] Alternative text for images
- [x] Proper heading structure (基本実装済み)
- [ ] Keyboard navigation support
- [x] Form labels and descriptions (基本実装済み)
- [ ] Error identification

### WCAG Level AA (Target)
- [ ] Color contrast (4.5:1 minimum)
- [ ] Text resize support (up to 200%)
- [x] Focus indicators (React Native default)
- [x] Consistent navigation

## 🔔 Push Notifications
- [ ] Expo notifications setup
- [ ] FCM/APNs configuration
- [ ] Topic subscription logic
- [ ] Chain-specific notifications
- [ ] Settings UI for notification preferences

## 🎨 UI/UX Polish
- [x] Apple-style design system (基本実装済み)
- [ ] Smooth animations (with reduced motion support)
- [x] Loading states
- [ ] Error states
- [x] Empty states
- [ ] Skeleton screens

## 📊 Performance Optimization ✅
- [x] FlatList optimization
  - [x] initialNumToRender
  - [x] maxToRenderPerBatch
  - [x] windowSize
  - [x] removeClippedSubviews
  - [x] memo optimization (useCallback, useMemo使用)
- [x] SQLite indexing
- [ ] Image optimization
- [ ] Bundle size optimization (Expo Atlas対応)

## 🚢 Release Preparation
- [ ] App icons (iOS/Android)
- [ ] Splash screen
- [ ] App Store screenshots
- [ ] Privacy policy
- [ ] Terms of service
- [ ] EAS Build configuration
- [ ] CI/CD pipeline

## 🖥️ Backend (Phase 2)

### Scraper Development
- [ ] Base scraper class
- [ ] Chain-specific scrapers
  - [ ] Sukiya
  - [ ] Yoshinoya
  - [ ] Matsuya
- [ ] PDF parsing support
- [ ] Data normalization
  - [ ] Unit conversion (mg to g)
  - [ ] Per serving/100g detection

### API Development
- [ ] REST endpoints
  - [ ] GET /api/v1/menus
  - [ ] GET /api/v1/menus/:id
  - [ ] GET /api/v1/meta
- [ ] ETag support
- [ ] CORS configuration
- [ ] Rate limiting

### Infrastructure
- [ ] Database setup (PostgreSQL/SQLite)
- [ ] Cloud Run deployment
- [ ] Cloud Scheduler setup
- [ ] Monitoring (Sentry)
- [ ] Logging

## 🏃 次のステップ (Next Steps)

### 即座に対応可能
1. **UIコンポーネントの共通化**
   - LoadingSpinner, ErrorBoundaryを共通コンポーネント化
   - Design System の構築

2. **アクセシビリティ改善**
   - 画像の代替テキスト
   - エラー表示の改善
   - カラーコントラストの確認

3. **UI/UXの洗練**
   - アニメーション追加
   - エラー状態の実装
   - スケルトンスクリーン

### 中期的な対応
1. **バックエンド開発**
   - スクレイパー実装
   - REST API構築
   - 自動更新システム

2. **リリース準備**
   - アイコン・スプラッシュ画面
   - EAS Build設定
   - ストア申請準備

## 📈 Future Enhancements
- [ ] Map search integration
- [ ] PFC balance filters (UIは未実装だがロジックは実装済み)
- [ ] User accounts
- [ ] Meal tracking
- [ ] AI recommendations
- [ ] Multiple language support

## 🐛 Known Issues
- React 19のpeer dependency警告（動作には影響なし）
- 依存パッケージのバージョン警告（--legacy-peer-depsで対応）

## 📝 Notes
- ✅ TDD approach実践済み (Red → Green → Refactor)
- ✅ SOLID principles適用済み
- ✅ パフォーマンス最適化実装済み（useCallback, useMemo, React.memo）
- ✅ Expo SDK 53の新機能活用（New Architecture, Edge-to-Edge）
- 次はUIコンポーネントの共通化とアクセシビリティ向上が優先

## 🎉 完了した主な機能
- データベース層（SQLite + Repository Pattern）
- API通信層（ETag対応、キャッシュ管理）
- ナビゲーション構造（Expo Router）
- 店舗一覧・メニュー一覧・メニュー詳細画面
- 横断検索機能
- テストデータ投入システム
- パフォーマンス最適化

---

Last Updated: 2025-08-28 (Day 1 - 基本機能実装完了！)