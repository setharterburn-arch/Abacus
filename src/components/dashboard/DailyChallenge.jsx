import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuestion } from '../../services/questionGenerators';
import confetti from 'canvas-confetti';

/**
 * DailyChallenge - A daily math challenge for bonus XP
 * 
 * Features:
 * - One challenge per day (resets at midnight)
 * - Progressively harder questions
 * - Bonus XP for completion
 * - Streak tracking for consecutive days
 */
const DailyChallenge = ({ userId, grade = 3, onComplete }) => {
  const [phase, setPhase] = useState('intro'); // intro, active, complete
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const TOTAL_QUESTIONS = 5;
  const XP_REWARD = 50;
  const STREAK_BONUS = 10;

  // Check if already completed today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = localStorage.getItem(`daily-challenge-${userId}`);
    const savedStreak = parseInt(localStorage.getItem(`daily-streak-${userId}`) || '0');
    
    setStreak(savedStreak);
    
    if (lastCompleted === today) {
      setAlreadyCompleted(true);
    }
  }, [userId]);

  // Generate daily questions (seeded by date for consistency)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    
    // Use seed to pick consistent topics
    const topics = ['addition', 'subtraction', 'multiplication', 'division', 'fractions'];
    const difficulties = ['easy', 'medium', 'medium', 'hard', 'hard'];
    
    const qs = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const topicIndex = (seed + i) % topics.length;
      const q = generateQuestion(topics[topicIndex], grade, difficulties[i]);
      qs.push(q);
    }
    
    setQuestions(qs);
  }, [grade]);

  const handleStart = () => {
    setPhase('active');
  };

  const handleAnswer = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const currentQ = questions[currentIndex];
    const isCorrect = String(answer) === String(currentQ.answer);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeChallenge();
    }
  };

  const completeChallenge = () => {
    setPhase('complete');
    
    // Save completion
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastCompleted = localStorage.getItem(`daily-challenge-${userId}`);
    
    // Update streak
    let newStreak = 1;
    if (lastCompleted === yesterday) {
      newStreak = streak + 1;
    }
    
    setStreak(newStreak);
    localStorage.setItem(`daily-challenge-${userId}`, today);
    localStorage.setItem(`daily-streak-${userId}`, String(newStreak));
    
    // Fire confetti for good scores
    if (score >= 4) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Calculate XP earned
    const totalXP = XP_REWARD + (newStreak > 1 ? STREAK_BONUS * (newStreak - 1) : 0);
    
    onComplete?.({
      score,
      total: TOTAL_QUESTIONS,
      streak: newStreak,
      xpEarned: totalXP
    });
  };

  const currentQuestion = questions[currentIndex];

  // Already completed today
  if (alreadyCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          Challenge Complete!
        </h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          You've already completed today's challenge.
        </p>
        {streak > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            fontWeight: 'bold',
            color: '#92400e'
          }}>
            🔥 {streak} day streak!
          </div>
        )}
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Come back tomorrow for a new challenge!
        </p>
      </motion.div>
    );
  }

  // Intro screen
  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Daily Challenge
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Complete {TOTAL_QUESTIONS} questions for bonus XP!
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {XP_REWARD}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Base XP
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>
              +{STREAK_BONUS}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Per streak day
            </div>
          </div>
        </div>
        
        {streak > 0 && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)'
          }}>
            🔥 Current streak: <strong>{streak} days</strong>
          </div>
        )}
        
        <button onClick={handleStart} className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
          Start Challenge
        </button>
      </motion.div>
    );
  }

  // Complete screen
  if (phase === 'complete') {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const totalXP = XP_REWARD + (streak > 1 ? STREAK_BONUS * (streak - 1) : 0);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '💪'}
        </div>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Challenge Complete!
        </h2>
        
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f97316' : 'var(--color-text)',
          marginBottom: '1rem'
        }}>
          {score} / {TOTAL_QUESTIONS} correct
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>
              +{totalXP} XP
            </div>
            <div style={{ fontSize: '0.75rem', color: '#92400e' }}>Earned</div>
          </div>
          
          <div style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
              🔥 {streak}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>Day Streak</div>
          </div>
        </div>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Come back tomorrow to keep your streak going!
        </p>
      </motion.div>
    );
  }

  // Active quiz
  if (!currentQuestion) return null;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Question {currentIndex + 1} of {TOTAL_QUESTIONS}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 'bold',
          color: 'var(--color-primary)'
        }}>
          ⭐ {score}
        </div>
      </div>
      
      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'var(--color-bg)',
        borderRadius: '999px',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}>
        <motion.div
          animate={{ width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
          style={{
            height: '100%',
            background: 'var(--color-primary)',
            borderRadius: '999px'
          }}
        />
      </div>
      
      {/* Question */}
      <h3 style={{
        fontSize: '1.3rem',
        marginBottom: '1.5rem',
        color: 'var(--color-text)',
        lineHeight: 1.4
      }}>
        {currentQuestion.question}
      </h3>
      
      {/* Options */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {currentQuestion.options?.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = String(option) === String(currentQuestion.answer);
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;
          
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: showFeedback ? 1 : 1.02 }}
              whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              style={{
                padding: '1rem',
                textAlign: 'left',
                fontSize: '1.1rem',
                background: showCorrect ? '#22c55e' :
                  showIncorrect ? '#ef4444' :
                  isSelected ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: (showCorrect || showIncorrect || isSelected) ? 'white' : 'var(--color-text)',
                border: `2px solid ${showCorrect ? '#22c55e' : showIncorrect ? '#ef4444' : 'var(--color-text)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: showFeedback ? 'default' : 'pointer'
              }}
            >
              {option}
              {showCorrect && ' ✓'}
              {showIncorrect && ' ✗'}
            </motion.button>
          );
        })}
      </div>
      
      {/* Next button */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '1.5rem' }}
          >
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyChallenge;
