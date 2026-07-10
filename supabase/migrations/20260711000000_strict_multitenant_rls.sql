-- 1. Create a secure SECURITY DEFINER function to bypass recursion
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Drop existing permissive policies for PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their own company" ON public.profiles;

CREATE POLICY "Users can view profiles in their own company" 
ON public.profiles FOR SELECT USING (
  company_id = public.get_user_company_id()
);

-- 3. COURSES
DROP POLICY IF EXISTS "Courses are viewable by everyone." ON public.courses;
DROP POLICY IF EXISTS "Users can view courses in their own company" ON public.courses;

CREATE POLICY "Users can view courses in their own company" 
ON public.courses FOR SELECT USING (
  company_id = public.get_user_company_id()
);

-- 4. ANNOUNCEMENTS
DROP POLICY IF EXISTS "Announcements are viewable by everyone." ON public.announcements;
DROP POLICY IF EXISTS "Users can view announcements in their own company" ON public.announcements;

CREATE POLICY "Users can view announcements in their own company" 
ON public.announcements FOR SELECT USING (
  company_id = public.get_user_company_id()
);

-- 5. RESOURCES
DROP POLICY IF EXISTS "Resources are viewable by everyone." ON public.resources;
DROP POLICY IF EXISTS "Users can view resources in their own company" ON public.resources;

CREATE POLICY "Users can view resources in their own company" 
ON public.resources FOR SELECT USING (
  company_id = public.get_user_company_id()
);

-- 6. VACANCIES
DROP POLICY IF EXISTS "Active vacancies are viewable by everyone." ON public.vacancies;
DROP POLICY IF EXISTS "Users can view vacancies in their own company" ON public.vacancies;

CREATE POLICY "Users can view vacancies in their own company" 
ON public.vacancies FOR SELECT USING (
  company_id = public.get_user_company_id()
);

-- 7. TEAM MEMBERS
DROP POLICY IF EXISTS "Team members are viewable by everyone." ON public.team_members;
DROP POLICY IF EXISTS "Users can view team members in their own company" ON public.team_members;

CREATE POLICY "Users can view team members in their own company" 
ON public.team_members FOR SELECT USING (
  company_id = public.get_user_company_id()
);

-- 8. SUPPORT TICKETS
DROP POLICY IF EXISTS "Users can view own tickets." ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view support tickets in their own company" ON public.support_tickets;

CREATE POLICY "Users can view support tickets in their own company" 
ON public.support_tickets FOR SELECT USING (
  company_id = public.get_user_company_id()
);
