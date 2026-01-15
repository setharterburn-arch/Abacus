import React, { useState, useEffect } from 'react';

const InteractiveLesson = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [count, setCount] = useState(0);
    const [clickedApples, setClickedApples] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);

    const lesson = {
        title: "Let's Count to 10! 🍎",
        steps: [
            {
                type: 'intro',
                narration: "Welcome! Today we're going to learn how to count to 10. Are you ready?",
                visual: 'welcome'
            },
            {
                type: 'interactive',
                narration: "Let's start by counting apples! Click on each apple and count out loud with me.",
                visual: 'apples',
                targetCount: 5,
                instruction: "Click each apple to count!"
            },
            {
                type: 'practice',
                narration: "Great job! Now let's try counting stars. How many stars do you see?",
                visual: 'stars',
                targetCount: 7,
                instruction: "Click each star to count!"
            },
            {
                type: 'celebration',
                narration: "Wow! You're amazing at counting! You counted all the way to 10!",
                visual: 'celebration'
            }
        ]
    };

    const currentStepData = lesson.steps[currentStep];

    // Text-to-Speech function
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Auto-narrate when step changes
    useEffect(() => {
        if (currentStepData?.narration) {
            setTimeout(() => speak(currentStepData.narration), 500);
        }
    }, [currentStep]);

    const handleAppleClick = (index) => {
        if (!clickedApples.includes(index)) {
            const newCount = count + 1;
            setClickedApples([...clickedApples, index]);
            setCount(newCount);

            // Speak the number
            speak(newCount.toString());

            // Check if completed
            if (newCount === currentStepData.targetCount) {
                setTimeout(() => {
                    speak("Perfect! You counted all of them!");
                    setShowCelebration(true);
                    setTimeout(() => {
                        setShowCelebration(false);
                        nextStep();
                    }, 2000);
                }, 500);
            }
        }
    };

    const nextStep = () => {
        if (currentStep < lesson.steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setCount(0);
            setClickedApples([]);
        }
    };

    const resetLesson = () => {
        setCurrentStep(0);
        setCount(0);
        setClickedApples([]);
        setShowCelebration(false);
    };

    // Render apples
    const renderApples = () => {
        const apples = [];
        const targetCount = currentStepData.targetCount || 5;

        for (let i = 0; i < targetCount; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = 100 + col * 120;
            const y = 150 + row * 120;
            const isClicked = clickedApples.includes(i);

            apples.push(
                <g key={i} onClick={() => handleAppleClick(i)} style={{ cursor: 'pointer' }}>
                    <circle
                        cx={x}
                        cy={y}
                        r="40"
                        fill={isClicked ? '#10b981' : '#ef4444'}
                        stroke="#1e293b"
                        strokeWidth="3"
                        style={{
                            transition: 'all 0.3s ease',
                            transform: isClicked ? 'scale(1.2)' : 'scale(1)',
                            transformOrigin: `${x}px ${y}px`
                        }}
                    />
                    {isClicked && (
                        <text
                            x={x}
                            y={y + 10}
                            fontSize="40"
                            fontWeight="bold"
                            fill="white"
                            textAnchor="middle"
                        >
                            ✓
                        </text>
                    )}
                </g>
            );
        }
        return apples;
    };

    // Render stars
    const renderStars = () => {
        const stars = [];
        const targetCount = currentStepData.targetCount || 7;

        for (let i = 0; i < targetCount; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const x = 80 + col * 100;
            const y = 150 + row * 100;
            const isClicked = clickedApples.includes(i);

            stars.push(
                <g key={i} onClick={() => handleAppleClick(i)} style={{ cursor: 'pointer' }}>
                    <text
                        x={x}
                        y={y}
                        fontSize={isClicked ? "70" : "60"}
                        textAnchor="middle"
                        style={{
                            transition: 'all 0.3s ease',
                            filter: isClicked ? 'brightness(1.5)' : 'brightness(1)'
                        }}
                    >
                        {isClicked ? '⭐' : '☆'}
                    </text>
                </g>
            );
        }
        return stars;
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '900px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{lesson.title}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                    {lesson.steps.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '40px',
                                height: '8px',
                                borderRadius: '4px',
                                background: i === currentStep ? 'var(--color-primary)' : '#e2e8f0',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content Card */}
            <div className="card" style={{ padding: '2rem', minHeight: '500px', position: 'relative' }}>
                {/* Instruction */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                        {currentStepData.instruction || currentStepData.narration}
                    </h2>
                    {currentStepData.type === 'interactive' && (
                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                            Count: {count} / {currentStepData.targetCount}
                        </p>
                    )}
                </div>

                {/* Visual Content */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                    {currentStepData.visual === 'welcome' && (
                        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>👋</div>
                            <button
                                className="btn btn-primary"
                                onClick={() => nextStep()}
                                style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}
                            >
                                Let's Start! 🚀
                            </button>
                        </div>
                    )}

                    {currentStepData.visual === 'apples' && (
                        <svg width="500" height="400" style={{ animation: 'fadeIn 0.5s ease' }}>
                            {renderApples()}
                        </svg>
                    )}

                    {currentStepData.visual === 'stars' && (
                        <svg width="500" height="400" style={{ animation: 'fadeIn 0.5s ease' }}>
                            {renderStars()}
                        </svg>
                    )}

                    {currentStepData.visual === 'celebration' && (
                        <div style={{ textAlign: 'center', animation: 'bounce 0.5s ease' }}>
                            <div style={{ fontSize: '10rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>
                                You're a Counting Champion!
                            </h2>
                            <button
                                className="btn btn-primary"
                                onClick={resetLesson}
                                style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}
                            >
                                Try Again! 🔄
                            </button>
                        </div>
                    )}
                </div>

                {/* Celebration Overlay */}
                {showCelebration && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(16, 185, 129, 0.9)',
                        borderRadius: '12px',
                        animation: 'fadeIn 0.3s ease',
                        zIndex: 10
                    }}>
                        <div style={{ textAlign: 'center', color: 'white' }}>
                            <div style={{ fontSize: '8rem', animation: 'bounce 0.5s ease infinite' }}>🌟</div>
                            <h2 style={{ fontSize: '3rem', margin: 0 }}>Perfect!</h2>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    className="btn"
                    onClick={() => speak(currentStepData.narration)}
                    style={{ fontSize: '1.1rem' }}
                >
                    🔊 Repeat Instructions
                </button>
                {currentStepData.type !== 'celebration' && currentStep > 0 && (
                    <button
                        className="btn"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        style={{ fontSize: '1.1rem' }}
                    >
                        ← Back
                    </button>
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
};

export default InteractiveLesson;
