
-- 1. Enable Deletion for Teachers
-- Allow teachers to delete rows in 'classes' where they are the owner
CREATE POLICY "Teachers can delete their own classes"
ON classes FOR DELETE
USING (auth.uid() = teacher_id);

-- 2. Enable Cascading Deletes
-- This ensures that when a class is deleted, all related data is automatically removed
-- instead of causing a "foreign key violation" error.

-- Drop existing constraints (names might vary, so we try standard naming or generic approach)
-- Note: You might need to check your specific constraint names if these fail.
-- Usually generated as: table_column_fkey

ALTER TABLE class_students
DROP CONSTRAINT IF EXISTS class_students_class_id_fkey,
ADD CONSTRAINT class_students_class_id_fkey
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE;

ALTER TABLE assignments
DROP CONSTRAINT IF EXISTS assignments_class_id_fkey,
ADD CONSTRAINT assignments_class_id_fkey
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE;

ALTER TABLE assignment_submissions
DROP CONSTRAINT IF EXISTS assignment_submissions_assignment_id_fkey,
ADD CONSTRAINT assignment_submissions_assignment_id_fkey
    FOREIGN KEY (assignment_id)
    REFERENCES assignments(id)
    ON DELETE CASCADE;

-- 3. Safety Check: Ensure RLS is active
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
