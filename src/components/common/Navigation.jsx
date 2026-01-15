import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../services/store';

const Navigation = () => {
    const { state, dispatch } = useStore();

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    if (!state.session && !state.user) return null; // Wait for session or legacy user

    return (
        <nav style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1rem',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                    <img src="/logo.jpg" alt="Abacus Logo" style={{ height: '40px', borderRadius: '50%' }} />
                    Abacus
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                            Worksheets
                        </NavLink>
                    )}

                    {state.profile?.role === 'teacher' && (
                        <NavLink
                            to="/feedback"
                            className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                            style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                        >
                            Feedback
                        </NavLink>
                    )}

                    <NavLink
                        to="/test"
                        className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                        style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                    >
                        Test Zone
                    </NavLink>

                    {state.profile?.role === 'admin' && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                            style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                        >
                            Admin
                        </NavLink>
                    )}

                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                        className="btn"
                        style={{ padding: '0.5rem', fontSize: '1.2rem', background: 'transparent' }}
                        title="Toggle Dark Mode"
                    >
                        {state.theme === 'dark' ? '🌙' : '☀️'}
                    </button>

                    <button
                        onClick={() => dispatch({ type: 'LOGOUT' })}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
