import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateCurriculumSet, batchGenerateCurriculum } from '../services/curriculumGenerator';

/**
 * Admin tool for generating new curriculum using AI
 */
const CurriculumGenerator = () => {
    const [generating, setGenerating] = useState(false);
    const [generatedSets, setGeneratedSets] = useState([]);
    const [error, setError] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gradeLevel, setGradeLevel] = useState(1);
    const [topic, setTopic] = useState('Addition');
    const [difficulty, setDifficulty] = useState('easy');
    const [questionCount, setQuestionCount] = useState(10);

    const topics = [
        'Addition', 'Subtraction', 'Multiplication', 'Division',
        'Fractions', 'Decimals', 'Geometry', 'Measurement',
        'Time', 'Money', 'Data & Graphing', 'Word Problems',
        'Place Value', 'Patterns', 'Algebra Basics'
    ];

    const handleGenerate = async () => {
        setGenerating(true);
        setError(null);

        try {
            const newSet = await generateCurriculumSet(
                title,
                description,
                gradeLevel,
                topic,
                difficulty,
                questionCount
            );

            setGeneratedSets([newSet, ...generatedSets]);

            // Reset form
            setTitle('');
            setDescription('');
        } catch (err) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleBatchGenerate = async () => {
        setGenerating(true);
        setError(null);

        // Generate 10 sets across different topics and grades
        const configs = [
            { topic: 'Addition', gradeLevel: 1, difficulty: 'easy', questionCount: 10, title: 'Addition Facts 1-10' },
            { topic: 'Subtraction', gradeLevel: 1, difficulty: 'easy', questionCount: 10, title: 'Subtraction Facts 1-10' },
            { topic: 'Multiplication', gradeLevel: 2, difficulty: 'easy', questionCount: 10, title: 'Multiplication Tables 2-5' },
            { topic: 'Division', gradeLevel: 2, difficulty: 'medium', questionCount: 10, title: 'Division Basics' },
            { topic: 'Fractions', gradeLevel: 3, difficulty: 'easy', questionCount: 10, title: 'Introduction to Fractions' },
            { topic: 'Decimals', gradeLevel: 4, difficulty: 'medium', questionCount: 10, title: 'Decimal Place Value' },
            { topic: 'Geometry', gradeLevel: 3, difficulty: 'easy', questionCount: 10, title: 'Angles and Shapes' },
            { topic: 'Measurement', gradeLevel: 2, difficulty: 'easy', questionCount: 10, title: 'Length and Distance' },
            { topic: 'Time', gradeLevel: 1, difficulty: 'easy', questionCount: 10, title: 'Telling Time' },
            { topic: 'Money', gradeLevel: 2, difficulty: 'easy', questionCount: 10, title: 'Counting Coins' }
        ];

        try {
            const newSets = await batchGenerateCurriculum(configs);
            setGeneratedSets([...newSets, ...generatedSets]);
        } catch (err) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const downloadAsJSON = () => {
        const dataStr = JSON.stringify(generatedSets, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `generated-curriculum-${Date.now()}.json`;
        link.click();
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>
                🤖 AI Curriculum Generator
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Single Generation */}
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem' }}>Generate Single Set</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Title
                            </label>
                            <input
                                className="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Addition Facts 1-20"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Description
                            </label>
                            <textarea
                                className="input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Grade Level
                            </label>
                            <select
                                className="input"
                                value={gradeLevel}
                                onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                            >
                                <option value="0">Kindergarten</option>
                                {[1, 2, 3, 4, 5, 6].map(g => (
                                    <option key={g} value={g}>Grade {g}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Topic
                            </label>
                            <select
                                className="input"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            >
                                {topics.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Difficulty
                            </label>
                            <select
                                className="input"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Number of Questions
                            </label>
                            <input
                                className="input"
                                type="number"
                                min="5"
                                max="20"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleGenerate}
                            disabled={generating || !title}
                            style={{ marginTop: '1rem' }}
                        >
                            {generating ? 'Generating...' : 'Generate Set'}
                        </button>
                    </div>
                </div>

                {/* Batch Generation */}
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem' }}>Batch Generate</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Generate 10 curriculum sets across different topics and grade levels automatically.
                    </p>

                    <div style={{
                        background: 'var(--color-bg)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem'
                    }}>
                        <strong>Will generate:</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
                            <li>Addition (Grade 1)</li>
                            <li>Subtraction (Grade 1)</li>
                            <li>Multiplication (Grade 2)</li>
                            <li>Division (Grade 2)</li>
                            <li>Fractions (Grade 3)</li>
                            <li>Decimals (Grade 4)</li>
                            <li>Geometry (Grade 3)</li>
                            <li>Measurement (Grade 2)</li>
                            <li>Time (Grade 1)</li>
                            <li>Money (Grade 2)</li>
                        </ul>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleBatchGenerate}
                        disabled={generating}
                    >
                        {generating ? 'Generating...' : 'Generate 10 Sets'}
                    </button>

                    <p style={{
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        ⏱️ This will take about 20-30 seconds
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="card" style={{ background: '#ef4444', color: 'white', marginBottom: '2rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Generated Sets */}
            {generatedSets.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Generated Sets ({generatedSets.length})</h2>
                        <button className="btn btn-secondary" onClick={downloadAsJSON}>
                            📥 Download JSON
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {generatedSets.map((set, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                style={{
                                    padding: '1rem',
                                    background: 'var(--color-bg)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--color-text)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{set.title}</strong>
                                    <span style={{ color: 'var(--color-text-muted)' }}>
                                        Grade {set.grade_level === 0 ? 'K' : set.grade_level}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    {set.topic} • {set.difficulty} • {set.questions.length} questions
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurriculumGenerator;
