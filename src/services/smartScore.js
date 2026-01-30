/**
 * SmartScore System - IXL-style mastery scoring
 * 
 * Unlike percentage-based scoring, SmartScore:
 * - Ranges from 0-100 (100 = mastery)
 * - Goes UP on correct answers, DOWN on incorrect
 * - Slows progress at higher scores (Challenge Zone)
 * - Requires ~28+ questions to reach 100
 * - Proficiency at 80, Excellence at 90, Mastery at 100
 * 
 * Based on research of IXL's SmartScore algorithm.
 */

class SmartScoreEngine {
  constructor() {
    // Base point values
    this.BASE_GAIN = 8;           // Base points gained per correct answer
    this.BASE_LOSS = 12;          // Base points lost per incorrect answer
    
    // Score thresholds
    this.PROFICIENCY = 80;        // "Got it" - basic understanding
    this.EXCELLENCE = 90;         // Challenge Zone begins
    this.MASTERY = 100;           // Full mastery
    
    // Challenge Zone settings (90+)
    this.CHALLENGE_STREAK_REQUIRED = 8;  // Correct answers in a row needed
    this.CHALLENGE_GAIN = 1.25;          // Points per correct in Challenge Zone
  }

  /**
   * Calculate new SmartScore after answering a question
   * @param {number} currentScore - Current SmartScore (0-100)
   * @param {boolean} correct - Whether the answer was correct
   * @param {number} streak - Current streak of correct answers
   * @param {number} difficulty - Question difficulty (0.5 = easy, 1 = normal, 1.5 = hard)
   * @returns {object} { newScore, streak, message, milestone }
   */
  calculateScore(currentScore, correct, streak = 0, difficulty = 1) {
    let newScore = currentScore;
    let newStreak = correct ? streak + 1 : 0;
    let message = '';
    let milestone = null;

    if (correct) {
      newScore = this._calculateGain(currentScore, newStreak, difficulty);
      
      // Check milestones
      if (currentScore < this.PROFICIENCY && newScore >= this.PROFICIENCY) {
        milestone = 'proficiency';
        message = '🎯 Proficiency reached! You\'ve got the basics down.';
      } else if (currentScore < this.EXCELLENCE && newScore >= this.EXCELLENCE) {
        milestone = 'excellence';
        message = '⭐ Entering Challenge Zone! Keep your streak going!';
      } else if (newScore >= this.MASTERY) {
        milestone = 'mastery';
        message = '🏆 MASTERY ACHIEVED! Incredible work!';
        newScore = this.MASTERY;
      } else if (newScore >= this.EXCELLENCE) {
        const remaining = this.CHALLENGE_STREAK_REQUIRED - (newStreak % this.CHALLENGE_STREAK_REQUIRED);
        if (remaining > 0 && remaining < this.CHALLENGE_STREAK_REQUIRED) {
          message = `🔥 ${remaining} more correct in a row for next level!`;
        }
      }
    } else {
      newScore = this._calculateLoss(currentScore, difficulty);
      
      // Losing milestones
      if (currentScore >= this.EXCELLENCE && newScore < this.EXCELLENCE) {
        message = '📉 Dropped from Challenge Zone. Keep practicing!';
      } else if (currentScore >= this.PROFICIENCY && newScore < this.PROFICIENCY) {
        message = '💪 You can do this! Let\'s build back up.';
      } else {
        message = '❌ Not quite. Check the hint and try similar problems.';
      }
    }

    // Clamp to valid range
    newScore = Math.max(0, Math.min(this.MASTERY, Math.round(newScore * 10) / 10));

    return {
      newScore,
      streak: newStreak,
      message,
      milestone,
      level: this._getLevel(newScore),
      progress: this._getProgress(newScore)
    };
  }

  /**
   * Calculate points gained for correct answer
   */
  _calculateGain(score, streak, difficulty) {
    let gain;

    if (score >= this.EXCELLENCE) {
      // Challenge Zone: slow, streak-based progress
      gain = this.CHALLENGE_GAIN * difficulty;
      
      // Bonus for maintaining streak
      if (streak >= 3) {
        gain *= 1.2;
      }
      if (streak >= 6) {
        gain *= 1.1;
      }
    } else if (score >= this.PROFICIENCY) {
      // 80-90 zone: moderate progress
      gain = this.BASE_GAIN * 0.5 * difficulty;
    } else if (score >= 50) {
      // 50-80 zone: normal progress
      gain = this.BASE_GAIN * 0.7 * difficulty;
    } else {
      // Below 50: faster initial progress
      gain = this.BASE_GAIN * difficulty;
      
      // First few correct answers give bigger boost
      if (score < 20) {
        gain *= 1.5;
      }
    }

    // Streak bonus (outside challenge zone)
    if (score < this.EXCELLENCE && streak >= 3) {
      gain *= 1 + (streak * 0.05);
    }

    return score + gain;
  }

  /**
   * Calculate points lost for incorrect answer
   */
  _calculateLoss(score, difficulty) {
    let loss;

    if (score >= this.EXCELLENCE) {
      // Challenge Zone: significant penalty
      loss = this.BASE_LOSS * 1.2;
    } else if (score >= this.PROFICIENCY) {
      // 80-90: moderate penalty
      loss = this.BASE_LOSS * 0.8;
    } else if (score >= 50) {
      // 50-80: normal penalty
      loss = this.BASE_LOSS * 0.6;
    } else {
      // Below 50: gentler penalty to avoid frustration
      loss = this.BASE_LOSS * 0.4;
      
      // Very low scores have minimal penalty
      if (score < 20) {
        loss *= 0.5;
      }
    }

    // Harder questions have slightly less penalty
    if (difficulty > 1) {
      loss *= 0.85;
    }

    return score - loss;
  }

  /**
   * Get descriptive level name
   */
  _getLevel(score) {
    if (score >= this.MASTERY) return 'mastery';
    if (score >= this.EXCELLENCE) return 'challenge';
    if (score >= this.PROFICIENCY) return 'proficient';
    if (score >= 50) return 'developing';
    if (score >= 20) return 'learning';
    return 'starting';
  }

  /**
   * Get progress info for UI
   */
  _getProgress(score) {
    if (score >= this.MASTERY) {
      return { label: 'Mastered!', color: '#FFD700', icon: '🏆' };
    }
    if (score >= this.EXCELLENCE) {
      return { label: 'Challenge Zone', color: '#9C27B0', icon: '⭐' };
    }
    if (score >= this.PROFICIENCY) {
      return { label: 'Proficient', color: '#4CAF50', icon: '🎯' };
    }
    if (score >= 50) {
      return { label: 'Developing', color: '#FF9800', icon: '📈' };
    }
    if (score >= 20) {
      return { label: 'Learning', color: '#2196F3', icon: '📚' };
    }
    return { label: 'Getting Started', color: '#9E9E9E', icon: '🌱' };
  }

  /**
   * Estimate questions needed to reach target score
   */
  estimateQuestionsToTarget(currentScore, targetScore = 100) {
    if (currentScore >= targetScore) return 0;
    
    // Rough estimate based on typical progression
    const ranges = [
      { max: 20, perPoint: 0.15 },
      { max: 50, perPoint: 0.2 },
      { max: 80, perPoint: 0.25 },
      { max: 90, perPoint: 0.4 },
      { max: 100, perPoint: 1.0 }  // Challenge zone is slow
    ];

    let questions = 0;
    let score = currentScore;

    for (const range of ranges) {
      if (score >= range.max) continue;
      const pointsInRange = Math.min(range.max, targetScore) - score;
      questions += pointsInRange * range.perPoint;
      score = range.max;
      if (score >= targetScore) break;
    }

    return Math.ceil(questions);
  }

  /**
   * Get recommended stopping point
   */
  getRecommendedStopPoint(score) {
    if (score >= this.MASTERY) {
      return { stop: true, reason: 'You\'ve achieved mastery! Move on to the next skill.' };
    }
    if (score >= this.EXCELLENCE) {
      return { stop: false, reason: 'You\'re in the Challenge Zone - a few more correct answers for mastery!' };
    }
    if (score >= this.PROFICIENCY) {
      return { stop: false, reason: 'You\'re proficient! Push to the Challenge Zone or try a new skill.' };
    }
    return { stop: false, reason: 'Keep practicing to build understanding.' };
  }
}

// Export singleton instance
export const smartScore = new SmartScoreEngine();

// Also export class for testing
export default SmartScoreEngine;
