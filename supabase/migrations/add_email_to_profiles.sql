-- Add email column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill existing emails from auth.users to public.profiles
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND public.profiles.email IS NULL;
