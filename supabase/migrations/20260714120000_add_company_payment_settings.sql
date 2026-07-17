ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS require_payment BOOLEAN DEFAULT false;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'GBP';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS payment_link TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS fee_breakdown JSONB DEFAULT '[]'::jsonb;
