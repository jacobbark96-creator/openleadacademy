-- Add missing column if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_fee_currency text DEFAULT 'GBP';

-- Update the handle_new_user function to handle fees from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_company_id uuid;
  new_slug text;
BEGIN
  -- Check if they are trying to create a new academy
  IF new.raw_user_meta_data->>'new_company_name' IS NOT NULL THEN
    
    -- Use provided slug or generate one from the company name
    new_slug := new.raw_user_meta_data->>'new_company_slug';
    
    IF new_slug IS NULL THEN
      new_slug := regexp_replace(lower(new.raw_user_meta_data->>'new_company_name'), '[^a-z0-9]+', '-', 'g');
      new_slug := new_slug || '-' || substr(new.id::text, 1, 6);
    END IF;

    -- Insert the new company
    INSERT INTO public.companies (name, slug, subscription_status)
    VALUES (
      new.raw_user_meta_data->>'new_company_name',
      new_slug,
      'trialing'
    )
    RETURNING id INTO assigned_company_id;

    -- Make this user an admin of their new company
    INSERT INTO public.profiles (id, full_name, avatar_url, role, company_id, email)
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      'admin',
      assigned_company_id,
      new.email
    );

  ELSE
    -- Normal signup or Admin-created user
    INSERT INTO public.profiles (
      id, 
      full_name, 
      avatar_url, 
      role, 
      company_id, 
      email,
      signup_fee,
      signup_fee_currency,
      has_paid_signup_fee
    )
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      COALESCE(new.raw_user_meta_data->>'role', 'student'),
      COALESCE((new.raw_user_meta_data->>'company_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
      new.email,
      COALESCE((new.raw_user_meta_data->>'signup_fee')::numeric, 0),
      COALESCE(new.raw_user_meta_data->>'signup_fee_currency', 'GBP'),
      COALESCE((new.raw_user_meta_data->>'has_paid_signup_fee')::boolean, true)
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notify pgrst to reload schema
NOTIFY pgrst, 'reload schema';
