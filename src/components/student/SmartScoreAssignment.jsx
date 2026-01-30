import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { useStore } from '../../services/store';
import SmartScoreQuiz from '../adaptive/SmartScoreQuizV2';

/**
 * SmartScore Assignment Component
 * Wraps SmartScoreQuiz for teacher-assigned work
 * Completes assignment when student reaches target score
 */
const SmartScoreAssignment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useStore();
  
  const assignmentId = searchParams.get('assignment');
  const skillId = searchParams.get('skill');
  const topic = searchParams.get('topic');
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    if (assignmentId) {
      loadAssignment();
    } else {
      setLoading(false);
    }
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single();

      if (error) throw error;
      setAssignment(data);
    } catch (error) {
      console.error('Failed to load assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (results) => {
    const score = Math.round(results.score || 0);
    const targetScore = assignment?.target_score || 80;
    
    setFinalScore(score);
    
    if (score >= targetScore) {
      setCompleted(true);
      
      // Update assignment submission
      if (assignmentId && state.user) {
        try {
          // Check if submission exists
          const { data: existing } = await supabase
            .from('assignment_submissions')
            .select('id, score')
            .eq('assignment_id', assignmentId)
            .eq('student_id', state.user.id)
            .single();

          if (existing) {
            // Update if new score is higher
            if (score > (existing.score || 0)) {
              await supabase
                .from('assignment_submissions')
                .update({
                  score,
                  status: 'completed',
                  completed_at: new Date().toISOString(),
                  answers: results
                })
                .eq('id', existing.id);
            }
          } else {
            // Create new submission
            await supabase
              .from('assignment_submissions')
              .insert({
                assignment_id: assignmentId,
                student_id: state.user.id,
                score,
                status: 'completed',
                completed_at: new Date().toISOString(),
                answers: results
              });
          }
        } catch (error) {
          console.error('Failed to save submission:', error);
        }
      }
    }
  };

  const handleExit = () => {
    navigate('/assignments');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--color-bg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          <div>Loading assignment...</div>
        </div>
      </div>
    );
  }

  const targetScore = assignment?.target_score || 80;
  const skillName = assignment?.skill_name || assignment?.title || topic || 'Practice';
  const assignmentTopic = assignment?.topic || topic;
  const assignmentSkillId = assignment?.skill_id || skillId;
  const grade = assignment?.grade_level;

  // Show completion screen
  if (completed) {
    return (
      <div style={{ 
        background: 'var(--color-bg)', 
        minHeight: '100vh', 
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card"
          style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ marginBottom: '0.5rem' }}>Assignment Complete!</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            You've mastered <strong>{skillName}</strong>
          </p>
          
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            SmartScore: {finalScore}
          </div>
          
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Target was {targetScore} — you got {finalScore}!
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/assignments')}>
              Back to Assignments
            </button>
            <button className="btn" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Assignment header */}
      <div style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        padding: '1.5rem 2rem',
        borderBottom: '3px solid var(--color-text)'
      }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#1565c0', marginBottom: '0.25rem' }}>
                📋 Assignment
              </div>
              <h2 style={{ margin: 0, color: '#0d47a1' }}>{skillName}</h2>
              {assignment?.description && (
                <p style={{ margin: '0.5rem 0 0 0', color: '#1976d2', fontSize: '0.9rem' }}>
                  {assignment.description}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                background: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px',
                border: '2px solid #1565c0'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#1565c0' }}>Target SmartScore</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d47a1' }}>{targetScore}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SmartScore Quiz */}
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <SmartScoreQuiz
          studentId={state.user?.id}
          skillId={assignmentSkillId}
          skillName={skillName}
          topic={assignmentTopic}
          grade={grade}
          onComplete={handleQuizComplete}
          onExit={handleExit}
          infiniteMode={true}
        />
        
        {/* Progress hint */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#e3f2fd', 
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#1565c0'
        }}>
          💡 Reach SmartScore <strong>{targetScore}</strong> to complete this assignment
        </div>
      </div>
    </div>
  );
};

export default SmartScoreAssignment;
