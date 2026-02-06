-- SQL script to promote a user to 'admin' role
-- Run this in your Supabase SQL Editor

-- 1. Replace 'YOUR_EMAIL_HERE' with the actual email of user you want to promote
-- Example: 'john@example.com'

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE'
);

-- 2. Verify the change (this needs the ID, so we just check role)
-- The login should now redirect to /admin
