import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import AssignmentRunner from '../components/student/AssignmentRunner';

const StudentDashboard = ({ profile }) => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState({}); // { assignment_id: score }
    const [joinCode, setJoinCode] = useState('');
    const [activeAssignment, setActiveAssignment] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        // 1. Get enrolled classes
        const { data: enrollments } = await supabase
            .from('class_students')
            .select('class_id')
            .eq('student_id', profile.id);

        const classIds = enrollments?.map(e => e.class_id) || [];

        if (classIds.length === 0) {
            setAssignments([]);
            return;
        }

        // 2. Get assignments for those classes
        const { data: assignmentData } = await supabase
            .from('assignments')
            .select('*, classes(name)')
            .in('class_id', classIds)
            .order('created_at', { ascending: false });

        setAssignments(assignmentData || []);

        // 3. Get my submissions to check status
        const { data: subData } = await supabase
            .from('assignment_submissions')
            .select('assignment_id, score, status')
            .eq('student_id', profile.id);

        const subMap = {};
        subData?.forEach(s => subMap[s.assignment_id] = s);
        setSubmissions(subMap);
    };

    const joinClass = async (e) => {
        e.preventDefault();
        try {
            // Find class by code
            const { data: classData, error: classError } = await supabase
                .from('classes')
                .select('id')
                .eq('join_code', joinCode.toUpperCase())
                .single();

            if (classError || !classData) throw new Error('Invalid code');

            // Enroll
            const { error: enrollError } = await supabase
                .from('class_students')
                .insert([{ class_id: classData.id, student_id: profile.id }]);

            if (enrollError) {
                if (enrollError.code === '23505') throw new Error('Already enrolled!'); // unique violation
                throw enrollError;
            }

            alert('Joined class successfully! 🎉');
            setJoinCode('');
            fetchAssignments(); // Refresh list
        } catch (error) {
            alert(error.message);
        }
    };

    if (activeAssignment) {
        return (
            <AssignmentRunner
                assignment={activeAssignment}
                studentId={profile.id}
                onClose={() => {
                    setActiveAssignment(null);
                    fetchAssignments();
                }}
            />
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--color-primary)' }}>Student Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Ready to learn, {profile.first_name}?</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <strong>Grade {profile.grade_level}</strong>
                </div>
            </header>

            <div style={{ display: 'grid', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3>Join a Class</h3>
                    <form onSubmit={joinClass} style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <input
                            className="input"
                            placeholder="Enter 6-char Code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                        />
                        <button className="btn btn-primary">Join</button>
                    </form>
                </div>
            </div>

            <div>
                <h2>My Assignments 📚</h2>
                {assignments.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>No assignments yet! 🎉</p>
                        <p style={{ color: 'gray' }}>Ask your teacher for a code.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        {assignments.map(assign => {
                            const submission = submissions[assign.id];
                            const isComplete = !!submission;

                            return (
                                <div key={assign.id} className="card" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderLeft: `4px solid ${isComplete ? 'green' : 'var(--color-primary)'}`,
                                    opacity: isComplete ? 0.8 : 1
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'gray', marginBottom: '0.2rem' }}>
                                            {assign.classes?.name}
                                        </div>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{assign.title}</h3>
                                        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{assign.description}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {isComplete ? (
                                            <div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'green' }}>
                                                    {submission.score}%
                                                </div>
                                                <small>Completed</small>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setActiveAssignment(assign)}
                                            >
                                                Start
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
