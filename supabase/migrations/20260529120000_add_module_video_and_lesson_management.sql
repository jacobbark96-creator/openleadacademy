-- Add video_url to modules table
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS video_url text;

-- Update RLS policies to allow admins/trainers to manage lessons if not already present
-- (Checking initial_schema.sql, lessons policies were very basic)

DROP POLICY IF EXISTS "Admins and trainers can manage lessons" ON public.lessons;
CREATE POLICY "Admins and trainers can manage lessons" ON public.lessons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'trainer')
    )
  );

DROP POLICY IF EXISTS "Admins and trainers can manage modules" ON public.modules;
CREATE POLICY "Admins and trainers can manage modules" ON public.modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'trainer')
    )
  );
