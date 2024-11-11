BEGIN;

ALTER TABLE users
    drop COLUMN if exists last_logged_in;

COMMIT;
