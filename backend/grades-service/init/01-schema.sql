-- Only schema for grades-service

-- ENUMs
CREATE TYPE grade_status AS ENUM ('VOID', 'OPEN', 'FINAL');
CREATE TYPE grade_type AS ENUM ('INITIAL', 'FINAL');

-- Supporting minimal users & course tables (foreign key only)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  am INTEGER UNIQUE NOT NULL
);

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  title VARCHAR(50) NOT NULL
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
  status grade_status NOT NULL DEFAULT 'VOID',
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

-- Triggers
CREATE OR REPLACE FUNCTION fn_refresh_grade_stats() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  WITH stats AS (
    SELECT g.course_id, g.type,
           AVG(g.value)::NUMERIC(5,2) AS mean,
           PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY g.value)::NUMERIC(5,2) AS median,
           STDDEV_POP(g.value)::NUMERIC(5,2) AS std_dev
    FROM grade g
    WHERE g.course_id = NEW.course_id AND g.type = NEW.type
    GROUP BY g.course_id, g.type
  )
  INSERT INTO grade_statistic (course_id, type, mean, median, std_dev)
  SELECT course_id, type, mean, median, std_dev FROM stats
  ON CONFLICT (course_id, type)
  DO UPDATE SET mean=EXCLUDED.mean, median=EXCLUDED.median, std_dev=EXCLUDED.std_dev, generated_at=CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tg_grade_aiud_refresh_stats
AFTER INSERT OR UPDATE OR DELETE ON grade
FOR EACH ROW EXECUTE FUNCTION fn_refresh_grade_stats();
