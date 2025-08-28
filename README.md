# Protein Finder 🥩

A mobile application for searching and comparing protein content from official nutrition data of restaurant chains. Built with React Native, Expo, and TypeScript following TDD and SOLID principles.

[日本語版はこちら](./README.ja.md)

## Features

- 🔍 **Smart Search**: Search menu items by protein content, chain, and nutritional criteria
- 📊 **Nutritional Comparison**: Compare items by "per serving" or "per 100g"
- 🔄 **Auto-sync**: Daily updates from official sources
- 📱 **Offline Support**: Access data even without internet connection
- 🔔 **Push Notifications**: Get notified when your favorite chains update their menu
- ♿ **Accessible**: WCAG AA compliant for inclusive design

## Tech Stack

### Mobile App
- **Framework**: React Native + Expo (SDK 50+)
- **Language**: TypeScript
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite)
- **UI Components**: NativeWind (TailwindCSS for React Native)
- **List Performance**: FlashList
- **Testing**: Jest, React Testing Library

### Backend (Coming Soon)
- **Runtime**: Node.js 20
- **Scraping**: Playwright, Cheerio
- **Database**: PostgreSQL/SQLite
- **API**: REST with ETag support
- **Deployment**: Cloud Run + Cloud Scheduler

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/protein-finder.git
cd protein-finder

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web (experimental)
npm run web
```

### Running Tests

```bash
# Unit tests
npm test

# Watch mode for TDD
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests (coming soon)
npm run test:e2e
```

## Project Structure

```
protein-finder/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Menu list screen
│   │   └── settings.tsx   # Settings screen
│   └── detail/[id].tsx    # Menu detail screen
├── src/
│   ├── core/              # Core business logic
│   │   ├── domain/        # Domain models
│   │   ├── usecases/      # Business rules
│   │   └── types.ts       # TypeScript definitions
│   ├── infrastructure/    # External interfaces
│   │   ├── api/          # API client
│   │   └── database/     # SQLite implementation
│   ├── presentation/      # UI layer
│   │   ├── components/   # Reusable components
│   │   ├── screens/      # Screen components
│   │   └── stores/       # Zustand stores
│   └── utils/            # Utilities
├── __tests__/            # Test files
├── assets/               # Images, fonts
└── docs/                 # Documentation
```

## Architecture

This project follows **Clean Architecture** principles:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (React Components, Stores)       │
├─────────────────────────────────────┤
│         Application Layer           │
│      (Use Cases, DTOs)              │
├─────────────────────────────────────┤
│          Domain Layer               │
│   (Entities, Value Objects)         │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   (API, Database, External Services)│
└─────────────────────────────────────┘
```

## Development Principles

### TDD (Test-Driven Development)
We follow the Red-Green-Refactor cycle:
1. 🔴 Write a failing test
2. 🟢 Write minimal code to pass
3. 🔵 Refactor for quality

### SOLID Principles
- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable
- **I**nterface Segregation: Many specific interfaces
- **D**ependency Inversion: Depend on abstractions

### Accessibility First
- WCAG Level AA compliance target
- Screen reader support
- Keyboard navigation
- High contrast support

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD)
4. Implement your feature
5. Run tests (`npm test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Convention

We use conventional commits:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

## Data Sources

All nutritional data is sourced from official restaurant chain websites:
- Data is updated daily
- Source URLs are always provided
- Last update timestamp is displayed

## Privacy Policy

This app:
- Does not collect personal data
- Does not use tracking or analytics (except crash reports)
- Stores data locally on your device
- Only connects to our API for data updates

## License

MIT License - see [LICENSE](./LICENSE) file for details

## Acknowledgments

- Restaurant chains for providing public nutritional data
- Expo team for the amazing framework
- React Native community
- Contributors and testers

## Support

- 📧 Email: support@proteinfinder.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/protein-finder/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/protein-finder/discussions)

---

Made with ❤️ by the Protein Finder Team