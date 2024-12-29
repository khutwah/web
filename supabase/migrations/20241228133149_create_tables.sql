create table "public"."activities" (
  "id" bigint generated always as identity not null,
  "student_id" bigint,
  "type" smallint,
  "notes" text,
  "is_target_achieved" boolean,
  "tags" jsonb,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "shift_id" bigint,
  "created_by" bigint,
  "start_surah" smallint,
  "end_surah" smallint,
  "start_verse" smallint,
  "end_verse" smallint,
  "status" character varying not null default 'draft'::character varying,
  "student_attendance" character varying not null default 'present'::character varying,
  "page_count" real,
  "target_page_count" real not null default 0
);

create table "public"."assessments" (
  "id" bigint generated always as identity not null,
  "student_id" bigint not null,
  "ustadz_id" bigint not null,
  "start_date" timestamp without time zone not null,
  "end_date" timestamp without time zone,
  "session_type" character varying(255),
  "session_name" character varying(255),
  "notes" text,
  "low_mistake_count" smallint,
  "medium_mistake_count" smallint,
  "high_mistake_count" smallint,
  "parent_assessment_id" bigint,
  "final_mark" character varying,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "surah_range" jsonb
);

create table "public"."checkpoints" (
  "id" bigint generated always as identity not null,
  "student_id" bigint not null,
  "start_date" timestamp without time zone not null,
  "end_date" timestamp without time zone,
  "page_count_accumulation" real,
  "last_activity_id" bigint,
  "part_count" real,
  "status" character varying not null,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "notes" character varying
);

create table "public"."circles" (
  "id" bigint generated always as identity not null,
  "name" character varying,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "academic_year" smallint,
  "label" character varying(50),
  "grade" character varying,
  "target_page_count" real not null default 0
);

create table "public"."shifts" (
  "id" bigint generated always as identity not null,
  "circle_id" bigint,
  "start_date" timestamp without time zone not null,
  "end_date" timestamp without time zone,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "ustadz_id" bigint,
  "location" character varying
);

create table "public"."students" (
  "id" bigint generated always as identity not null,
  "name" character varying,
  "circle_id" bigint,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "parent_id" bigint,
  "nisn" character varying,
  "nis" character varying,
  "virtual_account" character varying(50),
  "pin" character(6),
  "target_page_count" real not null default 0
);

create table "public"."tags" (
  "id" bigint generated always as identity not null,
  "name" character varying,
  "category" character varying,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now()
);

create table "public"."users" (
  "email" character varying not null,
  "name" character varying,
  "role" smallint,
  "created_at" timestamp without time zone default now(),
  "updated_at" timestamp without time zone default now(),
  "id" bigint generated always as identity not null,
  "sb_user_id" uuid
);

CREATE UNIQUE INDEX activities_pkey ON public.activities USING btree (id);

CREATE UNIQUE INDEX assessments_pkey ON public.assessments USING btree (id);

CREATE UNIQUE INDEX checkpoint_pkey ON public.checkpoints USING btree (id);

CREATE UNIQUE INDEX circles_pkey ON public.circles USING btree (id);

CREATE UNIQUE INDEX shifts_pkey ON public.shifts USING btree (id);

CREATE UNIQUE INDEX students_nis_unique ON public.students USING btree (nis);

CREATE UNIQUE INDEX students_nisn_unique ON public.students USING btree (nisn);

CREATE UNIQUE INDEX students_virtual_account_unique ON public.students USING btree (virtual_account);

CREATE UNIQUE INDEX students_pkey ON public.students USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX users_email_unique ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."activities"
add constraint "activities_pkey" PRIMARY KEY using index "activities_pkey";

alter table "public"."assessments"
add constraint "assessments_pkey" PRIMARY KEY using index "assessments_pkey";

alter table "public"."checkpoints"
add constraint "checkpoint_pkey" PRIMARY KEY using index "checkpoint_pkey";

alter table "public"."circles"
add constraint "circles_pkey" PRIMARY KEY using index "circles_pkey";

alter table "public"."shifts"
add constraint "shifts_pkey" PRIMARY KEY using index "shifts_pkey";

alter table "public"."students"
add constraint "students_pkey" PRIMARY KEY using index "students_pkey";

alter table "public"."tags"
add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."users"
add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."activities"
add constraint "activities_created_by_fk" FOREIGN KEY (created_by) REFERENCES users (id) not valid;

alter table "public"."activities" validate constraint "activities_created_by_fk";

alter table "public"."activities"
add constraint "activities_shift_id_fkey" FOREIGN KEY (shift_id) REFERENCES shifts (id) not valid;

alter table "public"."activities" validate constraint "activities_shift_id_fkey";

alter table "public"."activities"
add constraint "activities_student_id_fkey" FOREIGN KEY (student_id) REFERENCES students (id) not valid;

alter table "public"."activities" validate constraint "activities_student_id_fkey";

alter table "public"."assessments"
add constraint "assessments_parent_assessment_id_fkey" FOREIGN KEY (parent_assessment_id) REFERENCES assessments (id) not valid;

alter table "public"."assessments" validate constraint "assessments_parent_assessment_id_fkey";

alter table "public"."assessments"
add constraint "assessments_student_id_fkey" FOREIGN KEY (student_id) REFERENCES students (id) not valid;

alter table "public"."assessments" validate constraint "assessments_student_id_fkey";

alter table "public"."assessments"
add constraint "assessments_ustadz_id_fkey" FOREIGN KEY (ustadz_id) REFERENCES users (id) not valid;

alter table "public"."assessments" validate constraint "assessments_ustadz_id_fkey";

alter table "public"."checkpoints"
add constraint "checkpoint_last_activity_id_fkey" FOREIGN KEY (last_activity_id) REFERENCES activities (id) not valid;

alter table "public"."checkpoints" validate constraint "checkpoint_last_activity_id_fkey";

alter table "public"."checkpoints"
add constraint "checkpoint_student_id_fkey" FOREIGN KEY (student_id) REFERENCES students (id) not valid;

alter table "public"."checkpoints" validate constraint "checkpoint_student_id_fkey";

alter table "public"."shifts"
add constraint "shifts_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES circles (id) not valid;

alter table "public"."shifts" validate constraint "shifts_circle_id_fkey";

alter table "public"."shifts"
add constraint "shifts_ustadz_id_fk" FOREIGN KEY (ustadz_id) REFERENCES users (id) not valid;

alter table "public"."shifts" validate constraint "shifts_ustadz_id_fk";

alter table "public"."students"
add constraint "students_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES circles (id) not valid;

alter table "public"."students" validate constraint "students_circle_id_fkey";

alter table "public"."students"
add constraint "students_parent_id_fk" FOREIGN KEY (parent_id) REFERENCES users (id) not valid;

alter table "public"."students" validate constraint "students_parent_id_fk";

alter table "public"."students"
add constraint "students_nisn_unique" UNIQUE using index "students_nisn_unique";

alter table "public"."students"
add constraint "students_nis_unique" UNIQUE using index "students_nis_unique";

alter table "public"."students"
add constraint "students_virtual_account_unique" UNIQUE using index "students_virtual_account_unique";

alter table "public"."users"
add constraint "users_email_unique" UNIQUE using index "users_email_unique";

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.update_assessment_updated_at () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

grant delete on table "public"."activities" to "anon";

grant insert on table "public"."activities" to "anon";

grant references on table "public"."activities" to "anon";

grant
select
  on table "public"."activities" to "anon";

grant trigger on table "public"."activities" to "anon";

grant
truncate on table "public"."activities" to "anon";

grant
update on table "public"."activities" to "anon";

grant delete on table "public"."activities" to "authenticated";

grant insert on table "public"."activities" to "authenticated";

grant references on table "public"."activities" to "authenticated";

grant
select
  on table "public"."activities" to "authenticated";

grant trigger on table "public"."activities" to "authenticated";

grant
truncate on table "public"."activities" to "authenticated";

grant
update on table "public"."activities" to "authenticated";

grant delete on table "public"."activities" to "service_role";

grant insert on table "public"."activities" to "service_role";

grant references on table "public"."activities" to "service_role";

grant
select
  on table "public"."activities" to "service_role";

grant trigger on table "public"."activities" to "service_role";

grant
truncate on table "public"."activities" to "service_role";

grant
update on table "public"."activities" to "service_role";

grant delete on table "public"."assessments" to "anon";

grant insert on table "public"."assessments" to "anon";

grant references on table "public"."assessments" to "anon";

grant
select
  on table "public"."assessments" to "anon";

grant trigger on table "public"."assessments" to "anon";

grant
truncate on table "public"."assessments" to "anon";

grant
update on table "public"."assessments" to "anon";

grant delete on table "public"."assessments" to "authenticated";

grant insert on table "public"."assessments" to "authenticated";

grant references on table "public"."assessments" to "authenticated";

grant
select
  on table "public"."assessments" to "authenticated";

grant trigger on table "public"."assessments" to "authenticated";

grant
truncate on table "public"."assessments" to "authenticated";

grant
update on table "public"."assessments" to "authenticated";

grant delete on table "public"."assessments" to "service_role";

grant insert on table "public"."assessments" to "service_role";

grant references on table "public"."assessments" to "service_role";

grant
select
  on table "public"."assessments" to "service_role";

grant trigger on table "public"."assessments" to "service_role";

grant
truncate on table "public"."assessments" to "service_role";

grant
update on table "public"."assessments" to "service_role";

grant delete on table "public"."checkpoints" to "anon";

grant insert on table "public"."checkpoints" to "anon";

grant references on table "public"."checkpoints" to "anon";

grant
select
  on table "public"."checkpoints" to "anon";

grant trigger on table "public"."checkpoints" to "anon";

grant
truncate on table "public"."checkpoints" to "anon";

grant
update on table "public"."checkpoints" to "anon";

grant delete on table "public"."checkpoints" to "authenticated";

grant insert on table "public"."checkpoints" to "authenticated";

grant references on table "public"."checkpoints" to "authenticated";

grant
select
  on table "public"."checkpoints" to "authenticated";

grant trigger on table "public"."checkpoints" to "authenticated";

grant
truncate on table "public"."checkpoints" to "authenticated";

grant
update on table "public"."checkpoints" to "authenticated";

grant delete on table "public"."checkpoints" to "service_role";

grant insert on table "public"."checkpoints" to "service_role";

grant references on table "public"."checkpoints" to "service_role";

grant
select
  on table "public"."checkpoints" to "service_role";

grant trigger on table "public"."checkpoints" to "service_role";

grant
truncate on table "public"."checkpoints" to "service_role";

grant
update on table "public"."checkpoints" to "service_role";

grant delete on table "public"."circles" to "anon";

grant insert on table "public"."circles" to "anon";

grant references on table "public"."circles" to "anon";

grant
select
  on table "public"."circles" to "anon";

grant trigger on table "public"."circles" to "anon";

grant
truncate on table "public"."circles" to "anon";

grant
update on table "public"."circles" to "anon";

grant delete on table "public"."circles" to "authenticated";

grant insert on table "public"."circles" to "authenticated";

grant references on table "public"."circles" to "authenticated";

grant
select
  on table "public"."circles" to "authenticated";

grant trigger on table "public"."circles" to "authenticated";

grant
truncate on table "public"."circles" to "authenticated";

grant
update on table "public"."circles" to "authenticated";

grant delete on table "public"."circles" to "service_role";

grant insert on table "public"."circles" to "service_role";

grant references on table "public"."circles" to "service_role";

grant
select
  on table "public"."circles" to "service_role";

grant trigger on table "public"."circles" to "service_role";

grant
truncate on table "public"."circles" to "service_role";

grant
update on table "public"."circles" to "service_role";

grant delete on table "public"."shifts" to "anon";

grant insert on table "public"."shifts" to "anon";

grant references on table "public"."shifts" to "anon";

grant
select
  on table "public"."shifts" to "anon";

grant trigger on table "public"."shifts" to "anon";

grant
truncate on table "public"."shifts" to "anon";

grant
update on table "public"."shifts" to "anon";

grant delete on table "public"."shifts" to "authenticated";

grant insert on table "public"."shifts" to "authenticated";

grant references on table "public"."shifts" to "authenticated";

grant
select
  on table "public"."shifts" to "authenticated";

grant trigger on table "public"."shifts" to "authenticated";

grant
truncate on table "public"."shifts" to "authenticated";

grant
update on table "public"."shifts" to "authenticated";

grant delete on table "public"."shifts" to "service_role";

grant insert on table "public"."shifts" to "service_role";

grant references on table "public"."shifts" to "service_role";

grant
select
  on table "public"."shifts" to "service_role";

grant trigger on table "public"."shifts" to "service_role";

grant
truncate on table "public"."shifts" to "service_role";

grant
update on table "public"."shifts" to "service_role";

grant delete on table "public"."students" to "anon";

grant insert on table "public"."students" to "anon";

grant references on table "public"."students" to "anon";

grant
select
  on table "public"."students" to "anon";

grant trigger on table "public"."students" to "anon";

grant
truncate on table "public"."students" to "anon";

grant
update on table "public"."students" to "anon";

grant delete on table "public"."students" to "authenticated";

grant insert on table "public"."students" to "authenticated";

grant references on table "public"."students" to "authenticated";

grant
select
  on table "public"."students" to "authenticated";

grant trigger on table "public"."students" to "authenticated";

grant
truncate on table "public"."students" to "authenticated";

grant
update on table "public"."students" to "authenticated";

grant delete on table "public"."students" to "service_role";

grant insert on table "public"."students" to "service_role";

grant references on table "public"."students" to "service_role";

grant
select
  on table "public"."students" to "service_role";

grant trigger on table "public"."students" to "service_role";

grant
truncate on table "public"."students" to "service_role";

grant
update on table "public"."students" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant
select
  on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant
truncate on table "public"."tags" to "anon";

grant
update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant
select
  on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant
truncate on table "public"."tags" to "authenticated";

grant
update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant
select
  on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant
truncate on table "public"."tags" to "service_role";

grant
update on table "public"."tags" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant
select
  on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant
truncate on table "public"."users" to "anon";

grant
update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant
select
  on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant
truncate on table "public"."users" to "authenticated";

grant
update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant
select
  on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant
truncate on table "public"."users" to "service_role";

grant
update on table "public"."users" to "service_role";

CREATE TRIGGER update_assessment_updated_at BEFORE
UPDATE ON public.assessments FOR EACH ROW
EXECUTE FUNCTION update_assessment_updated_at ();
