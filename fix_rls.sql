DROP POLICY IF EXISTS "Users can view profiles in their own company" ON public.profiles;

CREATE POLICY "Users can view profiles in their own company" 
ON public.profiles FOR SELECT USING (
  true -- temporary open policy to fix infinite recursion until we can write a secure one
);
