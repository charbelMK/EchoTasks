-- Add file_path column to milestones and updates to store attachment references
ALTER TABLE "public"."milestones" ADD COLUMN IF NOT EXISTS "file_path" text;
ALTER TABLE "public"."updates" ADD COLUMN IF NOT EXISTS "file_path" text;

-- (Optional) If we want multiple files later, we'd use an array or separate table, but simple path is fine for now.
