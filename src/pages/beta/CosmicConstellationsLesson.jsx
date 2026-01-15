import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorAbacus, CosmicBackground } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';

const Star = ({ x, y, active, onClick, delay }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
            scale: active ? 1.5 : [1, 1.2, 1],
            opacity: 1,
            boxShadow: active ? "0 0 20px 5px rgba(255, 255, 255, 0.8)" : "0 0 5px rgba(255, 255, 255, 0.5)"
        }}
        transition={{
            delay: delay,
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
        onClick={onClick}
        style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: active ? '#fbbf24' : 'white',
            cursor: 'pointer',
            zIndex: 20
        }}
    />
);

const Line = ({ start, end }) => {
    // Calculate SVG line coordinates from percentages
    // This requires a bit of ref assumption, but for full screen we can simplify using SVG overlay
    // For this prototype, we'll use absolute div rotation or just SVG overlay logic in the main file
    return null; // Implemented in SVG layer
};

const CosmicConstellationsLesson = () => {
    const { awardXP } = useGamification();
    const [step, setStep] = useState(0); // 0: Triangle, 1: Square, 2: Victory
    const [connected, setConnected] = useState([]); // Array of connected star IDs

    // Constellation Data
    const levels = [
        {
            name: "The Triangle",
            stars: [
                { id: 1, x: 50, y: 20 },
                { id: 2, x: 30, y: 70 },
                { id: 3, x: 70, y: 70 }
            ],
            connections: [[1, 2], [2, 3], [3, 1]] // Required connections
        },
        {
            name: "The Square",
            stars: [
                { id: 1, x: 30, y: 30 },
                { id: 2, x: 70, y: 30 },
                { id: 3, x: 70, y: 70 },
                { id: 4, x: 30, y: 70 }
            ],
            connections: [[1, 2], [2, 3], [3, 4], [4, 1]]
        }
    ];

    const currentLevel = levels[step];

    useEffect(() => {
        if (step < 2) {
            audioManager.speak(`Look at the stars! Connect them to make a ${levels[step].name.toLowerCase()}.`);
        }
    }, [step]);

    const handleStarClick = (id) => {
        // Simple logic: connect last clicked to this one if valid
        const last = connected[connected.length - 1];
        if (last && last !== id) {
            // Check if already connected logic could be here, but for simplicity we just allow adding to path
            // In a real connect-the-dots, we often guide them 1 -> 2 -> 3
        }

        // Auto-solver for demo "Wow" factor: 
        // Clicking a star activates it. If all stars active, form shape.
        if (!connected.includes(id)) {
            const newConnected = [...connected, id];
            setConnected(newConnected);
            audioManager.playSfx('pop');

            // Victory check
            if (newConnected.length === currentLevel.stars.length) {
                setTimeout(() => {
                    audioManager.playSfx('success');
                    if (step === 0) {
                        setStep(1);
                        setConnected([]);
                        awardXP(50);
                    } else {
                        setStep(2);
                        awardXP(100);
                        audioManager.speak("Magical! You found all the constellations.");
                    }
                }, 1000);
            }
        }
    };

    if (step === 2) {
        return (
            <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <CosmicBackground />
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white' }}>
                    <motion.h1
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        style={{ fontSize: '4rem', textShadow: "0 0 20px #fbbf24" }}
                    >
                        Stellar Job! 🌟
                    </motion.h1>
                    <ProfessorAbacus state="happy" />
                    <button className="btn" style={{ marginTop: '2rem', background: 'white', color: 'black' }} onClick={() => window.location.reload()}>
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <CosmicBackground />

            <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                <h2 style={{ color: 'white', textAlign: 'center', marginTop: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {currentLevel.name}
                </h2>

                {/* SVG Layer for Lines */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <AnimatePresence>
                        {connected.length > 1 && connected.map((starId, i) => {
                            if (i === 0) return null;
                            const prevId = connected[i - 1];
                            const prevStar = currentLevel.stars.find(s => s.id === prevId);
                            const currStar = currentLevel.stars.find(s => s.id === starId);

                            // Close loop for last segment if full
                            // (Simplified: just draw lines between click sequence)

                            return (
                                <motion.line
                                    key={i}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    x1={`${prevStar.x}%`} y1={`${prevStar.y}%`}
                                    x2={`${currStar.x}%`} y2={`${currStar.y}%`}
                                    stroke="#fbbf24"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    style={{ filter: "drop-shadow(0 0 5px #f59e0b)" }}
                                />
                            );

                        })}
                        {/* Auto-close the loop for visual flair if all connected */}
                        {connected.length === currentLevel.stars.length && (
                            <motion.line
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                x1={`${currentLevel.stars.find(s => s.id === connected[connected.length - 1]).x}%`}
                                y1={`${currentLevel.stars.find(s => s.id === connected[connected.length - 1]).y}%`}
                                x2={`${currentLevel.stars.find(s => s.id === connected[0]).x}%`}
                                y2={`${currentLevel.stars.find(s => s.id === connected[0]).y}%`}
                                stroke="#fbbf24"
                                strokeWidth="4"
                                strokeLinecap="round"
                                style={{ filter: "drop-shadow(0 0 5px #f59e0b)" }}
                            />
                        )}
                    </AnimatePresence>
                </svg>

                {/* Stars */}
                {currentLevel.stars.map((star, i) => (
                    <Star
                        key={star.id}
                        x={star.x}
                        y={star.y}
                        active={connected.includes(star.id)}
                        onClick={() => handleStarClick(star.id)}
                        delay={i * 0.2}
                    />
                ))}

                <motion.div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                    <ProfessorAbacus />
                </motion.div>

                <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'rgba(255,255,255,0.6)' }}>
                    Tap stars to connect them under the night sky.
                </div>
            </div>
        </div>
    );
};

export default CosmicConstellationsLesson;
