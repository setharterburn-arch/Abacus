import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../services/store';
import { supabase } from '../../services/supabase';

const MasteryWidget = () => {
    const navigate = useNavigate();
    const { state: { session } } = useStore();
    const [masteryData, setMasteryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMasteryData = async () => {
            if (!session) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('student_stats')
                    .select('mastery_levels, diagnostic_completed, diagnostic_date')
                    .eq('id', session.user.id)
                    .single();

                if (error) throw error;
                setMasteryData(data);
            } catch (error) {
                console.error('Error fetching mastery data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMasteryData();
    }, [session]);

    if (loading) {
        return (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
            </div>
        );
    }

    if (!masteryData?.diagnostic_completed) {
        return (
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    📊 Take Your Placement Test
                </h3>
                <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
                    Discover your strengths and get a personalized learning path!
                </p>
                <button
                    className="btn"
                    onClick={() => navigate('/diagnostic')}
                    style={{
                        background: 'white',
                        color: 'var(--color-primary)',
                        border: 'none'
                    }}
                >
                    Start Test (15 min) →
                </button>
            </motion.div>
        );
    }

    const masteryLevels = masteryData.mastery_levels || {};
    const topics = Object.keys(masteryLevels);
    const averageMastery = topics.length > 0
        ? Math.round(topics.reduce((sum, topic) => sum + masteryLevels[topic], 0) / topics.length)
        : 0;

    const getMasteryColor = (percent) => {
        if (percent >= 80) return 'var(--color-secondary)';
        if (percent >= 60) return 'var(--color-primary)';
        return 'var(--color-accent)';
    };

    const getMasteryLabel = (percent) => {
        if (percent >= 80) return 'Mastered';
        if (percent >= 60) return 'Proficient';
        if (percent >= 40) return 'Developing';
        return 'Needs Practice';
    };

    return (
        <div className="card">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-text)' }}>
                    📈 Your Progress
                </h3>
                <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: getMasteryColor(averageMastery)
                }}>
                    {averageMastery}%
                </div>
            </div>

            {topics.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    No mastery data yet. Complete some lessons to see your progress!
                </p>
            ) : (
                <>
                    <div style={{ marginBottom: '1.5rem' }}>
                        {topics.slice(0, 5).map((topic, idx) => {
                            const percent = masteryLevels[topic];
                            return (
                                <motion.div
                                    key={topic}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ marginBottom: '1rem' }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span style={{ fontWeight: '600' }}>{topic}</span>
                                        <span style={{ color: getMasteryColor(percent) }}>
                                            {percent}% • {getMasteryLabel(percent)}
                                        </span>
                                    </div>
                                    <div style={{
                                        height: '8px',
                                        background: 'var(--color-bg)',
                                        borderRadius: '999px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--color-text)'
                                    }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                            style={{
                                                height: '100%',
                                                background: getMasteryColor(percent)
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {topics.length > 5 && (
                        <div style={{
                            textAlign: 'center',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            +{topics.length - 5} more topics
                        </div>
                    )}

                    <button
                        className="btn"
                        onClick={() => navigate('/diagnostic')}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        Retake Diagnostic Test
                    </button>
                </>
            )}
        </div>
    );
};

export default MasteryWidget;
