# Tic-Tac-Toe Backend API

Node.js/Express backend for Tic-Tac-Toe game with authentication, game management, and statistics.

## Features

- JWT authentication with user registration/login
- Game management (start, move, state tracking)
- Statistics tracking (wins, losses, draws)
- Python AI engine integration
- SQLite database with security features

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env

# Start server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Game Management
- `POST /api/game/start` - Start new game
- `POST /api/game/move` - Make move
- `GET /api/game/state/:gameId` - Get game state

### Statistics
- `GET /api/stats/my-stats` - User statistics
- `GET /api/stats/recent-games` - Recent games
- `GET /api/stats/leaderboard` - Global leaderboard

## Environment Variables

```env
PORT=3001
JWT_SECRET=your-secret-key
PYTHON_ENGINE_URL=http://localhost:8000
```

## Testing

```bash
npm test
```

## Integration

Coordinates with Python AI engine and provides APIs for React web and React Native mobile apps. 