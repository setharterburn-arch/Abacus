import React from 'react';
import { Link } from 'react-router-dom';

const Changelog = () => {
    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>
                        📋 Changelog
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                        What's new in Abacus Learn
                    </p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <Link 
                    to="/" 
                    style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        marginBottom: '2rem'
                    }}
                >
                    ← Back to Home
                </Link>

                {/* Beta v2.1 Release */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '2px solid var(--color-bg)'
                    }}>
                        <span style={{
                            background: '#22c55e',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            Beta v2.1
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                            January 31, 2026
                        </span>
                    </div>

                    {/* New Interactive Components */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                            ✨ New Interactive Question Types
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>Clock Face</strong> - Drag clock hands to set times for telling time questions</li>
                            <li><strong>Coordinate Grid</strong> - Plot points on a coordinate plane for geometry</li>
                            <li><strong>Bar Graph</strong> - Read and create bar graphs for data/statistics</li>
                        </ul>
                    </section>

                    {/* Gamification */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: '#f97316', marginBottom: '1rem' }}>
                            🎮 Enhanced Gamification
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>Streak Celebrations</strong> - Confetti and animations for answer streaks (3+, 5+, 10+)</li>
                            <li><strong>Daily Challenge</strong> - Complete 5 questions daily for bonus XP and streak rewards</li>
                            <li><strong>Mastery Map</strong> - Visual skill tree showing progress across topics</li>
                            <li><strong>SmartScore Badge</strong> - New badge component showing mastery level at a glance</li>
                        </ul>
                    </section>

                    {/* Content */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                            📚 Content Expansion
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>New AI curriculum generator</strong> - Uses Gemini to generate IXL-style content</li>
                            <li><strong>Math accuracy audit</strong> - Script to validate arithmetic in generated questions</li>
                            <li><strong>700+ skills</strong> across K-8 with 20,000+ questions</li>
                        </ul>
                    </section>

                    {/* UX */}
                    <section>
                        <h3 style={{ color: '#a855f7', marginBottom: '1rem' }}>
                            🎨 UX Improvements
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>Breadcrumb navigation</strong> - Better wayfinding throughout the app</li>
                            <li><strong>Improved animations</strong> - Smoother transitions with Framer Motion</li>
                            <li><strong>Progress indicators</strong> - Clear visual feedback during practice sessions</li>
                        </ul>
                    </section>
                </div>

                {/* Beta v2 Release */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '2px solid var(--color-bg)'
                    }}>
                        <span style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            Beta v2
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                            January 30, 2026
                        </span>
                    </div>

                    {/* SmartScore */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                            🎯 SmartScore Mastery System
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>IXL-style adaptive scoring</strong> - Score goes up AND down based on performance</li>
                            <li><strong>Two-step answer flow</strong> - Select answer → Check → Next (prevents accidental clicks)</li>
                            <li><strong>Streak bonuses</strong> - Build streaks for faster progress in the Challenge Zone (90+)</li>
                            <li><strong>Mastery at 100</strong> - Reach 100 to master a skill</li>
                            <li><strong>Infinite Practice Mode</strong> - Questions generated algorithmically so you never run out</li>
                        </ul>
                    </section>

                    {/* Curriculum */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                            📚 Curriculum Expansion
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>840+ skill sets</strong> covering K-8 math</li>
                            <li><strong>17,000+ questions</strong> in the database</li>
                            <li><strong>Algorithmic generators</strong> for unlimited practice</li>
                            <li><strong>IXL-style skill names</strong> - Action verbs like "Add", "Find", "Solve"</li>
                            <li><strong>Grade 8 expansion</strong> - Algebra, Pythagorean theorem, functions, systems of equations</li>
                        </ul>
                    </section>

                    {/* Interactive Questions */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                            🎮 Interactive Question Types
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>Number Line</strong> - Drag to place values on a number line</li>
                            <li><strong>Fraction Shading</strong> - Click to shade parts of shapes</li>
                            <li><strong>Array Builder</strong> - Build multiplication arrays visually</li>
                            <li><strong>Drag & Sort</strong> - Arrange items in order</li>
                            <li><strong>927 interactive questions</strong> added across all grades</li>
                        </ul>
                    </section>

                    {/* Visual Content */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            🎨 Visual Enhancements
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>131 SVG illustrations</strong> for counting and comparison questions</li>
                            <li><strong>21 shape SVGs</strong> for geometry questions</li>
                            <li><strong>Visual feedback</strong> with animations for correct/incorrect answers</li>
                        </ul>
                    </section>

                    {/* Admin Features */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            ⚙️ Admin & Backend
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li><strong>Curriculum Manager</strong> - Full CRUD for skills and questions</li>
                            <li><strong>Supabase migration</strong> - Curriculum stored in database</li>
                            <li><strong>Teacher assignments</strong> - Assign SmartScore practice to students</li>
                        </ul>
                    </section>

                    {/* Bug Fixes */}
                    <section>
                        <h3 style={{ marginBottom: '1rem' }}>
                            🐛 Bug Fixes
                        </h3>
                        <ul style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
                            <li>Fixed ghost question rendering (complete SmartScore rewrite)</li>
                            <li>Fixed double-click registration on answer buttons</li>
                            <li>Fixed topic selection requiring multiple clicks</li>
                            <li>Fixed 175 incorrect answers in curriculum</li>
                            <li>Removed 64 questions with duplicate answer options</li>
                        </ul>
                    </section>
                </div>

                {/* Previous versions placeholder */}
                <div className="card" style={{ opacity: 0.6, textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Beta v1 • Initial release • December 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Changelog;
