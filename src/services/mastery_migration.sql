-- Migration: Add diagnostic and mastery tracking to student_stats
-- Run this after the initial schema is created

ALTER TABLE student_stats 
ADD COLUMN IF NOT EXISTS mastery_levels JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS diagnostic_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS diagnostic_date TIMESTAMPTZ;

COMMENT ON COLUMN student_stats.mastery_levels IS 'Topic mastery percentages e.g. { "Addition": 85, "Subtraction": 70 }';
COMMENT ON COLUMN student_stats.diagnostic_completed IS 'Whether student has completed initial placement test';
COMMENT ON COLUMN student_stats.diagnostic_date IS 'Date of most recent diagnostic test';
