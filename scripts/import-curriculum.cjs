/**
 * Import curriculum JSON into Supabase
 * Run: node scripts/import-curriculum.cjs
 */

const fs = require('fs');
const path = require('path');

// Local Supabase credentials
const SUPABASE_URL = 'http://localhost:8000';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IZXyaGUFCUrFs90AZAyYL-2Tb2JHxVYedByhIMYybMY';

async function supabaseRequest(endpoint, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error: ${res.status} ${text}`);
  }
  return res;
}

async function main() {
  console.log('Loading curriculum JSON...');
  const curriculumPath = path.join(__dirname, '../src/data/curriculum.json');
  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
  
  console.log(`Found ${curriculum.length} skills to import`);
  
  // Clear existing data (use filter to delete all)
  console.log('Clearing existing data...');
  await supabaseRequest('questions?id=gt.0', 'DELETE', undefined).catch(() => {});
  await supabaseRequest('skills?id=neq.null', 'DELETE', undefined).catch(() => {});
  
  // Batch insert skills
  console.log('Importing skills...');
  const skills = curriculum.map(skill => ({
    id: skill.id,
    title: skill.title,
    description: skill.description || '',
    grade_level: skill.grade_level ?? skill.grade ?? 0,
    topic: skill.topic || 'General',
    difficulty: skill.difficulty || 'medium'
  }));
  
  // Insert in batches of 100
  const BATCH_SIZE = 100;
  for (let i = 0; i < skills.length; i += BATCH_SIZE) {
    const batch = skills.slice(i, i + BATCH_SIZE);
    await supabaseRequest('skills', 'POST', batch);
    process.stdout.write(`\r  Skills: ${Math.min(i + BATCH_SIZE, skills.length)}/${skills.length}`);
  }
  console.log('\n  Skills imported!');
  
  // Batch insert questions
  console.log('Importing questions...');
  let totalQuestions = 0;
  let allQuestions = [];
  
  for (const skill of curriculum) {
    if (skill.questions && skill.questions.length > 0) {
      for (const q of skill.questions) {
        allQuestions.push({
          skill_id: skill.id,
          question: q.question,
          type: q.type || 'multiple_choice',
          options: q.options ? JSON.stringify(q.options) : null,
          answer: String(q.answer),
          explanation: q.explanation || null,
          hint: q.hint || null,
          image: q.image || null
        });
      }
    }
  }
  
  totalQuestions = allQuestions.length;
  console.log(`  Found ${totalQuestions} questions`);
  
  for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
    const batch = allQuestions.slice(i, i + BATCH_SIZE);
    await supabaseRequest('questions', 'POST', batch);
    process.stdout.write(`\r  Questions: ${Math.min(i + BATCH_SIZE, totalQuestions)}/${totalQuestions}`);
  }
  console.log('\n  Questions imported!');
  
  console.log('\n✅ Import complete!');
  console.log(`   ${skills.length} skills`);
  console.log(`   ${totalQuestions} questions`);
}

main().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
