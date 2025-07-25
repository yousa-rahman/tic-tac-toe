import numpy as np
from typing import Tuple, Optional, List
import random

class SmartTicTacToeAI:
    def __init__(self, difficulty='medium'):
        self.board_size = 3
        self.max_depth = 9  # Maximum search depth for minimax
        self.winning_combinations = self._get_winning_combinations()
        self.difficulty = difficulty  # 'easy', 'medium', 'hard'
        
        # Difficulty settings
        self.difficulty_settings = {
            'easy': {
                'optimal_move_chance': 0.3,    # 30% chance to make optimal move
                'random_move_chance': 0.7,     # 70% chance to make random move
                'max_depth': 3                 # Limited search depth
            },
            'medium': {
                'optimal_move_chance': 0.6,    # 60% chance to make optimal move
                'random_move_chance': 0.4,     # 40% chance to make random move
                'max_depth': 6                 # Medium search depth
            },
            'hard': {
                'optimal_move_chance': 0.9,    # 90% chance to make optimal move
                'random_move_chance': 0.1,     # 10% chance to make random move
                'max_depth': 9                 # Full search depth
            }
        }
        
    def _get_winning_combinations(self) -> List[List[Tuple[int, int]]]:
        """Get all possible winning combinations."""
        combinations = []
        
        # Rows
        for i in range(self.board_size):
            combinations.append([(i, j) for j in range(self.board_size)])
        
        # Columns
        for j in range(self.board_size):
            combinations.append([(i, j) for i in range(self.board_size)])
        
        # Diagonals
        combinations.append([(i, i) for i in range(self.board_size)])  # Main diagonal
        combinations.append([(i, self.board_size - 1 - i) for i in range(self.board_size)])  # Anti-diagonal
        
        return combinations
    
    def make_move(self, board: List[List[int]], player: str) -> Tuple[int, int]:
        """
        Make the best move for the given player with difficulty-based randomness.
        
        Args:
            board: 3x3 board (0=empty, -1=X, 1=O)
            player: 'x' or 'o'
            
        Returns:
            Tuple[int, int]: Best move position (row, col)
        """
        # Convert player symbol to integer
        player_int = -1 if player.lower() == 'x' else 1
        opponent_int = 1 if player_int == -1 else -1
        
        # Get available moves
        available_moves = self._get_available_moves(board)
        
        if not available_moves:
            return (-1, -1)  # No moves available
        
        # Get difficulty settings
        settings = self.difficulty_settings[self.difficulty]
        
        # Decide whether to make optimal move or random move
        rand = random.random()
        
        # If it's the first move, use opening strategy with some randomness
        if len(available_moves) == 9:
            if rand < settings['optimal_move_chance']:
                return self._get_opening_move()
            else:
                return random.choice(available_moves)
        
        # If it's the second move and opponent took center, take a corner (with randomness)
        if len(available_moves) == 8 and board[1][1] != 0:
            corners = [(0, 0), (0, 2), (2, 0), (2, 2)]
            available_corners = [corner for corner in corners if corner in available_moves]
            if available_corners and rand < settings['optimal_move_chance']:
                return random.choice(available_corners)
        
        # Check for immediate winning moves (always take them regardless of difficulty)
        for move in available_moves:
            board[move[0]][move[1]] = player_int
            if self._check_winner(board) == player_int:
                board[move[0]][move[1]] = 0
                return move
            board[move[0]][move[1]] = 0
        
        # Check for blocking moves (always block regardless of difficulty)
        for move in available_moves:
            board[move[0]][move[1]] = opponent_int
            if self._check_winner(board) == opponent_int:
                board[move[0]][move[1]] = 0
                return move
            board[move[0]][move[1]] = 0
        
        # Decide between optimal and random move based on difficulty
        if rand < settings['optimal_move_chance']:
            # Make optimal move using minimax
            return self._get_optimal_move(board, player_int, opponent_int, settings['max_depth'])
        else:
            # Make random move
            return random.choice(available_moves)
    
    def _get_opening_move(self) -> Tuple[int, int]:
        """Get a strategic opening move."""
        # Prioritize center, then corners, then edges
        center = (1, 1)
        corners = [(0, 0), (0, 2), (2, 0), (2, 2)]
        edges = [(0, 1), (1, 0), (1, 2), (2, 1)]
        
        # 70% chance to take center, 20% chance to take corner, 10% chance to take edge
        rand = random.random()
        if rand < 0.7:
            return center
        elif rand < 0.9:
            return random.choice(corners)
        else:
            return random.choice(edges)
    
    def _get_available_moves(self, board: List[List[int]]) -> List[Tuple[int, int]]:
        """Get all available moves on the board."""
        moves = []
        for i in range(self.board_size):
            for j in range(self.board_size):
                if board[i][j] == 0:
                    moves.append((i, j))
        return moves
    
    def _get_optimal_move(self, board: List[List[int]], player_int: int, opponent_int: int, max_depth: int) -> Tuple[int, int]:
        """Get the optimal move using minimax algorithm."""
        available_moves = self._get_available_moves(board)
        best_move = None
        best_score = float('-inf')
        alpha = float('-inf')
        beta = float('inf')
        
        for move in available_moves:
            # Make the move
            board[move[0]][move[1]] = player_int
            
            # Get score for this move
            score = self._minimax(board, 0, False, alpha, beta, player_int, opponent_int, max_depth)
            
            # Undo the move
            board[move[0]][move[1]] = 0
            
            # Update best move
            if score > best_score:
                best_score = score
                best_move = move
            
            alpha = max(alpha, best_score)
        
        return best_move
    
    def _minimax(self, board: List[List[int]], depth: int, is_maximizing: bool, 
                 alpha: float, beta: float, player_int: int, opponent_int: int, max_depth: int = None) -> float:
        """
        Minimax algorithm with alpha-beta pruning.
        
        Args:
            board: Current board state
            depth: Current depth in the search tree
            is_maximizing: Whether we're maximizing or minimizing
            alpha: Alpha value for pruning
            beta: Beta value for pruning
            player_int: Integer representation of the AI player
            opponent_int: Integer representation of the opponent
            
        Returns:
            float: Best score for this position
        """
        # Check for terminal states
        winner = self._check_winner(board)
        if winner is not None:
            if winner == player_int:
                return 10 - depth  # Win (prefer faster wins)
            elif winner == opponent_int:
                return depth - 10  # Loss (prefer slower losses)
            else:
                return 0  # Draw
        
        # Check for draw
        if self._is_board_full(board):
            return 0
        
        # Use provided max_depth or default to self.max_depth
        if max_depth is None:
            max_depth = self.max_depth
            
        # Limit search depth to prevent excessive computation
        if depth >= max_depth:
            return self._evaluate_position(board, player_int, opponent_int)
        
        if is_maximizing:
            max_score = float('-inf')
            for move in self._get_available_moves(board):
                board[move[0]][move[1]] = player_int
                score = self._minimax(board, depth + 1, False, alpha, beta, player_int, opponent_int)
                board[move[0]][move[1]] = 0
                max_score = max(max_score, score)
                alpha = max(alpha, score)
                if beta <= alpha:
                    break  # Beta cutoff
            return max_score
        else:
            min_score = float('inf')
            for move in self._get_available_moves(board):
                board[move[0]][move[1]] = opponent_int
                score = self._minimax(board, depth + 1, True, alpha, beta, player_int, opponent_int)
                board[move[0]][move[1]] = 0
                min_score = min(min_score, score)
                beta = min(beta, score)
                if beta <= alpha:
                    break  # Alpha cutoff
            return min_score
    
    def _check_winner(self, board: List[List[int]]) -> Optional[int]:
        """Check if there's a winner on the board."""
        for combo in self.winning_combinations:
            values = [board[pos[0]][pos[1]] for pos in combo]
            if all(val == -1 for val in values):
                return -1  # X wins
            elif all(val == 1 for val in values):
                return 1   # O wins
        return None
    
    def _is_board_full(self, board: List[List[int]]) -> bool:
        """Check if the board is full."""
        return all(board[i][j] != 0 for i in range(self.board_size) for j in range(self.board_size))
    
    def _evaluate_position(self, board: List[List[int]], player_int: int, opponent_int: int) -> float:
        """
        Evaluate a non-terminal position.
        This gives a heuristic score for positions that don't have a clear winner.
        """
        score = 0
        
        # Evaluate each winning combination
        for combo in self.winning_combinations:
            values = [board[pos[0]][pos[1]] for pos in combo]
            player_count = values.count(player_int)
            opponent_count = values.count(opponent_int)
            empty_count = values.count(0)
            
            # Score based on potential winning opportunities
            if opponent_count == 0:  # No opponent pieces in this line
                if player_count == 2 and empty_count == 1:
                    score += 5  # Near win
                elif player_count == 1 and empty_count == 2:
                    score += 1  # Potential win
            
            if player_count == 0:  # No player pieces in this line
                if opponent_count == 2 and empty_count == 1:
                    score -= 5  # Opponent near win
                elif opponent_count == 1 and empty_count == 2:
                    score -= 1  # Opponent potential win
        
        return score
    
    def check_game_state(self, board: List[List[int]]) -> dict:
        """
        Check the current game state.
        
        Returns:
            dict: Game state information
        """
        winner = self._check_winner(board)
        is_draw = self._is_board_full(board) and winner is None
        game_over = winner is not None or is_draw
        
        return {
            'game_over': game_over,
            'winner': winner,
            'is_draw': is_draw
        }

# Global instance
smart_ai = SmartTicTacToeAI() 