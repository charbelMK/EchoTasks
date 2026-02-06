-- DANGER: This script deletes ALL data from the application tables.
-- It is intended to wipe development/test data before going to production.

-- 1. Truncate all public tables containing user data
-- We use CASCADE to handle foreign key dependencies automatically

TRUNCATE TABLE 
    public.media,
    public.comments,
    public.updates,
    public.milestones,
    public.notifications,
    public.projects,
    public.profiles
RESTART IDENTITY CASCADE;

-- 2. Clean up Auth Users (Optional but Recommended for clean slate)
-- If you run this, ALL users (including admins) will be deleted and must sign up again.
-- This usually cascades to public.profiles, but we truncated above to be sure.
-- Uncomment the following lines if you want to wipe the Auth users too:

-- DELETE FROM auth.users;

-- Instructions:
-- 1. Run this script in your Supabase SQL Editor.
-- 2. If you did NOT uncomment the auth.users deletion, you should manually delete users 
--    from the Supabase Dashboard > Authentication > Users to avoid "orphan" users 
--    (users who exist in Auth but have no Profile data).
