import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../services/store';
import { saveCurriculumSet, getCurriculumSets, updateCurriculumStatus, deleteCurriculumSet } from '../services/database';
import { SYLLABUS } from '../data/syllabus';
import { generateFromSyllabus } from '../services/curriculum_engine';

const Admin = () => {
    const { state, dispatch } = useStore();
    const [activeTab, setActiveTab] = useState('browser'); // 'browser' or 'library'
    const [selectedGrade, setSelectedGrade] = useState(state.user?.grade || "1");
    const [curriculumSets, setCurriculumSets] = useState([]);
    const [generating, setGenerating] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!state.loading && state.profile?.role !== 'admin') {
            navigate('/dashboard');
        }
        loadCurriculum();
    }, [state.profile, state.loading, navigate]);

    const loadCurriculum = async () => {
        const sets = await getCurriculumSets();
        setCurriculumSets(sets);
    };

    const handleAssignModule = async (module) => {
        setGenerating(true);
        try {
            // 1. Generate questions using Engine
            const data = await generateFromSyllabus(module);

            // 2. Hydrate with Syllabus data
            const newSet = {
                ...data,
                grade: selectedGrade,
                status: 'assigned', // Auto-assign for now? Or draft? Let's assign immediately for ease.
                createdAt: new Date().toISOString()
            };

            // 3. Save
            await saveCurriculumSet(newSet);
            await loadCurriculum();
            alert(`Assigned "${module.title}"!`);
        } catch (error) {
            console.error(error);
            alert("Error assigning module.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this set?")) {
            await deleteCurriculumSet(id);
            await loadCurriculum();
        }
    };

    const isAssigned = (title) => {
        // Simple check if title already exists in library
        return curriculumSets.some(s => s.title === title && s.status !== 'completed');
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Admin Portal 🍎</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #eee' }}>
                <button
                    className={`btn ${activeTab === 'browser' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('browser')}
                >
                    Curriculum Browser
                </button>
                <button
                    className={`btn ${activeTab === 'library' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('library')}
                >
                    Assigned / Library ({curriculumSets.length})
                </button>
            </div>

            {/* BROWSER TAB */}
            {activeTab === 'browser' && (
                <div>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Select Grade Level:</label>
                        <select
                            className="input"
                            style={{ width: 'auto', margin: 0 }}
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            {Object.keys(SYLLABUS).map(g => (
                                <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {SYLLABUS[selectedGrade]?.map(module => {
                            const assigned = isAssigned(module.title);
                            return (
                                <div key={module.id} className="card" style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderLeft: `4px solid ${assigned ? 'var(--color-accent)' : '#ddd'}`
                                }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{module.title}</h3>
                                        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{module.description}</p>
                                    </div>
                                    <button
                                        className={`btn ${assigned ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={() => !assigned && handleAssignModule(module)}
                                        disabled={assigned || generating}
                                    >
                                        {assigned ? 'Assigned' : generating ? '...' : 'Assign Class'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* LIBRARY TAB */}
            {activeTab === 'library' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {curriculumSets.length === 0 && <p>No active assignments.</p>}
                    {curriculumSets.map(set => (
                        <div key={set.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{set.title}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                    {set.status.toUpperCase()} • {set.questions?.length} Questions
                                </div>
                            </div>
                            <button
                                className="btn"
                                style={{ background: '#ffebee', color: '#c62828' }}
                                onClick={() => handleDelete(set.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin;
