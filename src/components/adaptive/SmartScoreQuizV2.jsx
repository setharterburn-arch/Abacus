import React, { useReducer, useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { smartScore } from '../../services/smartScore';
import { getCurriculum } from '../../services/curriculumService';
import { QuestionRenderer } from '../questions';
import { generateQuestion, generateInteractiveQuestion } from '../../services/questionGenerators';
import StreakCelebration from '../gamification/StreakCelebration';

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
    default:
      return String(userAnswer) === String(correctAnswer);
  }
};

// ============ STATE MACHINE ============
// All quiz state in one object, updated atomically via reducer

const initialState = {
  // Quiz phase: 'loading' | 'ready' | 'selected' | 'feedback' | 'complete'
  phase: 'loading',
  
  // Questions
  questions: [],
  questionIndex: 0,
  
  // Current answer
  selectedAnswer: null,
  isCorrect: null,
  
  // SmartScore
  score: 0,
  streak: 0,
  message: '',
  milestone: null,
  
  // Stats
  totalAnswered: 0,
  correctCount: 0,
  
  // UI
  showHint: false,
  scoreAnimation: null,
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        phase: 'ready',
        questions: action.questions,
        questionIndex: 0,
        selectedAnswer: null,
        isCorrect: null,
        showHint: false,
      };
      
    case 'SELECT_ANSWER':
      // Only allow in 'ready' phase
      if (state.phase !== 'ready') return state;
      return {
        ...state,
        phase: 'selected',
        selectedAnswer: action.answer,
      };
      
    case 'CHANGE_ANSWER':
      // Allow changing answer while in 'selected' phase
      if (state.phase !== 'selected') return state;
      return {
        ...state,
        selectedAnswer: action.answer,
      };
      
    case 'CHECK_ANSWER':
      // Only allow in 'selected' phase
      if (state.phase !== 'selected' || state.selectedAnswer === null) return state;
      
      const question = state.questions[state.questionIndex];
      const isCorrect = checkAnswer(question, state.selectedAnswer);
      const difficulty = question.difficulty || 1;
      
      // Calculate new SmartScore
      const result = smartScore.calculateScore(state.score, isCorrect, state.streak, difficulty);
      
      return {
        ...state,
        phase: 'feedback',
        isCorrect,
        score: result.newScore,
        streak: result.streak,
        message: result.message,
        milestone: result.milestone,
        totalAnswered: state.totalAnswered + 1,
        correctCount: state.correctCount + (isCorrect ? 1 : 0),
        scoreAnimation: {
          delta: result.newScore - state.score,
          positive: result.newScore > state.score,
        },
      };
      
    case 'NEXT_QUESTION':
      // Only allow in 'feedback' phase
      if (state.phase !== 'feedback') return state;
      
      const nextIndex = state.questionIndex + 1;
      
      // Check for mastery
      if (state.score >= 100) {
        return {
          ...state,
          phase: 'complete',
        };
      }
      
      return {
        ...state,
        phase: 'ready',
        questionIndex: nextIndex,
        selectedAnswer: null,
        isCorrect: null,
        message: '',
        milestone: null,
        showHint: false,
        scoreAnimation: null,
      };
      
    case 'ADD_QUESTIONS':
      return {
        ...state,
        questions: [...state.questions, ...action.questions],
      };
      
    case 'TOGGLE_HINT':
      return {
        ...state,
        showHint: !state.showHint,
      };
      
    case 'CLEAR_ANIMATION':
      return {
        ...state,
        scoreAnimation: null,
      };
      
    case 'COMPLETE':
      return {
        ...state,
        phase: 'complete',
      };
      
    default:
      return state;
  }
}

// ============ COMPONENT ============

const SmartScoreQuizV2 = ({ 
  studentId, 
  skillId,
  skillName,
  topic,
  grade,
  onComplete,
  onExit,
  initialScore = 0,
  infiniteMode = true
}) => {
  const [state, dispatch] = useReducer(quizReducer, {
    ...initialState,
    score: initialScore,
  });
  
  const startTime = useRef(Date.now());
  const seenQuestions = useRef(new Set());
  
  // Streak celebration state
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const prevStreak = useRef(0);
  
  // Get current question safely
  const currentQuestion = state.questions[state.questionIndex] || null;
  
  // Skill type for question generation
  const skillType = useMemo(() => {
    const t = (topic || skillName || '').toLowerCase();
    if (t.includes('add')) return 'addition';
    if (t.includes('subtract')) return 'subtraction';
    if (t.includes('multipl') || t.includes('times')) return 'multiplication';
    if (t.includes('divis') || t.includes('divide')) return 'division';
    if (t.includes('frac')) return 'fractions';
    if (t.includes('decim')) return 'decimals';
    if (t.includes('word') || t.includes('problem')) return 'word-problems';
    return 'addition';
  }, [topic, skillName]);
  
  // Generate new questions
  const generateNewQuestions = useCallback((count = 5) => {
    const g = grade || 3;
    const difficulty = state.score < 50 ? 'easy' : state.score < 80 ? 'medium' : 'hard';
    
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
      let q;
      // 20% chance of interactive question
      if (Math.random() < 0.2) {
        if (skillType.includes('frac')) {
          q = generateInteractiveQuestion('fraction-shade', g, 'fractions');
        } else if (skillType.includes('multipl')) {
          q = generateInteractiveQuestion('array-builder', g, 'multiplication');
        } else {
          q = generateInteractiveQuestion('number-line', g, 'fractions');
        }
      } else {
        q = generateQuestion(skillType, g, difficulty);
      }
      
      // Avoid duplicates
      if (!seenQuestions.current.has(q.question)) {
        newQuestions.push(q);
        seenQuestions.current.add(q.question);
      }
    }
    return newQuestions;
  }, [skillType, grade, state.score]);
  
  // Load initial questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const curriculum = await getCurriculum();
        
        // Find questions for this skill/topic
        let questions = [];
        const skillSet = curriculum.find(s => s.id === skillId);
        
        if (skillSet?.questions) {
          questions = [...skillSet.questions].sort(() => Math.random() - 0.5);
        } else {
          // Fallback: get from topic
          const topicSets = curriculum.filter(s => 
            s.topic?.toLowerCase() === topic?.toLowerCase() &&
            (grade === undefined || s.grade === grade)
          );
          questions = topicSets
            .flatMap(s => s.questions || [])
            .sort(() => Math.random() - 0.5);
        }
        
        // Add generated questions if we don't have enough
        if (infiniteMode && questions.length < 10) {
          questions = [...questions, ...generateNewQuestions(10 - questions.length)];
        }
        
        dispatch({ type: 'LOAD_QUESTIONS', questions });
      } catch (err) {
        console.error('Failed to load questions:', err);
        // Fallback to generated questions
        dispatch({ type: 'LOAD_QUESTIONS', questions: generateNewQuestions(10) });
      }
    }
    
    loadQuestions();
  }, [skillId, topic, grade, infiniteMode, generateNewQuestions]);
  
  // Generate more questions when running low
  useEffect(() => {
    if (infiniteMode && state.questionIndex >= state.questions.length - 3) {
      dispatch({ type: 'ADD_QUESTIONS', questions: generateNewQuestions(5) });
    }
  }, [state.questionIndex, state.questions.length, infiniteMode, generateNewQuestions]);
  
  // Clear score animation after delay
  useEffect(() => {
    if (state.scoreAnimation) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_ANIMATION' }), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.scoreAnimation]);
  
  // Show streak celebration when streak increases
  useEffect(() => {
    if (state.isCorrect && state.streak > prevStreak.current && state.streak >= 3) {
      setShowStreakCelebration(true);
    }
    prevStreak.current = state.streak;
  }, [state.streak, state.isCorrect]);
  
  // Handle completion
  useEffect(() => {
    if (state.phase === 'complete') {
      onComplete?.({
        score: state.score,
        totalAnswered: state.totalAnswered,
        correctCount: state.correctCount,
        timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
        mastered: state.score >= 100,
      });
    }
  }, [state.phase, state.score, state.totalAnswered, state.correctCount, onComplete]);
  
  // Event handlers
  const handleSelectAnswer = useCallback((answer) => {
    if (state.phase === 'ready') {
      dispatch({ type: 'SELECT_ANSWER', answer });
    } else if (state.phase === 'selected') {
      dispatch({ type: 'CHANGE_ANSWER', answer });
    }
  }, [state.phase]);
  
  const handleCheckAnswer = useCallback(() => {
    dispatch({ type: 'CHECK_ANSWER' });
  }, []);
  
  const handleNextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);
  
  const handleExit = useCallback(() => {
    onExit?.({
      score: state.score,
      totalAnswered: state.totalAnswered,
      correctCount: state.correctCount,
      timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
      mastered: state.score >= 100,
    });
  }, [state.score, state.totalAnswered, state.correctCount, onExit]);
  
  // Progress calculation
  const progress = useMemo(() => smartScore._getProgress(state.score), [state.score]);
  const estimatedRemaining = useMemo(
    () => smartScore.estimateQuestionsToTarget(state.score, 100),
    [state.score]
  );

  // ============ RENDER ============
  
  // Loading state
  if (state.phase === 'loading' || !currentQuestion) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <>
      {/* Streak Celebration Overlay */}
      <StreakCelebration 
        streak={state.streak}
        show={showStreakCelebration}
        onComplete={() => setShowStreakCelebration(false)}
      />
      
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
              {Math.round(state.score)}
              <AnimatePresence>
                {state.scoreAnimation && (
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      right: -30,
                      top: 0,
                      fontSize: '1rem',
                      color: state.scoreAnimation.positive ? '#4CAF50' : '#f44336'
                    }}
                  >
                    {state.scoreAnimation.positive ? '+' : ''}{state.scoreAnimation.delta.toFixed(1)}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              SmartScore
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100%',
            height: '12px',
            background: 'var(--color-bg)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <motion.div 
              animate={{ width: `${state.score}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, #2196F3 0%, #4CAF50 80%, #9C27B0 90%, #FFD700 100%)`,
                borderRadius: '999px'
              }} 
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            marginTop: '4px'
          }}>
            <span>0</span>
            <span>80</span>
            <span>90</span>
            <span>100</span>
          </div>
        </div>

        {/* Streak indicator */}
        {state.streak > 0 && (
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: state.streak >= 5 ? '#FFD700' : '#4CAF50'
          }}>
            🔥 {state.streak} correct in a row!
          </div>
        )}
        
        {infiniteMode && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            ∞ Infinite Practice Mode
          </div>
        )}
      </div>

      {/* Question */}
      <div style={{ marginBottom: '1.5rem' }}>
        {currentQuestion.type && 
         currentQuestion.type !== 'multiple-choice' && 
         currentQuestion.type !== 'multiple_choice' ? (
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={handleSelectAnswer}
            showFeedback={state.phase === 'feedback'}
            isCorrect={state.isCorrect}
            disabled={state.phase === 'feedback'}
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

            {currentQuestion.image && (
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <img 
                  src={currentQuestion.image} 
                  alt="Question"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </div>
            )}

            {/* Answer Options */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {currentQuestion.options?.map((option, idx) => {
                // Strict comparison - ensure both are same type
                const isSelected = state.selectedAnswer !== null && String(state.selectedAnswer) === String(option);
                const isCorrect = option === currentQuestion.answer;
                const showCorrect = state.phase === 'feedback' && isCorrect;
                const showIncorrect = state.phase === 'feedback' && isSelected && !isCorrect;
                const canSelect = state.phase === 'ready' || state.phase === 'selected';

                return (
                  <button
                    key={`q${state.questionIndex}-opt${idx}-${option.substring(0,10)}`}
                    type="button"
                    onClick={() => canSelect && handleSelectAnswer(option)}
                    disabled={!canSelect}
                    style={{
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      fontSize: '1.1rem',
                      background: showCorrect ? '#4CAF50' :
                        showIncorrect ? '#f44336' :
                        isSelected ? 'var(--color-primary)' : 'var(--color-bg-card)',
                      color: (showCorrect || showIncorrect || isSelected) ? 'white' : 'var(--color-text)',
                      border: `2px solid ${showCorrect ? '#4CAF50' : showIncorrect ? '#f44336' : isSelected ? 'var(--color-primary)' : 'var(--color-text)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: canSelect ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      opacity: 1,
                    }}
                  >
                    <span style={{ marginRight: '0.75rem', opacity: 0.6 }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                    {showCorrect && ' ✓'}
                    {showIncorrect && ' ✗'}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Hint */}
      {state.phase !== 'feedback' && currentQuestion.hint && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_HINT' })}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          💡 {state.showHint ? 'Hide hint' : 'Show hint'}
        </button>
      )}

      <AnimatePresence>
        {state.showHint && state.phase !== 'feedback' && (
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

      {/* Feedback Message */}
      <AnimatePresence>
        {state.phase === 'feedback' && state.message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '1rem',
              background: state.milestone === 'mastery' ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                state.isCorrect ? 'var(--color-secondary)' : 'var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              color: 'white',
              textAlign: 'center',
              fontSize: state.milestone ? '1.1rem' : '1rem',
              fontWeight: state.milestone ? 'bold' : 'normal'
            }}
          >
            {state.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      {state.phase === 'feedback' && !state.isCorrect && currentQuestion.explanation && (
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

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {state.phase === 'selected' && (
          <button
            onClick={handleCheckAnswer}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            ✓ Check Answer
          </button>
        )}
        
        {state.phase === 'feedback' && state.score < 100 && (
          <button
            onClick={handleNextQuestion}
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

      {/* Stats Footer */}
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
          {state.totalAnswered} answered • {state.correctCount} correct 
          ({state.totalAnswered > 0 ? Math.round(state.correctCount / state.totalAnswered * 100) : 0}%)
        </span>
        {state.score < 100 && (
          <span>~{estimatedRemaining} more to mastery</span>
        )}
      </div>
      </div>
    </>
  );
};

export default SmartScoreQuizV2;
