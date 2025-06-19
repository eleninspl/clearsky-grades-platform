CREATE SCHEMA IF NOT EXISTS clearsky;

CREATE TABLE clearsky.course (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  instructor_id INTEGER NOT NULL,
  institution_id INTEGER NOT NULL,
  exam_period VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clearsky.grade_batch (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  uploader_id INTEGER NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(20) NOT NULL
);

CREATE TABLE clearsky.grade (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  grade_batch_id INTEGER NOT NULL,
  value INTEGER,
  status VARCHAR(20),
  detailed_grade_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
