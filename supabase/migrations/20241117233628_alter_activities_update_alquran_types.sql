ALTER TABLE activities
ADD COLUMN start_surah_new SMALLINT,
ADD COLUMN end_surah_new SMALLINT,
ADD COLUMN start_verse_new SMALLINT,
ADD COLUMN end_verse_new SMALLINT;

UPDATE activities
SET
  start_surah_new = CAST(start_surah AS SMALLINT),
  end_surah_new = CAST(end_surah AS SMALLINT),
  start_verse_new = CAST(start_verse AS SMALLINT),
  end_verse_new = CAST(end_verse AS SMALLINT);

ALTER TABLE activities
DROP COLUMN start_surah,
DROP COLUMN end_surah,
DROP COLUMN start_verse,
DROP COLUMN end_verse;

ALTER TABLE activities
RENAME COLUMN start_surah_new TO start_surah;

ALTER TABLE activities
RENAME COLUMN end_surah_new TO end_surah;

ALTER TABLE activities
RENAME COLUMN start_verse_new TO start_verse;

ALTER TABLE activities
RENAME COLUMN end_verse_new TO end_verse;
