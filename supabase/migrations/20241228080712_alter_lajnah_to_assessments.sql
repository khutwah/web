-- 1. Rename the table
ALTER TABLE lajnah
RENAME TO assessments;

-- 2. Rename the column "parent_lajnah_id" to "parent_assessment_id"
ALTER TABLE assessments
RENAME COLUMN parent_lajnah_id TO parent_assessment_id;

-- 3. Rename the primary key constraint
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the primary key constraint name
    SELECT conname
    INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'assessments'::regclass
    AND contype = 'p';

    -- Rename the primary key constraint
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE assessments RENAME CONSTRAINT %I TO assessments_pkey', constraint_name);
    END IF;
END $$;

-- 4. Drop and recreate the foreign key constraints with updated names
-- Rename the foreign key for "student_id"
ALTER TABLE assessments
DROP CONSTRAINT lajnah_student_id_fkey;

ALTER TABLE assessments
ADD CONSTRAINT assessments_student_id_fkey FOREIGN KEY (student_id) REFERENCES students (id);

-- Rename the foreign key for "ustadz_id"
ALTER TABLE assessments
DROP CONSTRAINT lajnah_ustadz_id_fkey;

ALTER TABLE assessments
ADD CONSTRAINT assessments_ustadz_id_fkey FOREIGN KEY (ustadz_id) REFERENCES users (id);

-- Rename the foreign key for "parent_assessment_id"
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the old constraint name for parent_assessment_id
    SELECT conname
    INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'assessments'::regclass
    AND conkey[1] = (
        SELECT attnum
        FROM pg_attribute
        WHERE attrelid = 'assessments'::regclass
        AND attname = 'parent_assessment_id'
    );
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE assessments DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

-- Add the updated foreign key constraint for parent_assessment_id
ALTER TABLE assessments
ADD CONSTRAINT assessments_parent_assessment_id_fkey FOREIGN KEY (parent_assessment_id) REFERENCES assessments (id);

-- 5. Drop the old trigger and its function
-- Drop the trigger on the lajnah (now assessments) table
DROP TRIGGER IF EXISTS update_lajnah_updated_at ON assessments;

-- Drop the old function (ensuring dependencies are cleared)
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- 6. Recreate the updated trigger function
CREATE
OR REPLACE FUNCTION update_assessment_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the new trigger to the assessments table
CREATE TRIGGER update_assessment_updated_at BEFORE
UPDATE ON assessments FOR EACH ROW
EXECUTE FUNCTION update_assessment_updated_at ();

-- 7. Update the sequence name
ALTER SEQUENCE public.lajnah_id_seq
RENAME TO assessments_id_seq;
