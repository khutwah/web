BEGIN;

ALTER TABLE "public"."halaqah" DROP CONSTRAINT IF EXISTS "halaqah_ustad_id_fkey";

ALTER TABLE "public"."halaqah" DROP COLUMN IF EXISTS "ustad_id";

ALTER TABLE "public"."halaqah" ADD COLUMN IF NOT EXISTS "ustadz_id" character varying;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'halaqah_ustadz_id_fkey'
          AND conrelid = 'public.halaqah'::regclass
    ) THEN
        ALTER TABLE "public"."halaqah"
        ADD CONSTRAINT "halaqah_ustadz_id_fkey"
        FOREIGN KEY ("ustadz_id") REFERENCES "users"("email") NOT VALID;
    END IF;
END $$;

ALTER TABLE "public"."halaqah" VALIDATE CONSTRAINT "halaqah_ustadz_id_fkey";

COMMIT;
