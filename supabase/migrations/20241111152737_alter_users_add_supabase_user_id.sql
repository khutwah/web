BEGIN;

ALTER TABLE users
    ADD COLUMN sb_user_id UUID REFERENCES auth.users(id);

COMMIT;
