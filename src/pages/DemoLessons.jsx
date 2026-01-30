import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurriculum } from '../services/curriculumService';


const DemoLessons = () => {
    const navigate = useNavigate();
    const [selectedSet, setSelectedSet] = useState(null);
    const [curriculumData, setCurriculumData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load curriculum from Supabase (with JSON fallback)
    useEffect(() => {
        getCurriculum()
            .then(data => {
                setCurriculumData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load curriculum:', err);
                setLoading(false);
            });
    }, []);

    // Get a sample of curriculum sets from different grades
    const demoSets = curriculumData.length > 0 ? [
        curriculumData.find(c => c.id === 'k-counting-1-20'),
        curriculumData.find(c => c.grade_level === 1 && c.topic === 'Addition'),
        curriculumData.find(c => c.grade_level === 2 && c.topic === 'Subtraction'),
        curriculumData.find(c => c.grade_level === 3 && c.topic === 'Multiplication'),
        curriculumData.find(c => c.grade_level === 4 && c.topic === 'Division'),
        curriculumData.find(c => c.grade_level === 5 && c.topic === 'Fractions')
    ].filter(Boolean) : [];

    const getGradeLabel = (level) => {
        if (level === 0) return 'Kindergarten';
        return `Grade ${level}`;
    };

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧮</div>
                        <div>Loading curriculum...</div>
                    </div>
                </div>
            ) : (
                <>
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
                                Sample Curriculum Sets 📚
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
                                Preview our curriculum library with sample questions from each grade level. No sign-up required!
                            </motion.p>
                        </div>
                    </div>

                    <div className="container" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {!selectedSet ? (
                            <>
                                {/* Curriculum Sets Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '2rem',
                                    marginBottom: '3rem'
                                }}>
                                    {demoSets.map((set, idx) => (
                                        <motion.div
                                            key={set.id}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -8 }}
                                            onClick={() => setSelectedSet(set)}
                                            className="card"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
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
                                                    {getGradeLabel(set.grade_level)}
                                                </span>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: 'var(--color-secondary)',
                                                    color: 'white',
                                                    borderRadius: '999px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {set.topic}
                                                </span>
                                            </div>

                                            <h3 style={{
                                                fontSize: '1.5rem',
                                                marginBottom: '0.5rem',
                                                color: 'var(--color-text)'
                                            }}>
                                                {set.title}
                                            </h3>

                                            <p style={{
                                                color: 'var(--color-text-muted)',
                                                marginBottom: '1rem'
                                            }}>
                                                {set.description}
                                            </p>

                                            <div style={{
                                                fontSize: '0.9rem',
                                                color: 'var(--color-text-muted)',
                                                marginBottom: '1rem'
                                            }}>
                                                📝 {set.questions.length} questions • {set.difficulty}
                                            </div>

                                            <button
                                                className="btn btn-primary"
                                                style={{ width: '100%' }}
                                            >
                                                Preview Questions →
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Info Box */}
                                <div style={{
                                    background: 'var(--color-bg-card)',
                                    padding: '2rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '3px solid var(--color-text)',
                                    boxShadow: '6px 6px 0 var(--color-text)',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                                        📚 Full Library Access
                                    </h3>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                                        These are just 6 examples from our library of <strong>900+ curriculum sets</strong> covering K-9th grade math!
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate('/auth')}
                                        style={{ fontSize: '1.1rem', padding: '0.8rem 1.5rem' }}
                                    >
                                        Sign Up for Full Access ✨
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Question Preview */}
                                <button
                                    className="btn"
                                    onClick={() => setSelectedSet(null)}
                                    style={{ marginBottom: '2rem' }}
                                >
                                    ← Back to Curriculum Sets
                                </button>

                                <div className="card" style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            borderRadius: '999px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}>
                                            {getGradeLabel(selectedSet.grade_level)}
                                        </span>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'var(--color-secondary)',
                                            color: 'white',
                                            borderRadius: '999px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}>
                                            {selectedSet.topic}
                                        </span>
                                    </div>

                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                                        {selectedSet.title}
                                    </h2>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                        {selectedSet.description}
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        Showing {Math.min(5, selectedSet.questions.length)} of {selectedSet.questions.length} questions
                                    </p>
                                </div>

                                {/* Sample Questions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {selectedSet.questions.slice(0, 5).map((q, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="card"
                                        >
                                            <div style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                marginBottom: '1rem',
                                                color: 'var(--color-primary)'
                                            }}>
                                                Question {idx + 1}
                                            </div>

                                            <div style={{
                                                fontSize: '1.1rem',
                                                marginBottom: '1rem',
                                                color: 'var(--color-text)'
                                            }}>
                                                {q.question}
                                            </div>

                                            {q.image && (
                                                <div style={{
                                                    marginBottom: '1rem',
                                                    padding: '1rem',
                                                    background: 'var(--color-bg)',
                                                    borderRadius: 'var(--radius-md)',
                                                    textAlign: 'center',
                                                    color: 'var(--color-text-muted)'
                                                }}>
                                                    🖼️ Image: {q.image.split('/').pop()}
                                                </div>
                                            )}

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                                                {q.options.map((option, optIdx) => (
                                                    <div
                                                        key={optIdx}
                                                        style={{
                                                            padding: '0.75rem',
                                                            background: option === q.answer ? 'var(--color-secondary)' : 'var(--color-bg)',
                                                            color: option === q.answer ? 'white' : 'var(--color-text)',
                                                            borderRadius: 'var(--radius-md)',
                                                            border: '2px solid var(--color-text)',
                                                            textAlign: 'center',
                                                            fontWeight: option === q.answer ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        {option}
                                                        {option === q.answer && ' ✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div style={{
                                    marginTop: '3rem',
                                    background: 'var(--color-primary)',
                                    padding: '2rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '3px solid var(--color-text)',
                                    boxShadow: '6px 6px 0 var(--color-text)',
                                    textAlign: 'center',
                                    color: 'white'
                                }}>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                                        Want to assign this to your students? 📚
                                    </h3>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                                        Sign up to create classes, assign curriculum, and track progress!
                                    </p>
                                    <button
                                        className="btn"
                                        onClick={() => navigate('/auth')}
                                        style={{
                                            background: 'white',
                                            color: 'var(--color-primary)',
                                            fontSize: '1.1rem',
                                            padding: '0.8rem 1.5rem'
                                        }}
                                    >
                                        Get Started Free ✨
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DemoLessons;
