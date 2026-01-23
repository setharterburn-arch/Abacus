
-- 1. Create the pending_students table
create table pending_students (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  access_code text not null unique,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table pending_students enable row level security;

-- 3. RLS Policies
-- Teachers can see/add/delete pending students for their own classes
create policy "Teachers can manage pending students"
on pending_students
for all
to authenticated
using (
  exists (
    select 1 from classes
    where classes.id = pending_students.class_id
    and classes.teacher_id = auth.uid()
  )
);

-- Students (Anon/Auth) need to be able to 'read' the pending student status ONLY via the claim function (security definer)
-- potentially, or we just allow the claim function to bypass RLS.

-- 4. Claim Access Code Function
create or replace function claim_access_code(code_input text)
returns json
language plpgsql
security definer -- Run as superuser to bypass RLS checks during specific claim actions
as $$
declare
  pending_record record;
  class_record record;
  user_id uuid;
begin
  -- Get current user
  user_id := auth.uid();
  if user_id is null then
    return json_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- 1. Check if it matches a PENDING student code
  select * into pending_record from pending_students where upper(access_code) = upper(code_input);

  if found then
    -- It is a pending student code. Link the user to the class.
    insert into class_students (class_id, student_id)
    values (pending_record.class_id, user_id)
    on conflict (class_id, student_id) do nothing;

    -- Update the user's name if it's generic? Optionally we could update profiles.first_name, etc.
    -- For now, we trust the profile they created.
    
    -- Delete the pending record (code is used)
    delete from pending_students where id = pending_record.id;

    -- Get class name for success message
    select name into class_record from classes where id = pending_record.class_id;

    return json_build_object(
      'success', true, 
      'type', 'student_code',
      'class_name', class_record.name,
      'message', 'Success! You have claimed your spot in ' || class_record.name
    );
  end if;

  -- 2. If not found in pending, check if it is a CLASS JOIN CODE (Legacy/Standard flow)
  select * into class_record from classes where upper(join_code) = upper(code_input);
  
  if found then
    insert into class_students (class_id, student_id)
    values (class_record.id, user_id)
    on conflict (class_id, student_id) do nothing;

    return json_build_object(
      'success', true, 
      'type', 'class_code',
      'class_name', class_record.name,
      'message', 'Success! You joined ' || class_record.name
    );
  end if;

  -- 3. Invalid code
  return json_build_object('success', false, 'message', 'Invalid Access Code');
end;
$$;
