import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ProfessorAbacus, SafariBackground, AssetImages } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';

const ShapeSafariLesson = () => {
    const { awardXP } = useGamification();
    const [currentStep, setCurrentStep] = useState(0);
    const [foundShapes, setFoundShapes] = useState([]);

    // Initial Ambience
    useEffect(() => {
        const handleStart = () => audioManager.startAmbience();
        window.addEventListener('click', handleStart, { once: true });
        return () => window.removeEventListener('click', handleStart);
    }, []);

    const lesson = {
        title: "Shape Safari 🦒",
        steps: [
            {
                type: 'intro',
                narration: "Roar! Grab your binoculars! We need to find the hidden shapes in the jungle.",
                instruction: "Click 'Start' to explore!",
                visual: 'welcome'
            },
            {
                type: 'interactive',
                narration: "I spy with my lion eye... 3 Triangles! Can you click all of them?",
                visual: 'safari',
                targetShape: 'triangle',
                targetCount: 3,
                instruction: "Find 3 Triangles 🔺"
            },
            {
                type: 'celebration',
                narration: "Fantastic finding! You are a shape expert!",
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

    const handleShapeClick = (shapeType, id) => {
        if (foundShapes.includes(id)) return;

        if (shapeType === currentStepData.targetShape) {
            audioManager.playSfx('success');
            audioManager.speak("You found one!");
            const newFound = [...foundShapes, id];
            setFoundShapes(newFound);

            if (newFound.length === currentStepData.targetCount) {
                audioManager.playSfx('success');
                awardXP(30);
                setTimeout(() => nextStep(), 2000);
            }
        } else {
            audioManager.speak("That's not a triangle!");
        }
    };

    const nextStep = () => {
        if (currentStep < lesson.steps.length - 1) {
            setCurrentStep(curr => curr + 1);
            setFoundShapes([]);
        }
    };

    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', background: '#ecfccb' }}>
            <SafariBackground />

            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <motion.div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 20 }}>
                    <ProfessorAbacus />
                </motion.div>

                <AnimatePresence mode='wait'>
                    {currentStepData.visual === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            style={{ textAlign: 'center', background: 'rgba(255,255,255,0.9)', padding: '3rem', borderRadius: '30px' }}
                        >
                            <h1 style={{ fontSize: '4rem', color: '#15803d', marginBottom: '1rem' }}>{lesson.title}</h1>
                            <button className="btn btn-primary" onClick={nextStep} style={{ fontSize: '1.5rem', padding: '1rem 3rem' }}>Start Safari! 🚙</button>
                        </motion.div>
                    )}

                    {currentStepData.visual === 'safari' && (
                        <div style={{ width: '800px', height: '500px', position: 'relative' }}>
                            {/* Shapes hiding in the grass (simple divs for now) */}
                            {/* Triangles */}
                            {[1, 2, 3].map(id => (
                                <motion.div
                                    key={`tri-${id}`}
                                    onClick={() => handleShapeClick('triangle', `tri-${id}`)}
                                    initial={{ opacity: 0.8 }}
                                    animate={foundShapes.includes(`tri-${id}`) ? { scale: 1.5, opacity: 0 } : {}}
                                    whileHover={{ scale: 1.1 }}
                                    style={{
                                        position: 'absolute',
                                        width: 0, height: 0,
                                        borderLeft: '50px solid transparent',
                                        borderRight: '50px solid transparent',
                                        borderBottom: '100px solid #facc15', // Yellow triangle
                                        top: `${20 + id * 20}%`,
                                        left: `${20 + id * 25}%`,
                                        cursor: 'pointer',
                                        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))'
                                    }}
                                />
                            ))}

                            {/* Distractors (Squares) */}
                            {[1, 2].map(id => (
                                <motion.div
                                    key={`sq-${id}`}
                                    onClick={() => handleShapeClick('square', `sq-${id}`)}
                                    whileHover={{ scale: 1.1 }}
                                    style={{
                                        position: 'absolute',
                                        width: '80px', height: '80px',
                                        background: '#3b82f6', // Blue square
                                        top: `${10 + id * 30}%`,
                                        left: `${10 + id * 15}%`,
                                        cursor: 'pointer',
                                        borderRadius: '10px'
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {currentStepData.visual === 'celebration' && (
                        <motion.div
                            key="celebration"
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '30px' }}
                        >
                            <h1 style={{ fontSize: '3rem', color: '#15803d' }}>Safari Successful!</h1>
                            <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>Play Again</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ShapeSafariLesson;
