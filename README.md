# BasuraSmart

A comprehensive waste management system with multiple deployment options including React Native mobile app, web applications, and multi-role dashboards.

## Overview

BasuraSmart is designed for **Barangay Obrero, Butuan City** to help communities manage their waste collection more efficiently. The system provides multiple interfaces for residents, collectors, and administrators, making it easier to track pickup schedules, manage routes, handle payments, and ensure proper waste segregation.

## 🚀 Available Versions

### 1. **React Native Mobile App** (Original)
- **Location:** `./` (root directory)
- **Technology:** Expo SDK 52, React Native, TypeScript
- **Features:** Interactive maps, phone authentication, resident/collector roles

### 2. **Multi-Screen Web Application**
- **Location:** `./multi-screen-app/`
- **Technology:** HTML, CSS, JavaScript
- **Features:** Desktop-style dashboards, full navigation, role-based access

### 3. **Mobile-First Web Application**
- **Location:** `./mobile-app/`
- **Technology:** HTML, CSS, JavaScript (Mobile-first)
- **Features:** Phone-sized interface, touch interactions, mobile UI patterns

### 4. **Multi-Role Web System**
- **Location:** `./multi-role-system/`
- **Technology:** HTML, CSS, JavaScript (Role-based)
- **Features:** Resident/Collector/Admin dashboards, access control

### 5. **Mobile Multi-Role System** ⭐ **RECOMMENDED**
- **Location:** `./mobile-multi-role/`
- **Technology:** HTML, CSS, JavaScript (Mobile + Multi-role)
- **Features:** Phone-sized, role-based, complete mobile experience

### 6. **Backend API**
- **Location:** `./backend/`
- **Technology:** Node.js, Express, TypeScript, PostgreSQL
- **Features:** RESTful API, authentication, database management

### 7. **Login Page Components**
- **Location:** `./login-page/`
- **Technology:** React, Tailwind CSS, Vite
- **Features:** Standalone login, validation, modern UI

## Features

### For Residents
- View monthly pickup schedule calendar
- Get reminders for upcoming waste collection days
- Color-coded waste type indicators (biodegradable, non-biodegradable, recyclables)
- Access to waste segregation guidelines

### For Collectors
- View assigned pickup routes with all stops
- Track completed and pending stops
- Mark individual pickups as complete
- See route progress in real-time

### Authentication
- Phone-based registration and login
- OTP verification for account security
- Secure session management with Zustand

### Interactive Map
- Powered by **OpenStreetMap** (no API key required)
- Custom markers showing stop status (completed/pending)
- Route polylines connecting stops in a circular pattern
- Pan and zoom functionality
- Works offline-ready base tiles

## Tech Stack

- **Framework:** Expo SDK 52 with Expo Router
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** React Native StyleSheet
- **Navigation:** Expo Router (file-based routing)
- **Maps:** React Native WebView with Leaflet.js + OpenStreetMap
- **UI Components:** Custom components with React Native SVG

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
# Install dependencies
npm install

# Generate native folders (required for WebView)
npx expo prebuild

# Start the development server
npm start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

### Note on Native Build

This project uses `react-native-webview` for the interactive map feature. Running `npx expo prebuild` is required to generate the native Android/iOS folders before building.

## 🚀 Quick Start

### Choose Your Version:

#### **For Mobile Experience (Recommended):**
```bash
cd mobile-multi-role
open index.html  # Double-click or open in browser
```

#### **For Desktop Experience:**
```bash
cd multi-role-system
open index.html
```

#### **For React Native Development:**
```bash
npm install
npx expo prebuild
npm start
```

#### **For Backend API:**
```bash
cd backend
npm install
npm run dev
```

## 🔐 Demo Credentials

### Mobile Multi-Role System:
| Role | Email | Password |
|------|-------|----------|
| Resident | resident@demo.com | resident123 |
| Collector | collector@demo.com | collector123 |
| Admin | admin@demo.com | admin123 |

### React Native App:
| User Type | Username | Password |
|-----------|----------|----------|
| Resident | resident | demo123 |
| Collector | collector | demo123 |

### OTP Code
Use `123456` for OTP verification during React Native registration.

## Project Structure

```
basurasmart/
├── app/                    # Expo Router screens
│   ├── (auth)/           # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── otp.tsx
│   │   └── details.tsx
│   ├── (resident)/       # Resident screens
│   │   └── home.tsx
│   ├── (collector)/      # Collector screens
│   │   └── route.tsx
│   ├── _layout.tsx       # Root layout
│   └── index.tsx         # Landing page
├── components/           # Reusable components
│   ├── ui/              # UI components (Button, Card, Input, etc.)
│   ├── illustrations/   # SVG illustrations
│   └── map/             # Map components (RouteMap with OSM)
├── lib/                  # Utilities and logic
│   ├── api.ts           # API functions (mock)
│   ├── constants.ts     # App constants, colors, MAP_CONFIG
│   ├── store.ts         # Zustand stores
│   ├── styles.ts        # Shared styles
│   └── types.ts         # TypeScript types
└── android/             # Native Android folder (generated by prebuild)
```

## Map Configuration

The map is configured for **Barangay Obrero, Butuan City** with coordinates:

- **Center:** `8.962216, 125.535944`
- **Zoom Level:** 15
- **Provider:** OpenStreetMap
- **Route Pattern:** Circular stops encircling the center point

To adjust the map region or stops, edit `lib/constants.ts`:

```typescript
export const MAP_CONFIG = {
  defaultRegion: {
    latitude: 8.962216,
    longitude: 125.535944,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  },
  zoomLevel: 15,
};
```
