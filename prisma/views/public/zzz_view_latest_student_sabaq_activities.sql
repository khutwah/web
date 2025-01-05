SELECT
  a.id,
  a.student_id,
  a.type,
  a.notes,
  a.is_target_achieved,
  a.tags,
  a.created_at,
  a.updated_at,
  a.shift_id,
  a.created_by,
  a.start_surah,
  a.end_surah,
  a.start_verse,
  a.end_verse,
  a.status,
  a.student_attendance,
  a.page_count,
  a.target_page_count,
  s.parent_id
FROM
  (
    (
      activities a
      JOIN students s ON ((a.student_id = s.id))
    )
    JOIN users u ON ((s.parent_id = u.id))
  )
WHERE
  (
    (
      a.id IN (
        SELECT
          max(activities.id) AS max
        FROM
          activities
        WHERE
          (
            (activities.type = 1)
            AND (
              (activities.student_attendance) :: text = 'present' :: text
            )
          )
        GROUP BY
          activities.student_id
      )
    )
    AND (u.is_active = TRUE)
  );