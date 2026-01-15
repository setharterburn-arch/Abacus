-- Existing Schema content... (kept implicit for this file, but appending new table)

-- WORKSHEETS LIBRARY
CREATE TABLE IF NOT EXISTS worksheets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id), -- Optional: if authenticated
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  difficulty TEXT,
  problem_count INTEGER,
  problems JSONB NOT NULL, -- The generated problems array
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view public worksheets" 
  ON worksheets FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Teachers can insert worksheets" 
  ON worksheets FOR INSERT 
  WITH CHECK (true); -- Allow anonymous inserts for now or auth check if needed
