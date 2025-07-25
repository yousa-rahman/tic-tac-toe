# Tic-Tac-Toe Engine API

FastAPI-based REST API for Tic-Tac-Toe AI engine.

## Features

- REST API for Tic-Tac-Toe game moves
- Smart AI with difficulty levels (easy, medium, hard)
- Stateless design with input validation
- Game state analysis

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python src/api.py
```

## API Endpoints

- `GET /` - Health check
- `POST /make-move` - Make AI move
- `POST /check-game-state` - Check game status
- `POST /reset-game` - Get fresh board

## Board Representation

```json
{
  "board": [[-1, 1, 0], [0, -1, 0], [0, 0, 0]],
  "current_player": "o"
}
```

- `0` = Empty, `-1` = X, `1` = O

## Testing

```bash
python -m pytest tests/
```

## Integration

Designed to be consumed by Node.js backend for full-stack Tic-Tac-Toe application. 