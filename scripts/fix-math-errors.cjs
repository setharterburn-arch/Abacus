/**
 * Fix specific math errors in curriculum
 * These questions have wrong options - need to regenerate options
 */

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));

let fixed = 0;
let deleted = 0;

curriculum.forEach(set => {
    if (!set.questions) return;
    
    // Filter out questions we can't fix
    set.questions = set.questions.filter(q => {
        if (!q.options || !q.answer) return true;
        
        // If answer is in options, keep it
        if (q.options.includes(q.answer)) return true;
        
        // Try to generate correct options
        const answer = q.answer;
        
        // Numeric answers - generate distractors
        const numMatch = answer.match(/^(\d+)/);
        if (numMatch) {
            const num = parseInt(numMatch[1]);
            const unit = answer.replace(/^\d+/, '').trim();
            
            // Generate plausible wrong answers
            const distractors = [
                num - 3, num - 2, num - 1, num + 1, num + 2, num + 3
            ].filter(n => n > 0 && n !== num);
            
            // Pick 3 random distractors
            const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
            
            // Create new options with correct answer
            q.options = [
                ...shuffled.map(n => unit ? `${n}${unit}` : String(n)),
                answer
            ].sort(() => Math.random() - 0.5);
            
            fixed++;
            return true;
        }
        
        // Money answers
        const moneyMatch = answer.match(/^\$(\d+\.\d{2})/);
        if (moneyMatch) {
            const cents = Math.round(parseFloat(moneyMatch[1]) * 100);
            const distractors = [
                cents - 25, cents - 10, cents + 10, cents + 25
            ].filter(c => c > 0 && c !== cents);
            
            const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
            
            q.options = [
                ...shuffled.map(c => `$${(c/100).toFixed(2)}`),
                answer
            ].sort(() => Math.random() - 0.5);
            
            fixed++;
            return true;
        }
        
        // Fraction answers (simple cases)
        if (answer.includes('/') || answer.includes('candy') || answer.includes('1/')) {
            // These are too complex, delete the question
            deleted++;
            return false;
        }
        
        // Pattern questions with mismatched terminology
        if (q.question?.toLowerCase().includes('what comes next')) {
            // Delete these - need manual review
            deleted++;
            return false;
        }
        
        // If we can't fix it, delete it
        deleted++;
        return false;
    });
});

// Save
fs.writeFileSync('src/data/curriculum.json', JSON.stringify(curriculum, null, 2));

console.log('=== MATH ERROR FIXES ===');
console.log(`Questions fixed with new options: ${fixed}`);
console.log(`Questions deleted (unfixable): ${deleted}`);

// Verify
let stillBroken = 0;
curriculum.forEach(set => {
    if (!set.questions) return;
    set.questions.forEach(q => {
        if (q.options && q.answer && !q.options.includes(q.answer)) {
            stillBroken++;
        }
    });
});
console.log(`Remaining broken: ${stillBroken}`);
