import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ClassRoster = ({ classId, onClose }) => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [addName, setAddName] = useState({ first: '', last: '' });
    const [pendingStudents, setPendingStudents] = useState([]);
    const [addingStudent, setAddingStudent] = useState(false);

    useEffect(() => {
        fetchData();
    }, [classId]);

    const fetchData = async () => {
        try {
            // 1. Get Enrolled Students
            const { data: studentData, error: studentError } = await supabase
                .from('class_students')
                .select('student_id, profiles(first_name, last_name, email)')
                .eq('class_id', classId);

            if (studentError) throw studentError;

            // 2. Get Pending Students
            const { data: pendingData, error: pendingError } = await supabase
                .from('pending_students')
                .select('*')
                .eq('class_id', classId)
                .order('created_at', { ascending: false });

            if (pendingError && pendingError.code !== '42P01') { // Ignore "table does not exist" error if migration hasn't run
                console.error("Pending fetch error:", pendingError);
            }

            // 3. Get Assignments & Submissions (Existing logic)
            const { data: assignData, error: assignError } = await supabase
                .from('assignments')
                .select('id, title')
                .eq('class_id', classId)
                .order('created_at', { ascending: true });

            if (assignError) throw assignError;

            const assignIds = assignData?.map(a => a.id) || [];
            let subData = [];
            if (assignIds.length > 0) {
                const { data, error } = await supabase
                    .from('assignment_submissions')
                    .select('assignment_id, student_id, score')
                    .in('assignment_id', assignIds);
                if (!error) subData = data;
            }

            setStudents(studentData || []);
            setPendingStudents(pendingData || []);
            setAssignments(assignData || []);
            setSubmissions(subData || []);

        } catch (error) {
            console.error('Error loading roster:', error);
            // Don't alert here to avoid spamming if just one part fails
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCode = async (e) => {
        e.preventDefault();
        if (!addName.first.trim() || !addName.last.trim()) return;
        setAddingStudent(true);

        try {
            // Generate 6-char code (Uppercase + Numbers, avoiding ambiguous O/0/I/1 if possible, but simple random is fine for this)
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            const { error } = await supabase
                .from('pending_students')
                .insert([{
                    class_id: classId,
                    first_name: addName.first.trim(),
                    last_name: addName.last.trim(),
                    access_code: code
                }]);

            if (error) throw error;

            setAddName({ first: '', last: '' });
            fetchData();
            alert(`Generated code for ${addName.first}: ${code}`);
        } catch (error) {
            console.error("Error creating pending student:", error);
            alert("Failed to generate code. Please try again.");
        } finally {
            setAddingStudent(false);
        }
    };

    const deletePending = async (id) => {
        if (!confirm('Remove this pending student?')) return;
        const { error } = await supabase.from('pending_students').delete().eq('id', id);
        if (!error) fetchData();
    };

    const getScore = (studentId, assignmentId) => {
        const sub = submissions.find(s => s.student_id === studentId && s.assignment_id === assignmentId);
        return sub ? `${sub.score}%` : '-';
    };

    return (
        <div className="card" style={{ marginTop: '1rem', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>📊 Gradebook</h3>
                <button className="btn" onClick={onClose} style={{ padding: '0.2rem 0.5rem' }}>Close</button>
            </div>

            {/* Add Student Section */}
            <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
            }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>👶 Add New Student</h4>
                <form onSubmit={handleGenerateCode} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        placeholder="First Name"
                        value={addName.first}
                        onChange={(e) => setAddName({ ...addName, first: e.target.value })}
                        className="input"
                        style={{ flex: 1 }}
                        required
                    />
                    <input
                        placeholder="Last Name"
                        value={addName.last}
                        onChange={(e) => setAddName({ ...addName, last: e.target.value })}
                        className="input"
                        style={{ flex: 1 }}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={addingStudent}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {addingStudent ? 'Generating...' : '🔑 Generate Code'}
                    </button>
                </form>
                <p style={{ fontSize: '0.8rem', color: '#0284c7', margin: '0.5rem 0 0 0' }}>
                    Create a unique code for a student. They will enter this code when they sign up to automatically join this class.
                </p>
            </div>

            {/* Pending Students List */}
            {pendingStudents.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--color-secondary)' }}>⏳ Pending Students (Not yet joined)</h4>
                    <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {pendingStudents.map(p => (
                            <div key={p.id} style={{
                                background: '#fff',
                                padding: '0.75rem',
                                border: '1px dashed var(--color-secondary)',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{p.first_name} {p.last_name}</div>
                                    <div style={{
                                        fontFamily: 'monospace',
                                        fontSize: '1.2rem',
                                        background: '#eee',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        marginTop: '4px',
                                        letterSpacing: '2px'
                                    }}>
                                        {p.access_code}
                                    </div>
                                </div>
                                <button onClick={() => deletePending(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: 0.5 }}>❌</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h4 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>✅ Enrolled Students</h4>
            {loading ? <p>Loading data...</p> : students.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: 'gray' }}>No active students. Add some above!</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '0.5rem' }}>Student</th>
                                {assignments.map(a => (
                                    <th key={a.id} style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>
                                        {a.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(({ student_id, profiles: p }) => (
                                <tr key={student_id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '0.5rem' }}>
                                        <strong>{p.first_name} {p.last_name}</strong>
                                        <div style={{ fontSize: '0.8rem', color: 'gray' }}>{p.email}</div>
                                    </td>
                                    {assignments.map(a => (
                                        <td key={a.id} style={{ padding: '0.5rem' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: getScore(student_id, a.id) === '-' ? '#eee' : '#e6f4ea',
                                                color: getScore(student_id, a.id) === '-' ? 'gray' : 'green',
                                                fontWeight: 'bold'
                                            }}>
                                                {getScore(student_id, a.id)}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClassRoster;
