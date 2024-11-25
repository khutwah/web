BEGIN;

ALTER TABLE activities
    ADD COLUMN student_attendance VARCHAR NOT NULL DEFAULT 'presence';

ALTER TABLE activities
    ADD COLUMN page_amount_accumulation SMALLINT;

COMMIT;
