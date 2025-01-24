CREATE
OR REPLACE FUNCTION call_draft_activities_all () RETURNS VOID AS $$
BEGIN
    -- Check if the current day is a weekend (Saturday or Sunday) in GMT+7
    IF EXTRACT(ISODOW FROM (CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7')) IN (6, 7) THEN
        RAISE NOTICE 'Skipping execution: Today is a weekend in GMT+7.';
        RETURN; -- Silently exit the function
    END IF;

    -- Perform the draft activities if not a weekend
    PERFORM draft_activities(1::SMALLINT);
    PERFORM draft_activities(2::SMALLINT);
    PERFORM draft_activities(3::SMALLINT);
END;
$$ LANGUAGE plpgsql;

-- Schedule the wrapper function
SELECT
  cron.schedule (
    'call-draft-activities-all',
    '0 16 * * *',
    'SELECT call_draft_activities_all();'
  );
