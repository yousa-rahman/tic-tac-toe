# Tic-Tac-Toe Mobile App

React Native mobile application for playing Tic-Tac-Toe against AI with authentication and statistics.

## Features

- User authentication with JWT tokens
- Interactive Tic-Tac-Toe game with AI opponent
- Game statistics and leaderboard
- Cross-platform (iOS/Android)
- Redux state management

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npm start
```

## Environment

Create `.env` file:
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

## Usage

1. **Register/Login** - Create account or sign in
2. **Start Game** - Choose who starts (user or computer)
3. **Play** - Tap cells to make moves against AI
4. **View Stats** - Check your performance and leaderboard

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests

## Integration

Connects to Node.js backend API for authentication, game management, and statistics. 