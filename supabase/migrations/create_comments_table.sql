-- Create Comments Table for Project Updates
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    update_id UUID REFERENCES public.updates(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. View Comments
-- Users can view comments if they can view the parent update.
-- (Admin: all; Client: if they own the project linked to the update)
CREATE POLICY "Users can view comments for visible updates"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.updates u
      JOIN public.projects p ON p.id = u.project_id
      WHERE u.id = comments.update_id
      AND (
        public.is_admin() 
        OR 
        p.client_id = auth.uid()
      )
    )
  );

-- 2. Create Comments
-- Users can comment if they can view the update.
CREATE POLICY "Users can create comments for visible updates"
  ON public.comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.updates u
      JOIN public.projects p ON p.id = u.project_id
      WHERE u.id = comments.update_id
      AND (
        public.is_admin() 
        OR 
        p.client_id = auth.uid()
      )
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
