import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FAQ = () => {
    const navigate = useNavigate();

    const studentFAQs = [
        {
            q: "How do I earn XP and level up?",
            a: "You earn XP for every question you answer correctly! Streak bonuses and completing full lesson sets give you extra XP. As you gain XP, you'll unlock new levels and cool badges for your profile."
        },
        {
            q: "Can I customize my avatar?",
            a: "Yes! Use the coins you earn from lessons to buy fun accessories like hats, glasses, and backgrounds in the Shop."
        },
        {
            q: "What if I get stuck on a question?",
            a: "Professor Abacus is here to help! Click the \"Help\" button or the chat icon to ask for a hint. He'll guide you without giving away the answer directly."
        },
        {
            q: "How do I join a class?",
            a: "Ask your teacher for a 6-letter Class Code. Go to your Dashboard, click \"Join Class\", and type it in!"
        }
    ];

    const teacherFAQs = [
        {
            q: "How do I create a class?",
            a: "Go to your Teacher Dashboard and click \"Create New Class\". Give it a name, and you'll get a unique Join Code to share with your students."
        },
        {
            q: "How do I assign work?",
            a: "In your Dashboard, select a class and click \"AI Generator\" to create custom assignments, or browse the \"Curriculum Library\" to assign pre-made sets."
        },
        {
            q: "Can I print worksheets?",
            a: "Absolutely! Go to the \"Worksheets\" tab. You can generate unlimited PDF worksheets with answer keys (and QR codes!) for offline practice."
        },
        {
            q: "Is the curriculum standards-aligned?",
            a: "Our K-9 curriculum is designed to align with common core standards, covering everything from basic counting to algebra and geometry."
        }
    ];

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, var(--hero-start) 0%, var(--hero-end) 100%)',
                padding: '3rem 2rem',
                textAlign: 'center',
                borderBottom: '3px solid var(--color-text)'
            }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        style={{ fontSize: '4rem', marginBottom: '1rem' }}
                    >
                        ❓
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            color: 'var(--color-text)',
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-display)'
                        }}
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                        Everything you need to know to get the most out of Abacus!
                    </p>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '900px', padding: '3rem 1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="btn"
                    style={{ marginBottom: '2rem' }}
                >
                    ← Back
                </button>

                <div style={{ display: 'grid', gap: '3rem' }}>
                    {/* Student Section */}
                    <section>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'var(--bg-student)',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--color-secondary)',
                            color: 'var(--color-text)'
                        }}>
                            <span style={{ fontSize: '2rem' }}>🎓</span>
                            <h2 style={{ margin: 0, color: 'var(--color-secondary)' }}>For Students</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {studentFAQs.map((item, idx) => (
                                <div key={idx} className="card">
                                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{item.q}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Teacher Section */}
                    <section>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'var(--bg-teacher)',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--color-primary)',
                            color: 'var(--color-text)'
                        }}>
                            <span style={{ fontSize: '2rem' }}>👩‍🏫</span>
                            <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>For Teachers</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {teacherFAQs.map((item, idx) => (
                                <div key={idx} className="card">
                                    <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>{item.q}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Still have questions?</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/feedback')}>
                        Contact Support 📬
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
