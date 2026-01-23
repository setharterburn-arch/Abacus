import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: '🎮',
            title: 'Interactive Lessons',
            description: 'Engaging, game-like lessons that make math fun and memorable.'
        },
        {
            icon: '🦁',
            title: 'AI Tutor',
            description: 'Professor Abacus provides personalized help and encouragement.'
        },
        {
            icon: '📊',
            title: 'Progress Tracking',
            description: 'Watch students grow with XP, levels, and achievement badges.'
        },
        {
            icon: '🖨️',
            title: 'Worksheet Generator',
            description: 'Create unlimited custom worksheets with QR code answer keys.'
        },
        {
            icon: '👥',
            title: 'Class Management',
            description: 'Teachers can create classes, assign work, and track student progress.'
        },
        {
            icon: '🎨',
            title: 'Beautiful Design',
            description: 'A warm, retro aesthetic that feels different from typical ed-tech.'
        }
    ];

    const forTeachers = [
        'Create and manage multiple classes',
        'Assign AI-generated or curated curriculum',
        'Generate unlimited custom worksheets',
        'Track student progress and grades',
        'Access to 900+ pre-made curriculum sets',
        'QR code answer keys for easy grading'
    ];

    const forStudents = [
        'Interactive lessons (K-9th grade)',
        'Gamification with XP and levels',
        'AI tutor for personalized help',
        'Fun themes: Space, Safari, Crystal Caves',
        'Earn coins to unlock avatar items',
        'Practice with unlimited worksheets'
    ];

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, var(--hero-start) 0%, var(--hero-end) 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
                    pointerEvents: 'none'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    >
                        <div style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 2rem',
                            borderRadius: '50%',
                            border: '4px solid var(--color-text)',
                            overflow: 'hidden',
                            boxShadow: '6px 6px 0 var(--color-primary-dark)'
                        }}>
                            <img src="/logo.jpg" alt="Professor Abacus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1rem',
                            color: 'var(--color-text)',
                            fontFamily: 'var(--font-display)'
                        }}
                    >
                        Abacus Math Homeschool
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: '1.5rem',
                            marginBottom: '2rem',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            margin: '0 auto 2rem'
                        }}
                    >
                        Learn math with Professor Abacus, the friendliest lion cub from ancient Sumeria! 🦁
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/auth')}
                            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                        >
                            Get Started Free ✨
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/demo')}
                            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                        >
                            Try Demo Lessons 🎮
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '4rem 2rem' }}>
                <div className="container">
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        marginBottom: '3rem',
                        color: 'var(--color-text)'
                    }}>
                        Why Choose Abacus? ⭐
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="card"
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Teachers & Students */}
            <section style={{ padding: '4rem 2rem', background: 'var(--color-bg-card)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        {/* For Teachers */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="card"
                            style={{ background: 'var(--bg-teacher)', borderColor: 'var(--color-primary)' }}
                        >
                            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                                👩‍🏫 For Teachers
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {forTeachers.map((item, idx) => (
                                    <li key={idx} style={{
                                        padding: '0.75rem 0',
                                        borderBottom: '1px dashed rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ color: 'var(--color-secondary)', fontSize: '1.2rem' }}>✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* For Students */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="card"
                            style={{ background: 'var(--bg-student)', borderColor: 'var(--color-secondary)' }}
                        >
                            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>
                                🎓 For Students
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {forStudents.map((item, idx) => (
                                    <li key={idx} style={{
                                        padding: '0.75rem 0',
                                        borderBottom: '1px dashed rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>★</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '4rem 2rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        marginBottom: '3rem',
                        color: 'var(--color-text)'
                    }}>
                        How It Works 🚀
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {[
                            { num: '1', title: 'Sign Up', desc: 'Create a free account as a teacher or student' },
                            { num: '2', title: 'Choose Your Path', desc: 'Teachers create classes, students join with a code' },
                            { num: '3', title: 'Start Learning', desc: 'Access interactive lessons, worksheets, and AI tutoring' },
                            { num: '4', title: 'Track Progress', desc: 'Earn XP, level up, and watch skills grow!' }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: idx % 2 === 0 ? -50 : 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    background: 'var(--color-bg-card)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '3px solid var(--color-text)',
                                    boxShadow: '4px 4px 0 var(--color-text)'
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    flexShrink: 0,
                                    border: '3px solid var(--color-text)',
                                    boxShadow: '3px 3px 0 var(--color-primary-dark)'
                                }}>
                                    {step.num}
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '4rem 2rem',
                background: 'var(--color-primary)',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        Ready to Make Math Fun? 🎉
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                        Join thousands of homeschool families learning with Professor Abacus!
                    </p>
                    <button
                        className="btn"
                        onClick={() => navigate('/auth')}
                        style={{
                            fontSize: '1.3rem',
                            padding: '1.2rem 2.5rem',
                            background: 'white',
                            color: 'var(--color-primary)',
                            border: '3px solid white',
                            boxShadow: '5px 5px 0 rgba(0,0,0,0.2)'
                        }}
                    >
                        Start Learning Today! ✨
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '2rem',
                textAlign: 'center',
                background: 'var(--color-bg-card)',
                borderTop: '3px solid var(--color-text)'
            }}>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    © 2026 Abacus Math Homeschool • Made with ❤️ for homeschool families
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
