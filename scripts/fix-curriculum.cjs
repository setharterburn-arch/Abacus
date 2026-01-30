/**
 * Curriculum Fix Script
 * Automatically fixes common issues found in the audit
 */

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));

const fixes = {
    letterAnswersFixed: 0,
    duplicateOptionsFixed: 0,
    totalQuestions: 0
};

// Fix 1: Convert letter answers (A, B, C, D) to actual values
function fixLetterAnswer(question) {
    const answer = question.answer;
    const options = question.options;
    
    if (!answer || !options) return false;
    
    // Check if answer is a single letter
    if (/^[A-Da-d]$/.test(answer)) {
        const letterIndex = answer.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
        
        if (options[letterIndex]) {
            // Extract the actual answer from "A) value" format or just use the value
            let actualAnswer = options[letterIndex];
            
            // Remove letter prefix if present (e.g., "A) 5" -> "5")
            actualAnswer = actualAnswer.replace(/^[A-Da-d]\)\s*/, '');
            
            question.answer = actualAnswer;
            return true;
        }
    }
    
    // Check if options have "A)" prefix but answer doesn't match
    if (options[0]?.match(/^[A-D]\)/)) {
        // Find the option that starts with the answer letter
        const idx = options.findIndex(o => o.startsWith(answer + ')'));
        if (idx !== -1) {
            question.answer = options[idx].replace(/^[A-Da-d]\)\s*/, '');
            return true;
        }
    }
    
    return false;
}

// Fix 2: Remove duplicate options (keep first occurrence)
function fixDuplicateOptions(question) {
    if (!question.options) return false;
    
    const seen = new Set();
    const original = question.options.length;
    
    question.options = question.options.filter(opt => {
        if (seen.has(opt)) return false;
        seen.add(opt);
        return true;
    });
    
    return question.options.length !== original;
}

// Fix 3: Clean up option formatting (remove A), B), etc. prefix)
function cleanOptionFormat(question) {
    if (!question.options) return false;
    
    let changed = false;
    question.options = question.options.map(opt => {
        const cleaned = opt.replace(/^[A-Da-d]\)\s*/, '');
        if (cleaned !== opt) changed = true;
        return cleaned;
    });
    
    // Also clean answer if it has the prefix
    if (question.answer) {
        const cleanedAnswer = question.answer.replace(/^[A-Da-d]\)\s*/, '');
        if (cleanedAnswer !== question.answer) {
            question.answer = cleanedAnswer;
            changed = true;
        }
    }
    
    return changed;
}

// Fix 4: Ensure answer is in options
function ensureAnswerInOptions(question) {
    if (!question.answer || !question.options) return false;
    
    // Try to find a close match
    const answer = question.answer.toString().toLowerCase().trim();
    
    for (let i = 0; i < question.options.length; i++) {
        const opt = question.options[i].toString().toLowerCase().trim();
        if (opt === answer || opt.includes(answer) || answer.includes(opt)) {
            if (question.options[i] !== question.answer) {
                question.answer = question.options[i];
                return true;
            }
            return false;
        }
    }
    
    return false;
}

console.log('Starting curriculum fixes...\n');

// Process all questions
curriculum.forEach(set => {
    if (!set.questions) return;
    
    set.questions.forEach(q => {
        fixes.totalQuestions++;
        
        // Apply fixes in order
        if (fixLetterAnswer(q)) fixes.letterAnswersFixed++;
        if (cleanOptionFormat(q)) {} // Count included in letter fixes
        if (fixDuplicateOptions(q)) fixes.duplicateOptionsFixed++;
        ensureAnswerInOptions(q);
    });
});

// Backup original
fs.writeFileSync('src/data/curriculum.json.backup2', 
    fs.readFileSync('src/data/curriculum.json'));

// Save fixed curriculum
fs.writeFileSync('src/data/curriculum.json', JSON.stringify(curriculum, null, 2));

console.log('=== FIX RESULTS ===\n');
console.log(`Total questions processed: ${fixes.totalQuestions}`);
console.log(`Letter answers fixed: ${fixes.letterAnswersFixed}`);
console.log(`Duplicate options fixed: ${fixes.duplicateOptionsFixed}`);
console.log('\nBackup saved to: src/data/curriculum.json.backup2');
console.log('Fixed curriculum saved to: src/data/curriculum.json');

// Re-run validation
console.log('\n=== POST-FIX VALIDATION ===\n');

let stillBroken = 0;
curriculum.forEach(set => {
    if (!set.questions) return;
    set.questions.forEach(q => {
        if (q.options && q.answer && !q.options.includes(q.answer)) {
            stillBroken++;
        }
    });
});

console.log(`Questions with answer not in options: ${stillBroken}`);
