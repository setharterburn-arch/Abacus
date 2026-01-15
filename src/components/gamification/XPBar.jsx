import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

const XPBar = () => {
    const { stats } = useGamification();
    const { xp, level, coins } = stats;

    // XP Needed for next level
    const xpNeeded = level * 100;
    const percentage = Math.min((xp / xpNeeded) * 100, 100);

    return (
        <div style={{ padding: '1rem', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>

            {/* Level Circle */}
            <div style={{
                width: '50px', height: '50px', borderRadius: '50%', background: '#7c3aed',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
            }}>
                {level}
            </div>

            {/* Bar Container */}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    <span>Level {level}</span>
                    <span>{xp} / {xpNeeded} XP</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 50 }}
                        style={{ height: '100%', background: 'linear-gradient(to right, #a78bfa, #7c3aed)' }}
                    />
                </div>
            </div>

            {/* Coins */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#d97706' }}>
                <motion.span
                    key={coins}
                    initial={{ scale: 1.5, color: '#fbbf24' }}
                    animate={{ scale: 1, color: '#d97706' }}
                >
                    🪙 {coins}
                </motion.span>
            </div>
        </div>
    );
};

export default XPBar;
