import curriculumData from '../data/curriculum.json';

/**
 * Audit curriculum for age-appropriateness
 * Checks if questions match expected difficulty for grade level
 */

const gradeExpectations = {
    0: { // Kindergarten
        topics: ['Counting', 'Shapes', 'Patterns', 'Comparing'],
        maxNumber: 20,
        operations: ['counting', 'recognition'],
        vocabulary: 'simple, concrete, visual'
    },
    1: { // Grade 1
        topics: ['Addition', 'Subtraction', 'Counting', 'Time', 'Money', 'Measurement'],
        maxNumber: 100,
        operations: ['addition within 20', 'subtraction within 20'],
        vocabulary: 'basic math terms'
    },
    2: { // Grade 2
        topics: ['Addition', 'Subtraction', 'Place Value', 'Measurement', 'Time', 'Money', 'Data'],
        maxNumber: 1000,
        operations: ['addition within 100', 'subtraction within 100', 'skip counting'],
        vocabulary: 'expanded math vocabulary'
    },
    3: { // Grade 3
        topics: ['Multiplication', 'Division', 'Fractions', 'Area', 'Perimeter'],
        maxNumber: 10000,
        operations: ['multiplication tables', 'division basics', 'simple fractions'],
        vocabulary: 'abstract concepts introduced'
    },
    4: { // Grade 4
        topics: ['Multi-digit Multiplication', 'Division', 'Fractions', 'Decimals', 'Geometry'],
        maxNumber: 1000000,
        operations: ['multi-digit operations', 'equivalent fractions', 'decimal basics'],
        vocabulary: 'more complex terminology'
    },
    5: { // Grade 5
        topics: ['Decimals', 'Fractions', 'Volume', 'Coordinate Plane', 'Division'],
        maxNumber: 1000000,
        operations: ['fraction operations', 'decimal operations', 'multi-step problems'],
        vocabulary: 'advanced concepts'
    },
    6: { // Grade 6
        topics: ['Ratios', 'Percentages', 'Negative Numbers', 'Expressions', 'Equations'],
        maxNumber: Infinity,
        operations: ['algebraic thinking', 'ratio reasoning', 'statistical thinking'],
        vocabulary: 'pre-algebra concepts'
    }
};

const issues = [];
const warnings = [];
const recommendations = [];

// Analyze each curriculum set
curriculumData.forEach((set, setIndex) => {
    const grade = set.grade_level;
    const expectations = gradeExpectations[grade];

    if (!expectations) {
        issues.push({
            set: set.id,
            title: set.title,
            issue: `Invalid grade level: ${grade}`,
            severity: 'HIGH'
        });
        return;
    }

    // Check if topic is appropriate for grade
    const topicAppropriate = expectations.topics.some(t =>
        set.topic.toLowerCase().includes(t.toLowerCase()) ||
        t.toLowerCase().includes(set.topic.toLowerCase())
    );

    if (!topicAppropriate && set.topic !== 'Word Problems') {
        warnings.push({
            set: set.id,
            title: set.title,
            grade: grade,
            issue: `Topic "${set.topic}" may not be standard for grade ${grade === 0 ? 'K' : grade}`,
            expected: expectations.topics.join(', '),
            severity: 'MEDIUM'
        });
    }

    // Analyze questions
    set.questions.forEach((q, qIndex) => {
        const questionText = q.question.toLowerCase();

        // Extract numbers from question
        const numbers = questionText.match(/\d+/g)?.map(Number) || [];
        const maxNum = Math.max(...numbers, 0);

        // Check if numbers are too large for grade level
        if (maxNum > expectations.maxNumber) {
            issues.push({
                set: set.id,
                title: set.title,
                grade: grade,
                questionIndex: qIndex + 1,
                question: q.question,
                issue: `Number ${maxNum} exceeds grade ${grade === 0 ? 'K' : grade} expectation (max: ${expectations.maxNumber})`,
                severity: 'HIGH'
            });
        }

        // Check for grade-inappropriate operations
        if (grade === 0) {
            // Kindergarten shouldn't have arithmetic operations
            if (questionText.match(/\+|-|\*|÷|×/)) {
                issues.push({
                    set: set.id,
                    title: set.title,
                    grade: grade,
                    questionIndex: qIndex + 1,
                    question: q.question,
                    issue: 'Kindergarten should not have arithmetic symbols',
                    severity: 'HIGH'
                });
            }
        }

        if (grade === 1) {
            // Grade 1 shouldn't have multiplication/division
            if (questionText.match(/\*|÷|×|multiply|divide|times/)) {
                issues.push({
                    set: set.id,
                    title: set.title,
                    grade: grade,
                    questionIndex: qIndex + 1,
                    question: q.question,
                    issue: 'Grade 1 should not have multiplication/division',
                    severity: 'HIGH'
                });
            }
        }

        if (grade <= 2) {
            // Early grades shouldn't have fractions/decimals
            if (questionText.match(/fraction|decimal|\.5|½|¼|\/|percent/)) {
                issues.push({
                    set: set.id,
                    title: set.title,
                    grade: grade,
                    questionIndex: qIndex + 1,
                    question: q.question,
                    issue: `Grade ${grade} should not have fractions/decimals`,
                    severity: 'HIGH'
                });
            }
        }

        // Check vocabulary complexity
        const complexWords = [
            'coefficient', 'polynomial', 'quadratic', 'exponent', 'logarithm',
            'derivative', 'integral', 'theorem', 'proof', 'congruent'
        ];

        complexWords.forEach(word => {
            if (questionText.includes(word) && grade < 6) {
                issues.push({
                    set: set.id,
                    title: set.title,
                    grade: grade,
                    questionIndex: qIndex + 1,
                    question: q.question,
                    issue: `Word "${word}" is too advanced for grade ${grade === 0 ? 'K' : grade}`,
                    severity: 'MEDIUM'
                });
            }
        });

        // Check question length (age-appropriate reading level)
        const wordCount = q.question.split(' ').length;
        const maxWords = grade === 0 ? 10 : grade * 8;

        if (wordCount > maxWords) {
            warnings.push({
                set: set.id,
                title: set.title,
                grade: grade,
                questionIndex: qIndex + 1,
                question: q.question,
                issue: `Question too long (${wordCount} words) for grade ${grade === 0 ? 'K' : grade} (max recommended: ${maxWords})`,
                severity: 'LOW'
            });
        }
    });
});

// Generate report
console.log('='.repeat(80));
console.log('CURRICULUM AGE-APPROPRIATENESS AUDIT REPORT');
console.log('='.repeat(80));
console.log(`\nTotal Curriculum Sets Analyzed: ${curriculumData.length}`);
console.log(`Total Issues Found: ${issues.length}`);
console.log(`Total Warnings: ${warnings.length}\n`);

if (issues.length > 0) {
    console.log('\n🚨 HIGH PRIORITY ISSUES (Must Fix):');
    console.log('-'.repeat(80));
    issues.filter(i => i.severity === 'HIGH').forEach((issue, idx) => {
        console.log(`\n${idx + 1}. ${issue.title} (${issue.set})`);
        console.log(`   Grade: ${issue.grade === 0 ? 'K' : issue.grade}`);
        if (issue.questionIndex) console.log(`   Question #${issue.questionIndex}: "${issue.question}"`);
        console.log(`   ❌ ${issue.issue}`);
    });
}

if (warnings.length > 0) {
    console.log('\n\n⚠️  WARNINGS (Review Recommended):');
    console.log('-'.repeat(80));
    warnings.slice(0, 10).forEach((warning, idx) => {
        console.log(`\n${idx + 1}. ${warning.title} (${warning.set})`);
        console.log(`   Grade: ${warning.grade === 0 ? 'K' : warning.grade}`);
        if (warning.questionIndex) console.log(`   Question #${warning.questionIndex}`);
        console.log(`   ⚠️  ${warning.issue}`);
    });
    if (warnings.length > 10) {
        console.log(`\n   ... and ${warnings.length - 10} more warnings`);
    }
}

// Export results
const report = {
    summary: {
        totalSets: curriculumData.length,
        totalIssues: issues.length,
        totalWarnings: warnings.length,
        highPriorityIssues: issues.filter(i => i.severity === 'HIGH').length,
        mediumPriorityIssues: issues.filter(i => i.severity === 'MEDIUM').length
    },
    issues,
    warnings,
    gradeDistribution: curriculumData.reduce((acc, set) => {
        const grade = set.grade_level === 0 ? 'K' : `Grade ${set.grade_level}`;
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
    }, {})
};

console.log('\n\n📊 GRADE DISTRIBUTION:');
console.log('-'.repeat(80));
Object.entries(report.gradeDistribution).sort().forEach(([grade, count]) => {
    console.log(`${grade}: ${count} sets`);
});

console.log('\n\n💾 Full report saved to: audit-report.json');
console.log('='.repeat(80));

// Save to file
import fs from 'fs';
fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
