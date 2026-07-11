CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_company_id uuid;
  v_company_name text;
  v_slug text;
BEGIN
  v_company_name := new.raw_user_meta_data->>'new_company_name';
  
  IF v_company_name IS NOT NULL THEN
    -- Use provided slug or generate a unique slug from company name
    v_slug := new.raw_user_meta_data->>'new_company_slug';
    
    IF v_slug IS NULL THEN
      v_slug := lower(regexp_replace(v_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);
    END IF;
    
    -- Insert new company
    INSERT INTO public.companies (name, slug, subscription_status)
    VALUES (v_company_name, v_slug, 'trialing')
    RETURNING id INTO v_company_id;
    
    -- Insert profile as admin of new company
    INSERT INTO public.profiles (id, full_name, avatar_url, role, company_id)
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      'admin',
      v_company_id
    );
  ELSE
    -- Normal user signup
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
