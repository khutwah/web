WITH
  latestcheckpoint AS (
    SELECT
      checkpoints.student_id,
      checkpoints.id AS checkpoint_id,
      checkpoints.status AS checkpoint_status
    FROM
      checkpoints
    WHERE
      (
        (checkpoints.student_id, checkpoints.id) IN (
          SELECT
            checkpoints_1.student_id,
            max(checkpoints_1.id) AS max
          FROM
            checkpoints checkpoints_1
          GROUP BY
            checkpoints_1.student_id
        )
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
  (
    (
      students s
      LEFT JOIN circles c ON ((s.circle_id = c.id))
    )
    LEFT JOIN latestcheckpoint lc ON ((s.id = lc.student_id))
  );
