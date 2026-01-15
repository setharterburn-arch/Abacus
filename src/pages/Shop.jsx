import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';

const SHOP_ITEMS = [
    { id: 'cowboy_hat', name: 'Cowboy Hat', price: 50, type: 'hat', img: 'https://cdn-icons-png.flaticon.com/512/375/375043.png' },
    { id: 'sunglasses', name: 'Cool Shades', price: 30, type: 'glasses', img: 'https://cdn-icons-png.flaticon.com/512/2663/2663067.png' },
    { id: 'wizard_hat', name: 'Wizard Hat', price: 150, type: 'hat', img: 'https://cdn-icons-png.flaticon.com/512/1066/1066266.png' },
    { id: 'grad_cap', name: 'Scholar Cap', price: 100, type: 'hat', img: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
    { id: 'bowtie', name: 'Red Bowtie', price: 40, type: 'neck', img: 'https://cdn-icons-png.flaticon.com/512/527/527453.png' }
];

const Shop = () => {
    const { stats, purchaseItem, toggleEquip } = useGamification();

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem', color: '#7c3aed' }}>
                Hoot's Fashion Shop 🎩
            </h1>

            <div style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '3rem', background: '#fef3c7', padding: '1rem', borderRadius: '50px', display: 'inline-block', border: '2px solid #f59e0b' }}>
                Your Coins: <strong>{stats.coins} 🪙</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                {SHOP_ITEMS.map(item => {
                    const owned = stats.inventory.includes(item.id);
                    const equipped = stats.equipped_items[item.type] === item.id;
                    const canAfford = stats.coins >= item.price;

                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'white', borderRadius: '20px', padding: '1.5rem',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)', textAlign: 'center',
                                border: equipped ? '4px solid #16a34a' : '1px solid #e5e7eb'
                            }}
                        >
                            <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>

                            {!owned && (
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d97706', marginBottom: '1rem' }}>
                                    {item.price} 🪙
                                </div>
                            )}

                            {owned ? (
                                <button
                                    className={`btn ${equipped ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={() => toggleEquip(item)}
                                    style={{ width: '100%', background: equipped ? '#16a34a' : undefined }}
                                >
                                    {equipped ? 'Equipped ✔' : 'Equip'}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => purchaseItem(item)}
                                    disabled={!canAfford}
                                    style={{ width: '100%', opacity: canAfford ? 1 : 0.5, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                                >
                                    Buy
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Shop;
