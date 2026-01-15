import { Howl } from 'howler';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
// Professor Hoot's voice ID (using a popular pre-made one, e.g., 'Clyde' or similar friendly deep voice)
// You can change this ID. '21m00Tcm4TlvDq8ikWAM' is Rachel (default), let's find a better one or use a default.
// Using 'MF3mGyEYCl7XYWlgT9G0' (Callum - friendly guy) or just 'ErXwobaYiN019PkySvjV' (Antoni).
// Let's use 'FGY2WhTYq4u0I1O31p32' (Fin - energetic).
const VOICE_ID = 'FGY2WhTYq4u0I1O31p32';

class AudioManager {
    constructor() {
        this.cache = new Map();
        this.currentSpeech = null;
        this.sounds = {
            pop: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], volume: 0.5 }),
            success: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'], volume: 0.6 }), // Cheer
            ambience: new Howl({
                src: ['https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3'], // Birds/Nature
                loop: true,
                volume: 0.1
            })
        };
    }

    startAmbience() {
        if (!this.sounds.ambience.playing()) {
            this.sounds.ambience.play();
            this.sounds.ambience.fade(0, 0.1, 2000);
        }
    }

    playSfx(name) {
        if (this.sounds[name]) {
            this.sounds[name].play();
        }
    }

    async speak(text) {
        // Stop current speech
        if (this.currentSpeech) {
            this.currentSpeech.stop();
        }

        // Check cache
        if (this.cache.has(text)) {
            this.currentSpeech = this.cache.get(text);
            this.currentSpeech.play();
            return;
        }

        try {
            const response = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': ELEVENLABS_API_KEY,
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: "eleven_monolingual_v1",
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75,
                        }
                    }),
                }
            );

            if (!response.ok) throw new Error('Speech generation failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const sound = new Howl({
                src: [url],
                format: ['mp3'],
                html5: true,
                onend: () => {
                    // console.log('Speech finished');
                }
            });

            this.cache.set(text, sound);
            this.currentSpeech = sound;
            sound.play();

        } catch (error) {
            console.error("ElevenLabs Error:", error);
            // Fallback to browser TTS if API fails/quota exceeded
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    }

    cleanup() {
        this.sounds.ambience.stop();
        if (this.currentSpeech) this.currentSpeech.stop();
    }
}

export const audioManager = new AudioManager();
