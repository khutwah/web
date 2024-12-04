CREATE TABLE checkpoint (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP DEFAULT NULL,
    page_count_accumulation FLOAT4 NOT NULL,
    last_activity_id BIGINT NOT NULL,
    part_count FLOAT4,
    status VARCHAR NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (last_activity_id) REFERENCES activities(id)
    );


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_checkpoint_updated_at
BEFORE UPDATE ON checkpoint
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
