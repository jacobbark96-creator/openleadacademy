-- Add company onboarding settings
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS allow_self_onboarding BOOLEAN DEFAULT false;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS enable_welcome_box BOOLEAN DEFAULT false;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS welcome_video_url TEXT;

-- Update RLS policies to ensure admins can update these fields
-- Assuming the existing policy "Admins can update their own company" handles this, as long as it's a direct UPDATE.
