import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

/**
 * Generate curriculum questions using Gemini AI
 * @param {string} topic - Math topic (e.g., "Addition", "Fractions")
 * @param {number} gradeLevel - Grade level (0-6)
 * @param {string} difficulty - "easy", "medium", or "hard"
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} Array of question objects
 */
export const generateCurriculumQuestions = async (topic, gradeLevel, difficulty, count = 10) => {
    if (!model) {
        throw new Error('Gemini API key not configured');
    }

    const gradeLabel = gradeLevel === 0 ? 'Kindergarten' : `Grade ${gradeLevel}`;

    const prompt = `You are a math curriculum expert. Generate ${count} multiple-choice math questions for ${gradeLabel} students.

Topic: ${topic}
Difficulty: ${difficulty}
Grade Level: ${gradeLabel}

For each question, provide:
1. A clear, age-appropriate question
2. Four answer options (one correct, three plausible distractors)
3. The correct answer
4. Three progressive hints (general → specific → strong nudge)
5. A brief explanation of the correct answer

Format your response as a JSON array with this structure:
[
  {
    "question": "What is 5 + 3?",
    "options": ["6", "7", "8", "9"],
    "answer": "8",
    "hints": [
      "Think about counting up from 5",
      "Try using your fingers to count: 5, then 3 more",
      "5 + 3 is the same as 5 + 2 + 1"
    ],
    "explanation": "When we add 5 + 3, we start at 5 and count up 3 more numbers: 6, 7, 8. So 5 + 3 = 8."
  }
]

Guidelines:
- Questions should be appropriate for ${gradeLabel}
- Use simple, clear language
- Avoid trick questions
- Make distractors plausible but clearly wrong
- Hints should progressively reveal more information
- Explanations should teach the concept, not just state the answer

Return ONLY the JSON array, no other text.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        const questions = JSON.parse(jsonMatch[0]);
        return questions;
    } catch (error) {
        console.error('Error generating curriculum:', error);
        throw error;
    }
};

/**
 * Generate a complete curriculum set
 * @param {string} title - Curriculum set title
 * @param {string} description - Brief description
 * @param {number} gradeLevel - Grade level (0-6)
 * @param {string} topic - Math topic
 * @param {string} difficulty - "easy", "medium", or "hard"
 * @param {number} questionCount - Number of questions
 * @returns {Promise<Object>} Complete curriculum set object
 */
export const generateCurriculumSet = async (title, description, gradeLevel, topic, difficulty, questionCount = 10) => {
    const questions = await generateCurriculumQuestions(topic, gradeLevel, difficulty, questionCount);

    const id = `${gradeLevel === 0 ? 'k' : `g${gradeLevel}`}-${topic.toLowerCase().replace(/\s+/g, '-')}-${difficulty}-${Date.now()}`;

    return {
        id,
        title,
        description,
        grade_level: gradeLevel,
        topic,
        difficulty,
        questions,
        generated: true,
        generated_at: new Date().toISOString()
    };
};

/**
 * Generate variations of existing curriculum
 * @param {Object} existingSet - Existing curriculum set
 * @param {number} variationCount - Number of variations to create
 * @returns {Promise<Array>} Array of new curriculum sets
 */
export const generateCurriculumVariations = async (existingSet, variationCount = 3) => {
    const variations = [];

    for (let i = 0; i < variationCount; i++) {
        const newSet = await generateCurriculumSet(
            `${existingSet.title} - Set ${i + 2}`,
            existingSet.description,
            existingSet.grade_level,
            existingSet.topic,
            existingSet.difficulty,
            existingSet.questions.length
        );
        variations.push(newSet);
    }

    return variations;
};

/**
 * Batch generate curriculum for multiple topics
 * @param {Array} topics - Array of {topic, gradeLevel, difficulty, count}
 * @returns {Promise<Array>} Array of curriculum sets
 */
export const batchGenerateCurriculum = async (topics) => {
    const sets = [];

    for (const config of topics) {
        try {
            const set = await generateCurriculumSet(
                config.title || `${config.topic} Practice`,
                config.description || `Practice ${config.topic} problems`,
                config.gradeLevel,
                config.topic,
                config.difficulty,
                config.questionCount || 10
            );
            sets.push(set);

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`Failed to generate ${config.topic}:`, error);
        }
    }

    return sets;
};
