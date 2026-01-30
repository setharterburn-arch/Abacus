/**
 * Curriculum Expansion Script
 * Generates additional question sets to fill gaps vs. IXL
 */

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));

// Track existing set IDs
const existingIds = new Set(curriculum.map(s => s.id));

function generateId(grade, topic, num) {
    const base = `${grade}-${topic.toLowerCase().replace(/\s+/g, '-')}-${num}`;
    let id = base;
    let counter = 1;
    while (existingIds.has(id)) {
        id = `${base}-${counter}`;
        counter++;
    }
    existingIds.add(id);
    return id;
}

// Question templates by topic
const templates = {
    // Grade 2 Addition
    '2-addition-regrouping': {
        grade: 2,
        topic: 'Addition',
        title: 'Add two 2-digit numbers with regrouping',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 15 + Math.floor(Math.random() * 70);
                const b = 15 + Math.floor(Math.random() * (100 - a));
                const answer = a + b;
                const wrong = [answer - 10, answer - 1, answer + 1, answer + 10].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is ${a} + ${b}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} + ${b} = ${answer}. Add the ones first (${a % 10} + ${b % 10}), then add the tens.`,
                    hints: ['Add the ones column first', 'Remember to carry if needed', `${a % 10} + ${b % 10} = ${a % 10 + b % 10}`]
                });
            }
            return questions;
        }
    },
    
    '2-subtraction-regrouping': {
        grade: 2,
        topic: 'Subtraction',
        title: 'Subtract 2-digit numbers with regrouping',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 30 + Math.floor(Math.random() * 70);
                const b = 10 + Math.floor(Math.random() * Math.min(a - 10, 50));
                const answer = a - b;
                const wrong = [answer - 10, answer - 1, answer + 1, answer + 10].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is ${a} - ${b}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} - ${b} = ${answer}. Sometimes you need to borrow from the tens place.`,
                    hints: ['Start with the ones column', 'You may need to borrow from the tens place']
                });
            }
            return questions;
        }
    },

    '2-place-value-hundreds': {
        grade: 2,
        topic: 'Place Value',
        title: 'Identify place value in 3-digit numbers',
        generator: () => {
            const questions = [];
            const places = ['hundreds', 'tens', 'ones'];
            for (let i = 0; i < 10; i++) {
                const num = 100 + Math.floor(Math.random() * 900);
                const digits = [Math.floor(num / 100), Math.floor((num % 100) / 10), num % 10];
                const placeIdx = Math.floor(Math.random() * 3);
                const place = places[placeIdx];
                const answer = digits[placeIdx];
                const wrong = digits.filter(d => d !== answer);
                if (wrong.length < 3) wrong.push(answer + 1, answer + 2);
                questions.push({
                    question: `In the number ${num}, what digit is in the ${place} place?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `In ${num}, the ${place} digit is ${answer}.`,
                    hints: [`The ${place} place is the ${placeIdx === 0 ? 'leftmost' : placeIdx === 1 ? 'middle' : 'rightmost'} digit`]
                });
            }
            return questions;
        }
    },

    // Grade 3 Multiplication
    '3-multiply-by-6': {
        grade: 3,
        topic: 'Multiplication',
        title: 'Multiply by 6: factors up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const answer = 6 * n;
                const wrong = [answer - 6, answer + 6, answer - 1, answer + 1].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is 6 × ${n}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `6 × ${n} = ${answer}. You can think of this as ${n} groups of 6.`,
                    hints: ['Think of 6 groups', 'Count by 6s', `6 + 6 = 12, so 6 × 2 = 12`]
                });
            }
            return questions;
        }
    },

    '3-multiply-by-7': {
        grade: 3,
        topic: 'Multiplication',
        title: 'Multiply by 7: factors up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const answer = 7 * n;
                const wrong = [answer - 7, answer + 7, answer - 1, answer + 1].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is 7 × ${n}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `7 × ${n} = ${answer}. Think of ${n} weeks (7 days each).`,
                    hints: ['There are 7 days in a week', 'Count by 7s']
                });
            }
            return questions;
        }
    },

    '3-multiply-by-8': {
        grade: 3,
        topic: 'Multiplication',
        title: 'Multiply by 8: factors up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const answer = 8 * n;
                const wrong = [answer - 8, answer + 8, answer - 1, answer + 1].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is 8 × ${n}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `8 × ${n} = ${answer}. Double the answer for 4 × ${n} to get 8 × ${n}.`,
                    hints: ['8 is double 4', 'Count by 8s']
                });
            }
            return questions;
        }
    },

    '3-multiply-by-9': {
        grade: 3,
        topic: 'Multiplication',
        title: 'Multiply by 9: factors up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const answer = 9 * n;
                const wrong = [answer - 9, answer + 9, answer - 1, answer + 1].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is 9 × ${n}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `9 × ${n} = ${answer}. Trick: 10 × ${n} - ${n} = ${answer}.`,
                    hints: ['9 is one less than 10', 'The digits of 9 times a number always add up to 9']
                });
            }
            return questions;
        }
    },

    // Grade 3 Division
    '3-divide-by-2': {
        grade: 3,
        topic: 'Division',
        title: 'Divide by 2: quotients up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const dividend = 2 * n;
                const wrong = [n - 1, n + 1, n + 2, n - 2].filter(w => w > 0 && w !== n);
                questions.push({
                    question: `What is ${dividend} ÷ 2?`,
                    options: [String(n), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(n),
                    explanation: `${dividend} ÷ 2 = ${n}. Division is the opposite of multiplication: 2 × ${n} = ${dividend}.`,
                    hints: ['Division is splitting into equal groups', 'Think: 2 times what equals ' + dividend + '?']
                });
            }
            return questions;
        }
    },

    '3-divide-by-3': {
        grade: 3,
        topic: 'Division',
        title: 'Divide by 3: quotients up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const dividend = 3 * n;
                const wrong = [n - 1, n + 1, n + 2, n - 2].filter(w => w > 0 && w !== n);
                questions.push({
                    question: `What is ${dividend} ÷ 3?`,
                    options: [String(n), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(n),
                    explanation: `${dividend} ÷ 3 = ${n}. Think: 3 times what equals ${dividend}?`,
                    hints: ['How many groups of 3 fit into ' + dividend + '?']
                });
            }
            return questions;
        }
    },

    '3-divide-by-4': {
        grade: 3,
        topic: 'Division',
        title: 'Divide by 4: quotients up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const dividend = 4 * n;
                const wrong = [n - 1, n + 1, n + 2, n - 2].filter(w => w > 0 && w !== n);
                questions.push({
                    question: `What is ${dividend} ÷ 4?`,
                    options: [String(n), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(n),
                    explanation: `${dividend} ÷ 4 = ${n}. Think: 4 times what equals ${dividend}?`,
                    hints: ['4 quarters make a dollar', 'How many groups of 4?']
                });
            }
            return questions;
        }
    },

    '3-divide-by-5': {
        grade: 3,
        topic: 'Division',
        title: 'Divide by 5: quotients up to 10',
        generator: () => {
            const questions = [];
            for (let n = 1; n <= 10; n++) {
                const dividend = 5 * n;
                const wrong = [n - 1, n + 1, n + 2, n - 2].filter(w => w > 0 && w !== n);
                questions.push({
                    question: `What is ${dividend} ÷ 5?`,
                    options: [String(n), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(n),
                    explanation: `${dividend} ÷ 5 = ${n}. Count by 5s to find how many 5s are in ${dividend}.`,
                    hints: ['Count by 5s: 5, 10, 15, 20...', 'Think: 5 times what equals ' + dividend + '?']
                });
            }
            return questions;
        }
    },

    // Grade 3 Fractions
    '3-identify-fractions': {
        grade: 3,
        topic: 'Fractions',
        title: 'Identify fractions from models',
        generator: () => {
            const questions = [];
            const fractions = [[1,2], [1,3], [2,3], [1,4], [2,4], [3,4], [1,5], [2,5], [3,5], [4,5]];
            for (const [num, denom] of fractions) {
                const answer = `${num}/${denom}`;
                const wrong = [`${num + 1}/${denom}`, `${num}/${denom + 1}`, `${denom}/${num}`, `${num - 1 || 1}/${denom}`]
                    .filter(w => w !== answer && !w.startsWith('0/'));
                questions.push({
                    question: `A shape is divided into ${denom} equal parts. ${num} parts are shaded. What fraction is shaded?`,
                    options: [answer, ...wrong.slice(0, 3)].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `When ${num} out of ${denom} parts are shaded, the fraction is ${num}/${denom}.`,
                    hints: ['The top number (numerator) is how many parts are shaded', 'The bottom number (denominator) is the total parts']
                });
            }
            return questions;
        }
    },

    '3-compare-fractions-same-denom': {
        grade: 3,
        topic: 'Fractions',
        title: 'Compare fractions with same denominators',
        generator: () => {
            const questions = [];
            const denoms = [2, 3, 4, 5, 6, 8];
            for (let i = 0; i < 10; i++) {
                const denom = denoms[Math.floor(Math.random() * denoms.length)];
                const num1 = 1 + Math.floor(Math.random() * (denom - 1));
                let num2 = 1 + Math.floor(Math.random() * (denom - 1));
                while (num2 === num1) num2 = 1 + Math.floor(Math.random() * (denom - 1));
                
                const frac1 = `${num1}/${denom}`;
                const frac2 = `${num2}/${denom}`;
                const answer = num1 > num2 ? '>' : '<';
                
                questions.push({
                    question: `Compare: ${frac1} __ ${frac2}. Which symbol goes in the blank?`,
                    options: ['>', '<', '='],
                    answer: answer,
                    explanation: `${frac1} ${answer} ${frac2}. When denominators are the same, compare the numerators.`,
                    hints: ['Same denominator = same size pieces', 'Which has more pieces?']
                });
            }
            return questions;
        }
    },

    // Grade 4 Multi-digit Multiplication
    '4-multiply-2digit-by-1digit': {
        grade: 4,
        topic: 'Multiplication',
        title: 'Multiply 2-digit by 1-digit numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 12 + Math.floor(Math.random() * 88);
                const b = 2 + Math.floor(Math.random() * 8);
                const answer = a * b;
                const wrong = [answer - b, answer + b, answer - 10, answer + 10].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is ${a} × ${b}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} × ${b} = ${answer}. Multiply ${b} by each digit of ${a} and add.`,
                    hints: ['Break it into parts: multiply ones, then tens', `${b} × ${a % 10} = ${b * (a % 10)}`]
                });
            }
            return questions;
        }
    },

    '4-multiply-2digit-by-2digit': {
        grade: 4,
        topic: 'Multiplication',
        title: 'Multiply 2-digit by 2-digit numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = 11 + Math.floor(Math.random() * 30);
                const b = 11 + Math.floor(Math.random() * 30);
                const answer = a * b;
                const wrong = [answer - 100, answer + 100, answer - 50, answer + 50].filter(w => w > 0 && w !== answer);
                questions.push({
                    question: `What is ${a} × ${b}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a} × ${b} = ${answer}. Use the standard algorithm or area model.`,
                    hints: ['Break into parts: (tens × tens) + (tens × ones) + (ones × tens) + (ones × ones)']
                });
            }
            return questions;
        }
    },

    // Grade 4 Division
    '4-divide-2digit-by-1digit': {
        grade: 4,
        topic: 'Division',
        title: 'Divide 2-digit by 1-digit numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const divisor = 2 + Math.floor(Math.random() * 8);
                const quotient = 3 + Math.floor(Math.random() * 15);
                const dividend = divisor * quotient;
                const wrong = [quotient - 1, quotient + 1, quotient + 2, quotient - 2].filter(w => w > 0 && w !== quotient);
                questions.push({
                    question: `What is ${dividend} ÷ ${divisor}?`,
                    options: [String(quotient), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(quotient),
                    explanation: `${dividend} ÷ ${divisor} = ${quotient}. Check: ${divisor} × ${quotient} = ${dividend}.`,
                    hints: ['Think: how many groups of ' + divisor + ' fit in ' + dividend + '?']
                });
            }
            return questions;
        }
    },

    // Grade 4 Fractions
    '4-add-fractions-same-denom': {
        grade: 4,
        topic: 'Fractions',
        title: 'Add fractions with same denominators',
        generator: () => {
            const questions = [];
            const denoms = [4, 5, 6, 8, 10];
            for (let i = 0; i < 10; i++) {
                const denom = denoms[Math.floor(Math.random() * denoms.length)];
                const num1 = 1 + Math.floor(Math.random() * (denom - 2));
                const num2 = 1 + Math.floor(Math.random() * (denom - num1));
                const answerNum = num1 + num2;
                const answer = `${answerNum}/${denom}`;
                const wrong = [`${answerNum + 1}/${denom}`, `${answerNum}/${denom + 1}`, `${num1}/${denom + denom}`];
                questions.push({
                    question: `What is ${num1}/${denom} + ${num2}/${denom}?`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${num1}/${denom} + ${num2}/${denom} = ${answer}. Add the numerators, keep the denominator.`,
                    hints: ['When denominators are the same, just add the numerators', `${num1} + ${num2} = ${answerNum}`]
                });
            }
            return questions;
        }
    },

    '4-subtract-fractions-same-denom': {
        grade: 4,
        topic: 'Fractions',
        title: 'Subtract fractions with same denominators',
        generator: () => {
            const questions = [];
            const denoms = [4, 5, 6, 8, 10];
            for (let i = 0; i < 10; i++) {
                const denom = denoms[Math.floor(Math.random() * denoms.length)];
                const num1 = 2 + Math.floor(Math.random() * (denom - 2));
                const num2 = 1 + Math.floor(Math.random() * (num1 - 1));
                const answerNum = num1 - num2;
                const answer = `${answerNum}/${denom}`;
                const wrong = [`${answerNum + 1}/${denom}`, `${num1}/${denom}`, `${num2}/${denom}`];
                questions.push({
                    question: `What is ${num1}/${denom} - ${num2}/${denom}?`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${num1}/${denom} - ${num2}/${denom} = ${answer}. Subtract the numerators, keep the denominator.`,
                    hints: ['When denominators are the same, just subtract the numerators', `${num1} - ${num2} = ${answerNum}`]
                });
            }
            return questions;
        }
    },

    // Grade 4 Decimals
    '4-decimals-place-value': {
        grade: 4,
        topic: 'Decimals',
        title: 'Identify decimal place values',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const ones = Math.floor(Math.random() * 10);
                const tenths = Math.floor(Math.random() * 10);
                const hundredths = Math.floor(Math.random() * 10);
                const num = `${ones}.${tenths}${hundredths}`;
                
                const places = ['ones', 'tenths', 'hundredths'];
                const values = [ones, tenths, hundredths];
                const placeIdx = Math.floor(Math.random() * 3);
                
                const answer = values[placeIdx];
                const wrong = values.filter(v => v !== answer);
                if (wrong.length < 3) wrong.push((answer + 1) % 10, (answer + 2) % 10);
                
                questions.push({
                    question: `In ${num}, what digit is in the ${places[placeIdx]} place?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `In ${num}, the ${places[placeIdx]} digit is ${answer}.`,
                    hints: ['Tenths is right after the decimal point', 'Hundredths is two places after the decimal']
                });
            }
            return questions;
        }
    },

    '4-compare-decimals': {
        grade: 4,
        topic: 'Decimals',
        title: 'Compare decimal numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const makeDecimal = () => (Math.floor(Math.random() * 100) / 10).toFixed(1);
                let a = parseFloat(makeDecimal());
                let b = parseFloat(makeDecimal());
                while (a === b) b = parseFloat(makeDecimal());
                
                const answer = a > b ? '>' : '<';
                questions.push({
                    question: `Compare: ${a} __ ${b}. Which symbol goes in the blank?`,
                    options: ['>', '<', '='],
                    answer: answer,
                    explanation: `${a} ${answer} ${b}. Compare the digits from left to right.`,
                    hints: ['Compare the ones place first', 'If ones are equal, compare tenths']
                });
            }
            return questions;
        }
    },

    // Grade 5 Operations with Decimals
    '5-add-decimals': {
        grade: 5,
        topic: 'Decimals',
        title: 'Add decimal numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = (Math.floor(Math.random() * 100) / 10).toFixed(1);
                const b = (Math.floor(Math.random() * 100) / 10).toFixed(1);
                const answer = (parseFloat(a) + parseFloat(b)).toFixed(1);
                const wrong = [(parseFloat(answer) + 0.1).toFixed(1), (parseFloat(answer) - 0.1).toFixed(1), (parseFloat(answer) + 1).toFixed(1)];
                questions.push({
                    question: `What is ${a} + ${b}?`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${a} + ${b} = ${answer}. Line up the decimal points and add.`,
                    hints: ['Line up the decimal points', 'Add as you would whole numbers, keeping the decimal in place']
                });
            }
            return questions;
        }
    },

    '5-subtract-decimals': {
        grade: 5,
        topic: 'Decimals',
        title: 'Subtract decimal numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = (5 + Math.floor(Math.random() * 50) / 10).toFixed(1);
                const b = (Math.floor(Math.random() * parseFloat(a) * 10) / 10).toFixed(1);
                const answer = (parseFloat(a) - parseFloat(b)).toFixed(1);
                const wrong = [(parseFloat(answer) + 0.1).toFixed(1), (parseFloat(answer) - 0.1).toFixed(1), (parseFloat(answer) + 1).toFixed(1)];
                questions.push({
                    question: `What is ${a} - ${b}?`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${a} - ${b} = ${answer}. Line up the decimal points and subtract.`,
                    hints: ['Line up the decimal points first', 'You may need to borrow']
                });
            }
            return questions;
        }
    },

    '5-multiply-decimals': {
        grade: 5,
        topic: 'Decimals',
        title: 'Multiply decimal numbers',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const a = (1 + Math.floor(Math.random() * 50) / 10).toFixed(1);
                const b = Math.floor(Math.random() * 9) + 2;
                const answer = (parseFloat(a) * b).toFixed(1);
                const wrong = [(parseFloat(answer) + 0.1).toFixed(1), (parseFloat(answer) - 0.1).toFixed(1), (parseFloat(answer) * 10).toFixed(0)];
                questions.push({
                    question: `What is ${a} × ${b}?`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${a} × ${b} = ${answer}. Multiply as whole numbers, then count decimal places.`,
                    hints: ['Multiply the numbers ignoring the decimal', 'Count the total decimal places in the factors']
                });
            }
            return questions;
        }
    },

    // Grade 5 Fractions
    '5-add-fractions-diff-denom': {
        grade: 5,
        topic: 'Fractions',
        title: 'Add fractions with different denominators',
        generator: () => {
            const questions = [];
            const pairs = [[2, 4], [3, 6], [2, 6], [3, 4], [4, 8], [2, 3], [4, 6]];
            for (let i = 0; i < 10; i++) {
                const [d1, d2] = pairs[Math.floor(Math.random() * pairs.length)];
                const n1 = 1;
                const n2 = 1;
                // Find LCD
                const lcd = d1 === d2 ? d1 : (d1 * d2) / gcd(d1, d2);
                const answerNum = (n1 * (lcd / d1)) + (n2 * (lcd / d2));
                const answer = `${answerNum}/${lcd}`;
                const wrong = [`${answerNum + 1}/${lcd}`, `${n1 + n2}/${d1 + d2}`, `${answerNum}/${lcd + 1}`];
                questions.push({
                    question: `What is ${n1}/${d1} + ${n2}/${d2}?`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `First find a common denominator (${lcd}), then add the numerators.`,
                    hints: ['Find a common denominator first', `${d1} and ${d2} both divide evenly into ${lcd}`]
                });
            }
            return questions;
        }
    },

    // Grade 5 Percentages
    '5-percent-of-100': {
        grade: 5,
        topic: 'Percentages',
        title: 'Find percentages of 100',
        generator: () => {
            const questions = [];
            const percents = [10, 20, 25, 50, 75, 30, 40, 60, 80, 90];
            for (const p of percents) {
                const answer = p;
                const wrong = [p + 10, p - 10, p + 5].filter(w => w >= 0 && w <= 100 && w !== p);
                questions.push({
                    question: `What is ${p}% of 100?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${p}% of 100 = ${p}. Percent means "per hundred."`,
                    hints: ['% means out of 100', `${p}% = ${p} per hundred`]
                });
            }
            return questions;
        }
    },

    // Grade 6 Ratios
    '6-simplify-ratios': {
        grade: 6,
        topic: 'Ratios',
        title: 'Simplify ratios to lowest terms',
        generator: () => {
            const questions = [];
            const ratios = [[2, 4], [3, 6], [4, 8], [6, 9], [8, 12], [10, 15], [12, 16], [15, 20], [18, 24], [20, 30]];
            for (const [a, b] of ratios) {
                const g = gcd(a, b);
                const answer = `${a/g}:${b/g}`;
                const wrong = [`${a}:${b}`, `${b/g}:${a/g}`, `${a/g + 1}:${b/g}`];
                questions.push({
                    question: `Simplify the ratio ${a}:${b}`,
                    options: [answer, ...wrong].sort(() => Math.random() - 0.5),
                    answer: answer,
                    explanation: `${a}:${b} simplifies to ${answer} (divide both by ${g}).`,
                    hints: ['Find the GCF of both numbers', 'Divide both parts by the GCF']
                });
            }
            return questions;
        }
    },

    '6-unit-rates': {
        grade: 6,
        topic: 'Ratios',
        title: 'Find unit rates',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const rate = 2 + Math.floor(Math.random() * 10);
                const quantity = 2 + Math.floor(Math.random() * 8);
                const total = rate * quantity;
                const wrong = [rate + 1, rate - 1, rate + 2].filter(w => w > 0 && w !== rate);
                questions.push({
                    question: `If ${quantity} items cost $${total}, how much does 1 item cost?`,
                    options: [`$${rate}`, ...wrong.slice(0, 3).map(w => `$${w}`)].sort(() => Math.random() - 0.5),
                    answer: `$${rate}`,
                    explanation: `$${total} ÷ ${quantity} items = $${rate} per item.`,
                    hints: ['Divide the total by the number of items', `${total} ÷ ${quantity} = ?`]
                });
            }
            return questions;
        }
    },

    // Grade 6 Expressions
    '6-evaluate-expressions': {
        grade: 6,
        topic: 'Algebra',
        title: 'Evaluate expressions with variables',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const x = 2 + Math.floor(Math.random() * 8);
                const a = 2 + Math.floor(Math.random() * 6);
                const b = Math.floor(Math.random() * 10);
                const answer = a * x + b;
                const wrong = [answer - a, answer + a, a * x].filter(w => w !== answer);
                questions.push({
                    question: `If x = ${x}, what is ${a}x + ${b}?`,
                    options: [String(answer), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(answer),
                    explanation: `${a}x + ${b} = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}`,
                    hints: ['Substitute the value of x', `${a} × ${x} = ${a * x}`]
                });
            }
            return questions;
        }
    },

    '6-one-step-equations': {
        grade: 6,
        topic: 'Algebra',
        title: 'Solve one-step equations',
        generator: () => {
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const x = 2 + Math.floor(Math.random() * 15);
                const b = 2 + Math.floor(Math.random() * 10);
                const sum = x + b;
                const wrong = [x - 1, x + 1, x + 2].filter(w => w > 0 && w !== x);
                questions.push({
                    question: `Solve: x + ${b} = ${sum}`,
                    options: [String(x), ...wrong.slice(0, 3).map(String)].sort(() => Math.random() - 0.5),
                    answer: String(x),
                    explanation: `x + ${b} = ${sum}, so x = ${sum} - ${b} = ${x}`,
                    hints: ['Subtract the same number from both sides', `${sum} - ${b} = ?`]
                });
            }
            return questions;
        }
    }
};

// Helper function for GCD
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Generate all new sets
const newSets = [];
let questionsAdded = 0;

Object.entries(templates).forEach(([key, template]) => {
    const questions = template.generator();
    const set = {
        id: generateId(template.grade, template.topic, key.split('-').pop()),
        title: template.title,
        grade_level: template.grade,
        topic: template.topic,
        skill_name: template.title,
        questions: questions
    };
    newSets.push(set);
    questionsAdded += questions.length;
});

// Add to curriculum
curriculum.push(...newSets);

// Save
fs.writeFileSync('src/data/curriculum.json', JSON.stringify(curriculum, null, 2));

console.log('=== CURRICULUM EXPANSION COMPLETE ===');
console.log(`New skill sets added: ${newSets.length}`);
console.log(`New questions added: ${questionsAdded}`);
console.log(`Total sets now: ${curriculum.length}`);
console.log(`Total questions now: ${curriculum.reduce((sum, s) => sum + (s.questions?.length || 0), 0)}`);
