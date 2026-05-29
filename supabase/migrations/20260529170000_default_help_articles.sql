-- Add default help articles
INSERT INTO public.help_articles (title, content, category, order_index)
VALUES 
('Getting Started with Openlead Academy', 'Welcome to Openlead Academy! To get started, navigate to your dashboard to see your enrolled courses. Each course is divided into modules and lessons. Complete the lessons and pass the mandatory quizzes to progress.', 'General', 0),
('How to Complete a Lesson', 'To complete a lesson, watch the lesson video entirely and then click the "Mark as Completed" button. Once completed, you can move to the next lesson or the module quiz.', 'Courses', 1),
('Mandatory Quizzes', 'At the end of each module, there is a mandatory quiz. You must achieve a passing score (usually 80%) to unlock the next module. You can retake quizzes if you don''t pass on your first attempt.', 'Quizzes', 2),
('Accessing the Resource Library', 'The Resource Library contains helpful PDFs, templates, and external links provided by your trainers. You can find it in the sidebar under "Resource Library".', 'Resources', 3),
('Contacting Support', 'If you encounter any technical issues or have questions about the curriculum, you can use the Support page to submit a ticket. Our team will get back to you as soon as possible.', 'Support', 4)
ON CONFLICT DO NOTHING;
