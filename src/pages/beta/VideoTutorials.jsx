import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoPlayer from '../../components/video/VideoPlayer';

const VideoTutorials = () => {
    const navigate = useNavigate();

    const tutorials = [
        {
            id: 'test',
            title: '➕ Addition Test (Coqui TTS)',
            description: 'Test video with FREE Coqui TTS voiceover - Learn addition with visual counting!',
            videoSrc: '/videos/test_video.mp4',
            transcript: `This is a test video using Coqui TTS (free, self-hosted voice generation). In this tutorial, we learn what 2 + 3 equals. We start by showing 2 apples, then add 3 more apples. By counting all the apples together (1, 2, 3, 4, 5), we discover that 2 + 3 = 5! Voice generated using our own VPS server at $0 cost.`,
            grade: 'K-1',
            voiceProvider: 'Coqui TTS (Free)'
        }
    ];

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                padding: '3rem 2rem',
                textAlign: 'center',
                borderBottom: '3px solid var(--color-text)'
            }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            marginBottom: '1rem',
                            color: 'var(--color-text)'
                        }}
                    >
                        📹 Video Tutorials (Beta)
                    </motion.h1>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '1.2rem',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Math concepts explained with beautiful animations!
                    </motion.p>
                </div>
            </div>

            <div className="container" style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
                {/* Back button */}
                <button
                    onClick={() => navigate('/beta')}
                    className="btn"
                    style={{ marginBottom: '2rem' }}
                >
                    ← Back to Beta Features
                </button>

                {/* Info Card */}
                <div className="card" style={{ marginBottom: '2rem', background: '#e3f2fd' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1565c0' }}>🧪 Beta Testing</h3>
                    <p style={{ marginBottom: '0.5rem', color: '#555' }}>
                        These videos are generated using <strong>Manim</strong>, a free Python library for creating mathematical animations.
                    </p>
                    <p style={{ color: '#555' }}>
                        <strong>Please provide feedback:</strong> Are the animations clear? Is the pacing good? What would you improve?
                    </p>
                </div>

                {/* Tutorial Videos */}
                <div>
                    {tutorials.map((tutorial, idx) => (
                        <motion.div
                            key={tutorial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <span className="badge" style={{
                                    background: 'var(--color-secondary)',
                                    color: 'white',
                                    padding: '0.5rem 1rem'
                                }}>
                                    Grade {tutorial.grade}
                                </span>
                            </div>

                            <VideoPlayer
                                title={tutorial.title}
                                description={tutorial.description}
                                videoSrc={tutorial.videoSrc}
                                transcript={tutorial.transcript}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Feedback Section */}
                <div className="card" style={{ background: '#fff3e0', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#e65100' }}>💬 Share Your Feedback</h3>
                    <p style={{ marginBottom: '1rem', color: '#555' }}>
                        Help us improve! Let us know:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
                        <li>Are the animations easy to follow?</li>
                        <li>Is the pacing too fast or too slow?</li>
                        <li>What topics would you like to see next?</li>
                        <li>Any technical issues with playback?</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VideoTutorials;
