-- Add module_id to quizzes table
ALTER TABLE public.quizzes ADD COLUMN module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE;

-- Make lesson_id nullable since quizzes can now be module-based
ALTER TABLE public.quizzes ALTER COLUMN lesson_id DROP NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS quizzes_module_id_idx ON public.quizzes(module_id);
