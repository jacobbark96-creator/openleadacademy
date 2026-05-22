-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text not null default 'student' check (role in ('student', 'trainer', 'admin')),
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COURSES
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MODULES
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LESSONS
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules on delete cascade not null,
  title text not null,
  description text,
  video_url text,
  thumbnail_url text,
  order_index integer not null default 0,
  week_number integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUIZZES
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons on delete cascade not null,
  title text not null,
  passing_score integer not null default 80,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUIZ QUESTIONS
create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes on delete cascade not null,
  question text not null,
  options jsonb not null, -- Array of strings
  correct_option_index integer not null,
  order_index integer not null default 0
);

-- QUIZ ATTEMPTS
create table public.quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  quiz_id uuid references public.quizzes on delete cascade not null,
  score integer not null,
  passed boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LESSON PROGRESS
create table public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  completed boolean not null default false,
  unlocked boolean not null default false,
  watch_percentage integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- CERTIFICATES
create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  issue_date timestamp with time zone default timezone('utc'::text, now()) not null,
  pdf_url text,
  verification_id text unique not null default substring(uuid_generate_v4()::text from 1 for 8)
);

-- ANNOUNCEMENTS
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESOURCES
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  url text not null,
  type text not null, -- 'pdf', 'link', 'doc'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VACANCIES
create table public.vacancies (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  department text not null,
  location text not null,
  type text not null, -- 'Full-time', 'Part-time', 'Contract'
  remote_hybrid text not null, -- 'Remote', 'Hybrid', 'On-site'
  description text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOB APPLICATIONS
create table public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  vacancy_id uuid references public.vacancies on delete cascade not null,
  user_id uuid references public.profiles on delete set null, -- Optional if applied as guest
  full_name text not null,
  email text not null,
  cv_url text not null,
  status text not null default 'pending', -- 'pending', 'reviewed', 'accepted', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUPPORT TICKETS
create table public.support_tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  subject text not null,
  message text not null,
  status text not null default 'open', -- 'open', 'in_progress', 'resolved'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

-- Courses
alter table public.courses enable row level security;
create policy "Courses are viewable by everyone." on public.courses for select using ( true );

-- Modules
alter table public.modules enable row level security;
create policy "Modules are viewable by everyone." on public.modules for select using ( true );

-- Lessons
alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone." on public.lessons for select using ( true );

-- Quizzes
alter table public.quizzes enable row level security;
create policy "Quizzes are viewable by everyone." on public.quizzes for select using ( true );

-- Quiz Questions
alter table public.quiz_questions enable row level security;
create policy "Quiz questions are viewable by everyone." on public.quiz_questions for select using ( true );

-- Quiz Attempts
alter table public.quiz_attempts enable row level security;
create policy "Users can view own quiz attempts." on public.quiz_attempts for select using ( auth.uid() = user_id );
create policy "Users can insert own quiz attempts." on public.quiz_attempts for insert with check ( auth.uid() = user_id );

-- Lesson Progress
alter table public.lesson_progress enable row level security;
create policy "Users can view own progress." on public.lesson_progress for select using ( auth.uid() = user_id );
create policy "Users can insert own progress." on public.lesson_progress for insert with check ( auth.uid() = user_id );
create policy "Users can update own progress." on public.lesson_progress for update using ( auth.uid() = user_id );

-- Certificates
alter table public.certificates enable row level security;
create policy "Certificates viewable by owner or by verification." on public.certificates for select using ( auth.uid() = user_id or true );

-- Announcements
alter table public.announcements enable row level security;
create policy "Announcements are viewable by everyone." on public.announcements for select using ( true );

-- Resources
alter table public.resources enable row level security;
create policy "Resources are viewable by everyone." on public.resources for select using ( true );

-- Vacancies
alter table public.vacancies enable row level security;
create policy "Active vacancies are viewable by everyone." on public.vacancies for select using ( is_active = true );

-- Job Applications
alter table public.job_applications enable row level security;
create policy "Users can view own applications." on public.job_applications for select using ( auth.uid() = user_id );
create policy "Anyone can insert applications." on public.job_applications for insert with check ( true );

-- Support Tickets
alter table public.support_tickets enable row level security;
create policy "Users can view own tickets." on public.support_tickets for select using ( auth.uid() = user_id );
create policy "Users can insert own tickets." on public.support_tickets for insert with check ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'student');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert some initial dummy data for vacancies
insert into public.vacancies (title, department, location, type, remote_hybrid, description) values
('SDR', 'Sales', 'London', 'Full-time', 'Hybrid', 'Looking for an ambitious Sales Development Representative.'),
('Appointment Setter', 'Sales', 'Manchester', 'Full-time', 'Remote', 'Join our team as an Appointment Setter.'),
('Sales Closer', 'Sales', 'London', 'Full-time', 'On-site', 'Experienced Sales Closer needed for our premium packages.');

-- Create Storage Buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true) on conflict do nothing;

-- Storage policies for avatars
create policy "Avatar images are publicly accessible." on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Anyone can upload an avatar." on storage.objects for insert with check ( bucket_id = 'avatars' );

-- Storage policies for resumes
create policy "Anyone can upload a resume." on storage.objects for insert with check ( bucket_id = 'resumes' );
