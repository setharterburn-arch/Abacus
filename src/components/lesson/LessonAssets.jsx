import React from 'react';
import { motion } from 'framer-motion';

export const ProfessorHoot = ({ state = 'neutral', speaking = false }) => {
    return (
        <motion.div
            style={{ width: '200px', height: '240px', position: 'relative' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
        >
            <motion.img
                src="https://cdn-icons-png.flaticon.com/512/3468/3468306.png"
                alt="Professor Owl"
                style={{ width: '100%', height: '100%', objectFit: 'contain', dropShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                animate={speaking ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
            />
        </motion.div>
    );
};

export const OrchardBackground = () => (
    <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1629814596172-35360980590a?q=80&w=2574&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
    }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(2px)' }} />
    </div>
);

export const AssetImages = {
    apple: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
    star: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
};
