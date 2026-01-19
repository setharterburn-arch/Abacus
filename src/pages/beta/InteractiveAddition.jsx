import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InteractiveAddition = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [clickedApples, setClickedApples] = useState([]);
    const [answer, setAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const audioRef = useRef(null);

    // Audio files for each step
    const audioFiles = {
        0: '/audio/narrations/addition/intro.wav',
        1: '/audio/narrations/addition/first.wav',
        2: '/audio/narrations/addition/second.wav',
        3: '/audio/narrations/addition/question.wav',
        4: '/audio/narrations/addition/celebration.wav',
        correct: '/audio/narrations/addition/correct.wav',
        wrong: '/audio/narrations/addition/wrong.wav'
    };

    // Play narration when step changes
    useEffect(() => {
        const audioFile = audioFiles[step];
        if (audioFile) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(audioFile);
            audioRef.current.playbackRate = 1.15; // Speed up 15% for more natural sound
            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        }
    }, [step]);

    // Play feedback audio
    useEffect(() => {
        if (showFeedback) {
            const feedbackAudio = new Audio(audioFiles[isCorrect ? 'correct' : 'wrong']);
            feedbackAudio.playbackRate = 1.15; // Speed up 15% for more natural sound
            feedbackAudio.play().catch(err => console.log('Audio play failed:', err));
        }
    }, [showFeedback, isCorrect]);

    const steps = [
        {
            type: 'intro',
            narration: "Hello young mathematicians! Today we're learning addition.",
            instruction: "Click 'Start' when you're ready!"
        },
        {
            type: 'show-first',
            narration: "Let's solve: What is 2 + 3?",
            instruction: "Click each apple to count them",
            apples: 2,
            position: 'left'
        },
        {
            type: 'show-second',
            narration: "Now let's add 3 more apples",
            instruction: "Click each apple to count them",
            apples: 3,
            position: 'right'
        },
        {
            type: 'question',
            narration: "How many apples do we have in total?",
            instruction: "Type your answer",
            correctAnswer: 5
        },
        {
            type: 'celebration',
            narration: "Great job! 2 + 3 = 5",
            instruction: "You've mastered addition!"
        }
    ];

    const currentStep = steps[step];

    const handleAppleClick = (index) => {
        if (!clickedApples.includes(index)) {
            setClickedApples([...clickedApples, index]);
            // Play count sound or animation
        }
    };

    const handleNext = () => {
        setClickedApples([]);
        setAnswer('');
        setShowFeedback(false);
        setStep(step + 1);
    };

    const handleSubmitAnswer = () => {
        const userAnswer = parseInt(answer);
        const correct = userAnswer === currentStep.correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);
    };

    const renderApples = (count, startIndex = 0) => {
        return Array.from({ length: count }).map((_, i) => {
            const index = startIndex + i;
            const isClicked = clickedApples.includes(index);

            return (
                <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAppleClick(index)}
                    style={{
                        width: '80px',
                        height: '80px',
                        margin: '10px',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                >
                    {/* Apple */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: isClicked ? '#4caf50' : '#f44336',
                        border: '3px solid #c62828',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s'
                    }}>
                        {/* Stem */}
                        <div style={{
                            position: 'absolute',
                            top: '-10px',
                            width: '4px',
                            height: '15px',
                            background: '#5d4037',
                            borderRadius: '2px'
                        }} />

                        {/* Count number */}
                        {isClicked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}
                            >
                                {clickedApples.indexOf(index) + 1}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            );
        });
    };

    return (
        <div style={{
            background: 'var(--color-bg)',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            {/* Header */}
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/beta/videos')}
                    className="btn"
                    style={{ marginBottom: '2rem' }}
                >
                    ← Back
                </button>

                {/* Main Content */}
                <div className="card" style={{
                    padding: '3rem',
                    textAlign: 'center',
                    minHeight: '500px'
                }}>
                    {/* Progress Bar */}
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'var(--color-bg)',
                        borderRadius: '999px',
                        marginBottom: '2rem',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                            style={{
                                height: '100%',
                                background: 'var(--color-primary)',
                                transition: 'width 0.5s'
                            }}
                        />
                    </div>

                    {/* Narration */}
                    <motion.h2
                        key={step}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            color: 'var(--color-primary)'
                        }}
                    >
                        {currentStep.narration}
                    </motion.h2>

                    {/* Instruction */}
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '3rem'
                    }}>
                        {currentStep.instruction}
                    </p>

                    {/* Content Area */}
                    <div style={{
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '3rem'
                    }}>
                        <AnimatePresence mode="wait">
                            {/* Intro Step */}
                            {currentStep.type === 'intro' && (
                                <motion.button
                                    key="start"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    onClick={handleNext}
                                    className="btn btn-primary"
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '1.5rem 3rem'
                                    }}
                                >
                                    Start Learning! 🚀
                                </motion.button>
                            )}

                            {/* Show First Group */}
                            {currentStep.type === 'show-first' && (
                                <motion.div
                                    key="first"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
                                >
                                    {renderApples(currentStep.apples, 0)}
                                </motion.div>
                            )}

                            {/* Show Second Group */}
                            {currentStep.type === 'show-second' && (
                                <motion.div
                                    key="both"
                                    style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}
                                >
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {renderApples(2, 0)}
                                    </div>
                                    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>+</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {renderApples(3, 2)}
                                    </div>
                                </motion.div>
                            )}

                            {/* Question Step */}
                            {currentStep.type === 'question' && (
                                <motion.div
                                    key="question"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{ width: '100%', maxWidth: '400px' }}
                                >
                                    <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                                        2 + 3 = ?
                                    </div>

                                    <input
                                        type="number"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Type your answer"
                                        style={{
                                            fontSize: '2rem',
                                            padding: '1rem',
                                            width: '100%',
                                            textAlign: 'center',
                                            border: '3px solid var(--color-text)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: '1rem'
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                                    />

                                    {!showFeedback ? (
                                        <button
                                            onClick={handleSubmitAnswer}
                                            className="btn btn-primary"
                                            style={{ width: '100%', fontSize: '1.2rem' }}
                                            disabled={!answer}
                                        >
                                            Check Answer
                                        </button>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{
                                                padding: '1.5rem',
                                                borderRadius: 'var(--radius-md)',
                                                background: isCorrect ? '#4caf50' : '#f44336',
                                                color: 'white',
                                                marginBottom: '1rem'
                                            }}
                                        >
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                                {isCorrect ? '✅ Correct!' : '❌ Try Again'}
                                            </div>
                                            <div>
                                                {isCorrect
                                                    ? 'Great job! 2 + 3 = 5'
                                                    : 'Hint: Count all the apples together'}
                                            </div>
                                        </motion.div>
                                    )}

                                    {isCorrect && (
                                        <button
                                            onClick={handleNext}
                                            className="btn btn-primary"
                                            style={{ width: '100%', fontSize: '1.2rem' }}
                                        >
                                            Continue →
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* Celebration */}
                            {currentStep.type === 'celebration' && (
                                <motion.div
                                    key="celebration"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    style={{ textAlign: 'center' }}
                                >
                                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                                    <div style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                                        You did it!
                                    </div>
                                    <button
                                        onClick={() => navigate('/beta/videos')}
                                        className="btn btn-primary"
                                        style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                                    >
                                        Try Another Lesson
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Next Button (for non-question steps) */}
                    {currentStep.type !== 'intro' &&
                        currentStep.type !== 'question' &&
                        currentStep.type !== 'celebration' && (
                            <button
                                onClick={handleNext}
                                className="btn btn-primary"
                                style={{
                                    marginTop: '2rem',
                                    fontSize: '1.2rem',
                                    padding: '1rem 2rem'
                                }}
                                disabled={
                                    (currentStep.type === 'show-first' && clickedApples.length < currentStep.apples) ||
                                    (currentStep.type === 'show-second' && clickedApples.length < 5)
                                }
                            >
                                {clickedApples.length < (currentStep.apples || 5)
                                    ? `Count all apples first (${clickedApples.length}/${currentStep.apples || 5})`
                                    : 'Continue →'}
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveAddition;
