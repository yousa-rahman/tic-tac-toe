const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initializeDatabase, getDatabase } = require('../src/models/database');

// Import the app
const app = require('../src/server');

describe('Authentication Routes', () => {
  let db;

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
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test1@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test1@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test2@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('error', 'User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
      expect(response.body).toHaveProperty('details');
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should validate password length', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 12);
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
          ['Test User', 'test3@example.com', hashedPassword],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test3@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test3@example.com');
    });

    it('should not login with invalid email', async () => {
      const credentials = {
        email: 'nonexistent4@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Authentication failed');
    });

    it('should not login with invalid password', async () => {
      const credentials = {
        email: 'test3@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Authentication failed');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('GET /api/auth/verify', () => {
    let token;
    let userId;

    beforeEach(async () => {
      // Create a test user and token
      const hashedPassword = await bcrypt.hash('password123', 12);
      const result = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
          ['Test User', 'test5@example.com', hashedPassword],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
          }
        );
      });
      userId = result.id;
      token = jwt.sign(
        { userId, email: 'test5@example.com' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
    });

    it('should verify valid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', userId);
      expect(response.body.user).toHaveProperty('email', 'test5@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid token');
    });

    it('should reject token for non-existent user', async () => {
      // Create a token for a non-existent user ID instead of deleting the user
      const nonExistentUserId = 99999;
      const tokenForNonExistentUser = jwt.sign(
        { userId: nonExistentUserId, email: 'nonexistent@example.com' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${tokenForNonExistentUser}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid token');
    });
  });
}); 