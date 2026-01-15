-- Migration to add Gamification tables

-- Table to store stats for students separate from auth profile
CREATE TABLE IF NOT EXISTS student_stats (
    id UUID PRIMARY KEY REFERENCES profiles(id),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    inventory JSONB DEFAULT '[]'::jsonb, -- Array of item IDs
    equipped_items JSONB DEFAULT '{}'::jsonb, -- Key-value e.g. { "hat": "cowboy_hat" }
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE student_stats ENABLE ROW LEVEL SECURITY;

-- Students can read their own stats
CREATE POLICY "Students can view own stats" 
    ON student_stats FOR SELECT 
    USING (auth.uid() = id);

-- Students can update their own stats (simplification for MVP vs server function)
CREATE POLICY "Students can update own stats" 
    ON student_stats FOR UPDATE 
    USING (auth.uid() = id);

-- Trigger to create stats row when a student profile is created (Optional, can handle largely in app)
-- For now, app can insert if missing.
