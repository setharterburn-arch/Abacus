-- Add SmartScore assignment fields to assignments table
-- Run this in Supabase SQL editor

-- Add new columns for SmartScore mode
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS assignment_mode TEXT DEFAULT 'quiz',
ADD COLUMN IF NOT EXISTS target_score INTEGER DEFAULT 80,
ADD COLUMN IF NOT EXISTS skill_id TEXT,
ADD COLUMN IF NOT EXISTS skill_name TEXT,
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS grade_level INTEGER;

-- Add index for skill lookups
CREATE INDEX IF NOT EXISTS idx_assignments_skill ON assignments(skill_id);
CREATE INDEX IF NOT EXISTS idx_assignments_mode ON assignments(assignment_mode);

-- Update assignment_submissions to track SmartScore
ALTER TABLE assignment_submissions
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Comment for documentation
COMMENT ON COLUMN assignments.assignment_mode IS 'smartscore (adaptive mastery) or quiz (fixed questions)';
COMMENT ON COLUMN assignments.target_score IS 'SmartScore threshold to complete (default 80)';
COMMENT ON COLUMN assignments.skill_id IS 'Reference to curriculum skill for SmartScore mode';
