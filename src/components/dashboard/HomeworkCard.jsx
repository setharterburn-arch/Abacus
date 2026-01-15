import React, { useState } from 'react';

const HomeworkCard = ({ problem, onSolve }) => {
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('unanswered'); // unanswered, correct, incorrect

    const checkAnswer = () => {
        // Basic normalization: trim and lowercase
        const normalizedUser = answer.trim().toLowerCase();
        const normalizedCorrect = problem.correctAnswer.trim().toLowerCase();

        if (normalizedUser === normalizedCorrect) {
            setStatus('correct');
            onSolve(problem.id, true);
        } else {
            setStatus('incorrect');
            onSolve(problem.id, false);
        }
    };

    const renderVisuals = () => {
        const { visual } = problem;
        if (!visual || visual.type === 'none') return null;

        if (visual.type === 'counting') {
            const count = Math.min(visual.count, 20);
            const itemMap = {
                'apple': '🍎', 'star': '⭐', 'ball': '⚽', 'cookie': '🍪', 'cat': '🐱'
            };
            const icon = itemMap[visual.item] || '🟦';

            return (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0', fontSize: '1.5rem' }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <span key={i}>{icon}</span>
                    ))}
                </div>
            );
        }

        if (visual.type === 'geometry') {
            const shapeStyle = {
                width: '100px', height: '100px', margin: '1rem auto'
            };
            const s = visual.shape?.toLowerCase();

            if (s === 'circle') return <div style={{ ...shapeStyle, background: '#e91e63', borderRadius: '50%' }} />;
            if (s === 'square') return <div style={{ ...shapeStyle, background: '#2196f3' }} />;
            if (s === 'rectangle') return <div style={{ ...shapeStyle, width: '160px', height: '80px', background: '#4caf50' }} />;
            if (s === 'triangle') return (
                <div style={{
                    ...shapeStyle, width: 0, height: 0, background: 'transparent',
                    borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '100px solid #ff9800'
                }} />
            );
        }
        return null;
    };

    return (
        <div className="card" style={{
            borderLeft: status === 'correct' ? '4px solid var(--color-accent)' :
                status === 'incorrect' ? '4px solid var(--color-secondary)' : 'none',
            transition: 'all 0.3s ease'
        }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Question {problem.id}</h3>
            {renderVisuals()}
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{problem.question}</p>

            {problem.options && problem.options.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {problem.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className={`btn ${answer === opt ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setAnswer(opt)}
                            disabled={status === 'correct'}
                            style={{ padding: '0.5rem' }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            ) : (
                <input
                    className="input"
                    placeholder="Your answer..."
                    style={{ marginBottom: '1rem' }}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={status === 'correct'}
                />
            )}

            {status !== 'correct' && (
                <button
                    className="btn btn-primary"
                    onClick={checkAnswer}
                    disabled={!answer}
                    style={{ width: '100%' }}
                >
                    Check Answer
                </button>
            )}

            {status === 'correct' && (
                <div style={{ marginTop: '1rem', color: 'var(--color-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Correct! 🎉</span>
                    <span>{problem.explanation}</span>
                </div>
            )}

            {status === 'incorrect' && (
                <div style={{ marginTop: '0.5rem', color: 'var(--color-secondary)' }}>
                    Not quite. Try again!
                </div>
            )}
        </div>
    );
};

export default HomeworkCard;
