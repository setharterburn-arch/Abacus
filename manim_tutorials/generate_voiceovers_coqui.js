import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coqui TTS server URL
const COQUI_URL = 'http://51.81.203.89:5000';

// Narration scripts for each video
const scripts = {
    addition: `Hello young mathematicians! Today we're going to learn about addition. 
  
  Let's solve the problem: What is 2 plus 3?
  
  First, let's look at 2 apples. Count them with me: one, two.
  
  Now, let's add 3 more apples. Here they are!
  
  To find the answer, we count all the apples together. Ready? Let's count: one, two, three, four, five!
  
  So 2 plus 3 equals 5. Great job! You just learned addition!`,

    multiplication: `Hello mathematicians! Today we're learning about multiplication.
  
  Let's solve: What is 3 times 4?
  
  Multiplication means "groups of." So 3 times 4 means 3 groups of 4.
  
  We can also think of it as repeated addition: 4 plus 4 plus 4.
  
  Let's visualize this with an array. We have 3 rows, and each row has 4 dots.
  
  Now let's count all the dots together: one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve!
  
  So 3 times 4 equals 12. Excellent work! You understand multiplication!`
};

async function generateVoiceover(script, outputPath) {
    console.log(`Generating voiceover for ${path.basename(outputPath)} using Coqui TTS...`);

    const response = await fetch(`${COQUI_URL}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: script })
    });

    if (!response.ok) {
        throw new Error(`Coqui TTS API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    console.log(`✅ Voiceover saved to ${outputPath}`);
}

async function main() {
    const audioDir = path.join(__dirname, 'audio_coqui');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    console.log('🎙️  Generating voiceovers with Coqui TTS (FREE!)...\n');

    // Generate voiceovers
    await generateVoiceover(scripts.addition, path.join(audioDir, 'addition_narration.wav'));
    await generateVoiceover(scripts.multiplication, path.join(audioDir, 'multiplication_narration.wav'));

    console.log('\n✅ All voiceovers generated with Coqui TTS!');
    console.log('💰 Cost: $0 (vs $0.50 with ElevenLabs)');
    console.log('\nNext step: Run ./combine_audio_video_coqui.sh to merge with videos');
}

main().catch(console.error);
