-- Add columns to track NDA and Subcontractor Agreement signatures
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nda_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nda_signed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subcontractor_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subcontractor_signed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS agreement_signature_name TEXT;
