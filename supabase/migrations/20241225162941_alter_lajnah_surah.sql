BEGIN;

-- Step 1: Add the new column 'surah_range'
ALTER TABLE lajnah
ADD COLUMN surah_range JSONB;

-- Step 2: Populate 'surah_range' with transformed values from the old columns
UPDATE lajnah
SET
  surah_range = JSONB_BUILD_ARRAY(
    CASE
      WHEN end_surah IS NULL
      OR end_verse IS NULL THEN JSONB_BUILD_ARRAY(CONCAT(start_surah, ':', start_verse))
      ELSE JSONB_BUILD_ARRAY(
        CONCAT(start_surah, ':', start_verse),
        CONCAT(end_surah, ':', end_verse)
      )
    END
  );

-- Step 3: Drop the old columns
ALTER TABLE lajnah
DROP COLUMN start_surah,
DROP COLUMN end_surah,
DROP COLUMN start_verse,
DROP COLUMN end_verse;

COMMIT;
