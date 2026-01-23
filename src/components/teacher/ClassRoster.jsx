import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ClassRoster = ({ classId, onClose }) => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [addEmail, setAddEmail] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);

    useEffect(() => {
        fetchData();
    }, [classId]);

    const fetchData = async () => {
        try {
            // 1. Get Students
            const { data: studentData, error: studentError } = await supabase
                .from('class_students')
                .select('student_id, profiles(first_name, last_name, email)')
                .eq('class_id', classId);

            if (studentError) throw studentError;

            // 2. Get Assignments
            const { data: assignData, error: assignError } = await supabase
                .from('assignments')
                .select('id, title')
                .eq('class_id', classId)
                .order('created_at', { ascending: true });

            if (assignError) throw assignError;

            // 3. Get Submissions for these assignments
            const assignIds = assignData.map(a => a.id);
            if (assignIds.length > 0) {
                const { data: subData, error: subError } = await supabase
                    .from('assignment_submissions')
                    .select('assignment_id, student_id, score')
                    .in('assignment_id', assignIds);

                if (subError) throw subError;
                setSubmissions(subData || []);
            }

            setStudents(studentData || []);
            setAssignments(assignData || []);

        } catch (error) {
            console.error('Error loading roster:', error);
            alert('Failed to load roster.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!addEmail.trim()) return;
        setAddingStudent(true);

        try {
            // 1. Find student by email
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', addEmail.trim())
                .eq('role', 'student')
                .single();

            if (profileError || !profiles) {
                alert('Student not found with that email. Make sure they have a student account.');
                setAddingStudent(false);
                return;
            }

            // 2. Add to class
            const { error: enrollError } = await supabase
                .from('class_students')
                .insert([{
                    class_id: classId,
                    student_id: profiles.id
                }]);

            if (enrollError) {
                if (enrollError.code === '23505') { // Unique violation
                    alert('Student is already enrolled in this class.');
                } else {
                    throw enrollError;
                }
            } else {
                alert('Student added successfully!');
                setAddEmail('');
                fetchData(); // Refresh list
            }

        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student. Please try again.');
        } finally {
            setAddingStudent(false);
        }
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

            {/* Add Student Form */}
            <form onSubmit={handleAddStudent} style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: '8px',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1 }}>
                    <input
                        type="email"
                        placeholder="Enter student email to enroll..."
                        value={addEmail}
                        onChange={(e) => setAddEmail(e.target.value)}
                        className="input"
                        style={{ width: '100%' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={addingStudent}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {addingStudent ? 'Adding...' : '➕ Add Student'}
                </button>
            </form>

            {loading ? <p>Loading data...</p> : students.length === 0 ? (
                <p>No students enrolled yet. Share the code!</p>
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
