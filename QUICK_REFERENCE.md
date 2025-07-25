# Quick Reference Card - Tic-Tac-Toe Full Stack

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │  React Native   │    │   Python AI     │
│     App         │    │      App        │    │    Engine       │
│   (Port 3000)   │    │   (Mobile)      │    │   (Port 8000)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Node.js Backend       │
                    │      (Port 3001)          │
                    │  ┌─────────────────────┐  │
                    │  │   SQLite Database   │  │
                    │  └─────────────────────┘  │
                    └───────────────────────────┘
```

## 🔧 Key Technical Details

### Python AI Engine
- **Framework**: FastAPI
- **AI Algorithm**: Minimax with Alpha-Beta Pruning
- **Board Representation**: 3x3 array (0=empty, -1=X, 1=O)
- **Difficulty Levels**: Easy (30% optimal), Medium (60%), Hard (90%)

### Node.js Backend
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT + bcrypt (12 salt rounds)
- **Rate Limiting**: 100 requests per 15 minutes

### React Web App
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Styled Components
- **Testing**: React Testing Library

### React Native App
- **Framework**: Expo
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit (shared with web)

## 📊 Database Schema

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at DATETIME
);

-- Games
CREATE TABLE games (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  game_state TEXT,
  winner TEXT,
  is_draw BOOLEAN,
  started_by TEXT
);

-- Statistics
CREATE TABLE statistics (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0
);
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Game Management
- `POST /api/game/start` - Start new game
- `POST /api/game/move` - Make move
- `GET /api/game/state/:gameId` - Get game state

### Statistics
- `GET /api/stats/my-stats` - User statistics
- `GET /api/stats/recent-games` - Recent games
- `GET /api/stats/leaderboard` - Global leaderboard

### AI Engine
- `POST /make-move` - Get AI move
- `POST /check-game-state` - Check game status
- `POST /reset-game` - Reset game board

## 🧪 Testing Coverage

- **Python Engine**: 35 tests (API + AI logic)
- **Node.js Backend**: 24 tests (Auth + Game routes)
- **React Web**: Component + integration tests
- **React Native**: No tests yet (expected)

## 🔒 Security Features

- JWT token authentication
- bcrypt password hashing
- Input validation
- Rate limiting
- CORS configuration
- Security headers (Helmet)

## 🚀 Deployment Strategy

- **Python Engine**: Docker container
- **Node.js Backend**: Containerized deployment
- **React Web**: Static hosting (Netlify/Vercel)
- **React Native**: App store distribution
- **Database**: SQLite (dev) → PostgreSQL (prod)

## 💡 Key Algorithms

### Minimax with Alpha-Beta Pruning
```python
def minimax(board, depth, is_maximizing, alpha, beta):
    if game_over(board):
        return evaluate(board)
    
    if is_maximizing:
        max_eval = float('-inf')
        for move in available_moves(board):
            eval = minimax(make_move(board, move), depth-1, False, alpha, beta)
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break  # Alpha-beta pruning
        return max_eval
    else:
        # Similar for minimizing player
```

## 🎯 Project Statistics

- **Total Lines of Code**: ~5,000+ lines
- **Test Coverage**: 59 tests across backend components
- **API Endpoints**: 12 total endpoints
- **Components**: 15+ React components
- **Database Tables**: 3 tables
- **Difficulty Levels**: 3 AI difficulty settings

## 🔄 State Management

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
    loading: boolean
  },
  stats: {
    userStats: object,
    recentGames: array,
    leaderboard: array,
    loading: boolean
  }
}
```

## 🐛 Error Handling

- **Error Boundaries**: React error boundaries
- **Toast Notifications**: User feedback
- **API Error Responses**: Standardized format
- **Graceful Degradation**: Fallback UI
- **Logging**: Comprehensive error logging

## 📈 Performance Optimizations

- **AI Algorithm**: Alpha-beta pruning
- **Database**: Indexed queries
- **Frontend**: Code splitting
- **Caching**: JWT tokens
- **API Design**: Minimal payloads

## 🎯 Key Achievements

1. **Full-Stack Implementation**: Complete application across 4 technologies
2. **AI Intelligence**: Sophisticated game AI with difficulty levels
3. **Cross-Platform**: Web and mobile applications
4. **Security**: Proper authentication and data protection
5. **Testing**: Comprehensive test coverage
6. **Modern Architecture**: Microservices with clear separation
7. **User Experience**: Intuitive interfaces with real-time feedback
8. **Performance**: Optimized algorithms and efficient APIs

## 🚨 Common Questions & Quick Answers

**Q: Why this tech stack?**
A: Python for AI (NumPy), Node.js for APIs, React for UI, React Native for mobile

**Q: How does the AI work?**
A: Minimax algorithm with alpha-beta pruning, 3 difficulty levels

**Q: How do you handle authentication?**
A: JWT tokens with bcrypt password hashing

**Q: What's your testing approach?**
A: 59 tests across backend, component testing for frontend

**Q: How would you scale this?**
A: Microservices architecture, horizontal scaling, load balancing

**Q: What challenges did you face?**
A: AI algorithm implementation, state management, testing setup, authentication

**Q: What would you improve?**
A: Multiplayer support, machine learning AI, advanced analytics, push notifications 