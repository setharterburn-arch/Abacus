import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorAbacus, GardenBackground } from '../../components/lesson/LessonAssets';
import { audioManager } from '../../services/audio';
import { useGamification } from '../../context/GamificationContext';

const GraphGardenLesson = () => {
    const { awardXP } = useGamification();
    const [step, setStep] = useState(0);
    // Data: { id, color, count, currentHeight }
    const [bars, setBars] = useState([
        { id: 'red', color: '#ef4444', count: 4, currentHeight: 0, label: 'Red Roses' },
        { id: 'blue', color: '#3b82f6', count: 2, currentHeight: 0, label: 'Bluebells' },
        { id: 'yellow', color: '#eab308', count: 5, currentHeight: 0, label: 'Sunflowers' }
    ]);

    useEffect(() => {
        if (step === 0) {
            audioManager.speak("Welcome to the Graph Garden! Look at all the beautiful flowers. Can you help me make a chart?");
        }
    }, [step]);

    const handleBarClick = (id) => {
        setBars(bars.map(bar => {
            if (bar.id === id) {
                // Increment height (cycling for simplicity in this demo)
                const newHeight = bar.currentHeight + 1;
                if (newHeight > 6) return { ...bar, currentHeight: 0 };

                audioManager.playSfx('pop');
                return { ...bar, currentHeight: newHeight };
            }
            return bar;
        }));
    };

    const checkGraph = () => {
        const isCorrect = bars.every(bar => bar.currentHeight === bar.count);
        if (isCorrect) {
            audioManager.playSfx('success');
            audioManager.speak("Perfect! The chart matches the flowers exactly.");
            awardXP(50);
            setStep(1); // Victory state
        } else {
            audioManager.speak("Hmm, looks like some bars are too high or too low. Count the flowers again!");
        }
    };

    if (step === 1) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', background: '#ecfccb', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#15803d' }}>Garden Growing! 🌻</h1>
                <ProfessorAbacus state="happy" />
                <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>Graph Again</button>
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
            <GardenBackground />

            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', padding: '2rem' }}>

                {/* Flower Bed (The Data Source) */}
                <div style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '15px', marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    {bars.map(bar => (
                        <div key={bar.id} style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', width: '100px', justifyContent: 'center' }}>
                                {[...Array(bar.count)].map((_, i) => (
                                    <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: bar.color, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                                ))}
                            </div>
                            <span style={{ fontWeight: 'bold', color: '#374151' }}>{bar.count} {bar.label}</span>
                        </div>
                    ))}
                </div>

                {/* The Chart (Interactive) */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3rem', paddingBottom: '100px', borderBottom: '4px solid #374151' }}>
                    {bars.map(bar => (
                        <div key={bar.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{bar.currentHeight}</div>
                            <motion.div
                                onClick={() => handleBarClick(bar.id)}
                                animate={{ height: bar.currentHeight * 50 }}
                                style={{
                                    width: '80px',
                                    background: bar.color,
                                    borderRadius: '8px 8px 0 0',
                                    cursor: 'pointer',
                                    border: '2px solid rgba(0,0,0,0.1)'
                                }}
                                whileHover={{ opacity: 0.9 }}
                            />
                            <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{bar.label}</div>
                            <button
                                onClick={() => handleBarClick(bar.id)}
                                style={{ marginTop: '0.5rem', borderRadius: '50%', width: '30px', height: '30px', border: '1px solid #ccc', cursor: 'pointer' }}
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ position: 'absolute', top: '50%', right: '2rem' }}>
                    <button className="btn btn-primary" onClick={checkGraph} style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>
                        Check Graph ✅
                    </button>
                </div>

                <motion.div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                    <ProfessorAbacus />
                </motion.div>

            </div>
        </div>
    );
};

export default GraphGardenLesson;
