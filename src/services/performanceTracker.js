import { supabase } from './supabase';

/**
 * Performance Tracker Service
 * Manages student performance data and skill level calculations
 */

export const performanceTracker = {
    /**
     * Record a student's answer to a question
     */
    async recordAnswer(studentId, questionData) {
        const { curriculum_set_id, question_id, correct, time_spent, difficulty, topic } = questionData;

        try {
            // Get current stats
            const { data: stats, error: fetchError } = await supabase
                .from('student_stats')
                .select('performance_history, skill_levels')
                .eq('student_id', studentId)
                .single();

            if (fetchError) throw fetchError;

            // Add new performance record
            const performanceHistory = stats.performance_history || [];
            performanceHistory.push({
                question_id,
                curriculum_set_id,
                correct,
                time_spent,
                difficulty,
                topic,
                timestamp: new Date().toISOString()
            });

            // Keep only last 100 records to prevent bloat
            const recentHistory = performanceHistory.slice(-100);

            // Calculate updated skill level for this topic
            const skillLevels = stats.skill_levels || {};
            skillLevels[topic] = this.calculateSkillLevel(recentHistory, topic);

            // Update database
            const { error: updateError } = await supabase
                .from('student_stats')
                .update({
                    performance_history: recentHistory,
                    skill_levels: skillLevels,
                    last_practice_date: new Date().toISOString()
                })
                .eq('student_id', studentId);

            if (updateError) throw updateError;

            return { success: true, skillLevel: skillLevels[topic] };
        } catch (error) {
            console.error('Error recording answer:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Calculate skill level for a topic based on recent performance
     * Returns value between 0 and 1
     */
    calculateSkillLevel(performanceHistory, topic) {
        // Filter to this topic only
        const topicHistory = performanceHistory.filter(p => p.topic === topic);

        if (topicHistory.length === 0) return 0.5; // Default: medium skill

        // Look at last 10 questions for this topic
        const recent = topicHistory.slice(-10);

        // Calculate accuracy
        const correctCount = recent.filter(p => p.correct).length;
        const accuracy = correctCount / recent.length;

        // Weight by difficulty (harder questions = more skill)
        const difficultyWeights = { easy: 0.3, medium: 0.6, hard: 1.0 };
        let weightedScore = 0;
        let totalWeight = 0;

        recent.forEach(p => {
            const weight = difficultyWeights[p.difficulty] || 0.6;
            weightedScore += (p.correct ? 1 : 0) * weight;
            totalWeight += weight;
        });

        const skillLevel = totalWeight > 0 ? weightedScore / totalWeight : accuracy;

        // Clamp between 0 and 1
        return Math.max(0, Math.min(1, skillLevel));
    },

    /**
     * Get current skill level for a topic
     */
    async getSkillLevel(studentId, topic) {
        try {
            const { data, error } = await supabase
                .from('student_stats')
                .select('skill_levels')
                .eq('student_id', studentId)
                .single();

            if (error) throw error;

            return data.skill_levels?.[topic] || 0.5; // Default: medium
        } catch (error) {
            console.error('Error getting skill level:', error);
            return 0.5;
        }
    },

    /**
     * Get recent performance for analysis
     */
    async getRecentPerformance(studentId, limit = 20) {
        try {
            const { data, error } = await supabase
                .from('student_stats')
                .select('performance_history')
                .eq('student_id', studentId)
                .single();

            if (error) throw error;

            const history = data.performance_history || [];
            return history.slice(-limit);
        } catch (error) {
            console.error('Error getting performance:', error);
            return [];
        }
    },

    /**
     * Calculate recommended difficulty for next question
     */
    getRecommendedDifficulty(recentPerformance) {
        if (recentPerformance.length < 3) return 'medium';

        // Look at last 5 questions
        const recent = recentPerformance.slice(-5);
        const correctCount = recent.filter(p => p.correct).length;
        const accuracy = correctCount / recent.length;

        // Target 70% success rate
        if (accuracy >= 0.8) return 'hard';
        if (accuracy >= 0.6) return 'medium';
        return 'easy';
    }
};

export default performanceTracker;
