BEGIN;

ALTER TABLE students
ADD COLUMN virtual_account CHAR(50);

COMMIT;
