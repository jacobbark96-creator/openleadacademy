-- 5. RLS POLICIES (Drafting the isolation)
-- Drop existing wide-open policies and recreate them with company_id checks

-- COMPANIES
CREATE POLICY "Companies are viewable by everyone (for subdomain loading)" 
ON public.companies FOR SELECT USING (true);

CREATE POLICY "Super Admins can manage companies" 
ON public.companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
);

-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Users can view profiles in their own company" 
ON public.profiles FOR SELECT USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- COURSES
DROP POLICY IF EXISTS "Courses are viewable by everyone." ON public.courses;
CREATE POLICY "Users can view courses in their own company" 
ON public.courses FOR SELECT USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- (The rest of the RLS policies will be applied to modules, lessons, quizzes, etc. by cascading down from courses, or by adding company_id to them as well. For now, we secure the top-level entities.)
