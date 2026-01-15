import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    // Registration Fields
    const [role, setRole] = useState('student'); // 'student' or 'teacher'
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gradeLevel, setGradeLevel] = useState(1);

    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                // Store provider will handle session update and redirect
                navigate('/dashboard');
            } else {
                // Sign Up
                const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role,
                            first_name: firstName,
                            last_name: lastName,
                            grade_level: role === 'student' ? gradeLevel : null
                        }
                    }
                });

                if (signUpError) throw signUpError;

                if (user) {
                    // Profile creation is now handled by a Database Trigger
                    alert('Registration successful! Please sign in.');
                    setIsLogin(true);
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                    {isLogin ? 'Welcome Back!' : 'Join Math Whiz'}
                </h2>

                <form onSubmit={handleAuth}>
                    {!isLogin && (
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <button
                                    type="button"
                                    className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setRole('student')}
                                    style={{ flex: 1 }}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${role === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setRole('teacher')}
                                    style={{ flex: 1 }}
                                >
                                    Teacher
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <input
                                    className="input"
                                    placeholder="First Name"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <input
                                    className="input"
                                    placeholder="Last Name"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            {role === 'student' && (
                                <div style={{ marginTop: '1rem' }}>
                                    <label>Grade Level</label>
                                    <select
                                        className="input"
                                        value={gradeLevel}
                                        onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(g => (
                                            <option key={g} value={g}>Grade {g}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="email"
                            className="input"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn"
                            style={{ background: 'transparent', color: 'var(--color-primary)' }}
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
