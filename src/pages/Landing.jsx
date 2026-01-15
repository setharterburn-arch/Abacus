import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../services/store';


const Landing = () => {
    const { state, dispatch } = useStore();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);

    // Registration Form State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        grade: '',
        avatar: '👩‍',
        apiKey: state.apiKey || ''
    });

    useEffect(() => {
        if (state.user && state.apiKey) {
            navigate('/dashboard');
        }
    }, [state.user, state.apiKey, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.apiKey) {
            dispatch({ type: 'SET_API_KEY', payload: formData.apiKey });
        }

        const user = {
            name: formData.name,
            age: formData.age,
            grade: formData.grade,
            avatar: formData.avatar
        };

        dispatch({ type: 'SET_USER', payload: user });
        navigate('/dashboard');
    };

    const handleClear = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Math Whiz 🧮</h1>

                {state.user ? (
                    <div>
                        <h2>Welcome back, {state.user.name}!</h2>
                        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem', width: '100%' }}>
                            Continue Learning
                        </button>
                        <button className="btn btn-secondary" onClick={handleClear} style={{ marginTop: '0.5rem', width: '100%' }}>
                            Switch User
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label>Child's Name</label>
                            <input
                                className="input"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label>Age</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Grade Level</label>
                                <select
                                    className="input"
                                    value={formData.grade}
                                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1st Grade</option>
                                    <option value="2">2nd Grade</option>
                                    <option value="3">3rd Grade</option>
                                    <option value="4">4th Grade</option>
                                    <option value="5">5th Grade</option>
                                </select>
                            </div>
                        </div>

                        {!state.apiKey && (
                            // Only show input if API key is not provided via env vars
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label>Gemini API Key (Ask Parent)</label>
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    placeholder="AI Key..."
                                    value={formData.apiKey}
                                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                />
                                <small style={{ color: 'var(--color-text-muted)' }}>Required for AI Tutor</small>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Start Adventure 🚀
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Landing;
