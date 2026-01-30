/**
 * Curriculum Service - Fetches curriculum from Supabase
 * Falls back to static JSON if Supabase is unavailable
 */

import { supabase } from './supabase';

let cachedCurriculum = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all curriculum data (skills with questions)
 * Returns same format as the static curriculum.json
 */
export async function getCurriculum() {
  // Return cached data if fresh
  if (cachedCurriculum && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedCurriculum;
  }

  try {
    // Fetch skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .order('grade_level', { ascending: true })
      .order('topic', { ascending: true });

    if (skillsError) throw skillsError;

    // Fetch all questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');

    if (questionsError) throw questionsError;

    // Group questions by skill_id
    const questionsBySkill = {};
    for (const q of questions) {
      if (!questionsBySkill[q.skill_id]) {
        questionsBySkill[q.skill_id] = [];
      }
      questionsBySkill[q.skill_id].push({
        question: q.question,
        type: q.type,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        answer: q.answer,
        explanation: q.explanation,
        hint: q.hint,
        image: q.image
      });
    }

    // Combine into curriculum format
    const curriculum = skills.map(skill => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      grade_level: skill.grade_level,
      topic: skill.topic,
      difficulty: skill.difficulty,
      questions: questionsBySkill[skill.id] || []
    }));

    // Cache the result
    cachedCurriculum = curriculum;
    cacheTimestamp = Date.now();

    console.log(`Loaded ${curriculum.length} skills from Supabase`);
    return curriculum;

  } catch (error) {
    console.warn('Supabase fetch failed, falling back to static JSON:', error.message);
    
    // Fallback to static JSON
    const staticModule = await import('../data/curriculum.json');
    const staticData = staticModule.default || staticModule;
    
    cachedCurriculum = staticData;
    cacheTimestamp = Date.now();
    
    return staticData;
  }
}

/**
 * Get skills only (without questions, for listings)
 */
export async function getSkills(filters = {}) {
  try {
    let query = supabase
      .from('skills')
      .select('id, title, description, grade_level, topic, difficulty')
      .order('grade_level', { ascending: true })
      .order('topic', { ascending: true });

    if (filters.grade !== undefined && filters.grade !== '') {
      query = query.eq('grade_level', parseInt(filters.grade));
    }

    if (filters.topic) {
      query = query.eq('topic', filters.topic);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;

  } catch (error) {
    console.warn('getSkills failed:', error.message);
    const curriculum = await getCurriculum();
    return curriculum.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      grade_level: s.grade_level,
      topic: s.topic,
      difficulty: s.difficulty
    }));
  }
}

/**
 * Get a single skill with its questions
 */
export async function getSkillById(skillId) {
  try {
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('*')
      .eq('id', skillId)
      .single();

    if (skillError) throw skillError;

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('skill_id', skillId);

    if (questionsError) throw questionsError;

    return {
      ...skill,
      questions: questions.map(q => ({
        question: q.question,
        type: q.type,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        answer: q.answer,
        explanation: q.explanation,
        hint: q.hint,
        image: q.image
      }))
    };

  } catch (error) {
    console.warn('getSkillById failed:', error.message);
    const curriculum = await getCurriculum();
    return curriculum.find(s => s.id === skillId) || null;
  }
}

/**
 * Get questions for a skill
 */
export async function getQuestionsForSkill(skillId) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('skill_id', skillId);

    if (error) throw error;

    return data.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      answer: q.answer,
      explanation: q.explanation,
      hint: q.hint,
      image: q.image
    }));

  } catch (error) {
    console.warn('getQuestionsForSkill failed:', error.message);
    const skill = await getSkillById(skillId);
    return skill?.questions || [];
  }
}

/**
 * Get all unique topics
 */
export async function getTopics() {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('topic')
      .order('topic');

    if (error) throw error;

    const uniqueTopics = [...new Set(data.map(d => d.topic).filter(Boolean))];
    return uniqueTopics;

  } catch (error) {
    const curriculum = await getCurriculum();
    return [...new Set(curriculum.map(s => s.topic).filter(Boolean))];
  }
}

/**
 * Clear the cache (call after CRUD operations)
 */
export function clearCurriculumCache() {
  cachedCurriculum = null;
  cacheTimestamp = 0;
}

// CRUD Operations for Admin

/**
 * Create a new skill
 */
export async function createSkill(skillData) {
  const { data, error } = await supabase
    .from('skills')
    .insert([{
      id: skillData.id,
      title: skillData.title,
      description: skillData.description || '',
      grade_level: skillData.grade_level || 0,
      topic: skillData.topic || 'General',
      difficulty: skillData.difficulty || 'medium'
    }])
    .select()
    .single();

  if (error) throw error;
  clearCurriculumCache();
  return data;
}

/**
 * Update a skill
 */
export async function updateSkill(skillId, updates) {
  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', skillId)
    .select()
    .single();

  if (error) throw error;
  clearCurriculumCache();
  return data;
}

/**
 * Delete a skill (cascades to questions)
 */
export async function deleteSkill(skillId) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', skillId);

  if (error) throw error;
  clearCurriculumCache();
}

/**
 * Add a question to a skill
 */
export async function addQuestion(skillId, questionData) {
  const { data, error } = await supabase
    .from('questions')
    .insert([{
      skill_id: skillId,
      question: questionData.question,
      type: questionData.type || 'multiple_choice',
      options: questionData.options ? JSON.stringify(questionData.options) : null,
      answer: String(questionData.answer),
      explanation: questionData.explanation || null,
      hint: questionData.hint || null,
      image: questionData.image || null
    }])
    .select()
    .single();

  if (error) throw error;
  clearCurriculumCache();
  return data;
}

/**
 * Update a question
 */
export async function updateQuestion(questionId, updates) {
  if (updates.options) {
    updates.options = JSON.stringify(updates.options);
  }
  
  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', questionId)
    .select()
    .single();

  if (error) throw error;
  clearCurriculumCache();
  return data;
}

/**
 * Delete a question
 */
export async function deleteQuestion(questionId) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId);

  if (error) throw error;
  clearCurriculumCache();
}

// Default export for backward compatibility
export default { getCurriculum, getSkills, getSkillById, getQuestionsForSkill, getTopics };
