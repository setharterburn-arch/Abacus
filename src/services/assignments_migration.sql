-- Create assignments table for teacher assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) NOT NULL,
  class_id UUID REFERENCES classes(id),
  student_id UUID REFERENCES profiles(id),
  
  -- Assignment can be either a curriculum set OR a learning path
  assignment_type VARCHAR(20) NOT NULL,
  curriculum_set_id VARCHAR(100),
  learning_path_id VARCHAR(100),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  
  -- Tracking
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  score INTEGER,
  status VARCHAR(20) DEFAULT 'assigned',
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT assignment_type_check CHECK (
    (assignment_type = 'curriculum_set' AND curriculum_set_id IS NOT NULL) OR
    (assignment_type = 'learning_path' AND learning_path_id IS NOT NULL)
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);

-- Enable Row Level Security
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Teachers can view/edit their own assignments
CREATE POLICY teacher_assignments_policy ON assignments
  FOR ALL
  USING (teacher_id = auth.uid());

-- Students can view their own assignments
CREATE POLICY student_assignments_policy ON assignments
  FOR SELECT
  USING (student_id = auth.uid());
