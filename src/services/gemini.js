import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

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

export const sendMessageToAbacus = async (history, userMessage, context = "") => {
    if (!model) {
        console.error("Gemini API Key missing");
        return "Roar? I can't seem to connect to my brain properly. (Check API Key)";
    }

    try {
        // Construct the chat history for the API
        // history is expected to be array of { role: 'user' | 'model', parts: [{ text: '' }] }
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\nCurrent Context: " + context }]
                },
                {
                    role: "model",
                    parts: [{ text: "Roar! I am Professor Abacus! I am ready to help you learn math! 🦁" }]
                },
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ]
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Rowr... something distracted me. Can you say that again?";
    }
};
