CREATE
OR REPLACE FUNCTION call_draft_activities_all () RETURNS void AS $$
BEGIN
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
