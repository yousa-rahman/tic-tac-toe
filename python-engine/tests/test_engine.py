import pytest
import numpy as np
import sys
import os

# Add the src directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from engine import Environment, AgentEval
from smart_engine import SmartTicTacToeAI

class TestEnvironment:
    """Test cases for the Environment class."""
    
    def test_environment_initialization(self):
        """Test environment initialization."""
        env = Environment()
        assert env.board.shape == (3, 3)
        assert np.all(env.board == 0)
        assert env.x == -1
        assert env.o == 1
        assert env.winner is None
        assert env.ended == False
    
    def test_set_state(self):
        """Test setting board state."""
        env = Environment()
        state = np.array([[1, 0, 0], [0, -1, 0], [0, 0, 0]])
        env.set_state(state)
        assert np.array_equal(env.board, state)
    
    def test_is_empty(self):
        """Test checking if cell is empty."""
        env = Environment()
        assert env.is_empty(0, 0) == True
        env.board[0, 0] = 1
        assert env.is_empty(0, 0) == False
    
    def test_game_over_win_row(self):
        """Test detecting win in a row."""
        env = Environment()
        env.board = np.array([[1, 1, 1], [0, 0, 0], [0, 0, 0]])
        assert env.game_over() == True
        assert env.winner == 1
        assert env.ended == True
    
    def test_game_over_win_column(self):
        """Test detecting win in a column."""
        env = Environment()
        env.board = np.array([[1, 0, 0], [1, 0, 0], [1, 0, 0]])
        assert env.game_over() == True
        assert env.winner == 1
        assert env.ended == True
    
    def test_game_over_win_diagonal(self):
        """Test detecting win in diagonal."""
        env = Environment()
        env.board = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
        assert env.game_over() == True
        assert env.winner == 1
        assert env.ended == True
    
    def test_game_over_draw(self):
        """Test detecting draw."""
        env = Environment()
        env.board = np.array([[1, -1, 1], [-1, 1, -1], [-1, 1, -1]])
        assert env.game_over() == True
        assert env.winner is None
        assert env.ended == True
    
    def test_game_over_ongoing(self):
        """Test detecting ongoing game."""
        env = Environment()
        env.board = np.array([[1, 0, 0], [0, 0, 0], [0, 0, 0]])
        assert env.game_over() == False
        assert env.winner is None
        assert env.ended == False
    
    def test_get_state(self):
        """Test getting state representation."""
        env = Environment()
        env.board = np.array([[1, 0, 0], [0, -1, 0], [0, 0, 0]])
        state = env.get_state()
        assert isinstance(state, int)
        assert state >= 0
    
    def test_reward_win(self):
        """Test reward calculation for win."""
        env = Environment()
        env.board = np.array([[1, 1, 1], [0, 0, 0], [0, 0, 0]])
        env.game_over()
        assert env.reward(1) == 1
        assert env.reward(-1) == 0
    
    def test_reward_loss(self):
        """Test reward calculation for loss."""
        env = Environment()
        env.board = np.array([[1, 1, 1], [0, 0, 0], [0, 0, 0]])
        env.game_over()
        assert env.reward(-1) == 0
        assert env.reward(1) == 1
    
    def test_reward_ongoing(self):
        """Test reward calculation for ongoing game."""
        env = Environment()
        env.board = np.array([[1, 0, 0], [0, 0, 0], [0, 0, 0]])
        assert env.reward(1) == 0
        assert env.reward(-1) == 0

class TestSmartTicTacToeAI:
    """Test cases for the SmartTicTacToeAI class."""
    
    def test_ai_initialization(self):
        """Test AI initialization."""
        ai = SmartTicTacToeAI()
        assert ai.board_size == 3
        assert ai.difficulty == 'medium'
        assert len(ai.winning_combinations) == 8
    
    def test_ai_difficulty_levels(self):
        """Test AI with different difficulty levels."""
        for difficulty in ['easy', 'medium', 'hard']:
            ai = SmartTicTacToeAI(difficulty=difficulty)
            assert ai.difficulty == difficulty
            assert difficulty in ai.difficulty_settings
    
    def test_make_move_empty_board(self):
        """Test making move on empty board."""
        ai = SmartTicTacToeAI()
        board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        move = ai.make_move(board, 'x')
        assert len(move) == 2
        assert 0 <= move[0] <= 2
        assert 0 <= move[1] <= 2
    
    def test_make_move_winning_move(self):
        """Test making winning move."""
        ai = SmartTicTacToeAI()
        # Board where X can win in one move
        board = [[1, 1, 0], [0, 0, 0], [0, 0, 0]]
        move = ai.make_move(board, 'x')
        assert move == (0, 2)  # Should complete the winning row
    
    def test_make_move_blocking_move(self):
        """Test making blocking move."""
        ai = SmartTicTacToeAI()
        # Board where O can win in one move, X should block
        board = [[-1, -1, 0], [0, 0, 0], [0, 0, 0]]
        move = ai.make_move(board, 'o')
        assert move == (0, 2)  # Should block the winning move
    
    def test_check_game_state_win(self):
        """Test checking game state for win."""
        ai = SmartTicTacToeAI()
        board = [[1, 1, 1], [0, 0, 0], [0, 0, 0]]
        state = ai.check_game_state(board)
        assert state['game_over'] == True
        assert state['winner'] == 1
        assert state['is_draw'] == False
    
    def test_check_game_state_draw(self):
        """Test checking game state for draw."""
        ai = SmartTicTacToeAI()
        board = [[1, -1, 1], [-1, 1, -1], [-1, 1, -1]]
        state = ai.check_game_state(board)
        assert state['game_over'] == True
        assert state['winner'] is None
        assert state['is_draw'] == True
    
    def test_check_game_state_ongoing(self):
        """Test checking game state for ongoing game."""
        ai = SmartTicTacToeAI()
        board = [[1, 0, 0], [0, 0, 0], [0, 0, 0]]
        state = ai.check_game_state(board)
        assert state['game_over'] == False
        assert state['winner'] is None
        assert state['is_draw'] == False
    
    def test_get_available_moves(self):
        """Test getting available moves."""
        ai = SmartTicTacToeAI()
        board = [[1, 0, 0], [0, -1, 0], [0, 0, 0]]
        moves = ai._get_available_moves(board)
        expected_moves = [(0, 1), (0, 2), (1, 0), (1, 2), (2, 0), (2, 1), (2, 2)]
        assert set(moves) == set(expected_moves)
    
    def test_get_available_moves_full_board(self):
        """Test getting available moves on full board."""
        ai = SmartTicTacToeAI()
        board = [[1, -1, 1], [-1, 1, -1], [-1, 1, -1]]
        moves = ai._get_available_moves(board)
        assert len(moves) == 0

if __name__ == "__main__":
    pytest.main([__file__]) 