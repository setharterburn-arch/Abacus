/**
 * Deduplicate and Merge Curriculum Skills
 * Combines duplicate skills (same title + grade + topic) into single skills
 * Run: node scripts/dedupe-and-merge.cjs
 */

const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.json');
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

console.log('=== Curriculum Deduplication & Merge ===\n');
console.log(`Starting with ${curriculum.length} skills\n`);

// Group skills by title + grade + topic
const groups = {};
curriculum.forEach(skill => {
  // Normalize the key
  const title = (skill.title || '').toLowerCase().trim();
  const grade = skill.grade_level ?? skill.grade ?? 0;
  const topic = (skill.topic || 'General').toLowerCase().trim();
  const key = `${grade}|${topic}|${title}`;
  
  if (!groups[key]) {
    groups[key] = [];
  }
  groups[key].push(skill);
});

// Find duplicates
const duplicates = Object.entries(groups).filter(([k, v]) => v.length > 1);
console.log(`Found ${duplicates.length} duplicate groups\n`);

// Merge duplicates
const merged = [];
const seen = new Set();

Object.entries(groups).forEach(([key, skills]) => {
  if (skills.length === 1) {
    // No duplicate, keep as-is
    merged.push(skills[0]);
  } else {
    // Merge duplicates
    const first = skills[0];
    const allQuestions = [];
    const seenQuestions = new Set();
    
    skills.forEach(skill => {
      (skill.questions || []).forEach(q => {
        // Dedupe questions by text
        const qKey = (q.question || '').toLowerCase().trim();
        if (!seenQuestions.has(qKey)) {
          seenQuestions.add(qKey);
          allQuestions.push(q);
        }
      });
    });
    
    // Create merged skill
    const mergedSkill = {
      id: first.id,
      title: first.title,
      description: first.description || skills.find(s => s.description)?.description || '',
      grade_level: first.grade_level ?? first.grade ?? 0,
      topic: first.topic || 'General',
      difficulty: first.difficulty || 'medium',
      questions: allQuestions
    };
    
    merged.push(mergedSkill);
    
    // Log the merge
    const originalTotal = skills.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
    console.log(`MERGED: "${first.title}" (G${mergedSkill.grade_level}, ${first.topic})`);
    console.log(`   ${skills.length} skills → 1 skill`);
    console.log(`   ${originalTotal} questions → ${allQuestions.length} unique questions\n`);
  }
});

console.log('=== Summary ===\n');
console.log(`Before: ${curriculum.length} skills`);
console.log(`After:  ${merged.length} skills`);
console.log(`Reduced by: ${curriculum.length - merged.length} skills\n`);

// Count total questions
const totalQuestionsBefore = curriculum.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
const totalQuestionsAfter = merged.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
console.log(`Questions before: ${totalQuestionsBefore}`);
console.log(`Questions after:  ${totalQuestionsAfter} (removed ${totalQuestionsBefore - totalQuestionsAfter} duplicates)\n`);

// Find thin skills that need expansion
const thinSkills = merged.filter(s => (s.questions?.length || 0) < 15);
console.log(`=== Skills Needing Expansion (<15 questions) ===\n`);
console.log(`Found ${thinSkills.length} thin skills:\n`);

// Group thin skills by grade for easier expansion
const thinByGrade = {};
thinSkills.forEach(s => {
  const g = s.grade_level ?? 0;
  if (!thinByGrade[g]) thinByGrade[g] = [];
  thinByGrade[g].push({
    id: s.id,
    title: s.title,
    topic: s.topic,
    current: s.questions?.length || 0,
    needed: 25 - (s.questions?.length || 0)
  });
});

Object.entries(thinByGrade).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([grade, skills]) => {
  console.log(`Grade ${grade === '0' ? 'K' : grade}: ${skills.length} thin skills`);
  skills.slice(0, 5).forEach(s => {
    console.log(`   - ${s.title} (${s.current}q, need +${s.needed})`);
  });
  if (skills.length > 5) console.log(`   ... +${skills.length - 5} more`);
  console.log('');
});

// Save merged curriculum
const outputPath = path.join(__dirname, '../src/data/curriculum.json');
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));
console.log(`\n✅ Saved merged curriculum to ${outputPath}`);

// Save thin skills list for AI expansion
const thinSkillsPath = path.join(__dirname, '../thin-skills-to-expand.json');
fs.writeFileSync(thinSkillsPath, JSON.stringify(thinByGrade, null, 2));
console.log(`📝 Saved thin skills list to ${thinSkillsPath}`);
