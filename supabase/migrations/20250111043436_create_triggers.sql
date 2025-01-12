CREATE
OR REPLACE FUNCTION track_student_circle_changes () RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO student_circles_history (student_id, previous_circle_id, circle_id)
  VALUES (NEW.id, OLD.circle_id, NEW.circle_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_student_circle_changes
AFTER INSERT
OR
UPDATE ON students FOR EACH ROW WHEN (NEW.circle_id IS NOT NULL)
EXECUTE FUNCTION track_student_circle_changes ();
