BEGIN;

ALTER TABLE halaqah
    ADD COLUMN academic_year SMALLINT;

ALTER TABLE halaqah
    DROP COLUMN ustadz_id;

COMMIT;
