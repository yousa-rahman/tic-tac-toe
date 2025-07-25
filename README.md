# Tic-Tac-Toe Full Stack Project

A comprehensive full-stack Tic-Tac-Toe game implementation with AI opponent, user authentication, and statistics tracking. This project demonstrates modern web and mobile development practices across multiple technology stacks.

## 🏗️ Project Architecture

This project is structured as four separate, independent applications following industrial best practices:

```
tic-tac-toe-engine/
├── python-engine/           # Python FastAPI backend with AI engine
├── nodejs-backend/          # Node.js Express backend with authentication
├── react-web-app/           # React web frontend
├── react-native-mobile/     # React Native mobile app
├── engine.py               # Original Tic-Tac-Toe engine (reference)
├── vx.npy                  # AI value function for X player (reference)
├── vo.npy                  # AI value function for O player (reference)
└── README.md               # This file
```

## 🎯 Project Overview

### Problem 1: Python Engine API
- **Technology**: Python + FastAPI
- **Purpose**: Expose the Tic-Tac-Toe AI engine as a REST API
- **Features**: Stateless design, move calculation, game state validation

### Problem 2: Node.js Backend
- **Technology**: Node.js + Express + SQLite
- **Purpose**: User authentication, game session management, statistics
- **Features**: JWT authentication, database persistence, API orchestration

### Problem 3: React Web App
- **Technology**: React + Redux + React Router
- **Purpose**: Web-based game interface
- **Features**: Responsive design, real-time gameplay, statistics dashboard

### Problem 4: React Native Mobile App
- **Technology**: React Native + Redux + React Navigation
- **Purpose**: Mobile game interface
- **Features**: Cross-platform, touch-optimized, offline support

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16.0+
- npm or yarn
- React Native CLI (for mobile app)

### 1. Start Python Engine API

```bash
cd python-engine
pip install -r requirements.txt
python src/api.py
```

**Access**: http://localhost:8000
**Docs**: http://localhost:8000/docs

### 2. Start Node.js Backend

```bash
cd nodejs-backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

**Access**: http://localhost:3001
**Health Check**: http://localhost:3001/health

### 3. Start React Web App

```bash
cd react-web-app
npm install
npm start
```

**Access**: http://localhost:3000

### 4. Start React Native Mobile App

```bash
cd react-native-mobile
npm install
# For iOS (macOS only)
cd ios && pod install && cd ..
npm run ios
# For Android
npm run android
```

## 📋 Detailed Setup Instructions

### Python Engine Setup

```bash
cd python-engine
pip install -r requirements.txt
python src/api.py
```

**Features**:
- REST API endpoints for game operations
- Stateless AI engine integration
- Input validation and error handling
- Interactive API documentation

### Node.js Backend Setup

```bash
cd nodejs-backend
npm install
cp env.example .env
# Configure environment variables
npm run dev
```

**Environment Variables**:
```env
PORT=3001
JWT_SECRET=your-secret-key
PYTHON_ENGINE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

**Features**:
- User authentication with JWT
- Game session management
- Statistics tracking
- Database persistence (SQLite)
- Security middleware

### React Web App Setup

```bash
cd react-web-app
npm install
npm start
```

**Features**:
- Modern React with hooks
- Redux state management
- Responsive design
- Real-time game updates
- Statistics dashboard

### React Native Mobile App Setup

```bash
cd react-native-mobile
npm install
# iOS (macOS only)
cd ios && pod install && cd ..
npm run ios
# Android
npm run android
```

**Features**:
- Cross-platform mobile app
- Touch-optimized interface
- Offline token persistence
- Native navigation

## 🔧 API Endpoints

### Python Engine API (Port 8000)
- `POST /make-move` - Calculate next AI move
- `POST /check-game-state` - Validate game state
- `POST /reset-game` - Reset to initial state
- `GET /health` - Health check

### Node.js Backend API (Port 3001)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `POST /api/game/start` - Start new game
- `POST /api/game/move` - Make game move
- `GET /api/stats/my-stats` - User statistics
- `GET /api/stats/leaderboard` - Global leaderboard

## 🎮 Game Features

### Core Gameplay
- **AI Opponent**: Intelligent moves using value function
- **Game Options**: Choose who starts (user or computer)
- **Real-time Updates**: Live board updates and move validation
- **Win Detection**: Automatic win/loss/draw detection

### User Features
- **Authentication**: Secure login and registration
- **Statistics**: Personal win/loss/draw tracking
- **Leaderboard**: Global player rankings
- **Game History**: Recent games with results

### Technical Features
- **Stateless Design**: No server-side game state
- **JWT Authentication**: Secure token-based auth
- **Database Persistence**: User data and statistics
- **Error Handling**: Comprehensive error management
- **Input Validation**: Client and server-side validation

## 🏛️ Architecture Patterns

### Microservices Architecture
- **Python Engine**: Dedicated AI service
- **Node.js Backend**: Business logic and data management
- **Frontend Apps**: User interface and state management

### State Management
- **Redux Toolkit**: Centralized state management
- **Async Thunks**: API call handling
- **Persistent Storage**: Token and user data persistence

### Security
- **JWT Tokens**: Secure authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation
- **Rate Limiting**: API protection
- **CORS**: Cross-origin resource sharing

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  total_games INTEGER DEFAULT 0
);
```

## 🧪 Testing

### Python Engine
```bash
cd python-engine
python -m pytest tests/
```

### Node.js Backend
```bash
cd nodejs-backend
npm test
```

### React Web App
```bash
cd react-web-app
npm test
```

### React Native Mobile App
```bash
cd react-native-mobile
npm test
```

## 🚀 Deployment

### Production Setup

1. **Python Engine**: Deploy to cloud platform (Heroku, AWS, etc.)
2. **Node.js Backend**: Deploy to cloud platform with database
3. **React Web App**: Build and deploy to CDN
4. **React Native Mobile App**: Build and publish to app stores

### Environment Configuration

Update API URLs in production:
- Backend: Update `PYTHON_ENGINE_URL`
- Frontend: Update `REACT_APP_API_URL`
- Mobile: Update API base URL in services

## 🔍 Monitoring and Logging

### Health Checks
- Python Engine: `GET /health`
- Node.js Backend: `GET /health`

### Error Tracking
- Comprehensive error handling
- User-friendly error messages
- Server-side logging

## 📈 Performance Optimization

### Backend
- Database indexing
- Query optimization
- Caching strategies

### Frontend
- Code splitting
- Lazy loading
- Bundle optimization

### Mobile
- Native performance
- Memory management
- Battery optimization

## 🔒 Security Considerations

### Authentication
- JWT token expiration
- Secure password storage
- Token refresh mechanism

### Data Protection
- Input sanitization
- SQL injection prevention
- XSS protection

### API Security
- Rate limiting
- CORS configuration
- Request validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is part of the Tic-Tac-Toe Full Stack Case Study.

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8000, 3001, 3000 are available
2. **Database Issues**: Check SQLite file permissions
3. **API Connection**: Verify all services are running
4. **Mobile Setup**: Follow platform-specific setup guides

### Debug Mode

Enable debug logging in each project:
- Python: Set logging level to DEBUG
- Node.js: Set NODE_ENV=development
- React: Set REACT_APP_DEBUG=true
- React Native: Enable debug mode in development

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

**Note**: This project demonstrates full-stack development capabilities across multiple technologies and platforms. Each component is designed to be independent while working together to provide a complete user experience. 