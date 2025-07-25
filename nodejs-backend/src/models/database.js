const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../../data/tic-tac-toe.db');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      createTables()
        .then(resolve)
        .catch(reject);
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    const gamesTable = `
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_state TEXT NOT NULL,
        winner TEXT,
        is_draw BOOLEAN DEFAULT FALSE,
        started_by TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;
    
    const statisticsTable = `
      CREATE TABLE IF NOT EXISTS statistics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        total_games INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;
    
    db.serialize(() => {
      db.run(usersTable, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
        console.log('Users table created or already exists');
      });
      
      db.run(gamesTable, (err) => {
        if (err) {
          console.error('Error creating games table:', err);
          reject(err);
          return;
        }
        console.log('Games table created or already exists');
      });
      
      db.run(statisticsTable, (err) => {
        if (err) {
          console.error('Error creating statistics table:', err);
          reject(err);
          return;
        }
        console.log('Statistics table created or already exists');
        
        // Add name column to users table if it doesn't exist (migration)
        db.run('ALTER TABLE users ADD COLUMN name TEXT', (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding name column:', err);
          } else {
            console.log('Name column added to users table or already exists');
          }
          resolve();
        });
      });
    });
  });
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

// Helper function to ensure statistics record exists for a user
function ensureStatisticsRecord(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO statistics (user_id) VALUES (?)',
      [userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  ensureStatisticsRecord
}; 