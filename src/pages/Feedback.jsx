import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useStore } from '../services/store';

const Feedback = () => {
    const { state } = useStore();
    const [category, setCategory] = useState('improvement');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            alert('Please fill in all fields');
            return;
        }

        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{
                    user_id: state.session?.user?.id,
                    user_email: state.session?.user?.email,
                    user_name: `${state.profile?.first_name} ${state.profile?.last_name}`,
                    category,
                    subject: subject.trim(),
                    message: message.trim()
                }]);

            if (error) throw error;

            setSubmitted(true);
            setSubject('');
            setMessage('');
            setCategory('improvement');

            // Reset submitted state after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);

        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0' }}>💬 Feedback</h1>
                <p style={{ color: 'gray', margin: 0 }}>
                    Help us improve Abacus! Share your ideas, report bugs, or suggest new features.
                </p>
            </header>

            {submitted && (
                <div className="card" style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    marginBottom: '2rem',
                    border: 'none'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>✅</span>
                        <div>
                            <h3 style={{ margin: '0 0 0.25rem 0' }}>Thank you!</h3>
                            <p style={{ margin: 0, opacity: 0.9 }}>
                                Your feedback has been submitted. We'll review it soon!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    {/* Category */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Category
                        </label>
                        <select
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="improvement">💡 Improvement Suggestion</option>
                            <option value="feature">✨ Feature Request</option>
                            <option value="bug">🐛 Bug Report</option>
                            <option value="content">📚 Content Request</option>
                            <option value="other">💬 Other</option>
                        </select>
                    </div>

                    {/* Subject */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Subject
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Brief description of your feedback"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            maxLength={200}
                        />
                        <small style={{ color: 'gray' }}>
                            {subject.length}/200 characters
                        </small>
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Details
                        </label>
                        <textarea
                            className="input"
                            placeholder="Please provide as much detail as possible..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={8}
                            maxLength={2000}
                            style={{ resize: 'vertical', minHeight: '150px' }}
                        />
                        <small style={{ color: 'gray' }}>
                            {message.length}/2000 characters
                        </small>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                    >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>

            {/* Info Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
            }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Suggestions</h4>
                    <p style={{ fontSize: '0.85rem', color: 'gray', margin: 0 }}>
                        Share ideas to improve the platform
                    </p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐛</div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Bug Reports</h4>
                    <p style={{ fontSize: '0.85rem', color: 'gray', margin: 0 }}>
                        Help us fix issues you encounter
                    </p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>New Features</h4>
                    <p style={{ fontSize: '0.85rem', color: 'gray', margin: 0 }}>
                        Request features you'd like to see
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
