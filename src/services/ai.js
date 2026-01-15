import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const generateAssignment = async (topic, gradeLevel, questionCount = 5, difficulty = 'medium') => {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please configure VITE_GEMINI_API_KEY in Vercel.");
  }
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
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Pass the real error message to the UI
    throw new Error(error.message || "Failed to generate assignment.");
  }
};

export const chatWithTutor = async (history, message, context) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Construct a system instruction based on context
  const systemInstruction = `
        You are a friendly and helpful math tutor named "Abacus AI" for a ${context.grade || 'student'}.
        Student Name: ${context.studentName || 'Student'}.
        
        Your goal is to help them understand math concepts.
        - Do NOT just give the answer. Guide them to the solution.
        - Be encouraging and patient.
        - If they ask about their homework, try to help them solve it step-by-step.
        - Keep answers concise and easy to read.
    `;

  // Convert local history format to Gemini format (user/model)
  // History has { role: 'user'/'model', content: '...' }
  // Gemini expects { role: 'user'/'model', parts: [{ text: '...' }] }

  // We only take the last few messages to save tokens and avoid "context window" issues for now, 
  // or just pass the full history if it's small.
  const chatHistory = history.slice(1).map(msg => ({ // Skip the first "welcome" message from local state if it's not real
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `System Instruction: ${systemInstruction}` }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to help!" }],
      },
      ...chatHistory
    ],
  });

  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later! 🧠";
  }
};
