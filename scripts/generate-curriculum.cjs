#!/usr/bin/env node
/**
 * Curriculum Generator - Uses AI APIs to generate IXL-style math content
 * 
 * Usage:
 *   node scripts/generate-curriculum.cjs --grade 7 --topic "Proportional Relationships"
 *   node scripts/generate-curriculum.cjs --grade 4 --topic "Fractions" --skills 15
 *   node scripts/generate-curriculum.cjs --grade 3 --provider gemini  # FREE!
 * 
 * Options:
 *   --grade     Grade level (K, 1-8)
 *   --topic     Specific topic (optional - if omitted, generates variety for grade)
 *   --skills    Number of skills to generate (default: 10)
 *   --provider  AI provider: gemini (FREE) or claude (default: gemini)
 *   --dry-run   Preview without inserting to DB
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Config
const ANTHROPIC_KEY_PATH = path.join(process.env.HOME, '.anthropic_api_key');
const SUPABASE_URL = 'http://127.0.0.1:8000';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.HGq8hbxdKN22pISAdpAld0LyuBoUQW126L0pDU_i2Zg';

// Grade-appropriate topics for variety generation
const GRADE_TOPICS = {
  'K': ['Counting', 'Number Recognition', 'Basic Addition', 'Basic Subtraction', 'Shapes', 'Comparing Numbers', 'Patterns', 'Measurement Basics'],
  '1': ['Addition to 20', 'Subtraction to 20', 'Place Value', 'Comparing Numbers', 'Telling Time', 'Measurement', 'Shapes and Geometry', 'Word Problems'],
  '2': ['Addition to 100', 'Subtraction to 100', 'Place Value to 1000', 'Skip Counting', 'Money', 'Time', 'Measurement', 'Basic Multiplication'],
  '3': ['Multiplication Facts', 'Division Facts', 'Fractions', 'Area and Perimeter', 'Time', 'Graphs and Data', 'Place Value', 'Word Problems'],
  '4': ['Multi-digit Multiplication', 'Long Division', 'Fractions', 'Decimals', 'Angles', 'Area and Perimeter', 'Factors and Multiples', 'Word Problems'],
  '5': ['Decimal Operations', 'Fraction Operations', 'Volume', 'Coordinate Plane', 'Order of Operations', 'Expressions', 'Data Analysis', 'Word Problems'],
  '6': ['Ratios', 'Rates', 'Percents', 'Integers', 'Expressions and Equations', 'Area and Surface Area', 'Statistics', 'Coordinate Plane'],
  '7': ['Proportional Relationships', 'Rational Numbers', 'Expressions and Equations', 'Inequalities', 'Geometry', 'Probability', 'Statistics', 'Percent Applications'],
  '8': ['Linear Equations', 'Functions', 'Systems of Equations', 'Exponents', 'Scientific Notation', 'Pythagorean Theorem', 'Transformations', 'Volume']
};

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { grade: null, topic: null, skills: 10, dryRun: false, provider: 'gemini' };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--grade' && args[i + 1]) result.grade = args[++i];
    else if (args[i] === '--topic' && args[i + 1]) result.topic = args[++i];
    else if (args[i] === '--skills' && args[i + 1]) result.skills = parseInt(args[++i]);
    else if (args[i] === '--provider' && args[i + 1]) result.provider = args[++i];
    else if (args[i] === '--dry-run') result.dryRun = true;
  }
  
  return result;
}

function getPrompt(grade, topic, skillCount) {
  const gradeDisplay = grade === 'K' ? 'Kindergarten' : `Grade ${grade}`;
  const topicClause = topic ? `focusing on "${topic}"` : `covering a variety of topics appropriate for this level`;
  
  return `You are a curriculum designer creating content for an IXL-style adaptive math practice app.

Generate exactly ${skillCount} skills for ${gradeDisplay}, ${topicClause}.

REQUIREMENTS:
1. Each skill must have a unique, descriptive name starting with an action verb (Add, Subtract, Find, Solve, Identify, Compare, Calculate, etc.)
2. Each skill needs 25-35 questions
3. Questions should progress from easy to medium to hard
4. Include a mix of question types:
   - "choice" (multiple choice, 4 options)
   - "input" (type the answer)
   - "NumberLine" (place value on number line - good for decimals, fractions, integers)
   - "FractionShade" (shade a fraction - only for fraction skills)
   - "DragSort" (order items - good for comparing, sequencing)
   - "ArrayBuilder" (build arrays - only for multiplication K-3)

5. Questions must be age-appropriate and match Common Core standards for ${gradeDisplay}
6. NO duplicate questions within a skill
7. Each question needs: question text, type, answer, and options (for choice questions)

OUTPUT FORMAT (JSON only, no markdown, no explanation):
{
  "skills": [
    {
      "name": "Add two-digit numbers with regrouping",
      "topic": "Addition",
      "grade": "${grade}",
      "description": "Practice adding two-digit numbers when the sum requires regrouping",
      "questions": [
        {
          "question": "What is 27 + 45?",
          "type": "choice",
          "options": ["62", "72", "82", "71"],
          "answer": "72",
          "difficulty": "easy"
        },
        {
          "question": "Calculate: 38 + 47 = ?",
          "type": "input",
          "answer": "85",
          "difficulty": "medium"
        }
      ]
    }
  ]
}

Make questions engaging and varied. Use real-world contexts where appropriate (word problems).
Ensure mathematical accuracy - double-check all answers!

Output ONLY the JSON object, nothing else.`;
}

async function generateWithGemini(prompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY not set in environment');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 32000,
    }
  });
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateWithClaude(prompt) {
  const Anthropic = require('@anthropic-ai/sdk');
  
  if (!fs.existsSync(ANTHROPIC_KEY_PATH)) {
    throw new Error('Anthropic API key not found at ' + ANTHROPIC_KEY_PATH);
  }
  const apiKey = fs.readFileSync(ANTHROPIC_KEY_PATH, 'utf-8').trim();
  
  const anthropic = new Anthropic({ apiKey });
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{ role: 'user', content: prompt }]
  });
  
  return response.content[0].text;
}

async function generateCurriculum(provider, grade, topic, skillCount) {
  console.log(`\n🎯 Generating ${skillCount} skills for Grade ${grade}${topic ? ` (${topic})` : ''}...`);
  console.log(`   Using: ${provider === 'gemini' ? 'Gemini 2.5 Flash (FREE)' : 'Claude Sonnet ($)'}`);
  
  const prompt = getPrompt(grade, topic, skillCount);
  
  let text;
  if (provider === 'gemini') {
    text = await generateWithGemini(prompt);
  } else {
    text = await generateWithClaude(prompt);
  }
  
  // Extract JSON from response
  let json;
  try {
    // Clean up common issues
    text = text.trim();
    if (text.startsWith('```json')) text = text.slice(7);
    if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);
    text = text.trim();
    
    json = JSON.parse(text);
  } catch (e) {
    // Try to find JSON object in the response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      json = JSON.parse(match[0]);
    } else {
      console.error('Raw response:', text.substring(0, 500));
      throw new Error('Could not parse JSON from response: ' + e.message);
    }
  }
  
  return json.skills;
}

function validateSkills(skills) {
  const issues = [];
  
  skills.forEach((skill, i) => {
    if (!skill.name) issues.push(`Skill ${i}: missing name`);
    if (!skill.topic) issues.push(`Skill ${i}: missing topic`);
    if (!skill.questions || skill.questions.length < 10) {
      issues.push(`Skill ${i} (${skill.name}): only ${skill.questions?.length || 0} questions (need 10+)`);
    }
    
    skill.questions?.forEach((q, j) => {
      if (!q.question) issues.push(`Skill ${i} Q${j}: missing question text`);
      if (!q.answer && q.answer !== 0) issues.push(`Skill ${i} Q${j}: missing answer`);
      if (q.type === 'choice' && (!q.options || q.options.length < 2)) {
        issues.push(`Skill ${i} Q${j}: choice question needs options`);
      }
    });
  });
  
  return issues;
}

async function insertToDatabase(supabase, skills) {
  let totalQuestions = 0;
  let insertedSkills = 0;
  
  for (const skill of skills) {
    const skillId = crypto.randomUUID();
    
    // Convert K to 0 for database
    const gradeLevel = skill.grade === 'K' ? 0 : parseInt(skill.grade);
    
    const { error: skillError } = await supabase.from('skills').insert({
      id: skillId,
      title: skill.name,
      topic: skill.topic,
      grade_level: gradeLevel,
      description: skill.description || null
    });
    
    if (skillError) {
      console.error(`  ❌ Failed to insert skill "${skill.name}":`, skillError.message);
      continue;
    }
    
    const questions = skill.questions.map(q => ({
      skill_id: skillId,
      question: q.question,
      type: q.type || 'choice',
      options: q.options ? JSON.stringify(q.options) : null,
      answer: String(q.answer)
    }));
    
    const { error: qError } = await supabase.from('questions').insert(questions);
    
    if (qError) {
      console.error(`  ⚠️ Failed to insert questions for "${skill.name}":`, qError.message);
    } else {
      insertedSkills++;
      totalQuestions += questions.length;
      console.log(`  ✅ ${skill.name}: ${questions.length} questions`);
    }
  }
  
  return { insertedSkills, totalQuestions };
}

async function main() {
  const { grade, topic, skills: skillCount, dryRun, provider } = parseArgs();
  
  if (!grade) {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  📚 AbacusLearn Curriculum Generator                      ║
╠═══════════════════════════════════════════════════════════╣
║  Usage:                                                   ║
║    node scripts/generate-curriculum.cjs --grade <K|1-8>   ║
║                                                           ║
║  Options:                                                 ║
║    --grade     Grade level (required)                     ║
║    --topic     Specific topic (optional)                  ║
║    --skills    Number of skills (default: 10)             ║
║    --provider  gemini (FREE) or claude (default: gemini)  ║
║    --dry-run   Preview without inserting to DB            ║
╠═══════════════════════════════════════════════════════════╣
║  Examples:                                                ║
║    # Generate 10 Grade 7 skills (free with Gemini)        ║
║    node scripts/generate-curriculum.cjs --grade 7         ║
║                                                           ║
║    # Generate specific topic                              ║
║    node scripts/generate-curriculum.cjs --grade 4 \\       ║
║      --topic "Fractions" --skills 15                      ║
║                                                           ║
║    # Preview first (dry run)                              ║
║    node scripts/generate-curriculum.cjs --grade 6 \\       ║
║      --skills 5 --dry-run                                 ║
║                                                           ║
║    # Use Claude instead (costs money)                     ║
║    node scripts/generate-curriculum.cjs --grade 8 \\       ║
║      --provider claude                                    ║
╚═══════════════════════════════════════════════════════════╝
`);
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📚 AbacusLearn Curriculum Generator');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Grade: ${grade}`);
  console.log(`  Topic: ${topic || '(varied)'}`);
  console.log(`  Skills to generate: ${skillCount}`);
  console.log(`  Provider: ${provider === 'gemini' ? 'Gemini 2.5 Flash (FREE!)' : 'Claude Sonnet ($)'}`);
  console.log(`  Mode: ${dryRun ? 'DRY RUN (preview only)' : 'LIVE (will insert to DB)'}`);
  console.log('═══════════════════════════════════════════════════════════');
  
  try {
    const skills = await generateCurriculum(provider, grade, topic, skillCount);
    
    console.log(`\n📋 Generated ${skills.length} skills:`);
    skills.forEach(s => {
      console.log(`   - ${s.name} (${s.questions?.length || 0} questions)`);
    });
    
    const issues = validateSkills(skills);
    if (issues.length > 0) {
      console.log('\n⚠️ Validation issues:');
      issues.slice(0, 10).forEach(i => console.log(`   ${i}`));
      if (issues.length > 10) console.log(`   ... and ${issues.length - 10} more`);
    }
    
    if (!dryRun) {
      console.log('\n💾 Inserting to database...');
      const { insertedSkills, totalQuestions } = await insertToDatabase(supabase, skills);
      
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log(`  ✅ COMPLETE: Added ${insertedSkills} skills, ${totalQuestions} questions`);
      console.log('═══════════════════════════════════════════════════════════');
    } else {
      const totalQ = skills.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log(`  🔍 DRY RUN: Would add ${skills.length} skills, ${totalQ} questions`);
      console.log('═══════════════════════════════════════════════════════════');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
