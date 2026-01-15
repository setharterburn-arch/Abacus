import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { ProfessorAbacus } from '../lesson/LessonAssets';

const AbacusWidget = () => {
    const { isOpen, toggleChat, messages, sendMessage, isLoading, voiceEnabled, setVoiceEnabled } = useChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        style={{
                            width: '350px',
                            height: '500px',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '4px solid #f59e0b'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1rem', background: '#f59e0b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'white' }}>
                                    <img src="/abacus_lion.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <strong>Professor Abacus</strong>
                            </div>
                            <button
                                onClick={() => setVoiceEnabled(!voiceEnabled)}
                                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                            >
                                {voiceEnabled ? '🔊' : '🔇'}
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#fffbeb' }}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '15px',
                                        background: msg.sender === 'user' ? '#3b82f6' : 'white',
                                        color: msg.sender === 'user' ? 'white' : '#1f2937',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        borderBottomRightRadius: msg.sender === 'user' ? '5px' : '15px',
                                        borderBottomLeftRadius: msg.sender === 'user' ? '15px' : '5px'
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ textAlign: 'left', color: '#6b7280', fontStyle: 'italic', marginLeft: '1rem' }}>
                                    Abacus is thinking... 🦁
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask a math question..."
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '50px', border: '1px solid #d1d5db', outline: 'none' }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary"
                                style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                ➤
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button (The Face) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                style={{
                    width: '70px', height: '70px',
                    borderRadius: '50%',
                    background: 'white',
                    border: '4px solid #f59e0b',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                    cursor: 'pointer',
                    padding: 0,
                    overflow: 'hidden'
                }}
            >
                <img
                    src="/logo.jpg"
                    alt="Chat"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </motion.button>
        </div>
    );
};

export default AbacusWidget;
