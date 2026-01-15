import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../services/store';
import { chatWithTutor } from '../../services/ai';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa'; // Assuming react-icons is installed

const ChatInterface = () => {
    const { state } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hi! I'm your math tutor. Stuck on a problem? Ask me! 👋" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // Context: User info and current homework
            const context = {
                studentName: state.user?.name,
                grade: state.user?.grade,
                currentHomework: state.homework
            };

            const response = await chatWithTutor(messages, userMsg, context);
            setMessages(prev => [...prev, { role: 'model', content: response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Oops! I'm having trouble thinking right now. Try again?" }]);
        } finally {
            setLoading(false);
        }
    };

    // Only show if user is logged in
    if (!state.user) return null;

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        boxShadow: 'var(--shadow-lg)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        zIndex: 1000,
                        transition: 'transform 0.2s'
                    }}
                    className="chat-fab"
                >
                    <FaRobot />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaRobot />
                            <span style={{ fontWeight: 'bold' }}>Math Tutor</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        backgroundColor: '#f8fafc'
                    }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'white',
                                    color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                                    borderBottomLeftRadius: msg.role === 'model' ? '0' : '1rem',
                                    maxWidth: '80%',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4'
                                }}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '1rem', color: '#888' }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{
                        padding: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: (loading || !input.trim()) ? 0.5 : 1
                            }}
                        >
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatInterface;
