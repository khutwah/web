CREATE TABLE students (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR,
  parent_id VARCHAR,
  halaqah_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES users (email),
  FOREIGN KEY (halaqah_id) REFERENCES halaqah (id)
);

CREATE
OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at BEFORE
UPDATE ON students FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();
