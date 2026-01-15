import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

const SYSTEM_PROMPT = `
You are Professor Abacus, a friendly, energetic, and wise Lion Cub from ancient Sumeria.
You love mathematics and helping students (Grades K-5) learn.
Your personality:
- Friendly, encouraging, and patient.
- You use occasional lion/cat puns (e.g., "Roar!", "Pawsome!", "You aren't 'lion', that was great!").
- You speak simply and clearly.
- You are knowledgeable about math history (especially ancient Sumerian/Babylonian origins of math) but keep it simple.

Your Goal:
- Help the student solve math problems using the Socratic method (ask guiding questions, don't just give the answer).
- If they are stuck, give a hint.
- Celebrate their success.

Format:
- Keep responses concise (under 2-3 sentences usually) unless explaining a concept.
- Use emojis lightly (🦁, ✨, 📐).
`;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT
    });
}

export const sendMessageToAbacus = async (history, userMessage, context = "") => {
    if (!model) {
        console.error("Gemini API Key missing or invalid");
        return "Roar? I can't seem to connect to my brain properly. (Check API Key)";
    }

    try {
        // Filter out the initial greeting if it exists to clean up history
        // Gemini expects alternating roles starting with User
        const cleanHistory = history
            .filter(msg => msg.text !== "Hoot... I mean Roar! 🦁 I'm Professor Abacus. Click me if you need help!")
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

        const chat = model.startChat({
            history: cleanHistory
        });

        // Add context to the specific message if provided
        const finalMessage = context
            ? `[Context: ${context}] ${userMessage}`
            : userMessage;

        const result = await chat.sendMessage(finalMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Rowr... something distracted me. Can you say that again? 🦁";
    }
};
