# Tic-Tac-Toe Web App

A modern React web application for playing Tic-Tac-Toe against an AI opponent with user authentication, game statistics, and real-time gameplay.

## Project Structure

```
react-web-app/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.js          # Navigation component
│   │   ├── ProtectedRoute.js  # Authentication guard
│   │   └── LoadingSpinner.js  # Loading indicator
│   ├── pages/                 # Page components
│   │   ├── Login.js           # Login page
│   │   ├── Register.js        # Registration page
│   │   ├── Game.js            # Game interface
│   │   └── Statistics.js      # Statistics page
│   ├── services/              # API services
│   │   ├── authService.js     # Authentication API
│   │   ├── gameService.js     # Game API
│   │   └── statsService.js    # Statistics API
│   ├── store/                 # Redux store
│   │   ├── index.js           # Store configuration
│   │   └── slices/            # Redux slices
│   │       ├── authSlice.js   # Authentication state
│   │       ├── gameSlice.js   # Game state
│   │       └── statsSlice.js  # Statistics state
│   ├── utils/                 # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── App.js                 # Main app component
│   ├── index.js               # App entry point
│   ├── index.css              # Global styles
│   └── App.css                # App-specific styles
├── package.json               # Dependencies and scripts
└── README.md                 # This file
```

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Game Interface**: Interactive Tic-Tac-Toe board with AI opponent
- **Game Options**: Choose who starts the game (user or computer)
- **Real-time Gameplay**: Live updates and move validation
- **Statistics Tracking**: View personal game statistics and leaderboard
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **State Management**: Redux for centralized state management
- **Error Handling**: Comprehensive error handling with user feedback

## Prerequisites

- Node.js 16.0+
- npm or yarn
- Backend API running on port 3001
- Python engine running on port 8000

## Setup Instructions

### 1. Install Dependencies

```bash
cd react-web-app
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Usage

### Authentication

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **JWT Tokens**: Authentication tokens are automatically managed

### Gameplay

1. **Start Game**: Choose who starts (you or the computer)
2. **Make Moves**: Click on empty cells to place your mark
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

## Board Representation

The game uses the following board representation:
- `0` = Empty cell
- `1` = X player
- `2` = O player

## Component Architecture

### Pages
- **Login**: User authentication form
- **Register**: User registration form
- **Game**: Main game interface with board and controls
- **Statistics**: User statistics and leaderboard display

### Components
- **Navbar**: Navigation with authentication status
- **ProtectedRoute**: Route protection for authenticated users
- **LoadingSpinner**: Loading indicator for async operations

### Services
- **authService**: Authentication API calls
- **gameService**: Game management API calls
- **statsService**: Statistics API calls

## Styling

The app uses:
- **CSS Modules**: Component-specific styles
- **Global CSS**: Shared styles and utilities
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, accessible interface

## Error Handling

- **API Errors**: Automatic error handling with toast notifications
- **Authentication**: Token expiration handling
- **Validation**: Form validation with user feedback
- **Network**: Offline state handling

## Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Code Style

- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (recommended)
- **React Hooks**: Functional components with hooks
- **Redux Toolkit**: Modern Redux with RTK

## Testing

```bash
npm test           # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage
```

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Environment Variables

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Automatic code splitting with React Router
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production builds with minification
- **Caching**: JWT tokens cached in localStorage

## Security

- **JWT Tokens**: Secure authentication tokens
- **HTTPS**: Secure communication in production
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: React's built-in XSS protection

## Troubleshooting

### Common Issues

1. **API Connection**: Ensure backend is running on port 3001
2. **CORS Errors**: Check backend CORS configuration
3. **Authentication**: Clear localStorage if token issues occur
4. **Build Errors**: Check Node.js version compatibility

### Debug Mode

```bash
REACT_APP_DEBUG=true npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Tic-Tac-Toe Full Stack Case Study. 