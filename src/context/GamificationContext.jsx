import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from '../services/store';
import { supabase } from '../services/supabase';
import { audioManager } from '../services/audio'; // Optional integration
import confetti from 'canvas-confetti';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
    const { state: { session, profile } } = useStore();
    const [stats, setStats] = useState({
        xp: 0,
        level: 1,
        coins: 0,
        inventory: [],
        equipped_items: {}
    });
    const [loading, setLoading] = useState(true);
    const [showLevelUp, setShowLevelUp] = useState(false); // For modal

    // Load stats from DB or LocalStorage
    useEffect(() => {
        if (!session || !profile) {
            // Demo mode / Offline: Load from localStorage
            const local = localStorage.getItem('abacus_gamification');
            if (local) setStats(JSON.parse(local));
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                let { data, error } = await supabase
                    .from('student_stats')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error && error.code === 'PGRST116') {
                    // Row not found, create one
                    const newStats = { id: session.user.id, xp: 0, level: 1, coins: 0 };
                    const { data: created, error: createError } = await supabase
                        .from('student_stats')
                        .insert(newStats)
                        .select()
                        .single();

                    if (!createError) data = created;
                }

                if (data) {
                    setStats(data);
                }
            } catch (err) {
                console.error("Error loading stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session, profile]);

    // Persist to DB/Local
    const saveStats = async (newStats) => {
        setStats(newStats);

        // Local persist always for redundancy/offline
        localStorage.setItem('abacus_gamification', JSON.stringify(newStats));

        if (session) {
            try {
                await supabase
                    .from('student_stats')
                    .upsert({
                        id: session.user.id,
                        xp: newStats.xp,
                        level: newStats.level,
                        coins: newStats.coins,
                        inventory: newStats.inventory,
                        equipped_items: newStats.equipped_items
                    });
            } catch (err) {
                console.error("Failed to sync stats:", err);
            }
        }
    };

    const awardXP = (amount) => {
        // Calculate Level Up Logic
        let { xp, level, coins } = stats;
        let newXP = xp + amount;
        let newLevel = level;
        let newCoins = coins;

        const xpNeeded = newLevel * 100; // Curve: 100, 200, 300...

        if (newXP >= xpNeeded) {
            newXP = newXP - xpNeeded;
            newLevel++;
            newCoins += 20; // Level up bonus!

            // Trigger celebration
            setShowLevelUp(true);
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
            audioManager.playSfx('success'); // or a distinct level up sound
            audioManager.speak(`Level Up! You are now level ${newLevel}!`); // Voice feedback
        }

        const updated = {
            ...stats,
            xp: newXP,
            level: newLevel,
            coins: newCoins
        };

        saveStats(updated);
    };

    const purchaseItem = (item) => {
        if (stats.coins >= item.price && !stats.inventory.includes(item.id)) {
            const newStats = {
                ...stats,
                coins: stats.coins - item.price,
                inventory: [...stats.inventory, item.id]
            };
            saveStats(newStats);
            audioManager.playSfx('success');
            return true;
        }
        return false;
    };

    const toggleEquip = (item) => {
        const type = item.type; // 'hat', 'glasses'
        let newEquipped = { ...stats.equipped_items };

        if (newEquipped[type] === item.id) {
            // Unequip
            delete newEquipped[type];
        } else {
            // Equip
            newEquipped[type] = item.id;
        }

        const newStats = { ...stats, equipped_items: newEquipped };
        saveStats(newStats);
    };

    return (
        <GamificationContext.Provider value={{
            stats,
            loading,
            awardXP,
            purchaseItem,
            toggleEquip,
            showLevelUp,
            setShowLevelUp
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
