-- Link updates to milestones to track progress per milestone
ALTER TABLE "public"."updates" ADD COLUMN IF NOT EXISTS "milestone_id" uuid REFERENCES "public"."milestones"("id") ON DELETE SET NULL;
