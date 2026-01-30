#!/usr/bin/env node
/**
 * Generate comprehensive Grade 8 curriculum
 * Covers: Algebra, Linear Equations, Functions, Geometry, Statistics
 */

const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.json');
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// Generate wrong options near correct answer
const wrongOptions = (correct, count = 3) => {
  const wrongs = new Set();
  const range = Math.max(3, Math.abs(correct) * 0.3);
  while (wrongs.size < count) {
    const offset = rand(-Math.ceil(range), Math.ceil(range));
    if (offset !== 0) wrongs.add(correct + offset);
  }
  return [...wrongs];
};

// ============ SKILL GENERATORS ============

const skills = [];

// ---------- EXPONENTS ----------
function generateExponentRules() {
  const questions = [];
  
  // Product rule: a^m * a^n = a^(m+n)
  for (let i = 0; i < 12; i++) {
    const base = rand(2, 5);
    const exp1 = rand(2, 5);
    const exp2 = rand(2, 5);
    const answer = exp1 + exp2;
    questions.push({
      question: `Simplify: ${base}^${exp1} × ${base}^${exp2}`,
      options: shuffle([`${base}^${answer}`, `${base}^${exp1 * exp2}`, `${base * 2}^${answer}`, `${base}^${Math.abs(exp1 - exp2)}`]),
      answer: `${base}^${answer}`,
      hint: 'When multiplying same bases, add the exponents',
      explanation: `${base}^${exp1} × ${base}^${exp2} = ${base}^(${exp1}+${exp2}) = ${base}^${answer}`
    });
  }
  
  return {
    id: '8-exponent-product-rule',
    title: 'Apply the product rule for exponents',
    topic: 'Exponents',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateExponentQuotient() {
  const questions = [];
  
  // Quotient rule: a^m / a^n = a^(m-n)
  for (let i = 0; i < 12; i++) {
    const base = rand(2, 5);
    const exp1 = rand(5, 9);
    const exp2 = rand(2, 4);
    const answer = exp1 - exp2;
    questions.push({
      question: `Simplify: ${base}^${exp1} ÷ ${base}^${exp2}`,
      options: shuffle([`${base}^${answer}`, `${base}^${exp1 + exp2}`, `${base}^${exp1 * exp2}`, `1/${base}^${exp2 - exp1}`]),
      answer: `${base}^${answer}`,
      hint: 'When dividing same bases, subtract the exponents',
      explanation: `${base}^${exp1} ÷ ${base}^${exp2} = ${base}^(${exp1}-${exp2}) = ${base}^${answer}`
    });
  }
  
  return {
    id: '8-exponent-quotient-rule',
    title: 'Apply the quotient rule for exponents',
    topic: 'Exponents',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateExponentPower() {
  const questions = [];
  
  // Power rule: (a^m)^n = a^(m*n)
  for (let i = 0; i < 12; i++) {
    const base = rand(2, 4);
    const exp1 = rand(2, 4);
    const exp2 = rand(2, 4);
    const answer = exp1 * exp2;
    questions.push({
      question: `Simplify: (${base}^${exp1})^${exp2}`,
      options: shuffle([`${base}^${answer}`, `${base}^${exp1 + exp2}`, `${base * exp2}^${exp1}`, `${base}^${exp1}`]),
      answer: `${base}^${answer}`,
      hint: 'When raising a power to a power, multiply the exponents',
      explanation: `(${base}^${exp1})^${exp2} = ${base}^(${exp1}×${exp2}) = ${base}^${answer}`
    });
  }
  
  return {
    id: '8-exponent-power-rule',
    title: 'Apply the power rule for exponents',
    topic: 'Exponents',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateNegativeExponents() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const base = rand(2, 5);
    const exp = rand(1, 3);
    const denom = Math.pow(base, exp);
    questions.push({
      question: `Rewrite with positive exponents: ${base}^(-${exp})`,
      options: shuffle([`1/${denom}`, `-${denom}`, `${denom}`, `-1/${denom}`]),
      answer: `1/${denom}`,
      hint: 'A negative exponent means take the reciprocal',
      explanation: `${base}^(-${exp}) = 1/${base}^${exp} = 1/${denom}`
    });
  }
  
  return {
    id: '8-negative-exponents',
    title: 'Evaluate negative exponents',
    topic: 'Exponents',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ---------- SCIENTIFIC NOTATION ----------
function generateScientificNotation() {
  const questions = [];
  
  // Convert to scientific notation
  for (let i = 0; i < 6; i++) {
    const coef = rand(1, 9);
    const exp = rand(3, 7);
    const num = coef * Math.pow(10, exp);
    questions.push({
      question: `Write in scientific notation: ${num.toLocaleString()}`,
      options: shuffle([`${coef} × 10^${exp}`, `${coef} × 10^${exp - 1}`, `${coef} × 10^${exp + 1}`, `${coef/10} × 10^${exp + 1}`]),
      answer: `${coef} × 10^${exp}`,
      hint: 'Move the decimal point until you have a number between 1 and 10',
      explanation: `${num.toLocaleString()} = ${coef} × 10^${exp}`
    });
  }
  
  // Convert from scientific notation
  for (let i = 0; i < 6; i++) {
    const coef = rand(1, 9) + rand(1, 9) / 10;
    const exp = rand(2, 5);
    const num = coef * Math.pow(10, exp);
    questions.push({
      question: `Write in standard form: ${coef} × 10^${exp}`,
      options: shuffle([num.toLocaleString(), (num * 10).toLocaleString(), (num / 10).toLocaleString(), (coef * exp).toLocaleString()]),
      answer: num.toLocaleString(),
      hint: 'Move the decimal point to the right by the exponent',
      explanation: `${coef} × 10^${exp} = ${num.toLocaleString()}`
    });
  }
  
  return {
    id: '8-scientific-notation',
    title: 'Convert to and from scientific notation',
    topic: 'Exponents',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ---------- LINEAR EQUATIONS ----------
function generateOneStepEquations() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const x = rand(-10, 10);
    const b = rand(2, 15);
    const result = x + b;
    questions.push({
      question: `Solve for x: x + ${b} = ${result}`,
      options: shuffle([String(x), String(x + 1), String(x - 1), String(-x)]),
      answer: String(x),
      hint: 'Subtract the same number from both sides',
      explanation: `x + ${b} = ${result}, so x = ${result} - ${b} = ${x}`
    });
  }
  
  return {
    id: '8-one-step-equations',
    title: 'Solve one-step equations',
    topic: 'Linear Equations',
    grade: 8,
    difficulty: 'easy',
    questions
  };
}

function generateTwoStepEquations() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const x = rand(1, 10);
    const a = rand(2, 5);
    const b = rand(1, 10);
    const result = a * x + b;
    questions.push({
      question: `Solve for x: ${a}x + ${b} = ${result}`,
      options: shuffle([String(x), String(x + 1), String(x - 1), String(x * 2)]),
      answer: String(x),
      hint: 'First subtract, then divide',
      explanation: `${a}x + ${b} = ${result} → ${a}x = ${result - b} → x = ${x}`
    });
  }
  
  return {
    id: '8-two-step-equations',
    title: 'Solve two-step equations',
    topic: 'Linear Equations',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateMultiStepEquations() {
  const questions = [];
  
  // Variables on both sides
  for (let i = 0; i < 12; i++) {
    const x = rand(1, 8);
    const a = rand(3, 7);
    const b = rand(2, 6);
    const c = rand(1, a - 1);
    const d = (a - c) * x + b;
    questions.push({
      question: `Solve for x: ${a}x + ${b} = ${c}x + ${d}`,
      options: shuffle([String(x), String(x + 1), String(x - 1), String(-x)]),
      answer: String(x),
      hint: 'Get all x terms on one side, constants on the other',
      explanation: `${a}x - ${c}x = ${d} - ${b} → ${a - c}x = ${d - b} → x = ${x}`
    });
  }
  
  return {
    id: '8-multi-step-equations',
    title: 'Solve equations with variables on both sides',
    topic: 'Linear Equations',
    grade: 8,
    difficulty: 'hard',
    questions
  };
}

// ---------- SLOPE ----------
function generateSlopeFromPoints() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const x1 = rand(-5, 5);
    const y1 = rand(-5, 5);
    const run = rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
    const rise = rand(-4, 4);
    const x2 = x1 + run;
    const y2 = y1 + rise;
    
    // Simplify slope
    const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(rise, run);
    const slopeNum = rise / g;
    const slopeDen = run / g;
    const slope = slopeDen === 1 ? String(slopeNum) : 
                  slopeDen === -1 ? String(-slopeNum) :
                  slopeDen < 0 ? `${-slopeNum}/${-slopeDen}` : `${slopeNum}/${slopeDen}`;
    
    questions.push({
      question: `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2})`,
      options: shuffle([slope, `${-slopeNum}/${slopeDen}`, `${slopeDen}/${slopeNum}`, String(slopeNum + 1)]),
      answer: slope,
      hint: 'Slope = rise/run = (y₂ - y₁)/(x₂ - x₁)',
      explanation: `m = (${y2} - ${y1})/(${x2} - ${x1}) = ${rise}/${run} = ${slope}`
    });
  }
  
  return {
    id: '8-slope-from-points',
    title: 'Find slope from two points',
    topic: 'Linear Equations',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateSlopeIntercept() {
  const questions = [];
  
  // Identify slope and y-intercept
  for (let i = 0; i < 6; i++) {
    const m = rand(-5, 5);
    const b = rand(-10, 10);
    const bSign = b >= 0 ? '+' : '-';
    questions.push({
      question: `What is the slope of y = ${m}x ${bSign} ${Math.abs(b)}?`,
      options: shuffle([String(m), String(b), String(-m), String(m + b)]),
      answer: String(m),
      hint: 'In y = mx + b, m is the slope',
      explanation: `The slope is the coefficient of x, which is ${m}`
    });
  }
  
  for (let i = 0; i < 6; i++) {
    const m = rand(-5, 5);
    const b = rand(-10, 10);
    const bSign = b >= 0 ? '+' : '-';
    questions.push({
      question: `What is the y-intercept of y = ${m}x ${bSign} ${Math.abs(b)}?`,
      options: shuffle([String(b), String(m), String(-b), String(m * b)]),
      answer: String(b),
      hint: 'In y = mx + b, b is the y-intercept',
      explanation: `The y-intercept is ${b}`
    });
  }
  
  return {
    id: '8-slope-intercept-form',
    title: 'Identify slope and y-intercept',
    topic: 'Linear Equations',
    grade: 8,
    difficulty: 'easy',
    questions
  };
}

function generateWriteSlopeIntercept() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const m = rand(-4, 4);
    const b = rand(-8, 8);
    const mStr = m === 1 ? '' : m === -1 ? '-' : String(m);
    const bSign = b >= 0 ? ' + ' : ' - ';
    const eq = `y = ${mStr}x${bSign}${Math.abs(b)}`;
    
    questions.push({
      question: `Write in slope-intercept form: slope = ${m}, y-intercept = ${b}`,
      options: shuffle([eq, `y = ${b}x${bSign}${Math.abs(m)}`, `y = ${-m}x${bSign}${Math.abs(b)}`, `x = ${m}y${bSign}${Math.abs(b)}`]),
      answer: eq,
      hint: 'Slope-intercept form is y = mx + b',
      explanation: `With m = ${m} and b = ${b}: ${eq}`
    });
  }
  
  return {
    id: '8-write-slope-intercept',
    title: 'Write equations in slope-intercept form',
    topic: 'Linear Equations',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ---------- FUNCTIONS ----------
function generateFunctionNotation() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const a = rand(1, 5);
    const b = rand(-5, 10);
    const x = rand(-3, 5);
    const result = a * x + b;
    const bSign = b >= 0 ? '+' : '-';
    
    questions.push({
      question: `If f(x) = ${a}x ${bSign} ${Math.abs(b)}, find f(${x})`,
      options: shuffle([String(result), String(result + a), String(result - a), String(a * result)]),
      answer: String(result),
      hint: 'Replace x with the given value',
      explanation: `f(${x}) = ${a}(${x}) ${bSign} ${Math.abs(b)} = ${a * x} ${bSign} ${Math.abs(b)} = ${result}`
    });
  }
  
  return {
    id: '8-function-notation',
    title: 'Evaluate functions using function notation',
    topic: 'Functions',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateLinearVsNonlinear() {
  const questions = [];
  
  const linear = ['y = 3x + 2', 'y = -x + 5', 'y = 2x', 'y = -4x - 1', 'y = x/2 + 3', 'y = 0.5x - 2'];
  const nonlinear = ['y = x²', 'y = 3x² + 1', 'y = 1/x', 'y = √x', 'y = x³', 'y = 2^x'];
  
  linear.forEach(eq => {
    questions.push({
      question: `Is ${eq} a linear or nonlinear function?`,
      options: ['Linear', 'Nonlinear'],
      answer: 'Linear',
      hint: 'Linear functions have x to the first power only',
      explanation: `${eq} is linear because x has an exponent of 1`
    });
  });
  
  nonlinear.forEach(eq => {
    questions.push({
      question: `Is ${eq} a linear or nonlinear function?`,
      options: ['Linear', 'Nonlinear'],
      answer: 'Nonlinear',
      hint: 'Nonlinear functions have x squared, cubed, or in denominators/roots',
      explanation: `${eq} is nonlinear because x is not to the first power`
    });
  });
  
  return {
    id: '8-linear-vs-nonlinear',
    title: 'Classify functions as linear or nonlinear',
    topic: 'Functions',
    grade: 8,
    difficulty: 'easy',
    questions: shuffle(questions)
  };
}

function generateRateOfChange() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const rate = rand(2, 10);
    const start = rand(0, 20);
    const x1 = rand(1, 5);
    const x2 = x1 + rand(1, 5);
    const y1 = start + rate * x1;
    const y2 = start + rate * x2;
    
    questions.push({
      question: `Find the rate of change: When x = ${x1}, y = ${y1}. When x = ${x2}, y = ${y2}.`,
      options: shuffle([String(rate), String(rate + 1), String(rate - 1), String(y2 - y1)]),
      answer: String(rate),
      hint: 'Rate of change = (change in y)/(change in x)',
      explanation: `Rate = (${y2} - ${y1})/(${x2} - ${x1}) = ${y2 - y1}/${x2 - x1} = ${rate}`
    });
  }
  
  return {
    id: '8-rate-of-change',
    title: 'Find the rate of change',
    topic: 'Functions',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ---------- PYTHAGOREAN THEOREM ----------
function generatePythagoreanFind() {
  const questions = [];
  const triples = [[3,4,5], [5,12,13], [8,15,17], [7,24,25], [6,8,10], [9,12,15], [12,16,20], [15,20,25]];
  
  // Find hypotenuse
  triples.slice(0, 6).forEach(([a, b, c]) => {
    questions.push({
      question: `A right triangle has legs of ${a} and ${b}. Find the hypotenuse.`,
      options: shuffle([String(c), String(c + 1), String(c - 1), String(a + b)]),
      answer: String(c),
      hint: 'Use a² + b² = c²',
      explanation: `${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}, so c = ${c}`
    });
  });
  
  // Find leg
  triples.slice(0, 6).forEach(([a, b, c]) => {
    questions.push({
      question: `A right triangle has a leg of ${a} and hypotenuse of ${c}. Find the other leg.`,
      options: shuffle([String(b), String(b + 1), String(b - 1), String(c - a)]),
      answer: String(b),
      hint: 'Use a² + b² = c², solve for the missing leg',
      explanation: `${c}² - ${a}² = ${c*c} - ${a*a} = ${b*b}, so b = ${b}`
    });
  });
  
  return {
    id: '8-pythagorean-theorem',
    title: 'Use the Pythagorean Theorem',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generatePythagoreanWord() {
  const questions = [];
  const scenarios = [
    { context: 'A ladder is {c} feet long and reaches {b} feet up a wall. How far is the base from the wall?', a: 6, b: 8, c: 10 },
    { context: 'A TV is advertised as {c} inches (diagonal). It is {a} inches wide. How tall is it?', a: 32, b: 24, c: 40 },
    { context: 'A plane flies {a} miles east and {b} miles north. How far is it from the start?', a: 30, b: 40, c: 50 },
    { context: 'A kite string is {c} feet long. The kite is {b} feet above the ground directly over a point {a} feet away. Is this possible?', a: 9, b: 12, c: 15, yn: true },
    { context: 'A ramp is {c} feet long and rises {a} feet. How far does it extend horizontally?', a: 3, b: 4, c: 5 },
    { context: 'A rectangular park is {a} meters by {b} meters. What is the diagonal distance?', a: 60, b: 80, c: 100 },
  ];
  
  scenarios.forEach(s => {
    const text = s.context.replace('{a}', s.a).replace('{b}', s.b).replace('{c}', s.c);
    const answer = s.yn ? 'Yes' : (s.context.includes('How far is the base') ? String(s.a) : 
                                   s.context.includes('How tall') ? String(s.b) :
                                   s.context.includes('from the start') ? String(s.c) :
                                   s.context.includes('horizontally') ? String(s.b) :
                                   String(s.c));
    questions.push({
      question: text,
      options: s.yn ? ['Yes', 'No'] : shuffle([answer, String(parseInt(answer) + 2), String(parseInt(answer) - 2), String(parseInt(answer) + 5)]),
      answer,
      hint: 'Draw a right triangle and use a² + b² = c²',
      explanation: `Using Pythagorean theorem: ${s.a}² + ${s.b}² = ${s.c}²`
    });
  });
  
  return {
    id: '8-pythagorean-word-problems',
    title: 'Solve Pythagorean Theorem word problems',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'hard',
    questions
  };
}

// ---------- TRANSFORMATIONS ----------
function generateTransformations() {
  const questions = [];
  
  // Translations
  for (let i = 0; i < 4; i++) {
    const x = rand(1, 5);
    const y = rand(1, 5);
    const dx = rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
    const dy = rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
    questions.push({
      question: `Translate point (${x}, ${y}) by ${dx > 0 ? '+' : ''}${dx} in x and ${dy > 0 ? '+' : ''}${dy} in y. What is the new point?`,
      options: shuffle([`(${x+dx}, ${y+dy})`, `(${x-dx}, ${y-dy})`, `(${x+dy}, ${y+dx})`, `(${x*2}, ${y*2})`]),
      answer: `(${x+dx}, ${y+dy})`,
      hint: 'Add the translation to each coordinate',
      explanation: `(${x}+${dx}, ${y}+${dy}) = (${x+dx}, ${y+dy})`
    });
  }
  
  // Reflections over x-axis
  for (let i = 0; i < 4; i++) {
    const x = rand(1, 6);
    const y = rand(1, 6);
    questions.push({
      question: `Reflect point (${x}, ${y}) over the x-axis. What is the new point?`,
      options: shuffle([`(${x}, ${-y})`, `(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`]),
      answer: `(${x}, ${-y})`,
      hint: 'Reflecting over x-axis changes the sign of y',
      explanation: `Reflecting (${x}, ${y}) over x-axis gives (${x}, ${-y})`
    });
  }
  
  // Reflections over y-axis
  for (let i = 0; i < 4; i++) {
    const x = rand(1, 6);
    const y = rand(1, 6);
    questions.push({
      question: `Reflect point (${x}, ${y}) over the y-axis. What is the new point?`,
      options: shuffle([`(${-x}, ${y})`, `(${x}, ${-y})`, `(${-x}, ${-y})`, `(${y}, ${x})`]),
      answer: `(${-x}, ${y})`,
      hint: 'Reflecting over y-axis changes the sign of x',
      explanation: `Reflecting (${x}, ${y}) over y-axis gives (${-x}, ${y})`
    });
  }
  
  return {
    id: '8-transformations',
    title: 'Perform translations and reflections',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateDilations() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const x = rand(2, 6);
    const y = rand(2, 6);
    const scale = rand(2, 4);
    questions.push({
      question: `Dilate point (${x}, ${y}) by a scale factor of ${scale} from the origin. What is the new point?`,
      options: shuffle([`(${x*scale}, ${y*scale})`, `(${x+scale}, ${y+scale})`, `(${x*scale}, ${y})`, `(${x}, ${y*scale})`]),
      answer: `(${x*scale}, ${y*scale})`,
      hint: 'Multiply both coordinates by the scale factor',
      explanation: `(${x}×${scale}, ${y}×${scale}) = (${x*scale}, ${y*scale})`
    });
  }
  
  return {
    id: '8-dilations',
    title: 'Perform dilations',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ---------- VOLUME ----------
function generateVolumeCylinder() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const r = rand(2, 6);
    const h = rand(3, 10);
    const vol = Math.round(Math.PI * r * r * h);
    questions.push({
      question: `Find the volume of a cylinder with radius ${r} and height ${h}. Use π ≈ 3.14`,
      options: shuffle([`${vol}`, `${vol + rand(10, 30)}`, `${vol - rand(10, 30)}`, `${Math.round(Math.PI * r * h)}`]),
      answer: `${vol}`,
      hint: 'V = πr²h',
      explanation: `V = π × ${r}² × ${h} = ${Math.round(Math.PI * r * r)} × ${h} ≈ ${vol}`
    });
  }
  
  return {
    id: '8-volume-cylinder',
    title: 'Find volume of cylinders',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

function generateVolumeCone() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const r = rand(2, 6);
    const h = rand(3, 9);
    const vol = Math.round((1/3) * Math.PI * r * r * h);
    questions.push({
      question: `Find the volume of a cone with radius ${r} and height ${h}. Use π ≈ 3.14`,
      options: shuffle([`${vol}`, `${vol + rand(5, 20)}`, `${vol - rand(5, 15)}`, `${Math.round(Math.PI * r * r * h)}`]),
      answer: `${vol}`,
      hint: 'V = (1/3)πr²h',
      explanation: `V = (1/3) × π × ${r}² × ${h} ≈ ${vol}`
    });
  }
  
  return {
    id: '8-volume-cone',
    title: 'Find volume of cones',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'hard',
    questions
  };
}

function generateVolumeSphere() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const r = rand(2, 5);
    const vol = Math.round((4/3) * Math.PI * r * r * r);
    questions.push({
      question: `Find the volume of a sphere with radius ${r}. Use π ≈ 3.14`,
      options: shuffle([`${vol}`, `${vol + rand(10, 40)}`, `${vol - rand(10, 30)}`, `${Math.round(Math.PI * r * r)}`]),
      answer: `${vol}`,
      hint: 'V = (4/3)πr³',
      explanation: `V = (4/3) × π × ${r}³ ≈ ${vol}`
    });
  }
  
  return {
    id: '8-volume-sphere',
    title: 'Find volume of spheres',
    topic: 'Geometry',
    grade: 8,
    difficulty: 'hard',
    questions
  };
}

// ---------- STATISTICS ----------
function generateScatterPlots() {
  const questions = [];
  
  const correlations = [
    { desc: 'As study time increases, test scores increase', type: 'Positive' },
    { desc: 'As temperature rises, hot cocoa sales decrease', type: 'Negative' },
    { desc: 'Shoe size and math test scores show no clear pattern', type: 'No correlation' },
    { desc: 'As hours of exercise increase, resting heart rate decreases', type: 'Negative' },
    { desc: 'As height increases, weight tends to increase', type: 'Positive' },
    { desc: 'Phone number and GPA show no relationship', type: 'No correlation' },
  ];
  
  correlations.forEach(c => {
    questions.push({
      question: `What type of correlation? "${c.desc}"`,
      options: shuffle(['Positive', 'Negative', 'No correlation']),
      answer: c.type,
      hint: 'Positive = both increase together, Negative = one increases while other decreases',
      explanation: `This is a ${c.type.toLowerCase()} correlation`
    });
  });
  
  // Line of best fit
  for (let i = 0; i < 6; i++) {
    const m = rand(1, 5);
    const b = rand(0, 10);
    const x = rand(5, 15);
    const y = m * x + b;
    questions.push({
      question: `A line of best fit is y = ${m}x + ${b}. Predict y when x = ${x}.`,
      options: shuffle([String(y), String(y + m), String(y - m), String(m * b)]),
      answer: String(y),
      hint: 'Substitute the x value into the equation',
      explanation: `y = ${m}(${x}) + ${b} = ${y}`
    });
  }
  
  return {
    id: '8-scatter-plots',
    title: 'Interpret scatter plots and correlation',
    topic: 'Statistics',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ---------- SYSTEMS OF EQUATIONS ----------
function generateSystemsSimple() {
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const x = rand(1, 5);
    const y = rand(1, 5);
    const a1 = 1, b1 = 1, c1 = x + y;
    const a2 = 1, b2 = -1, c2 = x - y;
    
    questions.push({
      question: `Solve: x + y = ${c1} and x - y = ${c2}. Find x.`,
      options: shuffle([String(x), String(y), String(x + 1), String(x - 1)]),
      answer: String(x),
      hint: 'Add the equations to eliminate y',
      explanation: `Adding: 2x = ${c1 + c2}, so x = ${x}`
    });
  }
  
  return {
    id: '8-systems-of-equations',
    title: 'Solve systems of equations',
    topic: 'Algebra',
    grade: 8,
    difficulty: 'hard',
    questions
  };
}

// ---------- IRRATIONAL NUMBERS ----------
function generateIrrationalNumbers() {
  const questions = [];
  
  const rationals = ['0.5', '3/4', '-7', '0.333...', '√4', '√9', '0.125', '-2/5'];
  const irrationals = ['√2', '√3', 'π', '√5', '√7', '√10', '√11', 'π/2'];
  
  rationals.forEach(n => {
    questions.push({
      question: `Is ${n} rational or irrational?`,
      options: ['Rational', 'Irrational'],
      answer: 'Rational',
      hint: 'Rational numbers can be written as a fraction of integers',
      explanation: `${n} is rational`
    });
  });
  
  irrationals.slice(0, 6).forEach(n => {
    questions.push({
      question: `Is ${n} rational or irrational?`,
      options: ['Rational', 'Irrational'],
      answer: 'Irrational',
      hint: 'Irrational numbers cannot be written as simple fractions',
      explanation: `${n} is irrational`
    });
  });
  
  return {
    id: '8-rational-irrational',
    title: 'Classify rational and irrational numbers',
    topic: 'Number System',
    grade: 8,
    difficulty: 'easy',
    questions: shuffle(questions)
  };
}

function generateApproximateIrrationals() {
  const questions = [];
  
  const irrationals = [
    { expr: '√2', val: 1.414 },
    { expr: '√3', val: 1.732 },
    { expr: '√5', val: 2.236 },
    { expr: '√6', val: 2.449 },
    { expr: '√7', val: 2.646 },
    { expr: '√8', val: 2.828 },
    { expr: '√10', val: 3.162 },
    { expr: '√11', val: 3.317 },
  ];
  
  irrationals.forEach(i => {
    const low = Math.floor(i.val);
    const high = Math.ceil(i.val);
    questions.push({
      question: `${i.expr} is between which two integers?`,
      options: shuffle([`${low} and ${high}`, `${low - 1} and ${low}`, `${high} and ${high + 1}`, `${low - 1} and ${high + 1}`]),
      answer: `${low} and ${high}`,
      hint: 'Think about which perfect squares it is between',
      explanation: `${low}² = ${low * low} and ${high}² = ${high * high}, so ${i.expr} ≈ ${i.val} is between ${low} and ${high}`
    });
  });
  
  return {
    id: '8-approximate-irrationals',
    title: 'Approximate irrational numbers',
    topic: 'Number System',
    grade: 8,
    difficulty: 'medium',
    questions
  };
}

// ============ GENERATE ALL SKILLS ============

const newSkills = [
  generateExponentRules(),
  generateExponentQuotient(),
  generateExponentPower(),
  generateNegativeExponents(),
  generateScientificNotation(),
  generateOneStepEquations(),
  generateTwoStepEquations(),
  generateMultiStepEquations(),
  generateSlopeFromPoints(),
  generateSlopeIntercept(),
  generateWriteSlopeIntercept(),
  generateFunctionNotation(),
  generateLinearVsNonlinear(),
  generateRateOfChange(),
  generatePythagoreanFind(),
  generatePythagoreanWord(),
  generateTransformations(),
  generateDilations(),
  generateVolumeCylinder(),
  generateVolumeCone(),
  generateVolumeSphere(),
  generateScatterPlots(),
  generateSystemsSimple(),
  generateIrrationalNumbers(),
  generateApproximateIrrationals(),
];

// Add to curriculum
let totalQuestions = 0;
newSkills.forEach(skill => {
  // Check if skill already exists
  const existing = curriculum.findIndex(s => s.id === skill.id);
  if (existing >= 0) {
    curriculum[existing] = skill;
    console.log(`  Updated: ${skill.id} (${skill.questions.length} questions)`);
  } else {
    curriculum.push(skill);
    console.log(`  Added: ${skill.id} (${skill.questions.length} questions)`);
  }
  totalQuestions += skill.questions.length;
});

// Save
fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2));

console.log(`\n========== GRADE 8 EXPANSION COMPLETE ==========`);
console.log(`Skills added/updated: ${newSkills.length}`);
console.log(`Total new questions: ${totalQuestions}`);

// Verify
const g8Skills = curriculum.filter(s => s.grade === 8);
const g8Questions = g8Skills.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
console.log(`\nGrade 8 now has: ${g8Skills.length} skills, ${g8Questions} questions`);
