import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserStats, fetchLeaderboard, fetchRecentGames } from '../store/slices/statsSlice';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaTrophy, FaChartBar, FaHistory } from 'react-icons/fa';

const StatsContainer = styled.div`
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

const StatsCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background: #667eea;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }

  &:hover {
    background: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const RecentGamesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GameItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameInfo = styled.div`
  flex: 1;
`;

const GameResult = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  
  &.win {
    background: #d4edda;
    color: #155724;
  }
  
  &.loss {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.draw {
    background: #fff3cd;
    color: #856404;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const Statistics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userStats, leaderboard, recentGames, loading } = useSelector((state) => state.stats);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(fetchUserStats());
    dispatch(fetchLeaderboard());
    dispatch(fetchRecentGames());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (loading) {
      toast.info('Loading statistics...');
    }
  }, [loading]);

  if (!user) {
    return null;
  }

  const totalGames = userStats?.wins + userStats?.losses + userStats?.draws || 0;
  const winRate = totalGames > 0 ? ((userStats?.wins / totalGames) * 100).toFixed(1) : 0;

  return (
    <StatsContainer>
      <StatsCard>
        <Title>
          <FaChartBar />
          Statistics
        </Title>

        {loading ? (
          <LoadingSpinner>Loading statistics...</LoadingSpinner>
        ) : (
          <>
            <StatsGrid>
              <StatCard>
                <StatValue>{userStats?.wins || 0}</StatValue>
                <StatLabel>Wins</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{userStats?.losses || 0}</StatValue>
                <StatLabel>Losses</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{userStats?.draws || 0}</StatValue>
                <StatLabel>Draws</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{winRate}%</StatValue>
                <StatLabel>Win Rate</StatLabel>
              </StatCard>
            </StatsGrid>

            <Section>
              <SectionTitle>
                <FaTrophy />
                Leaderboard
              </SectionTitle>
              <LeaderboardTable>
                <thead>
                  <tr>
                    <TableHeader>Rank</TableHeader>
                    <TableHeader>Player</TableHeader>
                    <TableHeader>Wins</TableHeader>
                    <TableHeader>Losses</TableHeader>
                    <TableHeader>Draws</TableHeader>
                    <TableHeader>Win Rate</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard?.map((player, index) => {
                    const total = player.wins + player.losses + player.draws;
                    const rate = total > 0 ? ((player.wins / total) * 100).toFixed(1) : 0;
                    return (
                      <TableRow key={player.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.wins}</TableCell>
                        <TableCell>{player.losses}</TableCell>
                        <TableCell>{player.draws}</TableCell>
                        <TableCell>{rate}%</TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </LeaderboardTable>
            </Section>

            <Section>
              <SectionTitle>
                <FaHistory />
                Recent Games
              </SectionTitle>
              <RecentGamesList>
                {recentGames?.map((game) => (
                  <GameItem key={game.id}>
                    <GameInfo>
                      <div><strong>Game #{game.id}</strong></div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {new Date(game.createdAt).toLocaleDateString()}
                      </div>
                    </GameInfo>
                    <GameResult className={game.result.toLowerCase()}>
                      {game.result}
                    </GameResult>
                  </GameItem>
                ))}
                {(!recentGames || recentGames.length === 0) && (
                  <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    No recent games found
                  </div>
                )}
              </RecentGamesList>
            </Section>
          </>
        )}
      </StatsCard>
    </StatsContainer>
  );
};

export default Statistics; 