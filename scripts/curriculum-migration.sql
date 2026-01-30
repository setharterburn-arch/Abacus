-- Curriculum tables for AbacusLearn
-- Run this in Supabase SQL editor or via psql

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER NOT NULL DEFAULT 0,
  topic TEXT,
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT DEFAULT 'multiple_choice',
  options JSONB,
  answer TEXT NOT NULL,
  explanation TEXT,
  hint TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skills_grade ON skills(grade_level);
CREATE INDEX IF NOT EXISTS idx_skills_topic ON skills(topic);
CREATE INDEX IF NOT EXISTS idx_questions_skill ON questions(skill_id);

-- Enable Row Level Security (but allow all for now)
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);

-- Service role can do everything
CREATE POLICY "Service role can manage skills" ON skills FOR ALL USING (true);
CREATE POLICY "Service role can manage questions" ON questions FOR ALL USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
