import React, { useState, useEffect } from 'react';
import { getCurriculum } from '../../services/curriculumService';
import performanceTracker from '../../services/performanceTracker';

/**
 * Adaptive Quiz Engine Component
 * Selects questions based on student performance and adjusts difficulty in real-time
 */
const AdaptiveQuizEngine = ({ studentId, topic, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [performance, setPerformance] = useState([]);
    const [currentDifficulty, setCurrentDifficulty] = useState('medium');
    const [startTime, setStartTime] = useState(Date.now());
    const [score, setScore] = useState({ correct: 0, total: 0 });
    
    // Curriculum data from Supabase
    const [curriculumData, setCurriculumData] = useState([]);
    const [topicSets, setTopicSets] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Select next question based on current difficulty
    const selectNextQuestion = () => {
        // Get recommended difficulty based on recent performance
        const recommendedDifficulty = performanceTracker.getRecommendedDifficulty(performance);
        setCurrentDifficulty(recommendedDifficulty);

        // Find sets matching the difficulty
        const matchingSets = topicSets.filter(set =>
            set.difficulty === recommendedDifficulty
        );

        if (matchingSets.length === 0) {
            // Fallback to any difficulty if none match
            const randomSet = topicSets[Math.floor(Math.random() * topicSets.length)];
            const randomQuestion = randomSet.questions[Math.floor(Math.random() * randomSet.questions.length)];
            setCurrentQuestion({
                ...randomQuestion,
                setId: randomSet.id,
                setTitle: randomSet.title,
                difficulty: randomSet.difficulty
            });
            return;
        }

        // Select random set and question from matching difficulty
        const randomSet = matchingSets[Math.floor(Math.random() * matchingSets.length)];
        const randomQuestion = randomSet.questions[Math.floor(Math.random() * randomSet.questions.length)];

        setCurrentQuestion({
            ...randomQuestion,
            setId: randomSet.id,
            setTitle: randomSet.title,
            difficulty: randomSet.difficulty
        });
        setStartTime(Date.now());
    };

    // Load curriculum data from Supabase
    useEffect(() => {
        getCurriculum().then(data => {
            setCurriculumData(data);
            const filtered = data.filter(set =>
                set.topic?.toLowerCase().includes(topic.toLowerCase())
            );
            setTopicSets(filtered);
            setIsLoaded(true);
        }).catch(err => {
            console.error('Failed to load curriculum:', err);
            setIsLoaded(true);
        });
    }, [topic]);

    // Initialize first question when data is loaded
    useEffect(() => {
        if (isLoaded && topicSets.length > 0) {
            selectNextQuestion();
        }
    }, [isLoaded, topicSets]);

    const handleAnswer = async (answer) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);

        const correct = answer === currentQuestion.answer;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        // Update local performance
        const newPerformance = [...performance, {
            correct,
            difficulty: currentQuestion.difficulty,
            timeSpent,
            topic
        }];
        setPerformance(newPerformance);

        // Update score
        setScore({
            correct: score.correct + (correct ? 1 : 0),
            total: score.total + 1
        });

        // Record in database
        await performanceTracker.recordAnswer(studentId, {
            curriculum_set_id: currentQuestion.setId,
            question_id: `${currentQuestion.setId}-q${questionIndex}`,
            correct,
            time_spent: timeSpent,
            difficulty: currentQuestion.difficulty,
            topic
        });
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setShowFeedback(false);
        setQuestionIndex(questionIndex + 1);

        // Check if quiz is complete (10 questions)
        if (questionIndex + 1 >= 10) {
            onComplete({
                score,
                performance,
                finalDifficulty: currentDifficulty
            });
            return;
        }

        selectNextQuestion();
    };

    if (!currentQuestion) {
        return <div className="card">Loading question...</div>;
    }

    const accuracy = score.total > 0 ? (score.correct / score.total * 100).toFixed(0) : 0;

    return (
        <div className="card">
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Question {questionIndex + 1} of 10
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge" style={{
                            background: currentDifficulty === 'easy' ? '#4caf50' :
                                currentDifficulty === 'medium' ? '#ff9800' : '#f44336',
                            color: 'white'
                        }}>
                            {currentDifficulty.toUpperCase()}
                        </span>
                        <span className="badge" style={{ background: 'var(--color-primary)', color: 'white' }}>
                            {accuracy}% Correct
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--color-bg)',
                    borderRadius: '999px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${((questionIndex + 1) / 10) * 100}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Question */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
                    {currentQuestion.question}
                </h3>

                {/* Manim Video/Image Support */}
                {currentQuestion.manim_file && (
                    <div style={{ marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                        <video
                            controls
                            style={{ width: '100%', maxHeight: '300px', backgroundColor: '#000' }}
                            src={`/videos/${currentQuestion.manim_file.replace('.py', '.mp4')}`}
                        >
                            <p>Your browser does not support video playback.</p>
                        </video>
                    </div>
                )}

                {/* Answer options */}
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuestion.answer;
                        const showCorrect = showFeedback && isCorrect;
                        const showIncorrect = showFeedback && isSelected && !isCorrect;

                        return (
                            <button
                                key={idx}
                                onClick={() => !showFeedback && handleAnswer(option)}
                                disabled={showFeedback}
                                className="btn"
                                style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    background: showCorrect ? '#4caf50' :
                                        showIncorrect ? '#f44336' :
                                            isSelected ? 'var(--color-primary)' : 'var(--color-bg-card)',
                                    color: (showCorrect || showIncorrect || isSelected) ? 'white' : 'var(--color-text)',
                                    border: '2px solid var(--color-text)',
                                    cursor: showFeedback ? 'default' : 'pointer'
                                }}
                            >
                                {option}
                                {showCorrect && ' ✓'}
                                {showIncorrect && ' ✗'}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Feedback */}
            {showFeedback && (
                <div style={{
                    padding: '1rem',
                    background: selectedAnswer === currentQuestion.answer ? 'var(--color-secondary)' : 'var(--color-accent)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    color: 'white'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {selectedAnswer === currentQuestion.answer ? '✅ Correct!' : '❌ Incorrect'}
                    </div>
                    {currentQuestion.explanation && (
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            {currentQuestion.explanation}
                        </div>
                    )}
                </div>
            )}

            {/* Next button */}
            {showFeedback && (
                <button
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    {questionIndex + 1 >= 10 ? 'Finish Quiz' : 'Next Question →'}
                </button>
            )}

            {/* Adaptive indicator */}
            {performance.length >= 3 && !showFeedback && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    textAlign: 'center'
                }}>
                    🎯 Difficulty adjusting based on your performance
                </div>
            )}
        </div>
    );
};

export default AdaptiveQuizEngine;
