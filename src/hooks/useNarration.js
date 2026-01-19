import { useEffect, useRef } from 'react';

/**
 * Hook to play audio narration from Coqui TTS
 * @param {string} text - Text to convert to speech
 * @param {boolean} shouldPlay - Whether to play the audio
 * @param {function} onEnd - Callback when audio finishes
 */
export const useNarration = (text, shouldPlay = false, onEnd = null) => {
    const audioRef = useRef(null);
    const audioUrlRef = useRef(null);

    useEffect(() => {
        if (!text || !shouldPlay) return;

        const playNarration = async () => {
            try {
                // Generate audio from Coqui TTS
                const response = await fetch('http://51.81.203.89:5000/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text })
                });

                if (!response.ok) {
                    console.error('Failed to generate narration');
                    return;
                }

                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                audioUrlRef.current = audioUrl;

                // Create and play audio
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onended = () => {
                    if (onEnd) onEnd();
                };

                audio.play();
            } catch (error) {
                console.error('Error playing narration:', error);
            }
        };

        playNarration();

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
                audioUrlRef.current = null;
            }
        };
    }, [text, shouldPlay, onEnd]);

    return audioRef;
};

export default useNarration;
