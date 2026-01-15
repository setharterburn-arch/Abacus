import React from 'react';
import { motion } from 'framer-motion';

export const ProfessorHoot = ({ state = 'neutral', speaking = false }) => {
    // simple blinking animation
    const blinkVariants = {
        open: { scaleY: 1 },
        closed: { scaleY: 0.1 }
    };

    return (
        <motion.svg
            width="150"
            height="180"
            viewBox="0 0 150 180"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
        >
            {/* Body */}
            <ellipse cx="75" cy="100" rx="60" ry="70" fill="#a78bfa" stroke="#5b21b6" strokeWidth="3" />

            {/* Ears */}
            <path d="M30 50 L20 20 L50 40 Z" fill="#7c3aed" stroke="#5b21b6" strokeWidth="3" />
            <path d="M120 50 L130 20 L100 40 Z" fill="#7c3aed" stroke="#5b21b6" strokeWidth="3" />

            {/* Belly */}
            <ellipse cx="75" cy="110" rx="40" ry="50" fill="#ddd6fe" />

            {/* Eyes Container */}
            <g transform="translate(0, 10)">
                {/* Glasses */}
                <circle cx="55" cy="50" r="22" fill="white" stroke="#1e1b4b" strokeWidth="3" />
                <circle cx="95" cy="50" r="22" fill="white" stroke="#1e1b4b" strokeWidth="3" />
                <path d="M77 50 L73 50" stroke="#1e1b4b" strokeWidth="3" />

                {/* Pupils */}
                <motion.g
                    animate={speaking ? { y: [0, -2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                >
                    <motion.circle
                        cx="55" cy="50" r="8" fill="#1e1b4b"
                        animate="open"
                        variants={{
                            open: { scaleY: 1 },
                            closed: { scaleY: 0.1 }
                        }}
                    />
                    <motion.circle
                        cx="95" cy="50" r="8" fill="#1e1b4b"
                        animate="open"
                        variants={{
                            open: { scaleY: 1 },
                            closed: { scaleY: 0.1 }
                        }}
                    />
                </motion.g>
            </g>

            {/* Beak */}
            <motion.path
                d="M70 75 L80 75 L75 85 Z"
                fill="#fbbf24" stroke="#d97706" strokeWidth="2"
                animate={speaking ? { y: [0, 3, 0] } : {}}
                transition={{ repeat: Infinity, duration: 0.3 }}
            />

            {/* Wings */}
            <motion.path
                d="M15 100 Q10 130 35 140"
                fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"
                animate={state === 'happy' ? { rotate: [0, -10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
            />
            <motion.path
                d="M135 100 Q140 130 115 140"
                fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"
                animate={state === 'happy' ? { rotate: [0, 10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
            />
        </motion.svg>
    );
};

export const OrchardBackground = () => (
    <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        background: 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #86efac 60%, #4ade80 100%)',
        overflow: 'hidden'
    }}>
        {/* Sun */}
        <motion.div
            style={{
                position: 'absolute',
                top: '5%',
                right: '10%',
                width: '100px',
                height: '100px',
                background: '#fde047',
                borderRadius: '50%',
                boxShadow: '0 0 40px #fef08a'
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Clouds */}
        <motion.div
            style={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                fontSize: '80px',
                opacity: 0.8
            }}
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            ☁️
        </motion.div>

        {/* Tree Trunk items placed in main layout */}
    </div>
);
