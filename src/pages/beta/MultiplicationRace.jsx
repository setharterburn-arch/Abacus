import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

/**
 * MultiplicationRace - Speed-based multiplication tables game
 * 
 * Students race against the clock to answer as many multiplication
 * problems as possible. Features power-ups, combos, and high scores.
 */

const generateQuestion = (tables = [2, 3, 4, 5, 6, 7, 8, 9, 10]) => {
  const table = tables[Math.floor(Math.random() * tables.length)];
  const multiplier = Math.floor(Math.random() * 12) + 1;
  return {
    a: table,
    b: multiplier,
    answer: table * multiplier,
    question: `${table} × ${multiplier}`
  };
};

const GAME_DURATION = 60; // seconds
const COMBO_THRESHOLD = 3;

const MultiplicationRace = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  
  // Game state
  const [phase, setPhase] = useState('setup'); // setup, playing, finished
  const [selectedTables, setSelectedTables] = useState([2, 3, 4, 5]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('multiplication-race-highscore') || '0');
  });

  // Timer effect
  useEffect(() => {
    if (phase !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phase]);

  // Focus input when question changes
  useEffect(() => {
    if (phase === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion, phase]);

  const startGame = () => {
    if (selectedTables.length === 0) return;
    
    setPhase('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setUserAnswer('');
    setCurrentQuestion(generateQuestion(selectedTables));
  };

  const endGame = useCallback(() => {
    setPhase('finished');
    
    // Update high score
    if (score > highScore) {
      localStorage.setItem('multiplication-race-highscore', String(score));
      setHighScore(score);
      
      // Celebrate new high score
      confetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.6 }
      });
    }
  }, [score, highScore]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer || phase !== 'playing') return;
    
    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    setQuestionsAnswered(q => q + 1);
    
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setCorrectAnswers(c => c + 1);
      
      // Score calculation with combo bonus
      const comboMultiplier = Math.floor(newCombo / COMBO_THRESHOLD) + 1;
      const points = 10 * comboMultiplier;
      setScore(s => s + points);
      
      setFeedback({ correct: true, points, combo: newCombo });
      
      // Quick celebration for big combos
      if (newCombo > 0 && newCombo % 5 === 0) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } else {
      setCombo(0);
      setFeedback({ correct: false, answer: currentQuestion.answer });
    }
    
    // Next question
    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      setCurrentQuestion(generateQuestion(selectedTables));
    }, isCorrect ? 100 : 800);
  };

  const toggleTable = (table) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table].sort((a, b) => a - b)
    );
  };

  const allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Setup screen
  if (phase === 'setup') {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', 
        minHeight: '100vh', 
        padding: '2rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              🏎️ Multiplication Race
            </h1>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
              Answer as many as you can in 60 seconds!
            </p>
          </motion.div>
          
          {highScore > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                padding: '1rem',
                borderRadius: '1rem',
                marginBottom: '2rem',
                display: 'inline-block'
              }}
            >
              🏆 High Score: <strong>{highScore}</strong>
            </motion.div>
          )}
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Select Tables to Practice:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem'
            }}>
              {allTables.map(table => (
                <motion.button
                  key={table}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleTable(table)}
                  style={{
                    padding: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: selectedTables.includes(table) 
                      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                      : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  ×{table}
                </motion.button>
              ))}
            </div>
            
            <button
              onClick={() => setSelectedTables(allTables)}
              style={{
                marginTop: '1rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Select All
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            disabled={selectedTables.length === 0}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: selectedTables.length > 0 
                ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                : 'gray',
              border: 'none',
              borderRadius: '1rem',
              color: 'white',
              cursor: selectedTables.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            🚀 Start Race!
          </motion.button>
          
          <button
            onClick={() => navigate('/beta')}
            style={{
              display: 'block',
              margin: '2rem auto 0',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer'
            }}
          >
            ← Back to Beta
          </button>
        </div>
      </div>
    );
  }

  // Playing screen
  if (phase === 'playing') {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', 
        minHeight: '100vh', 
        padding: '2rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: timeLeft <= 10 ? '#ef4444' : 'white'
            }}>
              ⏱️ {timeLeft}s
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              fontWeight: 'bold'
            }}>
              Score: {score}
            </div>
          </div>
          
          {/* Timer bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '999px',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <motion.div
              animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
              style={{
                height: '100%',
                background: timeLeft <= 10 
                  ? '#ef4444' 
                  : 'linear-gradient(90deg, #22c55e, #3b82f6)',
                borderRadius: '999px'
              }}
            />
          </div>
          
          {/* Combo indicator */}
          <AnimatePresence>
            {combo >= COMBO_THRESHOLD && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  marginBottom: '1rem'
                }}
              >
                🔥 {combo}x Combo! (+{Math.floor(combo / COMBO_THRESHOLD)}x bonus)
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Question */}
          <motion.div
            key={currentQuestion?.question}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}
          >
            {currentQuestion?.question}
          </motion.div>
          
          {/* Answer input */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{
                width: '150px',
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(255,255,255,0.1)',
                border: '3px solid rgba(255,255,255,0.3)',
                borderRadius: '1rem',
                color: 'white',
                outline: 'none'
              }}
              autoFocus
              autoComplete="off"
            />
            <button type="submit" style={{ display: 'none' }} />
          </form>
          
          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  marginTop: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: feedback.correct ? '#22c55e' : '#ef4444'
                }}
              >
                {feedback.correct 
                  ? `+${feedback.points} points!`
                  : `✗ It was ${feedback.answer}`
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Finished screen
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', 
      minHeight: '100vh', 
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            🏁 Race Complete!
          </h1>
          
          {score > highScore && score > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              style={{
                fontSize: '1.5rem',
                color: '#fbbf24',
                marginBottom: '1rem'
              }}
            >
              🎉 NEW HIGH SCORE! 🎉
            </motion.div>
          )}
        </motion.div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {score}
          </div>
          <div style={{ opacity: 0.7, marginBottom: '1.5rem' }}>points</div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {correctAnswers}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Correct</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {questionsAnswered}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Attempted</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {maxCombo}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Max Combo</div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('setup')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              borderRadius: '1rem',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            🔄 Play Again
          </motion.button>
          
          <button
            onClick={() => navigate('/beta')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '1rem',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplicationRace;
