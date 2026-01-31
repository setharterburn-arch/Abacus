import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';

/**
 * Leaderboard - Shows top students by XP or mastery
 * 
 * Props:
 * - classId: Optional class filter
 * - type: 'xp' | 'mastery' | 'streak'
 * - limit: Number of entries to show
 * - currentUserId: Highlight current user
 */
const Leaderboard = ({ 
  classId = null, 
  type = 'xp', 
  limit = 10,
  currentUserId = null 
}) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all'); // 'today', 'week', 'month', 'all'

  useEffect(() => {
    loadLeaderboard();
  }, [classId, type, period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    
    try {
      // For now, generate mock data since we don't have XP tracking in DB yet
      // In production, this would query from a leaderboard table
      const mockData = generateMockLeaderboard();
      setEntries(mockData);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboard = () => {
    const names = [
      'Alex Math Wizard', 'Sam Calculator', 'Jordan Numbers',
      'Casey Brain', 'Riley Quick', 'Morgan Genius',
      'Taylor Smart', 'Drew Flash', 'Avery Bright', 'Quinn Sharp'
    ];
    
    return names.slice(0, limit).map((name, i) => ({
      id: `mock-${i}`,
      name,
      avatar: `🎭`,
      value: Math.floor(Math.random() * 1000) + (limit - i) * 100,
      rank: i + 1,
      change: Math.floor(Math.random() * 5) - 2, // -2 to +2 rank change
      isCurrentUser: false
    })).sort((a, b) => b.value - a.value).map((entry, i) => ({
      ...entry,
      rank: i + 1
    }));
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'xp': return 'XP';
      case 'mastery': return 'Skills Mastered';
      case 'streak': return 'Day Streak';
      default: return 'Points';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'xp': return '⭐';
      case 'mastery': return '👑';
      case 'streak': return '🔥';
      default: return '📊';
    }
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return 'var(--color-text-muted)';
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid var(--color-bg)'
      }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {getTypeIcon()} Leaderboard
        </h3>
        
        {/* Period selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['today', 'week', 'month', 'all'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                background: period === p ? 'var(--color-primary)' : 'var(--color-bg)',
                color: period === p ? 'white' : 'var(--color-text)',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer'
              }}
            >
              {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Type label */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: 'var(--color-text-muted)',
        marginBottom: '1rem'
      }}>
        Ranked by {getTypeLabel()}
      </div>

      {/* Leaderboard entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: entry.isCurrentUser 
                  ? 'linear-gradient(90deg, var(--color-primary)10, transparent)'
                  : entry.rank <= 3 ? `${getRankColor(entry.rank)}15` : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: entry.isCurrentUser ? '2px solid var(--color-primary)' : 'none'
              }}
            >
              {/* Rank */}
              <div style={{
                width: '40px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: entry.rank <= 3 ? '1.5rem' : '1rem',
                color: getRankColor(entry.rank)
              }}>
                {getRankEmoji(entry.rank)}
              </div>
              
              {/* Avatar & Name */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  {entry.avatar}
                </div>
                <span style={{ 
                  fontWeight: entry.isCurrentUser ? 'bold' : 'normal',
                  color: 'var(--color-text)'
                }}>
                  {entry.name}
                  {entry.isCurrentUser && ' (You)'}
                </span>
              </div>
              
              {/* Value */}
              <div style={{
                fontWeight: 'bold',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {entry.value.toLocaleString()}
                
                {/* Rank change indicator */}
                {entry.change !== 0 && (
                  <span style={{
                    fontSize: '0.75rem',
                    color: entry.change > 0 ? '#22c55e' : '#ef4444'
                  }}>
                    {entry.change > 0 ? '▲' : '▼'}{Math.abs(entry.change)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
          <p>No entries yet. Start practicing to join the leaderboard!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
