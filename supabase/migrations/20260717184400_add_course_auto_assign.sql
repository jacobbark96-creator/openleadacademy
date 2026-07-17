ALTER TABLE public.courses
ADD COLUMN auto_assign boolean DEFAULT false,
ADD COLUMN auto_assign_rank integer;
