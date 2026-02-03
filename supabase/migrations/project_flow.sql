-- Add 'draft' and 'proposal_ready' to project_status enum
-- Postgres enums are immutable types, so we have to hack it or just stick with text check constraints if we were starting fresh.
-- Since we already have the type, the standard way to add values is:
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'proposal_ready';

-- Create Project Requests Table
CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_range TEXT, -- e.g. "$1k-5k", "Hourly"
    timeline_preference TEXT, -- e.g. "ASAP", "1 month"
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'converted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

-- Project Request Policies
-- Client: View own, Create own
CREATE POLICY "Clients can view own project requests"
  ON public.project_requests FOR SELECT
  USING ( auth.uid() = client_id );

CREATE POLICY "Clients can create project requests"
  ON public.project_requests FOR INSERT
  WITH CHECK ( auth.uid() = client_id );

-- Admin: All access
CREATE POLICY "Admins have full access to project requests"
  ON public.project_requests FOR ALL
  USING ( public.is_admin() );


-- Create Change Requests Table
CREATE TABLE IF NOT EXISTS public.change_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) NOT NULL, -- Who requested the change
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_response TEXT, -- Optional response from admin
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;

-- Change Request Policies
-- Client: View/Create if they own the project
CREATE POLICY "Clients can view change requests for their projects"
  ON public.change_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = change_requests.project_id
      AND projects.client_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create change requests for their projects"
  ON public.change_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = change_requests.project_id
      AND projects.client_id = auth.uid()
    )
  );

-- Admin: All access
CREATE POLICY "Admins have full access to change requests"
  ON public.change_requests FOR ALL
  USING ( public.is_admin() );

-- Triggers for updated_at
CREATE TRIGGER update_project_requests_updated_at
BEFORE UPDATE ON public.project_requests
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_change_requests_updated_at
BEFORE UPDATE ON public.change_requests
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
