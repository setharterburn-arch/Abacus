import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/store';

const Navigation = () => {
    const { state, dispatch } = useStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    const isLoggedIn = state.session || state.user;

    return (
        <nav style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1rem',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '3px solid var(--color-text)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NavLink
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: 'var(--color-primary)',
                        textDecoration: 'none'
                    }}
                >
                    <img src="/logo.jpg" alt="Abacus Logo" style={{ height: '40px', borderRadius: '50%', border: '2px solid var(--color-text)' }} />
                    Abacus
                </NavLink>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                            >
                                Dashboard
                            </NavLink>

                            {state.profile?.role === 'teacher' && (
                                <NavLink
                                    to="/worksheets"
                                    className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                    style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                                >
                                    Worksheets 🖨️
                                </NavLink>
                            )}

                            <NavLink
                                to="/account"
                                className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                            >
                                My Account 👤
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/demo')}
                                className="btn"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Demo Lessons 🎮
                            </button>
                            <button
                                onClick={() => navigate('/auth')}
                                className="btn btn-primary"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Sign In / Sign Up
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                        className="btn"
                        style={{ padding: '0.5rem', fontSize: '1.2rem', background: 'transparent' }}
                        title="Toggle Dark Mode"
                    >
                        {state.theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
