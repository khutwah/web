-- Add review_target_page_count column to students table
ALTER TABLE "public"."students"
ADD COLUMN "review_target_page_count" SMALLINT;
