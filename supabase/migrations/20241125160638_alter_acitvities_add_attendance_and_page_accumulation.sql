BEGIN;

ALTER TABLE activities
    ADD COLUMN student_attendance VARCHAR NOT NULL DEFAULT 'presence';


COMMIT;
