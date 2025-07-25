import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startGame, makeMove, resetGame } from '../store/slices/gameSlice';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaTimes, FaCircle } from 'react-icons/fa';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GameCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0 1rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

const PlayerInfo = styled.div`
  text-align: center;
  flex: 1;
`;

const PlayerName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const PlayerStatus = styled.p`
  margin: 0.5rem 0 0 0;
  color: #666;
  font-weight: 600;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 2rem 0;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`;

const Cell = styled.button`
  width: 80px;
  height: 80px;
  border: 2px solid #667eea;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;

  &:hover {
    background: #f0f2ff;
    transform: scale(1.05);
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
  }

  &.x {
    color: #e74c3c;
  }

  &.o {
    color: #3498db;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.secondary {
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  }
`;

const GameOver = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${props => {
    if (props.winner === 'X') return '#d4edda'; // Green for user win
    if (props.winner === 'O') return '#f8d7da'; // Red for computer win
    return '#fff3cd'; // Yellow for draw
  }};
  border-radius: 10px;
  border: 1px solid ${props => {
    if (props.winner === 'X') return '#c3e6cb';
    if (props.winner === 'O') return '#f5c6cb';
    return '#ffeaa7';
  }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const GameOverText = styled.h2`
  margin: 0;
  color: ${props => {
    if (props.winner === 'X') return '#155724'; // Green for user win
    if (props.winner === 'O') return '#721c24'; // Red for computer win
    return '#856404'; // Yellow for draw
  }};
  font-size: 1.8rem;
  font-weight: bold;
`;

const Game = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { board, currentPlayer, gameOver, winner, loading, firstPlayer } = useSelector((state) => state.game);

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (gameOver && winner) {
      if (winner === 'X') {
        toast.success('🎉 Congratulations! You won! 🎉');
      } else if (winner === 'O') {
        toast.error('😔 Sorry, you lost! The computer won this time.');
      }
    } else if (gameOver && !winner) {
      toast.info('🤝 It\'s a draw! Good game!');
    }
  }, [gameOver, winner]);

  const handleStartGame = (player) => {
    dispatch(startGame(player));
    setGameStarted(true);
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] === null && !gameOver && currentPlayer === 'X') {
      dispatch(makeMove({ row, col }));
    }
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    setGameStarted(false);
  };

  const renderCell = (row, col) => {
    const value = board[row][col];
    return (
      <Cell
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        disabled={value !== null || gameOver || currentPlayer !== 'X'}
        className={value}
      >
        {value === 'X' && <FaTimes />}
        {value === 'O' && <FaCircle />}
      </Cell>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <GameContainer>
      <GameCard>
        <Title>Tic-Tac-Toe</Title>
        
        {!gameStarted ? (
          <div style={{ textAlign: 'center' }}>
            <h2>Choose who goes first:</h2>
            <Controls>
              <Button onClick={() => handleStartGame('user')}>
                I go first (X)
              </Button>
              <Button onClick={() => handleStartGame('computer')}>
                Computer goes first (O)
              </Button>
            </Controls>
          </div>
        ) : (
          <>
            <GameInfo>
              <PlayerInfo>
                <PlayerName>You (X)</PlayerName>
                <PlayerStatus>
                  {currentPlayer === 'X' ? 'Your turn' : 'Waiting...'}
                </PlayerStatus>
              </PlayerInfo>
              <PlayerInfo>
                <PlayerName>Computer (O)</PlayerName>
                <PlayerStatus>
                  {currentPlayer === 'O' ? 'Thinking...' : 'Waiting...'}
                </PlayerStatus>
              </PlayerInfo>
            </GameInfo>

            <GameBoard>
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => renderCell(rowIndex, colIndex))
              )}
            </GameBoard>

            {gameOver && (
              <GameOver winner={winner}>
                <GameOverText winner={winner}>
                  {winner === 'X' ? '🎉 You Won! 🎉' : 
                   winner === 'O' ? '😔 You Lost! 😔' : 
                   '🤝 It\'s a Draw! 🤝'}
                </GameOverText>
                {winner === 'X' && (
                  <p style={{ textAlign: 'center', color: '#28a745', marginTop: '10px' }}>
                    Great job! You beat the computer!
                  </p>
                )}
                {winner === 'O' && (
                  <p style={{ textAlign: 'center', color: '#dc3545', marginTop: '10px' }}>
                    Don't worry, try again! The computer is quite smart.
                  </p>
                )}
                {!winner && (
                  <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '10px' }}>
                    Well played! It was a close game.
                  </p>
                )}
              </GameOver>
            )}

            <Controls>
              <Button onClick={handleResetGame}>
                New Game
              </Button>
            </Controls>
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default Game; 