const axios = require('axios');

class PythonEngineService {
  constructor() {
    this.baseURL = process.env.PYTHON_ENGINE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Python engine health check failed:', error.message);
      throw new Error('Python engine is not available');
    }
  }

  async makeMove(board, currentPlayer) {
    try {
      console.log('Making move request to Python engine:', { board, currentPlayer });
      const response = await this.client.post('/make-move', {
        board: board,
        current_player: currentPlayer
      });
      console.log('Python engine response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error making move:', error.response?.data || error.message);
      throw new Error('Failed to get move from Python engine');
    }
  }

  async checkGameState(board, currentPlayer) {
    try {
      const response = await this.client.post('/check-game-state', {
        board: board,
        current_player: currentPlayer
      });
      return response.data;
    } catch (error) {
      console.error('Error checking game state:', error.response?.data || error.message);
      throw new Error('Failed to check game state');
    }
  }

  async resetGame() {
    try {
      console.log('Resetting game with Python engine');
      const response = await this.client.post('/reset-game');
      console.log('Python engine reset response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error resetting game:', error.response?.data || error.message);
      throw new Error('Failed to reset game');
    }
  }

  // Helper method to convert board representation
  convertBoardForPython(board) {
    // Convert from frontend format to Python engine format
    // Frontend: null=empty, 'X'=X, 'O'=O
    // Python: 0=empty, -1=X, 1=O
    return board.map(row => 
      row.map(cell => {
        if (cell === null) return 0;
        if (cell === 'X') return -1;
        if (cell === 'O') return 1;
        return 0;
      })
    );
  }

  convertBoardForFrontend(board) {
    // Convert from Python engine format to frontend format
    // Python: 0=empty, -1=X, 1=O
    // Frontend: null=empty, 'X'=X, 'O'=O
    return board.map(row => 
      row.map(cell => {
        if (cell === 0) return null;
        if (cell === -1) return 'X';
        if (cell === 1) return 'O';
        return null;
      })
    );
  }

  convertPlayerForPython(player) {
    // Convert player from frontend format to Python format
    // Frontend: 'X' or 'O'
    // Python: 'x' or 'o'
    return player.toLowerCase();
  }

  convertPlayerForFrontend(player) {
    // Convert player from Python format to frontend format
    // Python: 'x' or 'o'
    // Frontend: 'X' or 'O'
    return player.toUpperCase();
  }
}

module.exports = new PythonEngineService(); 