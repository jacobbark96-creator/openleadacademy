-- Add INSERT policy for course_enrollments so students can be auto-enrolled from the frontend
CREATE POLICY "Users can enroll themselves"
ON public.course_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);
