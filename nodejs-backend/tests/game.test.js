const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initializeDatabase, getDatabase } = require('../src/models/database');

// Import the app
const app = require('../src/server');

describe('Game Routes', () => {
  let db;
  let token;
  let userId;

  beforeAll(async () => {
    // Initialize test database
    await initializeDatabase();
    db = getDatabase();
  });

  beforeEach(async () => {
    // Clear database before each test
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM statistics', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM games', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create a test user and token
    const hashedPassword = await bcrypt.hash('password123', 12);
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        ['Test User', 'game-test@example.com', hashedPassword],
        function(err) {
          if (err) {
            console.error('Error creating user:', err);
            reject(err);
          } else {
            console.log(`Created user with ID: ${this.lastID}`);
            resolve({ id: this.lastID });
          }
        }
      );
    });
    userId = result.id;
    token = jwt.sign(
      { userId, email: 'game-test@example.com' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    console.log(`Generated token for user ${userId}: ${token.substring(0, 20)}...`);
  });

  describe('POST /api/game/start', () => {
    it('should start a new game when user goes first', async () => {
      const gameData = {
        startedBy: 'user'
      };

      const response = await request(app)
        .post('/api/game/start')
        .set('Authorization', `Bearer ${token}`)
        .send(gameData)
        .expect(200);

      expect(response.body).toHaveProperty('gameId');
      expect(response.body).toHaveProperty('board');
      expect(response.body).toHaveProperty('currentPlayer', 'X');
      expect(response.body).toHaveProperty('gameOver', false);
      expect(response.body).toHaveProperty('startedBy', 'user');
      
      // Check that board is empty
      const board = response.body.board;
      expect(board).toHaveLength(3);
      expect(board.every(row => row.every(cell => cell === null))).toBe(true);
    });

    it('should start a new game when computer goes first', async () => {
      const gameData = {
        startedBy: 'computer'
      };

      const response = await request(app)
        .post('/api/game/start')
        .set('Authorization', `Bearer ${token}`)
        .send(gameData)
        .expect(200);

      expect(response.body).toHaveProperty('gameId');
      expect(response.body).toHaveProperty('board');
      expect(response.body).toHaveProperty('currentPlayer', 'X');
      expect(response.body).toHaveProperty('startedBy', 'computer');
      
      // Check that computer made a move
      const board = response.body.board;
      expect(board).toHaveLength(3);
      const oCount = board.flat().filter(cell => cell === 'O').length;
      expect(oCount).toBe(1);
    });

    it('should reject invalid startedBy value', async () => {
      const gameData = {
        startedBy: 'invalid'
      };

      const response = await request(app)
        .post('/api/game/start')
        .set('Authorization', `Bearer ${token}`)
        .send(gameData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid parameter');
    });

    it('should require authentication', async () => {
      const gameData = {
        startedBy: 'user'
      };

      const response = await request(app)
        .post('/api/game/start')
        .send(gameData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('POST /api/game/move', () => {
    let gameId;

    beforeEach(async () => {
      // Create a game first
      const gameData = {
        startedBy: 'user'
      };

      const response = await request(app)
        .post('/api/game/start')
        .set('Authorization', `Bearer ${token}`)
        .send(gameData);

      gameId = response.body.gameId;
    });

    it('should make a valid move', async () => {
      // Use the game created in beforeEach
      const moveData = {
        row: 0,
        col: 0
      };

      const response = await request(app)
        .post('/api/game/move')
        .set('Authorization', `Bearer ${token}`)
        .send(moveData)
        .expect(200);

      expect(response.body).toHaveProperty('gameId');
      expect(response.body).toHaveProperty('board');
      expect(response.body).toHaveProperty('currentPlayer');
      expect(response.body).toHaveProperty('gameOver');
      expect(response.body).toHaveProperty('winner');
      expect(response.body).toHaveProperty('isDraw');
      
      // Check that the move was made
      const board = response.body.board;
      expect(board[0][0]).toBe('X');
    });

    it('should reject move on occupied cell', async () => {
      // Make first move
      await request(app)
        .post('/api/game/move')
        .set('Authorization', `Bearer ${token}`)
        .send({ row: 0, col: 0 });

      // Try to move on same cell
      const response = await request(app)
        .post('/api/game/move')
        .set('Authorization', `Bearer ${token}`)
        .send({ row: 0, col: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid move');
    });

    it('should reject invalid move coordinates', async () => {
      const moveData = {
        row: 5,
        col: 5
      };

      const response = await request(app)
        .post('/api/game/move')
        .set('Authorization', `Bearer ${token}`)
        .send(moveData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should require authentication', async () => {
      const moveData = {
        row: 0,
        col: 0
      };

      const response = await request(app)
        .post('/api/game/move')
        .send(moveData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('GET /api/game/state/:gameId', () => {
    let gameId;

    beforeEach(async () => {
      // Create a game first
      const gameData = {
        startedBy: 'user'
      };

      const response = await request(app)
        .post('/api/game/start')
        .set('Authorization', `Bearer ${token}`)
        .send(gameData);

      gameId = response.body.gameId;
    });

    it('should get game state', async () => {
      const response = await request(app)
        .get(`/api/game/state/${gameId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('board');
      expect(response.body).toHaveProperty('winner');
      expect(response.body).toHaveProperty('isDraw');
      expect(response.body).toHaveProperty('gameOver');
      expect(response.body).toHaveProperty('startedBy');
    });

    it('should reject access to non-existent game', async () => {
      const response = await request(app)
        .get('/api/game/state/999999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Game not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/game/state/${gameId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });
}); 