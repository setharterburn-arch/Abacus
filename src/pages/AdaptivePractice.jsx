import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../services/store';
import AdaptiveQuizEngine from '../components/adaptive/AdaptiveQuizEngine';
import SmartScoreQuiz from '../components/adaptive/SmartScoreQuiz';
import { getTopics } from '../services/curriculumService';

const AdaptivePractice = () => {
    const { state } = useStore();
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [quizActive, setQuizActive] = useState(false);
    const [results, setResults] = useState(null);

    const [topics, setTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [useSmartScore, setUseSmartScore] = useState(true); // Default to SmartScore

    useEffect(() => {
        // Load topics from Supabase (with JSON fallback)
        getTopics().then(topicsList => {
            setTopics(topicsList.sort());
            setLoadingTopics(false);
        }).catch(err => {
            console.error('Failed to load topics:', err);
            setLoadingTopics(false);
        });
    }, []);

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setQuizActive(true);
        setResults(null);
    };

    const handleQuizComplete = (quizResults) => {
        setQuizActive(false);
        setResults(quizResults);
    };

    const handleTryAgain = () => {
        setQuizActive(true);
        setResults(null);
    };

    const handleNewTopic = () => {
        setSelectedTopic(null);
        setQuizActive(false);
        setResults(null);
    };

    if (!state.user) {
        return (
            <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '4rem 2rem' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>Sign In Required</h2>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                            You need to be signed in to use adaptive practice.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/auth')}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                padding: '3rem 2rem',
                textAlign: 'center',
                borderBottom: '3px solid var(--color-text)'
            }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            marginBottom: '1rem',
                            color: '#44403c' // Hardcoded dark text for light background
                        }}
                    >
                        🎯 Adaptive Practice
                    </motion.h1>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '1.2rem',
                            color: '#78716c', // Hardcoded muted dark text
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Questions that adapt to your skill level in real-time!
                    </motion.p>
                </div>
            </div>

            <div className="container" style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
                {!selectedTopic ? (
                    /* Topic Selection */
                    <>
                        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '1rem' }}>
                                {useSmartScore ? '🏆 SmartScore Mastery' : 'How It Works'}
                            </h2>
                            {useSmartScore ? (
                                <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                                    <p style={{ marginBottom: '0.5rem' }}>
                                        📊 <strong>SmartScore</strong> goes UP and DOWN based on your answers
                                    </p>
                                    <p style={{ marginBottom: '0.5rem' }}>
                                        🎯 Reach <strong>80</strong> for Proficiency, <strong>90</strong> for Challenge Zone
                                    </p>
                                    <p style={{ marginBottom: '0.5rem' }}>
                                        ⭐ Hit <strong>100</strong> to achieve Mastery!
                                    </p>
                                    <p>
                                        🔥 Build streaks in the Challenge Zone for faster progress
                                    </p>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                                    <p style={{ marginBottom: '0.5rem' }}>
                                        ✨ Questions automatically adjust to your skill level
                                    </p>
                                    <p style={{ marginBottom: '0.5rem' }}>
                                        🎯 Targets 70% success rate for optimal learning
                                    </p>
                                    <p>
                                        📊 Tracks your progress and builds mastery
                                    </p>
                                </div>
                            )}
                            
                            {/* Mode toggle */}
                            <div style={{ 
                                marginTop: '1.5rem', 
                                padding: '1rem',
                                background: 'var(--color-bg)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem'
                            }}>
                                <span style={{ color: !useSmartScore ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                                    Classic
                                </span>
                                <button
                                    onClick={() => setUseSmartScore(!useSmartScore)}
                                    style={{
                                        width: '50px',
                                        height: '26px',
                                        borderRadius: '13px',
                                        background: useSmartScore ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '3px',
                                        left: useSmartScore ? '27px' : '3px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        transition: 'left 0.2s'
                                    }} />
                                </button>
                                <span style={{ color: useSmartScore ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                                    SmartScore
                                </span>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Choose a Topic to Practice</h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1rem'
                        }}>
                            {topics.map((topic, idx) => (
                                <motion.button
                                    key={topic}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleTopicSelect(topic)}
                                    className="card"
                                    style={{
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        padding: '1.5rem',
                                        border: '2px solid var(--color-text)',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                        {topic === 'Addition' ? '➕' :
                                            topic === 'Subtraction' ? '➖' :
                                                topic === 'Multiplication' ? '✖️' :
                                                    topic === 'Division' ? '➗' :
                                                        topic === 'Fractions' ? '🍕' :
                                                            topic === 'Geometry' ? '📐' :
                                                                topic === 'Counting' ? '🔢' : '📚'}
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>
                                        {topic}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                ) : quizActive ? (
                    /* Active Quiz */
                    <>
                        <button
                            onClick={handleNewTopic}
                            className="btn"
                            style={{ marginBottom: '1.5rem' }}
                        >
                            ← Choose Different Topic
                        </button>

                        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--color-primary)' }}>{selectedTopic}</h2>
                        </div>

                        {useSmartScore ? (
                            <SmartScoreQuiz
                                studentId={state.user.id}
                                topic={selectedTopic}
                                skillName={selectedTopic}
                                onComplete={handleQuizComplete}
                                onExit={handleNewTopic}
                            />
                        ) : (
                            <AdaptiveQuizEngine
                                studentId={state.user.id}
                                topic={selectedTopic}
                                onComplete={handleQuizComplete}
                            />
                        )}
                    </>
                ) : results && (
                    /* Results Screen */
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="card" style={{ textAlign: 'center' }}>
                            {results.mastered ? (
                                <>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                        🏆 MASTERY ACHIEVED!
                                    </h2>
                                    <div style={{
                                        fontSize: '4rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        marginBottom: '1rem'
                                    }}>
                                        100
                                    </div>
                                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                        You've proven deep understanding of {selectedTopic}!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                        🎉 Practice Complete!
                                    </h2>

                                    <div style={{
                                        fontSize: '4rem',
                                        fontWeight: 'bold',
                                        color: 'var(--color-primary)',
                                        marginBottom: '1rem'
                                    }}>
                                        {results.score !== undefined ? 
                                            (typeof results.score === 'object' ? 
                                                ((results.score.correct / results.score.total) * 100).toFixed(0) + '%' :
                                                Math.round(results.score)
                                            ) : '0%'
                                        }
                                    </div>

                                    <div style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                        {results.correctCount !== undefined ?
                                            `${results.correctCount} out of ${results.totalAnswered} correct` :
                                            `${results.score?.correct || 0} out of ${results.score?.total || 0} correct`
                                        }
                                    </div>
                                </>
                            )}

                            {/* Performance breakdown */}
                            <div style={{
                                background: 'var(--color-bg)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '2rem',
                                textAlign: 'left'
                            }}>
                                <h3 style={{ marginBottom: '1rem' }}>Performance Summary</h3>

                                {results.score !== undefined && typeof results.score !== 'object' && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <strong>SmartScore:</strong>{' '}
                                        <span style={{
                                            fontWeight: 'bold',
                                            color: results.score >= 90 ? '#9C27B0' :
                                                results.score >= 80 ? '#4CAF50' :
                                                results.score >= 50 ? '#FF9800' : '#2196F3'
                                        }}>
                                            {Math.round(results.score)}
                                        </span>
                                    </div>
                                )}

                                {results.finalDifficulty && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <strong>Final Difficulty:</strong>{' '}
                                        <span className="badge" style={{
                                            background: results.finalDifficulty === 'easy' ? '#4caf50' :
                                                results.finalDifficulty === 'medium' ? '#ff9800' : '#f44336',
                                            color: 'white',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {results.finalDifficulty.toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                <div style={{ marginBottom: '0.75rem' }}>
                                    <strong>Questions Answered:</strong> {results.totalAnswered || results.score?.total || 0}
                                </div>

                                <div style={{ marginBottom: '0.75rem' }}>
                                    <strong>Accuracy:</strong> {
                                        results.totalAnswered ?
                                            ((results.correctCount / results.totalAnswered) * 100).toFixed(0) :
                                            ((results.score?.correct / results.score?.total) * 100 || 0).toFixed(0)
                                    }%
                                </div>

                                {results.timeSpent && (
                                    <div>
                                        <strong>Time:</strong> {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleTryAgain}
                                    className="btn btn-primary"
                                >
                                    {results.mastered ? 'Practice More' : `Continue ${selectedTopic}`}
                                </button>
                                <button
                                    onClick={handleNewTopic}
                                    className="btn"
                                >
                                    Choose New Topic
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdaptivePractice;
