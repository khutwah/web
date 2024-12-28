BEGIN;

-- Drop the old default value
ALTER TABLE activities
ALTER COLUMN student_attendance
DROP DEFAULT;

-- Add the new default value
ALTER TABLE activities
ALTER COLUMN student_attendance
SET DEFAULT 'present';

-- Update existing rows if needed
UPDATE activities
SET
  student_attendance = 'present'
WHERE
  student_attendance = 'presence';

COMMIT;
