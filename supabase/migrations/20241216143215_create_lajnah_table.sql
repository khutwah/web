CREATE TABLE lajnah (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL,
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP DEFAULT NULL,
    session_type VARCHAR(255) NOT NULL,
    session_name VARCHAR(255) DEFAULT NULL,
    start_surah_number SMALLINT DEFAULT NULL,
    start_verse_number SMALLINT DEFAULT NULL,
    end_surah_number SMALLINT DEFAULT NULL,
    end_verse_number SMALLINT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    low_mistake_count SMALLINT DEFAULT NULL,
    medium_mistake_count SMALLINT DEFAULT NULL,
    high_mistake_count SMALLINT DEFAULT NULL,
    parent_lajnah_id BIGINT DEFAULT NULL,
    final_mark VARCHAR DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (parent_lajnah_id) REFERENCES lajnah(id)
);



CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lajnah_updated_at
BEFORE UPDATE ON lajnah
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
