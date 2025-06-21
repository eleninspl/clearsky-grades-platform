-- SQLBook: Code
-- Only schema for grades-service

-- ENUMs

CREATE TYPE user_role AS ENUM ('STUDENT', 'INSTRUCTOR', 'INST_REP', 'ADMIN');
CREATE TYPE grade_type AS ENUM ('INITIAL', 'FINAL');
CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE', 'INSTITUTION');

CREATE TABLE institution (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL,
    email           VARCHAR(80)  NOT NULL UNIQUE,
    credits_balance INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
); 

-- Supporting minimal users & course tables (foreign key only)
CREATE TABLE users (
    id             SERIAL PRIMARY KEY,
    username       VARCHAR(30)   NOT NULL UNIQUE,
    email          VARCHAR(80)   NOT NULL UNIQUE,
    full_name      VARCHAR(80)   NOT NULL,
    role           user_role     NOT NULL,
    external_id    INTEGER,
    am             INTEGER,
    institution_id INTEGER,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_am UNIQUE (am),
    CONSTRAINT fk_user_institution FOREIGN KEY (institution_id)
        REFERENCES institution(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE auth_account (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER       NOT NULL,
    provider        auth_provider NOT NULL,
    provider_uid    VARCHAR(128)  NOT NULL,        -- Google sub, eppn, local username etc.
    password_hash   VARCHAR(255),                  -- filled only when provider='LOCAL'
    password_salt   VARCHAR(255),
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login      TIMESTAMP,
    CONSTRAINT fk_auth_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_provider_uid UNIQUE (provider, provider_uid)
);
CREATE INDEX idx_auth_user ON auth_account (user_id);

CREATE TABLE course (
    id             SERIAL PRIMARY KEY,
    code           VARCHAR(10)  NOT NULL UNIQUE,
    title          VARCHAR(50)  NOT NULL,
    exam_period    VARCHAR(20),
    description    TEXT,
    instructor_id  INTEGER      NOT NULL,
    institution_id INTEGER      NOT NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_instructor  FOREIGN KEY (instructor_id)  REFERENCES users(id),
    CONSTRAINT fk_course_institution FOREIGN KEY (institution_id) REFERENCES institution(id)
);

-- Grade batches
CREATE TABLE grade_batch (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  uploader_id INTEGER NOT NULL,
  type grade_type NOT NULL,
  original_file VARCHAR(120),
  rows_parsed INTEGER,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  academic_year SMALLINT GENERATED ALWAYS AS (EXTRACT(YEAR FROM uploaded_at)) STORED
);

-- Grade statistics
CREATE TABLE grade_statistic (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  type grade_type NOT NULL,
  mean NUMERIC(5,2),
  median NUMERIC(5,2),
  std_dev NUMERIC(5,2),
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Grade records
CREATE TABLE grade (
  id SERIAL PRIMARY KEY,
  type grade_type NOT NULL DEFAULT 'INITIAL',
  value INTEGER NOT NULL CHECK (value BETWEEN 0 AND 100),
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  detailed_grade_json JSONB,
  user_am INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade_batch_id INTEGER,
  grade_statistic_id INTEGER,
  CONSTRAINT uq_grade_user_course_type UNIQUE (user_am, course_id, type)
);

-- FK constraints (optional: remove if isolating)
ALTER TABLE grade ADD FOREIGN KEY (user_am) REFERENCES users(am) ON DELETE CASCADE;
ALTER TABLE grade ADD FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE;
ALTER TABLE grade ADD FOREIGN KEY (grade_batch_id) REFERENCES grade_batch(id) ON DELETE CASCADE;
ALTER TABLE grade ADD FOREIGN KEY (grade_statistic_id) REFERENCES grade_statistic(id) ON DELETE SET NULL;
ALTER TABLE grade_batch ADD FOREIGN KEY (course_id) REFERENCES course(id);
ALTER TABLE grade_batch ADD FOREIGN KEY (uploader_id) REFERENCES users(id);
ALTER TABLE grade_statistic ADD FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE;
