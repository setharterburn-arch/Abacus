import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Video Player Component
 * Displays math tutorial videos with title, description, and controls
 */
const VideoPlayer = ({ title, description, videoSrc, transcript }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ marginBottom: '2rem' }}
        >
            {/* Title */}
            <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
                color: 'var(--color-primary)'
            }}>
                {title}
            </h3>

            {/* Description */}
            <p style={{
                color: 'var(--color-text-muted)',
                marginBottom: '1rem',
                fontSize: '0.95rem'
            }}>
                {description}
            </p>

            {/* Video Player */}
            <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '3px solid var(--color-text)',
                boxShadow: '6px 6px 0 var(--color-text)',
                marginBottom: '1rem'
            }}>
                <video
                    ref={videoRef}
                    src={videoSrc}
                    style={{
                        width: '100%',
                        display: 'block',
                        background: '#000'
                    }}
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>

            {/* Transcript Toggle */}
            {transcript && (
                <>
                    <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="btn"
                        style={{ marginBottom: '1rem' }}
                    >
                        {showTranscript ? 'Hide' : 'Show'} Transcript 📝
                    </button>

                    {showTranscript && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            style={{
                                padding: '1rem',
                                background: 'var(--color-bg)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                color: 'var(--color-text-muted)'
                            }}
                        >
                            {transcript}
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default VideoPlayer;
