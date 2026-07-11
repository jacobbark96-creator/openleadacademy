-- Add legal_documents to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS legal_documents jsonb DEFAULT '[]'::jsonb;

-- Add fee_breakdown and accepted_legal_documents to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fee_breakdown jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accepted_legal_documents jsonb DEFAULT '[]'::jsonb;

-- Notify pgrst to reload schema
NOTIFY pgrst, 'reload schema';
