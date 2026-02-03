-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create specific types
create type user_role as enum ('admin', 'client');
create type project_status as enum ('pending', 'in_progress', 'completed', 'on_hold', 'cancelled');
create type milestone_status as enum ('pending', 'in_progress', 'completed');

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  role user_role default 'client'::user_role,
  avatar_url text,
  phone text,
  created_at timestamptz default now()
);

-- PROJECTS
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  status project_status default 'pending'::project_status,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MILESTONES
create table public.milestones (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status milestone_status default 'pending'::milestone_status,
  due_date timestamptz,
  created_at timestamptz default now()
);

-- UPDATES
create table public.updates (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  milestone_id uuid references public.milestones(id) on delete set null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- MEDIA (Files attached to updates)
create table public.media (
  id uuid default uuid_generate_v4() primary key,
  update_id uuid references public.updates(id) on delete cascade not null,
  file_path text not null, -- Supabase Storage path
  file_type text, -- 'image', 'document', etc.
  file_name text,
  created_at timestamptz default now()
);

-- NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text,
  type text default 'info',
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.updates enable row level security;
alter table public.media enable row level security;
alter table public.notifications enable row level security;

-- POLICIES

-- Profiles: Public read (for now), Self update
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Projects
-- Admin: All access
-- Client: View own, Create own
create policy "Admins have full access to projects"
  on public.projects for all
  using ( public.is_admin() );

create policy "Clients can view own projects"
  on public.projects for select
  using ( auth.uid() = client_id );

create policy "Clients can create projects"
  on public.projects for insert
  with check ( auth.uid() = client_id );

-- Milestones
-- Admin: All access
-- Client: View if they own the project
create policy "Admins have full access to milestones"
  on public.milestones for all
  using ( public.is_admin() );

create policy "Clients can view milestones for their projects"
  on public.milestones for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
      and projects.client_id = auth.uid()
    )
  );

-- Updates
-- Admin: All access
-- Client: View if they own the project
create policy "Admins have full access to updates"
  on public.updates for all
  using ( public.is_admin() );

create policy "Clients can view updates for their projects"
  on public.updates for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = updates.project_id
      and projects.client_id = auth.uid()
    )
  );

-- Media
-- Admin: All access
-- Client: View if they own the project (via update -> project)
create policy "Admins have full access to media"
  on public.media for all
  using ( public.is_admin() );

create policy "Clients can view media for their projects"
  on public.media for select
  using (
    exists (
      select 1 from public.updates u
      join public.projects p on p.id = u.project_id
      where u.id = media.update_id
      and p.client_id = auth.uid()
    )
  );

-- Notifications
-- Users can only see their own notifications
create policy "Users can view own notifications"
  on public.notifications for select
  using ( auth.uid() = user_id );

create policy "Admins can insert notifications" -- System/Admins allow insert
  on public.notifications for insert
  with check ( true ); -- Usually handled by server-side logic or triggers, but allowing specific insert if needed

-- FUNCTIONS & TRIGGERS

-- Handle new user signup -> Create Profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'client', -- Default role
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updating updated_at on projects
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
before update on public.projects
for each row
execute procedure update_updated_at_column();

-- Setup Storage buckets (pseudo-code, must be done in Dashboard usually, but RLS policies can be set if bucket exists)
-- This assumes 'project-files' bucket exists.
-- Policy: Public read? Or authenticated read?
-- Best practice: authenticated read matching RLS logic. But Storage policies are separate.
