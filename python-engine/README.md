# Tic-Tac-Toe Engine API

A FastAPI-based REST API that exposes the Tic-Tac-Toe AI engine for making intelligent moves in the game.

## Project Structure

```
python-engine/
├── src/
│   ├── engine.py      # Original Tic-Tac-Toe engine
│   └── api.py         # FastAPI REST API wrapper
├── data/
│   ├── vx.npy         # Value function for X player
│   └── vo.npy         # Value function for O player
├── tests/             # Test files
├── docs/              # Documentation
├── requirements.txt   # Python dependencies
└── README.md         # This file
```

## Features

- **REST API**: Expose the Tic-Tac-Toe engine via HTTP endpoints
- **Stateless Design**: Each request is independent, no session management
- **Input Validation**: Proper validation of board states and player turns
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Game State Analysis**: Check game status without making moves

## API Endpoints

### 1. Health Check
- **GET** `/` - Basic health check
- **GET** `/health` - Detailed health status

### 2. Game Operations
- **POST** `/make-move` - Make a move and get the next best position
- **POST** `/check-game-state` - Check current game state without making a move
- **POST** `/reset-game` - Get a fresh game board

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd python-engine
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API server:**
   ```bash
   python src/api.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the API:**
   - API Base URL: `http://localhost:8000`
   - Interactive Documentation: `http://localhost:8000/docs`
   - Alternative Documentation: `http://localhost:8000/redoc`

## API Usage Examples

### Making a Move

```bash
curl -X POST "http://localhost:8000/make-move" \
     -H "Content-Type: application/json" \
     -d '{
       "board": [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
       "current_player": "x"
     }'
```

### Checking Game State

```bash
curl -X POST "http://localhost:8000/check-game-state" \
     -H "Content-Type: application/json" \
     -d '{
       "board": [[-1, 1, 0], [0, -1, 0], [0, 0, 0]],
       "current_player": "o"
     }'
```

### Resetting Game

```bash
curl -X POST "http://localhost:8000/reset-game"
```

## Board Representation

The board is represented as a 3x3 array where:
- `0` = Empty cell
- `-1` = X player
- `1` = O player

Example:
```json
{
  "board": [
    [-1, 1, 0],
    [0, -1, 0],
    [0, 0, 0]
  ],
  "current_player": "o"
}
```

## Response Format

### Move Response
```json
{
  "position": [1, 2],
  "board": [[-1, 1, 0], [0, -1, 1], [0, 0, 0]],
  "game_over": false,
  "winner": null,
  "is_draw": false
}
```

### Game Status Response
```json
{
  "board": [[-1, 1, 0], [0, -1, 0], [0, 0, 0]],
  "game_over": false,
  "winner": null,
  "is_draw": false,
  "current_player": "o"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

Error response format:
```json
{
  "detail": "Error message description"
}
```

## Development

### Running Tests
```bash
# Navigate to tests directory
cd tests
python -m pytest
```

### Code Style
The project follows PEP 8 style guidelines. Use a linter like `flake8` or `black` for code formatting.

## Integration with Node.js Backend

This Python API is designed to be consumed by the Node.js backend server, which will:
1. Handle user authentication and sessions
2. Manage game state and coordinate with this engine
3. Provide endpoints for the React/React Native frontends

## License

This project is part of the Tic-Tac-Toe Full Stack Case Study. 