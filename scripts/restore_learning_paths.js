import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SYLLABUS } from '../src/data/syllabus.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/data/learning_paths.json');

const gradeMap = {
    "K": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6
};

const learningPaths = [];

Object.entries(SYLLABUS).forEach(([gradeKey, weeks]) => {
    const gradeLevel = gradeMap[gradeKey];

    weeks.forEach(week => {
        learningPaths.push({
            id: week.id,
            grade_level: gradeLevel,
            title: week.title,
            description: week.description,
            topic: week.title.split(': ')[1] || week.title, // Extract topic
            modules: [
                {
                    id: `${week.id}-m1`,
                    title: "Practice",
                    type: week.type
                }
            ],
            estimated_time: 30, // Default
            total_questions: 20, // Default
            created_at: new Date().toISOString()
        });
    });
});

fs.writeFileSync(outputPath, JSON.stringify(learningPaths, null, 2));

console.log(`Successfully restored ${learningPaths.length} learning paths to ${outputPath}`);
