import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../services/store';

const Navigation = () => {
    const { state } = useStore();

    if (!state.user) return null;

    return (
        <nav style={{
            backgroundColor: 'white',
            padding: '1rem',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Math Whiz 🧮</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
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
