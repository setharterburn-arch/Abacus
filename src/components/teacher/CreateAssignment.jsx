import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { generateAssignment } from '../../services/ai';
import { useNavigate } from 'react-router-dom';

const CreateAssignment = ({ classId, onClose }) => {
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(5);
    const [difficulty, setDifficulty] = useState('medium');
    const [generatedQuestions, setGeneratedQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Manual overrides
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Rough grade level assumption (can be refined later)
            const gradeLevel = 5;
            const questions = await generateAssignment(topic, gradeLevel, questionCount, difficulty);
            setGeneratedQuestions(questions);
            setTitle(`${topic} Quiz`);
            setDescription(`A ${questionCount}-question quiz about ${topic} (${difficulty}).`);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedQuestions) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('assignments')
                .insert([{
                    class_id: classId,
                    title,
                    description,
                    questions: generatedQuestions,
                    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 1 week due date
                }]);

            if (error) throw error;

            alert('Assignment assigned successfully!');
            onClose(); // Close modal/form
        } catch (error) {
            alert('Error saving assignment: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card" style={{ marginTop: '1rem', border: '1px solid var(--color-primary)' }}>
            <h3>✨ AI Assignment Generator</h3>

            {!generatedQuestions ? (
                <form onSubmit={handleGenerate}>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label>Topic</label>
                            <input
                                className="input"
                                placeholder="e.g. Fractions, Algebra, Geometry"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label>Difficulty</label>
                                <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Questions</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="1" max="20"
                                    value={questionCount}
                                    onChange={e => setQuestionCount(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                        <button disabled={loading} className="btn btn-primary">
                            {loading ? 'Generating...' : 'Generate Assignment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Title</label>
                        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        {generatedQuestions.map((q, i) => (
                            <div key={i} style={{ marginBottom: '1rem', color: '#333' }}>
                                <strong>{i + 1}. {q.question}</strong>
                                <ul style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    {q.options.map((opt, j) => (
                                        <li key={j} style={{ color: opt === q.answer ? 'green' : 'inherit' }}>
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => setGeneratedQuestions(null)}>
                            Back
                        </button>
                        <button disabled={saving} className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
                            {saving ? 'Assigning...' : 'Assign to Class'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAssignment;
