#!/usr/bin/env node
/**
 * Rename skills to IXL-style descriptive names
 * IXL names are: specific, action-oriented, grade-appropriate
 */

const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.json');
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

// IXL-style name patterns by topic/keyword
const namePatterns = {
  // Counting
  'counting-1-20': 'Count to 20',
  'counting-to-100': 'Count to 100',
  'skip-counting': 'Skip count by 2s, 5s, and 10s',
  'counting-by': (title) => title.replace('Counting by', 'Skip count by'),
  
  // Number sense
  'number-order': 'Put numbers in order',
  'comparing-numbers': 'Compare numbers using < > =',
  'comparing-sizes': 'Compare sizes: bigger, smaller, same',
  'even-odd': 'Identify even and odd numbers',
  'number-bonds': 'Number bonds to 10',
  'place-value-tens-ones': 'Understand tens and ones',
  'place-value-hundreds': 'Understand hundreds, tens, and ones',
  'before-after': 'Numbers before and after',
  'more-less': 'More than, less than, equal to',
  
  // Addition
  'add-facts-1-10': 'Add within 10',
  'add-to-20': 'Add within 20',
  'add-2digit': 'Add two-digit numbers',
  'add-3digit': 'Add three-digit numbers',
  'doubles-facts': 'Doubles facts (1+1 through 10+10)',
  'addition-regrouping': 'Add with regrouping',
  'addition-three-numbers': 'Add three numbers',
  
  // Subtraction
  'sub-facts-1-10': 'Subtract within 10',
  'sub-from-10': 'Subtract from 10',
  'sub-2digit': 'Subtract two-digit numbers',
  'sub-3digit': 'Subtract three-digit numbers',
  'subtraction-regrouping': 'Subtract with regrouping',
  'subtraction-missing': 'Find the missing number in subtraction',
  
  // Multiplication
  'mult-tables-2-5': 'Multiply by 2 and 5',
  'mult-tables-3-4': 'Multiply by 3 and 4',
  'mult-tables-6-7': 'Multiply by 6 and 7',
  'mult-tables-8-9': 'Multiply by 8 and 9',
  'mult-tables-10-11-12': 'Multiply by 10, 11, and 12',
  'mult-multi-digit': 'Multiply multi-digit numbers',
  'multiply-by-2': 'Multiply by 2',
  'multiply-by-3': 'Multiply by 3',
  'multiply-by-4': 'Multiply by 4',
  'multiply-by-5': 'Multiply by 5',
  'multiply-by-6': 'Multiply by 6',
  'multiply-by-7': 'Multiply by 7',
  'multiply-by-8': 'Multiply by 8',
  'multiply-by-9': 'Multiply by 9',
  'multiply-by-10': 'Multiply by 10',
  'arrays': 'Use arrays to multiply',
  'long-multiplication': 'Multiply using the standard algorithm',
  'multiplication-word-problems': 'Solve multiplication word problems',
  'multiplication-patterns': 'Find patterns in multiplication',
  'properties-multiplication': 'Properties of multiplication',
  
  // Division
  'division-basics': 'Divide within 100',
  'division-long': 'Long division',
  'division-facts': 'Division facts',
  'mult-div-relationship': 'Relate multiplication and division',
  
  // Fractions
  'fractions-intro': 'Identify fractions',
  'fractions-unit': 'Understand unit fractions',
  'fractions-equivalent': 'Find equivalent fractions',
  'fractions-compare': 'Compare fractions',
  'fractions-add-sub': 'Add and subtract fractions',
  'fractions-add': 'Add fractions',
  'fractions-subtract': 'Subtract fractions',
  'fractions-multiply': 'Multiply fractions',
  'fractions-divide': 'Divide fractions',
  'fractions-mixed': 'Mixed numbers and improper fractions',
  'fractions-number-line': 'Fractions on a number line',
  'fractions-parts-of-whole': 'Identify parts of a whole',
  'fractions-word-problems': 'Fraction word problems',
  'fractions-denom': 'Fractions with different denominators',
  
  // Decimals
  'decimals-intro': 'Understand decimal place value',
  'decimals-operations': 'Add and subtract decimals',
  'decimals-tenths': 'Decimals to tenths',
  'decimals-hundredths': 'Decimals to hundredths',
  'decimals-compare': 'Compare decimals',
  'decimals-rounding': 'Round decimals',
  'decimals-add': 'Add decimals',
  'decimals-sub': 'Subtract decimals',
  'decimals-multiply': 'Multiply decimals',
  'decimals-divide': 'Divide decimals',
  'decimals-place-value': 'Decimal place value',
  'decimals-converting': 'Convert fractions and decimals',
  'decimals-word-problems': 'Decimal word problems',
  
  // Geometry
  'shapes-basic': 'Identify basic shapes',
  'colors-shapes': 'Colors and shapes',
  'angles': 'Identify and measure angles',
  'area-perimeter': 'Find area and perimeter',
  'coordinate-plane': 'Graph points on the coordinate plane',
  'volume': 'Find volume of rectangular prisms',
  'geometry-polygons': 'Classify polygons',
  'geometry-triangles': 'Classify triangles',
  'geometry-quadrilaterals': 'Classify quadrilaterals',
  
  // Measurement
  'time-hours': 'Tell time to the hour',
  'time-half-hour': 'Tell time to the half hour',
  'time-quarter': 'Tell time to the quarter hour',
  'time-minutes': 'Tell time to the minute',
  'money-coins': 'Count coins',
  'money-bills': 'Count bills and coins',
  'measurement-length': 'Measure length',
  'capacity': 'Measure capacity',
  
  // Data
  'data-graphs': 'Read and interpret graphs',
  'mean-median-mode': 'Find mean, median, and mode',
  'statistics': 'Interpret data sets',
  
  // Algebra/Pre-algebra
  'patterns': 'Identify and extend patterns',
  'order-operations': 'Order of operations (PEMDAS)',
  'percentages': 'Understand percentages',
  'ratios': 'Understand ratios',
  'integers': 'Work with integers',
  'integers-add': 'Add integers',
  'integers-subtract': 'Subtract integers',
  'integers-multiply': 'Multiply integers',
  'integers-divide': 'Divide integers',
  'exponents': 'Understand exponents',
  'scientific-notation': 'Write in scientific notation',
  'expressions': 'Evaluate expressions',
  'equations': 'Solve equations',
  'inequalities': 'Solve inequalities',
  'linear-equations': 'Graph linear equations',
  
  // Other
  'rounding': 'Round numbers',
  'estimation': 'Estimate sums and differences',
  'word-problems': 'Solve word problems',
  'prime-composite': 'Identify prime and composite numbers',
  'factors-multiples': 'Find factors and multiples',
  'gcf-lcm': 'Find GCF and LCM',
  'roman-numerals': 'Read and write Roman numerals',
  'fact-families': 'Understand fact families',
  'tens-frames': 'Use tens frames',
  'number-lines': 'Use a number line',
  'fact-fluency': 'Build fact fluency',
};

// Grade-appropriate verb prefixes
const gradeVerbs = {
  0: ['Count', 'Identify', 'Match', 'Sort', 'Compare'],
  1: ['Add', 'Subtract', 'Count', 'Identify', 'Compare', 'Find'],
  2: ['Add', 'Subtract', 'Multiply', 'Count', 'Measure', 'Compare'],
  3: ['Multiply', 'Divide', 'Add', 'Subtract', 'Find', 'Solve'],
  4: ['Multiply', 'Divide', 'Add', 'Subtract', 'Find', 'Convert', 'Solve'],
  5: ['Multiply', 'Divide', 'Add', 'Subtract', 'Find', 'Convert', 'Solve', 'Graph'],
  6: ['Solve', 'Find', 'Calculate', 'Evaluate', 'Graph', 'Compare'],
  7: ['Solve', 'Evaluate', 'Simplify', 'Graph', 'Calculate', 'Find'],
  8: ['Solve', 'Prove', 'Derive', 'Graph', 'Analyze', 'Calculate'],
};

function generateIXLName(skill) {
  const id = skill.id || '';
  const title = skill.title || '';
  const grade = skill.grade || 0;
  const topic = (skill.topic || '').toLowerCase();
  
  // Check for exact pattern matches first
  for (const [pattern, replacement] of Object.entries(namePatterns)) {
    if (id.includes(pattern) || title.toLowerCase().includes(pattern.replace(/-/g, ' '))) {
      if (typeof replacement === 'function') {
        return replacement(title);
      }
      return replacement;
    }
  }
  
  // Clean up generic titles
  let newName = title;
  
  // Remove "Introduction to"
  newName = newName.replace(/^Introduction to\s+/i, '');
  
  // Remove grade prefixes like "G3" or "Grade 3"
  newName = newName.replace(/^G\d+[\s-]+/i, '');
  newName = newName.replace(/^Grade\s*\d+[\s:-]+/i, '');
  
  // Make more action-oriented
  if (!newName.match(/^(Add|Subtract|Multiply|Divide|Find|Solve|Count|Identify|Compare|Measure|Graph|Calculate|Evaluate|Use|Read|Write|Understand|Convert|Round|Estimate)/i)) {
    // Add an action verb based on topic
    if (topic.includes('add')) newName = 'Add: ' + newName;
    else if (topic.includes('subtract')) newName = 'Subtract: ' + newName;
    else if (topic.includes('multipl')) newName = 'Multiply: ' + newName;
    else if (topic.includes('divis')) newName = 'Divide: ' + newName;
    else if (topic.includes('fraction')) newName = 'Fractions: ' + newName;
    else if (topic.includes('decimal')) newName = 'Decimals: ' + newName;
    else if (topic.includes('geometry')) newName = 'Geometry: ' + newName;
    else if (topic.includes('data') || topic.includes('statistic')) newName = 'Data: ' + newName;
    else if (topic.includes('measure')) newName = 'Measure: ' + newName;
  }
  
  // Capitalize properly
  newName = newName.replace(/\b\w/g, c => c.toUpperCase());
  
  // Fix specific capitalizations
  newName = newName.replace(/\bAnd\b/g, 'and');
  newName = newName.replace(/\bTo\b/g, 'to');
  newName = newName.replace(/\bOf\b/g, 'of');
  newName = newName.replace(/\bThe\b/g, 'the');
  newName = newName.replace(/\bWith\b/g, 'with');
  newName = newName.replace(/\bBy\b/g, 'by');
  newName = newName.replace(/\bIn\b/g, 'in');
  newName = newName.replace(/\bOn\b/g, 'on');
  newName = newName.replace(/\bA\b/g, 'a');
  
  // Ensure first letter is capitalized
  newName = newName.charAt(0).toUpperCase() + newName.slice(1);
  
  return newName;
}

// Process all skills
let renamed = 0;
const changes = [];

curriculum.forEach(skill => {
  const oldName = skill.title;
  const newName = generateIXLName(skill);
  
  if (oldName !== newName) {
    changes.push({ id: skill.id, grade: skill.grade, old: oldName, new: newName });
    skill.title = newName;
    renamed++;
  }
});

// Save curriculum
fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2));

// Show changes
console.log(`\n========== RENAMED ${renamed} SKILLS ==========\n`);
changes.slice(0, 50).forEach(c => {
  console.log(`[G${c.grade}] "${c.old}" → "${c.new}"`);
});
if (changes.length > 50) {
  console.log(`\n... and ${changes.length - 50} more`);
}

console.log(`\nTotal renamed: ${renamed}`);
