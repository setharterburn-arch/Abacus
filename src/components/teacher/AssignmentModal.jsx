import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';

const AssignmentModal = ({ content, type, classId, students, onClose, onAssigned }) => {
    const [assignTo, setAssignTo] = useState('class');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    
    // SmartScore mode settings
    const [assignmentMode, setAssignmentMode] = useState('smartscore'); // 'smartscore' or 'quiz'
    const [targetScore, setTargetScore] = useState(80);

    const handleAssign = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Build assignment payload based on mode
            let assignmentPayload = {
                class_id: classId,
                title: content.title,
                description: instructions || content.description,
                due_date: dueDate || null,
                assignment_mode: assignmentMode,
            };

            if (assignmentMode === 'smartscore') {
                // SmartScore mode - store skill info for adaptive practice
                assignmentPayload = {
                    ...assignmentPayload,
                    target_score: targetScore,
                    skill_id: content.id,
                    skill_name: content.title,
                    topic: content.topic,
                    grade_level: content.grade_level ?? content.grade,
                    questions: [], // No static questions needed
                };
            } else {
                // Quiz mode - use static questions (legacy behavior)
                let questions = [];

                if (type === 'learning_path' && content.modules) {
                    const { generateFromSyllabus } = await import('../../services/curriculum_engine');
                    for (const mod of content.modules) {
                        const generated = await generateFromSyllabus(mod);
                        const modQuestions = generated.questions.map(q => ({
                            question: q.question,
                            options: q.options || [],
                            answer: q.correctAnswer || q.answer,
                            image: q.visual ? JSON.stringify(q.visual) : null
                        }));
                        questions = [...questions, ...modQuestions];
                    }
                } else {
                    const sourceQuestions = content.problems || content.questions || [];
                    questions = sourceQuestions.map(q => ({
                        question: q.question,
                        options: q.options || [],
                        answer: q.answer,
                        image: q.image || null
                    }));
                }

                if (questions.length === 0) {
                    if (!confirm("Warning: No questions found. Create assignment anyway?")) {
                        setLoading(false);
                        return;
                    }
                }

                assignmentPayload.questions = questions;
            }

            const { data: newAssignment, error } = await supabase
                .from('assignments')
                .insert([assignmentPayload])
                .select()
                .single();

            if (error) throw error;

            onAssigned(1);
            onClose();
        } catch (error) {
            console.error('Error creating assignments:', error);
            alert('Failed to create assignments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const selectedCount = assignTo === 'class' ? students.length : selectedStudents.length;
    const questionCount = content.questions?.length || content.problems?.length || 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="card"
                    style={{
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '2rem'
                    }}
                >
                    {/* Header */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Assign: {content.title}</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="badge" style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                padding: '0.25rem 0.75rem'
                            }}>
                                {content.topic || 'Curriculum'}
                            </span>
                            <span className="badge" style={{
                                background: '#e8f5e9',
                                color: '#2e7d32',
                                padding: '0.25rem 0.75rem'
                            }}>
                                Grade {content.grade_level === 0 ? 'K' : content.grade_level || content.grade || '?'}
                            </span>
                            {questionCount > 0 && (
                                <span className="badge" style={{
                                    background: '#fff3e0',
                                    color: '#e65100',
                                    padding: '0.25rem 0.75rem'
                                }}>
                                    {questionCount} questions
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Assignment Mode - THE KEY FEATURE */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Assignment Type:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className={`btn ${assignmentMode === 'smartscore' ? 'btn-primary' : ''}`}
                                onClick={() => setAssignmentMode('smartscore')}
                                style={{ flex: 1, padding: '1rem' }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎯</div>
                                <div style={{ fontWeight: 'bold' }}>SmartScore Mastery</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                    Adaptive • Unlimited questions
                                </div>
                            </button>
                            <button
                                className={`btn ${assignmentMode === 'quiz' ? 'btn-primary' : ''}`}
                                onClick={() => setAssignmentMode('quiz')}
                                style={{ flex: 1, padding: '1rem' }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📝</div>
                                <div style={{ fontWeight: 'bold' }}>Quick Quiz</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                    Fixed • {questionCount} questions
                                </div>
                            </button>
                        </div>
                        
                        {/* Mode explanation */}
                        <div style={{ 
                            marginTop: '0.75rem', 
                            padding: '0.75rem', 
                            background: assignmentMode === 'smartscore' ? '#e3f2fd' : '#f5f5f5',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                        }}>
                            {assignmentMode === 'smartscore' ? (
                                <>
                                    <strong>🎯 SmartScore Mastery:</strong> Students practice until they reach the target score. 
                                    Questions adapt to their level. Like IXL — builds real mastery.
                                </>
                            ) : (
                                <>
                                    <strong>📝 Quick Quiz:</strong> Students answer {questionCount} fixed questions. 
                                    Good for quick checks, but doesn't ensure mastery.
                                </>
                            )}
                        </div>
                    </div>

                    {/* Target Score (SmartScore mode only) */}
                    {assignmentMode === 'smartscore' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Target SmartScore to Complete:
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[70, 80, 90, 100].map(score => (
                                    <button
                                        key={score}
                                        className={`btn ${targetScore === score ? 'btn-primary' : ''}`}
                                        onClick={() => setTargetScore(score)}
                                        style={{ 
                                            flex: 1,
                                            padding: '0.75rem',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{score}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                            {score === 70 ? 'Basic' : score === 80 ? 'Proficient' : score === 90 ? 'Excellent' : 'Mastery'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assign To */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Assign To:
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className={`btn ${assignTo === 'class' ? 'btn-primary' : ''}`}
                                onClick={() => setAssignTo('class')}
                                style={{ flex: 1 }}
                            >
                                Entire Class ({students.length})
                            </button>
                            <button
                                className={`btn ${assignTo === 'individual' ? 'btn-primary' : ''}`}
                                onClick={() => setAssignTo('individual')}
                                style={{ flex: 1 }}
                            >
                                Individual Students
                            </button>
                        </div>
                    </div>

                    {/* Student Selection */}
                    {assignTo === 'individual' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Select Students:
                            </label>
                            <div style={{
                                maxHeight: '150px',
                                overflow: 'auto',
                                border: '1px solid var(--color-text)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem'
                            }}>
                                {students.map(student => (
                                    <label
                                        key={student.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleStudent(student.id)}
                                            style={{ marginRight: '0.75rem' }}
                                        />
                                        {student.first_name} {student.last_name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Due Date */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Due Date (optional):
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--color-text)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Instructions */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Instructions (optional):
                        </label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder={assignmentMode === 'smartscore' 
                                ? "Practice until you reach the target score. Take your time!"
                                : "Complete this assignment before Friday's quiz..."}
                            rows={2}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--color-text)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} className="btn" disabled={loading}>
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            className="btn btn-primary"
                            disabled={loading || (assignTo === 'individual' && selectedStudents.length === 0)}
                        >
                            {loading ? 'Assigning...' : `Assign to ${selectedCount} Student${selectedCount !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AssignmentModal;
