// Test setup file for Node.js backend
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'your-secret-key';
process.env.PYTHON_ENGINE_URL = 'http://localhost:8000';
process.env.PORT = '3002'; // Use different port for tests

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = originalConsoleError; // Keep error logging
});

afterAll(() => {
  console.log = originalConsoleLog;
});

// Clean up test database before all tests start
beforeAll(async () => {
  const fs = require('fs');
  const path = require('path');
  const { closeDatabase } = require('../src/models/database');
  
  // Close any existing database connection
  try {
    await closeDatabase();
  } catch (error) {
    // Ignore errors if database is not open
  }
  
  // Delete test database file if it exists to ensure clean state
  const testDbPath = path.join(__dirname, '../data/test.db');
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
    } catch (error) {
      // Ignore errors if file is locked or doesn't exist
    }
  }
});

// Clean up test database after all tests
afterAll(async () => {
  const fs = require('fs');
  const path = require('path');
  const { closeDatabase } = require('../src/models/database');
  
  // Close database connection first
  try {
    await closeDatabase(); // Ensure this is awaited if it returns a Promise
  } catch (error) {
    // Optionally log or ignore
  }
  
  // Then remove test database file
  const testDbPath = path.join(__dirname, '../data/test.db');
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
    } catch (error) {
      // Optionally log or ignore
    }
  }
}); 