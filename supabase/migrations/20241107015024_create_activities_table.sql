CREATE TABLE activities (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id BIGINT,
  halaqah_id BIGINT,
  ustad_id VARCHAR,
  type SMALLINT,
  notes TEXT,
  page_amount SMALLINT,
  achieve_target BOOLEAN,
  start_surah CHAR,
  end_surah CHAR,
  start_verse CHAR,
  end_verse CHAR,
  tags JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (halaqah_id) REFERENCES halaqah (id),
  FOREIGN KEY (ustad_id) REFERENCES users (email)
);

CREATE
OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activities_updated_at BEFORE
UPDATE ON activities FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();
