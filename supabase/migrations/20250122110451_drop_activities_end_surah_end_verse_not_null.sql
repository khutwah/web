ALTER TABLE "public"."activities"
ALTER COLUMN "end_surah"
DROP NOT NULL;

ALTER TABLE "public"."activities"
ALTER COLUMN "end_verse"
DROP NOT NULL;
