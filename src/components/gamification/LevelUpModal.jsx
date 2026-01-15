import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

const LevelUpModal = () => {
    const { showLevelUp, setShowLevelUp, stats } = useGamification();

    if (!showLevelUp) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onClick={() => setShowLevelUp(false)}
            >
                <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    style={{
                        background: 'white', padding: '3rem', borderRadius: '30px', textAlign: 'center',
                        maxWidth: '500px', width: '90%', border: '5px solid #fbbf24',
                        boxShadow: '0 0 50px rgba(251, 191, 36, 0.5)'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <h1 style={{ fontSize: '4rem', color: '#d97706', margin: 0, textShadow: '2px 2px 0 white' }}>
                        LEVEL UP!
                    </h1>
                    <div style={{ fontSize: '8rem', margin: '1rem 0' }}>⭐</div>

                    <h2 style={{ fontSize: '2rem', color: '#4b5563' }}>
                        You reached Level {stats.level}!
                    </h2>

                    <p style={{ fontSize: '1.5rem', color: '#16a34a', fontWeight: 'bold' }}>
                        +20 Coins 🪙
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowLevelUp(false)}
                        style={{ fontSize: '1.5rem', marginTop: '2rem', padding: '1rem 3rem' }}
                    >
                        Awesome!
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LevelUpModal;
