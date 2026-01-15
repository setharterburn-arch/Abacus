import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../services/store';
import { supabase } from '../services/supabase';
import curriculumData from '../data/curriculum.json';

const Admin = () => {
    const { state } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state.loading && state.profile?.role !== 'admin') {
            navigate('/dashboard');
        }
        loadAdminData();
    }, [state.profile, state.loading, navigate]);

    const loadAdminData = async () => {
        setLoading(true);
        try {
            // Load all teachers
            const { data: teachersData } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'teacher')
                .order('created_at', { ascending: false });
            setTeachers(teachersData || []);

            // Load all students
            const { data: studentsData } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('created_at', { ascending: false });
            setStudents(studentsData || []);

            // Load all feedback
            const { data: feedbackData } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });
            setFeedback(feedbackData || []);

            // Load all assignments
            const { data: assignmentsData } = await supabase
                .from('assignments')
                .select('*, classes(name)')
                .order('created_at', { ascending: false });
            setAssignments(assignmentsData || []);

            // Load all submissions
            const { data: submissionsData } = await supabase
                .from('assignment_submissions')
                .select('*, profiles(first_name, last_name, email)')
                .order('created_at', { ascending: false });
            setSubmissions(submissionsData || []);

        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateFeedbackStatus = async (id, status) => {
        try {
            await supabase
                .from('feedback')
                .update({ status })
                .eq('id', id);
            await loadAdminData();
        } catch (error) {
            console.error('Error updating feedback:', error);
        }
    };

    if (loading) {
        return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1400px' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0' }}>🎓 Admin Dashboard</h1>
                <p style={{ color: 'gray', margin: 0 }}>Manage users, curriculum, grades, and feedback</p>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['overview', 'teachers', 'students', 'curriculum', 'grades', 'feedback'].map(tab => (
                    <button
                        key={tab}
                        className={`btn ${activeTab === tab ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--color-primary)' }}>{teachers.length}</h2>
                        <p style={{ margin: 0, color: 'gray' }}>Teachers</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👨‍🎓</div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--color-primary)' }}>{students.length}</h2>
                        <p style={{ margin: 0, color: 'gray' }}>Students</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📚</div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--color-primary)' }}>{curriculumData.length}</h2>
                        <p style={{ margin: 0, color: 'gray' }}>Curriculum Sets</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--color-primary)' }}>{assignments.length}</h2>
                        <p style={{ margin: 0, color: 'gray' }}>Assignments</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--color-primary)' }}>{submissions.length}</h2>
                        <p style={{ margin: 0, color: 'gray' }}>Submissions</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--color-primary)' }}>{feedback.length}</h2>
                        <p style={{ margin: 0, color: 'gray' }}>Feedback Items</p>
                    </div>
                </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Teachers ({teachers.length})</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {teachers.map(teacher => (
                            <div key={teacher.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{teacher.first_name} {teacher.last_name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'gray' }}>{teacher.email}</p>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'gray' }}>
                                            Joined: {new Date(teacher.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {teachers.length === 0 && <p style={{ color: 'gray' }}>No teachers yet.</p>}
                    </div>
                </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Students ({students.length})</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {students.map(student => (
                            <div key={student.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{student.first_name} {student.last_name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'gray' }}>{student.email}</p>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                            <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                                                Grade {student.grade_level}
                                            </span>
                                            <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                                                {submissions.filter(s => s.student_id === student.id).length} submissions
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && <p style={{ color: 'gray' }}>No students yet.</p>}
                    </div>
                </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Curriculum Library ({curriculumData.length} sets)</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {curriculumData.slice(0, 20).map(set => (
                            <div key={set.id} className="card">
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{set.title}</h4>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'gray' }}>{set.description}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '0.75rem' }}>
                                        Grade {set.grade_level === 0 ? 'K' : set.grade_level}
                                    </span>
                                    <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2', fontSize: '0.75rem' }}>
                                        {set.topic}
                                    </span>
                                    <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem' }}>
                                        {set.questions.length} questions
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {curriculumData.length > 20 && (
                        <p style={{ marginTop: '1rem', color: 'gray', textAlign: 'center' }}>
                            Showing first 20 of {curriculumData.length} sets
                        </p>
                    )}
                </div>
            )}

            {/* Grades Tab */}
            {activeTab === 'grades' && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Recent Submissions ({submissions.length})</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {submissions.slice(0, 50).map(sub => (
                            <div key={sub.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>
                                            {sub.profiles?.first_name} {sub.profiles?.last_name}
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'gray' }}>
                                            {sub.profiles?.email}
                                        </p>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'gray' }}>
                                            Submitted: {new Date(sub.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            color: sub.score >= 80 ? '#10b981' : sub.score >= 60 ? '#f59e0b' : '#ef4444'
                                        }}>
                                            {sub.score}%
                                        </div>
                                        <span className="badge" style={{
                                            background: sub.status === 'graded' ? '#e8f5e9' : '#fff3e0',
                                            color: sub.status === 'graded' ? '#2e7d32' : '#e65100'
                                        }}>
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {submissions.length === 0 && <p style={{ color: 'gray' }}>No submissions yet.</p>}
                    </div>
                </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Teacher Feedback ({feedback.length})</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {feedback.map(item => (
                            <div key={item.id} className="card">
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.subject}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'gray' }}>
                                                From: {item.user_name} ({item.user_email})
                                            </p>
                                        </div>
                                        <span className="badge" style={{
                                            background: item.category === 'bug' ? '#ffebee' : item.category === 'feature' ? '#e3f2fd' : '#f3e5f5',
                                            color: item.category === 'bug' ? '#c62828' : item.category === 'feature' ? '#1565c0' : '#7b1fa2'
                                        }}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'gray' }}>
                                        {new Date(item.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['new', 'reviewed', 'in-progress', 'resolved'].map(status => (
                                        <button
                                            key={status}
                                            className={`btn ${item.status === status ? 'btn-primary' : ''}`}
                                            onClick={() => updateFeedbackStatus(item.id, status)}
                                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', textTransform: 'capitalize' }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {feedback.length === 0 && <p style={{ color: 'gray' }}>No feedback yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
