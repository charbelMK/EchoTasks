-- Add start_date and end_date to milestones for Gantt chart
ALTER TABLE "public"."milestones" ADD COLUMN IF NOT EXISTS "start_date" date;
ALTER TABLE "public"."milestones" ADD COLUMN IF NOT EXISTS "end_date" date;

-- Note: We still have 'due_date' which might be redundant with 'end_date', but keeping for now.
