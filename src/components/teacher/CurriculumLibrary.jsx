import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import curriculumData from '../../data/curriculum.json';

const CurriculumLibrary = ({ classId, onClose }) => {
    const [selectedSet, setSelectedSet] = useState(null);
    const [assigning, setAssigning] = useState(false);

    const handleAssign = async (set) => {
        setAssigning(true);
        try {
            const { error } = await supabase
                .from('assignments')
                .insert([{
                    class_id: classId,
                    title: set.title,
                    description: set.description,
                    questions: set.questions,
                    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
                }]);

            if (error) throw error;

            alert(`"${set.title}" assigned successfully!`);
            onClose();
        } catch (error) {
            alert('Error assigning curriculum: ' + error.message);
        } finally {
            setAssigning(false);
        }
    };

    // Group by grade level
    const groupedByGrade = curriculumData.reduce((acc, set) => {
        if (!acc[set.grade_level]) acc[set.grade_level] = [];
        acc[set.grade_level].push(set);
        return acc;
    }, {});

    return (
        <div className="card" style={{ marginTop: '1rem', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>📚 Curriculum Library</h3>
                <button className="btn" onClick={onClose} style={{ padding: '0.2rem 0.5rem' }}>Close</button>
            </div>

            {selectedSet ? (
                <div>
                    <button className="btn btn-secondary" onClick={() => setSelectedSet(null)} style={{ marginBottom: '1rem' }}>
                        ← Back to Library
                    </button>

                    <div style={{ marginBottom: '1rem' }}>
                        <h4>{selectedSet.title}</h4>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>{selectedSet.description}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                                Grade {selectedSet.grade_level}
                            </span>
                            <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                                {selectedSet.topic}
                            </span>
                            <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                                {selectedSet.questions.length} Questions
                            </span>
                        </div>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        {selectedSet.questions.map((q, i) => (
                            <div key={i} style={{ marginBottom: '1rem', color: '#333' }}>
                                <strong>{i + 1}. {q.question}</strong>
                                <ul style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    {q.options.map((opt, j) => (
                                        <li key={j} style={{ color: opt === q.answer ? 'green' : 'inherit' }}>
                                            {opt} {opt === q.answer && '✓'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <button
                        disabled={assigning}
                        className="btn btn-primary"
                        onClick={() => handleAssign(selectedSet)}
                        style={{ width: '100%' }}
                    >
                        {assigning ? 'Assigning...' : 'Assign to Class'}
                    </button>
                </div>
            ) : (
                <div>
                    <p style={{ marginBottom: '1rem', color: 'gray' }}>
                        Browse ready-made curriculum sets. Click to preview and assign.
                    </p>

                    {Object.keys(groupedByGrade).sort().map(grade => (
                        <div key={grade} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Grade {grade}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {groupedByGrade[grade].map(set => (
                                    <div
                                        key={set.id}
                                        className="card"
                                        style={{
                                            cursor: 'pointer',
                                            border: '1px solid #eee',
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}
                                        onClick={() => setSelectedSet(set)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{set.title}</h5>
                                        <p style={{ fontSize: '0.85rem', color: 'gray', margin: '0 0 0.5rem 0' }}>
                                            {set.description}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2', fontSize: '0.75rem' }}>
                                                {set.topic}
                                            </span>
                                            <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem' }}>
                                                {set.questions.length} Q's
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurriculumLibrary;
