-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('student', 'teacher', 'admin')),
  first_name text,
  last_name text,
  avatar_url text,
  grade_level int,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for classes (Teachers create these)
create table classes (
  id uuid default uuid_generate_v4() primary key,
  teacher_id uuid references profiles(id) not null,
  name text not null,
  join_code text unique not null,
  created_at timestamptz default now()
);

alter table classes enable row level security;

create policy "Classes are viewable by everyone."
  on classes for select
  using ( true );

create policy "Teachers can create classes."
  on classes for insert
  with check ( auth.uid() = teacher_id );

create policy "Teachers can update their own classes."
  on classes for update
  using ( auth.uid() = teacher_id );

-- Create a junction table for Student-Class enrollment
create table class_students (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references classes(id) not null,
  student_id uuid references profiles(id) not null,
  enrolled_at timestamptz default now(),
  unique(class_id, student_id)
);

alter table class_students enable row level security;

create policy "Enrollments are viewable by everyone."
  on class_students for select
  using ( true );

create policy "Students can enroll themselves."
  on class_students for insert
  with check ( auth.uid() = student_id );

-- ASSIGNMENTS & SUBMISSIONS

create table assignments (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references classes(id) not null,
  title text not null,
  description text,
  questions jsonb not null, -- Array of { question, options, answer }
  due_date timestamptz,
  created_at timestamptz default now()
);

alter table assignments enable row level security;

-- Teachers can manage assignments for their own classes
create policy "Teachers can manage their class assignments."
  on assignments for all
  using ( exists (select 1 from classes where id = assignments.class_id and teacher_id = auth.uid()) );

-- Students can view assignments for classes they joined
create policy "Students can view class assignments."
  on assignments for select
  using ( exists (select 1 from class_students where class_id = assignments.class_id and student_id = auth.uid()) );

create table assignment_submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references assignments(id) not null,
  student_id uuid references profiles(id) not null,
  answers jsonb not null, -- Student's answers
  score int,
  status text default 'submitted',
  submitted_at timestamptz default now()
);

alter table assignment_submissions enable row level security;

-- Students can insert/view their own submissions
create policy "Students can manage own submissions."
  on assignment_submissions for all
  using ( auth.uid() = student_id );

-- Teachers can view submissions for their assignments
create policy "Teachers can view submissions."
  on assignment_submissions for select
  using ( exists (
    select 1 from assignments
    join classes on classes.id = assignments.class_id
    where assignments.id = assignment_submissions.assignment_id
    and classes.teacher_id = auth.uid()
  ));
