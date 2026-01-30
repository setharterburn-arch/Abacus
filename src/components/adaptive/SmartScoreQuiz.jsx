import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { smartScore } from '../../services/smartScore';
import { getCurriculum } from '../../services/curriculumService';
import { QuestionRenderer } from '../questions';
import { generateQuestion, generateInteractiveQuestion } from '../../services/questionGenerators';

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
  initialScore = 0,
  infiniteMode = true  // Enable infinite practice by default
}) => {
  // Curriculum data from Supabase
  const [curriculumData, setCurriculumData] = useState([]);
  const [curriculumLoaded, setCurriculumLoaded] = useState(false);
  
  // Quiz state - two-step answer flow
  // Phase: 'selecting' (pick answer) | 'selected' (ready to check) | 'checked' (feedback shown) | 'transitioning'
  const [phase, setPhase] = useState('selecting');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // displayedIndex is the question we actually SHOW - updates only AFTER state is cleared
  const [displayedIndex, setDisplayedIndex] = useState(0);
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
  
  // Track seen questions to avoid repeats
  const seenQuestions = useRef(new Set());
  const skillTypeRef = useRef(topic || 'addition'); // For generating matching questions

  // Determine the skill type for question generation
  const getSkillType = useCallback(() => {
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

  // Generate a new question using algorithmic generators
  const generateNewQuestion = useCallback(() => {
    const skillType = getSkillType();
    const g = grade || 3;
    const difficulty = score < 50 ? 'easy' : score < 80 ? 'medium' : 'hard';
    
    // 20% chance of interactive question for variety
    if (Math.random() < 0.2) {
      const interactiveTypes = ['number-line', 'fraction-shade', 'array-builder', 'drag-sort'];
      const type = interactiveTypes[Math.floor(Math.random() * interactiveTypes.length)];
      
      // Match interactive type to skill
      if (skillType.includes('frac')) {
        return generateInteractiveQuestion('fraction-shade', g, 'fractions');
      } else if (skillType.includes('multipl')) {
        return generateInteractiveQuestion('array-builder', g, 'multiplication');
      } else if (skillType.includes('decim')) {
        return generateInteractiveQuestion('number-line', g, 'decimals');
      }
      return generateInteractiveQuestion('number-line', g, 'fractions');
    }
    
    return generateQuestion(skillType, g, difficulty);
  }, [getSkillType, grade, score]);

  // Load curriculum data from Supabase
  useEffect(() => {
    getCurriculum().then(data => {
      setCurriculumData(data);
      setCurriculumLoaded(true);
    }).catch(err => {
      console.error('Failed to load curriculum:', err);
      setCurriculumLoaded(true); // Continue anyway
    });
  }, []);

  // Load questions for this skill
  useEffect(() => {
    if (!curriculumLoaded) return;
    
    const skillSet = curriculumData.find(s => s.id === skillId);
    if (skillSet && skillSet.questions) {
      // Shuffle questions
      const shuffled = [...skillSet.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      skillTypeRef.current = skillSet.topic || topic || 'addition';
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
    
    // If infiniteMode and we have few questions, add some generated ones
    if (infiniteMode) {
      setTimeout(() => {
        setQuestions(prev => {
          if (prev.length < 10) {
            const generated = Array(10 - prev.length).fill(null).map(() => generateNewQuestion());
            return [...prev, ...generated];
          }
          return prev;
        });
      }, 100);
    }
  }, [skillId, topic, grade, infiniteMode, generateNewQuestion, curriculumLoaded, curriculumData]);

  // Removed canAnswer/isFirstRender - using phase state instead

  // Track when question appeared - prevents ghost taps on new questions
  const questionAppearedAt = useRef(Date.now());
  
  // Reset selection state when question changes
  useEffect(() => {
    console.log('Question changed to index:', currentIndex);
    // IMMEDIATELY clear all answer-related state
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    setCanProceed(false);
    setPhase('transitioning'); // Ensure transitioning during reset
    questionAppearedAt.current = Date.now();
    
    // Extend the global block for new question
    blockedUntil.current = Math.max(blockedUntil.current, Date.now() + 800);
    
    // THEN update displayed index and phase after a delay
    const timer = setTimeout(() => {
      console.log('Setting phase to selecting, updating displayedIndex to:', currentIndex);
      setDisplayedIndex(currentIndex); // NOW safe to show the new question
      isProcessingAnswer.current = false;
      blockedUntil.current = 0;
      setPhase('selecting');
    }, 100); // Short delay - state is already cleared
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Use displayedIndex for rendering to prevent stale state issues
  const currentQuestion = questions[displayedIndex];

  // Synchronous lock - refs update immediately unlike state
  const isProcessingAnswer = useRef(false);
  // Global interaction block timestamp - nothing can happen until this time passes
  const blockedUntil = useRef(0);
  // Cooldown after checking - blocks Next button from appearing too soon
  const [canProceed, setCanProceed] = useState(false);
  
  // Check if interactions are currently blocked
  const isInteractionBlocked = () => {
    const now = Date.now();
    if (now < blockedUntil.current) {
      console.log('BLOCKED by timestamp, wait:', blockedUntil.current - now, 'ms');
      return true;
    }
    return false;
  };
  
  // Step 1: Select an answer (just highlights, doesn't submit)
  const handleSelectAnswer = useCallback((answer) => {
    // GLOBAL BLOCK CHECK
    if (isInteractionBlocked()) return;
    
    // Only allow selection in 'selecting' or 'selected' phase (can change answer before checking)
    if (phase !== 'selecting' && phase !== 'selected') {
      console.log('Select blocked - phase is:', phase);
      return;
    }
    
    if (isProcessingAnswer.current) {
      console.log('Select blocked - processing');
      return;
    }
    
    console.log('Selected answer:', answer);
    setSelectedAnswer(answer);
    setPhase('selected');
  }, [phase]);

  // Step 2: Check the answer (submit and show feedback)
  const handleCheckAnswer = useCallback(() => {
    // GLOBAL BLOCK CHECK
    if (isInteractionBlocked()) return;
    
    if (phase !== 'selected' || selectedAnswer === null) {
      console.log('Check blocked - phase:', phase, 'selected:', selectedAnswer);
      return;
    }
    
    if (isProcessingAnswer.current) {
      console.log('Check blocked - already processing');
      return;
    }
    
    // LOCK everything - block ALL interactions for 1.5 seconds
    isProcessingAnswer.current = true;
    blockedUntil.current = Date.now() + 1500;
    setCanProceed(false);
    
    console.log('Checking answer:', selectedAnswer);
    setShowFeedback(true);
    setPhase('checked');
    
    // Use universal answer checker for all question types
    const correct = checkAnswer(currentQuestion, selectedAnswer);
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
    
    // UNLOCK after 1 second cooldown - Next button won't appear until then
    setTimeout(() => {
      console.log('Cooldown complete, can proceed');
      isProcessingAnswer.current = false;
      setCanProceed(true);
    }, 1000);
  }, [phase, selectedAnswer, currentQuestion, score, streak, totalAnswered, correctCount, startTime, onComplete]);

  const handleNext = () => {
    console.log('handleNext called, currentIndex:', currentIndex, 'phase:', phase);
    
    // GLOBAL BLOCK CHECK
    if (isInteractionBlocked()) return;
    
    // Only allow next in 'checked' phase
    if (phase !== 'checked') {
      console.log('handleNext blocked - phase is:', phase);
      return;
    }
    
    if (!canProceed) {
      console.log('handleNext blocked - canProceed is false');
      return;
    }
    
    // Block interactions during transition and for 500ms after new question loads
    blockedUntil.current = Date.now() + 1000;
    
    // Set transitioning phase to block everything
    setPhase('transitioning');
    
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    setMessage('');
    setMilestone(null);
    
    // Mark current question as seen
    if (currentQuestion?.question) {
      seenQuestions.current.add(currentQuestion.question);
    }
    
    // In infinite mode, generate new questions instead of cycling
    if (infiniteMode && currentIndex >= questions.length - 2) {
      // Generate a few more questions
      const newQuestions = Array(5).fill(null).map(() => {
        let q = generateNewQuestion();
        // Avoid duplicates
        let attempts = 0;
        while (seenQuestions.current.has(q.question) && attempts < 10) {
          q = generateNewQuestion();
          attempts++;
        }
        return q;
      });
      setQuestions(prev => [...prev, ...newQuestions]);
    }
    
    setCurrentIndex(currentIndex + 1);
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

  // Block ALL interactions when not in a stable state
  const isBlocked = phase === 'transitioning' || (phase === 'checked' && !canProceed);
  
  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
      {/* TOUCH BLOCKER - invisible overlay that captures all events during transitions */}
      {isBlocked && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: 'transparent',
            touchAction: 'none'
          }}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onTouchMove={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
        />
      )}
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
        
        {/* Infinite mode indicator */}
        {infiniteMode && (
          <div style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            ∞ Infinite Practice Mode
          </div>
        )}
      </div>

      {/* Question - key forces React to unmount/remount on question change, preventing stale state flicker */}
      {phase === 'transitioning' ? (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
          <div style={{ color: 'var(--color-text-muted)' }}>Loading next question...</div>
        </div>
      ) : (
      <div key={`question-${displayedIndex}`} style={{ marginBottom: '1.5rem' }}>
        {/* Use QuestionRenderer for interactive types, inline for multiple choice */}
        {currentQuestion.type && 
         currentQuestion.type !== 'multiple-choice' && 
         currentQuestion.type !== 'multiple_choice' ? (
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={handleSelectAnswer}
            showFeedback={showFeedback}
            isCorrect={checkAnswer(currentQuestion, selectedAnswer)}
            disabled={phase === 'checked' || phase === 'transitioning'}
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
                const canSelect = phase === 'selecting' || phase === 'selected';

                return (
                  <button
                    key={`${displayedIndex}-${idx}-${option}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (canSelect) {
                        handleSelectAnswer(option);
                      }
                    }}
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
                      opacity: phase === 'transitioning' ? 0.5 : 1,
                      pointerEvents: canSelect ? 'auto' : 'none',
                      userSelect: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
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
      )}

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
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Check Answer button - only shows when answer is selected but not yet checked */}
        {phase === 'selected' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleCheckAnswer();
            }}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: '150px', touchAction: 'manipulation' }}
          >
            ✓ Check Answer
          </button>
        )}
        
        {/* Next Question button - only shows after answer is checked AND cooldown passed */}
        {phase === 'checked' && canProceed && score < 100 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (canProceed) handleNext();
            }}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: '150px', touchAction: 'manipulation' }}
          >
            Next Question →
          </button>
        )}
        
        {/* Show "checking..." indicator during cooldown */}
        {phase === 'checked' && !canProceed && score < 100 && (
          <div style={{ 
            flex: 1, 
            minWidth: '150px', 
            padding: '0.75rem', 
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem'
          }}>
            ⏳ Checking...
          </div>
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
