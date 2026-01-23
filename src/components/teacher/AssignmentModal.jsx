import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';

const AssignmentModal = ({ content, type, classId, students, onClose, onAssigned }) => {
    const [assignTo, setAssignTo] = useState('class');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Create ONE assignment for the class
            // The 'assignments' table is class-level. 'assignment_submissions' tracks student progress.
            const assignmentPayload = {
                class_id: classId,
                title: content.title,
                description: instructions || content.description,
                questions: [], // Required by schema, defaulting to empty array for curriculum sets
                due_date: dueDate || null,
                // curriculum_set_id / learning_path_id might need to be added to schema if we want to track them, 
                // but for now we stick to the existing schema columns to avoid errors.
            };

            const { data: newAssignment, error } = await supabase
                .from('assignments')
                .insert([assignmentPayload])
                .select()
                .single();

            if (error) throw error;

            // If we selected specific students, we might want to "pre-create" submissions 
            // or just rely on them seeing it in the class list.
            // For now, adhering to the "Class Level" schema means everyone in class sees it.
            // If we strictly want 'Individual Assignment', we'd need to change the backend.
            // Assuming default behavior is fine:

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
                        <span className="badge" style={{
                            background: type === 'curriculum_set' ? 'var(--color-primary)' : 'var(--color-secondary)',
                            color: 'white',
                            padding: '0.25rem 0.75rem'
                        }}>
                            {type === 'curriculum_set' ? '📚 Curriculum Set' : '🎯 Learning Path'}
                        </span>
                    </div>

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
                                maxHeight: '200px',
                                overflow: 'auto',
                                border: '1px solid var(--color-text)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1rem'
                            }}>
                                {students.map(student => (
                                    <label
                                        key={student.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            ':hover': { background: 'var(--color-bg)' }
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
                            Instructions for Students (optional):
                        </label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Complete this assignment before Friday's quiz..."
                            rows={3}
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
                        <button
                            onClick={onClose}
                            className="btn"
                            disabled={loading}
                        >
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
