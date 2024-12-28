BEGIN;

ALTER TABLE activities
ADD COLUMN page_count FLOAT4;

UPDATE activities
SET
  page_count = CAST(page_amount AS FLOAT4);

ALTER TABLE activities
DROP COLUMN page_amount;

COMMIT;
