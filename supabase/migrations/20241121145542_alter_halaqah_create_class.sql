BEGIN;

ALTER TABLE halaqah
    ADD COLUMN class char(30);

COMMIT;