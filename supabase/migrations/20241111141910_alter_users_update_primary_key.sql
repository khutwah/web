BEGIN;

ALTER TABLE activities 
    DROP CONSTRAINT activities_created_by_fkey;
ALTER TABLE shifts 
    DROP CONSTRAINT shifts_ustadz_id_fkey;
ALTER TABLE students 
    DROP CONSTRAINT students_parent_id_fkey;

ALTER TABLE users
    DROP CONSTRAINT users_pkey;

ALTER TABLE users 
    ADD COLUMN id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY;

ALTER TABLE users
    ADD CONSTRAINT users_email_unique UNIQUE (email);

-- update activities start
ALTER TABLE activities
    RENAME COLUMN created_by TO old_created_by;

ALTER TABLE activities 
    ADD COLUMN created_by BIGINT;

ALTER TABLE activities 
    ADD CONSTRAINT activities_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE activities 
    DROP COLUMN old_created_by;
-- update activities end

-- update shifts start
ALTER TABLE shifts
    RENAME COLUMN ustadz_id TO old_ustadz_id;

ALTER TABLE shifts 
    ADD COLUMN ustadz_id BIGINT;

ALTER TABLE shifts 
    ADD CONSTRAINT shifts_ustadz_id_fk FOREIGN KEY (ustadz_id) REFERENCES users(id);

ALTER TABLE shifts 
    DROP COLUMN old_ustadz_id;
-- update shifts end

-- update students start
ALTER TABLE students
    RENAME COLUMN parent_id TO old_parent_id;

ALTER TABLE students 
    ADD COLUMN parent_id BIGINT;

ALTER TABLE students 
    ADD CONSTRAINT students_parent_id_fk FOREIGN KEY (parent_id) REFERENCES users(id);

ALTER TABLE students 
    DROP COLUMN old_parent_id;
-- update students end

COMMIT;
