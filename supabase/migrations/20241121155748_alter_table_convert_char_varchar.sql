BEGIN;

ALTER TABLE students
ALTER COLUMN virtual_account TYPE VARCHAR(50);

ALTER TABLE halaqah
ALTER COLUMN label TYPE VARCHAR(50);

COMMIT;
