import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorAbacus, WorkshopBackground } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';

const MeasurementLesson = () => {
    const { awardXP } = useGamification();
    const [step, setStep] = useState(0);
    const [rulerX, setRulerX] = useState(0);

    const lesson = {
        title: "Carpenter's Workshop 🔨",
        items: [
            { id: 1, name: 'Short Plank', length: 5, width: 200 },
            { id: 2, name: 'Long Beam', length: 8, width: 320 },
            { id: 3, name: 'Medium Board', length: 6, width: 240 }
        ]
    };

    const currentItem = lesson.items[step];

    useEffect(() => {
        if (step < lesson.items.length) {
            audioManager.speak(`Please measure the ${currentItem.name}. How many units long is it?`);
        } else {
            audioManager.speak("Excellent work! You are a master builder!");
            awardXP(40);
        }
    }, [step]);

    const checkMeasurement = (guess) => {
        if (guess === currentItem.length) {
            audioManager.playSfx('success');
            audioManager.speak("Correct! Good measuring.");
            setStep(s => s + 1);
        } else {
            audioManager.speak("Hmm, try measuring again.");
        }
    };

    if (step >= lesson.items.length) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', background: '#fef3c7', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#d97706' }}>Workshop Complete! 🏆</h1>
                <ProfessorAbacus state="happy" />
                <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>Build Again</button>
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
            <WorkshopBackground />

            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem' }}>

                <h1 style={{ background: 'white', padding: '1rem 2rem', borderRadius: '15px', color: '#d97706', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    Measure the {currentItem.name}
                </h1>

                {/* The Object to Measure */}
                <div style={{
                    marginTop: '4rem',
                    width: `${currentItem.width}px`,
                    height: '60px',
                    background: 'url(https://img.freepik.com/free-photo/brown-wooden-textured-flooring-background_53876-128532.jpg)',
                    backgroundSize: 'cover',
                    borderRadius: '4px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '2px', height: '80px', background: 'red' }} />
                    <div style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', width: '2px', height: '80px', background: 'red' }} />
                </div>

                {/* Draggable Ruler */}
                <motion.div
                    drag="x"
                    dragMomentum={false}
                    style={{
                        marginTop: '2rem',
                        width: '400px',
                        height: '60px',
                        background: '#facc15',
                        border: '2px solid #ca8a04',
                        borderRadius: '8px',
                        display: 'flex',
                        position: 'relative',
                        cursor: 'grab',
                        x: rulerX
                    }}
                    onDragEnd={(e, info) => setRulerX(info.offset.x)}
                >
                    {[...Array(11)].map((_, i) => (
                        <div key={i} style={{ flex: 1, borderRight: '1px solid #a16207', height: '100%', position: 'relative' }}>
                            <span style={{ position: 'absolute', bottom: '2px', right: '-5px', fontSize: '0.8rem', fontWeight: 'bold' }}>{i + 1}</span>
                        </div>
                    ))}
                    <div style={{ position: 'absolute', top: '-25px', left: '0', background: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        Unit Ruler
                    </div>
                </motion.div>

                {/* Number Pad for Answer */}
                <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem' }}>
                    {[4, 5, 6, 8, 10].map(num => (
                        <button
                            key={num}
                            className="btn"
                            onClick={() => checkMeasurement(num)}
                            style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.5rem', border: '2px solid white' }}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <motion.div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                    <ProfessorAbacus />
                </motion.div>

            </div>
        </div>
    );
};

export default MeasurementLesson;
