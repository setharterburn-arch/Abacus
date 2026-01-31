import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * StreakCelebration - Shows celebration effects for answer streaks
 * 
 * Props:
 * - streak: Current streak count
 * - show: Whether to show the celebration
 * - onComplete: Callback when animation completes
 */
const StreakCelebration = ({ streak, show, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && streak > 0) {
      setVisible(true);
      
      // Fire confetti for milestone streaks
      if (streak >= 5 && streak % 5 === 0) {
        fireConfetti(streak);
      }
      
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, streak]);

  const fireConfetti = (count) => {
    const particleCount = Math.min(count * 10, 100);
    
    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f97316', '#22c55e', '#3b82f6', '#a855f7']
    });

    // Extra burst for big milestones
    if (count >= 10) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 200);
    }
  };

  const getMessage = () => {
    if (streak >= 20) return { emoji: '🌟', text: 'LEGENDARY!', color: '#a855f7' };
    if (streak >= 15) return { emoji: '👑', text: 'UNSTOPPABLE!', color: '#f97316' };
    if (streak >= 10) return { emoji: '🔥', text: 'ON FIRE!', color: '#ef4444' };
    if (streak >= 7) return { emoji: '💪', text: 'CRUSHING IT!', color: '#22c55e' };
    if (streak >= 5) return { emoji: '⚡', text: 'HOT STREAK!', color: '#fbbf24' };
    if (streak >= 3) return { emoji: '✨', text: 'NICE!', color: '#3b82f6' };
    return { emoji: '👍', text: 'CORRECT!', color: '#22c55e' };
  };

  const { emoji, text, color } = getMessage();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none',
            textAlign: 'center'
          }}
        >
          {/* Streak badge */}
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '4rem',
              marginBottom: '0.5rem',
              textShadow: '0 0 20px rgba(255,255,255,0.8)'
            }}
          >
            {emoji}
          </motion.div>
          
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: color,
              textShadow: `0 0 10px ${color}40`,
              marginBottom: '0.25rem'
            }}
          >
            {text}
          </motion.div>
          
          {/* Streak counter */}
          {streak >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              <span>🔥</span>
              <span>{streak} in a row!</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * SmartScoreBadge - Animated badge showing current SmartScore level
 */
export const SmartScoreBadge = ({ score, size = 'medium' }) => {
  const getLevel = () => {
    if (score >= 100) return { label: 'MASTERY', color: '#a855f7', icon: '👑' };
    if (score >= 90) return { label: 'Challenge Zone', color: '#f97316', icon: '🔥' };
    if (score >= 80) return { label: 'Proficient', color: '#22c55e', icon: '✅' };
    if (score >= 50) return { label: 'Building', color: '#3b82f6', icon: '📈' };
    return { label: 'Starting', color: '#6b7280', icon: '🌱' };
  };

  const { label, color, icon } = getLevel();
  
  const sizes = {
    small: { padding: '0.25rem 0.75rem', fontSize: '0.8rem' },
    medium: { padding: '0.5rem 1rem', fontSize: '1rem' },
    large: { padding: '0.75rem 1.5rem', fontSize: '1.25rem' }
  };

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        border: `2px solid ${color}`,
        borderRadius: '999px',
        fontWeight: 'bold',
        color: color,
        ...sizes[size]
      }}
    >
      <span>{icon}</span>
      <span>{score}</span>
      <span style={{ opacity: 0.7 }}>|</span>
      <span style={{ fontSize: '0.85em' }}>{label}</span>
    </motion.div>
  );
};

/**
 * DailyStreak - Shows daily practice streak
 */
export const DailyStreak = ({ days }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
        padding: '0.5rem 1rem',
        borderRadius: '999px',
        fontWeight: 'bold',
        color: '#92400e'
      }}
    >
      <motion.span
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        🔥
      </motion.span>
      <span>{days} day streak!</span>
    </motion.div>
  );
};

/**
 * MasteryProgress - Visual progress toward mastery
 */
export const MasteryProgress = ({ current, max = 100, showMilestones = true }) => {
  const milestones = [
    { value: 80, label: 'Proficient', color: '#22c55e' },
    { value: 90, label: 'Challenge', color: '#f97316' },
    { value: 100, label: 'Mastery', color: '#a855f7' }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Progress bar */}
      <div style={{
        position: 'relative',
        height: '12px',
        background: '#e5e7eb',
        borderRadius: '999px',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(current, max)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: current >= 90 ? 'linear-gradient(90deg, #22c55e, #f97316, #a855f7)' :
                        current >= 80 ? 'linear-gradient(90deg, #22c55e, #22c55e)' :
                        'linear-gradient(90deg, #3b82f6, #22c55e)',
            borderRadius: '999px'
          }}
        />
        
        {/* Milestone markers */}
        {showMilestones && milestones.map(m => (
          <div
            key={m.value}
            style={{
              position: 'absolute',
              left: `${m.value}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              background: current >= m.value ? m.color : '#9ca3af',
              transform: 'translateX(-50%)'
            }}
          />
        ))}
      </div>
      
      {/* Milestone labels */}
      {showMilestones && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          paddingLeft: '75%',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          {milestones.map(m => (
            <div 
              key={m.value}
              style={{
                position: 'absolute',
                left: `${m.value}%`,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                color: current >= m.value ? m.color : 'var(--color-text-muted)',
                fontWeight: current >= m.value ? 'bold' : 'normal'
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreakCelebration;
