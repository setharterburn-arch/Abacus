import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Beta = () => {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'apples',
            title: '🍎 Apple Picking',
            description: 'Pre-K Counting. Help Professor Abacus pick apples.',
            path: '/beta/apples',
            tags: ['Pre-K', 'Counting']
        },
        {
            id: 'space',
            title: '🚀 Space Race',
            description: 'Multiplication (x2). Launch the rocket by skip counting!',
            path: '/beta/space',
            tags: ['Grade 2', 'Multiplication']
        },
        {
            id: 'pizza',
            title: '🍕 Pizza Party',
            description: 'Fractions Intro. Identify 1/2 and 1/4 of a pizza.',
            path: '/beta/pizza',
            tags: ['Grade 1', 'Fractions']
        },
        {
            id: 'shapes',
            title: '🦁 Shape Safari',
            description: 'Geometry (K-1). Find hidden triangles and squares in the jungle.',
            path: '/beta/shapes',
            tags: ['Grade K', 'Geometry']
        },
        {
            id: 'measure',
            title: '🔨 Carpenter Workshop',
            description: 'Measurement (1-2). Use a ruler to measure wood planks.',
            path: '/beta/measure',
            tags: ['Grade 1', 'Measurement']
        }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1rem' }}>
                    🧪 Beta Lab
                </h1>
                <p style={{ color: '#4b5563', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our newest experimental learning modules. These features are in active development.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {modules.map(module => (
                    <motion.div
                        key={module.id}
                        whileHover={{ y: -5 }}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate(module.path)}
                    >
                        <div style={{ height: '150px', background: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                            {module.title.split(' ')[0]}
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#111827' }}>
                                {module.title.substring(2)}
                            </h3>
                            <p style={{ color: '#6b7280', lineHeight: 1.5, marginBottom: '1rem' }}>
                                {module.description}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {module.tags.map(tag => (
                                    <span key={tag} style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Beta;
