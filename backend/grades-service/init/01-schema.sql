CREATE TYPE grade_type AS ENUM ('INITIAL', 'FINAL');
CREATE TYPE grade_status AS ENUM ('VOID', 'OPEN', 'FINAL');

CREATE TABLE grade_batch (
    id              SERIAL PRIMARY KEY,
    course_id       INTEGER      NOT NULL,
    uploader_id     INTEGER      NOT NULL,
    type            grade_type   NOT NULL,
    original_file   VARCHAR(120),
    rows_parsed     INTEGER,
    uploaded_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    academic_year   SMALLINT GENERATED ALWAYS AS (EXTRACT(YEAR FROM uploaded_at)) STORED
);

CREATE TABLE grade (
    id                 SERIAL PRIMARY KEY,
    type               grade_type     NOT NULL DEFAULT 'INITIAL',
    value              INTEGER        NOT NULL CHECK (value BETWEEN 0 AND 100),
    status             grade_status   NOT NULL DEFAULT 'VOID',
    uploaded_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detailed_grade_json JSONB,
    user_am            INTEGER        NOT NULL,
    course_id          INTEGER        NOT NULL,
    grade_batch_id     INTEGER
);
