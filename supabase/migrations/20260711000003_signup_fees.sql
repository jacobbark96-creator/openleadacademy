ALTER TABLE public.profiles 
ADD COLUMN signup_fee numeric(10, 2) DEFAULT 0,
ADD COLUMN has_paid_signup_fee boolean DEFAULT true;
