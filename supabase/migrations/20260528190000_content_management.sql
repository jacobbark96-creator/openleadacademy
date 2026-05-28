-- Policies for Admins and Trainers to manage content

-- Courses
CREATE POLICY "Admins and trainers can insert courses" 
ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can update courses" 
ON public.courses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can delete courses" 
ON public.courses FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);

-- Modules
CREATE POLICY "Admins and trainers can insert modules" 
ON public.modules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can update modules" 
ON public.modules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can delete modules" 
ON public.modules FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);

-- Lessons
CREATE POLICY "Admins and trainers can insert lessons" 
ON public.lessons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can update lessons" 
ON public.lessons FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can delete lessons" 
ON public.lessons FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);

-- Vacancies (Admin only)
CREATE POLICY "Admins can insert vacancies" 
ON public.vacancies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update vacancies" 
ON public.vacancies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete vacancies" 
ON public.vacancies FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
