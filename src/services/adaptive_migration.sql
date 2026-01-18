-- Adaptive Learning Database Migration
-- Adds columns for tracking student performance and skill levels

-- Add performance history tracking
ALTER TABLE student_stats ADD COLUMN IF NOT EXISTS 
  performance_history JSONB DEFAULT '[]';

-- Add skill level tracking per topic
ALTER TABLE student_stats ADD COLUMN IF NOT EXISTS 
  skill_levels JSONB DEFAULT '{}';

-- Add last practice timestamp
ALTER TABLE student_stats ADD COLUMN IF NOT EXISTS 
  last_practice_date TIMESTAMPTZ;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_stats_performance 
  ON student_stats USING GIN (performance_history);

CREATE INDEX IF NOT EXISTS idx_student_stats_skills 
  ON student_stats USING GIN (skill_levels);

COMMENT ON COLUMN student_stats.performance_history IS 
  'Array of recent question attempts with correctness, time, and difficulty';

COMMENT ON COLUMN student_stats.skill_levels IS 
  'Object mapping topics to skill levels (0-1 scale)';

COMMENT ON COLUMN student_stats.last_practice_date IS 
  'Timestamp of most recent adaptive practice session';
