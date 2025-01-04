CREATE VIEW zzz_view_latest_student_sabaq_activities AS
SELECT
  a.*,
  s.parent_id
FROM
  activities a
  INNER JOIN students s ON a.student_id = s.id
  INNER JOIN users u ON s.parent_id = u.id
WHERE
  a.id IN (
    SELECT
      MAX(id)
    FROM
      activities
    WHERE
      type = 1
      AND student_attendance = 'present'
    GROUP BY
      student_id
  )
  AND u.is_active = true;
