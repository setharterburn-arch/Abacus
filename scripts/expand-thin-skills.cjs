/**
 * Expand Thin Skills with Algorithmically Generated Questions
 * Uses questionGenerators logic to bulk up skills to 25+ questions
 * Run: node scripts/expand-thin-skills.cjs
 */

const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.json');
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

// ========== QUESTION GENERATORS (copied from questionGenerators.js) ==========

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const nearbyWrong = (correct, count = 3, range = null) => {
  const r = range || Math.max(3, Math.ceil(Math.abs(correct) * 0.3));
  const wrongs = new Set();
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    const offset = rand(-r, r);
    const wrong = correct + offset;
    if (offset !== 0 && wrong >= 0) wrongs.add(wrong);
    attempts++;
  }
  // Fill with simple offsets if needed
  while (wrongs.size < count) {
    wrongs.add(correct + wrongs.size + 1);
  }
  return [...wrongs];
};

// Addition
const generateAddition = (grade = 1, difficulty = 'medium') => {
  let a, b, max;
  if (grade === 0) { max = 10; a = rand(1, 5); b = rand(1, 5); }
  else if (grade === 1) { max = difficulty === 'easy' ? 10 : 20; a = rand(1, Math.floor(max/2)); b = rand(1, Math.floor(max/2)); }
  else if (grade === 2) { max = difficulty === 'easy' ? 50 : 100; a = rand(10, Math.floor(max/2)); b = rand(10, Math.floor(max/2)); }
  else if (grade === 3) { max = difficulty === 'easy' ? 500 : 1000; a = rand(100, Math.floor(max/2)); b = rand(100, Math.floor(max/2)); }
  else { max = 10000; a = rand(100, Math.floor(max/2)); b = rand(100, Math.floor(max/2)); }
  
  const answer = a + b;
  const options = shuffle([answer, ...nearbyWrong(answer)]);
  return {
    question: `What is ${a.toLocaleString()} + ${b.toLocaleString()}?`,
    options: options.map(String),
    answer: String(answer),
    type: 'multiple_choice'
  };
};

// Subtraction
const generateSubtraction = (grade = 1, difficulty = 'medium') => {
  let a, b;
  if (grade === 0) { a = rand(5, 10); b = rand(1, 4); }
  else if (grade === 1) { a = rand(10, 20); b = rand(1, 9); }
  else if (grade === 2) { a = rand(20, 100); b = rand(5, 30); }
  else if (grade === 3) { a = rand(100, 500); b = rand(20, 200); }
  else { a = rand(500, 5000); b = rand(100, 1000); }
  if (b > a) [a, b] = [b, a];
  
  const answer = a - b;
  const options = shuffle([answer, ...nearbyWrong(answer)]);
  return {
    question: `What is ${a.toLocaleString()} - ${b.toLocaleString()}?`,
    options: options.map(String),
    answer: String(answer),
    type: 'multiple_choice'
  };
};

// Multiplication
const generateMultiplication = (grade = 3, difficulty = 'medium') => {
  let a, b;
  if (grade <= 2) { a = rand(1, 5); b = rand(1, 5); }
  else if (grade === 3) { a = rand(2, difficulty === 'easy' ? 5 : 9); b = rand(2, difficulty === 'easy' ? 5 : 9); }
  else if (grade === 4) { a = rand(2, 12); b = rand(2, 12); }
  else { a = rand(10, 50); b = rand(2, 20); }
  
  const answer = a * b;
  const options = shuffle([answer, ...nearbyWrong(answer, 3, Math.max(5, Math.floor(answer * 0.2)))]);
  return {
    question: `What is ${a} × ${b}?`,
    options: options.map(String),
    answer: String(answer),
    type: 'multiple_choice'
  };
};

// Division
const generateDivision = (grade = 3, difficulty = 'medium') => {
  let divisor, quotient;
  if (grade <= 3) { divisor = rand(2, 9); quotient = rand(2, 10); }
  else if (grade === 4) { divisor = rand(2, 12); quotient = rand(5, 15); }
  else { divisor = rand(5, 20); quotient = rand(10, 50); }
  
  const dividend = divisor * quotient;
  const options = shuffle([quotient, ...nearbyWrong(quotient)]);
  return {
    question: `What is ${dividend} ÷ ${divisor}?`,
    options: options.map(String),
    answer: String(quotient),
    type: 'multiple_choice'
  };
};

// Fractions - comparing
const generateFractionCompare = (grade = 3) => {
  const d = pick([2, 3, 4, 5, 6, 8]);
  const n1 = rand(1, d - 1);
  const n2 = rand(1, d - 1);
  while (n1 === n2) n2 = rand(1, d - 1);
  
  const answer = n1 > n2 ? '>' : n1 < n2 ? '<' : '=';
  return {
    question: `Compare: ${n1}/${d} ___ ${n2}/${d}`,
    options: shuffle(['>', '<', '=']),
    answer: answer,
    type: 'multiple_choice'
  };
};

// Fractions - adding with same denominator
const generateFractionAdd = (grade = 4) => {
  const d = pick([2, 3, 4, 5, 6, 8, 10]);
  const n1 = rand(1, d - 1);
  const n2 = rand(1, d - n1);
  const sum = n1 + n2;
  
  return {
    question: `What is ${n1}/${d} + ${n2}/${d}?`,
    options: shuffle([`${sum}/${d}`, `${sum}/${d*2}`, `${n1}/${d}`, `${n2}/${d}`]),
    answer: `${sum}/${d}`,
    type: 'multiple_choice'
  };
};

// Decimals
const generateDecimal = (grade = 4, operation = 'add') => {
  const places = grade <= 4 ? 1 : 2;
  const mult = Math.pow(10, places);
  const a = rand(10, 100) / mult;
  const b = rand(10, 100) / mult;
  
  let answer, question;
  if (operation === 'add') {
    answer = (a + b).toFixed(places);
    question = `What is ${a.toFixed(places)} + ${b.toFixed(places)}?`;
  } else {
    const [big, small] = a > b ? [a, b] : [b, a];
    answer = (big - small).toFixed(places);
    question = `What is ${big.toFixed(places)} - ${small.toFixed(places)}?`;
  }
  
  const options = shuffle([answer, ...nearbyWrong(parseFloat(answer), 3, 0.5).map(n => n.toFixed(places))]);
  return { question, options, answer, type: 'multiple_choice' };
};

// Place Value
const generatePlaceValue = (grade = 2) => {
  let num;
  if (grade <= 1) num = rand(10, 99);
  else if (grade === 2) num = rand(100, 999);
  else num = rand(1000, 9999);
  
  const places = ['ones', 'tens', 'hundreds', 'thousands'];
  const numStr = String(num);
  const placeIdx = rand(0, Math.min(places.length - 1, numStr.length - 1));
  const place = places[placeIdx];
  const digit = parseInt(numStr[numStr.length - 1 - placeIdx]);
  
  const options = shuffle([digit, ...nearbyWrong(digit, 3, 5).map(n => Math.abs(n) % 10)]);
  return {
    question: `What digit is in the ${place} place of ${num.toLocaleString()}?`,
    options: options.map(String),
    answer: String(digit),
    type: 'multiple_choice'
  };
};

// Counting/Patterns
const generateCounting = (grade = 0) => {
  const start = rand(1, 20);
  const patterns = [
    { skip: 1, name: '1s' },
    { skip: 2, name: '2s' },
    { skip: 5, name: '5s' },
    { skip: 10, name: '10s' }
  ];
  const pattern = pick(patterns);
  const seq = [start, start + pattern.skip, start + pattern.skip * 2];
  const answer = start + pattern.skip * 3;
  
  const options = shuffle([answer, ...nearbyWrong(answer, 3, pattern.skip * 2)]);
  return {
    question: `Count by ${pattern.name}: ${seq.join(', ')}, ___?`,
    options: options.map(String),
    answer: String(answer),
    type: 'multiple_choice'
  };
};

// Word Problems
const generateWordProblem = (grade = 2, operation = 'add') => {
  const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'];
  const items = ['apples', 'books', 'stickers', 'marbles', 'coins'];
  const name = pick(names);
  const item = pick(items);
  
  let a, b, answer, question;
  if (grade <= 2) { a = rand(5, 20); b = rand(3, 15); }
  else { a = rand(20, 100); b = rand(10, 50); }
  
  if (operation === 'add') {
    answer = a + b;
    question = `${name} has ${a} ${item}. They get ${b} more. How many ${item} does ${name} have now?`;
  } else if (operation === 'subtract') {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
    question = `${name} has ${a} ${item}. They give away ${b}. How many ${item} does ${name} have left?`;
  } else if (operation === 'multiply') {
    a = rand(2, 10); b = rand(2, 10);
    answer = a * b;
    question = `${name} has ${a} bags with ${b} ${item} in each. How many ${item} in total?`;
  } else {
    const divisor = rand(2, 8);
    const quotient = rand(3, 10);
    const total = divisor * quotient;
    answer = quotient;
    question = `${name} has ${total} ${item} to share equally among ${divisor} friends. How many ${item} does each friend get?`;
  }
  
  const options = shuffle([answer, ...nearbyWrong(answer)]);
  return { question, options: options.map(String), answer: String(answer), type: 'multiple_choice' };
};

// Geometry - shapes
const generateGeometry = (grade = 0) => {
  const shapes = [
    { name: 'triangle', sides: 3 },
    { name: 'square', sides: 4 },
    { name: 'rectangle', sides: 4 },
    { name: 'pentagon', sides: 5 },
    { name: 'hexagon', sides: 6 },
    { name: 'octagon', sides: 8 }
  ];
  const shape = pick(shapes);
  const options = shuffle([shape.sides, ...nearbyWrong(shape.sides, 3, 2).map(n => Math.max(3, n))]);
  
  return {
    question: `How many sides does a ${shape.name} have?`,
    options: options.map(String),
    answer: String(shape.sides),
    type: 'multiple_choice'
  };
};

// Area/Perimeter
const generateAreaPerimeter = (grade = 3, type = 'area') => {
  const l = rand(3, 12);
  const w = rand(3, 12);
  
  if (type === 'area') {
    const answer = l * w;
    const options = shuffle([answer, ...nearbyWrong(answer, 3, 10)]);
    return {
      question: `What is the area of a rectangle with length ${l} and width ${w}?`,
      options: options.map(n => `${n} square units`),
      answer: `${answer} square units`,
      type: 'multiple_choice'
    };
  } else {
    const answer = 2 * (l + w);
    const options = shuffle([answer, ...nearbyWrong(answer, 3, 5)]);
    return {
      question: `What is the perimeter of a rectangle with length ${l} and width ${w}?`,
      options: options.map(n => `${n} units`),
      answer: `${answer} units`,
      type: 'multiple_choice'
    };
  }
};

// Ratios
const generateRatio = (grade = 6) => {
  const a = rand(2, 10);
  const b = rand(2, 10);
  const mult = rand(2, 5);
  
  return {
    question: `If the ratio is ${a}:${b}, what is ${a * mult}:___?`,
    options: shuffle([b * mult, b * mult + 1, b * mult - 1, b * (mult + 1)].map(String)),
    answer: String(b * mult),
    type: 'multiple_choice'
  };
};

// Percentages
const generatePercentage = (grade = 5) => {
  const percents = [10, 20, 25, 50, 75, 100];
  const pct = pick(percents);
  const whole = pick([20, 40, 50, 80, 100, 200]);
  const answer = (pct / 100) * whole;
  
  const options = shuffle([answer, ...nearbyWrong(answer, 3, Math.max(5, answer * 0.3))]);
  return {
    question: `What is ${pct}% of ${whole}?`,
    options: options.map(String),
    answer: String(answer),
    type: 'multiple_choice'
  };
};

// ========== TOPIC MAPPING ==========

const getGeneratorForTopic = (topic, grade) => {
  const t = (topic || '').toLowerCase();
  const g = grade || 0;
  
  if (t.includes('add')) return () => generateAddition(g);
  if (t.includes('subtract')) return () => generateSubtraction(g);
  if (t.includes('multipl') || t.includes('times')) return () => generateMultiplication(g);
  if (t.includes('divis') || t.includes('divide')) return () => generateDivision(g);
  if (t.includes('frac')) return () => pick([generateFractionCompare, generateFractionAdd])(g);
  if (t.includes('decimal')) return () => generateDecimal(g, pick(['add', 'subtract']));
  if (t.includes('place value')) return () => generatePlaceValue(g);
  if (t.includes('count') || t.includes('pattern')) return () => generateCounting(g);
  if (t.includes('word') || t.includes('problem')) return () => generateWordProblem(g, pick(['add', 'subtract', 'multiply', 'divide']));
  if (t.includes('geometry') || t.includes('shape')) return () => generateGeometry(g);
  if (t.includes('area') || t.includes('perimeter') || t.includes('measure')) return () => generateAreaPerimeter(g, pick(['area', 'perimeter']));
  if (t.includes('ratio')) return () => generateRatio(g);
  if (t.includes('percent')) return () => generatePercentage(g);
  if (t.includes('integer')) return () => pick([generateAddition, generateSubtraction])(g);
  
  // Default: arithmetic based on grade
  if (g <= 1) return () => pick([generateAddition, generateSubtraction])(g);
  if (g <= 3) return () => pick([generateAddition, generateSubtraction, generateMultiplication])(g);
  return () => pick([generateAddition, generateSubtraction, generateMultiplication, generateDivision])(g);
};

// ========== MAIN EXPANSION LOGIC ==========

const TARGET_QUESTIONS = 25;
let totalGenerated = 0;
let skillsExpanded = 0;

console.log('=== Expanding Thin Skills ===\n');

curriculum.forEach(skill => {
  const currentCount = skill.questions?.length || 0;
  if (currentCount >= TARGET_QUESTIONS) return;
  
  const needed = TARGET_QUESTIONS - currentCount;
  const grade = skill.grade_level ?? skill.grade ?? 0;
  const topic = skill.topic || skill.title || '';
  
  const generator = getGeneratorForTopic(topic, grade);
  const existingQuestions = new Set((skill.questions || []).map(q => q.question?.toLowerCase().trim()));
  
  let generated = 0;
  let attempts = 0;
  const maxAttempts = needed * 5;
  
  while (generated < needed && attempts < maxAttempts) {
    try {
      const q = generator();
      const qKey = q.question.toLowerCase().trim();
      
      if (!existingQuestions.has(qKey)) {
        skill.questions = skill.questions || [];
        skill.questions.push(q);
        existingQuestions.add(qKey);
        generated++;
        totalGenerated++;
      }
    } catch (e) {
      // Skip errors, try again
    }
    attempts++;
  }
  
  if (generated > 0) {
    skillsExpanded++;
    if (skillsExpanded <= 20) {
      console.log(`[G${grade}] ${skill.title}: +${generated} questions (${currentCount} → ${skill.questions.length})`);
    }
  }
});

if (skillsExpanded > 20) {
  console.log(`... and ${skillsExpanded - 20} more skills`);
}

console.log(`\n=== Summary ===`);
console.log(`Skills expanded: ${skillsExpanded}`);
console.log(`Questions generated: ${totalGenerated}`);

// Final stats
const finalTotal = curriculum.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
const stillThin = curriculum.filter(s => (s.questions?.length || 0) < TARGET_QUESTIONS).length;

console.log(`\nTotal questions now: ${finalTotal}`);
console.log(`Skills still under ${TARGET_QUESTIONS} questions: ${stillThin}`);

// Save
fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2));
console.log(`\n✅ Saved expanded curriculum`);
