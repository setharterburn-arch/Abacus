import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * QuickTip - Shows helpful tips to users based on context
 * 
 * Props:
 * - id: Unique ID for tracking if tip was dismissed
 * - title: Tip title
 * - message: Tip content
 * - icon: Emoji icon
 * - position: 'top' | 'bottom' (default: bottom)
 * - showOnce: If true, don't show after dismissal
 * - autoHide: Auto-hide after X seconds (0 = never)
 */
const QuickTip = ({ 
  id,
  title,
  message,
  icon = '💡',
  position = 'bottom',
  showOnce = true,
  autoHide = 0,
  children
}) => {
  const [visible, setVisible] = useState(false);
  
  const storageKey = `quicktip-${id}`;

  useEffect(() => {
    // Check if already dismissed
    if (showOnce) {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed) return;
    }
    
    // Show tip after short delay
    const showTimer = setTimeout(() => setVisible(true), 500);
    
    // Auto-hide if configured
    let hideTimer;
    if (autoHide > 0) {
      hideTimer = setTimeout(() => dismiss(), autoHide * 1000 + 500);
    }
    
    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [id, showOnce, autoHide]);

  const dismiss = () => {
    setVisible(false);
    if (showOnce) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {children}
      
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
            style={{
              position: 'absolute',
              [position]: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: position === 'bottom' ? '0.75rem' : 0,
              marginBottom: position === 'top' ? '0.75rem' : 0,
              zIndex: 100,
              minWidth: '250px',
              maxWidth: '350px'
            }}
          >
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              [position === 'top' ? 'bottom' : 'top']: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              [position === 'top' ? 'borderTop' : 'borderBottom']: '8px solid var(--color-primary)'
            }} />
            
            {/* Content */}
            <div style={{
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <strong>{title}</strong>
                </div>
                <button
                  onClick={dismiss}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    opacity: 0.7,
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.9 }}>
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * TipProvider - Manages global tips and onboarding
 */
export const tips = {
  smartScore: {
    id: 'smartscore-intro',
    title: 'SmartScore',
    message: 'Your score goes UP and DOWN based on how you answer. Reach 100 to master the skill!',
    icon: '🎯'
  },
  streak: {
    id: 'streak-bonus',
    title: 'Streak Bonus',
    message: 'Get multiple answers correct in a row for bonus points! Build your streak in the Challenge Zone (90+).',
    icon: '🔥'
  },
  dailyChallenge: {
    id: 'daily-challenge',
    title: 'Daily Challenge',
    message: 'Complete the daily challenge for bonus XP! Come back every day to build your streak.',
    icon: '🎯'
  },
  keyboard: {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    message: 'Press 1-4 to select answers quickly. Press Enter to submit and continue.',
    icon: '⌨️'
  }
};

export default QuickTip;
