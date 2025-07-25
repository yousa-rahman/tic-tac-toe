import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, clearError } from '../store/slices/statsSlice';

const Statistics = ({ navigation }) => {
  const dispatch = useDispatch();
  const { gamesPlayed, gamesWon, gamesLost, gamesDrawn, winRate, loading, error } = useSelector((state) => state.stats);

  useEffect(() => {
    console.log('📊 Loading statistics...');
    dispatch(fetchStats());
  }, [dispatch]);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      console.error('❌ Stats error:', error);
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const getWinRateColor = (rate) => {
    if (rate >= 70) return '#28a745';
    if (rate >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getAchievementIcon = (rate) => {
    if (rate >= 80) return '🏆';
    if (rate >= 60) return '🥇';
    if (rate >= 40) return '🥈';
    if (rate >= 20) return '🥉';
    return '🎯';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Statistics</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Game')}>
          <Text style={styles.backButton}>← Back to Game</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📈 Your Game Statistics</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>🔄 Loading statistics...</Text>
            </View>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{gamesPlayed}</Text>
                  <Text style={styles.statLabel}>Games Played</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#28a745' }]}>{gamesWon}</Text>
                  <Text style={styles.statLabel}>Games Won</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#dc3545' }]}>{gamesLost}</Text>
                  <Text style={styles.statLabel}>Games Lost</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#ffc107' }]}>{gamesDrawn}</Text>
                  <Text style={styles.statLabel}>Games Drawn</Text>
                </View>
              </View>

              <View style={styles.winRateContainer}>
                <Text style={styles.winRateLabel}>Win Rate</Text>
                <View style={styles.winRateBar}>
                  <View 
                    style={[
                      styles.winRateFill, 
                      { 
                        width: `${Math.min(winRate, 100)}%`,
                        backgroundColor: getWinRateColor(winRate)
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.winRateText, { color: getWinRateColor(winRate) }]}>
                  {winRate.toFixed(1)}%
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.achievementCard}>
          <Text style={styles.cardTitle}>🏆 Achievements</Text>
          
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>{getAchievementIcon(winRate)}</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>
                {winRate >= 80 ? 'Master Player' :
                 winRate >= 60 ? 'Skilled Player' :
                 winRate >= 40 ? 'Good Player' :
                 winRate >= 20 ? 'Learning Player' : 'Beginner'}
              </Text>
              <Text style={styles.achievementDescription}>
                {winRate >= 80 ? 'You are a Tic-Tac-Toe master!' :
                 winRate >= 60 ? 'You have excellent skills!' :
                 winRate >= 40 ? 'You are getting better!' :
                 winRate >= 20 ? 'Keep practicing!' : 'Start your journey!'}
              </Text>
            </View>
          </View>

          {gamesPlayed >= 10 && (
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🎮</Text>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Dedicated Player</Text>
                <Text style={styles.achievementDescription}>You have played 10+ games!</Text>
              </View>
            </View>
          )}

          {gamesWon >= 5 && (
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>⭐</Text>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Winner</Text>
                <Text style={styles.achievementDescription}>You have won 5+ games!</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  winRateContainer: {
    alignItems: 'center',
  },
  winRateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  winRateBar: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  winRateFill: {
    height: '100%',
    borderRadius: 10,
  },
  winRateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
});

export default Statistics; 