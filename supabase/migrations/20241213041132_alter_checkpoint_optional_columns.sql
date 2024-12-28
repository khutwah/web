BEGIN;

ALTER TABLE
checkpoint
ALTER COLUMN last_activity_id
DROP NOT NULL;

ALTER TABLE
checkpoint
ALTER COLUMN page_count_accumulation
DROP NOT NULL;

COMMIT;
