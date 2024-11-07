BEGIN;

ALTER TABLE "public"."halaqah" DROP CONSTRAINT IF EXISTS "halaqah_ustad_id_fkey";

ALTER TABLE "public"."halaqah" DROP COLUMN IF EXISTS "ustad_id";

ALTER TABLE "public"."halaqah" ADD COLUMN IF NOT EXISTS "ustadz_id" character varying;

ALTER TABLE "public"."halaqah" ADD CONSTRAINT "halaqah_ustadz_id_fkey"
    FOREIGN KEY ("ustadz_id") REFERENCES "users"("email") NOT VALID;

ALTER TABLE "public"."halaqah" VALIDATE CONSTRAINT "halaqah_ustadz_id_fkey";

COMMIT;
