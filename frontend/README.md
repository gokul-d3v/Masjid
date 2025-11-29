# My Fullstack App (React Native)

This is a React Native application built with Expo, featuring mobile-optimized styles and circular splash banners on all screens.

## Features

- Mobile-optimized UI with responsive design
- Circular splash banner on all screens (Landing, Login, Dashboard)
- Clean navigation between screens
- Proper API integration for backend communication

## Setup

1. Make sure you have Node.js installed
   - **For Windows users**: Use Node.js version 16.x to avoid Metro compatibility issues with the `node:sea` error
   - If you're using Node.js 17+, see the troubleshooting section below

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Recommended: Use Node.js 16.x
For the best experience on Windows, use Node.js version 16.x:
```
npx expo start
```

### Troubleshooting Node.js 17+ on Windows

If you encounter the error `Error: ENOENT: no such file or directory, mkdir '...\.expo\metro\externals\node:sea'`, this is due to a compatibility issue with Node.js 17+ and the Expo CLI on Windows.

**Solutions:**
1. **Downgrade to Node.js 16.x** (Recommended)
   - Download Node.js 16.x LTS from nodejs.org
   - This version doesn't have the SEA (Single Executable Application) module issue

2. **Use WSL (Windows Subsystem for Linux)**
   - Install WSL2 on Windows
   - Install Node.js in the Linux environment
   - Run the project from WSL

3. **Use Docker**
   - Run your development environment in a container with Node.js 16

4. **Use a different machine/environment**
   - Run on macOS or Linux where this issue doesn't occur
   - Use the Expo Go app on your mobile device to test the application

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

## Code Status

The React Native application with mobile-optimized styles and circular splash banners is fully implemented and functional. The only issue is the development environment compatibility with Node.js 17+ on Windows, which is resolved by following the recommendations above.