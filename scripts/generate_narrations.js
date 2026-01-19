import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coqui TTS server URL
const COQUI_URL = 'http://51.81.203.89:5000';

// Narration scripts for interactive lessons
const narrations = {
    addition: {
        intro: "Hello young mathematicians! Today we're learning addition.",
        problem: "Let's solve: What is 2 plus 3?",
        first: "First, let's count 2 apples. Click each one!",
        second: "Great! Now let's add 3 more apples. Click them too!",
        question: "How many apples do we have in total?",
        correct: "Excellent! 2 plus 3 equals 5. You did it!",
        wrong: "Not quite. Try counting all the apples together.",
        celebration: "Great job! You've mastered addition!"
    },
    subtraction: {
        intro: "Welcome! Today we're learning subtraction.",
        problem: "Let's solve: What is 5 minus 2?",
        first: "We start with 5 apples. Count them by clicking!",
        second: "Now we take away 2 apples. Click 2 to remove them.",
        question: "How many apples are left?",
        correct: "Perfect! 5 minus 2 equals 3. Well done!",
        wrong: "Try again. Count the apples that are left.",
        celebration: "Amazing! You understand subtraction!"
    },
    multiplication: {
        intro: "Hello! Let's learn multiplication together.",
        problem: "What is 3 times 2?",
        first: "Multiplication means groups of. We need 3 groups.",
        second: "Each group has 2 dots. Click to count them!",
        question: "How many dots in total?",
        correct: "Wonderful! 3 times 2 equals 6. Great work!",
        wrong: "Count all the dots in all the groups.",
        celebration: "You're a multiplication master!"
    }
};

async function generateNarration(text, filename) {
    console.log(`Generating: ${filename}...`);

    const response = await fetch(`${COQUI_URL}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error(`Coqui TTS API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(filename, Buffer.from(audioBuffer));
    console.log(`✅ ${path.basename(filename)}`);
}

async function main() {
    const audioDir = path.join(__dirname, '../public/audio/narrations');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    console.log('🎙️  Generating narrations with Coqui TTS...\n');

    // Generate all narrations
    for (const [lesson, texts] of Object.entries(narrations)) {
        console.log(`\n📚 ${lesson.toUpperCase()}`);
        const lessonDir = path.join(audioDir, lesson);
        if (!fs.existsSync(lessonDir)) {
            fs.mkdirSync(lessonDir, { recursive: true });
        }

        for (const [key, text] of Object.entries(texts)) {
            const filename = path.join(lessonDir, `${key}.wav`);
            await generateNarration(text, filename);
        }
    }

    console.log('\n✅ All narrations generated!');
    console.log('💰 Total cost: $0 (Coqui TTS is free!)');
    console.log(`📁 Saved to: ${audioDir}`);
}

main().catch(console.error);
