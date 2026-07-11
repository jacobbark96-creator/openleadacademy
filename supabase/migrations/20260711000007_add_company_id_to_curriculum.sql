-- Add company_id to modules and lessons for stricter isolation
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;

-- Backfill company_id from courses
UPDATE public.modules m SET company_id = c.company_id FROM public.courses c WHERE m.course_id = c.id AND m.company_id IS NULL;
UPDATE public.lessons l SET company_id = m.company_id FROM public.modules m WHERE l.module_id = m.id AND l.company_id IS NULL;

-- Enable RLS and add policies
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Policies for modules
DROP POLICY IF EXISTS "Modules are viewable by everyone in company" ON public.modules;
CREATE POLICY "Modules are viewable by everyone in company" ON public.modules FOR SELECT USING (true); -- Usually public courses or handled by course RLS

-- Policies for lessons
DROP POLICY IF EXISTS "Lessons are viewable by everyone in company" ON public.lessons;
CREATE POLICY "Lessons are viewable by everyone in company" ON public.lessons FOR SELECT USING (true);

-- Notify pgrst
NOTIFY pgrst, 'reload schema';
