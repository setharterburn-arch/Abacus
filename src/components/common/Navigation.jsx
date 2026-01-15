import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../services/store';

const Navigation = () => {
    const { state } = useStore();

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    if (!state.user) return null;

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
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Math Whiz 🧮</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => state.dispatch({ type: 'TOGGLE_THEME' })}
                        className="btn"
                        style={{ padding: '0.5rem', fontSize: '1.2rem', background: 'transparent' }}
                        title="Toggle Dark Mode"
                    >
                        {state.theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                        style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/test"
                        className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                        style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                    >
                        Test Zone
                    </NavLink>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                        style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                    >
                        Parents
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
