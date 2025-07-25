from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Tuple
import numpy as np
import os
import sys

# Add the current directory to Python path to import engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from engine import Environment, AgentEval
from smart_engine import smart_ai

app = FastAPI(title="Tic-Tac-Toe Engine API", version="1.0.0")

class GameState(BaseModel):
    board: List[List[int]]  # 3x3 board: 0=empty, -1=X, 1=O
    current_player: str  # 'x' or 'o'
    game_id: Optional[str] = None
    difficulty: Optional[str] = 'medium'  # 'easy', 'medium', 'hard'

class MoveResponse(BaseModel):
    position: Tuple[int, int]
    board: List[List[int]]
    game_over: bool
    winner: Optional[str] = None
    is_draw: bool = False

class GameStatusResponse(BaseModel):
    board: List[List[int]]
    game_over: bool
    winner: Optional[str] = None
    is_draw: bool = False
    current_player: str

# Global variables for the engine
VX_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'vx.npy')
VO_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'vo.npy')

# Load the value functions (for backward compatibility)
try:
    VX_VAL = np.load(VX_PATH)
    VO_VAL = np.load(VO_PATH)
except FileNotFoundError:
    print("Warning: Value function files not found. Using smart AI engine only.")

# Global smart AI instance with medium difficulty
smart_ai = smart_ai

def get_next_action(env: Environment, symbol: str, difficulty: str = 'medium') -> Tuple[int, int]:
    """Get the next best move for the given player."""
    # Create a new AI instance with the specified difficulty
    from smart_engine import SmartTicTacToeAI
    ai = SmartTicTacToeAI(difficulty=difficulty)
    board = env.board.tolist()
    return ai.make_move(board, symbol)

def board_to_state(board: List[List[int]]) -> np.ndarray:
    """Convert board list to numpy array."""
    return np.array(board)

def get_winner_symbol(winner: int) -> Optional[str]:
    """Convert winner integer to symbol string."""
    if winner == -1:
        return 'x'
    elif winner == 1:
        return 'o'
    return None

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Tic-Tac-Toe Engine API is running"}

@app.post("/make-move", response_model=MoveResponse)
async def make_move(game_state: GameState):
    """
    Make a move in the Tic-Tac-Toe game.
    
    Args:
        game_state: Current board state and player turn
        
    Returns:
        MoveResponse: Next move position and updated game state
    """
    try:
        # Validate input
        if len(game_state.board) != 3 or any(len(row) != 3 for row in game_state.board):
            raise HTTPException(status_code=400, detail="Board must be 3x3")
        
        if game_state.current_player.lower() not in ['x', 'o']:
            raise HTTPException(status_code=400, detail="Current player must be 'x' or 'o'")
        
        # Create environment
        env = Environment()
        board_array = board_to_state(game_state.board)
        env.set_state(board_array)
        
        # Check if game is already over using smart AI
        game_status = smart_ai.check_game_state(game_state.board)
        if game_status['game_over']:
            winner_symbol = get_winner_symbol(game_status['winner'])
            return MoveResponse(
                position=(-1, -1),  # Invalid position since game is over
                board=game_state.board,
                game_over=True,
                winner=winner_symbol,
                is_draw=game_status['is_draw']
            )
        
        # Make the move using smart AI with difficulty
        next_move = get_next_action(env, game_state.current_player, game_state.difficulty)
        
        # Update the board with the move
        if next_move != (-1, -1):  # Valid move
            env.board[next_move[0]][next_move[1]] = -1 if game_state.current_player.lower() == 'x' else 1
        
        # Get updated board
        updated_board = env.board.tolist()
        
        # Check if game is over after the move using smart AI
        game_status = smart_ai.check_game_state(updated_board)
        winner_symbol = get_winner_symbol(game_status['winner'])
        
        return MoveResponse(
            position=next_move,
            board=updated_board,
            game_over=game_status['game_over'],
            winner=winner_symbol,
            is_draw=game_status['is_draw']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making move: {str(e)}")

@app.post("/check-game-state", response_model=GameStatusResponse)
async def check_game_state(game_state: GameState):
    """
    Check the current state of the game without making a move.
    
    Args:
        game_state: Current board state
        
    Returns:
        GameStatusResponse: Current game status
    """
    try:
        # Validate input
        if len(game_state.board) != 3 or any(len(row) != 3 for row in game_state.board):
            raise HTTPException(status_code=400, detail="Board must be 3x3")
        
        # Create environment
        env = Environment()
        board_array = board_to_state(game_state.board)
        env.set_state(board_array)
        
        # Check game state using smart AI
        game_status = smart_ai.check_game_state(game_state.board)
        winner_symbol = get_winner_symbol(game_status['winner'])
        
        return GameStatusResponse(
            board=game_state.board,
            game_over=game_status['game_over'],
            winner=winner_symbol,
            is_draw=game_status['is_draw'],
            current_player=game_state.current_player
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking game state: {str(e)}")

@app.post("/reset-game")
async def reset_game():
    """
    Reset the game to initial state.
    
    Returns:
        dict: Empty board and default starting player
    """
    empty_board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    return {
        "board": empty_board,
        "current_player": "x",
        "game_over": False,
        "winner": None,
        "is_draw": False
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for the engine."""
    return {
        "status": "healthy",
        "engine": "Tic-Tac-Toe AI Engine",
        "version": "1.0.0",
        "difficulty_levels": ["easy", "medium", "hard"]
    }

@app.post("/set-difficulty")
async def set_difficulty(difficulty: str):
    """Set the AI difficulty level."""
    if difficulty not in ['easy', 'medium', 'hard']:
        raise HTTPException(status_code=400, detail="Difficulty must be 'easy', 'medium', or 'hard'")
    
    return {
        "message": f"Difficulty set to {difficulty}",
        "difficulty": difficulty
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 