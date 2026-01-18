import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DemoLessons = () => {
    const navigate = useNavigate();

    const demoLessons = [
        {
            id: 'apples',
            title: '🍎 Counting Apples',
            description: 'Learn to count with delicious apples! Perfect for beginners.',
            grade: 'K-1',
            topic: 'Counting',
            path: '/beta/apples',
            color: '#dc2626'
        },
        {
            id: 'space',
            title: '🚀 Space Race',
            description: 'Blast off into addition! Race through space while solving math problems.',
            grade: '1-2',
            topic: 'Addition',
            path: '/beta/space',
            color: '#2563eb'
        },
        {
            id: 'pizza',
            title: '🍕 Pizza Party',
            description: 'Slice and dice with fractions! Learn parts of a whole with pizza.',
            grade: '2-3',
            topic: 'Fractions',
            path: '/beta/pizza',
            color: '#f59e0b'
        },
        {
            id: 'shapes',
            title: '🦒 Shape Safari',
            description: 'Go on a safari to discover geometric shapes in the wild!',
            grade: '1-3',
            topic: 'Geometry',
            path: '/beta/shapes',
            color: '#059669'
        },
        {
            id: 'measure',
            title: '📏 Carpenter Workshop',
            description: 'Measure wood pieces and learn about units of measurement.',
            grade: '2-4',
            topic: 'Measurement',
            path: '/beta/measure',
            color: '#7c3aed'
        },
        {
            id: 'graph',
            title: '📊 Graph Garden',
            description: 'Count flowers and create beautiful bar charts!',
            grade: '1-3',
            topic: 'Data & Graphing',
            path: '/beta/graph',
            color: '#ec4899'
        }
    ];

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                padding: '3rem 2rem',
                textAlign: 'center',
                borderBottom: '3px solid var(--color-text)'
            }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            marginBottom: '1rem',
                            color: 'var(--color-text)'
                        }}
                    >
                        Try Our Interactive Lessons! 🎮
                    </motion.h1>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '1.2rem',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Experience how Abacus makes math fun and engaging. No sign-up required!
                    </motion.p>
                </div>
            </div>

            {/* Lessons Grid */}
            <div className="container" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {demoLessons.map((lesson, idx) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            onClick={() => navigate(lesson.path)}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Color accent bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '6px',
                                background: lesson.color
                            }} />

                            <div style={{ marginTop: '1rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-text)'
                                }}>
                                    {lesson.title}
                                </h3>

                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    marginBottom: '1rem',
                                    minHeight: '3rem'
                                }}>
                                    {lesson.description}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap',
                                    marginBottom: '1rem'
                                }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        borderRadius: '999px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {lesson.grade}
                                    </span>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'var(--color-secondary)',
                                        color: 'white',
                                        borderRadius: '999px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {lesson.topic}
                                    </span>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Start Lesson →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        marginTop: '4rem',
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '3px solid var(--color-text)',
                        boxShadow: '6px 6px 0 var(--color-text)'
                    }}
                >
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                        Love What You See? 🌟
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                        Sign up to unlock all 180+ curriculum sets, track progress, and more!
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/auth')}
                        style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                    >
                        Get Started Free ✨
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default DemoLessons;
