-- Enable clients to update their own projects (e.g. approving status)
create policy "Clients can update own projects"
  on public.projects for update
  using ( auth.uid() = client_id );
