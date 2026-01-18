import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorAbacus } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';
import confetti from 'canvas-confetti';

// Use public assets instead of absolute paths
const crystalCaveBg = '/assets/crystal-vault/background.png';
const gemstoneCube = '/assets/crystal-vault/cube.png';
const gemstonePyramid = '/assets/crystal-vault/pyramid.png';
const gemstoneSphere = '/assets/crystal-vault/sphere.png';

const Gemstone = ({ id, type, image, isPlaced, onDragStart, onDragEnd }) => {
    return (
        <motion.div
            drag={!isPlaced}
            dragMomentum={false}
            onDragStart={() => onDragStart(id)}
            onDragEnd={(e, info) => onDragEnd(id, info)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
                scale: isPlaced ? 1 : [1, 1.1, 1],
                rotate: 0,
                filter: isPlaced ? 'brightness(1.5) drop-shadow(0 0 20px rgba(255,255,255,0.8))' : 'brightness(1)'
            }}
            transition={{
                scale: { repeat: isPlaced ? 0 : Infinity, duration: 2 },
                rotate: { duration: 0.8, type: "spring" }
            }}
            whileHover={{ scale: isPlaced ? 1 : 1.15 }}
            style={{
                width: '100px',
                height: '100px',
                cursor: isPlaced ? 'default' : 'grab',
                position: isPlaced ? 'absolute' : 'relative',
                zIndex: isPlaced ? 30 : 20
            }}
        >
            <img
                src={image}
                alt={type}
                style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                }}
            />
        </motion.div>
    );
};

const DropZone = ({ shape, isCorrect, children }) => {
    return (
        <motion.div
            animate={{
                boxShadow: isCorrect
                    ? '0 0 30px 10px rgba(147, 51, 234, 0.8)'
                    : '0 0 20px 5px rgba(147, 51, 234, 0.3)',
                scale: isCorrect ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.5 }}
            style={{
                width: '150px',
                height: '150px',
                border: '3px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCorrect
                    ? 'radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent)'
                    : 'radial-gradient(circle, rgba(147, 51, 234, 0.1), transparent)',
                position: 'relative'
            }}
        >
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                color: 'white',
                fontSize: '0.9rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                fontWeight: 'bold'
            }}>
                {shape}
            </div>
            {children}
        </motion.div>
    );
};

const CrystalVaultLesson = () => {
    const { awardXP } = useGamification();
    const [step, setStep] = useState(0); // 0: intro, 1: puzzle, 2: victory
    const [gemstones] = useState([
        { id: 'cube', type: 'Cube', image: gemstoneCube, correctZone: 'cube' },
        { id: 'pyramid', type: 'Pyramid', image: gemstonePyramid, correctZone: 'pyramid' },
        { id: 'sphere', type: 'Sphere', image: gemstoneSphere, correctZone: 'sphere' }
    ]);
    const [placements, setPlacements] = useState({});
    const [draggedGem, setDraggedGem] = useState(null);

    useEffect(() => {
        if (step === 1) {
            audioManager.speak("Welcome to the Crystal Vault! Match each magical gemstone to its correct pedestal by dragging them.");
        }
    }, [step]);

    const handleDragStart = (id) => {
        setDraggedGem(id);
    };

    const handleDragEnd = (id, info) => {
        // Check if dropped on a zone (simplified collision detection)
        const dropZones = document.querySelectorAll('[data-dropzone]');
        const gemElement = info.point;

        dropZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            if (
                gemElement.x >= rect.left &&
                gemElement.x <= rect.right &&
                gemElement.y >= rect.top &&
                gemElement.y <= rect.bottom
            ) {
                const zoneName = zone.getAttribute('data-dropzone');
                const gem = gemstones.find(g => g.id === id);

                if (gem.correctZone === zoneName) {
                    setPlacements(prev => ({ ...prev, [zoneName]: id }));
                    audioManager.playSfx('success');
                    confetti({ particleCount: 50, spread: 60, origin: { x: 0.5, y: 0.6 } });
                } else {
                    audioManager.speak("Hmm, that doesn't quite fit. Try another pedestal!");
                }
            }
        });

        setDraggedGem(null);
    };

    useEffect(() => {
        if (Object.keys(placements).length === 3) {
            setTimeout(() => {
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                audioManager.playSfx('success');
                audioManager.speak("Magnificent! You've unlocked the Crystal Vault!");
                awardXP(100);
                setStep(2);
            }, 500);
        }
    }, [placements]);

    if (step === 0) {
        return (
            <div style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${crystalCaveBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(2px)'
                }} />

                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        textAlign: 'center',
                        background: 'rgba(0, 0, 0, 0.6)',
                        padding: '3rem',
                        borderRadius: '30px',
                        border: '2px solid rgba(147, 51, 234, 0.5)'
                    }}
                >
                    <h1 style={{
                        fontSize: '3.5rem',
                        color: '#e9d5ff',
                        textShadow: '0 0 20px rgba(147, 51, 234, 0.8)',
                        marginBottom: '1rem'
                    }}>
                        💎 The Crystal Vault 💎
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        color: '#ddd6fe',
                        marginBottom: '2rem',
                        maxWidth: '500px'
                    }}>
                        Deep within the enchanted cave, three magical gemstones await.
                        Can you match each shape to its mystical pedestal?
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(1)}
                        style={{
                            fontSize: '1.2rem',
                            padding: '1rem 2rem',
                            background: 'linear-gradient(135deg, #9333ea, #6b21a8)',
                            border: 'none',
                            boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)'
                        }}
                    >
                        Enter the Vault ✨
                    </button>
                </motion.div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${crystalCaveBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.3)'
                }} />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        textAlign: 'center'
                    }}
                >
                    <h1 style={{
                        fontSize: '4rem',
                        color: '#fbbf24',
                        textShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
                        marginBottom: '2rem'
                    }}>
                        Vault Unlocked! 🌟
                    </h1>
                    <ProfessorAbacus state="happy" />
                    <p style={{
                        fontSize: '1.5rem',
                        color: '#e9d5ff',
                        marginTop: '2rem'
                    }}>
                        You've mastered the geometry of the crystals!
                    </p>
                    <button
                        className="btn"
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            background: 'white',
                            color: '#6b21a8',
                            fontSize: '1.1rem',
                            padding: '0.8rem 1.5rem'
                        }}
                    >
                        Explore Again
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            height: 'calc(100vh - 64px)',
            backgroundImage: `url(${crystalCaveBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.3)'
            }} />

            {/* Gemstone Collection Area */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '2rem',
                padding: '1.5rem',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '20px',
                border: '2px solid rgba(147, 51, 234, 0.5)',
                zIndex: 20
            }}>
                {gemstones.map(gem => {
                    const isPlaced = Object.values(placements).includes(gem.id);
                    if (isPlaced) return null;

                    return (
                        <Gemstone
                            key={gem.id}
                            id={gem.id}
                            type={gem.type}
                            image={gem.image}
                            isPlaced={false}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    );
                })}
            </div>

            {/* Drop Zones */}
            <div style={{
                position: 'absolute',
                bottom: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '3rem',
                zIndex: 10
            }}>
                {['cube', 'pyramid', 'sphere'].map(shape => {
                    const placedGemId = placements[shape];
                    const placedGem = gemstones.find(g => g.id === placedGemId);

                    return (
                        <div key={shape} data-dropzone={shape}>
                            <DropZone shape={shape.charAt(0).toUpperCase() + shape.slice(1)} isCorrect={!!placedGemId}>
                                {placedGem && (
                                    <Gemstone
                                        id={placedGem.id}
                                        type={placedGem.type}
                                        image={placedGem.image}
                                        isPlaced={true}
                                        onDragStart={() => { }}
                                        onDragEnd={() => { }}
                                    />
                                )}
                            </DropZone>
                        </div>
                    );
                })}
            </div>

            {/* Professor Abacus */}
            <motion.div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 30 }}>
                <ProfessorAbacus />
            </motion.div>

            {/* Hint */}
            <div style={{
                position: 'absolute',
                top: '120px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '1rem',
                borderRadius: '15px',
                color: '#e9d5ff',
                maxWidth: '250px',
                border: '1px solid rgba(147, 51, 234, 0.5)',
                zIndex: 20
            }}>
                <strong>💡 Hint:</strong> Drag each glowing gemstone to the pedestal that matches its shape!
            </div>
        </div>
    );
};

export default CrystalVaultLesson;
