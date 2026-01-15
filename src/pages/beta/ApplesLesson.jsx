import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ProfessorHoot, OrchardBackground, AssetImages } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';

const ApplesLesson = () => {
    console.log("InteractiveLesson loaded");
    const [currentStep, setCurrentStep] = useState(0);
    const [count, setCount] = useState(0);
    const [clickedItems, setClickedItems] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Initial Ambience
    useEffect(() => {
        // Start ambience on first user interaction or mount if allowed
        const handleStart = () => audioManager.startAmbience();
        window.addEventListener('click', handleStart, { once: true });
        return () => {
            audioManager.cleanup();
            window.removeEventListener('click', handleStart);
        };
    }, []);

    const lesson = {
        title: "Apple Picking Adventure! 🍎",
        steps: [
            {
                type: 'intro',
                narration: "Hoot hoot! I'm Professor Hoot. Welcome to the Math Orchard! Today we're going to pick some delicious apples.",
                instruction: "Click 'Start' to begin!",
                visual: 'welcome'
            },
            {
                type: 'interactive',
                narration: "Look at all these red apples! Can you help me pick 5 of them? Click on each apple to count it.",
                visual: 'apples',
                targetCount: 5,
                instruction: "Tap the apples to count!"
            },
            {
                type: 'practice',
                narration: "Excellent work! Now, can you find 7 golden stars hiding in the sky?",
                visual: 'stars',
                targetCount: 7,
                instruction: "Tap the stars to count!"
            },
            {
                type: 'celebration',
                narration: "You did it! You're a natural math wizard. Hoot hoot!",
                visual: 'celebration'
            }
        ]
    };

    const currentStepData = lesson.steps[currentStep];

    useEffect(() => {
        if (currentStepData?.narration) {
            setIsSpeaking(true);
            // Small delay to allow transition to finish
            const timer = setTimeout(() => {
                audioManager.speak(currentStepData.narration);
                // Rough estimate for "speaking" animation - in real app use onend callback
                setTimeout(() => setIsSpeaking(false), 3000);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleItemClick = (index) => {
        if (!clickedItems.includes(index)) {
            // physics bounce effect handled by framer-motion in component
            audioManager.playSfx('pop');

            const newCount = count + 1;
            setClickedItems([...clickedItems, index]);
            setCount(newCount);

            // Speak just the number clearly
            audioManager.speak(newCount.toString());

            if (newCount === currentStepData.targetCount) {
                audioManager.playSfx('success');
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
                setTimeout(() => {
                    audioManager.speak("Perfect! That's all of them!");
                    nextStepDelay();
                }, 1500);
            }
        }
    };

    const nextStepDelay = () => {
        setTimeout(() => {
            if (currentStep < lesson.steps.length - 1) {
                setCurrentStep(curr => curr + 1);
                setCount(0);
                setClickedItems([]);
            }
        }, 2000);
    };

    const nextStep = () => {
        if (currentStep < lesson.steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setCount(0);
            setClickedItems([]);
        }
    };

    const resetLesson = () => {
        setCurrentStep(0);
        setCount(0);
        setClickedItems([]);
        setShowCelebration(false);
    };

    return (
        <div style={{
            width: '100vw',
            height: 'calc(100vh - 64px)', // Adjust for navbar 
            position: 'relative',
            overflow: 'hidden',
            background: '#f0f9ff'
        }}>
            <OrchardBackground />

            {/* Main Interactive Area */}
            <div className="container" style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                {/* Professor Hoot (Left Side or Top) */}
                <motion.div
                    style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 20 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                >
                    <div style={{ position: 'relative' }}>
                        {/* Speech Bubble */}
                        <AnimatePresence>
                            {(isSpeaking || currentStepData.instruction) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'white',
                                        padding: '1rem',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        width: '250px',
                                        marginBottom: '1rem',
                                        textAlign: 'center',
                                        border: '2px solid #5b21b6'
                                    }}
                                >
                                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#4c1d95' }}>
                                        {currentStepData.instruction || "Listen closely..."}
                                    </p>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        borderLeft: '10px solid transparent',
                                        borderRight: '10px solid transparent',
                                        borderTop: '10px solid #5b21b6'
                                    }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <ProfessorHoot speaking={isSpeaking} state={count > 0 ? 'happy' : 'neutral'} />
                    </div>
                </motion.div>

                {/* Central content */}
                <AnimatePresence mode='wait'>
                    {currentStepData.visual === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            style={{ textAlign: 'center' }}
                        >
                            <h1 style={{
                                fontSize: '4rem',
                                color: '#1e3a8a',
                                textShadow: '2px 2px 0px white',
                                marginBottom: '2rem'
                            }}>
                                {lesson.title}
                            </h1>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary"
                                onClick={nextStep}
                                style={{
                                    fontSize: '2rem',
                                    padding: '1rem 3rem',
                                    borderRadius: '50px',
                                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)'
                                }}
                            >
                                Start Adventure! ▶
                            </motion.button>
                        </motion.div>
                    )}

                    {currentStepData.visual === 'apples' && (
                        <motion.div
                            key="apples"
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                height: '400px',
                                position: 'relative',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '30px',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            {/* Score visual at top */}
                            <div style={{ position: 'absolute', top: -20, right: 20, background: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                                🍎 {count} / {currentStepData.targetCount}
                            </div>

                            {/* Apple Tree placement simulation */}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Apple
                                    key={i}
                                    i={i}
                                    onClick={() => handleItemClick(i)}
                                    isClicked={clickedItems.includes(i)}
                                />
                            ))}
                        </motion.div>
                    )}

                    {currentStepData.visual === 'stars' && (
                        <motion.div
                            key="stars"
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                height: '400px',
                                position: 'relative'
                            }}
                        >
                            <div style={{ position: 'absolute', top: -20, right: 20, background: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: '1.5rem', fontWeight: 'bold', color: '#ca8a04' }}>
                                ⭐ {count} / {currentStepData.targetCount}
                            </div>

                            {Array.from({ length: 7 }).map((_, i) => (
                                <Star
                                    key={i}
                                    i={i}
                                    onClick={() => handleItemClick(i)}
                                    isClicked={clickedItems.includes(i)}
                                />
                            ))}
                        </motion.div>
                    )}

                    {currentStepData.visual === 'celebration' && (
                        <motion.div
                            key="celebration"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                        >
                            <h1 style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '1rem' }}>🎉 Amazing Job! 🎉</h1>
                            <p style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '2rem' }}>You completed the Counting Orchard!</p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary"
                                onClick={resetLesson}
                                style={{ fontSize: '1.5rem', padding: '1rem 2rem', borderRadius: '50px' }}
                            >
                                Play Again ↺
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress dots at bottom */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 20 }}>
                {lesson.steps.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: i === currentStep ? '#db2777' : 'rgba(0,0,0,0.2)',
                            transition: 'all 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Sub-components (using Real Images) ---

const Apple = ({ i, onClick, isClicked }) => {
    // Random positions
    const positions = [
        { top: '20%', left: '20%' }, { top: '50%', left: '50%' }, { top: '30%', left: '70%' },
        { top: '60%', left: '30%' }, { top: '70%', left: '80%' }
    ];

    return (
        <motion.div
            style={{
                position: 'absolute', ...positions[i], cursor: 'pointer',
                width: '80px', height: '80px',
                userSelect: 'none'
            }}
            initial={{ scale: 0 }}
            animate={isClicked ? { scale: 1.2, y: 50, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.8 }}
            onClick={onClick}
        >
            <img
                src={AssetImages.apple}
                alt="Apple"
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))' }}
            />
        </motion.div>
    );
};

const Star = ({ i, onClick, isClicked }) => {
    // Random positions scattered high up
    const positions = [
        { top: '10%', left: '15%' }, { top: '20%', left: '45%' }, { top: '15%', left: '80%' },
        { top: '40%', left: '10%' }, { top: '35%', left: '60%' }, { top: '50%', left: '90%' },
        { top: '5%', left: '30%' }
    ];

    return (
        <motion.div
            style={{
                position: 'absolute', ...positions[i], cursor: 'pointer',
                width: '70px', height: '70px',
                userSelect: 'none'
            }}
            initial={{ scale: 0 }}
            animate={isClicked ? { scale: 1.5, rotate: 360, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
            whileHover={{ scale: 1.3, filter: 'brightness(1.2)' }}
            whileTap={{ scale: 0.8 }}
            onClick={onClick}
        >
            <img
                src={AssetImages.star}
                alt="Star"
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 10px gold)' }}
            />
        </motion.div>
    );
}

export default ApplesLesson;
