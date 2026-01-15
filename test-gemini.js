import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const keyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    const apiKey = keyMatch ? keyMatch[1].trim() : null;

    if (!apiKey) {
        console.error("No API key found in .env");
        process.exit(1);
    }

    console.log("Testing with API Key ending in:", apiKey.slice(-4));

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-2.0-flash-exp"
    ];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            console.log(`✅ Success! Response: ${result.response.text()}`);
        } catch (e) {
            console.error(`❌ Failed: ${e.message}`);
        }
    }

} catch (err) {
    console.error("Error reading .env or running test:", err);
}
