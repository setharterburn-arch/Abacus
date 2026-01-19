import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import CreateAssignment from '../components/teacher/CreateAssignment';
import ClassRoster from '../components/teacher/ClassRoster';
import CurriculumLibrary from '../components/teacher/CurriculumLibrary';

const TeacherDashboard = ({ profile }) => {
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [activeClass, setActiveClass] = useState(null);
    const [viewingRoster, setViewingRoster] = useState(null);
    const [viewingCurriculum, setViewingCurriculum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('*')
                .eq('teacher_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClasses(data || []);
        } catch (error) {
            console.error('Error fetching classes:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const createClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        try {
            // Generate a simple 6-char random code
            const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const { data, error } = await supabase
                .from('classes')
                .insert([
                    { teacher_id: profile.id, name: newClassName, join_code: joinCode }
                ])
                .select()
                .single();

            if (error) throw error;

            setClasses([data, ...classes]);
            setNewClassName('');
            alert(`Class created! Join Code: ${joinCode}`);
        } catch (error) {
            alert('Error creating class: ' + error.message);
        }
    };

    const [editingClass, setEditingClass] = useState(null);

    const updateClass = async (e) => {
        e.preventDefault();
        if (!editingClass || !editingClass.name.trim()) return;

        try {
            const { error } = await supabase
                .from('classes')
                .update({ name: editingClass.name })
                .eq('id', editingClass.id);

            if (error) throw error;

            setClasses(classes.map(c => c.id === editingClass.id ? { ...c, name: editingClass.name } : c));
            setEditingClass(null);
            alert('Class name updated!');
        } catch (error) {
            alert('Error updating class: ' + error.message);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>Ms/Mr. {profile.last_name}'s Classroom 🍎</h1>
                <p>Manage your classes and assignments.</p>
            </header>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Create Class Card */}
                <div className="card">
                    <h3>Create New Class</h3>
                    <form onSubmit={createClass} style={{ marginTop: '1rem' }}>
                        <input
                            className="input"
                            placeholder="Class Name (e.g. 5th Grade Math)"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            style={{ marginBottom: '1rem' }}
                        />
                        <button className="btn btn-primary" style={{ width: '100%' }}>Create Class</button>
                    </form>
                </div>

                {/* Class List */}
                <div className="card">
                    <h3>Your Classes</h3>
                    {loading ? <p>Loading...</p> : classes.length === 0 ? (
                        <p style={{ color: 'gray' }}>No classes yet.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {classes.map(cls => (
                                <li key={cls.id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            {editingClass?.id === cls.id ? (
                                                <form onSubmit={updateClass} style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input
                                                        className="input"
                                                        style={{ padding: '0.25rem 0.5rem' }}
                                                        value={editingClass.name}
                                                        onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                                                        autoFocus
                                                    />
                                                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>💾</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                        onClick={() => setEditingClass(null)}
                                                    >❌</button>
                                                </form>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <strong style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>{cls.name}</strong>
                                                    <button
                                                        onClick={() => setEditingClass({ id: cls.id, name: cls.name })}
                                                        style={{
                                                            background: 'var(--color-bg)',
                                                            border: '2px solid var(--color-text)',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                            padding: '0.25rem 0.5rem',
                                                            opacity: 0.7,
                                                            transition: 'opacity 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                                                        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                                                        title="Rename Class"
                                                    >
                                                        ✏️
                                                    </button>
                                                </div>
                                            )}
                                            <div style={{ fontSize: '0.8rem', color: 'gray', marginTop: '0.2rem' }}>
                                                Code: <span style={{ fontFamily: 'monospace', background: '#eee', padding: '2px 4px', borderRadius: '4px' }}>{cls.join_code}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 2vw, 0.8rem)', whiteSpace: 'nowrap' }}
                                                onClick={() => setViewingRoster(viewingRoster === cls.id ? null : cls.id)}
                                            >
                                                {viewingRoster === cls.id ? 'Close Gradebook' : 'Gradebook'}
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 2vw, 0.8rem)', whiteSpace: 'nowrap' }}
                                                onClick={() => setViewingCurriculum(viewingCurriculum === cls.id ? null : cls.id)}
                                            >
                                                {viewingCurriculum === cls.id ? 'Close Library' : 'Curriculum'}
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 2vw, 0.8rem)', whiteSpace: 'nowrap' }}
                                                onClick={() => setActiveClass(activeClass === cls.id ? null : cls.id)}
                                            >
                                                {activeClass === cls.id ? 'Close' : 'AI Generator'}
                                            </button>
                                        </div>
                                    </div>
                                    {viewingRoster === cls.id && (
                                        <ClassRoster
                                            classId={cls.id}
                                            onClose={() => setViewingRoster(null)}
                                        />
                                    )}
                                    {viewingCurriculum === cls.id && (
                                        <CurriculumLibrary
                                            classId={cls.id}
                                            onClose={() => setViewingCurriculum(null)}
                                        />
                                    )}
                                    {activeClass === cls.id && (
                                        <CreateAssignment
                                            classId={cls.id}
                                            onClose={() => setActiveClass(null)}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
