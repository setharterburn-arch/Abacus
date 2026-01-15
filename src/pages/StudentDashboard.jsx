import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { getCurriculumSets } from '../services/database';
import { Link } from 'react-router-dom';

const StudentDashboard = ({ profile }) => {
    const [assignments, setAssignments] = useState([]);
    const [joinCode, setJoinCode] = useState('');

    useEffect(() => {
        // Load default assignments for now
        // TODO: Load assigned homework from 'class_students' -> 'classes' relationship
        const load = async () => {
            const sets = await getCurriculumSets('assigned');
            setAssignments(sets);
        };
        load();
    }, []);

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
        } catch (error) {
            alert(error.message);
        }
    };

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
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                    {assignments.map(set => (
                        <div key={set.id} className="card" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: '4px solid var(--color-primary)'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{set.title}</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{set.description}</p>
                            </div>
                            <Link to="/test" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                Start
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
