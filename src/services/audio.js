import { Howl } from 'howler';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
// Voice Options:
// Antoni (Friendly Male): 'ErXwobaYiN019PkySvjV'
// Rachel (Clear Female): '21m00Tcm4TlvDq8ikWAM'
// Domi (Energetic Female): 'AZnzlk1XvdvUeBnXmlld'
// Josh (Deep Male): 'TxGEqnHWrfWFTfGW9XjX'
const VOICE_ID = 'ErXwobaYiN019PkySvjV';

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
            console.log(`[Audio] Generating speech with key: ${ELEVENLABS_API_KEY?.substring(0, 5)}...`);

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
                        model_id: "eleven_multilingual_v2", // Better pacing/emotion
                        voice_settings: {
                            stability: 0.8, // Higher = more consistent/stable (often slower/clearer)
                            similarity_boost: 0.5,
                            style: 0.0, // Keeping it neutral/calm
                            use_speaker_boost: true
                        }
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[Audio] ElevenLabs API Error:', response.status, errorData);
                throw new Error(`ElevenLabs API failed: ${response.status} - ${JSON.stringify(errorData)}`);
            }

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
            console.error("[Audio] Fallback to TTS due to:", error);
            // Fallback to browser TTS if API fails/quota exceeded
            const utterance = new SpeechSynthesisUtterance(text);
            // Try to make the fallback voice slightly better
            const voices = window.speechSynthesis.getVoices();
            // Try to find a google or english female voice
            const preferredVoice = voices.find(v => v.name.includes('Google') && v.name.includes('English')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    }

    cleanup() {
        this.sounds.ambience.stop();
        if (this.currentSpeech) this.currentSpeech.stop();
    }
}

export const audioManager = new AudioManager();
