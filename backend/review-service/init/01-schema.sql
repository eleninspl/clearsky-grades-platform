-- ENUM Types
CREATE TYPE grade_type AS ENUM ('INITIAL', 'FINAL');
CREATE TYPE review_request_status AS ENUM ('PENDING', 'ANSWERED', 'CLOSED');
CREATE TYPE user_role AS ENUM ('STUDENT', 'INSTRUCTOR');

-- Snapshot Πίνακες (ανεξάρτητοι από grades-service)

CREATE TABLE user_snapshot (
    id         INTEGER PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    role       user_role     NOT NULL
);

CREATE TABLE course_snapshot (
    id             INTEGER PRIMARY KEY,
    title          VARCHAR(100) NOT NULL,
    code           VARCHAR(10),
    instructor_id  INTEGER NOT NULL REFERENCES user_snapshot(id),
    exam_period    VARCHAR(20)
);

CREATE TABLE institution_snapshot (
    id    INTEGER PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(100)
);

-- Βασικά tables για το Review Flow

CREATE TABLE review_request (
    id              SERIAL PRIMARY KEY,
    grade_id        INTEGER       NOT NULL UNIQUE, -- ID του βαθμού από άλλο service
    user_id         INTEGER       NOT NULL,        -- ID φοιτητή
    message         VARCHAR(256)  NOT NULL,

    -- Snapshot πεδία
    course_id       INTEGER,
    course_title    VARCHAR(100),
    student_name    VARCHAR(100),
    instructor_id   INTEGER,
    exam_period     VARCHAR(20),

    status          review_request_status NOT NULL DEFAULT 'PENDING',
    submitted_at    TIMESTAMP             NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review_response (
    id                SERIAL PRIMARY KEY,
    review_request_id INTEGER       NOT NULL UNIQUE,
    responder_id      INTEGER       NOT NULL,
    message           VARCHAR(256)  NOT NULL,
    final_grade       NUMERIC(5,2),             -- Αν προτείνεται αλλαγή
    response_date     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rr_response FOREIGN KEY (review_request_id)
        REFERENCES review_request(id) ON DELETE CASCADE
);

CREATE TABLE review_grade_snapshot (
    id                 SERIAL PRIMARY KEY,
    grade_id           INTEGER        NOT NULL UNIQUE,
    type               grade_type     NOT NULL DEFAULT 'INITIAL',
    value              NUMERIC(5,2)   NOT NULL CHECK (value BETWEEN 0 AND 100),
    detailed_grade_json JSONB,
    course_id          INTEGER,
    user_id            INTEGER,
    created_at         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_grade_rr FOREIGN KEY (grade_id)
        REFERENCES review_request(grade_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_rr_instructor ON review_request (instructor_id, status);
CREATE INDEX idx_rr_user ON review_request (user_id);
CREATE INDEX idx_rr_user_course ON review_request (user_id, course_id);
CREATE INDEX idx_rg_user_course ON review_grade_snapshot (user_id, course_id);

-- ✅ Success message
DO $$ BEGIN RAISE NOTICE '✅ review-service minimal schema loaded'; END $$;
