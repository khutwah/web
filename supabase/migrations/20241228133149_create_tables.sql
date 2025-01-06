CREATE TABLE "public"."users" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "email" CHARACTER VARYING NOT NULL UNIQUE,
  "name" CHARACTER VARYING,
  "role" SMALLINT,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "sb_user_id" UUID,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (id)
);

CREATE TABLE "public"."circles" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "name" CHARACTER VARYING,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "academic_year" CHARACTER VARYING(9) NOT NULL,
  "label" CHARACTER VARYING(50),
  "grade" SMALLINT NOT NULL DEFAULT 7,
  "target_page_count" SMALLINT,
  PRIMARY KEY (id)
);

CREATE TABLE "public"."tags" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "name" CHARACTER VARYING,
  "category" CHARACTER VARYING,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE "public"."students" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "name" CHARACTER VARYING,
  "circle_id" BIGINT,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "parent_id" BIGINT,
  "nisn" CHARACTER VARYING UNIQUE,
  "nis" CHARACTER VARYING UNIQUE,
  "virtual_account" CHARACTER VARYING(50) UNIQUE,
  "pin" CHARACTER(6),
  "target_page_count" SMALLINT,
  PRIMARY KEY (id),
  FOREIGN KEY (circle_id) REFERENCES circles (id),
  FOREIGN KEY (parent_id) REFERENCES users (id)
);

CREATE TABLE "public"."shifts" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "circle_id" BIGINT,
  "start_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITHOUT TIME ZONE,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "ustadz_id" BIGINT,
  "location" CHARACTER VARYING,
  PRIMARY KEY (id),
  FOREIGN KEY (circle_id) REFERENCES circles (id),
  FOREIGN KEY (ustadz_id) REFERENCES users (id)
);

CREATE TABLE "public"."activities" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "student_id" BIGINT,
  "type" SMALLINT,
  "notes" TEXT,
  "is_target_achieved" BOOLEAN,
  "tags" JSONB,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "shift_id" BIGINT,
  "created_by" BIGINT,
  "start_surah" SMALLINT,
  "end_surah" SMALLINT,
  "start_verse" SMALLINT,
  "end_verse" SMALLINT,
  "status" CHARACTER VARYING NOT NULL DEFAULT 'draft',
  "student_attendance" CHARACTER VARYING NOT NULL DEFAULT 'present',
  "page_count" REAL,
  "target_page_count" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (shift_id) REFERENCES shifts (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);

CREATE TABLE "public"."assessments" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "student_id" BIGINT NOT NULL,
  "ustadz_id" BIGINT NOT NULL,
  "start_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITHOUT TIME ZONE,
  "session_type" CHARACTER VARYING(255),
  "session_name" CHARACTER VARYING(255),
  "session_range_id" SMALLINT,
  "notes" TEXT,
  "low_mistake_count" SMALLINT NOT NULL DEFAULT 0,
  "medium_mistake_count" SMALLINT NOT NULL DEFAULT 0,
  "high_mistake_count" SMALLINT NOT NULL DEFAULT 0,
  "parent_assessment_id" BIGINT,
  "final_mark" CHARACTER VARYING,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "surah_range" JSONB,
  PRIMARY KEY (id),
  FOREIGN KEY (parent_assessment_id) REFERENCES assessments (id),
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (ustadz_id) REFERENCES users (id)
);

CREATE TABLE "public"."checkpoints" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  "student_id" BIGINT NOT NULL,
  "start_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITHOUT TIME ZONE,
  "page_count_accumulation" REAL,
  "last_activity_id" BIGINT,
  "assessment_id" BIGINT,
  "part_count" REAL,
  "status" CHARACTER VARYING NOT NULL,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  "notes" CHARACTER VARYING,
  PRIMARY KEY (id),
  FOREIGN KEY (last_activity_id) REFERENCES activities (id),
  FOREIGN KEY (assessment_id) REFERENCES assessments (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);
