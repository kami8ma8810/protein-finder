# Protein Finder - Development TODO

## 🚀 Project Setup
- [x] Initialize Expo project with TypeScript
- [ ] Set up directory structure
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Create README.md and README.ja.md
- [ ] Set up Git hooks (pre-commit)

## 📱 Core Implementation (Phase 1)

### Foundation
- [ ] Core type definitions (MenuItem, NutrientValue, etc.) with tests
- [ ] SQLite database layer (TDD)
  - [ ] Schema definition
  - [ ] Repository pattern implementation
  - [ ] Migration system
- [ ] API client layer
  - [ ] ETag/If-None-Match support
  - [ ] Error handling
  - [ ] Retry logic
  - [ ] Offline detection

### UI Components (with SOLID principles)
- [ ] Design tokens setup (colors, typography, spacing)
- [ ] Navigation structure (expo-router)
  - [ ] Tab navigation
  - [ ] Stack navigation for details
- [ ] Common components
  - [ ] AccessibleCard
  - [ ] SearchBar
  - [ ] FilterChip
  - [ ] LoadingSpinner
  - [ ] ErrorBoundary

### Screens
- [ ] Menu List Screen
  - [ ] FlashList implementation
  - [ ] Search functionality
  - [ ] Filter by chain
  - [ ] Filter by protein amount
  - [ ] Sort options
  - [ ] Pull to refresh
- [ ] Menu Detail Screen
  - [ ] Nutrition display
  - [ ] Source URL link
  - [ ] Share functionality
  - [ ] Last updated date
- [ ] Settings Screen
  - [ ] Push notification toggles
  - [ ] Data policy
  - [ ] Licenses

## 🧪 Testing (TDD Approach)

### Unit Tests
- [ ] Domain models
- [ ] Nutrient calculations
- [ ] Repository implementations
- [ ] API client
- [ ] Presenters/Formatters

### Integration Tests
- [ ] SQLite operations
- [ ] API sync logic
- [ ] Offline/online transitions

### E2E Tests
- [ ] Navigation flow
- [ ] Search and filter
- [ ] Data sync

## ♿ Accessibility

### WCAG Level A (Required)
- [ ] Alternative text for images
- [ ] Proper heading structure
- [ ] Keyboard navigation support
- [ ] Form labels and descriptions
- [ ] Error identification

### WCAG Level AA (Target)
- [ ] Color contrast (4.5:1 minimum)
- [ ] Text resize support (up to 200%)
- [ ] Focus indicators
- [ ] Consistent navigation

## 🔔 Push Notifications
- [ ] Expo notifications setup
- [ ] FCM/APNs configuration
- [ ] Topic subscription logic
- [ ] Chain-specific notifications
- [ ] Settings UI for notification preferences

## 🎨 UI/UX Polish
- [ ] Apple-style design system
- [ ] Smooth animations (with reduced motion support)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Skeleton screens

## 📊 Performance Optimization
- [ ] FlashList optimization
  - [ ] estimatedItemSize
  - [ ] getItemLayout
  - [ ] memo optimization
- [ ] SQLite indexing
- [ ] Image optimization
- [ ] Bundle size optimization

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

## 📈 Future Enhancements
- [ ] Map search integration
- [ ] PFC balance filters
- [ ] User accounts
- [ ] Meal tracking
- [ ] AI recommendations
- [ ] Multiple language support

## 🐛 Known Issues
- None yet

## 📝 Notes
- Always follow TDD approach (Red → Green → Refactor)
- Maintain SOLID principles
- Keep accessibility in mind
- Document "why" in comments
- Commit frequently with meaningful messages

---

Last Updated: 2025-08-28