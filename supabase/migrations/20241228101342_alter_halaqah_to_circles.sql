-- 1. Rename the table
ALTER TABLE halaqah
RENAME TO circles;

-- 2. Rename the column "class" to "grade"
ALTER TABLE circles
RENAME COLUMN class TO grade;

-- 3. Rename the primary key constraint
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the primary key constraint name
    SELECT conname
    INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'circles'::regclass
    AND contype = 'p';

    -- Rename the primary key constraint
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE circles RENAME CONSTRAINT %I TO circles_pkey', constraint_name);
    END IF;
END $$;

-- 4. Rename the sequence for the "id" column
ALTER SEQUENCE halaqah_id_seq
RENAME TO circles_id_seq;

-- 5. Rename and drop the old foreign key referencing the halaqah table
ALTER TABLE shifts
RENAME COLUMN halaqah_id TO circle_id;

ALTER TABLE shifts
DROP CONSTRAINT shifts_halaqah_id_fkey;

-- 6. Add the new foreign key referencing the circles table
ALTER TABLE shifts
ADD CONSTRAINT shifts_circle_id_fkey FOREIGN KEY (circle_id) REFERENCES circles (id);

-- 7. Rename and drop the old foreign key referencing the halaqah table in the students table
ALTER TABLE students
RENAME COLUMN halaqah_id TO circle_id;

ALTER TABLE students
DROP CONSTRAINT students_halaqah_id_fkey;

-- 8. Add the new foreign key referencing the circles table
ALTER TABLE students
ADD CONSTRAINT students_circle_id_fkey FOREIGN KEY (circle_id) REFERENCES circles (id);
