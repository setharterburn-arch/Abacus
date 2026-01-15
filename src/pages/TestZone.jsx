import React, { useState, useEffect } from 'react';
import { useStore } from '../services/store';
import { getCurriculumSets, updateCurriculumStatus, saveStudentGrade } from '../services/database';
import HomeworkList from '../components/dashboard/HomeworkList';

const TestZone = () => {
    const { state, dispatch } = useStore();
    const [assignments, setAssignments] = useState([]);

    // Test State
    const [activeSet, setActiveSet] = useState(null); // The full set object
    const [testProblems, setTestProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [results, setResults] = useState({ correct: 0, total: 0, feedback: '' });
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        const sets = await getCurriculumSets('assigned');
        setAssignments(sets);
    };

    const startAssignment = (set) => {
        setActiveSet(set);
        setTestProblems(set.questions);
        setAnswers({});
        setCompleted(false);
    };

    const handleSolve = (id, isCorrect) => {
        setAnswers(prev => ({ ...prev, [id]: isCorrect }));
    };

    const submitTest = async () => {
        const total = testProblems.length;
        const correct = Object.values(answers).filter(Boolean).length;

        setLoading(true);
        let feedback = "Good job!";
        if (correct === total) feedback = "Perfect score! 🌟";
        else if (correct > total / 2) feedback = "Great effort! Keep practicing.";
        else feedback = "Let's review these topics together.";

        // Update Set Status
        if (activeSet) {
            await updateCurriculumStatus(activeSet.id, 'completed');
        }

        setResults({ correct, total, feedback });
        const gradeData = {
            date: new Date().toISOString(),
            score: Math.round((correct / total) * 100),
            feedback,
            title: activeSet?.title || 'Test'
        };

        // Save grade to Supabase
        await saveStudentGrade(gradeData);

        // Save grade to Store for local UI
        dispatch({
            type: 'ADD_GRADE',
            payload: gradeData
        });

        setCompleted(true);
        setLoading(false);

        // Refresh assignments list
        await loadAssignments();
    };

    const quitTest = () => {
        if (confirm("Quit this test? Progress will be lost.")) {
            setActiveSet(null);
            setTestProblems([]);
        }
    };

    if (completed) {
        return (
            <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <div className="card">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {Math.round((results.correct / results.total) * 100)}%
                    </h1>
                    <h2 style={{ marginBottom: '1rem' }}>Assignment Complete!</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{results.feedback}</p>
                    <button className="btn btn-primary" onClick={() => { setCompleted(false); setActiveSet(null); }} style={{ marginTop: '2rem' }}>
                        Back to My Assignments
                    </button>
                </div>
            </div>
        );
    }

    if (activeSet) {
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1>{activeSet.title} 📝</h1>
                    <button onClick={quitTest} className="btn" style={{ background: '#ffebee', color: '#c62828' }}>Quit</button>
                </div>

                <HomeworkList problems={testProblems} onSolve={handleSolve} />

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        className="btn btn-primary"
                        onClick={submitTest}
                        disabled={Object.keys(answers).length < testProblems.length || loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                    {Object.keys(answers).length < testProblems.length && (
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                            Answer all questions to submit.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>My Assignments 📚</h1>

            {assignments.length === 0 ? (
                <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>No assignments yet! 🎉</p>
                    <p>Ask your parent to assign a new curriculum set.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
                    {assignments.map(set => (
                        <div key={set.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{set.title}</h2>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{set.description}</p>
                                <span className="badge" style={{ marginTop: '0.5rem', display: 'inline-block', background: '#e3f2fd', color: '#1565c0' }}>
                                    {set.questions.length} Questions
                                </span>
                            </div>
                            <button className="btn btn-primary" onClick={() => startAssignment(set)}>
                                Start
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestZone;
