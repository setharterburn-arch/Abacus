import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

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
    console.log(`Generating voiceover for ${path.basename(outputPath)}...`);

    const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', // Rachel voice
        {
            method: 'POST',
            headers: {
                'xi-api-key': process.env.VITE_ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: script,
                model_id: 'eleven_turbo_v2_5',
                voice_settings: {
                    stability: 0.75,
                    similarity_boost: 0.75
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    console.log(`✅ Voiceover saved to ${outputPath}`);
}

async function main() {
    const audioDir = path.join(__dirname, 'audio');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    // Generate voiceovers
    await generateVoiceover(scripts.addition, path.join(audioDir, 'addition_narration.mp3'));
    await generateVoiceover(scripts.multiplication, path.join(audioDir, 'multiplication_narration.mp3'));

    console.log('\n✅ All voiceovers generated!');
    console.log('Next step: Run ./combine_audio_video.sh to merge with videos');
}

main().catch(console.error);
