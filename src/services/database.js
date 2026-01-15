import { supabase } from './supabase';

/**
 * Save a new Curriculum Set to Supabase
 */
export const saveCurriculumSet = async (set) => {
    const { data, error } = await supabase
        .from('curriculum_sets')
        .insert([{
            title: set.title,
            description: set.description,
            grade: set.grade,
            questions: set.questions, // Supabase handles JSONB
            status: set.status || 'draft'
        }])
        .select()
        .single();

    if (error) {
        console.error("Error saving set:", error);
        throw error;
    }
    return data;
};

/**
 * Get Curriculum Sets (optionally filter by status)
 */
export const getCurriculumSets = async (statusFilter = null) => {
    let query = supabase
        .from('curriculum_sets')
        .select('*')
        .order('created_at', { ascending: false });

    if (statusFilter) {
        query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching sets:", error);
        return [];
    }
    return data;
};

/**
 * Update Status (e.g. assign to student)
 */
export const updateCurriculumStatus = async (id, status) => {
    const { error } = await supabase
        .from('curriculum_sets')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

/**
 * Delete a set
 */
export const deleteCurriculumSet = async (id) => {
    const { error } = await supabase
        .from('curriculum_sets')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting set:", error);
        throw error;
    }
};

/**
 * Save Student Grade
 */
export const saveStudentGrade = async (gradeData) => {
    const { error } = await supabase
        .from('student_grades')
        .insert([{
            title: gradeData.title,
            score: gradeData.score,
            feedback: gradeData.feedback,
            date: gradeData.date
        }]);

    if (error) {
        console.error("Error saving grade:", error);
        // Don't throw, just log, so UX isn't broken if offline
    }
};

/**
 * Get Student Grades
 */
export const getStudentGrades = async () => {
    const { data, error } = await supabase
        .from('student_grades')
        .select('*')
        .order('date', { ascending: false });

    if (error) return [];
    return data;
};
