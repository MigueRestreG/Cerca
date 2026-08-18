# Cerca - Booking & Marketplace App 🏠

A modern, cross-platform booking and marketplace application built with React Native and Expo. Cerca enables users to discover, list, and book services with an intuitive interface designed for both iOS, Android, and web platforms.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Cerca is a comprehensive booking and marketplace platform that connects service providers with customers. The application provides a seamless experience for browsing listings, making bookings, managing reservations, and leaving reviews. Built with modern technologies, it supports multiple platforms from a single codebase.

### Key Capabilities

- **Browse & Search**: Discover services and listings in your area
- **Booking System**: Request and manage bookings with real-time status tracking
- **User Authentication**: Secure sign-in and authentication
- **Account Management**: Manage user profile and preferences
- **Listings**: Create and manage service listings
- **Reviews & Ratings**: Leave and view reviews for completed bookings
- **Location Services**: Find services based on geographic proximity

## ✨ Features

### For Customers

- Search and filter available services
- View detailed listing information with photos and reviews
- Request bookings from service providers
- Track booking status in real-time
- Leave reviews and ratings after completion
- Manage booking history
- Access account settings and preferences

### For Service Providers

- Create and manage service listings
- Receive and respond to booking requests
- Track service history
- Build reputation through customer reviews
- Update availability and pricing

### General Features

- Multi-platform support (iOS, Android, Web)
- Dark mode / Light mode support
- Responsive design for all device sizes
- Offline-ready data caching with React Query
- Secure authentication with token-based access
- Real-time data synchronization
- Internationalization (i18n) support

## 🛠 Tech Stack

### Frontend Framework

- **React Native 0.86**: Cross-platform mobile development
- **Expo 57**: Build system and managed services
- **React 19**: UI library
- **TypeScript 6**: Type safety and developer experience

### Routing & Navigation

- **Expo Router 57**: File-based routing system
- **React Navigation Stack**: Navigation management

### State Management & Data Fetching

- **TanStack React Query 5**: Server state management and caching
- **React Query DevTools**: Development utilities

### UI & Styling

- **Expo UI Components**: Pre-built accessible components
- **CSS Modules**: Component-scoped styling
- **Expo Linear Gradient**: Gradient effects
- **Expo Glass Effect**: Glassmorphism effects

### Data Validation & Schema

- **Zod 4**: Runtime type validation and schema definition

### Authentication & Security

- **Expo Secure Store**: Secure token storage
- **Token-based Authentication**: JWT-like token system

### Device Features

- **Expo Location**: GPS and location services
- **Expo Device**: Device information access
- **Expo Symbols**: Platform-specific icon library
- **Expo Status Bar**: Status bar management

### Development Tools

- **ESLint 9**: Code linting
- **Expo Lint**: Expo-specific linting
- **TypeScript**: Static type checking

## 📁 Project Structure

```
cerca/
├── app/                              # Expo Router app directory
│   ├── _layout.tsx                  # Root layout
│   ├── index.tsx                    # Entry point
│   ├── (app)/                       # Main app routes
│   │   ├── _layout.tsx              # App layout with navigation
│   │   ├── home.tsx                 # Home screen
│   │   ├── search.tsx               # Search listings
│   │   ├── bookings.tsx             # Bookings list
│   │   ├── publish.tsx              # Publish/create listings
│   │   ├── account.tsx              # User account
│   │   ├── booking/[id].tsx         # Booking detail
│   │   └── listing/[id].tsx         # Listing detail
│   └── (Auth)/                      # Auth routes
│       ├── _layout.tsx              # Auth layout
│       └── sign-in.tsx              # Sign in screen
│
├── src/                              # Source code
│   ├── api/                         # API integration
│   │   ├── client.ts                # API client implementation
│   │   ├── config.ts                # API configuration
│   │   ├── types.ts                 # API type definitions
│   │   ├── mock-backend.ts          # Mock backend for development
│   │   ├── cities.ts                # Cities data
│   │   └── index.ts                 # API exports
│   │
│   ├── components/                  # Reusable components
│   │   ├── ui-kit.tsx               # UI component library
│   │   ├── app-screen.tsx           # App screen wrapper
│   │   └── animated-icon.module.css # Icon animations
│   │
│   ├── domain/                      # Business logic & types
│   │   ├── booking.ts               # Booking types & interfaces
│   │   ├── listing.ts               # Listing types & interfaces
│   │   ├── actor.ts                 # User/Actor types
│   │   ├── review.ts                # Review types
│   │   ├── money.ts                 # Pricing types
│   │   └── demo-market.ts           # Demo data
│   │
│   ├── features/                    # Feature modules (screens)
│   │   ├── account/                 # Account management
│   │   ├── auth/                    # Authentication
│   │   ├── bookings/                # Bookings feature
│   │   ├── home/                    # Home screen
│   │   ├── listings/                # Listings feature
│   │   ├── navigation/              # Navigation layout
│   │   ├── publish/                 # Create/edit listings
│   │   └── search/                  # Search feature
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-color-scheme.ts      # Color scheme detection
│   │   ├── use-remote-data.ts       # Remote data fetching
│   │   └── use-theme.ts             # Theme management
│   │
│   ├── infrastructure/              # Infrastructure & utilities
│   │   ├── local-auth.ts            # Local authentication
│   │   ├── location.ts              # Location services
│   │   ├── schemas.ts               # Zod schemas for validation
│   │   └── storage.ts               # Local storage utilities
│   │
│   ├── presentation/                # Presentation layer
│   │   ├── components/              # Presentation components
│   │   ├── hooks/                   # Presentation hooks
│   │   └── providers/               # Context providers
│   │
│   ├── providers/                   # App providers
│   │   ├── app-provider.tsx         # Main app provider
│   │   └── auth-provider.tsx        # Auth context provider
│   │
│   ├── UI/                          # Shared UI exports
│   ├── constants/                   # App constants
│   │   └── theme.ts                 # Theme configuration
│   │
│   ├── i18n/                        # Internationalization
│   │   └── index.ts                 # i18n configuration
│   │
│   └── global.css                   # Global styles
│
├── assets/                           # Static assets
│   ├── images/                      # Image assets
│   │   └── tabIcons/                # Tab navigation icons
│   └── expo.icon/                   # App icon files
│
├── scripts/                          # Build & utility scripts
│   ├── reset-project.js             # Project reset script
│   └── qa-runtime.mjs               # QA utilities
│
├── app.json                         # Expo configuration
├── eas.json                         # EAS Build configuration
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.js                 # ESLint configuration
├── expo-env.d.ts                    # Expo environment types
└── README.md                        # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Git**: For version control ([Download](https://git-scm.com/))

### Platform-Specific Requirements

**For iOS Development:**

- macOS with Xcode 14+ installed
- iOS simulator or physical device

**For Android Development:**

- Android Studio with Android SDK
- Android emulator or physical device
- JDK 11 or higher

**For Web Development:**

- Modern web browser (Chrome, Firefox, Safari, or Edge)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cerca
```

### 2. Install Dependencies

```bash
npm install
```

This command installs all required dependencies listed in `package.json`.

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.your-domain.com
EXPO_PUBLIC_API_VERSION=v1
```

Refer to `src/api/config.ts` for available configuration options.

## 🎮 Getting Started

### Start Development Server

```bash
npm run dev
# or
npx expo start
```

This launches the Expo development server. You'll see options to:

- **Press 'i'** - Open in iOS Simulator
- **Press 'a'** - Open in Android Emulator
- **Press 'w'** - Open in web browser
- **Press 'j'** - Open in Expo Go app

### Using Expo Go (Quickest Way)

1. Install [Expo Go](https://expo.dev/go) on your physical device
2. Run `npm run dev`
3. Scan the QR code with your device camera
4. The app opens automatically in Expo Go

### Development with Expo CLI

The project uses [file-based routing](https://docs.expo.dev/router/introduction/) with Expo Router. Screens are defined in the `app/` directory using nested folders and `_layout.tsx` files.

## 🔨 Development

### Available Scripts

```bash
# Start development server
npm run dev
npm run start

# Run on specific platform
npm run android          # Run on Android emulator
npm run ios             # Run on iOS simulator
npm run web             # Run in web browser

# Code quality
npm run lint            # Run ESLint
npm run reset-project   # Reset to blank project state

# Build for production
npm run build
```

### Project Setup Steps

#### Initial Setup

When starting a new development session:

```bash
npm install
npm run dev
```

#### Using the Mock Backend

The application includes a mock backend for development:

- Located in `src/api/mock-backend.ts`
- Used automatically when `USE_MOCK_BACKEND=true`
- Provides realistic demo data for all API endpoints

#### Hot Reload

Expo provides fast refresh during development:

- Edit any file in the `src/` or `app/` directories
- Changes reload automatically on your device/simulator
- Your app state is preserved (in most cases)

### Architecture Highlights

**Layered Architecture:**

```
app/                    → Routes & Navigation
├── features/          → UI screens & feature logic
├── presentation/      → Context providers & presentation hooks
├── domain/            → Business logic & types
├── api/               → Backend communication
└── infrastructure/    → Low-level utilities
```

**Key Patterns:**

- **Domain-Driven Design**: Core business logic in `domain/` folder
- **Feature-Based Organization**: Each feature (auth, bookings, etc.) is self-contained
- **Hooks for Logic Reuse**: Custom hooks in `hooks/` for shared logic
- **Provider Pattern**: Context providers for global state (auth, theme)
- **Type Safety**: Full TypeScript coverage with Zod validation

### Code Style & Linting

```bash
# Run ESLint to check for issues
npm run lint

# Fix auto-fixable issues
npx eslint . --fix
```

The project uses ESLint with Expo configuration to maintain code quality.

## 🏗️ Building for Production

### EAS Build (Recommended)

Expo Application Services (EAS) handles cloud builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for all platforms
eas build --platform all
```

Configuration is in `eas.json`.

### Local Build

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

### Web Build

```bash
npm run web
```

The web build outputs to a `web-build/` directory with static files.

## 🗂️ Project Architecture

### API Layer (`src/api/`)

The API client manages all backend communication:

```typescript
// Example: Fetching bookings
const response = await apiClient.get("/bookings", {
  token: authToken,
  signal: abortSignal,
});
```

**Features:**

- Error handling with custom `ApiError` class
- Request/response validation with Zod schemas
- Mock backend support for development
- Token-based authentication

### Domain Layer (`src/domain/`)

Type definitions and business logic:

```typescript
// Core types
type BookingStatus =
  | "requested"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";
interface Booking {
  id: string;
  listingId: string;
  customerId: string;
  status: BookingStatus;
}
```

### Feature Modules (`src/features/`)

Self-contained feature implementations:

- `home/` - Dashboard and discovery
- `search/` - Search and filtering
- `bookings/` - Booking management
- `listings/` - Listing management and publishing
- `account/` - User profile
- `auth/` - Authentication flows

Each feature includes:

- Screen component(s)
- Feature-specific hooks
- Integration with providers

### Presentation Layer (`src/presentation/`)

Shared presentation logic and contexts:

- `providers/` - React Context providers (auth, theme)
- `components/` - Presentation-specific components (Can, etc.)
- `hooks/` - Presentation-specific hooks (useAuth)

### Infrastructure Layer (`src/infrastructure/`)

Low-level utilities:

- `storage.ts` - Local storage abstraction
- `local-auth.ts` - Authentication utilities
- `location.ts` - Geolocation services
- `schemas.ts` - Zod validation schemas

## 🔐 Authentication

The application uses token-based authentication:

1. **Sign In**: User credentials sent to `/auth/signin`
2. **Token Storage**: Access token stored in Expo Secure Store
3. **API Requests**: Token included in `Authorization` header
4. **Sign Out**: Token removed from storage

**Auth Provider** (`src/providers/auth-provider.tsx`):

- Manages authentication state
- Handles token persistence
- Provides auth context to app

## 🎨 Theming

The application supports light and dark modes:

```typescript
// Theme configuration in src/constants/theme.ts
const theme = {
  colors: {
    /* ... */
  },
  spacing: {
    /* ... */
  },
  typography: {
    /* ... */
  },
};
```

Use the `useTheme()` hook to access theme values:

```typescript
const theme = useTheme();
const colors = theme.colors;
```

## 📱 State Management

**Server State**: Managed with TanStack React Query

- Caching and synchronization
- DevTools for debugging (`useQueryDevtools()`)

**Client State**: React Context Providers

- Authentication (`AuthProvider`)
- Theme (`useTheme()`)

**Local State**: React `useState` hook

- Component-level state

## 🌍 Internationalization (i18n)

The application includes i18n support for multiple languages:

```typescript
import { t } from "@/i18n";

const message = t("common.welcome"); // Access translations
```

Configuration in `src/i18n/index.ts`.

## 🐛 Debugging & Development Tools

### Expo DevTools

Built-in when running with `npm run dev`:

- Performance profiler
- Network inspector
- Console logs

### React Query DevTools

Included in development builds to monitor server state:

```typescript
import { useQueryDevtools } from "@tanstack/react-query-devtools";
```

### Network Requests

Mock backend can simulate:

- Network delays
- Error responses
- Different data scenarios

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Code Style**

   ```bash
   npm run lint
   npx eslint . --fix
   ```

3. **Add Tests**
   - Write tests for new features
   - Ensure existing tests pass

4. **Commit with Clear Messages**

   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

**Commit Message Format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Build process, dependencies

## 📚 Learn More

### Expo Documentation

- [Expo Docs](https://docs.expo.dev/) - Complete guide
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [Expo Config](https://docs.expo.dev/versions/latest/config/app/) - App configuration

### React Native

- [React Native Docs](https://reactnative.dev/)
- [React Native API Reference](https://reactnative.dev/docs/api-and-interfaces)

### React & TypeScript

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### TanStack React Query

- [React Query Docs](https://tanstack.com/query/latest/)
- [React Query Tutorial](https://tanstack.com/query/latest/docs/react/overview)

### Zod Validation

- [Zod Documentation](https://zod.dev/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React Native, Expo, and TypeScript**

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
