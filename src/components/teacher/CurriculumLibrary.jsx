import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { getCurriculumSets } from '../../services/database';
import learningPaths from '../../data/learning_paths.json';
import AssignmentModal from './AssignmentModal';

const CurriculumLibrary = ({ classId, onClose }) => {
    const [selectedGrade, setSelectedGrade] = useState(2);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('curriculum');
    const [assignmentModal, setAssignmentModal] = useState(null);
    const [classStudents, setClassStudents] = useState([]);

    // Dynamic loading state
    const [curriculumData, setCurriculumData] = useState([]);
    const [loadingCurriculum, setLoadingCurriculum] = useState(true);

    useEffect(() => {
        loadClassStudents();
        loadCurriculum();
    }, [classId]);

    const loadCurriculum = async () => {
        setLoadingCurriculum(true);
        try {
            const data = await getCurriculumSets();
            setCurriculumData(data || []);
        } catch (error) {
            console.error("Failed to load curriculum:", error);
        } finally {
            setLoadingCurriculum(false);
        }
    };

    const loadClassStudents = async () => {
        try {
            const { data, error } = await supabase
                .from('class_students')
                .select(`
                    student_id,
                    profiles:student_id (
                        id,
                        first_name,
                        last_name,
                        email
                    )
                `)
                .eq('class_id', classId);

            if (error) throw error;
            setClassStudents(data?.map(cs => cs.profiles) || []);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    };

    const openAssignModal = (content, type) => {
        setAssignmentModal({ content, type });
    };

    const handleAssigned = (count) => {
        alert(`Successfully assigned to ${count} student${count !== 1 ? 's' : ''}!`);
        setAssignmentModal(null);
    };

    // Handle both 'grade' (Supabase) and 'grade_level' (Legacy JSON)
    // Ensure comparison handles string/number mismatch (Supabase returns strings)
    const setGrade = set.grade !== undefined ? set.grade : set.grade_level;
    const matchesGrade = String(setGrade) === String(selectedGrade);
    const matchesSearch = set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (set.topic && set.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (set.description && set.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
});

// Filter learning paths
const filteredPaths = learningPaths.filter(path => {
    const matchesGrade = path.grade_level === selectedGrade;
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
});

return (
    <>
        <div className="card" style={{ marginTop: '1rem', border: '2px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>📚 Curriculum Library</h3>
                <button className="btn" onClick={onClose}>Close</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-text)' }}>
                <button
                    onClick={() => setActiveTab('curriculum')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'curriculum' ? '3px solid var(--color-primary)' : 'none',
                        color: activeTab === 'curriculum' ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '-2px'
                    }}
                >
                    📚 Curriculum Sets ({filteredCurriculum.length})
                </button>
                <button
                    onClick={() => setActiveTab('paths')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'paths' ? '3px solid var(--color-primary)' : 'none',
                        color: activeTab === 'paths' ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '-2px'
                    }}
                >
                    🎯 Learning Paths ({filteredPaths.length})
                </button>
            </div>

            {/* Grade Level */}
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Grade Level
                </label>
                <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid var(--color-text)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem'
                    }}
                >
                    <option value={0}>Kindergarten</option>
                    <option value={1}>Grade 1</option>
                    <option value={2}>Grade 2</option>
                    <option value={3}>Grade 3</option>
                    <option value={4}>Grade 4</option>
                    <option value={5}>Grade 5</option>
                    <option value={6}>Grade 6</option>
                    <option value={7}>Grade 7</option>
                    <option value={8}>Grade 8</option>
                    <option value={9}>Grade 9</option>
                </select>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Search
                </label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by topic or title..."
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid var(--color-text)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem'
                    }}
                />
            </div>

            <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                Showing {activeTab === 'curriculum' ? filteredCurriculum.length : filteredPaths.length} {activeTab === 'curriculum' ? 'curriculum sets' : 'learning paths'}
            </p>

            {/* Content List */}
            <div key={activeTab} style={{ maxHeight: '400px', overflow: 'auto' }}>
                {activeTab === 'curriculum' ? (
                    filteredCurriculum.map((set, idx) => (
                        <div
                            key={set.id}
                            className="card"
                            style={{
                                marginBottom: '0.75rem',
                                padding: '1rem',
                                background: 'var(--color-bg)',
                                border: '1px solid var(--color-text)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{set.title}</h4>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {set.description}
                                    </p>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        <span className="badge" style={{ marginRight: '0.5rem' }}>{set.topic}</span>
                                        <span>{set.questions.length} questions</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openAssignModal(set, 'curriculum_set')}
                                    className="btn btn-primary"
                                    style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}
                                >
                                    📋 Assign
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    filteredPaths.map((path, idx) => (
                        <div
                            key={path.id}
                            className="card"
                            style={{
                                marginBottom: '0.75rem',
                                padding: '1rem',
                                background: 'var(--color-bg)',
                                border: '1px solid var(--color-text)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{path.title}</h4>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {path.description}
                                    </p>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        <span>{path.modules.length} modules</span>
                                        <span style={{ margin: '0 0.5rem' }}>•</span>
                                        <span>~{path.estimated_time} min</span>
                                        <span style={{ margin: '0 0.5rem' }}>•</span>
                                        <span>{path.total_questions} questions</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openAssignModal(path, 'learning_path')}
                                    className="btn btn-primary"
                                    style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}
                                >
                                    📋 Assign
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {(activeTab === 'curriculum' ? filteredCurriculum : filteredPaths).length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    No {activeTab === 'curriculum' ? 'curriculum sets' : 'learning paths'} found.
                </p>
            )}
        </div>

        {/* Assignment Modal */}
        {assignmentModal && (
            <AssignmentModal
                content={assignmentModal.content}
                type={assignmentModal.type}
                classId={classId}
                students={classStudents}
                onClose={() => setAssignmentModal(null)}
                onAssigned={handleAssigned}
            />
        )}
    </>
);
};

export default CurriculumLibrary;
