import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ProfessorAbacus, SpaceBackground, AssetImages } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';

const SpaceRaceLesson = () => {
    const { awardXP } = useGamification();
    const [currentStep, setCurrentStep] = useState(0);
    const [count, setCount] = useState(0); // For progress tracking
    const [clickedItems, setClickedItems] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Initial Ambience
    useEffect(() => {
        const handleStart = () => audioManager.startAmbience();
        window.addEventListener('click', handleStart, { once: true });
        return () => window.removeEventListener('click', handleStart);
    }, []);

    const lesson = {
        title: "Space Race Mission 🚀",
        steps: [
            {
                type: 'intro',
                narration: "Ground Control to Professor Abacus! We need to launch the rocket. Can you help me count down?",
                instruction: "Ready for blast off?",
                visual: 'welcome'
            },
            {
                type: 'interactive',
                narration: "Tap the planets in order: 2, 4, 6, 8, 10 to fuel the engines!",
                visual: 'planets',
                targetSequence: [2, 4, 6, 8, 10],
                instruction: "Tap in order: 2, 4, 6, 8, 10"
            },
            {
                type: 'celebration',
                narration: "Engines at full power! 3, 2, 1, BLAST OFF!",
                visual: 'celebration'
            }
        ]
    };

    const currentStepData = lesson.steps[currentStep];

    useEffect(() => {
        if (currentStepData?.narration) {
            setTimeout(() => {
                audioManager.speak(currentStepData.narration);
            }, 800);
        }
    }, [currentStep]);

    const handlePlanetClick = (num, index) => {
        const expectedNum = currentStepData.targetSequence?.[count];

        if (num === expectedNum) {
            audioManager.playSfx('pop');
            audioManager.speak(num.toString());

            setClickedItems([...clickedItems, index]);
            setCount(prev => prev + 1);

            if (count + 1 === currentStepData.targetSequence.length) {
                audioManager.playSfx('success');
                awardXP(30); // Higher reward for math!
                setTimeout(() => {
                    nextStep();
                }, 1500);
            }
        } else {
            // Wrong number feedback
            audioManager.playSfx('pop'); // maybe a dull thud later
            audioManager.speak("Not quite! Try " + expectedNum);
        }
    };

    const nextStep = () => {
        if (currentStep < lesson.steps.length - 1) {
            setCurrentStep(curr => curr + 1);
            setCount(0);
            setClickedItems([]);
        }
    };

    const resetLesson = () => {
        setCurrentStep(0);
        setCount(0);
        setClickedItems([]);
    };

    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
            <SpaceBackground />

            {/* Main Area */}
            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Professor Abacus in Space Helmet (Imaginary helmet for now) */}
                <motion.div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 20 }}>
                    <ProfessorAbacus speaking={isSpeaking} />
                </motion.div>

                <AnimatePresence mode='wait'>
                    {currentStepData.visual === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            style={{ textAlign: 'center' }}
                        >
                            <h1 style={{ fontSize: '4rem', color: '#e2e8f0', textShadow: '0 0 20px #3b82f6', marginBottom: '2rem' }}>
                                {lesson.title}
                            </h1>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary"
                                onClick={nextStep}
                                style={{ fontSize: '2rem', padding: '1rem 3rem', borderRadius: '50px', background: '#3b82f6', border: 'none' }}
                            >
                                START MISSION 🚀
                            </motion.button>
                        </motion.div>
                    )}

                    {currentStepData.visual === 'planets' && (
                        <motion.div
                            key="planets"
                            style={{ width: '100%', maxWidth: '900px', height: '500px', position: 'relative' }}
                        >
                            {/* Rocket waiting */}
                            <motion.img
                                src={AssetImages.rocket}
                                style={{ position: 'absolute', bottom: '20px', left: '50%', x: '-50%', width: '100px' }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />

                            {/* Planets distributed */}
                            {[2, 4, 6, 8, 10].map((num, i) => {
                                // Zig zag path
                                const left = 20 + (i % 2) * 50 + '%';
                                const top = 80 - (i * 15) + '%';
                                const isCollected = clickedItems.includes(i);

                                return (
                                    <motion.div
                                        key={num}
                                        style={{ position: 'absolute', left, top, cursor: 'pointer' }}
                                        onClick={() => handlePlanetClick(num, i)}
                                        whileHover={{ scale: 1.2 }}
                                        animate={isCollected ? { scale: 1.5, opacity: 0, filter: 'brightness(2)' } : { scale: 1, opacity: 1 }}
                                    >
                                        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={AssetImages.planet} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `hue-rotate(${i * 45}deg)` }} />
                                            <span style={{ position: 'absolute', fontSize: '2rem', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px black' }}>{num}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {currentStepData.visual === 'celebration' && (
                        <motion.div
                            key="celebration"
                            style={{ textAlign: 'center', width: '100%', height: '100%', position: 'relative' }}
                        >
                            <motion.img
                                src={AssetImages.rocket}
                                style={{ width: '200px', position: 'absolute', left: '50%', x: '-50%' }}
                                initial={{ top: '80%' }}
                                animate={{ top: '-50%' }}
                                transition={{ duration: 3, ease: 'easeIn' }}
                                onAnimationComplete={() => {
                                    confetti({ particleCount: 200, spread: 150 });
                                }}
                            />
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                style={{ color: 'white', fontSize: '4rem', marginTop: '20%' }}
                            >
                                MISSION COMPLETE!
                            </motion.h1>
                            <button className="btn btn-primary" onClick={resetLesson} style={{ marginTop: '2rem' }}>Replay</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SpaceRaceLesson;
