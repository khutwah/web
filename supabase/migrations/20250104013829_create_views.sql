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

CREATE VIEW zzz_view_latest_student_checkpoints AS
WITH
  LatestCheckpoint AS (
    SELECT
      student_id,
      id AS checkpoint_id,
      status AS checkpoint_status
    FROM
      checkpoints
    WHERE
      (student_id, id) IN (
        SELECT
          student_id,
          MAX(id)
        FROM
          checkpoints
        GROUP BY
          student_id
      )
  )
SELECT
  s.id AS student_id,
  s.name AS student_name,
  c.id AS circle_id,
  c.name AS circle_name,
  lc.checkpoint_id,
  lc.checkpoint_status
FROM
  students s
  LEFT JOIN circles c ON s.circle_id = c.id
  LEFT JOIN LatestCheckpoint lc ON s.id = lc.student_id;
