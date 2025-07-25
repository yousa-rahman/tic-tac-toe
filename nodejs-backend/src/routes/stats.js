const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../models/database');

const router = express.Router();

// Apply authentication middleware to all stats routes
router.use(authenticateToken);

// Get user's own statistics
router.get('/my-stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDatabase();
    const { ensureStatisticsRecord } = require('../models/database');

    // Ensure statistics record exists for this user
    await ensureStatisticsRecord(userId);

    const stats = await new Promise((resolve, reject) => {
      db.get(
        `SELECT wins, losses, draws, total_games, 
         ROUND((wins * 100.0 / total_games), 2) as win_percentage
         FROM statistics WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!stats) {
      return res.status(404).json({
        error: 'Statistics not found',
        message: 'No statistics found for this user'
      });
    }

    res.json({
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      totalGames: stats.total_games,
      winPercentage: stats.win_percentage || 0
    });

  } catch (error) {
    console.error('Error getting user statistics:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

// Get user's recent games
router.get('/recent-games', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const db = getDatabase();

    console.log('Fetching recent games for user ID:', userId);

    const games = await new Promise((resolve, reject) => {
      db.all(
        `SELECT id, game_state, winner, is_draw, started_by, created_at
         FROM games 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    console.log('Found games:', games.length);
    console.log('Games data:', games);

    const formattedGames = games.map(game => ({
      id: game.id,
      board: JSON.parse(game.game_state),
      winner: game.winner,
      isDraw: game.is_draw,
      startedBy: game.started_by,
      createdAt: game.created_at,
      result: game.is_draw ? 'draw' : (game.winner === 'X' ? 'win' : 'loss')
    }));

    res.json({
      games: formattedGames,
      total: formattedGames.length
    });

  } catch (error) {
    console.error('Error getting recent games:', error);
    res.status(500).json({
      error: 'Failed to get recent games',
      message: error.message
    });
  }
});

// Get leaderboard (top players by win percentage)
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const db = getDatabase();

    const leaderboard = await new Promise((resolve, reject) => {
      db.all(
        `SELECT u.name, u.email, s.wins, s.losses, s.draws, s.total_games,
         ROUND((s.wins * 100.0 / s.total_games), 2) as win_percentage
         FROM statistics s
         JOIN users u ON s.user_id = u.id
         WHERE s.total_games >= 1
         ORDER BY win_percentage DESC, s.wins DESC
         LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const formattedLeaderboard = leaderboard.map((player, index) => ({
      rank: index + 1,
      name: player.name || player.email, // Use name if available, fallback to email
      email: player.email,
      wins: player.wins,
      losses: player.losses,
      draws: player.draws,
      totalGames: player.total_games,
      winPercentage: player.win_percentage || 0
    }));

    res.json({
      leaderboard: formattedLeaderboard,
      total: formattedLeaderboard.length
    });

  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: error.message
    });
  }
});

// Get detailed game statistics
router.get('/detailed-stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDatabase();

    // Get basic statistics
    const basicStats = await new Promise((resolve, reject) => {
      db.get(
        `SELECT wins, losses, draws, total_games,
         ROUND((wins * 100.0 / total_games), 2) as win_percentage
         FROM statistics WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!basicStats) {
      return res.status(404).json({
        error: 'Statistics not found',
        message: 'No statistics found for this user'
      });
    }

    // Get games by who started
    const gamesByStarter = await new Promise((resolve, reject) => {
      db.all(
        `SELECT started_by, COUNT(*) as count,
         SUM(CASE WHEN winner IS NOT NULL AND is_draw = 0 THEN 1 ELSE 0 END) as wins,
         SUM(CASE WHEN winner IS NULL AND is_draw = 1 THEN 1 ELSE 0 END) as draws
         FROM games 
         WHERE user_id = ? 
         GROUP BY started_by`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Get recent performance (last 10 games)
    const recentPerformance = await new Promise((resolve, reject) => {
      db.all(
        `SELECT winner, is_draw, created_at
         FROM games 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 10`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const recentWins = recentPerformance.filter(game => 
      game.winner && !game.is_draw
    ).length;

    const recentDraws = recentPerformance.filter(game => 
      game.is_draw
    ).length;

    const recentLosses = recentPerformance.filter(game => 
      !game.winner && !game.is_draw
    ).length;

    res.json({
      basic: {
        wins: basicStats.wins,
        losses: basicStats.losses,
        draws: basicStats.draws,
        totalGames: basicStats.total_games,
        winPercentage: basicStats.win_percentage || 0
      },
      byStarter: gamesByStarter.map(starter => ({
        startedBy: starter.started_by,
        totalGames: starter.count,
        wins: starter.wins,
        draws: starter.draws,
        losses: starter.count - starter.wins - starter.draws
      })),
      recentPerformance: {
        last10Games: {
          wins: recentWins,
          losses: recentLosses,
          draws: recentDraws,
          winPercentage: recentPerformance.length > 0 ? 
            Math.round((recentWins / recentPerformance.length) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Error getting detailed statistics:', error);
    res.status(500).json({
      error: 'Failed to get detailed statistics',
      message: error.message
    });
  }
});

module.exports = router; 