import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/store';

const Navigation = () => {
    const { state, dispatch } = useStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    const isLoggedIn = state.session || state.user;

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1rem',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '3px solid var(--color-text)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
                <NavLink
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: 'clamp(1.1rem, 3vw, 1.44rem)',
                        color: 'var(--color-primary)',
                        textDecoration: 'none'
                    }}
                    onClick={closeMobileMenu}
                >
                    <img src="/logo.jpg" alt="Abacus Logo" style={{ height: '40px', borderRadius: '50%', border: '2px solid var(--color-text)' }} />
                    Abacus Learn
                </NavLink>

                {/* Hamburger Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="mobile-only"
                    style={{
                        background: 'var(--color-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        flexDirection: 'column',
                        gap: '4px'
                    }}
                    aria-label="Toggle menu"
                >
                    <span style={{ width: '24px', height: '3px', background: 'white', borderRadius: '2px' }} />
                    <span style={{ width: '24px', height: '3px', background: 'white', borderRadius: '2px' }} />
                    <span style={{ width: '24px', height: '3px', background: 'white', borderRadius: '2px' }} />
                </button>

                {/* Desktop Navigation */}
                <div className="desktop-only" style={{ gap: '1rem', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/practice"
                                className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                            >
                                Practice 🎯
                            </NavLink>

                            <NavLink
                                to="/assignments"
                                className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                            >
                                Assignments 📋
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

                            <button
                                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                                className="btn"
                                style={{ padding: '0.5rem 1rem' }}
                                aria-label="Toggle theme"
                            >
                                {state.theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/auth"
                                className="btn btn-primary"
                                style={{ textDecoration: 'none', padding: '0.5rem 1.5rem' }}
                            >
                                Sign In
                            </NavLink>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '73px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                    onClick={closeMobileMenu}
                >
                    <div
                        style={{
                            background: 'var(--color-bg-card)',
                            borderBottom: '3px solid var(--color-text)',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isLoggedIn ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                    style={{ textDecoration: 'none', padding: '0.75rem 1rem', width: '100%', textAlign: 'center' }}
                                    onClick={closeMobileMenu}
                                >
                                    Dashboard 🏠
                                </NavLink>

                                <NavLink
                                    to="/practice"
                                    className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                    style={{ textDecoration: 'none', padding: '0.75rem 1rem', width: '100%', textAlign: 'center' }}
                                    onClick={closeMobileMenu}
                                >
                                    Practice 🎯
                                </NavLink>

                                <NavLink
                                    to="/assignments"
                                    className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                    style={{ textDecoration: 'none', padding: '0.75rem 1rem', width: '100%', textAlign: 'center' }}
                                    onClick={closeMobileMenu}
                                >
                                    Assignments 📋
                                </NavLink>

                                {state.profile?.role === 'teacher' && (
                                    <NavLink
                                        to="/worksheets"
                                        className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                        style={{ textDecoration: 'none', padding: '0.75rem 1rem', width: '100%', textAlign: 'center' }}
                                        onClick={closeMobileMenu}
                                    >
                                        Worksheets 🖨️
                                    </NavLink>
                                )}

                                <NavLink
                                    to="/account"
                                    className={({ isActive }) => isActive ? 'btn btn-primary' : 'btn'}
                                    style={{ textDecoration: 'none', padding: '0.75rem 1rem', width: '100%', textAlign: 'center' }}
                                    onClick={closeMobileMenu}
                                >
                                    My Account 👤
                                </NavLink>

                                <button
                                    onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                                    className="btn"
                                    style={{ padding: '0.75rem 1rem', width: '100%', textAlign: 'center' }}
                                    aria-label="Toggle theme"
                                >
                                    {state.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/auth"
                                    className="btn btn-primary"
                                    style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', width: '100%', textAlign: 'center' }}
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
