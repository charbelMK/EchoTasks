-- SQL script to FIX missing profile and promote to 'admin'
-- Run this in your Supabase SQL Editor

-- 1. Replace 'YOUR_EMAIL_HERE' with the actual email of user you want to promote
-- Example: 'john@example.com'

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Admin User'), -- Fallback name if missing
    'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 2. Verify
-- This command ensures that if the user exists in Auth but was deleted from Public Profiles (due to the cleanup),
-- they are re-inserted with the correct Admin role.
