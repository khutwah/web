DO $$
BEGIN
    -- Check if the pg_cron extension is already installed
    IF NOT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'pg_cron'
    ) THEN
        CREATE EXTENSION pg_cron WITH SCHEMA pg_catalog;
    END IF;
END $$;

-- Grant usage on schema cron to postgres if not already granted
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.role_usage_grants
        WHERE grantee = 'postgres' AND object_schema = 'cron'
    ) THEN
        GRANT USAGE ON SCHEMA cron TO postgres;
    END IF;
END $$;

-- Grant all privileges on all tables in schema cron to postgres
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.role_table_grants
        WHERE grantee = 'postgres' AND table_schema = 'cron'
    ) THEN
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
    END IF;
END $$;
