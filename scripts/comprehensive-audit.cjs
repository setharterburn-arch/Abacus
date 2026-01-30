/**
 * Comprehensive Curriculum Audit Script
 * Analyzes all questions for errors, missing content, and improvements
 */

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));

const issues = {
    critical: [],     // Wrong answers, broken questions
    high: [],         // Missing essential content
    medium: [],       // Could be improved
    low: []           // Nice to have
};

const stats = {
    totalScanned: 0,
    issuesFound: 0,
    fixedAutomatically: 0
};

// Helper: Simple math expression evaluator
function evaluateSimpleMath(expr) {
    try {
        // Only evaluate simple arithmetic
        if (/^[\d\s+\-*/().]+$/.test(expr)) {
            return eval(expr);
        }
    } catch (e) {}
    return null;
}

// Helper: Check if answer is in options
function answerInOptions(question) {
    if (!question.options || !question.answer) return true;
    return question.options.includes(question.answer);
}

// Helper: Check for duplicate options
function hasDuplicateOptions(options) {
    if (!options) return false;
    return new Set(options).size !== options.length;
}

// Helper: Question needs visual for grade level
function needsVisual(question, gradeLevel) {
    const visualKeywords = [
        'count', 'how many', 'which group', 'compare', 'bigger', 'smaller',
        'shape', 'circle', 'square', 'triangle', 'rectangle',
        'draw', 'picture', 'image', 'look at', 'shown', 'below'
    ];
    
    const qLower = question.question?.toLowerCase() || '';
    const needsIt = visualKeywords.some(kw => qLower.includes(kw));
    const hasIt = !!question.image;
    
    // K-2 questions about counting/shapes really need visuals
    if (gradeLevel <= 2 && needsIt && !hasIt) {
        return true;
    }
    return false;
}

// Helper: Question text quality check
function questionQualityIssues(q) {
    const issues = [];
    const text = q.question || '';
    
    if (text.length < 10) issues.push('Question too short');
    if (text.length > 500) issues.push('Question too long');
    if (!text.includes('?') && !text.includes(':')) issues.push('No question mark or colon');
    if (/\?\s*\?/.test(text)) issues.push('Double question marks');
    if (/^\s*$/.test(text)) issues.push('Empty question');
    
    return issues;
}

// Helper: Simple arithmetic answer validator
function validateArithmeticAnswer(question) {
    const q = question.question || '';
    const answer = question.answer;
    
    // Pattern: "What is X + Y?" or "X + Y = ?"
    const patterns = [
        /what is (\d+)\s*\+\s*(\d+)/i,
        /what is (\d+)\s*-\s*(\d+)/i,
        /what is (\d+)\s*[x×*]\s*(\d+)/i,
        /what is (\d+)\s*[÷/]\s*(\d+)/i,
        /(\d+)\s*\+\s*(\d+)\s*=\s*\?/i,
        /(\d+)\s*-\s*(\d+)\s*=\s*\?/i,
    ];
    
    for (const pattern of patterns) {
        const match = q.match(pattern);
        if (match) {
            const a = parseInt(match[1]);
            const b = parseInt(match[2]);
            let expected;
            
            if (pattern.source.includes('\\+')) expected = a + b;
            else if (pattern.source.includes('-')) expected = a - b;
            else if (pattern.source.includes('[x×*]')) expected = a * b;
            else if (pattern.source.includes('[÷/]')) expected = Math.floor(a / b);
            
            if (expected !== undefined && answer !== String(expected) && answer !== expected) {
                return { expected, actual: answer };
            }
        }
    }
    
    return null;
}

// Main audit loop
console.log('Starting comprehensive curriculum audit...\n');

curriculum.forEach((set, setIdx) => {
    const gradeLevel = set.grade_level || 0;
    
    if (!set.questions || set.questions.length === 0) {
        issues.high.push({
            type: 'empty_set',
            setId: set.id,
            setTitle: set.title,
            message: 'Question set has no questions'
        });
        return;
    }
    
    set.questions.forEach((q, qIdx) => {
        stats.totalScanned++;
        
        // Check 1: Answer not in options
        if (!answerInOptions(q)) {
            issues.critical.push({
                type: 'answer_not_in_options',
                setId: set.id,
                setTitle: set.title,
                questionIndex: qIdx,
                question: q.question,
                answer: q.answer,
                options: q.options
            });
            stats.issuesFound++;
        }
        
        // Check 2: Duplicate options
        if (hasDuplicateOptions(q.options)) {
            issues.high.push({
                type: 'duplicate_options',
                setId: set.id,
                setTitle: set.title,
                questionIndex: qIdx,
                question: q.question,
                options: q.options
            });
            stats.issuesFound++;
        }
        
        // Check 3: Math answer validation
        const mathError = validateArithmeticAnswer(q);
        if (mathError) {
            issues.critical.push({
                type: 'wrong_math_answer',
                setId: set.id,
                setTitle: set.title,
                questionIndex: qIdx,
                question: q.question,
                expectedAnswer: mathError.expected,
                actualAnswer: mathError.actual
            });
            stats.issuesFound++;
        }
        
        // Check 4: Needs visual but doesn't have one
        if (needsVisual(q, gradeLevel)) {
            issues.medium.push({
                type: 'needs_visual',
                setId: set.id,
                setTitle: set.title,
                questionIndex: qIdx,
                question: q.question,
                gradeLevel: gradeLevel
            });
            stats.issuesFound++;
        }
        
        // Check 5: Missing hints (for K-2)
        if (gradeLevel <= 2 && (!q.hints || q.hints.length === 0)) {
            issues.low.push({
                type: 'missing_hints',
                setId: set.id,
                questionIndex: qIdx,
                question: q.question?.substring(0, 50)
            });
        }
        
        // Check 6: Question quality
        const qualityIssues = questionQualityIssues(q);
        if (qualityIssues.length > 0) {
            issues.medium.push({
                type: 'question_quality',
                setId: set.id,
                questionIndex: qIdx,
                question: q.question?.substring(0, 50),
                problems: qualityIssues
            });
            stats.issuesFound++;
        }
        
        // Check 7: Missing explanation
        if (!q.explanation) {
            issues.low.push({
                type: 'missing_explanation',
                setId: set.id,
                questionIndex: qIdx,
                question: q.question?.substring(0, 50)
            });
        }
    });
});

// Generate report
const report = {
    timestamp: new Date().toISOString(),
    stats: {
        ...stats,
        criticalIssues: issues.critical.length,
        highIssues: issues.high.length,
        mediumIssues: issues.medium.length,
        lowIssues: issues.low.length
    },
    issues
};

fs.writeFileSync('CURRICULUM_AUDIT_FULL.json', JSON.stringify(report, null, 2));

// Console summary
console.log('=== CURRICULUM AUDIT COMPLETE ===\n');
console.log(`Total questions scanned: ${stats.totalScanned}`);
console.log(`Total issues found: ${stats.issuesFound}`);
console.log('');
console.log('Issues by severity:');
console.log(`  🔴 CRITICAL: ${issues.critical.length}`);
console.log(`  🟠 HIGH: ${issues.high.length}`);
console.log(`  🟡 MEDIUM: ${issues.medium.length}`);
console.log(`  🟢 LOW: ${issues.low.length}`);
console.log('');
console.log('Full report saved to CURRICULUM_AUDIT_FULL.json');

// Show sample critical issues
if (issues.critical.length > 0) {
    console.log('\n=== SAMPLE CRITICAL ISSUES ===\n');
    issues.critical.slice(0, 5).forEach(issue => {
        console.log(`Type: ${issue.type}`);
        console.log(`Set: ${issue.setTitle}`);
        console.log(`Question: ${issue.question?.substring(0, 80)}`);
        if (issue.expectedAnswer) {
            console.log(`Expected: ${issue.expectedAnswer}, Got: ${issue.actualAnswer}`);
        }
        console.log('---');
    });
}
