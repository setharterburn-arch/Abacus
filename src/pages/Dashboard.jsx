import React, { useState, useEffect } from 'react';
import { useStore } from '../services/store';
import { getCurriculumSets } from '../services/database';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { state } = useStore();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const load = async () => {
            const sets = await getCurriculumSets('assigned');
            setAssignments(sets);
        };
        load();
    }, []);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--color-primary)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Ready to learn, {state.user?.name}?</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>{state.user?.avatar}</span>
                    <div style={{ textAlign: 'right' }}>
                        <strong>Grade {state.user?.grade}</strong>
                        <br />
                        <small>{state.user?.age} years old</small>
                    </div>
                </div>
            </header>

            <div>
                <h2>My Assignments 📚</h2>
                {assignments.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '1rem' }}>
                        <h3>No Homework Yet! 🏖️</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>You're all caught up. Check back later!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        {assignments.map(set => (
                            <div key={set.id} className="card" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: '4px solid var(--color-primary)'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{set.title}</h3>
                                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{set.description}</p>
                                    <span className="badge" style={{ marginTop: '0.5rem', display: 'inline-block', background: '#e3f2fd', color: '#1565c0' }}>
                                        {set.questions.length || 0} Questions
                                    </span>
                                </div>
                                <Link to="/test" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                    Go to Test Zone
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h3>Recent Progress</h3>
                {state.grades.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>No tests completed yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {state.grades.slice(0, 4).map((g, i) => (
                            <div key={i} className="card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{new Date(g.date).toLocaleDateString()}</strong>
                                    <span style={{ fontWeight: 'bold', color: g.score >= 80 ? 'var(--color-accent)' : 'var(--color-secondary)' }}>{g.score}%</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', margin: 0 }}>{g.title || 'Math Test'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
