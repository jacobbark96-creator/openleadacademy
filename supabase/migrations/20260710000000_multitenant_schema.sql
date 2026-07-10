-- ==============================================================================
-- MULTI-TENANT ARCHITECTURE MIGRATION
-- ==============================================================================

-- 1. Create the `companies` table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL, -- For subdomains (e.g., 'acme' -> acme.openleadacademy.com)
  custom_domain text UNIQUE, -- Optional: For fully custom domains (e.g., training.acmecorp.com)
  logo_url text,
  primary_color text DEFAULT '#000000',
  stripe_customer_id text,
  stripe_account_id text, -- For Stripe Connect (so they can charge their users)
  subscription_status text DEFAULT 'trialing',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. Create the default "Openlead Academy" company
-- We need this to migrate existing data.
INSERT INTO public.companies (id, name, slug) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Openlead Academy', 
  'openlead'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Add `company_id` to all relevant tables

-- PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
-- Set existing profiles to the default company
UPDATE public.profiles SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.profiles ALTER COLUMN company_id SET NOT NULL;

-- COURSES
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
UPDATE public.courses SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.courses ALTER COLUMN company_id SET NOT NULL;

-- ANNOUNCEMENTS
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
UPDATE public.announcements SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.announcements ALTER COLUMN company_id SET NOT NULL;

-- RESOURCES
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
UPDATE public.resources SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.resources ALTER COLUMN company_id SET NOT NULL;

-- VACANCIES
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
UPDATE public.vacancies SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.vacancies ALTER COLUMN company_id SET NOT NULL;

-- TEAM MEMBERS
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
UPDATE public.team_members SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.team_members ALTER COLUMN company_id SET NOT NULL;

-- SUPPORT TICKETS
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
UPDATE public.support_tickets SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
ALTER TABLE public.support_tickets ALTER COLUMN company_id SET NOT NULL;

-- 4. Update the trigger to assign new users to a company
-- We will need to update handle_new_user to read the company_id from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, company_id)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    COALESCE((new.raw_user_meta_data->>'company_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RLS POLICIES (Drafting the isolation)
-- We will drop existing policies and recreate them with company_id checks in the next step,
-- but for now, we ensure the base architecture is applied.
