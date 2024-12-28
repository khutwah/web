BEGIN;

ALTER TABLE activities
DROP COLUMN halaqah_id,
DROP COLUMN ustadz_id;

ALTER TABLE activities
ADD COLUMN shift_id BIGINT,
ADD CONSTRAINT activities_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES shifts (id);

ALTER TABLE activities
ADD COLUMN created_by VARCHAR,
ADD CONSTRAINT activities_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (email);

COMMIT;
