BEGIN;

ALTER TABLE activities
    ALTER COLUMN tags
    SET DATA TYPE JSONB
    USING tags::jsonb;

COMMIT;