BEGIN;

CREATE SCHEMA IF NOT EXISTS courses;
SET search_path TO courses;

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  exam_period VARCHAR(20),
  instructor_id INTEGER NOT NULL,
  institution_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grade_batch (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses.course(id) ON DELETE CASCADE,
  uploader_id INTEGER NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(20) NOT NULL CHECK (type IN ('INITIAL', 'FINAL'))
);

CREATE INDEX idx_course_instructor ON course(instructor_id);
CREATE INDEX idx_grade_batch_course ON grade_batch(course_id);

COMMIT;
