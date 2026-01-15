
import { generateHomework } from './ai'; // Helper for fallback/story logic

// Helper to get random number
const rnd = (max) => Math.floor(Math.random() * max) + 1;
const rndItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateFromSyllabus = async (module) => {
    const { type, range, op, factors } = module;
    const questions = [];
    const count = 10; // Default 10 questions per module

    for (let i = 0; i < count; i++) {
        let q = null;

        switch (type) {
            case 'visual_counting':
                q = genCounting(range || 10);
                break;
            case 'visual_addition':
                q = genVisualAddition(range || 10);
                break;
            case 'visual_subtraction':
                q = genVisualSubtraction(range || 10);
                break;
            case 'visual_shapes':
                q = genShapes();
                break;
            case 'math_basic':
                q = genMathBasic(op, range || 20, factors);
                break;
            case 'ai_story_addition':
                // For now, we simulate strictly or call AI. 
                // Let's use a simple template to ensure speed/reliability first.
                q = genStoryTemplate(range || 10);
                break;
            default:
                // Fallback to basic addition if unknown
                q = genMathBasic('+', 10);
        }

        if (q) {
            q.id = i + 1;
            questions.push(q);
        }
    }

    return {
        title: module.title,
        description: module.description,
        questions: questions,
        grade: "1", // This would ideally come from the syllabus or user
        status: 'draft'
    };
};

// --- Generators ---

const genCounting = (max) => {
    const n = rnd(max);
    const item = rndItem(['apple', 'star', 'ball', 'cookie', 'cat']);
    return {
        question: `How many ${item}s are there?`,
        options: [String(n), String(n + 1), String(n - 1), String(n + 2)].sort(() => Math.random() - 0.5),
        correctAnswer: String(n),
        explanation: `There are ${n} ${item}s.`,
        hint: `Count the ${item}s one by one.`,
        visual: { type: 'counting', item, count: n }
    };
};

const genVisualAddition = (max) => {
    const a = rnd(max - 1);
    const b = rnd(max - a); // Ensure sum <= max
    const sum = a + b;
    const item = rndItem(['apple', 'star', 'ball']);
    return {
        question: `What is ${a} + ${b}?`,
        options: [String(sum), String(sum + 1), String(sum + 2), String(Math.max(1, sum - 1))].sort(() => Math.random() - 0.5),
        correctAnswer: String(sum),
        explanation: `${a} plus ${b} makes ${sum}.`,
        hint: `Count all the ${item}s together.`,
        visual: { type: 'counting', item, count: sum } // Hack: showing the total aids counting? Or show two groups?
        // Improved: For now, we show the TOTAL as the visual is just "icons". 
        // Ideally we'd show "a" icons and "b" icons. 
        // Let's stick to "counting" all for simplicity, or we can adapt the visual renderer later.
    };
};

const genVisualSubtraction = (max) => {
    const a = rnd(max);
    const b = rnd(a); // b <= a
    const diff = a - b;
    return {
        question: `What is ${a} - ${b}?`,
        options: [String(diff), String(diff + 1), String(diff + 2), String(Math.abs(diff - 1))].sort(() => Math.random() - 0.5),
        correctAnswer: String(diff),
        explanation: `${a} take away ${b} is ${diff}.`,
        hint: `Start with ${a} and count backwards by ${b}.`,
        visual: { type: 'none' } // Visual subtraction is harder to render with simple count
    };
};

const genShapes = () => {
    const shape = rndItem(['Circle', 'Square', 'Triangle', 'Rectangle']);
    // Render the shape
    return {
        question: `What shape is this?`,
        options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        correctAnswer: shape,
        explanation: `It has the properties of a ${shape}.`,
        hint: `Look at the sides and corners.`,
        visual: { type: 'geometry', shape: shape }
    };
};

const genMathBasic = (op, max, factors) => {
    let a, b, ans;
    if (op === '+') {
        a = rnd(max); b = rnd(max); ans = a + b;
    } else if (op === '-') {
        a = rnd(max); b = rnd(a); ans = a - b;
    } else if (op === '*') {
        a = factors ? rndItem(factors) : rnd(10);
        b = rnd(10);
        ans = a * b;
    } else {
        // Division (simple)
        b = rnd(10); a = b * rnd(10); ans = a / b;
    }

    return {
        question: `Solve: ${a} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${b}`,
        options: [String(ans), String(ans + 1), String(ans - 1), String(ans + 2)].sort(() => Math.random() - 0.5),
        correctAnswer: String(ans),
        explanation: `The answer is ${ans}.`,
        hint: `Use your math facts!`,
        visual: { type: 'none' }
    };
};

const genStoryTemplate = (max) => {
    const a = rnd(max);
    const b = rnd(max);
    const sum = a + b;
    const name = rndItem(['Sally', 'Tom', 'Jerry', 'Alice']);
    const item = rndItem(['apple', 'ball', 'sticker']);
    return {
        question: `${name} has ${a} ${item}s. They get ${b} more. How many do they have now?`,
        options: [String(sum), String(sum + 1), String(sum - 1), String(sum + 2)].sort(() => Math.random() - 0.5),
        correctAnswer: String(sum),
        explanation: `${a} + ${b} = ${sum}`,
        hint: `Add the two numbers together.`,
        visual: { type: 'counting', item, count: sum }
    };
};
