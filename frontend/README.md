# My Fullstack App (React Native)

This is a React Native application built with Expo, featuring mobile-optimized styles and circular splash banners on all screens.

## Features

- Mobile-optimized UI with responsive design
- Circular splash banner on all screens (Landing, Login, Dashboard)
- Clean navigation between screens
- Proper API integration for backend communication

## Setup

1. Make sure you have Node.js installed (preferably version 16.x to avoid Metro compatibility issues)

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

**Important**: Due to a compatibility issue with Node.js 17+, you may encounter an error related to Metro. If this happens, please use one of these approaches:

### Solution 1: Use Node.js version 16.x
Use Node.js version 16.x which doesn't have the Metro compatibility issues:
```
npx expo start
```

### Solution 2: Use Expo Go app
After running `npx expo start`, scan the QR code with the Expo Go app on your mobile device.

### Solution 3: Run on specific platforms
```
npm run android  # For Android emulator/device
npm run ios      # For iOS simulator (macOS only)
npm run web      # For web version
```

## Project Structure

- `App.js`: Main navigation setup
- `src/screens/`: LandingScreen, LoginScreen, DashboardScreen
- `src/services/`: API and authentication services
- `src/store/`: Zustand store for auth state
- `assets/`: Contains Splash.png and other assets

## Mobile Optimizations

- Responsive circular splash banners that adapt to screen size
- Touch-friendly UI elements with appropriate sizing
- Proper keyboard handling for login screen
- Refresh control for dashboard
- Optimized spacing and touch targets for mobile

## API Integration

The app is configured to connect to a local backend server at `http://10.0.2.2:5000` (for Android emulator) or `http://localhost:5000` (for iOS simulator).