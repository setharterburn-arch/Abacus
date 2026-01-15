import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const generateAssignment = async (topic, gradeLevel, questionCount = 5, difficulty = 'medium') => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
        Create a math assignment for a ${gradeLevel}th grade student.
        Topic: ${topic}
        Difficulty: ${difficulty}
        Number of questions: ${questionCount}

        Return ONLY a raw JSON array (no markdown code blocks) of objects with this structure:
        {
            "question": "The question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "The correct option text (must match one of the options exactly)"
        }
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown if present
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate assignment. Please try again.");
  }
};
