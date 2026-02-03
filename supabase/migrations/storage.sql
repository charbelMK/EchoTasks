-- Enable Storage Extension (if not already enabled, usually enabled by default)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- Create specific bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_files', 'project_files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Admin can upload/delete
CREATE POLICY "Admin Upload Files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin Delete Files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Everyone (authenticated) can view (since it's public bucket, but let's be explicit if we turn public off later)
-- For a public bucket, simple SELECT is enough.
CREATE POLICY "Authenticated View Files"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'project_files' );

-- Policy: Client can upload? (Maybe later for assets, for now only Admin per requirement)
