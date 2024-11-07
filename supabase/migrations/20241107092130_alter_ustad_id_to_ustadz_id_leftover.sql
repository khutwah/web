BEGIN;

ALTER TABLE "public"."activities" DROP CONSTRAINT IF EXISTS "activities_ustad_id_fkey";

ALTER TABLE "public"."activities" DROP COLUMN IF EXISTS "ustad_id";

ALTER TABLE "public"."activities" ADD COLUMN IF NOT EXISTS "ustadz_id" character varying;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'activities_ustadz_id_fkey'
          AND conrelid = 'public.activities'::regclass
    ) THEN
        ALTER TABLE "public"."activities"
        ADD CONSTRAINT "activities_ustadz_id_fkey"
        FOREIGN KEY ("ustadz_id") REFERENCES "users"("email") NOT VALID;
    END IF;
END $$;

ALTER TABLE "public"."activities" VALIDATE CONSTRAINT "activities_ustadz_id_fkey";

COMMIT;
