BEGIN;

ALTER TABLE activities
    ADD COLUMN status VARCHAR NOT NULL DEFAULT ActivityStatus.draft;

COMMIT;
