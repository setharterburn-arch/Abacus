import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ProfessorAbacus, PizzaBackground, AssetImages } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';

const PizzaPartyLesson = () => {
    const { awardXP } = useGamification();
    const [currentStep, setCurrentStep] = useState(0);
    const [slices, setSlices] = useState([true, true, true, true]); // 4 slices present

    // Initial Ambience
    useEffect(() => {
        const handleStart = () => audioManager.startAmbience();
        window.addEventListener('click', handleStart, { once: true });
        return () => window.removeEventListener('click', handleStart);
    }, []);

    const lesson = {
        title: "Fraction Pizza Party! 🍕",
        steps: [
            {
                type: 'intro',
                narration: "Roar! I'm starving! Can you help me learn fractions with this delicious pepperoni pizza?",
                instruction: "Click 'Start' to cook!",
                visual: 'welcome'
            },
            {
                type: 'interactive',
                narration: "I want to eat HALF of the pizza. Since there are 4 slices, how many should I eat? Click the slices to eat them!",
                visual: 'pizza',
                targetSlicesLeft: 2, // 2 removed out of 4 = 1/2
                instruction: "Eat 2 slices to leave HALF."
            },
            {
                type: 'celebration',
                narration: "Yum! That was delicious. 2 slices is exactly half of 4. You're a master chef!",
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

    const handleSliceClick = (index) => {
        if (!slices[index]) return; // Already eaten

        const newSlices = [...slices];
        newSlices[index] = false; // Eat it
        setSlices(newSlices);

        audioManager.playSfx('pop'); // Crunch sound ideally

        const slicesLeft = newSlices.filter(s => s).length;
        const slicesEaten = 4 - slicesLeft;

        // Feedback
        if (slicesLeft === currentStepData.targetSlicesLeft) {
            audioManager.playSfx('success');
            awardXP(15);
            audioManager.speak("Perfect! That's half the pizza!");
            setTimeout(() => nextStep(), 2000);
        } else if (slicesLeft < currentStepData.targetSlicesLeft) {
            audioManager.speak("Oh no! You ate too much! Let's bake a new one.");
            setTimeout(() => setSlices([true, true, true, true]), 2000);
        } else {
            audioManager.speak(`${slicesEaten} slices eaten... need more!`);
        }
    };

    const nextStep = () => {
        if (currentStep < lesson.steps.length - 1) {
            setCurrentStep(curr => curr + 1);
            setSlices([true, true, true, true]);
        }
    };

    const resetLesson = () => {
        setCurrentStep(0);
        setSlices([true, true, true, true]);
    };

    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', background: '#fff7ed' }}>
            <PizzaBackground />

            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <motion.div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
                    <ProfessorAbacus />
                </motion.div>

                <AnimatePresence mode='wait'>
                    {currentStepData.visual === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        >
                            <h1 style={{ fontSize: '3rem', color: '#c2410c', marginBottom: '1rem' }}>{lesson.title}</h1>
                            <button className="btn btn-primary" onClick={nextStep} style={{ fontSize: '1.5rem', padding: '1rem 2rem', borderRadius: '50px' }}>Start Cooking! 👨‍🍳</button>
                        </motion.div>
                    )}

                    {currentStepData.visual === 'pizza' && (
                        <motion.div
                            key="pizza"
                            style={{ width: '400px', height: '400px', position: 'relative' }}
                        >
                            {/* Pizza Pan */}
                            <div style={{ position: 'absolute', inset: -20, background: '#a8a29e', borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />

                            {/* Slices */}
                            <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '50%', overflow: 'hidden', background: '#9ca3af' }}>
                                {slices.map((exists, i) => (
                                    <AnimatePresence key={i}>
                                        {exists && (
                                            <PizzaSlice index={i} onClick={() => handleSliceClick(i)} />
                                        )}
                                    </AnimatePresence>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStepData.visual === 'celebration' && (
                        <motion.div
                            key="celebration"
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '30px' }}
                        >
                            <h1 style={{ fontSize: '3rem', color: '#16a34a' }}>Delicious!</h1>
                            <p style={{ fontSize: '1.5rem', color: '#4b5563' }}>You found 1/2.</p>
                            <button className="btn btn-primary" onClick={resetLesson} style={{ marginTop: '2rem' }}>Play Again</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const PizzaSlice = ({ index, onClick }) => {
    // CSS Magic for wedges
    const rotation = index * 90;

    return (
        <motion.div
            onClick={onClick}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                position: 'absolute',
                top: '0', left: '0', width: '100%', height: '100%',
                clipPath: 'polygon(50% 50%, 100% 0, 100% 50%, 50% 100%, 0 50%, 0 0)', // Wait, simple quadrant clip path is easier
                // Actually, placing 4 divs rotated is easier
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '50% 50%'
            }}
        >
            <div style={{
                position: 'absolute', top: 0, right: 0, width: '50%', height: '50%',
                background: '#fcd34d', // Cheese
                border: '4px solid #b45309', // Crust edge simulation
                borderBottom: 'none', borderLeft: 'none',
                borderRadius: '0 100% 0 0', // Top right quadrant
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {/* Pepperoni */}
                <img src={AssetImages.pepperoni} style={{ width: '30px', position: 'absolute', top: '30%', right: '30%' }} />
                <img src={AssetImages.pepperoni} style={{ width: '20px', position: 'absolute', top: '60%', right: '15%' }} />
            </div>
        </motion.div>
    );
};

export default PizzaPartyLesson;
