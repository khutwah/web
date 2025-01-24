CREATE
OR REPLACE FUNCTION draft_activities (p_activity_type SMALLINT) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    p_rows_inserted INTEGER;
BEGIN
    -- Perform the INSERT operation and count the number of rows inserted
    WITH inserted_rows AS (
        INSERT INTO activities (
            student_id,
            type,
            student_attendance,
            status,
            notes,
            target_page_count,
            shift_id,
            created_by,
            tags
        )
        SELECT
            s.id AS student_id,
            p_activity_type AS type,           -- Use the parameter for activity type
            'absent' AS student_attendance,
            'draft' AS status,
            '' AS notes,
            CASE
                WHEN p_activity_type = 3 THEN 20  -- If type is 3, set target_page_count to 20
                ELSE 2                             -- Otherwise, set it to 2
            END AS target_page_count,
            sh.id AS shift_id,
            u.id AS created_by,
            '["otomatis"]'::JSONB AS tags
        FROM
            students s
        JOIN
            circles c ON s.circle_id = c.id
        JOIN
            shifts sh ON sh.circle_id = c.id
        JOIN
            users u ON sh.ustadz_id = u.id
        JOIN
            users p ON s.parent_id = p.id
        WHERE
            sh.start_date <= NOW()
            AND (sh.end_date IS NULL OR sh.end_date >= NOW())
            AND u.is_active = TRUE
            AND p.is_active = TRUE
            AND NOT EXISTS (
                SELECT 1
                FROM activities a
                WHERE a.student_id = s.id
                    AND a.created_at >= (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta')::DATE + INTERVAL '7 hours'
                    AND a.created_at <= NOW()
                    AND a.type = p_activity_type  -- Check for the provided type
            )
        RETURNING 1
    )
    SELECT COUNT(*) INTO p_rows_inserted FROM inserted_rows;

    -- Log the operation for debugging (optional)
    IF p_rows_inserted > 0 THEN
        RAISE NOTICE 'Inserted % rows for activity type %', p_rows_inserted, p_activity_type;
    ELSE
        RAISE NOTICE 'No rows inserted. All activities are up-to-date for activity type %', p_activity_type;
    END IF;
END;
$$;
