/**
 * Upper Grades Curriculum Expansion (6-8)
 * Focus on Algebra, Ratios, Geometry, and Pre-Algebra concepts
 */

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));
const existingIds = new Set(curriculum.map(s => s.id));

function generateId(grade, topic, suffix) {
    let id = `${grade}-${topic.toLowerCase().replace(/\s+/g, '-')}-${suffix}`;
    let counter = 1;
    while (existingIds.has(id)) {
        id = `${grade}-${topic.toLowerCase().replace(/\s+/g, '-')}-${suffix}-${counter++}`;
    }
    existingIds.add(id);
    return id;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

const newSets = [];

// Grade 6 Content
const grade6Templates = [
    // Integers
    {
        topic: 'Integers',
        title: 'Add integers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = -10 + Math.floor(Math.random() * 21);
                const b = -10 + Math.floor(Math.random() * 21);
                const answer = a + b;
                const wrong = [answer - 1, answer + 1, -answer, a - b].filter(w => w !== answer);
                questions.push({
                    question: `What is ${a >= 0 ? a : '(' + a + ')'} + ${b >= 0 ? b : '(' + b + ')'}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} + ${b} = ${answer}. When adding integers, combine the values.`,
                    hints: ['Same signs: add and keep the sign', 'Different signs: subtract and keep the sign of the larger absolute value']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Integers',
        title: 'Subtract integers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = -10 + Math.floor(Math.random() * 21);
                const b = -10 + Math.floor(Math.random() * 21);
                const answer = a - b;
                const wrong = [answer - 1, answer + 1, a + b, b - a].filter(w => w !== answer);
                questions.push({
                    question: `What is ${a >= 0 ? a : '(' + a + ')'} - ${b >= 0 ? b : '(' + b + ')'}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} - ${b} = ${answer}. To subtract, add the opposite.`,
                    hints: ['Subtracting is the same as adding the opposite', `${a} - ${b} = ${a} + ${-b}`]
                });
            }
            return questions;
        }
    },
    {
        topic: 'Integers',
        title: 'Multiply integers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = -6 + Math.floor(Math.random() * 13);
                const b = -6 + Math.floor(Math.random() * 13);
                if (a === 0 || b === 0) continue;
                const answer = a * b;
                const wrong = [answer - 1, answer + 1, -answer, a + b].filter(w => w !== answer);
                questions.push({
                    question: `What is ${a >= 0 ? a : '(' + a + ')'} × ${b >= 0 ? b : '(' + b + ')'}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} × ${b} = ${answer}. Same signs = positive, different signs = negative.`,
                    hints: ['Positive × Positive = Positive', 'Negative × Negative = Positive', 'Positive × Negative = Negative']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Integers',
        title: 'Divide integers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const quotient = -6 + Math.floor(Math.random() * 13);
                const b = 1 + Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
                if (quotient === 0) continue;
                const a = quotient * b;
                const wrong = [quotient - 1, quotient + 1, -quotient, a + b].filter(w => w !== quotient);
                questions.push({
                    question: `What is ${a >= 0 ? a : '(' + a + ')'} ÷ ${b >= 0 ? b : '(' + b + ')'}?`,
                    options: [String(quotient), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(quotient),
                    explanation: `${a} ÷ ${b} = ${quotient}. Same signs = positive, different signs = negative.`,
                    hints: ['Positive ÷ Positive = Positive', 'Negative ÷ Negative = Positive', 'Positive ÷ Negative = Negative']
                });
            }
            return questions;
        }
    },
    // Proportions
    {
        topic: 'Proportions',
        title: 'Solve proportions',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 2 + Math.floor(Math.random() * 8);
                const b = 2 + Math.floor(Math.random() * 8);
                const c = a * (2 + Math.floor(Math.random() * 4));
                const d = b * (c / a);
                const wrong = [d - 1, d + 1, d + 2, c].filter(w => w !== d && w > 0);
                questions.push({
                    question: `Solve for x: ${a}/${b} = ${c}/x`,
                    options: [String(d), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(d),
                    explanation: `${a}/${b} = ${c}/x means x = (${b} × ${c})/${a} = ${d}`,
                    hints: ['Cross multiply: a × x = b × c', `${a} × x = ${b} × ${c}`]
                });
            }
            return questions;
        }
    },
    {
        topic: 'Proportions',
        title: 'Percent proportion problems',
        generator: () => {
            const questions = [];
            const percents = [10, 20, 25, 30, 40, 50, 60, 75, 80, 100];
            for (const p of percents) {
                const whole = 10 * (2 + Math.floor(Math.random() * 10));
                const part = whole * p / 100;
                const wrong = [part - 5, part + 5, part - 10, part + 10].filter(w => w > 0 && w !== part);
                questions.push({
                    question: `What is ${p}% of ${whole}?`,
                    options: [String(part), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(part),
                    explanation: `${p}% of ${whole} = ${p}/100 × ${whole} = ${part}`,
                    hints: ['Convert percent to decimal: divide by 100', `${p}% = ${p/100}`]
                });
            }
            return questions;
        }
    },
    // Coordinate Plane
    {
        topic: 'Geometry',
        title: 'Identify quadrants',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const x = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 10));
                const y = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 10));
                let answer;
                if (x > 0 && y > 0) answer = 'I';
                else if (x < 0 && y > 0) answer = 'II';
                else if (x < 0 && y < 0) answer = 'III';
                else answer = 'IV';
                questions.push({
                    question: `In which quadrant is the point (${x}, ${y})?`,
                    options: ['I', 'II', 'III', 'IV'],
                    answer: answer,
                    explanation: `Point (${x}, ${y}) is in Quadrant ${answer}. Quadrant I: (+, +), II: (-, +), III: (-, -), IV: (+, -)`,
                    hints: ['Q I is top right, Q II is top left, Q III is bottom left, Q IV is bottom right']
                });
            }
            return questions;
        }
    },
    // Order of Operations
    {
        topic: 'Algebra',
        title: 'Order of operations with parentheses',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 2 + Math.floor(Math.random() * 8);
                const b = 2 + Math.floor(Math.random() * 8);
                const c = 2 + Math.floor(Math.random() * 5);
                const answer = (a + b) * c;
                const wrong = [a + b * c, a * b + c, a + b + c].filter(w => w !== answer);
                questions.push({
                    question: `What is (${a} + ${b}) × ${c}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `(${a} + ${b}) × ${c} = ${a + b} × ${c} = ${answer}. Parentheses first!`,
                    hints: ['Do parentheses first', `${a} + ${b} = ${a + b}`]
                });
            }
            return questions;
        }
    },
    {
        topic: 'Algebra',
        title: 'Order of operations with exponents',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const base = 2 + Math.floor(Math.random() * 5);
                const exp = 2;
                const b = 1 + Math.floor(Math.random() * 10);
                const answer = Math.pow(base, exp) + b;
                const wrong = [base * exp + b, answer - 1, answer + 1].filter(w => w !== answer);
                questions.push({
                    question: `What is ${base}² + ${b}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${base}² + ${b} = ${base * base} + ${b} = ${answer}. Exponents before addition.`,
                    hints: [`${base}² means ${base} × ${base}`, `${base}² = ${base * base}`]
                });
            }
            return questions;
        }
    }
];

// Grade 7 Content
const grade7Templates = [
    // Proportional Relationships
    {
        topic: 'Ratios',
        title: 'Identify proportional relationships',
        generator: () => {
            const questions = [];
            // Proportional examples
            for (let i = 0; i < 5; i++) {
                const k = 2 + Math.floor(Math.random() * 8);
                const x1 = 1, y1 = k;
                const x2 = 2, y2 = 2 * k;
                const x3 = 3, y3 = 3 * k;
                questions.push({
                    question: `Is the relationship proportional? x: 1, 2, 3  y: ${y1}, ${y2}, ${y3}`,
                    options: ['Yes', 'No'],
                    answer: 'Yes',
                    explanation: `Yes, y = ${k}x. The ratio y/x is always ${k}.`,
                    hints: ['Check if y/x is the same for all pairs', `${y1}/1 = ${y2}/2 = ${y3}/3 = ${k}`]
                });
            }
            // Non-proportional examples
            for (let i = 0; i < 5; i++) {
                const k = 2 + Math.floor(Math.random() * 5);
                const b = 1 + Math.floor(Math.random() * 5);
                const x1 = 1, y1 = k * 1 + b;
                const x2 = 2, y2 = k * 2 + b;
                const x3 = 3, y3 = k * 3 + b;
                questions.push({
                    question: `Is the relationship proportional? x: 1, 2, 3  y: ${y1}, ${y2}, ${y3}`,
                    options: ['Yes', 'No'],
                    answer: 'No',
                    explanation: `No, the ratios are different: ${y1}/1 ≠ ${y2}/2 ≠ ${y3}/3`,
                    hints: ['For proportional relationships, y/x must be constant', 'Check each ratio']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Algebra',
        title: 'Write expressions with variables',
        generator: () => {
            const questions = [];
            const scenarios = [
                { text: '5 more than a number n', answer: 'n + 5', wrong: ['5n', 'n - 5', '5/n'] },
                { text: '3 less than a number x', answer: 'x - 3', wrong: ['3 - x', '3x', 'x + 3'] },
                { text: 'twice a number y', answer: '2y', wrong: ['y + 2', 'y/2', 'y²'] },
                { text: 'a number m divided by 4', answer: 'm/4', wrong: ['4m', '4/m', 'm - 4'] },
                { text: 'the product of 6 and a number p', answer: '6p', wrong: ['6 + p', 'p/6', '6 - p'] },
                { text: '7 less than twice a number z', answer: '2z - 7', wrong: ['7 - 2z', '2z + 7', '2 - 7z'] },
                { text: 'the sum of a number w and 9', answer: 'w + 9', wrong: ['w - 9', '9w', 'w/9'] },
                { text: 'the quotient of 20 and a number k', answer: '20/k', wrong: ['k/20', '20k', '20 - k'] },
                { text: '4 times the sum of a number t and 3', answer: '4(t + 3)', wrong: ['4t + 3', 't + 12', '4 + t + 3'] },
                { text: 'half of a number h', answer: 'h/2', wrong: ['2h', 'h - 2', 'h + 2'] }
            ];
            for (const s of scenarios) {
                questions.push({
                    question: `Write an expression for: ${s.text}`,
                    options: [s.answer, ...s.wrong].sort(() => Math.random() - 0.5),
                    answer: s.answer,
                    explanation: `"${s.text}" translates to ${s.answer}`,
                    hints: ['Identify the operation', 'Variables represent unknown numbers']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Algebra',
        title: 'Solve two-step equations',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const x = 1 + Math.floor(Math.random() * 10);
                const a = 2 + Math.floor(Math.random() * 5);
                const b = 1 + Math.floor(Math.random() * 10);
                const result = a * x + b;
                const wrong = [x + 1, x - 1, x + 2, result].filter(w => w !== x);
                questions.push({
                    question: `Solve: ${a}x + ${b} = ${result}`,
                    options: [String(x), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(x),
                    explanation: `${a}x + ${b} = ${result} → ${a}x = ${result - b} → x = ${x}`,
                    hints: ['First subtract ' + b + ' from both sides', 'Then divide by ' + a]
                });
            }
            return questions;
        }
    },
    // Geometry - Angles
    {
        topic: 'Geometry',
        title: 'Find complementary angles',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 10 + Math.floor(Math.random() * 70);
                const answer = 90 - a;
                const wrong = [answer + 10, answer - 10, 180 - a, answer + 5].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `If one angle is ${a}°, what is its complement?`,
                    options: [answer + '°', ...wrong.slice(0, 3).map(w => w + '°')].sort(() => Math.random() - 0.5),
                    answer: answer + '°',
                    explanation: `Complementary angles add to 90°. ${a}° + ${answer}° = 90°`,
                    hints: ['Complementary angles sum to 90°', '90 - ' + a + ' = ?']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Geometry',
        title: 'Find supplementary angles',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 20 + Math.floor(Math.random() * 140);
                const answer = 180 - a;
                const wrong = [answer + 10, answer - 10, 90 - a, answer + 20].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `If one angle is ${a}°, what is its supplement?`,
                    options: [answer + '°', ...wrong.slice(0, 3).map(w => w + '°')].sort(() => Math.random() - 0.5),
                    answer: answer + '°',
                    explanation: `Supplementary angles add to 180°. ${a}° + ${answer}° = 180°`,
                    hints: ['Supplementary angles sum to 180°', '180 - ' + a + ' = ?']
                });
            }
            return questions;
        }
    },
    // Scale and similar figures
    {
        topic: 'Geometry',
        title: 'Use scale factors',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const original = 2 + Math.floor(Math.random() * 10);
                const scale = 2 + Math.floor(Math.random() * 5);
                const answer = original * scale;
                const wrong = [original + scale, answer - scale, answer + scale, original].filter(w => w !== answer);
                questions.push({
                    question: `A side is ${original} cm. With scale factor ${scale}, what is the new length?`,
                    options: [answer + ' cm', ...wrong.slice(0, 3).map(w => w + ' cm')].sort(() => Math.random() - 0.5),
                    answer: answer + ' cm',
                    explanation: `${original} × ${scale} = ${answer} cm`,
                    hints: ['Multiply the original by the scale factor']
                });
            }
            return questions;
        }
    }
];

// Grade 8 Content
const grade8Templates = [
    // Linear Equations
    {
        topic: 'Algebra',
        title: 'Find slope from two points',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const x1 = Math.floor(Math.random() * 6);
                const y1 = Math.floor(Math.random() * 6);
                const x2 = x1 + 1 + Math.floor(Math.random() * 5);
                const dy = -4 + Math.floor(Math.random() * 9);
                const y2 = y1 + dy;
                const dx = x2 - x1;
                const g = gcd(Math.abs(dy), Math.abs(dx));
                const answer = g === dx ? String(dy / g) : `${dy/g}/${dx/g}`;
                const wrong = [`${dx}/${dy}`, `${-dy/g}/${dx/g}`, String((dy + 1) / dx)].filter(w => w !== answer);
                questions.push({
                    question: `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2})`,
                    options: [answer, ...wrong.slice(0, 3)].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `Slope = (y₂ - y₁)/(x₂ - x₁) = (${y2} - ${y1})/(${x2} - ${x1}) = ${dy}/${dx}`,
                    hints: ['Slope = rise/run', 'slope = (y₂ - y₁)/(x₂ - x₁)']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Algebra',
        title: 'Write slope-intercept form',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const m = -3 + Math.floor(Math.random() * 7);
                const b = -5 + Math.floor(Math.random() * 11);
                const answer = `y = ${m}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}`;
                const wrong = [
                    `y = ${b}x ${m >= 0 ? '+ ' + m : '- ' + Math.abs(m)}`,
                    `y = ${m}x ${-b >= 0 ? '+ ' + (-b) : '- ' + Math.abs(-b)}`,
                    `x = ${m}y ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}`
                ];
                questions.push({
                    question: `Write in slope-intercept form: slope = ${m}, y-intercept = ${b}`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `Slope-intercept form is y = mx + b, so y = ${m}x + ${b}`,
                    hints: ['y = mx + b', 'm is slope, b is y-intercept']
                });
            }
            return questions;
        }
    },
    // Pythagorean Theorem
    {
        topic: 'Geometry',
        title: 'Use Pythagorean theorem',
        generator: () => {
            const questions = [];
            const triples = [[3,4,5], [5,12,13], [6,8,10], [8,15,17], [9,12,15]];
            for (const [a, b, c] of triples) {
                // Find hypotenuse
                const wrong1 = [c - 1, c + 1, a + b, Math.sqrt(a + b)].filter(w => w !== c);
                questions.push({
                    question: `A right triangle has legs ${a} and ${b}. Find the hypotenuse.`,
                    options: [String(c), ...wrong1.slice(0, 3).map(w => String(Math.round(w * 10) / 10))].sort(() => Math.random() - 0.5),
                    answer: String(c),
                    explanation: `c² = a² + b² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}, so c = ${c}`,
                    hints: ['Pythagorean theorem: a² + b² = c²', 'c is the hypotenuse']
                });
                
                // Find leg
                const wrong2 = [a - 1, a + 1, c - b, b + 1].filter(w => w !== a && w > 0);
                questions.push({
                    question: `A right triangle has leg ${b} and hypotenuse ${c}. Find the other leg.`,
                    options: [String(a), ...wrong2.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(a),
                    explanation: `a² = c² - b² = ${c}² - ${b}² = ${c*c} - ${b*b} = ${a*a}, so a = ${a}`,
                    hints: ['Rearrange: a² = c² - b²', `${c}² - ${b}² = ${c*c} - ${b*b}`]
                });
            }
            return questions;
        }
    },
    // Exponents
    {
        topic: 'Algebra',
        title: 'Simplify expressions with exponents',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const base = 2 + Math.floor(Math.random() * 4);
                const exp1 = 2 + Math.floor(Math.random() * 4);
                const exp2 = 1 + Math.floor(Math.random() * 3);
                const answer = `${base}^${exp1 + exp2}`;
                const wrong = [`${base}^${exp1 * exp2}`, `${base * base}^${exp1}`, `${base}^${Math.abs(exp1 - exp2)}`];
                questions.push({
                    question: `Simplify: ${base}^${exp1} × ${base}^${exp2}`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${base}^${exp1} × ${base}^${exp2} = ${base}^(${exp1}+${exp2}) = ${answer}`,
                    hints: ['When multiplying same bases, add exponents', 'aⁿ × aᵐ = aⁿ⁺ᵐ']
                });
            }
            return questions;
        }
    },
    {
        topic: 'Algebra',
        title: 'Divide expressions with exponents',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const base = 2 + Math.floor(Math.random() * 4);
                const exp1 = 4 + Math.floor(Math.random() * 4);
                const exp2 = 1 + Math.floor(Math.random() * (exp1 - 1));
                const answer = `${base}^${exp1 - exp2}`;
                const wrong = [`${base}^${exp1 + exp2}`, `${base}^${exp1 * exp2}`, `1/${base}^${exp2 - exp1}`];
                questions.push({
                    question: `Simplify: ${base}^${exp1} ÷ ${base}^${exp2}`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${base}^${exp1} ÷ ${base}^${exp2} = ${base}^(${exp1}-${exp2}) = ${answer}`,
                    hints: ['When dividing same bases, subtract exponents', 'aⁿ ÷ aᵐ = aⁿ⁻ᵐ']
                });
            }
            return questions;
        }
    },
    // Functions
    {
        topic: 'Algebra',
        title: 'Evaluate functions',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 1 + Math.floor(Math.random() * 5);
                const b = -5 + Math.floor(Math.random() * 11);
                const x = 1 + Math.floor(Math.random() * 8);
                const answer = a * x + b;
                const wrong = [answer - a, answer + a, a * b + x, answer - 1].filter(w => w !== answer);
                questions.push({
                    question: `If f(x) = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}, find f(${x})`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `f(${x}) = ${a}(${x}) ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${a * x} ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${answer}`,
                    hints: ['Substitute the value for x', `f(${x}) means replace x with ${x}`]
                });
            }
            return questions;
        }
    }
];

// Generate Grade 6 sets
let count6 = 1;
grade6Templates.forEach(t => {
    newSets.push({
        id: generateId(6, t.topic, count6++),
        title: t.title,
        grade_level: 6,
        topic: t.topic,
        skill_name: t.title,
        questions: t.generator()
    });
});

// Generate Grade 7 sets
let count7 = 1;
grade7Templates.forEach(t => {
    newSets.push({
        id: generateId(7, t.topic, count7++),
        title: t.title,
        grade_level: 7,
        topic: t.topic,
        skill_name: t.title,
        questions: t.generator()
    });
});

// Generate Grade 8 sets
let count8 = 1;
grade8Templates.forEach(t => {
    newSets.push({
        id: generateId(8, t.topic, count8++),
        title: t.title,
        grade_level: 8,
        topic: t.topic,
        skill_name: t.title,
        questions: t.generator()
    });
});

// Add to curriculum
curriculum.push(...newSets);

fs.writeFileSync('src/data/curriculum.json', JSON.stringify(curriculum, null, 2));

const totalQuestions = newSets.reduce((sum, s) => sum + s.questions.length, 0);
console.log('=== UPPER GRADES EXPANSION ===');
console.log(`Grade 6 sets: ${grade6Templates.length}`);
console.log(`Grade 7 sets: ${grade7Templates.length}`);
console.log(`Grade 8 sets: ${grade8Templates.length}`);
console.log(`Total new sets: ${newSets.length}`);
console.log(`Total new questions: ${totalQuestions}`);
console.log(`Total curriculum sets: ${curriculum.length}`);
