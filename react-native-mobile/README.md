# Tic-Tac-Toe Mobile App

A React Native mobile application for playing Tic-Tac-Toe against an AI opponent with user authentication, game statistics, and real-time gameplay. This app provides the same functionality as the web version but optimized for mobile devices.

## Project Structure

```
react-native-mobile/
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.js   # Login screen
│   │   ├── RegisterScreen.js # Registration screen
│   │   ├── GameScreen.js    # Game interface
│   │   ├── StatisticsScreen.js # Statistics screen
│   │   └── LoadingScreen.js # Loading screen
│   ├── services/            # API services
│   │   ├── authService.js   # Authentication API
│   │   ├── gameService.js   # Game API
│   │   └── statsService.js  # Statistics API
│   ├── store/               # Redux store
│   │   ├── index.js         # Store configuration
│   │   └── slices/          # Redux slices
│   │       ├── authSlice.js # Authentication state
│   │       ├── gameSlice.js # Game state
│   │       └── statsSlice.js # Statistics state
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── App.js               # Main app component
├── assets/                  # Images, fonts, etc.
├── tests/                   # Test files
├── docs/                    # Documentation
├── package.json             # Dependencies and scripts
├── index.js                 # App entry point
└── README.md               # This file
```

## Features

- **Cross-Platform**: Works on both iOS and Android
- **User Authentication**: Secure login and registration with JWT tokens
- **Game Interface**: Touch-optimized Tic-Tac-Toe board with AI opponent
- **Game Options**: Choose who starts the game (user or computer)
- **Real-time Gameplay**: Live updates and move validation
- **Statistics Tracking**: View personal game statistics and leaderboard
- **Offline Support**: Token persistence with AsyncStorage
- **Modern UI**: Native mobile interface with smooth animations
- **State Management**: Redux for centralized state management
- **Error Handling**: Comprehensive error handling with toast notifications

## Prerequisites

- Node.js 16.0+
- React Native CLI or Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Backend API running on port 3001
- Python engine running on port 8000

## Setup Instructions

### 1. Install Dependencies

```bash
cd react-native-mobile
npm install
```

### 2. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:3001/api
```

### 4. Start the Development Server

```bash
# Start Metro bundler
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android
```

### 5. Build for Production

```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## Platform-Specific Setup

### Android

1. **Install Android Studio**
2. **Set up Android SDK**
3. **Configure environment variables**
4. **Create/start Android emulator**

### iOS (macOS only)

1. **Install Xcode**
2. **Install CocoaPods**
3. **Open iOS project in Xcode**
4. **Configure signing and capabilities**

## Usage

### Authentication

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Token Persistence**: Authentication tokens are stored securely

### Gameplay

1. **Start Game**: Choose who starts (you or the computer)
2. **Make Moves**: Tap on empty cells to place your mark
3. **AI Opponent**: The computer will respond with intelligent moves
4. **Game End**: View the result and start a new game

### Statistics

- **Personal Stats**: View your wins, losses, draws, and win percentage
- **Recent Games**: See your last 10 games with results
- **Leaderboard**: Compare your performance with other players

## API Integration

The app communicates with the Node.js backend API:

- **Authentication**: `/api/auth/*` endpoints
- **Game Management**: `/api/game/*` endpoints  
- **Statistics**: `/api/stats/*` endpoints

## State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: null,
    token: string,
    isAuthenticated: boolean,
    loading: boolean,
    error: string
  },
  game: {
    board: array,
    currentPlayer: string,
    gameOver: boolean,
    winner: string,
    isDraw: boolean,
    gameId: number,
    startedBy: string,
    loading: boolean,
    error: string
  },
  stats: {
    userStats: object,
    recentGames: array,
    leaderboard: array,
    loading: boolean,
    error: string
  }
}
```

## Navigation

The app uses React Navigation with:

- **Stack Navigator**: For authentication flow
- **Tab Navigator**: For main app screens (Game, Statistics)

## Component Architecture

### Screens
- **LoginScreen**: User authentication form
- **RegisterScreen**: User registration form
- **GameScreen**: Main game interface with board and controls
- **StatisticsScreen**: User statistics and leaderboard display
- **LoadingScreen**: Loading indicator for async operations

### Services
- **authService**: Authentication API calls with AsyncStorage
- **gameService**: Game management API calls
- **statsService**: Statistics API calls

## Mobile-Specific Features

### Touch Optimization
- **Large touch targets**: Easy-to-tap buttons and cells
- **Haptic feedback**: Tactile response for interactions
- **Gesture support**: Swipe gestures for navigation

### Performance
- **Native animations**: Smooth 60fps animations
- **Optimized rendering**: Efficient component updates
- **Memory management**: Proper cleanup and optimization

### Offline Support
- **Token persistence**: JWT tokens stored in AsyncStorage
- **Offline detection**: Network status monitoring
- **Data caching**: Local storage for better UX

## Styling

The app uses:
- **React Native StyleSheet**: Platform-optimized styles
- **Responsive Design**: Adapts to different screen sizes
- **Native Components**: Platform-specific UI elements
- **Custom Components**: Reusable styled components

## Error Handling

- **API Errors**: Automatic error handling with toast notifications
- **Authentication**: Token expiration handling
- **Network**: Offline state handling
- **Validation**: Form validation with user feedback

## Development

### Available Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run clean      # Clean build files
```

### Code Style

- **ESLint**: Code linting with React Native rules
- **Prettier**: Code formatting
- **React Hooks**: Functional components with hooks
- **Redux Toolkit**: Modern Redux with RTK

## Testing

```bash
npm test           # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage
```

## Deployment

### Android

1. **Generate signed APK/AAB**
2. **Upload to Google Play Console**
3. **Configure release settings**

### iOS

1. **Archive app in Xcode**
2. **Upload to App Store Connect**
3. **Configure release settings**

## Performance Optimization

- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Compressed assets
- **Bundle Optimization**: Minified production builds

## Security

- **JWT Tokens**: Secure authentication tokens
- **HTTPS**: Secure communication in production
- **Input Validation**: Client-side and server-side validation
- **Secure Storage**: AsyncStorage for sensitive data

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npm start -- --reset-cache`
2. **iOS build errors**: Clean build folder and reinstall pods
3. **Android build errors**: Clean project and rebuild
4. **API connection**: Ensure backend is running and accessible

### Debug Mode

```bash
# Enable debug mode
REACT_APP_DEBUG=true npm start
```

## Platform Differences

### iOS
- **Swipe gestures**: Native iOS navigation patterns
- **Haptic feedback**: Taptic engine integration
- **Status bar**: Light content style

### Android
- **Material Design**: Android-specific UI patterns
- **Back button**: Hardware back button support
- **Status bar**: Dark content style

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Tic-Tac-Toe Full Stack Case Study. 