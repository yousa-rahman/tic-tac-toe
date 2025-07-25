const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../models/database');
const pythonEngine = require('../services/pythonEngine');

const router = express.Router();

// Apply authentication middleware to all game routes
router.use(authenticateToken);

// Validation middleware
const validateMove = [
  body('row').isInt({ min: 0, max: 2 }).withMessage('Row must be 0, 1, or 2'),
  body('col').isInt({ min: 0, max: 2 }).withMessage('Column must be 0, 1, or 2')
];

const validateGameState = [
  body('board').isArray({ min: 3, max: 3 }).withMessage('Board must be a 3x3 array'),
  body('board.*').isArray({ min: 3, max: 3 }).withMessage('Each row must have 3 elements'),
  body('currentPlayer').isIn(['X', 'O']).withMessage('Current player must be X or O')
];

// Start a new game
router.post('/start', async (req, res) => {
  try {
    const { startedBy } = req.body;
    const userId = req.user.id;
    const db = getDatabase();

    // Validate startedBy
    if (!['user', 'computer'].includes(startedBy)) {
      return res.status(400).json({
        error: 'Invalid parameter',
        message: 'startedBy must be either "user" or "computer"'
      });
    }

    // Get initial game state from Python engine
    const initialGame = await pythonEngine.resetGame();
    
    // Convert board format for frontend
    const frontendBoard = pythonEngine.convertBoardForFrontend(initialGame.board);
    
    // If computer starts, get the first move
    if (startedBy === 'computer') {
      // Computer plays as 'O', so we need to make a move for 'O'
      const pythonBoard = pythonEngine.convertBoardForPython(frontendBoard);
      const pythonPlayer = 'o'; // Computer plays as 'o'
      
      console.log('Frontend board before conversion:', frontendBoard);
      console.log('Python board after conversion:', pythonBoard);
      
      const moveResult = await pythonEngine.makeMove(pythonBoard, pythonPlayer);
      const updatedBoard = pythonEngine.convertBoardForFrontend(moveResult.board);
      
      console.log('Python response board:', moveResult.board);
      console.log('Frontend board after conversion:', updatedBoard);
      
      // Save game to database
      console.log('Saving game to database for user ID:', userId);
      const gameResult = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO games (user_id, game_state, started_by) VALUES (?, ?, ?)',
          [userId, JSON.stringify(updatedBoard), startedBy],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
          }
        );
      });
      console.log('Game saved with ID:', gameResult.id);

      res.json({
        gameId: gameResult.id,
        board: updatedBoard,
        currentPlayer: 'X', // Switch to user's turn
        gameOver: moveResult.game_over,
        winner: moveResult.winner ? pythonEngine.convertPlayerForFrontend(moveResult.winner) : null,
        isDraw: moveResult.is_draw,
        nextMove: moveResult.position,
        startedBy: startedBy
      });
    } else {
      // User starts
      console.log('Saving game to database for user ID:', userId);
      const gameResult = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO games (user_id, game_state, started_by) VALUES (?, ?, ?)',
          [userId, JSON.stringify(frontendBoard), startedBy],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
          }
        );
      });
      console.log('Game saved with ID:', gameResult.id);

      res.json({
        gameId: gameResult.id,
        board: frontendBoard,
        currentPlayer: 'X',
        gameOver: false,
        winner: null,
        isDraw: false,
        nextMove: null,
        startedBy: startedBy
      });
    }

  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({
      error: 'Failed to start game',
      message: error.message
    });
  }
});

// Make a move
router.post('/move', validateMove, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { row, col } = req.body;
    const userId = req.user.id;
    const db = getDatabase();

    // Get the most recent game for this user
    const gameResult = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM games WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!gameResult) {
      return res.status(404).json({
        error: 'No active game found',
        message: 'Please start a new game first'
      });
    }

    const gameId = gameResult.id;
    const startedBy = gameResult.started_by;
    const currentBoard = JSON.parse(gameResult.game_state);
    
    // Determine current player based on board state and who started
    const xCount = currentBoard.flat().filter(cell => cell === 'X').length;
    const oCount = currentBoard.flat().filter(cell => cell === 'O').length;
    
    let currentPlayer;
    if (startedBy === 'user') {
      // User starts: X goes first, then O, then X, etc.
      currentPlayer = xCount === oCount ? 'X' : 'O';
    } else {
      // Computer starts: O goes first, then X, then O, etc.
      currentPlayer = oCount === xCount ? 'O' : 'X';
    }

    // Check if the cell is already occupied
    if (currentBoard[row][col] !== null) {
      return res.status(400).json({
        error: 'Invalid move',
        message: 'Cell is already occupied'
      });
    }

    // Check if it's the user's turn
    if (currentPlayer !== 'X') {
      return res.status(400).json({
        error: 'Not your turn',
        message: 'It is not your turn to make a move'
      });
    }

    // Make the user's move on the board
    const userBoard = currentBoard.map(row => [...row]);
    userBoard[row][col] = 'X';

    // Convert board format for Python engine
    const pythonBoard = pythonEngine.convertBoardForPython(userBoard);
    const pythonPlayer = 'x'; // User plays as 'x'

    // Check if game is over after user's move
    const gameState = await pythonEngine.checkGameState(pythonBoard, pythonPlayer);
    
    console.log('Game state after user move:', gameState);
    
    if (gameState.game_over) {
      console.log('Game over after user move!');
      // Game is over, update database and return
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE games SET game_state = ?, winner = ?, is_draw = ? WHERE id = ? AND user_id = ?',
          [
            JSON.stringify(userBoard),
            gameState.winner ? pythonEngine.convertPlayerForFrontend(gameState.winner) : null,
            gameState.is_draw,
            gameId,
            userId
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      if (gameState.game_over) {
        console.log('Updating game statistics...');
        await updateGameStatistics(userId, gameState.winner, gameState.is_draw, startedBy);
      }

      return res.json({
        gameId: gameId,
        board: userBoard,
        currentPlayer: 'X',
        gameOver: gameState.game_over,
        winner: gameState.winner ? pythonEngine.convertPlayerForFrontend(gameState.winner) : null,
        isDraw: gameState.is_draw,
        nextMove: null
      });
    }

    // If game is not over, let computer make its move
    const computerPlayer = 'o'; // Computer plays as 'o'
    const moveResult = await pythonEngine.makeMove(pythonBoard, computerPlayer);
    const finalBoard = pythonEngine.convertBoardForFrontend(moveResult.board);
    
    console.log('Computer move result:', moveResult);
    
    // Update game in database with computer's move
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE games SET game_state = ?, winner = ?, is_draw = ? WHERE id = ? AND user_id = ?',
        [
          JSON.stringify(finalBoard),
          moveResult.winner ? pythonEngine.convertPlayerForFrontend(moveResult.winner) : null,
          moveResult.is_draw,
          gameId,
          userId
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // If game is over after computer move, update statistics
    if (moveResult.game_over) {
      console.log('Game over after computer move!');
      console.log('Updating game statistics...');
      await updateGameStatistics(userId, moveResult.winner, moveResult.is_draw, startedBy);
    }

    res.json({
      gameId: gameId,
      board: finalBoard,
      currentPlayer: moveResult.game_over ? null : 'X', // Next turn is always user's turn
      gameOver: moveResult.game_over,
      winner: moveResult.winner ? pythonEngine.convertPlayerForFrontend(moveResult.winner) : null,
      isDraw: moveResult.is_draw,
      nextMove: moveResult.position
    });

  } catch (error) {
    console.error('Error making move:', error);
    res.status(500).json({
      error: 'Failed to make move',
      message: error.message
    });
  }
});

// Get current game state
router.get('/state/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    const db = getDatabase();

    const game = await new Promise((resolve, reject) => {
      db.get(
        'SELECT game_state, winner, is_draw, started_by FROM games WHERE id = ? AND user_id = ?',
        [gameId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!game) {
      return res.status(404).json({
        error: 'Game not found',
        message: 'Game does not exist or you do not have access to it'
      });
    }

    const board = JSON.parse(game.game_state);

    res.json({
      board,
      winner: game.winner,
      isDraw: game.is_draw,
      gameOver: game.winner !== null || game.is_draw,
      startedBy: game.started_by
    });

  } catch (error) {
    console.error('Error getting game state:', error);
    res.status(500).json({
      error: 'Failed to get game state',
      message: error.message
    });
  }
});

// Helper function to update game statistics
async function updateGameStatistics(userId, winner, isDraw, startedBy) {
  const db = getDatabase();
  const { ensureStatisticsRecord } = require('../models/database');
  
  try {
    // Ensure statistics record exists for this user
    await ensureStatisticsRecord(userId);
    // Determine if user won, lost, or drew
    let result = 'draw';
    if (!isDraw && winner) {
      const winnerSymbol = winner.toUpperCase();
      // User always plays as 'X', Computer always plays as 'O'
      if (winnerSymbol === 'X') {
        result = 'win';  // User won
      } else if (winnerSymbol === 'O') {
        result = 'loss'; // Computer won
      }
    }

    // Update statistics
    await new Promise((resolve, reject) => {
      let updateQuery;
      let params;

      if (result === 'win') {
        updateQuery = `
          UPDATE statistics 
          SET wins = wins + 1, total_games = total_games + 1, updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ?
        `;
        params = [userId];
      } else if (result === 'loss') {
        updateQuery = `
          UPDATE statistics 
          SET losses = losses + 1, total_games = total_games + 1, updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ?
        `;
        params = [userId];
      } else {
        updateQuery = `
          UPDATE statistics 
          SET draws = draws + 1, total_games = total_games + 1, updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ?
        `;
        params = [userId];
      }

      db.run(updateQuery, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  } catch (error) {
    console.error('Error updating statistics:', error);
  }
}

module.exports = router; 