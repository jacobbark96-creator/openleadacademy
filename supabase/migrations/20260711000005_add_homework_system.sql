-- Add homework columns to lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS has_homework boolean DEFAULT false;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS homework_type text CHECK (homework_type IN ('link', 'upload'));

-- Create homework_submissions table
CREATE TABLE IF NOT EXISTS public.homework_submissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  submission_type text NOT NULL CHECK (submission_type IN ('link', 'upload')),
  submission_url text NOT NULL,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(lesson_id, user_id)
);

-- Enable RLS on homework_submissions
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for homework_submissions
CREATE POLICY "Users can view their own homework submissions"
  ON public.homework_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own homework submissions"
  ON public.homework_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and trainers can view all homework submissions in their company"
  ON public.homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'trainer')
      AND profiles.company_id = homework_submissions.company_id
    )
  );

-- Storage bucket for homework uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('homework', 'homework', false) ON CONFLICT DO NOTHING;

-- Storage policies for homework
CREATE POLICY "Users can upload their own homework files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'homework' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own homework files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'homework' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins and trainers can view homework files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'homework' AND 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'trainer')
    )
  );

-- Notify pgrst to reload schema
NOTIFY pgrst, 'reload schema';
