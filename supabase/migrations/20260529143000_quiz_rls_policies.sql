-- RLS Policies for Quizzes
CREATE POLICY "Admins and trainers can insert quizzes" 
ON public.quizzes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can update quizzes" 
ON public.quizzes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can delete quizzes" 
ON public.quizzes FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);

-- RLS Policies for Quiz Questions
CREATE POLICY "Admins and trainers can insert quiz questions" 
ON public.quiz_questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can update quiz questions" 
ON public.quiz_questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
CREATE POLICY "Admins and trainers can delete quiz questions" 
ON public.quiz_questions FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);
