-- Fix change_requests status constraint
-- The table might have been created with a copied constraint or an old definition.
-- We drop the existing check and enforce the correct one.

ALTER TABLE public.change_requests DROP CONSTRAINT IF EXISTS change_requests_status_check;

ALTER TABLE public.change_requests 
  ADD CONSTRAINT change_requests_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected'));
