alter table "public"."assessments" add column "session_range_id" smallint;

alter table "public"."assessments" alter column "high_mistake_count" set default 0;

alter table "public"."assessments" alter column "high_mistake_count" set not null;

alter table "public"."assessments" alter column "low_mistake_count" set default 0;

alter table "public"."assessments" alter column "low_mistake_count" set not null;

alter table "public"."assessments" alter column "medium_mistake_count" set default 0;

alter table "public"."assessments" alter column "medium_mistake_count" set not null;


