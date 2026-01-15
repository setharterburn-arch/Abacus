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
