CREATE TABLE shifts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ustadz_id VARCHAR,
  halaqah_id BIGINT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ustadz_id) REFERENCES users (email),
  FOREIGN KEY (halaqah_id) REFERENCES halaqah (id)
);

CREATE
OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shifts_updated_at BEFORE
UPDATE ON shifts FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();
