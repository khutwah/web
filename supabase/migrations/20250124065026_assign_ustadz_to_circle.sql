CREATE
OR REPLACE FUNCTION assign_ustadz_to_circle_by_name (
  p_ustadz_name CHARACTER VARYING,
  p_circle_name CHARACTER VARYING,
  p_start_date TIMESTAMP DEFAULT NOW(),
  p_end_date TIMESTAMP DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    p_ustadz_id BIGINT;
    p_circle_id BIGINT;
    p_adjusted_end_date TIMESTAMP;
BEGIN
    -- Find ustadz_id based on ustadz_name
    SELECT id INTO p_ustadz_id
    FROM users
    WHERE name ILIKE '%' || p_ustadz_name || '%'
    LIMIT 2;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No ustadz found with name similar to %', p_ustadz_name;
    ELSIF (SELECT COUNT(*) FROM users WHERE name ILIKE '%' || p_ustadz_name || '%') > 1 THEN
        RAISE EXCEPTION 'Multiple ustadz found with name similar to %. Please refine your search.', p_ustadz_name;
    END IF;

    -- Find circle_id based on circle_name
    SELECT id INTO p_circle_id
    FROM circles
    WHERE name ILIKE '%' || p_circle_name || '%'
    LIMIT 2;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No circle found with name similar to %', p_circle_name;
    ELSIF (SELECT COUNT(*) FROM circles WHERE name ILIKE '%' || p_circle_name || '%') > 1 THEN
        RAISE EXCEPTION 'Multiple circles found with name similar to %. Please refine your search.', p_circle_name;
    END IF;

    -- Set end_date to the end of the day (11 PM GMT+7) if NULL
    IF p_end_date IS NULL THEN
        p_adjusted_end_date := date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day' - INTERVAL '1 second' - INTERVAL '7 hours';
    ELSE
        p_adjusted_end_date := p_end_date + INTERVAL '16 hours'; -- Convert end_date to 4 PM UTC
    END IF;

    -- Check if the ustadz is trying to assign a temporary shift to their default circle
    IF EXISTS (
        SELECT 1
        FROM shifts
        WHERE ustadz_id = p_ustadz_id
          AND circle_id = p_circle_id
          AND end_date IS NULL
    ) THEN
        RAISE EXCEPTION 'This ustadz already has a default shift for the specified circle.';
    END IF;

    -- Check for default shift (end_date IS NULL)
    IF p_adjusted_end_date IS NULL THEN
        IF EXISTS (
            SELECT 1
            FROM shifts
            WHERE ustadz_id = p_ustadz_id AND end_date IS NULL
        ) THEN
            RAISE EXCEPTION 'This ustadz already has a default shift. Update the existing one instead.';
        END IF;
    END IF;

    -- Check if the circle is already assigned to another temporary shift for the same ustadz
    IF p_adjusted_end_date IS NOT NULL THEN
        IF EXISTS (
            SELECT 1
            FROM shifts
            WHERE circle_id = p_circle_id
              AND ustadz_id = p_ustadz_id
              AND (
                  (start_date, COALESCE(end_date, TIMESTAMP '9999-12-31')) OVERLAPS (p_start_date, p_adjusted_end_date)
              )
        ) THEN
            RAISE EXCEPTION 'The circle is already assigned to another temporary shift during the specified period.';
        END IF;
    END IF;

    -- Insert the new shift
    INSERT INTO shifts (circle_id, ustadz_id, start_date, end_date, created_at, updated_at, location)
    VALUES (p_circle_id, p_ustadz_id, p_start_date, p_adjusted_end_date, NOW(), NOW(), NULL);

    RAISE NOTICE 'Shift assigned successfully for ustadz "%", circle "%"', p_ustadz_name, p_circle_name;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION remove_temporary_shifts_by_ustadz_name (p_ustadz_name CHARACTER VARYING) RETURNS VOID AS $$
DECLARE
    p_ustadz_id BIGINT;
BEGIN
    -- Find ustadz_id based on ustadz_name
    SELECT id INTO p_ustadz_id
    FROM users
    WHERE name ILIKE '%' || p_ustadz_name || '%'
    LIMIT 2;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No ustadz found with name similar to %', p_ustadz_name;
    ELSIF (SELECT COUNT(*) FROM users WHERE name ILIKE '%' || p_ustadz_name || '%') > 1 THEN
        RAISE EXCEPTION 'Multiple ustadz found with name similar to %. Please refine your search.', p_ustadz_name;
    END IF;

    -- Delete all temporary shifts (shifts with end_date IS NOT NULL) for the ustadz
    DELETE FROM shifts
    WHERE ustadz_id = p_ustadz_id
      AND end_date IS NOT NULL;

    RAISE NOTICE 'All temporary shifts removed for ustadz "%".', p_ustadz_name;
END;
$$ LANGUAGE plpgsql;
