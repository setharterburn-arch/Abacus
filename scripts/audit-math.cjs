#!/usr/bin/env node
/**
 * Math Accuracy Audit Script
 * 
 * Checks generated math questions for accuracy.
 * Focuses on simple arithmetic operations that can be verified programmatically.
 * 
 * Usage:
 *   node scripts/audit-math.cjs
 *   node scripts/audit-math.cjs --fix  # Attempt to fix incorrect answers
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://127.0.0.1:8000';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.HGq8hbxdKN22pISAdpAld0LyuBoUQW126L0pDU_i2Zg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Skip questions that are conceptual (not pure arithmetic)
const skipPatterns = [
  /which\s+(array|model|picture|fraction|diagram)/i,
  /true\s+or\s+false/i,
  /NOT\s+equivalent/i,
  /is\s+greater/i,
  /is\s+less/i,
  /compare/i,
  /order\s+(these|the)/i,
  /repeated\s+addition/i,
  /word\s+problem/i,
  /how\s+many/i,
  /what\s+is\s+the\s+value/i,
  /simplest\s+form/i,
  /equivalent\s+to/i,
  /can\s+help\s+you\s+solve/i,
  /which\s+number/i,
  /choose/i,
  /select/i,
];

// Patterns for pure arithmetic questions
const arithmeticPatterns = [
  // "What is 5 + 3?"
  { pattern: /what\s+is\s+(\d+(?:,\d+)*(?:\.\d+)?)\s*\+\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*\??/i, op: 'add' },
  { pattern: /what\s+is\s+(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*\??/i, op: 'sub' },
  { pattern: /what\s+is\s+(\d+(?:,\d+)*(?:\.\d+)?)\s*[×x*]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*\??/i, op: 'mul' },
  { pattern: /what\s+is\s+(\d+(?:,\d+)*(?:\.\d+)?)\s*[÷/]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*\??/i, op: 'div' },
  
  // "Calculate: 45 + 23"
  { pattern: /calculate[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*\+\s*(\d+(?:,\d+)*(?:\.\d+)?)/i, op: 'add' },
  { pattern: /calculate[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*(\d+(?:,\d+)*(?:\.\d+)?)/i, op: 'sub' },
  { pattern: /calculate[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*[×x*]\s*(\d+(?:,\d+)*(?:\.\d+)?)/i, op: 'mul' },
  { pattern: /calculate[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*[÷/]\s*(\d+(?:,\d+)*(?:\.\d+)?)/i, op: 'div' },
  
  // "Solve: 12 × 5 = ?"
  { pattern: /solve[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*\+\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=/i, op: 'add' },
  { pattern: /solve[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=/i, op: 'sub' },
  { pattern: /solve[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*[×x*]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=/i, op: 'mul' },
  { pattern: /solve[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)\s*[÷/]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=/i, op: 'div' },
  
  // Simple "5 + 3 = ?"
  { pattern: /^(\d+(?:,\d+)*(?:\.\d+)?)\s*\+\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=?\s*\??$/i, op: 'add' },
  { pattern: /^(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=?\s*\??$/i, op: 'sub' },
  { pattern: /^(\d+(?:,\d+)*(?:\.\d+)?)\s*[×x*]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=?\s*\??$/i, op: 'mul' },
  { pattern: /^(\d+(?:,\d+)*(?:\.\d+)?)\s*[÷/]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*=?\s*\??$/i, op: 'div' },
];

function shouldSkip(question) {
  return skipPatterns.some(p => p.test(question));
}

function parseNumber(str) {
  return parseFloat(str.replace(/,/g, ''));
}

function extractOperation(question) {
  // Skip conceptual questions
  if (shouldSkip(question)) return null;
  
  for (const { pattern, op } of arithmeticPatterns) {
    const match = question.match(pattern);
    if (match) {
      return { 
        op, 
        a: parseNumber(match[1]), 
        b: parseNumber(match[2]) 
      };
    }
  }
  
  return null;
}

function calculateAnswer(op, a, b) {
  switch (op) {
    case 'add': return a + b;
    case 'sub': return a - b;
    case 'mul': return a * b;
    case 'div': return b !== 0 ? a / b : null;
    default: return null;
  }
}

function normalizeAnswer(answer) {
  if (answer === null || answer === undefined) return null;
  
  const str = String(answer).trim();
  
  // Remove common prefixes/suffixes
  const cleaned = str
    .replace(/^[=$=:]\s*/, '')
    .replace(/,/g, '')
    .trim();
  
  const num = parseFloat(cleaned);
  if (!isNaN(num)) return num;
  
  return null;
}

async function auditQuestions(shouldFix = false) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🔍 Math Accuracy Audit (Arithmetic Only)');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Fetch all questions
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, skill_id, question, type, answer')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch questions:', error.message);
    return;
  }

  console.log(`📊 Total questions: ${questions.length}\n`);

  const issues = [];
  let checked = 0;
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  for (const q of questions) {
    const operation = extractOperation(q.question);
    
    if (!operation) {
      skipped++;
      continue;
    }

    checked++;
    const expectedAnswer = calculateAnswer(operation.op, operation.a, operation.b);
    const actualAnswer = normalizeAnswer(q.answer);

    if (expectedAnswer === null || actualAnswer === null) {
      skipped++;
      checked--;
      continue;
    }

    // Compare with tolerance for floating point
    const tolerance = 0.01;
    const matches = Math.abs(actualAnswer - expectedAnswer) < tolerance;

    if (matches) {
      correct++;
    } else {
      incorrect++;
      issues.push({
        id: q.id,
        question: q.question,
        expected: expectedAnswer,
        actual: actualAnswer,
        operation
      });
    }
  }

  console.log('📈 Results:');
  console.log(`   Checked (pure arithmetic): ${checked}`);
  console.log(`   Correct: ${correct} (${checked > 0 ? (correct/checked*100).toFixed(1) : 0}%)`);
  console.log(`   Incorrect: ${incorrect}`);
  console.log(`   Skipped (conceptual/complex): ${skipped}\n`);

  if (issues.length > 0) {
    console.log('❌ Arithmetic errors found:\n');
    
    for (const issue of issues.slice(0, 30)) {
      console.log(`   Q: "${issue.question.substring(0, 70)}${issue.question.length > 70 ? '...' : ''}"`);
      console.log(`      Expected: ${issue.expected}, Got: ${issue.actual}`);
      console.log(`      ID: ${issue.id}\n`);
    }

    if (issues.length > 30) {
      console.log(`   ... and ${issues.length - 30} more issues\n`);
    }

    if (shouldFix) {
      console.log('🔧 Fixing incorrect answers...\n');
      
      let fixed = 0;
      for (const issue of issues) {
        const { error: updateError } = await supabase
          .from('questions')
          .update({ answer: String(issue.expected) })
          .eq('id', issue.id);

        if (!updateError) {
          fixed++;
        } else {
          console.log(`   Failed to fix ID ${issue.id}: ${updateError.message}`);
        }
      }

      console.log(`✅ Fixed ${fixed} / ${issues.length} issues\n`);
    } else {
      console.log('💡 Run with --fix to automatically correct these errors.\n');
    }
  } else {
    console.log('✅ No arithmetic errors detected in pure calculation questions!\n');
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Audit complete');
  console.log('═══════════════════════════════════════════════════════════');
}

// Run audit
const shouldFix = process.argv.includes('--fix');
auditQuestions(shouldFix).catch(console.error);
