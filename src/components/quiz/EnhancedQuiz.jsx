import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EnhancedQuiz - A quiz component with hints, skip functionality, and immediate feedback
 * Based on competitive analysis of Khan Academy and IXL
 */
const EnhancedQuiz = ({
    question,
    options,
    correctAnswer,
    hints = [],
    explanation = '',
    onAnswer,
    onSkip,
    showFeedback = true
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [hintLevel, setHintLevel] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelectAnswer = (answer) => {
        setSelectedAnswer(answer);
        if (showFeedback) {
            setShowResult(true);
            setShowExplanation(true);
        }
    };

    const handleContinue = () => {
        const isCorrect = selectedAnswer === correctAnswer;
        onAnswer(selectedAnswer, isCorrect);

        // Reset for next question
        setSelectedAnswer(null);
        setShowResult(false);
        setHintLevel(0);
        setShowExplanation(false);
    };

    const handleSkip = () => {
        onSkip();
        setSelectedAnswer(null);
        setShowResult(false);
        setHintLevel(0);
        setShowExplanation(false);
    };

    const showNextHint = () => {
        if (hintLevel < hints.length) {
            setHintLevel(hintLevel + 1);
        }
    };

    const isCorrect = selectedAnswer === correctAnswer;

    return (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
            {/* Question */}
            <h2 style={{
                fontSize: '1.5rem',
                marginBottom: '2rem',
                color: 'var(--color-text)'
            }}>
                {question}
            </h2>

            {/* Hints Section */}
            {hints.length > 0 && !showResult && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <AnimatePresence>
                        {hintLevel > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{
                                    background: 'var(--color-bg)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    borderLeft: '4px solid var(--color-primary)'
                                }}
                            >
                                <div style={{
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-primary)'
                                }}>
                                    💡 Hint {hintLevel}/{hints.length}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)' }}>
                                    {hints[hintLevel - 1]}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {hintLevel < hints.length && !showResult && (
                        <button
                            className="btn"
                            onClick={showNextHint}
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: '2px dashed var(--color-primary)'
                            }}
                        >
                            {hintLevel === 0 ? '💡 Need a hint?' : '💡 Show next hint'}
                        </button>
                    )}
                </div>
            )}

            {/* Answer Options */}
            <div style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                {options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isThisCorrect = option === correctAnswer;

                    let buttonStyle = {
                        padding: '1.5rem',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        border: '2px solid var(--color-text)',
                        background: 'var(--color-bg-card)'
                    };

                    if (showResult && isSelected) {
                        if (isCorrect) {
                            buttonStyle.background = 'var(--color-secondary)';
                            buttonStyle.color = 'white';
                            buttonStyle.borderColor = 'var(--color-secondary)';
                        } else {
                            buttonStyle.background = '#ef4444';
                            buttonStyle.color = 'white';
                            buttonStyle.borderColor = '#ef4444';
                        }
                    } else if (showResult && isThisCorrect) {
                        buttonStyle.background = 'var(--color-secondary)';
                        buttonStyle.color = 'white';
                        buttonStyle.borderColor = 'var(--color-secondary)';
                    } else if (isSelected) {
                        buttonStyle.borderColor = 'var(--color-primary)';
                        buttonStyle.borderWidth = '3px';
                    }

                    return (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: showResult ? 1 : 1.02 }}
                            whileTap={{ scale: showResult ? 1 : 0.98 }}
                            onClick={() => !showResult && handleSelectAnswer(option)}
                            className="btn"
                            disabled={showResult}
                            style={buttonStyle}
                        >
                            <span style={{
                                marginRight: '1rem',
                                fontWeight: 'bold',
                                color: showResult && (isSelected || isThisCorrect) ? 'white' : 'var(--color-primary)'
                            }}>
                                {String.fromCharCode(65 + idx)}.
                            </span>
                            {option}
                            {showResult && isThisCorrect && ' ✓'}
                            {showResult && isSelected && !isCorrect && ' ✗'}
                        </motion.button>
                    );
                })}
            </div>

            {/* Feedback Section */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        style={{
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            background: isCorrect ? 'var(--color-secondary)' : '#ef4444',
                            color: 'white',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <div style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem'
                        }}>
                            {isCorrect ? '🎉 Correct!' : '❌ Not quite right'}
                        </div>

                        {showExplanation && explanation && (
                            <div style={{
                                fontSize: '1rem',
                                opacity: 0.95,
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid rgba(255,255,255,0.3)'
                            }}>
                                <strong>Explanation:</strong> {explanation}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between'
            }}>
                {!showResult ? (
                    <>
                        <button
                            className="btn"
                            onClick={handleSkip}
                            style={{
                                background: 'transparent',
                                color: 'var(--color-text-muted)'
                            }}
                        >
                            ⏭️ Skip (I haven't learned this yet)
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => selectedAnswer && handleSelectAnswer(selectedAnswer)}
                            disabled={!selectedAnswer}
                        >
                            Submit Answer →
                        </button>
                    </>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleContinue}
                        style={{ marginLeft: 'auto' }}
                    >
                        Continue →
                    </button>
                )}
            </div>
        </div>
    );
};

export default EnhancedQuiz;
