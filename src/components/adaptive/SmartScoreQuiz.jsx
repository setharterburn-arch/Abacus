import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { smartScore } from '../../services/smartScore';
import curriculumData from '../../data/curriculum.json';
import { QuestionRenderer } from '../questions';

/**
 * Check if answer is correct for any question type
 */
const checkAnswer = (question, userAnswer) => {
  if (userAnswer === null || userAnswer === undefined) return false;
  
  const type = question.type || 'multiple-choice';
  const correctAnswer = question.answer;
  
  switch (type) {
    case 'number-line':
      const tolerance = question.tolerance || 0.05;
      return Math.abs(userAnswer - correctAnswer) <= tolerance;
    
    case 'fraction-shade':
      return userAnswer === correctAnswer;
    
    case 'drag-sort':
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
      return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
    
    case 'array-builder':
      if (typeof correctAnswer === 'number') {
        return userAnswer?.product === correctAnswer;
      }
      return userAnswer?.rows === correctAnswer?.rows && userAnswer?.cols === correctAnswer?.cols;
    
    case 'multiple-choice':
    default:
      return String(userAnswer) === String(correctAnswer);
  }
};

/**
 * SmartScore Quiz Component
 * IXL-style mastery-based quiz with adaptive scoring
 */
const SmartScoreQuiz = ({ 
  studentId, 
  skillId,
  skillName,
  topic,
  grade,
  onComplete,
  onExit,
  initialScore = 0 
}) => {
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // SmartScore state
  const [score, setScore] = useState(initialScore);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('');
  const [milestone, setMilestone] = useState(null);
  const [progress, setProgress] = useState(smartScore._getProgress(initialScore));
  
  // Stats
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());
  
  // Animation state
  const [scoreAnimation, setScoreAnimation] = useState(null);

  // Load questions for this skill
  useEffect(() => {
    const skillSet = curriculumData.find(s => s.id === skillId);
    if (skillSet && skillSet.questions) {
      // Shuffle questions
      const shuffled = [...skillSet.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } else {
      // Fallback: get questions from topic
      const topicSets = curriculumData.filter(s => 
        s.topic?.toLowerCase() === topic?.toLowerCase() &&
        (grade === undefined || s.grade === grade)
      );
      const allQuestions = topicSets.flatMap(s => 
        (s.questions || []).map(q => ({ ...q, skillId: s.id }))
      );
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
  }, [skillId, topic, grade]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    // Use universal answer checker for all question types
    const correct = checkAnswer(currentQuestion, answer);
    const difficulty = currentQuestion.difficulty || 1;
    
    // Calculate new SmartScore
    const result = smartScore.calculateScore(score, correct, streak, difficulty);
    
    // Animate score change
    const scoreDelta = result.newScore - score;
    setScoreAnimation({
      delta: scoreDelta,
      positive: scoreDelta > 0
    });
    setTimeout(() => setScoreAnimation(null), 1500);
    
    // Update state
    setScore(result.newScore);
    setStreak(result.streak);
    setMessage(result.message);
    setMilestone(result.milestone);
    setProgress(result.progress);
    
    setTotalAnswered(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Check for mastery
    if (result.newScore >= 100) {
      setTimeout(() => {
        onComplete?.({
          score: result.newScore,
          totalAnswered,
          correctCount: correctCount + (correct ? 1 : 0),
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          mastered: true
        });
      }, 2000);
    }
  }, [showFeedback, currentQuestion, score, streak, totalAnswered, correctCount, startTime, onComplete]);

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    setMessage('');
    setMilestone(null);
    
    // Cycle through questions (infinite practice until mastery)
    setCurrentIndex((currentIndex + 1) % questions.length);
  };

  const handleExit = () => {
    onExit?.({
      score,
      totalAnswered,
      correctCount,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      mastered: score >= 100
    });
  };

  if (!currentQuestion) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
        <p>Loading questions...</p>
      </div>
    );
  }

  const estimatedRemaining = smartScore.estimateQuestionsToTarget(score, 100);

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* SmartScore Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)' }}>
              {skillName || topic}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {progress.icon} {progress.label}
            </span>
          </div>
          
          {/* SmartScore Display */}
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: progress.color,
              lineHeight: 1
            }}>
              {Math.round(score)}
              <AnimatePresence>
                {scoreAnimation && (
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      right: -30,
                      top: 0,
                      fontSize: '1rem',
                      color: scoreAnimation.positive ? '#4CAF50' : '#f44336'
                    }}
                  >
                    {scoreAnimation.positive ? '+' : ''}{scoreAnimation.delta.toFixed(1)}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              SmartScore
            </div>
          </div>
        </div>

        {/* SmartScore Progress Bar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100%',
            height: '12px',
            background: 'var(--color-bg)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Milestone markers */}
            <div style={{
              position: 'absolute',
              left: '80%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#4CAF50',
              opacity: 0.5
            }} />
            <div style={{
              position: 'absolute',
              left: '90%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#9C27B0',
              opacity: 0.5
            }} />
            
            {/* Score fill */}
            <motion.div 
              animate={{ width: `${score}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, #2196F3 0%, #4CAF50 80%, #9C27B0 90%, #FFD700 100%)`,
                backgroundSize: '100% 100%',
                borderRadius: '999px'
              }} 
            />
          </div>
          
          {/* Labels */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            marginTop: '4px'
          }}>
            <span>0</span>
            <span style={{ marginLeft: '56%' }}>80</span>
            <span style={{ marginLeft: '4%' }}>90</span>
            <span>100</span>
          </div>
        </div>

        {/* Streak indicator */}
        {streak > 0 && (
          <div style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: streak >= 5 ? '#FFD700' : '#4CAF50'
          }}>
            🔥 {streak} correct in a row!
            {score >= 90 && streak < 8 && (
              <span style={{ color: 'var(--color-text-muted)' }}>
                ({8 - (streak % 8)} more for boost)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Question */}
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Use QuestionRenderer for interactive types, inline for multiple choice */}
        {currentQuestion.type && currentQuestion.type !== 'multiple-choice' ? (
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={handleAnswer}
            showFeedback={showFeedback}
            isCorrect={checkAnswer(currentQuestion, selectedAnswer)}
            disabled={showFeedback}
          />
        ) : (
          <>
            <h2 style={{ 
              fontSize: '1.4rem', 
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
              lineHeight: 1.4
            }}>
              {currentQuestion.question}
            </h2>

            {/* Question image if present */}
            {currentQuestion.image && (
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <img 
                  src={currentQuestion.image} 
                  alt="Question illustration"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </div>
            )}

            {/* Answer options - multiple choice */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.answer;
                const showCorrect = showFeedback && isCorrect;
                const showIncorrect = showFeedback && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={idx}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                    style={{
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      fontSize: '1.1rem',
                      background: showCorrect ? '#4CAF50' :
                        showIncorrect ? '#f44336' :
                        isSelected ? 'var(--color-primary)' : 'var(--color-bg-card)',
                      color: (showCorrect || showIncorrect || isSelected) ? 'white' : 'var(--color-text)',
                      border: `2px solid ${showCorrect ? '#4CAF50' : showIncorrect ? '#f44336' : 'var(--color-text)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: showFeedback ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ marginRight: '0.75rem', opacity: 0.6 }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                    {showCorrect && ' ✓'}
                    {showIncorrect && ' ✗'}
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Hint toggle */}
      {!showFeedback && currentQuestion.hint && (
        <button
          onClick={() => setShowHint(!showHint)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          💡 {showHint ? 'Hide hint' : 'Show hint'}
        </button>
      )}

      {/* Hint display */}
      <AnimatePresence>
        {showHint && !showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: '1rem',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.95rem',
              color: 'var(--color-text-muted)'
            }}
          >
            💡 {currentQuestion.hint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback message */}
      <AnimatePresence>
        {showFeedback && message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '1rem',
              background: milestone === 'mastery' ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                selectedAnswer === currentQuestion.answer ? 'var(--color-secondary)' : 'var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              color: 'white',
              textAlign: 'center',
              fontSize: milestone ? '1.1rem' : '1rem',
              fontWeight: milestone ? 'bold' : 'normal'
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation after wrong answer */}
      {showFeedback && selectedAnswer !== currentQuestion.answer && currentQuestion.explanation && (
        <div style={{
          padding: '1rem',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)'
        }}>
          <strong>Explanation:</strong> {currentQuestion.explanation}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {showFeedback && score < 100 && (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Next Question →
          </button>
        )}
        
        <button
          onClick={handleExit}
          className="btn"
          style={{
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-text-muted)'
          }}
        >
          Exit
        </button>
      </div>

      {/* Stats footer */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-bg)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)'
      }}>
        <span>
          {totalAnswered} answered • {correctCount} correct ({totalAnswered > 0 ? Math.round(correctCount / totalAnswered * 100) : 0}%)
        </span>
        {score < 100 && (
          <span>
            ~{estimatedRemaining} more to mastery
          </span>
        )}
      </div>
    </div>
  );
};

export default SmartScoreQuiz;
