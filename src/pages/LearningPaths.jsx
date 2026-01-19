import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import learningPaths from '../data/learning_paths.json';

const LearningPaths = () => {
    const navigate = useNavigate();
    const [selectedGrade, setSelectedGrade] = useState(0);

    // Group paths by grade
    const pathsByGrade = learningPaths.reduce((acc, path) => {
        const grade = path.grade_level;
        if (!acc[grade]) acc[grade] = [];
        acc[grade].push(path);
        return acc;
    }, {});

    const grades = Object.keys(pathsByGrade).sort((a, b) => a - b);
    const currentPaths = pathsByGrade[selectedGrade] || [];

    const getGradeName = (grade) => {
        return grade === 0 ? 'Kindergarten' : `Grade ${grade}`;
    };

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '2rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '3rem', textAlign: 'center' }}
                >
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
                        🎯 Learning Paths
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                        Complete guided learning journeys with 25-30 minutes of practice
                    </p>
                </motion.div>

                {/* Grade Selector */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {grades.map((grade) => (
                        <button
                            key={grade}
                            onClick={() => setSelectedGrade(parseInt(grade))}
                            className="btn"
                            style={{
                                background: selectedGrade === parseInt(grade)
                                    ? 'var(--color-primary)'
                                    : 'var(--color-bg)',
                                color: selectedGrade === parseInt(grade)
                                    ? 'white'
                                    : 'var(--color-text)',
                                border: '2px solid var(--color-primary)',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem'
                            }}
                        >
                            {getGradeName(parseInt(grade))}
                        </button>
                    ))}
                </div>

                {/* Learning Paths Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '2rem'
                }}>
                    {currentPaths.map((path, index) => (
                        <motion.div
                            key={path.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card"
                            style={{
                                padding: '2rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                ':hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }
                            }}
                            onClick={() => navigate(`/practice?path=${path.id}`)}
                        >
                            {/* Path Header */}
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-primary)'
                                }}>
                                    {path.title}
                                </h3>
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    {path.description}
                                </p>
                            </div>

                            {/* Path Stats */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                color: 'var(--color-text-muted)'
                            }}>
                                <div>
                                    <strong>{path.modules.length}</strong> modules
                                </div>
                                <div>•</div>
                                <div>
                                    <strong>~{path.estimated_time}</strong> min
                                </div>
                                <div>•</div>
                                <div>
                                    <strong>{path.total_questions}</strong> questions
                                </div>
                            </div>

                            {/* Modules List */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    Modules:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {path.modules.slice(0, 3).map((moduleId, i) => (
                                        <div key={i} style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--color-text-muted)',
                                            paddingLeft: '1rem'
                                        }}>
                                            {i === 0 ? '○' : i === 1 ? '○' : '○'} {moduleId.replace(/-/g, ' ')}
                                        </div>
                                    ))}
                                    {path.modules.length > 3 && (
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--color-text-muted)',
                                            paddingLeft: '1rem'
                                        }}>
                                            + {path.modules.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Start Button */}
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '0.75rem' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/practice?path=${path.id}`);
                                }}
                            >
                                Start Learning Path →
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {currentPaths.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>No paths available</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Learning paths for this grade are coming soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPaths;
