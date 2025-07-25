import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startGameAPI, makeMoveAPI, resetGame, clearError } from '../store/slices/gameSlice';
import { updateStats } from '../store/slices/statsSlice';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 60) / 3);

const TicTacToe = ({ navigation }) => {
  const dispatch = useDispatch();
  const { board, currentPlayer, gameOver, winner, firstPlayer, loading, error } = useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      console.error('❌ Game error:', error);
      Alert.alert('Game Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (gameOver) {
      let result;
      if (winner === 'X') {
        result = firstPlayer === 'user' ? 'win' : 'loss';
      } else if (winner === 'O') {
        result = firstPlayer === 'computer' ? 'win' : 'loss';
      } else {
        result = 'draw';
      }
      dispatch(updateStats({ result }));
    }
  }, [gameOver, winner, firstPlayer, dispatch]);

  const handleCellPress = async (row, col) => {
    if (currentPlayer === 'X' && !gameOver && !loading) {
      try {
        await dispatch(makeMoveAPI({ row, col })).unwrap();
      } catch (error) {
        console.error('❌ Failed to make move:', error);
      }
    }
  };

  const handleStartGame = async (player) => {
    try {
      await dispatch(startGameAPI(player)).unwrap();
    } catch (error) {
      console.error('❌ Failed to start game:', error);
    }
  };

  const handleResetGame = () => {
    dispatch(resetGame());
  };

  const renderCell = (cell, row, col) => {
    const isDisabled = cell !== null || gameOver || currentPlayer === 'O' || loading;
    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          cell === 'X' && styles.xCell,
          cell === 'O' && styles.oCell,
          isDisabled && styles.disabledCell,
        ]}
        onPress={() => handleCellPress(row, col)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.cellText, cell === 'X' ? styles.xText : styles.oText]}>
          {cell}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!firstPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎮</Text>
            <Text style={styles.headerTitle}>TicTacToe</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Statistics')}>
              <Text style={styles.headerButtonText}>Stats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => dispatch({ type: 'auth/logout' })}>
              <Text style={styles.headerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <Text style={styles.title}>🎯 Welcome, {user?.name || 'Player'}! 🎯</Text>
            <Text style={styles.subtitle}>Ready to challenge the computer?</Text>
          </View>

          <View style={styles.choiceContainer}>
            <Text style={styles.choiceTitle}>Choose who goes first:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.startButton, loading && styles.buttonDisabled]}
                onPress={() => handleStartGame('user')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonGradient}>
                  <Text style={styles.startButtonText}>
                    {loading ? '🔄 Starting...' : '🎯 I go first (X)'}
                  </Text>
                  <Text style={styles.buttonSubtext}>You start the game</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.startButton, loading && styles.buttonDisabled]}
                onPress={() => handleStartGame('computer')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonGradient}>
                  <Text style={styles.startButtonText}>
                    {loading ? '🔄 Starting...' : '🤖 Computer goes first (O)'}
                  </Text>
                  <Text style={styles.buttonSubtext}>Computer starts the game</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🎮</Text>
          <Text style={styles.headerTitle}>TicTacToe</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Statistics')}>
            <Text style={styles.headerButtonText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => dispatch({ type: 'auth/logout' })}>
            <Text style={styles.headerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.gameInfo}>
          <View style={styles.playerCard}>
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarText}>👤</Text>
            </View>
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>You (X)</Text>
              <Text style={[
                styles.playerStatus,
                currentPlayer === 'X' && styles.activeStatus
              ]}>
                {currentPlayer === 'X' ? '🎯 Your turn' : '⏳ Waiting...'}
              </Text>
            </View>
          </View>
          <View style={styles.vsDivider}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.playerCard}>
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarText}>🤖</Text>
            </View>
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>Computer (O)</Text>
              <Text style={[
                styles.playerStatus,
                currentPlayer === 'O' && styles.activeStatus
              ]}>
                {currentPlayer === 'O' ? '🤔 Thinking...' : '⏳ Waiting...'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.boardWrapper}>
          <View style={styles.board}>
            {board.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.boardRow}>
                {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
              </View>
            ))}
          </View>

          {gameOver && (
            <View style={[
              styles.gameOver,
              winner === 'X' && styles.winOverlay,
              winner === 'O' && styles.loseOverlay,
              !winner && styles.drawOverlay,
            ]}>
              <View style={styles.gameOverCard}>
                <Text style={[
                  styles.gameOverText,
                  winner === 'X' ? styles.winText :
                    winner === 'O' ? styles.loseText :
                      styles.drawText,
                ]}>
                  {winner === 'X' ? '🎉 You Win! 🎉' :
                    winner === 'O' ? '😔 Computer Wins! 😔' :
                      '🤝 It\'s a Draw! 🤝'}
                </Text>
                <Text style={styles.gameOverSubtext}>
                  {winner === 'X' ? 'Amazing job! You beat the computer!' :
                    winner === 'O' ? 'Don\'t worry, try again!' :
                      'Well played! It was a close game!'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleResetGame} 
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>🔄 New Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  choiceTitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  startButton: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerCard: {
    alignItems: 'center',
    flex: 1,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerAvatarText: {
    fontSize: 24,
  },
  playerDetails: {
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  playerStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeStatus: {
    color: '#4ecdc4',
    fontWeight: '600',
  },
  vsDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  vsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  board: {
    width: CELL_SIZE * 3 + 20,
    height: CELL_SIZE * 3 + 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 2,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  xCell: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#ff6b6b',
  },
  oCell: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderColor: '#4ecdc4',
  },
  disabledCell: {
    opacity: 0.5,
  },
  cellText: {
    fontSize: CELL_SIZE * 0.6,
    fontWeight: 'bold',
  },
  xText: {
    color: '#ff6b6b',
  },
  oText: {
    color: '#4ecdc4',
  },
  gameOver: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 20,
  },
  winOverlay: {
    backgroundColor: 'rgba(78, 205, 196, 0.9)',
  },
  loseOverlay: {
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
  },
  drawOverlay: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
  },
  gameOverCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  winText: {
    color: '#2d3436',
  },
  loseText: {
    color: '#2d3436',
  },
  drawText: {
    color: '#2d3436',
  },
  gameOverSubtext: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TicTacToe; 