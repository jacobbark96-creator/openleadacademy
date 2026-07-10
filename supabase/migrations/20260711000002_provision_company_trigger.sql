CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_company_id uuid;
  new_slug text;
BEGIN
  -- Check if they are trying to create a new academy
  IF new.raw_user_meta_data->>'new_company_name' IS NOT NULL THEN
    
    -- Generate a slug from the company name (lowercase, replace spaces with hyphens)
    new_slug := regexp_replace(lower(new.raw_user_meta_data->>'new_company_name'), '[^a-z0-9]+', '-', 'g');
    
    -- Append a random string to prevent collisions
    new_slug := new_slug || '-' || substr(new.id::text, 1, 6);

    -- Insert the new company
    INSERT INTO public.companies (name, slug, subscription_status)
    VALUES (
      new.raw_user_meta_data->>'new_company_name',
      new_slug,
      'trialing'
    )
    RETURNING id INTO assigned_company_id;

    -- Make this user an admin of their new company
    INSERT INTO public.profiles (id, full_name, avatar_url, role, company_id)
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      'admin',
      assigned_company_id
    );

  ELSE
    -- Normal student/user signup for an existing academy
    INSERT INTO public.profiles (id, full_name, avatar_url, role, company_id)
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      COALESCE(new.raw_user_meta_data->>'role', 'student'),
      COALESCE((new.raw_user_meta_data->>'company_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;