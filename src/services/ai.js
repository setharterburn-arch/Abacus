import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;

export const initializeAI = (key) => {
  if (!key) return;
  genAI = new GoogleGenerativeAI(key);
};

// Initialize if key exists
if (API_KEY) {
  initializeAI(API_KEY);
}

export const generateHomework = async (age, difficulty, topic = 'math', count = 5, grade = 1) => {
  if (!genAI) throw new Error("AI not initialized");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Generate ${count} math problems for a ${age} year old child (Grade ${grade || 'any'}). 
  Difficulty: ${difficulty}. 
  Topic: ${topic}.
  
  CRITICAL: You must include a "hint" and a "detailedExplanation" for every question.
  
  Return the response as a valid JSON object with the following structure:
  {
    "problems": [
      {
        "id": 1,
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": "4",
        "explanation": "Adding 2 to 2 equals 4.",
        "hint": "Think about adding two apples to two other apples.",
        "grade": "${grade || 1}",
        "topic": "${topic}"
      }
    ]
  }
  Do not include code fences or markdown. Just the JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up if markdown fences are included despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating homework:", error);
    throw error;
  }
};

export const generateCurriculumSet = async (topic, count, grade) => {
  if (!genAI) throw new Error("AI not initialized");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Create a cohesive Math Curriculum Set for Grade ${grade}.
    Topic: ${topic}.
    Count: ${count} questions.
    
    Structure the response as JSON:
    {
       "title": "Creative Title (e.g. 'Fraction Action')",
       "description": "Short description of what students will learn.",
       "questions": [
           { 
             ...standard question object with hint/explanation...,
             "visual": {
                "type": "counting" | "geometry" | "none", 
                "item": "apple" | "star" | "ball", 
                "count": 3,
                "shape": "square" | "circle" | "triangle"
             }
           }
       ]
    }
    
    Ensure questions progress in difficulty. Include 'hint' and 'explanation' for each.
    CRITICAL: For word problems or geometry, ALWAYS provide the 'visual' object. For example, '3 + 2' could have visual type 'counting', count 3, item 'apple'. Geometry questions must have type 'geometry' and the shape name.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
};

export const chatWithTutor = async (history, message, context) => {
  if (!genAI) throw new Error("AI not initialized");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    })),
    systemInstruction: `You are a friendly, encouraging math tutor for a child. 
    Context: The child is working on: ${JSON.stringify(context)}.
    Keep answers short, simple, and encouraging. Use emojis.`
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
};
