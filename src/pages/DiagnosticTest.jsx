import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../services/store';
import { supabase } from '../services/supabase';
import curriculumData from '../data/curriculum.json';

const DiagnosticTest = () => {
    const navigate = useNavigate();
    const { state: { session, profile } } = useStore();
    const [step, setStep] = useState('intro'); // intro, testing, results
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [gradeLevel, setGradeLevel] = useState(null);

    useEffect(() => {
        if (step === 'intro' && !gradeLevel && profile) {
            // Default to grade level from profile or ask
            setGradeLevel(profile.grade_level || 1);
        }
    }, [profile, step, gradeLevel]);

    const generateDiagnosticQuestions = (grade) => {
        // Get a mix of questions from the selected grade and surrounding grades
        const targetGrades = [Math.max(0, grade - 1), grade, Math.min(6, grade + 1)];
        const allQuestions = [];

        targetGrades.forEach(g => {
            const gradeCurriculum = curriculumData.filter(c => c.grade_level === g);
            gradeCurriculum.forEach(set => {
                // Take 2-3 questions from each curriculum set
                const sampleQuestions = set.questions.slice(0, 3).map(q => ({
                    ...q,
                    curriculum_id: set.id,
                    topic: set.topic,
                    grade: g,
                    difficulty: set.difficulty
                }));
                allQuestions.push(...sampleQuestions);
            });
        });

        // Shuffle and take 20 questions
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 20);
    };

    const startTest = () => {
        const diagnosticQuestions = generateDiagnosticQuestions(gradeLevel);
        setQuestions(diagnosticQuestions);
        setStep('testing');
    };

    const handleAnswer = (selectedAnswer) => {
        const question = questions[currentQuestion];
        const isCorrect = selectedAnswer === question.answer;

        setAnswers([...answers, {
            question: question.question,
            selected: selectedAnswer,
            correct: question.answer,
            isCorrect,
            topic: question.topic,
            grade: question.grade
        }]);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResults();
        }
    };

    const calculateResults = async () => {
        setStep('results');

        // Calculate mastery by topic
        const topicScores = {};
        answers.forEach(a => {
            if (!topicScores[a.topic]) {
                topicScores[a.topic] = { correct: 0, total: 0 };
            }
            topicScores[a.topic].total++;
            if (a.isCorrect) topicScores[a.topic].correct++;
        });

        const masteryLevels = {};
        Object.keys(topicScores).forEach(topic => {
            const score = topicScores[topic];
            masteryLevels[topic] = Math.round((score.correct / score.total) * 100);
        });

        // Save to database
        if (session) {
            try {
                const { data: existingStats } = await supabase
                    .from('student_stats')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                await supabase
                    .from('student_stats')
                    .upsert({
                        id: session.user.id,
                        mastery_levels: masteryLevels,
                        diagnostic_completed: true,
                        diagnostic_date: new Date().toISOString(),
                        ...existingStats
                    });
            } catch (error) {
                console.error('Error saving diagnostic results:', error);
            }
        }
    };

    const totalCorrect = answers.filter(a => a.isCorrect).length;
    const percentage = answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0;

    if (step === 'intro') {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--color-bg)',
                padding: '2rem'
            }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="card"
                        style={{ textAlign: 'center' }}
                    >
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                            📊 Placement Test
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Let's find your perfect starting point! This quick 20-question test will help us understand your current math skills.
                        </p>

                        <div style={{
                            background: 'var(--color-bg)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem',
                            textAlign: 'left'
                        }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>What to expect:</h3>
                            <ul style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                                <li>✓ 20 questions covering various math topics</li>
                                <li>✓ Takes about 15-20 minutes</li>
                                <li>✓ Questions adapt to your grade level</li>
                                <li>✓ No pressure - this helps us help you!</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Select your grade level:
                            </label>
                            <select
                                className="input"
                                value={gradeLevel || ''}
                                onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                                style={{ maxWidth: '200px', margin: '0 auto' }}
                            >
                                <option value="0">Kindergarten</option>
                                <option value="1">1st Grade</option>
                                <option value="2">2nd Grade</option>
                                <option value="3">3rd Grade</option>
                                <option value="4">4th Grade</option>
                                <option value="5">5th Grade</option>
                                <option value="6">6th Grade</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className="btn"
                                onClick={() => navigate('/dashboard')}
                            >
                                Skip for Now
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={startTest}
                                disabled={!gradeLevel}
                            >
                                Start Test 🚀
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (step === 'testing') {
        const question = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;

        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--color-bg)',
                padding: '2rem'
            }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div style={{
                            height: '10px',
                            background: 'var(--color-bg-card)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            border: '2px solid var(--color-text)'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                style={{
                                    height: '100%',
                                    background: 'var(--color-primary)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="card"
                        >
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-muted)',
                                marginBottom: '1rem'
                            }}>
                                {question.topic} • Grade {question.grade === 0 ? 'K' : question.grade}
                            </div>

                            <h2 style={{
                                fontSize: '1.5rem',
                                marginBottom: '2rem',
                                color: 'var(--color-text)'
                            }}>
                                {question.question}
                            </h2>

                            <div style={{
                                display: 'grid',
                                gap: '1rem'
                            }}>
                                {question.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(option)}
                                        className="btn"
                                        style={{
                                            padding: '1.5rem',
                                            fontSize: '1.1rem',
                                            textAlign: 'left',
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <span style={{
                                            marginRight: '1rem',
                                            fontWeight: 'bold',
                                            color: 'var(--color-primary)'
                                        }}>
                                            {String.fromCharCode(65 + idx)}.
                                        </span>
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    if (step === 'results') {
        // Calculate topic breakdown
        const topicBreakdown = {};
        answers.forEach(a => {
            if (!topicBreakdown[a.topic]) {
                topicBreakdown[a.topic] = { correct: 0, total: 0 };
            }
            topicBreakdown[a.topic].total++;
            if (a.isCorrect) topicBreakdown[a.topic].correct++;
        });

        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--color-bg)',
                padding: '2rem'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="card"
                        style={{ textAlign: 'center', marginBottom: '2rem' }}
                    >
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                            🎉 Test Complete!
                        </h1>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            color: percentage >= 70 ? 'var(--color-secondary)' : 'var(--color-primary)',
                            marginBottom: '1rem'
                        }}>
                            {percentage}%
                        </div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                            You got {totalCorrect} out of {answers.length} questions correct!
                        </p>
                    </motion.div>

                    {/* Topic Breakdown */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                            Your Strengths & Areas to Improve
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.entries(topicBreakdown).map(([topic, scores]) => {
                                const topicPercent = Math.round((scores.correct / scores.total) * 100);
                                return (
                                    <div key={topic}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <span style={{ fontWeight: 'bold' }}>{topic}</span>
                                            <span>{topicPercent}% ({scores.correct}/{scores.total})</span>
                                        </div>
                                        <div style={{
                                            height: '8px',
                                            background: 'var(--color-bg)',
                                            borderRadius: '999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${topicPercent}%`,
                                                height: '100%',
                                                background: topicPercent >= 70 ? 'var(--color-secondary)' : 'var(--color-primary)'
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/dashboard')}
                            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default DiagnosticTest;
