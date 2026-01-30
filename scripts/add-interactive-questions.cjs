#!/usr/bin/env node
/**
 * Add interactive questions to curriculum based on topic/skill matching
 */

const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.json');
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

let added = {
  'number-line': 0,
  'fraction-shade': 0,
  'array-builder': 0,
  'drag-sort': 0
};

// ========== GENERATORS ==========

function generateNumberLineQuestions(skill) {
  const questions = [];
  const grade = skill.grade || 0;
  const topic = (skill.topic || '').toLowerCase();
  const title = (skill.title || '').toLowerCase();
  
  // Fractions on number line (grades 2-6)
  if ((topic.includes('fraction') || title.includes('fraction')) && grade >= 2 && grade <= 6) {
    const fractions = [
      { num: 1, den: 2, val: 0.5 },
      { num: 1, den: 4, val: 0.25 },
      { num: 3, den: 4, val: 0.75 },
      { num: 1, den: 3, val: 0.333 },
      { num: 2, den: 3, val: 0.667 },
      { num: 1, den: 5, val: 0.2 },
      { num: 2, den: 5, val: 0.4 },
      { num: 3, den: 5, val: 0.6 },
      { num: 4, den: 5, val: 0.8 }
    ];
    
    const picks = fractions.sort(() => Math.random() - 0.5).slice(0, 3);
    picks.forEach(f => {
      questions.push({
        type: 'number-line',
        question: `Place ${f.num}/${f.den} on the number line`,
        min: 0,
        max: 1,
        divisions: f.den <= 4 ? f.den : 5,
        answer: f.val,
        tolerance: 0.08
      });
    });
  }
  
  // Decimals on number line (grades 4-6)
  if ((topic.includes('decimal') || title.includes('decimal')) && grade >= 4) {
    const decimals = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
    const picks = decimals.sort(() => Math.random() - 0.5).slice(0, 3);
    picks.forEach(d => {
      questions.push({
        type: 'number-line',
        question: `Place ${d} on the number line`,
        min: 0,
        max: 1,
        divisions: 10,
        answer: d,
        tolerance: 0.05
      });
    });
  }
  
  // Integers/negatives on number line (grades 6-8)
  if ((topic.includes('integer') || title.includes('negative') || title.includes('integer')) && grade >= 6) {
    const integers = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    const picks = integers.sort(() => Math.random() - 0.5).slice(0, 3);
    picks.forEach(n => {
      questions.push({
        type: 'number-line',
        question: `Place ${n} on the number line`,
        min: -6,
        max: 6,
        divisions: 12,
        answer: n,
        tolerance: 0.5
      });
    });
  }
  
  // Number sense / place value (grades K-3)
  if ((topic.includes('number sense') || topic.includes('counting') || title.includes('number')) && grade <= 3) {
    const numbers = grade === 0 ? [1,2,3,4,5,6,7,8,9,10] :
                    grade === 1 ? [5,10,15,20,25,30,35,40,45,50] :
                    grade === 2 ? [10,20,30,40,50,60,70,80,90,100] :
                    [25,50,75,100,125,150,175,200];
    const max = grade === 0 ? 10 : grade === 1 ? 50 : grade === 2 ? 100 : 200;
    const picks = numbers.sort(() => Math.random() - 0.5).slice(0, 2);
    picks.forEach(n => {
      questions.push({
        type: 'number-line',
        question: `Place ${n} on the number line`,
        min: 0,
        max: max,
        divisions: 10,
        answer: n,
        tolerance: max / 20
      });
    });
  }
  
  return questions;
}

function generateFractionShadeQuestions(skill) {
  const questions = [];
  const grade = skill.grade || 0;
  const topic = (skill.topic || '').toLowerCase();
  const title = (skill.title || '').toLowerCase();
  
  if (!topic.includes('fraction') && !title.includes('fraction')) return questions;
  if (grade > 5) return questions; // Visual fractions mostly K-5
  
  const shapes = ['rectangle', 'circle', 'square'];
  const fractions = [
    { parts: 2, shaded: 1 }, // 1/2
    { parts: 3, shaded: 1 }, // 1/3
    { parts: 3, shaded: 2 }, // 2/3
    { parts: 4, shaded: 1 }, // 1/4
    { parts: 4, shaded: 2 }, // 2/4
    { parts: 4, shaded: 3 }, // 3/4
    { parts: 5, shaded: 2 }, // 2/5
    { parts: 5, shaded: 3 }, // 3/5
    { parts: 6, shaded: 1 }, // 1/6
    { parts: 6, shaded: 5 }, // 5/6
    { parts: 8, shaded: 3 }, // 3/8
    { parts: 8, shaded: 5 }, // 5/8
  ];
  
  // Filter by grade
  const filtered = fractions.filter(f => {
    if (grade <= 2) return f.parts <= 4;
    if (grade <= 3) return f.parts <= 6;
    return true;
  });
  
  const picks = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
  picks.forEach(f => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    questions.push({
      type: 'fraction-shade',
      question: `Shade ${f.shaded}/${f.parts} of the ${shape}`,
      shape: shape,
      parts: f.parts,
      answer: f.shaded,
      orientation: Math.random() > 0.5 ? 'horizontal' : 'vertical'
    });
  });
  
  return questions;
}

function generateArrayBuilderQuestions(skill) {
  const questions = [];
  const grade = skill.grade || 0;
  const topic = (skill.topic || '').toLowerCase();
  const title = (skill.title || '').toLowerCase();
  
  // Only for multiplication/arrays topics, grades 2-4
  if (grade < 2 || grade > 5) return questions;
  if (!topic.includes('multipl') && !topic.includes('array') && !title.includes('multipl') && !title.includes('array')) {
    return questions;
  }
  
  const facts = grade <= 3 ? 
    [[2,3], [2,4], [2,5], [3,3], [3,4], [3,5], [4,4], [4,5], [5,5]] :
    [[3,6], [4,6], [5,6], [6,6], [4,7], [5,7], [6,7], [5,8], [6,8]];
  
  const picks = facts.sort(() => Math.random() - 0.5).slice(0, 2);
  picks.forEach(([r, c]) => {
    questions.push({
      type: 'array-builder',
      question: `Build an array to show ${r} × ${c}`,
      targetRows: r,
      targetCols: c,
      maxRows: Math.max(r + 2, 6),
      maxCols: Math.max(c + 2, 8)
    });
  });
  
  return questions;
}

function generateDragSortQuestions(skill) {
  const questions = [];
  const grade = skill.grade || 0;
  const topic = (skill.topic || '').toLowerCase();
  const title = (skill.title || '').toLowerCase();
  
  // Good for comparing, ordering, number sense
  const isOrdering = title.includes('order') || title.includes('compar') || 
                     title.includes('least to greatest') || title.includes('greatest to least') ||
                     topic.includes('comparison');
  const isNumberSense = topic.includes('number sense') || topic.includes('place value');
  const isFraction = topic.includes('fraction') && (title.includes('compar') || title.includes('order'));
  
  if (!isOrdering && !isNumberSense && !isFraction) return questions;
  
  if (isFraction && grade >= 3) {
    // Order fractions
    const sets = [
      ['1/4', '1/2', '3/4', '1'],
      ['1/3', '1/2', '2/3', '5/6'],
      ['1/8', '1/4', '3/8', '1/2'],
      ['1/5', '2/5', '3/5', '4/5'],
    ];
    const set = sets[Math.floor(Math.random() * sets.length)];
    questions.push({
      type: 'drag-sort',
      question: 'Order these fractions from least to greatest',
      items: [...set].sort(() => Math.random() - 0.5),
      correctOrder: set
    });
  } else if (grade <= 2) {
    // Simple number ordering
    const start = grade === 0 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 20);
    const nums = [start, start + 2, start + 5, start + 8].map(String);
    questions.push({
      type: 'drag-sort',
      question: 'Order these numbers from least to greatest',
      items: [...nums].sort(() => Math.random() - 0.5),
      correctOrder: nums
    });
  } else if (grade >= 3 && grade <= 5) {
    // Larger numbers or decimals
    if (topic.includes('decimal') || title.includes('decimal')) {
      const decimals = ['0.1', '0.25', '0.5', '0.75', '0.9'];
      const picks = decimals.sort(() => Math.random() - 0.5).slice(0, 4);
      const sorted = [...picks].sort((a, b) => parseFloat(a) - parseFloat(b));
      questions.push({
        type: 'drag-sort',
        question: 'Order these decimals from least to greatest',
        items: picks,
        correctOrder: sorted
      });
    } else {
      const base = Math.floor(Math.random() * 500);
      const nums = [base, base + 50, base + 150, base + 300].map(String);
      questions.push({
        type: 'drag-sort',
        question: 'Order these numbers from least to greatest',
        items: [...nums].sort(() => Math.random() - 0.5),
        correctOrder: nums
      });
    }
  } else if (grade >= 6) {
    // Integers
    const integers = ['-5', '-2', '0', '3', '7'];
    const picks = integers.sort(() => Math.random() - 0.5).slice(0, 4);
    const sorted = [...picks].sort((a, b) => parseInt(a) - parseInt(b));
    questions.push({
      type: 'drag-sort',
      question: 'Order these integers from least to greatest',
      items: picks,
      correctOrder: sorted
    });
  }
  
  return questions;
}

// ========== MAIN ==========

let skillsModified = 0;

curriculum.forEach(skill => {
  const originalCount = skill.questions?.length || 0;
  if (!skill.questions) skill.questions = [];
  
  // Check if skill already has interactive questions
  const hasInteractive = skill.questions.some(q => q.type && q.type !== 'multiple-choice');
  if (hasInteractive) return; // Skip skills that already have interactive
  
  const numberLine = generateNumberLineQuestions(skill);
  const fractionShade = generateFractionShadeQuestions(skill);
  const arrayBuilder = generateArrayBuilderQuestions(skill);
  const dragSort = generateDragSortQuestions(skill);
  
  const newQuestions = [...numberLine, ...fractionShade, ...arrayBuilder, ...dragSort];
  
  if (newQuestions.length > 0) {
    skill.questions.push(...newQuestions);
    skillsModified++;
    added['number-line'] += numberLine.length;
    added['fraction-shade'] += fractionShade.length;
    added['array-builder'] += arrayBuilder.length;
    added['drag-sort'] += dragSort.length;
    
    console.log(`  ${skill.id} (grade ${skill.grade}): +${newQuestions.length} interactive`);
  }
});

// Save
fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2));

console.log('\n========== SUMMARY ==========');
console.log(`Skills modified: ${skillsModified}`);
console.log(`Number Line: +${added['number-line']}`);
console.log(`Fraction Shade: +${added['fraction-shade']}`);
console.log(`Array Builder: +${added['array-builder']}`);
console.log(`Drag Sort: +${added['drag-sort']}`);
console.log(`TOTAL: +${Object.values(added).reduce((a,b) => a+b, 0)} interactive questions`);
