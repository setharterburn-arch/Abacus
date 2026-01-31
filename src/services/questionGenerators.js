/**
 * Algorithmic Question Generators - Infinite Practice
 * Pure math functions that generate questions without API calls
 */

// ========== UTILITIES ==========

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

// Generate plausible wrong answers near the correct one
const nearbyWrong = (correct, count = 3, range = null) => {
  const r = range || Math.max(3, Math.ceil(Math.abs(correct) * 0.3));
  const wrongs = new Set();
  while (wrongs.size < count) {
    const offset = rand(-r, r);
    if (offset !== 0) wrongs.add(correct + offset);
  }
  return [...wrongs];
};

// ========== ARITHMETIC GENERATORS ==========

export const generateAddition = (grade = 1, difficulty = 'medium') => {
  let a, b, max;
  
  if (grade === 0) { max = 10; a = rand(1, 5); b = rand(1, 5); }
  else if (grade === 1) { max = difficulty === 'easy' ? 10 : 20; a = rand(1, max/2); b = rand(1, max/2); }
  else if (grade === 2) { max = difficulty === 'easy' ? 50 : 100; a = rand(10, max/2); b = rand(10, max/2); }
  else if (grade === 3) { max = difficulty === 'easy' ? 500 : 1000; a = rand(100, max/2); b = rand(100, max/2); }
  else { max = 10000; a = rand(100, max/2); b = rand(100, max/2); }
  
  const answer = a + b;
  const options = shuffle([answer, ...nearbyWrong(answer)]);
  
  return {
    question: `What is ${a.toLocaleString()} + ${b.toLocaleString()}?`,
    options: options.map(String),
    answer: String(answer),
    hint: `Start with ${a} and count up ${b} more`,
    explanation: `${a} + ${b} = ${answer}`
  };
};

export const generateSubtraction = (grade = 1, difficulty = 'medium') => {
  let a, b, max;
  
  if (grade === 0) { max = 10; a = rand(3, 10); b = rand(1, a - 1); }
  else if (grade === 1) { max = 20; a = rand(5, max); b = rand(1, a - 1); }
  else if (grade === 2) { max = 100; a = rand(20, max); b = rand(10, a - 5); }
  else if (grade === 3) { max = 1000; a = rand(100, max); b = rand(50, a - 50); }
  else { max = 10000; a = rand(500, max); b = rand(100, a - 100); }
  
  // Ensure no negative results
  if (b > a) [a, b] = [b, a];
  
  const answer = a - b;
  const options = shuffle([answer, ...nearbyWrong(answer)]);
  
  return {
    question: `What is ${a.toLocaleString()} - ${b.toLocaleString()}?`,
    options: options.map(String),
    answer: String(answer),
    hint: `Start with ${a} and take away ${b}`,
    explanation: `${a} - ${b} = ${answer}`
  };
};

export const generateMultiplication = (grade = 3, difficulty = 'medium') => {
  let a, b;
  
  if (grade <= 2) { a = rand(1, 5); b = rand(1, 5); }
  else if (grade === 3) { 
    if (difficulty === 'easy') { a = rand(2, 5); b = rand(2, 5); }
    else { a = rand(2, 9); b = rand(2, 9); }
  }
  else if (grade === 4) { a = rand(2, 12); b = rand(2, 12); }
  else { a = rand(10, 25); b = rand(2, 12); }
  
  const answer = a * b;
  const options = shuffle([answer, ...nearbyWrong(answer, 3, Math.ceil(answer * 0.2))]);
  
  return {
    question: `What is ${a} × ${b}?`,
    options: options.map(String),
    answer: String(answer),
    hint: `Think of ${a} groups of ${b}`,
    explanation: `${a} × ${b} = ${answer}`
  };
};

export const generateDivision = (grade = 3, difficulty = 'medium') => {
  let divisor, quotient;
  
  if (grade <= 3) { divisor = rand(2, 5); quotient = rand(2, 10); }
  else if (grade === 4) { divisor = rand(2, 9); quotient = rand(2, 12); }
  else { divisor = rand(2, 12); quotient = rand(5, 20); }
  
  const dividend = divisor * quotient; // Ensures clean division
  const options = shuffle([quotient, ...nearbyWrong(quotient)]);
  
  return {
    question: `What is ${dividend} ÷ ${divisor}?`,
    options: options.map(String),
    answer: String(quotient),
    hint: `How many groups of ${divisor} make ${dividend}?`,
    explanation: `${dividend} ÷ ${divisor} = ${quotient} because ${divisor} × ${quotient} = ${dividend}`
  };
};

// ========== FRACTION GENERATORS ==========

export const generateFractionIdentify = (grade = 3) => {
  const denoms = grade <= 3 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 10, 12];
  const denom = pick(denoms);
  const numer = rand(1, denom - 1);
  
  const wrongFracs = [];
  while (wrongFracs.length < 3) {
    const wd = pick(denoms);
    const wn = rand(1, wd - 1);
    const wf = `${wn}/${wd}`;
    if (wf !== `${numer}/${denom}` && !wrongFracs.includes(wf)) {
      wrongFracs.push(wf);
    }
  }
  
  return {
    question: `A shape is divided into ${denom} equal parts. ${numer} parts are shaded. What fraction is shaded?`,
    options: shuffle([`${numer}/${denom}`, ...wrongFracs]),
    answer: `${numer}/${denom}`,
    hint: `The numerator is the number of shaded parts, the denominator is the total parts`,
    explanation: `${numer} shaded out of ${denom} total = ${numer}/${denom}`
  };
};

export const generateFractionCompare = (grade = 3) => {
  const denoms = [2, 3, 4, 5, 6, 8];
  const d1 = pick(denoms);
  const d2 = pick(denoms);
  const n1 = rand(1, d1 - 1);
  const n2 = rand(1, d2 - 1);
  
  const v1 = n1 / d1;
  const v2 = n2 / d2;
  
  let answer;
  if (Math.abs(v1 - v2) < 0.001) answer = '=';
  else if (v1 > v2) answer = '>';
  else answer = '<';
  
  return {
    question: `Compare: ${n1}/${d1} ___ ${n2}/${d2}`,
    options: shuffle(['<', '>', '=']),
    answer,
    hint: `Convert to decimals or find common denominators`,
    explanation: `${n1}/${d1} = ${v1.toFixed(3)} and ${n2}/${d2} = ${v2.toFixed(3)}, so ${n1}/${d1} ${answer} ${n2}/${d2}`
  };
};

export const generateFractionAdd = (grade = 4, difficulty = 'medium') => {
  let d1, d2;
  
  if (difficulty === 'easy') {
    // Same denominator
    d1 = d2 = pick([2, 3, 4, 5, 6, 8]);
  } else {
    // Different denominators
    d1 = pick([2, 3, 4, 5, 6]);
    d2 = pick([2, 3, 4, 5, 6]);
  }
  
  const n1 = rand(1, d1 - 1);
  const n2 = rand(1, d2 - 1);
  
  const commonD = lcm(d1, d2);
  const commonN1 = n1 * (commonD / d1);
  const commonN2 = n2 * (commonD / d2);
  const sumN = commonN1 + commonN2;
  
  // Simplify
  const g = gcd(sumN, commonD);
  const finalN = sumN / g;
  const finalD = commonD / g;
  
  const answer = finalD === 1 ? String(finalN) : `${finalN}/${finalD}`;
  
  // Generate wrong options
  const wrongs = [
    `${n1 + n2}/${d1 + d2}`, // Common mistake: add both
    `${n1 + n2}/${d1}`,      // Common mistake: add numerators only
    `${sumN}/${commonD}`     // Unsimplified (if different from answer)
  ].filter(w => w !== answer).slice(0, 3);
  
  while (wrongs.length < 3) {
    wrongs.push(`${rand(1, 10)}/${rand(2, 8)}`);
  }
  
  return {
    question: `What is ${n1}/${d1} + ${n2}/${d2}?`,
    options: shuffle([answer, ...wrongs.slice(0, 3)]),
    answer,
    hint: d1 === d2 ? `Add the numerators, keep the denominator` : `Find a common denominator first`,
    explanation: `${n1}/${d1} + ${n2}/${d2} = ${commonN1}/${commonD} + ${commonN2}/${commonD} = ${sumN}/${commonD} = ${answer}`
  };
};

export const generateFractionMultiply = (grade = 5) => {
  const d1 = pick([2, 3, 4, 5, 6]);
  const d2 = pick([2, 3, 4, 5]);
  const n1 = rand(1, d1);
  const n2 = rand(1, d2);
  
  const prodN = n1 * n2;
  const prodD = d1 * d2;
  const g = gcd(prodN, prodD);
  const finalN = prodN / g;
  const finalD = prodD / g;
  
  const answer = finalD === 1 ? String(finalN) : `${finalN}/${finalD}`;
  
  const wrongs = [
    `${n1 * n2}/${d1 * d2}`, // Unsimplified
    `${n1 + n2}/${d1 + d2}`, // Added instead
    `${n1 * d2}/${d1 * n2}`  // Cross multiplied wrong
  ].filter(w => w !== answer);
  
  return {
    question: `What is ${n1}/${d1} × ${n2}/${d2}?`,
    options: shuffle([answer, ...wrongs.slice(0, 3)]),
    answer,
    hint: `Multiply numerators together, multiply denominators together`,
    explanation: `${n1}/${d1} × ${n2}/${d2} = (${n1}×${n2})/(${d1}×${d2}) = ${prodN}/${prodD} = ${answer}`
  };
};

// ========== DECIMAL GENERATORS ==========

export const generateDecimalAdd = (grade = 4, difficulty = 'medium') => {
  const places = difficulty === 'easy' ? 1 : 2;
  const mult = Math.pow(10, places);
  
  const a = rand(10, 99) / mult;
  const b = rand(10, 99) / mult;
  const answer = +(a + b).toFixed(places);
  
  const wrongs = nearbyWrong(answer * mult, 3).map(w => (w / mult).toFixed(places));
  
  return {
    question: `What is ${a.toFixed(places)} + ${b.toFixed(places)}?`,
    options: shuffle([answer.toFixed(places), ...wrongs]),
    answer: answer.toFixed(places),
    hint: `Line up the decimal points and add`,
    explanation: `${a.toFixed(places)} + ${b.toFixed(places)} = ${answer.toFixed(places)}`
  };
};

export const generateDecimalMultiply = (grade = 5) => {
  const a = rand(11, 99) / 10;
  const b = rand(2, 9);
  const answer = +(a * b).toFixed(1);
  
  const wrongs = nearbyWrong(answer * 10, 3).map(w => (w / 10).toFixed(1));
  
  return {
    question: `What is ${a.toFixed(1)} × ${b}?`,
    options: shuffle([answer.toFixed(1), ...wrongs]),
    answer: answer.toFixed(1),
    hint: `Multiply as whole numbers, then place the decimal`,
    explanation: `${a.toFixed(1)} × ${b} = ${answer.toFixed(1)}`
  };
};

export const generateDecimalCompare = (grade = 4) => {
  const a = (rand(1, 99) / 100).toFixed(2);
  const b = (rand(1, 99) / 100).toFixed(2);
  
  const va = parseFloat(a);
  const vb = parseFloat(b);
  
  let answer;
  if (va === vb) answer = '=';
  else if (va > vb) answer = '>';
  else answer = '<';
  
  return {
    question: `Compare: ${a} ___ ${b}`,
    options: ['<', '>', '='],
    answer,
    hint: `Compare digit by digit from left to right`,
    explanation: `${a} ${answer} ${b}`
  };
};

// ========== WORD PROBLEM GENERATORS ==========

const wordProblemTemplates = {
  addition: [
    { template: '{name} has {a} {item}. {name2} gives {pronoun} {b} more. How many {item} does {name} have now?', solve: (a, b) => a + b },
    { template: 'There are {a} {item} in one {container} and {b} {item} in another. How many {item} are there in total?', solve: (a, b) => a + b },
    { template: '{name} read {a} pages on Monday and {b} pages on Tuesday. How many pages did {name} read in all?', solve: (a, b) => a + b },
  ],
  subtraction: [
    { template: '{name} had {a} {item}. {pronoun2} gave {b} to {name2}. How many {item} does {name} have left?', solve: (a, b) => a - b },
    { template: 'There were {a} {item} in the {container}. {b} were taken out. How many {item} are left?', solve: (a, b) => a - b },
    { template: '{name} had ${a}. {pronoun2} spent ${b}. How much money does {name} have now?', solve: (a, b) => a - b },
  ],
  multiplication: [
    { template: 'There are {a} {container}. Each {container2} has {b} {item}. How many {item} are there in all?', solve: (a, b) => a * b },
    { template: '{name} bought {a} packs of {item}. Each pack has {b} {item2}. How many {item2} did {name} buy?', solve: (a, b) => a * b },
    { template: 'A {item} costs ${b}. How much do {a} {item2} cost?', solve: (a, b) => a * b },
  ],
  division: [
    { template: '{name} has {total} {item} to share equally among {b} friends. How many {item} does each friend get?', solve: (total, b) => total / b },
    { template: 'There are {total} {item} in {b} equal groups. How many {item} are in each group?', solve: (total, b) => total / b },
    { template: '{name} has {total} stickers. {pronoun2} puts {b} stickers on each page. How many pages can {pronoun} fill?', solve: (total, b) => total / b },
  ]
};

const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Jamie'];
const items = ['apples', 'cookies', 'books', 'stickers', 'marbles', 'pencils', 'cards', 'toys'];
const containers = ['basket', 'box', 'bag', 'jar', 'shelf', 'row'];

export const generateWordProblem = (operation = 'addition', grade = 2) => {
  const templates = wordProblemTemplates[operation];
  const tmpl = pick(templates);
  
  let a, b, answer;
  
  if (operation === 'addition') {
    a = grade <= 1 ? rand(2, 10) : grade <= 2 ? rand(10, 50) : rand(20, 100);
    b = grade <= 1 ? rand(2, 10) : grade <= 2 ? rand(10, 50) : rand(20, 100);
    answer = tmpl.solve(a, b);
  } else if (operation === 'subtraction') {
    a = grade <= 1 ? rand(10, 20) : grade <= 2 ? rand(20, 100) : rand(50, 200);
    b = rand(Math.floor(a * 0.2), Math.floor(a * 0.7));
    answer = tmpl.solve(a, b);
  } else if (operation === 'multiplication') {
    a = grade <= 3 ? rand(2, 5) : rand(2, 10);
    b = grade <= 3 ? rand(2, 5) : rand(2, 10);
    answer = tmpl.solve(a, b);
  } else if (operation === 'division') {
    b = grade <= 3 ? rand(2, 5) : rand(2, 10);
    const quotient = grade <= 3 ? rand(2, 10) : rand(2, 15);
    a = b * quotient; // Ensures clean division
    answer = tmpl.solve(a, b);
  }
  
  const name = pick(names);
  const name2 = pick(names.filter(n => n !== name));
  const item = pick(items);
  const container = pick(containers);
  
  let question = tmpl.template
    .replace(/{name}/g, name)
    .replace(/{name2}/g, name2)
    .replace(/{a}/g, a)
    .replace(/{b}/g, b)
    .replace(/{total}/g, a)
    .replace(/{item}/g, item)
    .replace(/{item2}/g, item)
    .replace(/{container}/g, container)
    .replace(/{container2}/g, container.replace(/s$/, ''))
    .replace(/{pronoun}/g, 'them')
    .replace(/{pronoun2}/g, 'They');
  
  const wrongs = nearbyWrong(answer);
  
  return {
    question,
    options: shuffle([answer, ...wrongs]).map(String),
    answer: String(answer),
    hint: `This is ${operation === 'addition' ? 'an addition' : operation === 'subtraction' ? 'a subtraction' : operation === 'multiplication' ? 'a multiplication' : 'a division'} problem`,
    explanation: `${a} ${operation === 'addition' ? '+' : operation === 'subtraction' ? '-' : operation === 'multiplication' ? '×' : '÷'} ${b} = ${answer}`
  };
};

// ========== INTERACTIVE QUESTION GENERATORS ==========

export const generateNumberLine = (grade = 3, topic = 'fractions') => {
  if (topic === 'fractions') {
    const denoms = [2, 3, 4, 5, 6, 8];
    const denom = pick(denoms);
    const numer = rand(1, denom - 1);
    const value = numer / denom;
    
    return {
      type: 'number-line',
      question: `Place ${numer}/${denom} on the number line`,
      min: 0,
      max: 1,
      divisions: denom,
      answer: value,
      tolerance: 0.08
    };
  } else if (topic === 'decimals') {
    const value = rand(1, 9) / 10;
    return {
      type: 'number-line',
      question: `Place ${value.toFixed(1)} on the number line`,
      min: 0,
      max: 1,
      divisions: 10,
      answer: value,
      tolerance: 0.05
    };
  } else if (topic === 'integers') {
    const value = rand(-5, 5);
    return {
      type: 'number-line',
      question: `Place ${value} on the number line`,
      min: -6,
      max: 6,
      divisions: 12,
      answer: value,
      tolerance: 0.5
    };
  }
};

export const generateFractionShade = (grade = 3) => {
  const shapes = ['rectangle', 'circle', 'square'];
  const denoms = grade <= 3 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 10];
  const denom = pick(denoms);
  const numer = rand(1, denom - 1);
  
  return {
    type: 'fraction-shade',
    question: `Shade ${numer}/${denom} of the ${pick(shapes)}`,
    shape: pick(shapes),
    parts: denom,
    answer: numer,
    orientation: pick(['horizontal', 'vertical'])
  };
};

export const generateArrayBuilder = (grade = 3) => {
  const maxDim = grade <= 3 ? 6 : 10;
  const rows = rand(2, Math.min(5, maxDim));
  const cols = rand(2, Math.min(6, maxDim));
  
  return {
    type: 'array-builder',
    question: `Build an array to show ${rows} × ${cols}`,
    targetRows: rows,
    targetCols: cols,
    maxRows: Math.min(rows + 2, 8),
    maxCols: Math.min(cols + 2, 10)
  };
};

// ========== TIME/CLOCK GENERATORS ==========

export const generateClockReading = (grade = 1, difficulty = 'medium') => {
  let hour, minute;
  
  if (grade <= 1 || difficulty === 'easy') {
    // Hour only or :30
    hour = rand(1, 12);
    minute = pick([0, 30]);
  } else if (grade === 2 || difficulty === 'medium') {
    // Quarter hours
    hour = rand(1, 12);
    minute = pick([0, 15, 30, 45]);
  } else {
    // Any 5-minute interval
    hour = rand(1, 12);
    minute = rand(0, 11) * 5;
  }
  
  const formatTime = (h, m) => {
    return `${h}:${m.toString().padStart(2, '0')}`;
  };
  
  const correctAnswer = formatTime(hour, minute);
  
  // Generate wrong answers
  const wrongs = [];
  while (wrongs.length < 3) {
    const wrongHour = rand(1, 12);
    const wrongMinute = rand(0, 11) * 5;
    const wrong = formatTime(wrongHour, wrongMinute);
    if (wrong !== correctAnswer && !wrongs.includes(wrong)) {
      wrongs.push(wrong);
    }
  }
  
  return {
    type: 'clock-face',
    question: `What time is shown on the clock?`,
    mode: 'read',
    displayTime: { hour, minute },
    options: shuffle([correctAnswer, ...wrongs]),
    answer: correctAnswer,
    showDigital: false
  };
};

export const generateClockSetting = (grade = 2, difficulty = 'medium') => {
  let hour, minute;
  
  if (grade <= 1 || difficulty === 'easy') {
    hour = rand(1, 12);
    minute = pick([0, 30]);
  } else if (grade === 2 || difficulty === 'medium') {
    hour = rand(1, 12);
    minute = pick([0, 15, 30, 45]);
  } else {
    hour = rand(1, 12);
    minute = rand(0, 11) * 5;
  }
  
  const formatTime = (h, m) => {
    return `${h}:${m.toString().padStart(2, '0')}`;
  };
  
  return {
    type: 'clock-face',
    question: `Set the clock to ${formatTime(hour, minute)}`,
    mode: 'set',
    answer: { hour, minute },
    showDigital: true,
    allowQuarter: grade <= 2
  };
};

export const generateTimeElapsed = (grade = 3, difficulty = 'medium') => {
  const startHour = rand(1, 10);
  const startMinute = pick([0, 15, 30, 45]);
  
  let elapsedHours, elapsedMinutes;
  if (difficulty === 'easy') {
    elapsedHours = rand(1, 3);
    elapsedMinutes = 0;
  } else if (difficulty === 'medium') {
    elapsedHours = rand(0, 2);
    elapsedMinutes = pick([0, 15, 30, 45]);
  } else {
    elapsedHours = rand(0, 4);
    elapsedMinutes = rand(0, 11) * 5;
  }
  
  let endHour = startHour + elapsedHours;
  let endMinute = startMinute + elapsedMinutes;
  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }
  if (endHour > 12) endHour -= 12;
  
  const formatTime = (h, m) => `${h}:${m.toString().padStart(2, '0')}`;
  const startTime = formatTime(startHour, startMinute);
  const endTime = formatTime(endHour, endMinute);
  const elapsed = `${elapsedHours > 0 ? elapsedHours + ' hour' + (elapsedHours > 1 ? 's' : '') : ''}${elapsedHours > 0 && elapsedMinutes > 0 ? ' and ' : ''}${elapsedMinutes > 0 ? elapsedMinutes + ' minutes' : ''}`;
  
  return {
    question: `If it is ${startTime} now, what time will it be in ${elapsed || '0 minutes'}?`,
    options: shuffle([endTime, formatTime(rand(1, 12), rand(0, 11) * 5), formatTime(rand(1, 12), rand(0, 11) * 5), formatTime(rand(1, 12), rand(0, 11) * 5)].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)),
    answer: endTime,
    hint: `Start at ${startTime} and count forward ${elapsed}`
  };
};

export const generateDragSort = (grade = 3, topic = 'numbers') => {
  if (topic === 'fractions' && grade >= 3) {
    const fractions = ['1/4', '1/3', '1/2', '2/3', '3/4'];
    const picks = shuffle(fractions).slice(0, 4);
    const sorted = [...picks].sort((a, b) => eval(a) - eval(b));
    return {
      type: 'drag-sort',
      question: 'Order these fractions from least to greatest',
      items: shuffle(picks),
      correctOrder: sorted
    };
  } else if (topic === 'decimals' && grade >= 4) {
    const decimals = ['0.1', '0.25', '0.4', '0.5', '0.75', '0.8'];
    const picks = shuffle(decimals).slice(0, 4);
    const sorted = [...picks].sort((a, b) => parseFloat(a) - parseFloat(b));
    return {
      type: 'drag-sort',
      question: 'Order these decimals from least to greatest',
      items: shuffle(picks),
      correctOrder: sorted
    };
  } else {
    const base = grade <= 2 ? rand(1, 20) : rand(10, 100);
    const nums = [base, base + rand(3, 10), base + rand(15, 30), base + rand(35, 60)];
    return {
      type: 'drag-sort',
      question: 'Order these numbers from least to greatest',
      items: shuffle(nums.map(String)),
      correctOrder: nums.map(String)
    };
  }
};

// ========== MASTER GENERATOR ==========

/**
 * Generate a question based on skill type and grade
 * @param {string} skillType - Type of skill (addition, fractions, etc.)
 * @param {number} grade - Grade level 0-8
 * @param {string} difficulty - easy, medium, hard
 * @returns {Object} Question object
 */
export const generateQuestion = (skillType, grade = 3, difficulty = 'medium') => {
  const type = skillType.toLowerCase();
  
  // Arithmetic
  if (type.includes('add')) return generateAddition(grade, difficulty);
  if (type.includes('subtract')) return generateSubtraction(grade, difficulty);
  if (type.includes('multipl') || type.includes('times')) return generateMultiplication(grade, difficulty);
  if (type.includes('divis') || type.includes('divide')) return generateDivision(grade, difficulty);
  
  // Fractions
  if (type.includes('fraction') && type.includes('add')) return generateFractionAdd(grade, difficulty);
  if (type.includes('fraction') && type.includes('mult')) return generateFractionMultiply(grade);
  if (type.includes('fraction') && type.includes('compar')) return generateFractionCompare(grade);
  if (type.includes('fraction')) return generateFractionIdentify(grade);
  
  // Decimals
  if (type.includes('decimal') && type.includes('add')) return generateDecimalAdd(grade, difficulty);
  if (type.includes('decimal') && type.includes('mult')) return generateDecimalMultiply(grade);
  if (type.includes('decimal') && type.includes('compar')) return generateDecimalCompare(grade);
  if (type.includes('decimal')) return generateDecimalAdd(grade, difficulty);
  
  // Word problems
  if (type.includes('word') || type.includes('problem')) {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'];
    return generateWordProblem(pick(ops), grade);
  }
  
  // Time
  if (type.includes('time') || type.includes('clock')) {
    return pick([
      () => generateClockReading(grade, difficulty),
      () => generateClockSetting(grade, difficulty),
      () => generateTimeElapsed(grade, difficulty)
    ])();
  }
  
  // Default to addition for unknown types
  return generateAddition(grade, difficulty);
};

/**
 * Generate a batch of questions
 * @param {string} skillType - Type of skill
 * @param {number} count - Number of questions
 * @param {number} grade - Grade level
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Array of questions
 */
export const generateQuestionBatch = (skillType, count = 10, grade = 3, difficulty = 'medium') => {
  const questions = [];
  const seen = new Set();
  
  while (questions.length < count) {
    const q = generateQuestion(skillType, grade, difficulty);
    const key = q.question;
    
    if (!seen.has(key)) {
      seen.add(key);
      questions.push(q);
    }
  }
  
  return questions;
};

/**
 * Generate an interactive question
 * @param {string} interactiveType - Type of interactive (number-line, fraction-shade, etc.)
 * @param {number} grade - Grade level
 * @param {string} topic - Topic context
 * @returns {Object} Interactive question object
 */
export const generateInteractiveQuestion = (interactiveType, grade = 3, topic = 'general') => {
  switch (interactiveType) {
    case 'number-line':
      return generateNumberLine(grade, topic);
    case 'fraction-shade':
      return generateFractionShade(grade);
    case 'array-builder':
      return generateArrayBuilder(grade);
    case 'drag-sort':
      return generateDragSort(grade, topic);
    case 'clock-face':
    case 'clock':
      return pick([generateClockReading, generateClockSetting])(grade, 'medium');
    default:
      return generateNumberLine(grade, topic);
  }
};

export default {
  generateQuestion,
  generateQuestionBatch,
  generateInteractiveQuestion,
  generateAddition,
  generateSubtraction,
  generateMultiplication,
  generateDivision,
  generateFractionIdentify,
  generateFractionCompare,
  generateFractionAdd,
  generateFractionMultiply,
  generateDecimalAdd,
  generateDecimalMultiply,
  generateDecimalCompare,
  generateWordProblem,
  generateNumberLine,
  generateFractionShade,
  generateArrayBuilder,
  generateDragSort,
  generateClockReading,
  generateClockSetting,
  generateTimeElapsed
};
