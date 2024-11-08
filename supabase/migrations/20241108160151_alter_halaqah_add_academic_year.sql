BEGIN;

ALTER TABLE halaqah
    ADD COLUMN academic_year SMALLINT;

COMMIT;
