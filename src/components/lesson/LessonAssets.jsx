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
    star: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    rocket: "https://cdn-icons-png.flaticon.com/512/3212/3212567.png", // 3D Rocket
    planet: "https://cdn-icons-png.flaticon.com/512/3594/3594270.png", // 3D Planet
    asteroid: "https://cdn-icons-png.flaticon.com/512/2530/2530939.png", // Asteroid
    pizzaBase: "https://cdn-icons-png.flaticon.com/512/6978/6978255.png", // Empty pizza
    pepperoni: "https://cdn-icons-png.flaticon.com/512/184/184567.png", // Pepperoni slice
    chefHat: "https://cdn-icons-png.flaticon.com/512/3443/3443338.png" // Chef hat
};

export const SpaceBackground = () => (
    <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop)',
        backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
    }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
    </div>
);

export const PizzaBackground = () => (
    <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1526016650454-68a6f488910a?q=80&w=2574&auto=format&fit=crop)', // Picnic vibe
        backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
    }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.1)' }} />
    </div>
);
