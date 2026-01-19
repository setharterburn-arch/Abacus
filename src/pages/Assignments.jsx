import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../services/store';
import supabase from '../services/supabase';

const Assignments = () => {
    const { state } = useStore();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('todo');

    useEffect(() => {
        if (state.user) {
            loadAssignments();
        }
    }, [state.user]);

    const loadAssignments = async () => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('student_id', state.user.id)
                .order('due_date', { ascending: true, nullsLast: true });

            if (error) throw error;
            setAssignments(data || []);
        } catch (error) {
            console.error('Error loading assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const todoAssignments = assignments.filter(a => a.status !== 'completed');
    const completedAssignments = assignments.filter(a => a.status === 'completed');

    const startAssignment = async (assignment) => {
        // Update status to in_progress
        await supabase
            .from('assignments')
            .update({ status: 'in_progress' })
            .eq('id', assignment.id);

        // Navigate to practice with assignment context
        if (assignment.assignment_type === 'curriculum_set') {
            navigate(`/practice?set=${assignment.curriculum_set_id}&assignment=${assignment.id}`);
        } else {
            navigate(`/practice?path=${assignment.learning_path_id}&assignment=${assignment.id}`);
        }
    };

    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;
        const date = new Date(dueDate);
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Overdue', color: '#f44336' };
        if (diffDays === 0) return { text: 'Due Today', color: '#ff9800' };
        if (diffDays === 1) return { text: 'Due Tomorrow', color: '#ff9800' };
        return { text: `Due ${date.toLocaleDateString()}`, color: 'var(--color-text-muted)' };
    };

    if (!state.user) {
        return (
            <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '4rem 2rem' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="card">
                        <h2>Sign In Required</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            You need to be signed in to view your assignments.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/auth')}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '2rem' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem', textAlign: 'center' }}
                >
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>
                        📋 My Assignments
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                        Complete assignments from your teacher
                    </p>
                </motion.div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid var(--color-text)'
                }}>
                    <button
                        onClick={() => setActiveTab('todo')}
                        style={{
                            padding: '1rem 2rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'todo' ? '3px solid var(--color-primary)' : 'none',
                            color: activeTab === 'todo' ? 'var(--color-primary)' : 'var(--color-text)',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginBottom: '-2px'
                        }}
                    >
                        To Do ({todoAssignments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        style={{
                            padding: '1rem 2rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'completed' ? '3px solid var(--color-primary)' : 'none',
                            color: activeTab === 'completed' ? 'var(--color-primary)' : 'var(--color-text)',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginBottom: '-2px'
                        }}
                    >
                        Completed ({completedAssignments.length})
                    </button>
                </div>

                {/* Assignments List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                        <p>Loading assignments...</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(activeTab === 'todo' ? todoAssignments : completedAssignments).map((assignment, index) => {
                            const dueInfo = formatDueDate(assignment.due_date);

                            return (
                                <motion.div
                                    key={assignment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="card"
                                    style={{ padding: '1.5rem' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '1.5rem' }}>
                                                    {assignment.assignment_type === 'curriculum_set' ? '📚' : '🎯'}
                                                </span>
                                                <h3 style={{ margin: 0 }}>{assignment.title}</h3>
                                            </div>
                                            {assignment.description && (
                                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                                                    {assignment.description}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                                <span>
                                                    Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                                                </span>
                                                {dueInfo && (
                                                    <span style={{ color: dueInfo.color, fontWeight: 'bold' }}>
                                                        {dueInfo.text}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {assignment.status === 'completed' && assignment.score && (
                                            <div style={{
                                                background: 'var(--color-primary)',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontWeight: 'bold'
                                            }}>
                                                {assignment.score}%
                                            </div>
                                        )}
                                    </div>

                                    {assignment.status !== 'completed' && (
                                        <button
                                            onClick={() => startAssignment(assignment)}
                                            className="btn btn-primary"
                                            style={{ width: '100%' }}
                                        >
                                            {assignment.status === 'assigned' ? 'Start Assignment' : 'Continue Assignment'} →
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* Empty State */}
                        {(activeTab === 'todo' ? todoAssignments : completedAssignments).length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                    {activeTab === 'todo' ? '🎉' : '📝'}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>
                                    {activeTab === 'todo' ? 'No assignments yet!' : 'No completed assignments'}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>
                                    {activeTab === 'todo'
                                        ? 'Your teacher will assign work here.'
                                        : 'Complete assignments to see them here.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assignments;
