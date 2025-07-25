# Tic-Tac-Toe Backend API

A Node.js/Express backend server that manages user authentication, game sessions, and statistics for the Tic-Tac-Toe game. This backend coordinates with the Python Tic-Tac-Toe engine API to provide intelligent gameplay.

## Project Structure

```
nodejs-backend/
├── src/
│   ├── server.js              # Main server file
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── game.js            # Game management routes
│   │   └── stats.js           # Statistics routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   └── database.js        # Database initialization and connection
│   └── services/
│       └── pythonEngine.js    # Python engine API integration
├── data/                      # SQLite database files
├── tests/                     # Test files
├── docs/                      # Documentation
├── package.json               # Node.js dependencies
├── env.example               # Environment variables template
└── README.md                 # This file
```

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Game Management**: Start games, make moves, and track game state
- **Statistics Tracking**: Track wins, losses, draws, and performance metrics
- **Python Engine Integration**: Seamless communication with the Python Tic-Tac-Toe AI engine
- **Security**: Rate limiting, input validation, and secure password hashing
- **Database**: SQLite database for user data and game statistics

## API Endpoints

### Authentication (`/api/auth`)
- **POST** `/register` - Register a new user
- **POST** `/login` - Login user
- **GET** `/verify` - Verify JWT token

### Game Management (`/api/game`)
- **POST** `/start` - Start a new game
- **POST** `/move` - Make a move
- **GET** `/state/:gameId` - Get current game state

### Statistics (`/api/stats`)
- **GET** `/my-stats` - Get user's statistics
- **GET** `/recent-games` - Get user's recent games
- **GET** `/leaderboard` - Get global leaderboard
- **GET** `/detailed-stats` - Get detailed statistics

## Setup Instructions

### Prerequisites
- Node.js 16.0+
- npm or yarn
- Python engine running on port 8000

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd nodejs-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the API:**
   - API Base URL: `http://localhost:3001`
   - Health Check: `http://localhost:3001/health`

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Python Engine Configuration
PYTHON_ENGINE_URL=http://localhost:8000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

## API Usage Examples

### User Registration
```bash
curl -X POST "http://localhost:3001/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
```

### User Login
```bash
curl -X POST "http://localhost:3001/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
```

### Start a Game
```bash
curl -X POST "http://localhost:3001/api/game/start" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "startedBy": "user"
     }'
```

### Make a Move
```bash
curl -X POST "http://localhost:3001/api/game/move" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "board": [[1, 0, 0], [0, 0, 0], [0, 0, 0]],
       "currentPlayer": "X",
       "gameId": 1,
       "startedBy": "user"
     }'
```

### Get Statistics
```bash
curl -X GET "http://localhost:3001/api/stats/my-stats" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Games Table
```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  game_state TEXT NOT NULL,
  winner TEXT,
  is_draw BOOLEAN DEFAULT FALSE,
  started_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Statistics Table
```sql
CREATE TABLE statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Board Representation

The backend uses the following board representation:
- `0` = Empty cell
- `1` = X player
- `2` = O player

Example:
```json
{
  "board": [
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 0]
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error type",
  "message": "Error description",
  "details": [] // Optional validation details
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware

## Development

### Running Tests
```bash
npm test
npm run test:watch
```

### Code Style
The project follows standard JavaScript/Node.js conventions. Consider using ESLint and Prettier for code formatting.

## Integration with Python Engine

This backend communicates with the Python Tic-Tac-Toe engine API to:
1. Get intelligent moves for the computer player
2. Check game state and determine winners
3. Reset games to initial state

The Python engine runs as a separate service on port 8000.

## Integration with Frontends

This backend provides APIs for:
- **React Web App**: Web-based Tic-Tac-Toe game
- **React Native Mobile App**: Mobile Tic-Tac-Toe game

Both frontends use the same API endpoints for consistent functionality.

## License

This project is part of the Tic-Tac-Toe Full Stack Case Study. 