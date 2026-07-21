-- 1. Fix homework_submissions RLS policies
-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own homework submissions" ON public.homework_submissions;
DROP POLICY IF EXISTS "Users can insert their own homework submissions" ON public.homework_submissions;
DROP POLICY IF EXISTS "Admins and trainers can view all homework submissions in their company" ON public.homework_submissions;

-- Allow users to view their own submissions
CREATE POLICY "Users can view their own homework submissions"
ON public.homework_submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to insert their own submissions
-- We ensure the company_id matches their own profile's company_id
CREATE POLICY "Users can insert their own homework submissions"
ON public.homework_submissions FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
);

-- Allow admins and trainers to view all submissions in their company
CREATE POLICY "Admins and trainers can view all homework submissions in their company"
ON public.homework_submissions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'trainer')
    AND profiles.company_id = homework_submissions.company_id
  )
);

-- 2. Fix lesson_progress RLS policies and add company_id for isolation
-- First, add company_id to lesson_progress if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lesson_progress' AND column_name = 'company_id') THEN
    ALTER TABLE public.lesson_progress ADD COLUMN company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Backfill company_id from lessons
UPDATE public.lesson_progress lp
SET company_id = l.company_id
FROM public.lessons l
WHERE lp.lesson_id = l.id AND lp.company_id IS NULL;

-- Drop existing lesson_progress policies
DROP POLICY IF EXISTS "Users can view own progress." ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert own progress." ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress." ON public.lesson_progress;

-- New multi-tenant aware policies for lesson_progress
CREATE POLICY "Users can view own progress"
ON public.lesson_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.lesson_progress FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  (company_id IS NULL OR company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY "Users can update own progress"
ON public.lesson_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Fix storage policies for homework bucket to be absolutely sure
-- Drop any existing policies that might be interfering
DROP POLICY IF EXISTS "Authenticated users can upload homework" ON storage.objects;
DROP POLICY IF EXISTS "Public can view homework files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own homework" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own homework" ON storage.objects;

-- Simple, effective policies for the homework bucket
CREATE POLICY "Anyone authenticated can upload homework"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'homework');

CREATE POLICY "Anyone can view homework"
ON storage.objects FOR SELECT
USING (bucket_id = 'homework');

CREATE POLICY "Users can manage their own homework uploads"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'homework' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'homework' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Reload schema
NOTIFY pgrst, 'reload schema';
