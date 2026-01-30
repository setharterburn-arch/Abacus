import React, { useState } from 'react';
import { supabase } from '../../services/supabase';

const AssignmentRunner = ({ assignment, studentId, onClose }) => {
    const [answers, setAnswers] = useState({}); // { 0: 'Option A', 1: 'Option B' }
    const [status, setStatus] = useState('active'); // active, submitting, complete
    const [score, setScore] = useState(null);

    const handleSelect = (questionIndex, option) => {
        if (status !== 'active') return;
        setAnswers({
            ...answers,
            [questionIndex]: option
        });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < assignment.questions.length) {
            if (!window.confirm("You haven't answered all questions. Submit anyway?")) return;
        }

        setStatus('submitting');

        // Calculate Score
        let correctCount = 0;
        assignment.questions.forEach((q, i) => {
            if (answers[i] === q.answer) correctCount++;
        });
        const finalScore = Math.round((correctCount / assignment.questions.length) * 100);
        setScore(finalScore);

        try {
            const { error } = await supabase
                .from('assignment_submissions')
                .insert([{
                    assignment_id: assignment.id,
                    student_id: studentId,
                    answers: answers,
                    score: finalScore,
                    status: 'graded'
                }]);

            if (error) throw error;
            setStatus('complete');
        } catch (error) {
            alert('Error submitting: ' + error.message);
            setStatus('active');
        }
    };

    if (status === 'complete') {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>
                    {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
                </h1>
                <h2>Assignment Complete!</h2>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: '1rem 0' }}>
                    {score}%
                </div>
                <p>You got {Math.round((score / 100) * assignment.questions.length)} out of {assignment.questions.length} correct.</p>
                <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '2rem' }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>{assignment.title}</h2>
                    <button className="btn" onClick={onClose}>Exit</button>
                </div>
                <p style={{ color: 'gray', margin: '0.5rem 0 0 0' }}>{assignment.description}</p>
            </header>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {assignment.questions.map((q, i) => (
                    <div key={i} className="card">
                        <h4 style={{ margin: '0 0 1rem 0' }}>Question {i + 1}</h4>

                        {/* Display image if present */}
                        {q.image && (
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <img
                                    src={q.image}
                                    alt="Question illustration"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '8px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        )}

                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{q.question}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {q.options.map((opt, j) => (
                                <button
                                    key={j}
                                    onClick={() => handleSelect(i, opt)}
                                    className={`btn ${answers[i] === opt ? 'btn-primary' : 'btn-outline'}`}
                                    style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        background: answers[i] === opt ? 'var(--color-primary)' : 'var(--color-bg-card)',
                                        color: answers[i] === opt ? 'white' : 'var(--color-text)',
                                        border: '2px solid var(--color-text)'
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button
                    className="btn btn-primary"
                    style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                    onClick={handleSubmit}
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Answers'}
                </button>
            </div>
        </div>
    );
};

export default AssignmentRunner;
