-- Fix handle_new_user function
-- 1. Set search_path to public to avoid security issues and ensure table visibility
-- 2. Add ON CONFLICT clause to avoid errors if profile already exists (idempotency)
-- 3. Ensure role casting is explicit

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'client'::user_role, -- Explicit cast
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url;
    -- Don't update role on conflict, preserve existing role
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
