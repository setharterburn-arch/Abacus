/**
 * Expand Question Sets
 * Add more questions to sets with fewer than target count
 */

const fs = require('fs');
const path = require('path');

const CURRICULUM_PATH = path.join(__dirname, '../src/data/curriculum.json');
const TARGET_QUESTIONS = 12;

// Question generators by topic/type
const generators = {
  // Addition fact generators
  addition: {
    patterns: [
      { template: (a, b) => ({ q: `${a} + ${b} = ?`, a: a + b }), maxA: 20, maxB: 20 },
      { template: (a, b) => ({ q: `What is ${a} plus ${b}?`, a: a + b }), maxA: 20, maxB: 20 },
      { template: (a, b) => ({ q: `${a} + ? = ${a + b}`, a: b }), maxA: 15, maxB: 15 }
    ],
    generateOptions: (answer) => {
      const opts = new Set([answer]);
      while (opts.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        if (offset !== 0) opts.add(answer + offset);
      }
      return [...opts].map(String).sort(() => Math.random() - 0.5);
    },
    getHint: (a, b) => `Count ${a}, then count up ${b} more`
  },

  // Subtraction generators
  subtraction: {
    patterns: [
      { template: (a, b) => ({ q: `${a} - ${b} = ?`, a: a - b }), minA: 5, maxA: 20, maxB: 10 },
      { template: (a, b) => ({ q: `What is ${a} minus ${b}?`, a: a - b }), minA: 5, maxA: 20, maxB: 10 },
      { template: (a, b) => ({ q: `${a} - ? = ${a - b}`, a: b }), minA: 5, maxA: 20, maxB: 10 }
    ],
    generateOptions: (answer) => {
      const opts = new Set([answer]);
      while (opts.size < 4) {
        const offset = Math.floor(Math.random() * 8) - 4;
        if (offset !== 0 && answer + offset >= 0) opts.add(answer + offset);
      }
      return [...opts].map(String).sort(() => Math.random() - 0.5);
    },
    getHint: (a, b) => `Start at ${a} and count back ${b}`
  },

  // Multiplication generators
  multiplication: {
    patterns: [
      { template: (a, b) => ({ q: `${a} × ${b} = ?`, a: a * b }), maxA: 12, maxB: 12 },
      { template: (a, b) => ({ q: `What is ${a} times ${b}?`, a: a * b }), maxA: 12, maxB: 12 },
      { template: (a, b) => ({ q: `${a} groups of ${b} = ?`, a: a * b }), maxA: 10, maxB: 10 }
    ],
    generateOptions: (answer, a, b) => {
      const opts = new Set([answer]);
      // Add common mistakes
      opts.add(a + b);  // Adding instead of multiplying
      opts.add(answer + a);
      opts.add(answer - b);
      while (opts.size < 4) {
        opts.add(answer + Math.floor(Math.random() * 20) - 10);
      }
      return [...opts].filter(o => o > 0).slice(0, 4).map(String).sort(() => Math.random() - 0.5);
    },
    getHint: (a, b) => `Think: ${a} groups of ${b}, or skip count by ${b}, ${a} times`
  },

  // Division generators
  division: {
    patterns: [
      { template: (a, b) => ({ q: `${a * b} ÷ ${b} = ?`, a: a }), maxA: 12, maxB: 12 },
      { template: (a, b) => ({ q: `${a * b} divided by ${b} = ?`, a: a }), maxA: 12, maxB: 12 },
      { template: (a, b) => ({ q: `How many groups of ${b} are in ${a * b}?`, a: a }), maxA: 10, maxB: 10 }
    ],
    generateOptions: (answer) => {
      const opts = new Set([answer]);
      while (opts.size < 4) {
        opts.add(answer + Math.floor(Math.random() * 6) - 3);
      }
      return [...opts].filter(o => o > 0).map(String).sort(() => Math.random() - 0.5);
    },
    getHint: (dividend, divisor) => `Think: how many ${divisor}s fit into ${dividend}?`
  },

  // Counting generators
  counting: {
    patterns: [
      { template: (n) => ({ q: `Count by 1s: ${n}, ${n+1}, ${n+2}, __?`, a: n+3 }), max: 20 },
      { template: (n) => ({ q: `What comes after ${n}?`, a: n+1 }), max: 100 },
      { template: (n) => ({ q: `Count by 2s: ${n*2}, ${n*2+2}, ${n*2+4}, __?`, a: n*2+6 }), max: 20 },
      { template: (n) => ({ q: `Count by 5s: ${n*5}, ${n*5+5}, ${n*5+10}, __?`, a: n*5+15 }), max: 15 },
      { template: (n) => ({ q: `Count by 10s: ${n*10}, ${n*10+10}, ${n*10+20}, __?`, a: n*10+30 }), max: 10 }
    ],
    generateOptions: (answer) => {
      const opts = new Set([answer]);
      opts.add(answer - 1);
      opts.add(answer + 1);
      opts.add(answer + 2);
      return [...opts].map(String).sort(() => Math.random() - 0.5);
    },
    getHint: () => 'Look for the pattern and continue it'
  },

  // Geometry/Shapes generators
  shapes: {
    questions: [
      { q: 'How many sides does a triangle have?', a: '3', opts: ['2', '3', '4', '5'], hint: 'Tri means 3' },
      { q: 'How many sides does a square have?', a: '4', opts: ['3', '4', '5', '6'], hint: 'A square has equal sides all around' },
      { q: 'How many corners does a rectangle have?', a: '4', opts: ['2', '3', '4', '5'], hint: 'Count each corner' },
      { q: 'How many sides does a hexagon have?', a: '6', opts: ['5', '6', '7', '8'], hint: 'Hex means 6' },
      { q: 'How many sides does a pentagon have?', a: '5', opts: ['4', '5', '6', '7'], hint: 'Penta means 5' },
      { q: 'How many sides does an octagon have?', a: '8', opts: ['6', '7', '8', '9'], hint: 'Oct means 8 (like octopus!)' },
      { q: 'A circle has ___ corners.', a: '0', opts: ['0', '1', '2', '4'], hint: 'A circle is round with no corners' },
      { q: 'Which shape has 3 sides and 3 corners?', a: 'Triangle', opts: ['Square', 'Triangle', 'Circle', 'Rectangle'], hint: 'Count the sides' },
      { q: 'Which shape has all equal sides and 4 corners?', a: 'Square', opts: ['Rectangle', 'Square', 'Triangle', 'Pentagon'], hint: 'All sides are the same length' },
      { q: 'A stop sign is shaped like a...', a: 'Octagon', opts: ['Circle', 'Square', 'Octagon', 'Triangle'], hint: 'Count the sides on a stop sign' },
      { q: 'How many faces does a cube have?', a: '6', opts: ['4', '5', '6', '8'], hint: 'A cube is like a box - count all the flat surfaces' },
      { q: 'How many edges does a cube have?', a: '12', opts: ['6', '8', '10', '12'], hint: 'Count where two faces meet' }
    ]
  },

  // Place value generators
  placeValue: {
    patterns: [
      { template: (tens, ones) => ({ 
          q: `What number has ${tens} tens and ${ones} ones?`, 
          a: tens * 10 + ones 
        }), maxTens: 9, maxOnes: 9 },
      { template: (num) => ({ 
          q: `How many tens are in ${num}?`, 
          a: Math.floor(num / 10) 
        }), min: 10, max: 99 },
      { template: (num) => ({ 
          q: `How many ones are in ${num}?`, 
          a: num % 10 
        }), min: 10, max: 99 }
    ],
    generateOptions: (answer) => {
      const opts = new Set([answer]);
      while (opts.size < 4) {
        opts.add(answer + Math.floor(Math.random() * 20) - 10);
      }
      return [...opts].filter(o => o >= 0).map(String).sort(() => Math.random() - 0.5);
    },
    getHint: () => 'Remember: tens place is the left digit, ones place is the right digit'
  },

  // Fractions generators
  fractions: {
    questions: [
      { q: 'What fraction is shaded if 1 out of 2 equal parts is colored?', a: '1/2', opts: ['1/2', '1/3', '1/4', '2/3'], hint: 'Colored parts over total parts' },
      { q: 'What fraction is shaded if 1 out of 4 equal parts is colored?', a: '1/4', opts: ['1/2', '1/3', '1/4', '3/4'], hint: 'Colored parts over total parts' },
      { q: 'What fraction is shaded if 2 out of 4 equal parts are colored?', a: '2/4', opts: ['1/4', '2/4', '3/4', '4/4'], hint: 'Count colored parts, count total parts' },
      { q: 'Which is greater: 1/2 or 1/4?', a: '1/2', opts: ['1/2', '1/4', 'They are equal'], hint: 'Think about sharing a pizza - bigger pieces or smaller?' },
      { q: '1/2 is equivalent to how many fourths?', a: '2/4', opts: ['1/4', '2/4', '3/4', '4/4'], hint: 'If you cut each half in half...' },
      { q: 'What is 1/4 + 1/4?', a: '2/4', opts: ['1/4', '2/4', '1/2', '2/8'], hint: 'Add the numerators, keep the denominator' },
      { q: 'What is 2/4 in simplest form?', a: '1/2', opts: ['1/2', '2/4', '1/4', '2/2'], hint: 'Divide top and bottom by the same number' },
      { q: 'What is 3/4 - 1/4?', a: '2/4', opts: ['1/4', '2/4', '3/4', '4/4'], hint: 'Subtract the numerators' }
    ]
  }
};

function getTopicType(set) {
  const topic = (set.topic || '').toLowerCase();
  const id = (set.id || '').toLowerCase();
  const skill = (set.skill || '').toLowerCase();
  
  if (topic.includes('addition') || id.includes('add')) return 'addition';
  if (topic.includes('subtraction') || id.includes('sub')) return 'subtraction';
  if (topic.includes('multiplication') || id.includes('mult') || id.includes('times')) return 'multiplication';
  if (topic.includes('division') || id.includes('div')) return 'division';
  if (topic.includes('counting') || id.includes('count')) return 'counting';
  if (topic.includes('geometry') || topic.includes('shapes') || id.includes('shape')) return 'shapes';
  if (topic.includes('place value') || id.includes('place')) return 'placeValue';
  if (topic.includes('fraction') || id.includes('frac')) return 'fractions';
  return null;
}

function generateQuestions(type, count, existingQuestions) {
  const gen = generators[type];
  if (!gen) return [];

  const questions = [];
  const existing = new Set(existingQuestions.map(q => q.question));

  if (gen.questions) {
    // Use predefined questions
    for (const q of gen.questions) {
      if (!existing.has(q.q) && questions.length < count) {
        questions.push({
          question: q.q,
          options: q.opts,
          answer: q.a,
          hint: q.hint
        });
        existing.add(q.q);
      }
    }
  }

  if (gen.patterns) {
    // Generate from patterns
    let attempts = 0;
    while (questions.length < count && attempts < 100) {
      attempts++;
      const pattern = gen.patterns[Math.floor(Math.random() * gen.patterns.length)];
      
      let result, hint;
      if (type === 'counting') {
        const n = Math.floor(Math.random() * (pattern.max || 20)) + 1;
        result = pattern.template(n);
        hint = gen.getHint();
      } else if (type === 'placeValue') {
        if (pattern.maxTens) {
          const tens = Math.floor(Math.random() * pattern.maxTens) + 1;
          const ones = Math.floor(Math.random() * (pattern.maxOnes + 1));
          result = pattern.template(tens, ones);
        } else {
          const num = Math.floor(Math.random() * (pattern.max - pattern.min)) + pattern.min;
          result = pattern.template(num);
        }
        hint = gen.getHint();
      } else {
        const maxA = pattern.maxA || 10;
        const maxB = pattern.maxB || 10;
        const minA = pattern.minA || 1;
        const a = Math.floor(Math.random() * (maxA - minA)) + minA;
        const b = Math.floor(Math.random() * maxB) + 1;
        
        if (type === 'subtraction' && a < b) continue;
        
        result = pattern.template(a, b);
        hint = gen.getHint ? gen.getHint(a, b) : '';
      }

      if (!existing.has(result.q)) {
        const options = gen.generateOptions(result.a, ...(result.params || []));
        questions.push({
          question: result.q,
          options: options.includes(String(result.a)) ? options : [...options.slice(0, 3), String(result.a)].sort(() => Math.random() - 0.5),
          answer: String(result.a),
          hint: hint
        });
        existing.add(result.q);
      }
    }
  }

  return questions;
}

function main() {
  console.log('Loading curriculum...');
  const curriculum = JSON.parse(fs.readFileSync(CURRICULUM_PATH, 'utf8'));
  
  let expanded = 0;
  let questionsAdded = 0;

  for (const set of curriculum) {
    const currentCount = (set.questions || []).length;
    if (currentCount >= TARGET_QUESTIONS) continue;

    const needed = TARGET_QUESTIONS - currentCount;
    const type = getTopicType(set);
    
    if (!type) continue;

    const newQuestions = generateQuestions(type, needed, set.questions || []);
    if (newQuestions.length > 0) {
      set.questions = [...(set.questions || []), ...newQuestions];
      expanded++;
      questionsAdded += newQuestions.length;
    }
  }

  console.log(`Expanded ${expanded} sets, added ${questionsAdded} questions`);
  
  fs.writeFileSync(CURRICULUM_PATH, JSON.stringify(curriculum, null, 2));
  console.log('Saved to', CURRICULUM_PATH);
}

main();
