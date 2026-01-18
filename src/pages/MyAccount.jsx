import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { useStore } from '../services/store';

const MyAccount = () => {
    const navigate = useNavigate();
    const { stats } = useGamification();
    const { dispatch } = useStore();

    const handleLogout = async () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    const menuItems = [
        {
            title: 'Abacus\'s Shop 🎩',
            desc: 'Spend your hard-earned coins!',
            path: '/shop',
            color: '#facc15'
        },
        {
            title: 'Beta Lab 🧪',
            desc: 'Try our newest experimental lessons.',
            path: '/beta',
            color: '#3b82f6'
        },
        {
            title: 'Feedback 📝',
            desc: 'Tell us how we are doing.',
            path: '/feedback',
            color: '#a855f7'
        }
    ];

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>My Account</h1>

            {/* Profile Summary */}
            <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '3rem', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: '#e5e7eb', borderRadius: '50%', margin: '0 auto 1rem auto', overflow: 'hidden' }}>
                    <img src="/logo.jpg" alt="Profile" style={{ width: '100%', height: '100%' }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}>Student</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d' }}>{stats.level}</div>
                        <div style={{ fontSize: '0.8rem', color: 'gray' }}>Level</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{stats.coins}</div>
                        <div style={{ fontSize: '0.8rem', color: 'gray' }}>Coins</div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {menuItems.map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: 'var(--color-bg-card)',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            borderTop: `4px solid ${item.color}`
                        }}
                    >
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--color-text)' }}>{item.title}</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="btn"
                style={{ display: 'block', margin: '3rem auto 0 auto', background: '#ef4444', color: 'white', border: 'none' }}
            >
                Log Out 🚪
            </button>
        </div>
    );
};

export default MyAccount;
