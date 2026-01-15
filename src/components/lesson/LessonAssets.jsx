import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

// Define Shop Items for reference
export const SHOP_ITEMS = [
    { id: 'cowboy_hat', name: 'Cowboy Hat', price: 50, type: 'hat', img: 'https://cdn-icons-png.flaticon.com/512/375/375043.png' },
    { id: 'sunglasses', name: 'Cool Shades', price: 30, type: 'glasses', img: 'https://cdn-icons-png.flaticon.com/512/2663/2663067.png' },
    { id: 'wizard_hat', name: 'Wizard Hat', price: 150, type: 'hat', img: 'https://cdn-icons-png.flaticon.com/512/1066/1066266.png' },
    { id: 'grad_cap', name: 'Scholar Cap', price: 100, type: 'hat', img: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
    { id: 'bowtie', name: 'Red Bowtie', price: 40, type: 'neck', img: 'https://cdn-icons-png.flaticon.com/512/527/527453.png' }
];

export const AssetImages = {
    apple: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
    star: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    rocket: "https://cdn-icons-png.flaticon.com/512/3212/3212567.png",
    planet: "https://cdn-icons-png.flaticon.com/512/3594/3594270.png",
    asteroid: "https://cdn-icons-png.flaticon.com/512/2530/2530939.png",
    pizzaBase: "https://cdn-icons-png.flaticon.com/512/6978/6978255.png",
    pepperoni: "https://cdn-icons-png.flaticon.com/512/184/184567.png",
    chefHat: "https://cdn-icons-png.flaticon.com/512/3443/3443338.png"
};

export const ProfessorAbacus = ({ state = 'neutral', speaking = false }) => {
    // Access Gamification Context to see what to wear
    let equipped = {};
    try {
        const gamification = useGamification();
        equipped = gamification?.stats?.equipped_items || {};
    } catch (e) {
        // Fallback if used outside provider (rare)
    }

    const hatId = equipped.hat;
    const glassesId = equipped.glasses;
    const hatItem = SHOP_ITEMS.find(i => i.id === hatId);
    const glassesItem = SHOP_ITEMS.find(i => i.id === glassesId);

    return (
        <motion.div
            style={{ width: '220px', height: '260px', position: 'relative' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
        >
            {/* Abacus The Lion */}
            <motion.img
                src="/abacus_lion.png"
                alt="Professor Abacus"
                style={{ width: '100%', height: '100%', objectFit: 'contain', dropShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                animate={speaking ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
            />

            {/* Hat Overlay - Adjusted for Lion Head */}
            {hatItem && (
                <motion.img
                    src={hatItem.img}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        position: 'absolute',
                        top: '-18%',
                        left: '20%',
                        width: '60%',
                        zIndex: 10,
                        filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))'
                    }}
                />
            )}

            {/* Glasses Overlay - Adjusted for Lion Eyes */}
            {glassesItem && (
                <motion.img
                    src={glassesItem.img}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        position: 'absolute',
                        top: '28%',
                        left: '25%',
                        width: '50%',
                        zIndex: 10
                    }}
                />
            )}

        </motion.div>
    );
};

export const OrchardBackground = () => (
    <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1596627685789-982855b57d54?q=80&w=2670&auto=format&fit=crop)',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8
    }} />
);

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
        backgroundImage: 'url(https://images.unsplash.com/photo-1526016650454-68a6f488910a?q=80&w=2574&auto=format&fit=crop)',
        backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
    }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.1)' }} />
    </div>
);
