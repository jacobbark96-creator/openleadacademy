ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS signup_fee_currency text DEFAULT 'GBP';

-- Notify pgrst
NOTIFY pgrst, 'reload schema';
